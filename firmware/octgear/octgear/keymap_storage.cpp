#include "keymap_storage.h"

#include <hardware/flash.h>
#include <hardware/sync.h>

#include "config.h"
#include "key_assignment.h"
#include "keymap.h"

extern uint8_t _FS_start;
extern uint8_t _FS_end;

namespace {

constexpr uint8_t STORAGE_MAGIC[4] = { 'C', 'M', '8', 'J' };
constexpr uint8_t STORAGE_SELF_TEST_MAGIC[4] = { 'C', 'M', '8', 'T' };
constexpr uint8_t STORAGE_VERSION = 5;
constexpr uint8_t LEGACY_STORAGE_VERSION_4 = 4;
constexpr uint8_t LEGACY_STORAGE_VERSION_3 = 3;
constexpr uint8_t LEGACY_STORAGE_VERSION_2 = 2;
constexpr uint8_t SLOT_COUNT = 3;
constexpr uint32_t SLOT_SIZE = FLASH_SECTOR_SIZE;
constexpr uint8_t ASSIGNMENT_RECORD_SIZE = 11;
constexpr uint8_t LAYER_COLOR_SIZE = 3;

constexpr int GENERATION_ADDRESS = 8;
constexpr int PAYLOAD_LENGTH_ADDRESS = 12;
constexpr int DEVICE_FLAGS_ADDRESS = 14;
constexpr uint8_t ENCODER_REVERSED_FLAG = 0x01;
constexpr uint8_t STATUS_LED_REVERSED_FLAG = 0x02;
constexpr uint8_t STATUS_KEY_ANIMATION_MASK = 0x0C;
constexpr uint8_t STATUS_KEY_ANIMATION_SHIFT = 2;
constexpr uint8_t STATUS_LAYER_DISPLAY_PATTERN_FLAG = 0x10;
constexpr int STATUS_LED_BRIGHTNESS_ADDRESS = 15;
constexpr int CRC_ADDRESS = 16;
constexpr int STORAGE_HEADER_SIZE = 20;
constexpr int ASSIGNMENTS_ADDRESS = STORAGE_HEADER_SIZE;
constexpr int ENABLED_LAYER_MASK_ADDRESS =
  ASSIGNMENTS_ADDRESS + (Config::LAYER_COUNT * Config::KEY_COUNT * ASSIGNMENT_RECORD_SIZE);
constexpr int LAYER_COLORS_ADDRESS = ENABLED_LAYER_MASK_ADDRESS + 1;
constexpr int LEGACY_STORAGE_DATA_SIZE =
  LAYER_COLORS_ADDRESS + (Config::LAYER_COUNT * LAYER_COLOR_SIZE);
constexpr int STATUS_KEY_ANIMATION_BRIGHTNESS_ADDRESS = LEGACY_STORAGE_DATA_SIZE;
constexpr int VERSION_4_STORAGE_DATA_SIZE =
  STATUS_KEY_ANIMATION_BRIGHTNESS_ADDRESS + 1;
constexpr int PERSISTENT_LAYER_ADDRESS = VERSION_4_STORAGE_DATA_SIZE;
constexpr int STORAGE_DATA_SIZE = PERSISTENT_LAYER_ADDRESS + 1;
constexpr int PROGRAM_SIZE = ((STORAGE_DATA_SIZE + FLASH_PAGE_SIZE - 1) / FLASH_PAGE_SIZE) * FLASH_PAGE_SIZE;

static_assert(STORAGE_DATA_SIZE <= static_cast<int>(SLOT_SIZE), "Keymap must fit in one flash sector");
static_assert(PROGRAM_SIZE <= static_cast<int>(SLOT_SIZE), "Program data must fit in one flash sector");

bool storageAvailable = false;
int8_t currentSlot = -1;
uint32_t currentGeneration = 0;
bool activeLayerSavePending = false;
uint32_t activeLayerChangedAtMs = 0;
uint8_t lastSavedActiveLayer = 0;

enum class SlotKind : uint8_t {
  Normal,
  SelfTest,
};

const uint8_t* magicForSlotKind(SlotKind kind) {
  return kind == SlotKind::SelfTest ? STORAGE_SELF_TEST_MAGIC : STORAGE_MAGIC;
}

int recordAddress(uint8_t layer, uint8_t keyIndex) {
  const int recordIndex = (layer * Config::KEY_COUNT) + keyIndex;
  return ASSIGNMENTS_ADDRESS + (recordIndex * ASSIGNMENT_RECORD_SIZE);
}

int layerColorAddress(uint8_t layer) {
  return LAYER_COLORS_ADDRESS + (layer * LAYER_COLOR_SIZE);
}

const uint8_t* slotData(uint8_t slot) {
  return reinterpret_cast<const uint8_t*>(&_FS_start) + (slot * SLOT_SIZE);
}

uint32_t slotFlashOffset(uint8_t slot) {
  return static_cast<uint32_t>(reinterpret_cast<uintptr_t>(slotData(slot)) - XIP_BASE);
}

uint16_t readUint16(const uint8_t* data, int address) {
  return static_cast<uint16_t>(data[address]) |
         (static_cast<uint16_t>(data[address + 1]) << 8);
}

uint32_t readUint32(const uint8_t* data, int address) {
  return static_cast<uint32_t>(data[address]) |
         (static_cast<uint32_t>(data[address + 1]) << 8) |
         (static_cast<uint32_t>(data[address + 2]) << 16) |
         (static_cast<uint32_t>(data[address + 3]) << 24);
}

void writeUint16(uint8_t* data, int address, uint16_t value) {
  data[address] = static_cast<uint8_t>(value & 0xFF);
  data[address + 1] = static_cast<uint8_t>((value >> 8) & 0xFF);
}

void writeUint32(uint8_t* data, int address, uint32_t value) {
  data[address] = static_cast<uint8_t>(value & 0xFF);
  data[address + 1] = static_cast<uint8_t>((value >> 8) & 0xFF);
  data[address + 2] = static_cast<uint8_t>((value >> 16) & 0xFF);
  data[address + 3] = static_cast<uint8_t>((value >> 24) & 0xFF);
}

uint32_t updateCrc32(uint32_t crc, const uint8_t* data, size_t length) {
  for (size_t i = 0; i < length; i++) {
    crc ^= data[i];
    for (uint8_t bit = 0; bit < 8; bit++) {
      crc = (crc & 1U) != 0 ? (crc >> 1) ^ 0xEDB88320UL : crc >> 1;
    }
  }
  return crc;
}

uint32_t calculateSlotCrc(const uint8_t* data, int storageDataSize) {
  uint32_t crc = updateCrc32(0xFFFFFFFFUL, data, CRC_ADDRESS);
  crc = updateCrc32(
    crc,
    data + STORAGE_HEADER_SIZE,
    storageDataSize - STORAGE_HEADER_SIZE
  );
  return crc ^ 0xFFFFFFFFUL;
}

int storageDataSizeForVersion(uint8_t version) {
  if (version == STORAGE_VERSION) {
    return STORAGE_DATA_SIZE;
  }
  if (version == LEGACY_STORAGE_VERSION_4) {
    return VERSION_4_STORAGE_DATA_SIZE;
  }
  return LEGACY_STORAGE_DATA_SIZE;
}

bool validKind(uint8_t value) {
  return value <= static_cast<uint8_t>(AssignmentKind::LayerPrevious);
}

bool slotValidForVersion(uint8_t slot, SlotKind kind, uint8_t version) {
  const uint8_t* data = slotData(slot);
  const uint8_t* expectedMagic = magicForSlotKind(kind);
  const int storageDataSize = storageDataSizeForVersion(version);
  for (uint8_t i = 0; i < sizeof(STORAGE_MAGIC); i++) {
    if (data[i] != expectedMagic[i]) {
      return false;
    }
  }

  if (data[4] != version ||
      data[5] != Config::LAYER_COUNT ||
      data[6] != Config::KEY_COUNT ||
      data[7] != ASSIGNMENT_RECORD_SIZE ||
      readUint16(data, PAYLOAD_LENGTH_ADDRESS) != storageDataSize - STORAGE_HEADER_SIZE) {
    return false;
  }

  return readUint32(data, CRC_ADDRESS) == calculateSlotCrc(data, storageDataSize);
}

bool slotValid(uint8_t slot, SlotKind kind) {
  return slotValidForVersion(slot, kind, STORAGE_VERSION);
}

bool slotReadable(uint8_t slot, SlotKind kind) {
  return slotValid(slot, kind) ||
         slotValidForVersion(slot, kind, LEGACY_STORAGE_VERSION_4) ||
         slotValidForVersion(slot, kind, LEGACY_STORAGE_VERSION_3) ||
         slotValidForVersion(slot, kind, LEGACY_STORAGE_VERSION_2);
}

bool generationIsNewer(uint32_t candidate, uint32_t current) {
  const uint32_t distance = candidate - current;
  return distance != 0 && distance < 0x80000000UL;
}

int8_t findNewestSlot() {
  int8_t newest = -1;
  uint32_t newestGeneration = 0;

  for (uint8_t slot = 0; slot < SLOT_COUNT; slot++) {
    if (!slotReadable(slot, SlotKind::Normal)) {
      continue;
    }

    const uint32_t generation = readUint32(slotData(slot), GENERATION_ADDRESS);
    if (newest < 0 || generationIsNewer(generation, newestGeneration)) {
      newest = static_cast<int8_t>(slot);
      newestGeneration = generation;
    }
  }

  return newest;
}

bool readAssignmentRecord(const uint8_t* data, int address, KeyAssignment& assignment) {
  const uint8_t kind = data[address];
  if (!validKind(kind)) {
    return false;
  }

  assignment = blankAssignment();
  assignment.kind = static_cast<AssignmentKind>(kind);
  assignment.modifier = data[address + 1];

  for (uint8_t i = 0; i < Config::KEYBOARD_REPORT_SLOTS; i++) {
    assignment.keycodes[i] = data[address + 2 + i];
  }

  assignment.consumerUsage = static_cast<uint16_t>(data[address + 8]) |
                             (static_cast<uint16_t>(data[address + 9]) << 8);
  assignment.targetLayer = data[address + 10];
  return assignment.kind != AssignmentKind::MomentaryLayer ||
         assignment.targetLayer < Config::LAYER_COUNT;
}

void writeAssignmentRecord(uint8_t* data, int address, const KeyAssignment& assignment) {
  data[address] = static_cast<uint8_t>(assignment.kind);
  data[address + 1] = assignment.modifier;

  for (uint8_t i = 0; i < Config::KEYBOARD_REPORT_SLOTS; i++) {
    data[address + 2 + i] = assignment.keycodes[i];
  }

  data[address + 8] = static_cast<uint8_t>(assignment.consumerUsage & 0xFF);
  data[address + 9] = static_cast<uint8_t>((assignment.consumerUsage >> 8) & 0xFF);
  data[address + 10] = assignment.targetLayer;
}

void buildSlotData(uint8_t* data, uint32_t generation, SlotKind kind) {
  memset(data, 0xFF, PROGRAM_SIZE);
  memcpy(data, magicForSlotKind(kind), sizeof(STORAGE_MAGIC));
  data[4] = STORAGE_VERSION;
  data[5] = Config::LAYER_COUNT;
  data[6] = Config::KEY_COUNT;
  data[7] = ASSIGNMENT_RECORD_SIZE;
  writeUint32(data, GENERATION_ADDRESS, generation);
  writeUint16(data, PAYLOAD_LENGTH_ADDRESS, STORAGE_DATA_SIZE - STORAGE_HEADER_SIZE);
  data[DEVICE_FLAGS_ADDRESS] =
    static_cast<uint8_t>(
      (encoderReversed() ? ENCODER_REVERSED_FLAG : 0U) |
      (statusLedReversed() ? STATUS_LED_REVERSED_FLAG : 0U) |
      (
        static_cast<uint8_t>(statusKeyAnimation()) <<
        STATUS_KEY_ANIMATION_SHIFT
      ) |
      (
        statusLayerDisplayMode() == StatusLayerDisplayMode::Pattern
          ? STATUS_LAYER_DISPLAY_PATTERN_FLAG
          : 0U
      )
    );
  data[STATUS_LED_BRIGHTNESS_ADDRESS] = statusLedBrightness();
  data[STATUS_KEY_ANIMATION_BRIGHTNESS_ADDRESS] =
    statusKeyAnimationBrightness();
  data[PERSISTENT_LAYER_ADDRESS] = persistentLayer();

  for (uint8_t layer = 0; layer < Config::LAYER_COUNT; layer++) {
    for (uint8_t keyIndex = 0; keyIndex < Config::KEY_COUNT; keyIndex++) {
      writeAssignmentRecord(data, recordAddress(layer, keyIndex), assignmentFor(layer, keyIndex));
    }
  }

  data[ENABLED_LAYER_MASK_ADDRESS] = enabledLayerMask();
  for (uint8_t layer = 0; layer < Config::LAYER_COUNT; layer++) {
    const LayerColor color = layerColor(layer);
    const int address = layerColorAddress(layer);
    data[address] = color.red;
    data[address + 1] = color.green;
    data[address + 2] = color.blue;
  }
  writeUint32(data, CRC_ADDRESS, calculateSlotCrc(data, STORAGE_DATA_SIZE));
}

bool writeSlot(uint8_t slot, const uint8_t* data, SlotKind kind) {
  noInterrupts();
  rp2040.idleOtherCore();
  flash_range_erase(slotFlashOffset(slot), SLOT_SIZE);
  flash_range_program(slotFlashOffset(slot), data, PROGRAM_SIZE);
  rp2040.resumeOtherCore();
  interrupts();
  return slotValid(slot, kind);
}

bool saveCurrentKeymapToStorage(SlotKind kind) {
  if (!storageAvailable) {
    return false;
  }

  const uint8_t targetSlot = currentSlot < 0
    ? 0
    : static_cast<uint8_t>((currentSlot + 1) % SLOT_COUNT);
  const uint32_t nextGeneration = currentGeneration + 1;
  uint8_t data[PROGRAM_SIZE];
  buildSlotData(data, nextGeneration, kind);

  if (!writeSlot(targetSlot, data, kind)) {
    return false;
  }

  currentSlot = static_cast<int8_t>(targetSlot);
  currentGeneration = nextGeneration;
  return true;
}

}  // namespace

