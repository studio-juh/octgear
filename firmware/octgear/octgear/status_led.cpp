#include "status_led.h"

#include <Adafruit_NeoPixel.h>

#include "config.h"
#include "keymap.h"

namespace {

uint32_t lastUpdateMs = 0;
uint8_t colorWheelPosition = 0;
bool idleShown = false;
bool previewActive = false;
uint8_t displayedLayer = 0xFF;
uint32_t displayedColor = 0;
bool layerTransitionActive = false;
uint32_t layerTransitionStartMs = 0;
uint32_t layerTransitionLastFrameMs = 0;
uint32_t layerTransitionStartColor = 0;
uint32_t layerTransitionTargetColor = 0;
bool remapperSessionActive = false;
uint32_t remapperAnimationStartMs = 0;
Adafruit_NeoPixel statusPixel(
  Config::EXTERNAL_RGB_LED_COUNT,
  Config::STATUS_LED_PIN,
  NEO_GRB + NEO_KHZ800
);
#if defined(PIN_NEOPIXEL)
Adafruit_NeoPixel builtInStatusPixel(1, PIN_NEOPIXEL, NEO_GRB + NEO_KHZ800);
#endif

void showPixelColor(uint32_t color) {
  displayedColor = color;
  for (uint8_t pixel = 0; pixel < Config::EXTERNAL_RGB_LED_COUNT; ++pixel) {
    statusPixel.setPixelColor(pixel, color);
  }
  statusPixel.show();

#if defined(PIN_NEOPIXEL)
  if (PIN_NEOPIXEL != Config::STATUS_LED_PIN) {
    builtInStatusPixel.setPixelColor(0, color);
    builtInStatusPixel.show();
  }
#endif
}

uint32_t balancedPixelColor(uint8_t red, uint8_t green, uint8_t blue) {
  const uint16_t total = static_cast<uint16_t>(red) + green + blue;
  if (total > 255) {
    red = static_cast<uint8_t>((static_cast<uint32_t>(red) * 255U + total / 2U) / total);
    green = static_cast<uint8_t>((static_cast<uint32_t>(green) * 255U + total / 2U) / total);
    blue = static_cast<uint8_t>((static_cast<uint32_t>(blue) * 255U + total / 2U) / total);
  }

  return statusPixel.Color(red, green, blue);
}

uint32_t colorWheel(uint8_t position) {
  position = 255 - position;

  if (position < 85) {
    return balancedPixelColor(255 - position * 3, 0, position * 3);
  }

  if (position < 170) {
    position -= 85;
    return balancedPixelColor(0, position * 3, 255 - position * 3);
  }

  position -= 170;
  return balancedPixelColor(position * 3, 255 - position * 3, 0);
}

void setLayerColorLed(const LayerColor& color) {
  showPixelColor(balancedPixelColor(color.red, color.green, color.blue));
}

uint8_t colorChannel(uint32_t color, uint8_t shift) {
  return static_cast<uint8_t>((color >> shift) & 0xFFU);
}

uint8_t interpolateChannel(uint8_t start, uint8_t target, uint32_t elapsedMs) {
  const int32_t delta = static_cast<int32_t>(target) - start;
  return static_cast<uint8_t>(
    static_cast<int32_t>(start) +
    delta * static_cast<int32_t>(elapsedMs) / Config::STATUS_LAYER_TRANSITION_MS
  );
}

uint32_t interpolatePixelColor(uint32_t start, uint32_t target, uint32_t elapsedMs) {
  return statusPixel.Color(
    interpolateChannel(colorChannel(start, 16), colorChannel(target, 16), elapsedMs),
    interpolateChannel(colorChannel(start, 8), colorChannel(target, 8), elapsedMs),
    interpolateChannel(colorChannel(start, 0), colorChannel(target, 0), elapsedMs)
  );
}

void cancelLayerTransition() {
  layerTransitionActive = false;
}

void startLayerTransition(uint8_t layer) {
  const LayerColor color = layerColor(layer);
  const uint32_t targetColor = balancedPixelColor(color.red, color.green, color.blue);
  displayedLayer = layer;

  if (displayedColor == targetColor) {
    cancelLayerTransition();
    showPixelColor(targetColor);
    return;
  }

  layerTransitionStartColor = displayedColor;
  layerTransitionTargetColor = targetColor;
  layerTransitionStartMs = millis();
  layerTransitionLastFrameMs = 0;
  layerTransitionActive = true;
}

void updateLayerTransition() {
  if (!layerTransitionActive) {
    return;
  }

  const uint32_t now = millis();
  const uint32_t elapsedMs = now - layerTransitionStartMs;
  if (elapsedMs >= Config::STATUS_LAYER_TRANSITION_MS) {
    showPixelColor(layerTransitionTargetColor);
    cancelLayerTransition();
    return;
  }

  if (
    layerTransitionLastFrameMs != 0 &&
    now - layerTransitionLastFrameMs < Config::STATUS_LED_FRAME_MS
  ) {
    return;
  }

  layerTransitionLastFrameMs = now;
  showPixelColor(
    interpolatePixelColor(layerTransitionStartColor, layerTransitionTargetColor, elapsedMs)
  );
}

void setRescueLed() {
  showPixelColor(balancedPixelColor(0, Config::STATUS_RESCUE_GREEN, 0));
}

void showFlowingColorWheel(uint8_t position) {
  const uint8_t pixelSpacing = static_cast<uint8_t>(256U / Config::EXTERNAL_RGB_LED_COUNT);
  displayedColor = colorWheel(position);

  for (uint8_t pixel = 0; pixel < Config::EXTERNAL_RGB_LED_COUNT; ++pixel) {
    statusPixel.setPixelColor(
      pixel,
      colorWheel(static_cast<uint8_t>(position + pixel * pixelSpacing))
    );
  }
  statusPixel.show();

#if defined(PIN_NEOPIXEL)
  if (PIN_NEOPIXEL != Config::STATUS_LED_PIN) {
    builtInStatusPixel.setPixelColor(0, displayedColor);
    builtInStatusPixel.show();
  }
#endif
}

void updateColorWheelLed(bool flowing) {
  idleShown = false;
  displayedLayer = 0xFF;
  const uint32_t now = millis();

  if (lastUpdateMs != 0 && now - lastUpdateMs < Config::STATUS_COLOR_WHEEL_MS) {
    return;
  }

  lastUpdateMs = now;
  colorWheelPosition += 2;
  if (flowing) {
    showFlowingColorWheel(colorWheelPosition);
  } else {
    showPixelColor(colorWheel(colorWheelPosition));
  }
}

void updateLayerLed(uint8_t layer) {
  if (!idleShown || displayedLayer != layer) {
    startLayerTransition(layer);
    idleShown = true;
  }
  updateLayerTransition();
  lastUpdateMs = 0;
}

}  // namespace

