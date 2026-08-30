#include "keymap.h"

#include "Adafruit_TinyUSB.h"
#include "keymap_storage.h"

namespace {

uint8_t currentLayer = 0;
uint8_t currentPersistentLayer = 0;
static_assert(Config::LAYER_COUNT > 0 && Config::LAYER_COUNT <= 8, "Layer mask supports 1-8 layers");
constexpr uint8_t ALL_LAYERS_ENABLED_MASK = static_cast<uint8_t>((1U << Config::LAYER_COUNT) - 1U);
uint8_t currentEnabledLayerMask = Config::DEFAULT_ENABLED_LAYER_MASK;
bool currentEncoderReversed = Config::ENCODER_REVERSED;
bool currentStatusLedReversed = Config::EXTERNAL_RGB_LED_REVERSED;
uint8_t currentStatusLedBrightness = Config::DEFAULT_STATUS_LED_BRIGHTNESS;
uint8_t currentStatusKeyAnimationBrightness =
  Config::DEFAULT_STATUS_KEY_ANIMATION_BRIGHTNESS;
StatusKeyAnimation currentStatusKeyAnimation =
  static_cast<StatusKeyAnimation>(Config::DEFAULT_STATUS_KEY_ANIMATION);
StatusLayerDisplayMode currentStatusLayerDisplayMode =
  static_cast<StatusLayerDisplayMode>(Config::DEFAULT_STATUS_LAYER_DISPLAY_MODE);
uint16_t currentLayerTapDanceTermMs = Config::DEFAULT_LAYER_TAP_DANCE_TERM_MS;
uint8_t currentPcbRevision = Config::DEFAULT_PCB_REVISION;
LayerColor currentLayerColors[Config::LAYER_COUNT];
KeyAssignment keymap[Config::LAYER_COUNT][Config::KEY_COUNT];

void setDefaultLayer0() {
  keymap[0][0] = layerCycleAssignment();
  keymap[0][1] = consumerAssignment(HID_USAGE_CONSUMER_MUTE);
  keymap[0][2] = consumerAssignment(HID_USAGE_CONSUMER_VOLUME_DECREMENT);
  keymap[0][3] = consumerAssignment(HID_USAGE_CONSUMER_VOLUME_INCREMENT);
  keymap[0][4] = momentaryLayerAssignment(1);
  keymap[0][5] = consumerAssignment(HID_USAGE_CONSUMER_SCAN_PREVIOUS_TRACK);
  keymap[0][6] = consumerAssignment(HID_USAGE_CONSUMER_PLAY_PAUSE);
  keymap[0][7] = consumerAssignment(HID_USAGE_CONSUMER_SCAN_NEXT_TRACK);
  keymap[0][Config::ENCODER_CCW_KEY_INDEX] = consumerAssignment(HID_USAGE_CONSUMER_VOLUME_DECREMENT);
  keymap[0][Config::ENCODER_CW_KEY_INDEX] = consumerAssignment(HID_USAGE_CONSUMER_VOLUME_INCREMENT);
}

void setDefaultLayer1() {
  keymap[1][0] = layerCycleAssignment();
  keymap[1][1] = keyboardAssignment(HID_KEY_Q);
  keymap[1][2] = keyboardAssignment(HID_KEY_W);
  keymap[1][3] = keyboardAssignment(HID_KEY_E);
  keymap[1][5] = keyboardAssignment(HID_KEY_A);
  keymap[1][6] = keyboardAssignment(HID_KEY_S);
  keymap[1][7] = keyboardAssignment(HID_KEY_D);
}

void setDefaultKeymap() {
  clearKeymap();
  setDefaultLayer0();
  setDefaultLayer1();
}

}  // namespace

void clearKeymap() {
  for (uint8_t layer = 0; layer < Config::LAYER_COUNT; layer++) {
    for (uint8_t key = 0; key < Config::KEY_COUNT; key++) {
      keymap[layer][key] = blankAssignment();
    }
  }
}

void beginKeymap() {
  resetKeymapToDefaults();
  beginKeymapStorage();

  if (!loadKeymapFromStorage()) {
    saveKeymapToStorage();
  }
}