void beginKeymapStorage() {
  const uintptr_t storageSize = reinterpret_cast<uintptr_t>(&_FS_end) -
                                reinterpret_cast<uintptr_t>(&_FS_start);
  storageAvailable = storageSize >= SLOT_COUNT * SLOT_SIZE;
  currentSlot = storageAvailable ? findNewestSlot() : -1;
  currentGeneration = currentSlot >= 0
    ? readUint32(slotData(static_cast<uint8_t>(currentSlot)), GENERATION_ADDRESS)
    : 0;
  activeLayerSavePending = false;
  lastSavedActiveLayer = 0;
}

bool loadKeymapFromStorage() {
  if (!storageAvailable || currentSlot < 0) {
    return false;
  }

  const uint8_t* data = slotData(static_cast<uint8_t>(currentSlot));
  const uint8_t storageVersion = data[4];
  const bool version2Storage = storageVersion == LEGACY_STORAGE_VERSION_2;
  KeyAssignment loaded[Config::LAYER_COUNT][Config::KEY_COUNT];
  for (uint8_t layer = 0; layer < Config::LAYER_COUNT; layer++) {
    for (uint8_t keyIndex = 0; keyIndex < Config::KEY_COUNT; keyIndex++) {
      if (!readAssignmentRecord(data, recordAddress(layer, keyIndex), loaded[layer][keyIndex])) {
        return false;
      }
    }
  }

  for (uint8_t layer = 0; layer < Config::LAYER_COUNT; layer++) {
    for (uint8_t keyIndex = 0; keyIndex < Config::KEY_COUNT; keyIndex++) {
      setAssignment(layer, keyIndex, loaded[layer][keyIndex]);
    }
  }

  setEnabledLayerMask(data[ENABLED_LAYER_MASK_ADDRESS]);
  for (uint8_t layer = 0; layer < Config::LAYER_COUNT; layer++) {
    const int address = layerColorAddress(layer);
    setLayerColor(layer, { data[address], data[address + 1], data[address + 2] });
  }
  setEncoderReversed((data[DEVICE_FLAGS_ADDRESS] & ENCODER_REVERSED_FLAG) != 0);
  setStatusLedReversed(
    version2Storage
      ? Config::EXTERNAL_RGB_LED_REVERSED
      : (data[DEVICE_FLAGS_ADDRESS] & STATUS_LED_REVERSED_FLAG) != 0
  );
  setStatusLedBrightness(data[STATUS_LED_BRIGHTNESS_ADDRESS]);
  setStatusKeyAnimation(
    version2Storage
      ? static_cast<StatusKeyAnimation>(Config::DEFAULT_STATUS_KEY_ANIMATION)
      : static_cast<StatusKeyAnimation>(
          (data[DEVICE_FLAGS_ADDRESS] & STATUS_KEY_ANIMATION_MASK) >>
          STATUS_KEY_ANIMATION_SHIFT
        )
  );
  setStatusKeyAnimationBrightness(
    storageVersion >= LEGACY_STORAGE_VERSION_4
      ? data[STATUS_KEY_ANIMATION_BRIGHTNESS_ADDRESS]
      : Config::DEFAULT_STATUS_KEY_ANIMATION_BRIGHTNESS
  );
  setStatusLayerDisplayMode(
    (data[DEVICE_FLAGS_ADDRESS] & STATUS_LAYER_DISPLAY_PATTERN_FLAG) != 0
      ? StatusLayerDisplayMode::Pattern
      : StatusLayerDisplayMode::Solid
  );
  const uint8_t loadedActiveLayer = storageVersion == STORAGE_VERSION
    ? data[PERSISTENT_LAYER_ADDRESS]
    : 0;
  restoreActiveLayers(loadedActiveLayer, loadedActiveLayer);
  lastSavedActiveLayer = persistentLayer();
  if (storageVersion != STORAGE_VERSION) {
    saveKeymapToStorage();
  }
  return true;
}