void beginStatusLed() {
  statusPixel.begin();
  statusPixel.setBrightness(statusLedBrightness());

#if defined(PIN_NEOPIXEL)
  if (PIN_NEOPIXEL != Config::STATUS_LED_PIN) {
    builtInStatusPixel.begin();
    builtInStatusPixel.setBrightness(statusLedBrightness());
  }
#endif

  setStatusLed(false);
}

void applyStatusLedBrightness() {
  statusPixel.setBrightness(statusLedBrightness());
#if defined(PIN_NEOPIXEL)
  if (PIN_NEOPIXEL != Config::STATUS_LED_PIN) {
    builtInStatusPixel.setBrightness(statusLedBrightness());
  }
#endif
  showPixelColor(displayedColor);
}

void setStatusLed(bool on) {
  cancelLayerTransition();
  showPixelColor(on ? colorWheel(colorWheelPosition) : 0);

  if (!on) {
    displayedLayer = 0xFF;
  }
}

void previewStatusLedColor(uint8_t red, uint8_t green, uint8_t blue) {
  cancelLayerTransition();
  setLayerColorLed({ red, green, blue });
  previewActive = true;
  idleShown = true;
  displayedLayer = 0xFF;
  lastUpdateMs = 0;
}

void clearStatusLedPreview() {
  cancelLayerTransition();
  previewActive = false;
  idleShown = false;
  displayedLayer = 0xFF;
  lastUpdateMs = 0;
}

void updateStatusHeartbeat(bool mounted, bool remapperConnected, bool rescueActive, uint8_t layer) {
  if (!mounted) {
    remapperSessionActive = false;
    if (previewActive) {
      clearStatusLedPreview();
    }
    cancelLayerTransition();
    updateColorWheelLed(true);
    return;
  }

  if (rescueActive) {
    remapperSessionActive = false;
    if (previewActive) {
      clearStatusLedPreview();
    }
    cancelLayerTransition();
    if (!idleShown) {
      setRescueLed();
      idleShown = true;
    }
    lastUpdateMs = 0;
    displayedLayer = 0xFF;
    return;
  }

  if (!remapperConnected) {
    remapperSessionActive = false;
    if (previewActive) {
      clearStatusLedPreview();
    }
    updateLayerLed(layer);
    return;
  }

  if (!remapperSessionActive) {
    remapperSessionActive = true;
    remapperAnimationStartMs = millis();
    lastUpdateMs = 0;
  }

  if (previewActive) {
    return;
  }

  if (millis() - remapperAnimationStartMs < Config::STATUS_REMAPPER_ANIMATION_MS) {
    cancelLayerTransition();
    updateColorWheelLed(false);
    return;
  }

  updateLayerLed(layer);
}
