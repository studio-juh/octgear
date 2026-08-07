#pragma once

#include <Arduino.h>

void beginKeymapStorage();
bool loadKeymapFromStorage();
bool saveKeymapToStorage();
bool saveAssignmentToStorage(uint8_t layer, uint8_t keyIndex);
bool saveEnabledLayerMaskToStorage();
bool saveLayerColorToStorage(uint8_t layer);
bool saveEncoderReversedToStorage();
bool saveStatusLedReversedToStorage();
bool saveStatusLedBrightnessToStorage();
bool saveStatusKeyAnimationToStorage();
bool saveStatusKeyAnimationBrightnessToStorage();
bool saveStatusLayerDisplayModeToStorage();
bool saveLayerTapDanceTermToStorage();
void scheduleActiveLayerSave();
void updateKeymapStorage();
bool runKeymapStorageSelfTest();
