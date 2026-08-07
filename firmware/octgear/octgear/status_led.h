#pragma once

#include <Arduino.h>

void beginStatusLed();
void setStatusLed(bool on);
void applyStatusLedBrightness();
void previewStatusLedColor(uint8_t layer, uint8_t red, uint8_t green, uint8_t blue);
void clearStatusLedPreview();
void applyStatusKeyAnimation();
void applyStatusLayerDisplayMode();
void showStatusLedWebUsbLandingAcknowledgement();
void triggerStatusLedKeyAnimation(uint8_t keyIndex);
void triggerStatusLedLayerAnimation(uint8_t keyIndex, uint8_t layer);
void updateStatusHeartbeat(
  bool mounted,
  bool suspended,
  bool remapperConnected,
  bool rescueActive,
  uint8_t layer
);