bool saveKeymapToStorage() {
  const bool saved = saveCurrentKeymapToStorage(SlotKind::Normal);
  if (saved) {
    lastSavedActiveLayer = persistentLayer();
    activeLayerSavePending = false;
  }
  return saved;
}

bool saveAssignmentToStorage(uint8_t layer, uint8_t keyIndex) {
  if (layer >= Config::LAYER_COUNT || keyIndex >= Config::KEY_COUNT) {
    return false;
  }
  return saveKeymapToStorage();
}

bool saveEnabledLayerMaskToStorage() {
  return saveKeymapToStorage();
}

bool saveLayerColorToStorage(uint8_t layer) {
  if (layer >= Config::LAYER_COUNT) {
    return false;
  }
  return saveKeymapToStorage();
}

bool saveEncoderReversedToStorage() {
  return saveKeymapToStorage();
}

bool saveStatusLedReversedToStorage() {
  return saveKeymapToStorage();
}

bool saveStatusLedBrightnessToStorage() {
  return saveKeymapToStorage();
}

bool saveStatusKeyAnimationToStorage() {
  return saveKeymapToStorage();
}

bool saveStatusKeyAnimationBrightnessToStorage() {
  return saveKeymapToStorage();
}

bool saveStatusLayerDisplayModeToStorage() {
  return saveKeymapToStorage();
}

