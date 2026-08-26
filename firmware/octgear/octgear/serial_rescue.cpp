#include "serial_rescue.h"

#include <stdlib.h>
#include <string.h>

#include "config.h"
#include "key_assignment.h"
#include "key_scanner.h"
#include "keymap.h"
#include "keymap_storage.h"
#include "status_led.h"

namespace {

constexpr uint32_t SERIAL_BAUD = 115200;
constexpr uint16_t LINE_BUFFER_SIZE = 96;
constexpr uint32_t RESCUE_ACTIVE_TIMEOUT_MS = 5000;

char lineBuffer[LINE_BUFFER_SIZE];
uint8_t lineLength = 0;
uint32_t lastSerialCommandMs = 0;

char* nextToken(char*& cursor) {
  while (*cursor == ' ' || *cursor == '\t') {
    cursor++;
  }

  if (*cursor == '\0') {
    return nullptr;
  }

  char* token = cursor;
  while (*cursor != '\0' && *cursor != ' ' && *cursor != '\t') {
    cursor++;
  }

  if (*cursor != '\0') {
    *cursor = '\0';
    cursor++;
  }

  return token;
}

bool parseByte(char*& cursor, uint8_t& value) {
  char* token = nextToken(cursor);
  if (token == nullptr) {
    return false;
  }

  char* end = nullptr;
  const unsigned long parsed = strtoul(token, &end, 0);
  if (*end != '\0' || parsed > 0xff) {
    return false;
  }

  value = static_cast<uint8_t>(parsed);
  return true;
}

bool parseWord(char*& cursor, uint16_t& value) {
  char* token = nextToken(cursor);
  if (token == nullptr) {
    return false;
  }

  char* end = nullptr;
  const unsigned long parsed = strtoul(token, &end, 0);
  if (*end != '\0' || parsed > 0xffff) {
    return false;
  }

  value = static_cast<uint16_t>(parsed);
  return true;
}

bool parseBoolean(char*& cursor, bool& value) {
  uint8_t parsed = 0;
  if (!parseByte(cursor, parsed) || parsed > 1) {
    return false;
  }

  value = parsed != 0;
  return true;
}

void printHexByte(uint8_t value) {
  Serial.print(F("0x"));
  if (value < 0x10) {
    Serial.print('0');
  }
  Serial.print(value, HEX);
}

void printAssignment(uint8_t layer, uint8_t keyIndex) {
  const KeyAssignment& assignment = assignmentFor(layer, keyIndex);
  Serial.print(F("L"));
  Serial.print(layer);
  Serial.print(F(" K"));
  Serial.print(keyIndex + 1);
  Serial.print(F(" kind="));
  Serial.print(static_cast<uint8_t>(assignment.kind));
  Serial.print(F(" mod=0x"));
  if (assignment.modifier < 0x10) {
    Serial.print('0');
  }
  Serial.print(assignment.modifier, HEX);
  Serial.print(F(" keys="));
  for (uint8_t slot = 0; slot < Config::KEYBOARD_REPORT_SLOTS; slot++) {
    if (slot > 0) {
      Serial.print(',');
    }
    Serial.print(F("0x"));
    if (assignment.keycodes[slot] < 0x10) {
      Serial.print('0');
    }
    Serial.print(assignment.keycodes[slot], HEX);
  }
  Serial.print(F(" consumer=0x"));
  if (assignment.consumerUsage < 0x1000) {
    Serial.print('0');
  }
  if (assignment.consumerUsage < 0x100) {
    Serial.print('0');
  }
  if (assignment.consumerUsage < 0x10) {
    Serial.print('0');
  }
  Serial.print(assignment.consumerUsage, HEX);
  Serial.print(F(" targetLayer="));
  Serial.println(assignment.targetLayer);
}

bool parseLayerKey(char*& cursor, uint8_t& layer, uint8_t& keyIndex) {
  uint8_t keyNumber = 0;
  if (!parseByte(cursor, layer) || !parseByte(cursor, keyNumber)) {
    return false;
  }

  if (layer >= Config::LAYER_COUNT || keyNumber == 0 || keyNumber > Config::KEY_COUNT) {
    return false;
  }

  keyIndex = keyNumber - 1;
  return true;
}

void printHelp() {
  Serial.println(F("OctGear serial rescue"));
  Serial.println(F("Commands:"));
  Serial.println(F("  probe"));
  Serial.println(F("  help"));
  Serial.println(F("  state"));
  Serial.println(F("  dump"));
  Serial.print(F("  layer <0-"));
  Serial.print(Config::LAYER_COUNT - 1);
  Serial.println(F(">"));
  Serial.print(F("  get <layer> <key 1-"));
  Serial.print(Config::KEY_COUNT);
  Serial.println(F(">"));
  Serial.print(F("  none <layer> <key 1-"));
  Serial.print(Config::KEY_COUNT);
  Serial.println(F(">"));
  Serial.print(F("  key <layer> <key 1-"));
  Serial.print(Config::KEY_COUNT);
  Serial.println(F("> <modifier> <keycode> [keycode...]"));
  Serial.print(F("  consumer <layer> <key 1-"));
  Serial.print(Config::KEY_COUNT);
  Serial.println(F("> <usage>"));
  Serial.print(F("  cycle <layer> <key 1-"));
  Serial.print(Config::KEY_COUNT);
  Serial.println(F(">"));
  Serial.print(F("  back <layer> <key 1-"));
  Serial.print(Config::KEY_COUNT);
  Serial.println(F(">"));
  Serial.print(F("  hold <layer> <key 1-"));
  Serial.print(Config::KEY_COUNT);
  Serial.println(F("> <target layer>"));
  Serial.print(F("  color <layer 0-"));
  Serial.print(Config::LAYER_COUNT - 1);
  Serial.println(F("> <red> <green> <blue>"));
  Serial.print(F("  enabled <layer 0-"));
  Serial.print(Config::LAYER_COUNT - 1);
  Serial.println(F("> <0|1>"));
  Serial.println(F("  encoder-reversed <0|1>"));
  Serial.print(F("  pcb-revision <"));
  Serial.print(Config::LEGACY_PCB_REVISION);
  Serial.print('|');
  Serial.print(Config::DEFAULT_PCB_REVISION);
  Serial.println(F(">"));
  Serial.println(F("  led-reversed <0|1>"));
  Serial.print(F("  led-brightness <0-"));
  Serial.print(Config::MAX_STATUS_LED_BRIGHTNESS);
  Serial.println(F(">"));
  Serial.println(F("  animation <0:ripple|1:disabled|2:flash|3:spark>"));
  Serial.print(F("  animation-brightness <0-"));
  Serial.print(Config::MAX_STATUS_KEY_ANIMATION_BRIGHTNESS);
  Serial.println(F(">"));
  Serial.println(F("  layer-display <0:solid|1:pattern>"));
  Serial.print(F("  tap-dance <"));
  Serial.print(Config::MIN_LAYER_TAP_DANCE_TERM_MS);
  Serial.print('-');
  Serial.print(Config::MAX_LAYER_TAP_DANCE_TERM_MS);
  Serial.println(F(">"));
  Serial.println(F("  reset confirm"));
  Serial.println(F("  diag"));
  Serial.println(F("  bootloader"));
  Serial.println(F("Numbers accept decimal or 0xHEX. Setting commands save immediately."));
}

void handleState() {
  Serial.print(F("activeLayer="));
  Serial.print(activeLayer());
  Serial.print(F(" persistentLayer="));
  Serial.print(persistentLayer());
  Serial.print(F(" layers="));
  Serial.print(Config::LAYER_COUNT);
  Serial.print(F(" keys="));
  Serial.print(Config::KEY_COUNT);
  Serial.print(F(" enabledMask="));
  printHexByte(enabledLayerMask());
  Serial.println();

  Serial.print(F("encoderReversed="));
  Serial.print(encoderReversed() ? 1 : 0);
  Serial.print(F(" ledReversed="));
  Serial.print(statusLedReversed() ? 1 : 0);
  Serial.print(F(" ledBrightness="));
  Serial.print(statusLedBrightness());
  Serial.print(F(" animation="));
  Serial.print(static_cast<uint8_t>(statusKeyAnimation()));
  Serial.print(F(" animationBrightness="));
  Serial.print(statusKeyAnimationBrightness());
  Serial.print(F(" layerDisplay="));
  Serial.print(static_cast<uint8_t>(statusLayerDisplayMode()));
  Serial.print(F(" tapDanceMs="));
  Serial.print(layerTapDanceTermMs());
  Serial.print(F(" pcbRevision="));
  Serial.println(pcbRevision());

  for (uint8_t layer = 0; layer < Config::LAYER_COUNT; layer++) {
    const LayerColor color = layerColor(layer);
    Serial.print(F("color L"));
    Serial.print(layer);
    Serial.print('=');
    Serial.print(color.red);
    Serial.print(',');
    Serial.print(color.green);
    Serial.print(',');
    Serial.println(color.blue);
  }
}

void handleProbe() {
  Serial.print(F("OCTGEAR ACK rescue=1 layers="));
  Serial.print(Config::LAYER_COUNT);
  Serial.print(F(" keys="));
  Serial.println(Config::KEY_COUNT);
}

void handleDump() {
  handleState();
  for (uint8_t layer = 0; layer < Config::LAYER_COUNT; layer++) {
    for (uint8_t keyIndex = 0; keyIndex < Config::KEY_COUNT; keyIndex++) {
      printAssignment(layer, keyIndex);
    }
  }
}

void handleLayer(char*& cursor) {
  uint8_t layer = 0;
  if (!parseByte(cursor, layer) || !layerEnabled(layer)) {
    Serial.println(F("ERR layer"));
    return;
  }

  setActiveLayer(layer);
  Serial.println(F("OK"));
}

void handleGet(char*& cursor) {
  uint8_t layer = 0;
  uint8_t keyIndex = 0;
  if (!parseLayerKey(cursor, layer, keyIndex)) {
    Serial.println(F("ERR get"));
    return;
  }

  printAssignment(layer, keyIndex);
}

void saveParsedAssignment(uint8_t layer, uint8_t keyIndex, const KeyAssignment& assignment) {
  if (layer >= Config::LAYER_COUNT || keyIndex >= Config::KEY_COUNT) {
    Serial.println(F("ERR range"));
    return;
  }

  const KeyAssignment previousAssignment = assignmentFor(layer, keyIndex);
  if (!setAssignment(layer, keyIndex, assignment)) {
    Serial.println(F("ERR range"));
    return;
  }

  if (!saveAssignmentToStorage(layer, keyIndex)) {
    setAssignment(layer, keyIndex, previousAssignment);
    Serial.println(F("ERR storage"));
    return;
  }

  Serial.println(F("OK"));
}

void handleNone(char*& cursor) {
  uint8_t layer = 0;
  uint8_t keyIndex = 0;
  if (!parseLayerKey(cursor, layer, keyIndex)) {
    Serial.println(F("ERR none"));
    return;
  }

  saveParsedAssignment(layer, keyIndex, blankAssignment());
}

void handleKey(char*& cursor) {
  uint8_t layer = 0;
  uint8_t keyIndex = 0;
  uint8_t modifier = 0;
  if (!parseLayerKey(cursor, layer, keyIndex) || !parseByte(cursor, modifier)) {
    Serial.println(F("ERR key"));
    return;
  }

  KeyAssignment assignment = blankAssignment();
  assignment.kind = AssignmentKind::Keyboard;
  assignment.modifier = modifier;

  uint8_t slot = 0;
  uint8_t keycode = 0;
  while (slot < Config::KEYBOARD_REPORT_SLOTS && parseByte(cursor, keycode)) {
    assignment.keycodes[slot] = keycode;
    slot++;
  }

  if (slot == 0) {
    Serial.println(F("ERR keycode"));
    return;
  }

  saveParsedAssignment(layer, keyIndex, assignment);
}

void handleConsumer(char*& cursor) {
  uint8_t layer = 0;
  uint8_t keyIndex = 0;
  uint16_t usage = 0;
  if (!parseLayerKey(cursor, layer, keyIndex) || !parseWord(cursor, usage)) {
    Serial.println(F("ERR consumer"));
    return;
  }

  saveParsedAssignment(layer, keyIndex, consumerAssignment(usage));
}

void handleCycle(char*& cursor) {
  uint8_t layer = 0;
  uint8_t keyIndex = 0;
  if (!parseLayerKey(cursor, layer, keyIndex)) {
    Serial.println(F("ERR cycle"));
    return;
  }

  saveParsedAssignment(layer, keyIndex, layerCycleAssignment());
}

void handleBack(char*& cursor) {
  uint8_t layer = 0;
  uint8_t keyIndex = 0;
  if (!parseLayerKey(cursor, layer, keyIndex)) {
    Serial.println(F("ERR back"));
    return;
  }

  saveParsedAssignment(layer, keyIndex, layerPreviousAssignment());
}

void handleHold(char*& cursor) {
  uint8_t layer = 0;
  uint8_t keyIndex = 0;
  uint8_t targetLayer = 0;
  if (!parseLayerKey(cursor, layer, keyIndex) || !parseByte(cursor, targetLayer) || targetLayer >= Config::LAYER_COUNT) {
    Serial.println(F("ERR hold"));
    return;
  }

  saveParsedAssignment(layer, keyIndex, momentaryLayerAssignment(targetLayer));
}

void handleColor(char*& cursor) {
  uint8_t layer = 0;
  LayerColor color = { 0, 0, 0 };
  if (!parseByte(cursor, layer) ||
      !parseByte(cursor, color.red) ||
      !parseByte(cursor, color.green) ||
      !parseByte(cursor, color.blue) ||
      layer >= Config::LAYER_COUNT) {
    Serial.println(F("ERR color"));
    return;
  }

  const LayerColor previousColor = layerColor(layer);
  setLayerColor(layer, color);
  if (!saveLayerColorToStorage(layer)) {
    setLayerColor(layer, previousColor);
    Serial.println(F("ERR storage"));
    return;
  }

  Serial.println(F("OK"));
}

void handleLayerEnabled(char*& cursor) {
  uint8_t layer = 0;
  bool enabled = false;
  if (!parseByte(cursor, layer) || !parseBoolean(cursor, enabled)) {
    Serial.println(F("ERR enabled"));
    return;
  }

  const uint8_t previousMask = enabledLayerMask();
  const uint8_t previousActiveLayer = activeLayer();
  const uint8_t previousPersistentLayer = persistentLayer();
  if (!setLayerEnabled(layer, enabled)) {
    Serial.println(F("ERR enabled"));
    return;
  }

  if (!saveEnabledLayerMaskToStorage()) {
    setEnabledLayerMask(previousMask);
    restoreActiveLayers(previousPersistentLayer, previousActiveLayer);
    Serial.println(F("ERR storage"));
    return;
  }

  Serial.print(F("OK enabledMask="));
  printHexByte(enabledLayerMask());
  Serial.print(F(" activeLayer="));
  Serial.println(activeLayer());
}

void handleEncoderReversed(char*& cursor) {
  bool reversed = false;
  if (!parseBoolean(cursor, reversed)) {
    Serial.println(F("ERR encoder-reversed"));
    return;
  }

  const bool previous = encoderReversed();
  setEncoderReversed(reversed);
  if (!saveEncoderReversedToStorage()) {
    setEncoderReversed(previous);
    Serial.println(F("ERR storage"));
    return;
  }

  Serial.println(F("OK"));
}

void handlePcbRevision(char*& cursor) {
  uint8_t revision = 0;
  if (!parseByte(cursor, revision)) {
    Serial.println(F("ERR pcb-revision"));
    return;
  }

  const uint8_t previous = pcbRevision();
  if (!setPcbRevision(revision)) {
    Serial.println(F("ERR pcb-revision"));
    return;
  }

  if (!savePcbRevisionToStorage()) {
    setPcbRevision(previous);
    Serial.println(F("ERR storage"));
    return;
  }

  beginKeyScanner();
  Serial.println(F("OK"));
}

void handleLedReversed(char*& cursor) {
  bool reversed = false;
  if (!parseBoolean(cursor, reversed)) {
    Serial.println(F("ERR led-reversed"));
    return;
  }

  const bool previous = statusLedReversed();
  setStatusLedReversed(reversed);
  if (!saveStatusLedReversedToStorage()) {
    setStatusLedReversed(previous);
    Serial.println(F("ERR storage"));
    return;
  }

  applyStatusLayerDisplayMode();
  Serial.println(F("OK"));
}

void handleLedBrightness(char*& cursor) {
  uint8_t brightness = 0;
  if (!parseByte(cursor, brightness) ||
      brightness > Config::MAX_STATUS_LED_BRIGHTNESS) {
    Serial.println(F("ERR led-brightness"));
    return;
  }

  const uint8_t previous = statusLedBrightness();
  setStatusLedBrightness(brightness);
  if (!saveStatusLedBrightnessToStorage()) {
    setStatusLedBrightness(previous);
    Serial.println(F("ERR storage"));
    return;
  }

  applyStatusLedBrightness();
  Serial.println(F("OK"));
}

void handleAnimation(char*& cursor) {
  uint8_t value = 0;
  if (!parseByte(cursor, value)) {
    Serial.println(F("ERR animation"));
    return;
  }

  const StatusKeyAnimation previous = statusKeyAnimation();
  if (!setStatusKeyAnimation(static_cast<StatusKeyAnimation>(value))) {
    Serial.println(F("ERR animation"));
    return;
  }

  if (!saveStatusKeyAnimationToStorage()) {
    setStatusKeyAnimation(previous);
    Serial.println(F("ERR storage"));
    return;
  }

  applyStatusKeyAnimation();
  Serial.println(F("OK"));
}

void handleAnimationBrightness(char*& cursor) {
  uint8_t brightness = 0;
  if (!parseByte(cursor, brightness) ||
      brightness > Config::MAX_STATUS_KEY_ANIMATION_BRIGHTNESS) {
    Serial.println(F("ERR animation-brightness"));
    return;
  }

  const uint8_t previous = statusKeyAnimationBrightness();
  setStatusKeyAnimationBrightness(brightness);
  if (!saveStatusKeyAnimationBrightnessToStorage()) {
    setStatusKeyAnimationBrightness(previous);
    Serial.println(F("ERR storage"));
    return;
  }

  applyStatusLedBrightness();
  Serial.println(F("OK"));
}

void handleLayerDisplay(char*& cursor) {
  uint8_t value = 0;
  if (!parseByte(cursor, value)) {
    Serial.println(F("ERR layer-display"));
    return;
  }

  const StatusLayerDisplayMode previous = statusLayerDisplayMode();
  if (!setStatusLayerDisplayMode(static_cast<StatusLayerDisplayMode>(value))) {
    Serial.println(F("ERR layer-display"));
    return;
  }

  if (!saveStatusLayerDisplayModeToStorage()) {
    setStatusLayerDisplayMode(previous);
    Serial.println(F("ERR storage"));
    return;
  }

  applyStatusLayerDisplayMode();
  Serial.println(F("OK"));
}

void handleTapDance(char*& cursor) {
  uint16_t termMs = 0;
  if (!parseWord(cursor, termMs)) {
    Serial.println(F("ERR tap-dance"));
    return;
  }

  const uint16_t previous = layerTapDanceTermMs();
  if (!setLayerTapDanceTermMs(termMs)) {
    Serial.println(F("ERR tap-dance"));
    return;
  }

  if (!saveLayerTapDanceTermToStorage()) {
    setLayerTapDanceTermMs(previous);
    Serial.println(F("ERR storage"));
    return;
  }

  Serial.println(F("OK"));
}

void handleReset(char*& cursor) {
  char* confirmation = nextToken(cursor);
  if (confirmation == nullptr || strcmp(confirmation, "confirm") != 0) {
    Serial.println(F("ERR reset requires: reset confirm"));
    return;
  }

  KeymapSnapshot previous;
  captureKeymapSnapshot(previous);
  resetKeymapToDefaults();
  if (!saveKeymapToStorage()) {
    restoreKeymapSnapshot(previous);
    Serial.println(F("ERR storage"));
    return;
  }

  applyStatusLedBrightness();
  applyStatusKeyAnimation();
  applyStatusLayerDisplayMode();
  beginKeyScanner();
  clearStatusLedPreview();
  Serial.println(F("OK reset"));
}

void handleDiag() {
  Serial.println(runKeymapStorageSelfTest() ? F("OK storage") : F("ERR storage"));
}

void handleBootloader() {
  Serial.println(F("OK bootloader"));
  Serial.flush();
  delay(100);
#if defined(ARDUINO_ARCH_RP2040)
  rp2040.rebootToBootloader();
#else
  Serial.println(F("ERR unsupported"));
#endif
}

void handleCommand(char* line) {
  char* cursor = line;
  char* command = nextToken(cursor);
  if (command == nullptr) {
    return;
  }

  if (strcmp(command, "probe") == 0) {
    handleProbe();
  } else if (strcmp(command, "help") == 0 || strcmp(command, "?") == 0) {
    printHelp();
  } else if (strcmp(command, "state") == 0) {
    handleState();
  } else if (strcmp(command, "dump") == 0) {
    handleDump();
  } else if (strcmp(command, "layer") == 0) {
    handleLayer(cursor);
  } else if (strcmp(command, "get") == 0) {
    handleGet(cursor);
  } else if (strcmp(command, "none") == 0) {
    handleNone(cursor);
  } else if (strcmp(command, "key") == 0) {
    handleKey(cursor);
  } else if (strcmp(command, "consumer") == 0) {
    handleConsumer(cursor);
  } else if (strcmp(command, "cycle") == 0) {
    handleCycle(cursor);
  } else if (strcmp(command, "back") == 0) {
    handleBack(cursor);
  } else if (strcmp(command, "hold") == 0) {
    handleHold(cursor);
  } else if (strcmp(command, "color") == 0) {
    handleColor(cursor);
  } else if (strcmp(command, "enabled") == 0) {
    handleLayerEnabled(cursor);
  } else if (strcmp(command, "encoder-reversed") == 0) {
    handleEncoderReversed(cursor);
  } else if (strcmp(command, "pcb-revision") == 0) {
    handlePcbRevision(cursor);
  } else if (strcmp(command, "led-reversed") == 0) {
    handleLedReversed(cursor);
  } else if (strcmp(command, "led-brightness") == 0) {
    handleLedBrightness(cursor);
  } else if (strcmp(command, "animation") == 0) {
    handleAnimation(cursor);
  } else if (strcmp(command, "animation-brightness") == 0) {
    handleAnimationBrightness(cursor);
  } else if (strcmp(command, "layer-display") == 0) {
    handleLayerDisplay(cursor);
  } else if (strcmp(command, "tap-dance") == 0) {
    handleTapDance(cursor);
  } else if (strcmp(command, "reset") == 0) {
    handleReset(cursor);
  } else if (strcmp(command, "diag") == 0) {
    handleDiag();
  } else if (strcmp(command, "bootloader") == 0) {
    handleBootloader();
  } else {
    Serial.println(F("ERR unknown"));
  }
  Serial.flush();
}

void printPrompt() {
  Serial.print(F("octgear> "));
  Serial.flush();
}

}  // namespace

void beginSerialRescue() {
  Serial.begin(SERIAL_BAUD);
}

void updateSerialRescue() {
  yield();

  while (Serial.available() > 0) {
    const char ch = static_cast<char>(Serial.read());
    if (ch == '\r') {
      continue;
    }

    if (ch == '\n') {
      lineBuffer[lineLength] = '\0';
      if (lineLength > 0) {
        lastSerialCommandMs = millis();
        handleCommand(lineBuffer);
      }
      lineLength = 0;
      if (lastSerialCommandMs != 0) {
        printPrompt();
      }
      continue;
    }

    if (lineLength < LINE_BUFFER_SIZE - 1) {
      lineBuffer[lineLength] = ch;
      lineLength++;
    } else {
      lineLength = 0;
      Serial.println(F("ERR line too long"));
      printPrompt();
    }
  }
}

bool serialRescueActive() {
  return lastSerialCommandMs != 0 && millis() - lastSerialCommandMs <= RESCUE_ACTIVE_TIMEOUT_MS;
}
