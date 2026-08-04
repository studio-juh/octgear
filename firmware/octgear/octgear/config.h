#pragma once

#include <Arduino.h>
#include "generated_hardware_config.h"

namespace Config {

constexpr uint8_t KEYBOARD_REPORT_SLOTS = 6;
constexpr uint8_t CONFIG_REPORT_SIZE = 32;

constexpr uint8_t STATUS_LED_PIN = EXTERNAL_RGB_LED_PIN;
constexpr uint8_t STATUS_RESCUE_GREEN = 18;

constexpr uint16_t DEBOUNCE_US = 5000;
constexpr uint16_t IDLE_SCAN_SLEEP_US = 100;
constexpr uint16_t REMAPPER_SCAN_SLEEP_US = 1000;
constexpr uint16_t LAYER_TAP_DANCE_TERM_MS = 250;
constexpr uint16_t STATUS_COLOR_WHEEL_MS = 40;
constexpr uint16_t STATUS_LAYER_TRANSITION_MS = 200;
constexpr uint16_t STATUS_LED_FRAME_MS = 20;
constexpr uint16_t STATUS_KEY_RIPPLE_STEP_MS = 45;
constexpr uint16_t STATUS_KEY_RIPPLE_PULSE_MS = 160;
constexpr uint16_t STATUS_KEY_FLASH_MS = 180;
constexpr uint16_t STATUS_KEY_SPARK_MS = 240;
constexpr uint8_t STATUS_KEY_ANIMATION_SLOTS = 8;
constexpr uint16_t STATUS_REMAPPER_ANIMATION_MS = 1000;
constexpr uint16_t REMAPPER_HEARTBEAT_TIMEOUT_MS = 3000;
constexpr uint32_t ACTIVE_LAYER_SAVE_DELAY_MS = 10000;
constexpr uint8_t CONFIG_RESPONSE_READY_RETRIES = 20;
constexpr uint16_t CONFIG_RESPONSE_RETRY_DELAY_US = 100;

constexpr bool README_DRIVE_ENABLED = false;
constexpr uint8_t README_DRIVE_ENABLE_KEY_INDEX = 4;
constexpr const char* REMAPPER_URL = "https://studio-juh.github.io/octgear/";

}  // namespace Config