void scheduleActiveLayerSave() {
  if (persistentLayer() == lastSavedActiveLayer) {
    activeLayerSavePending = false;
    return;
  }

  activeLayerSavePending = true;
  activeLayerChangedAtMs = millis();
}

void updateKeymapStorage() {
  if (
    !activeLayerSavePending ||
    millis() - activeLayerChangedAtMs < Config::ACTIVE_LAYER_SAVE_DELAY_MS
  ) {
    return;
  }

  if (!saveKeymapToStorage()) {
    activeLayerChangedAtMs = millis();
  }
}

bool runKeymapStorageSelfTest() {
  KeyAssignment backup[Config::LAYER_COUNT][Config::KEY_COUNT];
  KeyAssignment pattern[Config::LAYER_COUNT][Config::KEY_COUNT];
  const uint8_t backupLayerMask = enabledLayerMask();
  const uint8_t backupActiveLayer = activeLayer();
  const uint8_t backupPersistentLayer = persistentLayer();
  const bool backupEncoderReversed = encoderReversed();
  const bool patternEncoderReversed = !backupEncoderReversed;
  const bool backupStatusLedReversed = statusLedReversed();
  const bool patternStatusLedReversed = !backupStatusLedReversed;
  const uint8_t backupStatusLedBrightness = statusLedBrightness();
  const uint8_t patternStatusLedBrightness = backupStatusLedBrightness == 97 ? 96 : 97;
  const StatusKeyAnimation backupStatusKeyAnimation = statusKeyAnimation();
  const StatusKeyAnimation patternStatusKeyAnimation =
    backupStatusKeyAnimation == StatusKeyAnimation::Spark
      ? StatusKeyAnimation::Flash
      : StatusKeyAnimation::Spark;
  const uint8_t backupStatusKeyAnimationBrightness =
    statusKeyAnimationBrightness();
  const uint8_t patternStatusKeyAnimationBrightness =
    backupStatusKeyAnimationBrightness == 91 ? 90 : 91;
  const StatusLayerDisplayMode backupStatusLayerDisplayMode =
    statusLayerDisplayMode();
  const StatusLayerDisplayMode patternStatusLayerDisplayMode =
    backupStatusLayerDisplayMode == StatusLayerDisplayMode::Pattern
      ? StatusLayerDisplayMode::Solid
      : StatusLayerDisplayMode::Pattern;
  const uint8_t patternLayerMask = static_cast<uint8_t>(0x55U & ((1U << Config::LAYER_COUNT) - 1U));
  const uint8_t patternActiveLayer = Config::LAYER_COUNT > 2 ? 2 : 0;
  LayerColor backupLayerColors[Config::LAYER_COUNT];
  LayerColor patternLayerColors[Config::LAYER_COUNT];

  for (uint8_t layer = 0; layer < Config::LAYER_COUNT; layer++) {
    backupLayerColors[layer] = layerColor(layer);
    patternLayerColors[layer] = {
      static_cast<uint8_t>(17 + layer),
      static_cast<uint8_t>(83 + layer),
      static_cast<uint8_t>(149 + layer),
    };
    setLayerColor(layer, patternLayerColors[layer]);

    for (uint8_t keyIndex = 0; keyIndex < Config::KEY_COUNT; keyIndex++) {
      backup[layer][keyIndex] = assignmentFor(layer, keyIndex);

      KeyAssignment assignment = blankAssignment();
      assignment.kind = AssignmentKind::Keyboard;
      assignment.modifier = static_cast<uint8_t>((layer << 4) ^ keyIndex);
      for (uint8_t slot = 0; slot < Config::KEYBOARD_REPORT_SLOTS; slot++) {
        assignment.keycodes[slot] = static_cast<uint8_t>(0x04 + ((layer * Config::KEY_COUNT + keyIndex + slot) % 0x40));
      }
      assignment.consumerUsage = static_cast<uint16_t>(0x1200 + (layer * Config::KEY_COUNT) + keyIndex);
      pattern[layer][keyIndex] = assignment;
      setAssignment(layer, keyIndex, assignment);
    }
  }

  setEnabledLayerMask(patternLayerMask);
  setActiveLayer(patternActiveLayer);
  setEncoderReversed(patternEncoderReversed);
  setStatusLedReversed(patternStatusLedReversed);
  setStatusLedBrightness(patternStatusLedBrightness);
  setStatusKeyAnimation(patternStatusKeyAnimation);
  setStatusKeyAnimationBrightness(patternStatusKeyAnimationBrightness);
  setStatusLayerDisplayMode(patternStatusLayerDisplayMode);

  bool ok = saveCurrentKeymapToStorage(SlotKind::SelfTest);
  if (ok) {
    clearKeymap();
    setEnabledLayerMask(0x01);
    resetLayerColors();
    setEncoderReversed(backupEncoderReversed);
    setStatusLedReversed(backupStatusLedReversed);
    setStatusKeyAnimation(backupStatusKeyAnimation);
    setStatusKeyAnimationBrightness(backupStatusKeyAnimationBrightness);
    setStatusLayerDisplayMode(backupStatusLayerDisplayMode);
    ok = loadKeymapFromStorage();
  }

  if (ok && enabledLayerMask() != patternLayerMask) {
    ok = false;
  }

  if (ok && persistentLayer() != patternActiveLayer) {
    ok = false;
  }

  if (ok && encoderReversed() != patternEncoderReversed) {
    ok = false;
  }

  if (ok && statusLedReversed() != patternStatusLedReversed) {
    ok = false;
  }

  if (ok && statusLedBrightness() != patternStatusLedBrightness) {
    ok = false;
  }

  if (ok && statusKeyAnimation() != patternStatusKeyAnimation) {
    ok = false;
  }

  if (
    ok &&
    statusKeyAnimationBrightness() != patternStatusKeyAnimationBrightness
  ) {
    ok = false;
  }

  if (ok && statusLayerDisplayMode() != patternStatusLayerDisplayMode) {
    ok = false;
  }

  if (ok) {
    for (uint8_t layer = 0; layer < Config::LAYER_COUNT; layer++) {
      const LayerColor actual = layerColor(layer);
      const LayerColor expected = patternLayerColors[layer];
      if (actual.red != expected.red || actual.green != expected.green || actual.blue != expected.blue) {
        ok = false;
        break;
      }
    }
  }

  if (ok) {
    for (uint8_t layer = 0; layer < Config::LAYER_COUNT; layer++) {
      for (uint8_t keyIndex = 0; keyIndex < Config::KEY_COUNT; keyIndex++) {
        const KeyAssignment& actual = assignmentFor(layer, keyIndex);
        const KeyAssignment& expected = pattern[layer][keyIndex];
        if (actual.kind != expected.kind ||
            actual.modifier != expected.modifier ||
            actual.consumerUsage != expected.consumerUsage ||
            actual.targetLayer != expected.targetLayer) {
          ok = false;
          break;
        }

        for (uint8_t slot = 0; slot < Config::KEYBOARD_REPORT_SLOTS; slot++) {
          if (actual.keycodes[slot] != expected.keycodes[slot]) {
            ok = false;
            break;
          }
        }

        if (!ok) {
          break;
        }
      }
    }
  }

  for (uint8_t layer = 0; layer < Config::LAYER_COUNT; layer++) {
    for (uint8_t keyIndex = 0; keyIndex < Config::KEY_COUNT; keyIndex++) {
      setAssignment(layer, keyIndex, backup[layer][keyIndex]);
    }
  }

  setEnabledLayerMask(backupLayerMask);
  restoreActiveLayers(backupPersistentLayer, backupActiveLayer);
  setEncoderReversed(backupEncoderReversed);
  setStatusLedReversed(backupStatusLedReversed);
  setStatusLedBrightness(backupStatusLedBrightness);
  setStatusKeyAnimation(backupStatusKeyAnimation);
  setStatusKeyAnimationBrightness(backupStatusKeyAnimationBrightness);
  setStatusLayerDisplayMode(backupStatusLayerDisplayMode);
  for (uint8_t layer = 0; layer < Config::LAYER_COUNT; layer++) {
    setLayerColor(layer, backupLayerColors[layer]);
  }

  const bool restored = saveKeymapToStorage();
  return ok && restored;
}
