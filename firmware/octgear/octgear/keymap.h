#pragma once

#include <Arduino.h>
#include "config.h"
#include "key_assignment.h"

struct LayerColor {
  uint8_t red;
  uint8_t green;
  uint8_t blue;
};

enum class StatusKeyAnimation : uint8_t {
  Ripple = 0,
  Disabled = 1,
  Flash = 2,
  Spark = 3,
};

enum class StatusLayerDisplayMode : uint8_t {
  Solid = 0,
  Pattern = 1,
};

struct KeymapSnapshot {
  KeyAssignment assignments[Config::LAYER_COUNT][Config::KEY_COUNT];
  LayerColor colors[Config::LAYER_COUNT];
  uint8_t activeLayerIndex;
  uint8_t persistentLayerIndex;
  uint8_t enabledMask;
  bool encoderReversedValue;
  bool statusLedReversedValue;
  uint8_t statusLedBrightnessValue;
  StatusKeyAnimation statusKeyAnimationValue;
  uint8_t statusKeyAnimationBrightnessValue;
  StatusLayerDisplayMode statusLayerDisplayModeValue;
  uint16_t layerTapDanceTermMsValue;
  uint8_t pcbRevisionValue;
};

void beginKeymap();
void resetKeymapToDefaults();
void captureKeymapSnapshot(KeymapSnapshot& snapshot);
void restoreKeymapSnapshot(const KeymapSnapshot& snapshot);
uint8_t activeLayer();
uint8_t persistentLayer();
void setActiveLayer(uint8_t layer);
void setTransientActiveLayer(uint8_t layer);
void restoreActiveLayers(uint8_t persistent, uint8_t active);
uint8_t enabledLayerMask();
bool layerEnabled(uint8_t layer);
bool setLayerEnabled(uint8_t layer, bool enabled);
void setEnabledLayerMask(uint8_t mask);
LayerColor layerColor(uint8_t layer);
bool setLayerColor(uint8_t layer, const LayerColor& color);
void resetLayerColors();
bool encoderReversed();
void setEncoderReversed(bool reversed);
bool statusLedReversed();
void setStatusLedReversed(bool reversed);
uint8_t statusLedBrightness();
void setStatusLedBrightness(uint8_t brightness);
uint8_t statusKeyAnimationBrightness();
void setStatusKeyAnimationBrightness(uint8_t brightness);
StatusKeyAnimation statusKeyAnimation();
bool setStatusKeyAnimation(StatusKeyAnimation animation);
StatusLayerDisplayMode statusLayerDisplayMode();
bool setStatusLayerDisplayMode(StatusLayerDisplayMode mode);
uint16_t layerTapDanceTermMs();
bool setLayerTapDanceTermMs(uint16_t termMs);
uint8_t pcbRevision();
bool setPcbRevision(uint8_t revision);
const KeyAssignment& assignmentFor(uint8_t layer, uint8_t keyIndex);
bool setAssignment(uint8_t layer, uint8_t keyIndex, const KeyAssignment& assignment);
void clearKeymap();