void resetKeymapToDefaults() {
  currentLayer = 0;
  currentPersistentLayer = 0;
  currentEnabledLayerMask = Config::DEFAULT_ENABLED_LAYER_MASK;
  currentEncoderReversed = Config::ENCODER_REVERSED;
  currentStatusLedReversed = Config::EXTERNAL_RGB_LED_REVERSED;
  currentStatusLedBrightness = Config::DEFAULT_STATUS_LED_BRIGHTNESS;
  currentStatusKeyAnimationBrightness =
    Config::DEFAULT_STATUS_KEY_ANIMATION_BRIGHTNESS;
  currentStatusKeyAnimation =
    static_cast<StatusKeyAnimation>(Config::DEFAULT_STATUS_KEY_ANIMATION);
  currentStatusLayerDisplayMode =
    static_cast<StatusLayerDisplayMode>(Config::DEFAULT_STATUS_LAYER_DISPLAY_MODE);
  currentLayerTapDanceTermMs = Config::DEFAULT_LAYER_TAP_DANCE_TERM_MS;
  currentPcbRevision = Config::DEFAULT_PCB_REVISION;
  resetLayerColors();
  setDefaultKeymap();
}

void captureKeymapSnapshot(KeymapSnapshot& snapshot) {
  snapshot.activeLayerIndex = activeLayer();
  snapshot.persistentLayerIndex = persistentLayer();
  snapshot.enabledMask = enabledLayerMask();
  snapshot.encoderReversedValue = encoderReversed();
  snapshot.statusLedReversedValue = statusLedReversed();
  snapshot.statusLedBrightnessValue = statusLedBrightness();
  snapshot.statusKeyAnimationValue = statusKeyAnimation();
  snapshot.statusKeyAnimationBrightnessValue =
    statusKeyAnimationBrightness();
  snapshot.statusLayerDisplayModeValue = statusLayerDisplayMode();
  snapshot.layerTapDanceTermMsValue = layerTapDanceTermMs();
  snapshot.pcbRevisionValue = pcbRevision();

  for (uint8_t layer = 0; layer < Config::LAYER_COUNT; layer++) {
    snapshot.colors[layer] = layerColor(layer);
    for (uint8_t keyIndex = 0; keyIndex < Config::KEY_COUNT; keyIndex++) {
      snapshot.assignments[layer][keyIndex] = assignmentFor(layer, keyIndex);
    }
  }
}

void restoreKeymapSnapshot(const KeymapSnapshot& snapshot) {
  for (uint8_t layer = 0; layer < Config::LAYER_COUNT; layer++) {
    setLayerColor(layer, snapshot.colors[layer]);
    for (uint8_t keyIndex = 0; keyIndex < Config::KEY_COUNT; keyIndex++) {
      setAssignment(layer, keyIndex, snapshot.assignments[layer][keyIndex]);
    }
  }

  setEnabledLayerMask(snapshot.enabledMask);
  setEncoderReversed(snapshot.encoderReversedValue);
  setStatusLedReversed(snapshot.statusLedReversedValue);
  setStatusLedBrightness(snapshot.statusLedBrightnessValue);
  setStatusKeyAnimation(snapshot.statusKeyAnimationValue);
  setStatusKeyAnimationBrightness(
    snapshot.statusKeyAnimationBrightnessValue
  );
  setStatusLayerDisplayMode(snapshot.statusLayerDisplayModeValue);
  setLayerTapDanceTermMs(snapshot.layerTapDanceTermMsValue);
  setPcbRevision(snapshot.pcbRevisionValue);
  restoreActiveLayers(
    snapshot.persistentLayerIndex,
    snapshot.activeLayerIndex
  );
}

LayerColor layerColor(uint8_t layer) {
  if (layer >= Config::LAYER_COUNT) {
    layer = 0;
  }

  return currentLayerColors[layer];
}

bool setLayerColor(uint8_t layer, const LayerColor& color) {
  if (layer >= Config::LAYER_COUNT) {
    return false;
  }

  currentLayerColors[layer] = color;
  return true;
}

void resetLayerColors() {
  for (uint8_t layer = 0; layer < Config::LAYER_COUNT; layer++) {
    currentLayerColors[layer] = {
      Config::DEFAULT_LAYER_COLORS[layer][0],
      Config::DEFAULT_LAYER_COLORS[layer][1],
      Config::DEFAULT_LAYER_COLORS[layer][2],
    };
  }
}

bool encoderReversed() {
  return currentEncoderReversed;
}

void setEncoderReversed(bool reversed) {
  currentEncoderReversed = reversed;
}

bool statusLedReversed() {
  return currentStatusLedReversed;
}

void setStatusLedReversed(bool reversed) {
  currentStatusLedReversed = reversed;
}

uint8_t statusLedBrightness() {
  return currentStatusLedBrightness;
}

void setStatusLedBrightness(uint8_t brightness) {
  currentStatusLedBrightness = brightness > Config::MAX_STATUS_LED_BRIGHTNESS
    ? Config::MAX_STATUS_LED_BRIGHTNESS
    : brightness;
}

uint8_t statusKeyAnimationBrightness() {
  return currentStatusKeyAnimationBrightness;
}

