#pragma once

#include <Arduino.h>

void beginStatusLed();
void setStatusLed(bool on);
void applyStatusLedBrightness();
void previewStatusLedColor(uint8_t red, uint8_t green, uint8_t blue);
void clearStatusLedPreview();
void triggerStatusLedKeyRipple(uint8_t keyIndex);
void updateStatusHeartbeat(bool mounted, bool remapperConnected, bool rescueActive, uint8_t layer);