void setStatusKeyAnimationBrightness(uint8_t brightness) {
  currentStatusKeyAnimationBrightness =
    brightness > Config::MAX_STATUS_KEY_ANIMATION_BRIGHTNESS
      ? Config::MAX_STATUS_KEY_ANIMATION_BRIGHTNESS
      : brightness;
}

StatusKeyAnimation statusKeyAnimation() {
  return currentStatusKeyAnimation;
}

bool setStatusKeyAnimation(StatusKeyAnimation animation) {
  if (animation > StatusKeyAnimation::Rainbow) {
    return false;
  }

  currentStatusKeyAnimation = animation;
  return true;
}

StatusLayerDisplayMode statusLayerDisplayMode() {
  return currentStatusLayerDisplayMode;
}

bool setStatusLayerDisplayMode(StatusLayerDisplayMode mode) {
  if (mode > StatusLayerDisplayMode::RainbowCycle) {
    return false;
  }

  currentStatusLayerDisplayMode = mode;
  return true;
}

uint16_t layerTapDanceTermMs() {
  return currentLayerTapDanceTermMs;
}

bool setLayerTapDanceTermMs(uint16_t termMs) {
  if (
    termMs < Config::MIN_LAYER_TAP_DANCE_TERM_MS ||
    termMs > Config::MAX_LAYER_TAP_DANCE_TERM_MS
  ) {
    return false;
  }

  currentLayerTapDanceTermMs = termMs;
  return true;
}

uint8_t pcbRevision() {
  return currentPcbRevision;
}

bool setPcbRevision(uint8_t revision) {
  if (
    revision != Config::DEFAULT_PCB_REVISION &&
    revision != Config::LEGACY_PCB_REVISION
  ) {
    return false;
  }

  currentPcbRevision = revision;
  return true;
}

uint8_t activeLayer() {
  return currentLayer;
}

uint8_t persistentLayer() {
  return currentPersistentLayer;
}

void setActiveLayer(uint8_t layer) {
  if (layerEnabled(layer)) {
    const bool changed = currentPersistentLayer != layer;
    currentPersistentLayer = layer;
    currentLayer = layer;
    if (changed) {
      scheduleActiveLayerSave();
    }
  }
}

void setTransientActiveLayer(uint8_t layer) {
  if (layerEnabled(layer)) {
    currentLayer = layer;
  }
}

void restoreActiveLayers(uint8_t persistent, uint8_t active) {
  currentPersistentLayer = layerEnabled(persistent) ? persistent : 0;
  currentLayer = layerEnabled(active) ? active : currentPersistentLayer;
  if (!layerEnabled(currentLayer)) {
    currentLayer = 0;
  }
}

uint8_t enabledLayerMask() {
  return currentEnabledLayerMask;
}

bool layerEnabled(uint8_t layer) {
  return layer < Config::LAYER_COUNT &&
         (currentEnabledLayerMask & static_cast<uint8_t>(1U << layer)) != 0;
}

bool setLayerEnabled(uint8_t layer, bool enabled) {
  if (layer >= Config::LAYER_COUNT || (layer == 0 && !enabled)) {
    return false;
  }

  const uint8_t bit = static_cast<uint8_t>(1U << layer);
  currentEnabledLayerMask = enabled
    ? static_cast<uint8_t>(currentEnabledLayerMask | bit)
    : static_cast<uint8_t>(currentEnabledLayerMask & ~bit);

  if (!layerEnabled(currentPersistentLayer)) {
    currentPersistentLayer = 0;
  }
  if (!layerEnabled(currentLayer)) {
    currentLayer = currentPersistentLayer;
  }

  return true;
}

void setEnabledLayerMask(uint8_t mask) {
  currentEnabledLayerMask = static_cast<uint8_t>((mask & ALL_LAYERS_ENABLED_MASK) | 0x01U);
  if (!layerEnabled(currentPersistentLayer)) {
    currentPersistentLayer = 0;
  }
  if (!layerEnabled(currentLayer)) {
    currentLayer = currentPersistentLayer;
  }
}

const KeyAssignment& assignmentFor(uint8_t layer, uint8_t keyIndex) {
  static KeyAssignment blank = blankAssignment();

  if (layer >= Config::LAYER_COUNT || keyIndex >= Config::KEY_COUNT) {
    return blank;
  }

  return keymap[layer][keyIndex];
}

bool setAssignment(uint8_t layer, uint8_t keyIndex, const KeyAssignment& assignment) {
  if (layer >= Config::LAYER_COUNT || keyIndex >= Config::KEY_COUNT) {
    return false;
  }

  keymap[layer][keyIndex] = assignment;
  return true;
}
