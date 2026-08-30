#include "status_led.h"

#include <Adafruit_NeoPixel.h>

#include "config.h"
#include "keymap.h"

namespace {

uint32_t lastUpdateMs = 0;
uint8_t colorWheelPosition = 0;
uint8_t keyRainbowPosition = 0;
bool idleShown = false;
bool previewActive = false;
uint8_t displayedLayer = 0xFF;
uint32_t displayedColor = 0;
uint32_t displayedPixelColors[Config::EXTERNAL_RGB_LED_COUNT] = {};
bool layerTransitionActive = false;
uint32_t layerTransitionStartMs = 0;
uint32_t layerTransitionLastFrameMs = 0;
uint32_t layerTransitionStartColor = 0;
uint32_t layerTransitionTargetColor = 0;
uint32_t layerTransitionStartPixelColors[Config::EXTERNAL_RGB_LED_COUNT] = {};
uint32_t layerTransitionTargetPixelColors[Config::EXTERNAL_RGB_LED_COUNT] = {};
bool remapperSessionActive = false;
uint32_t remapperAnimationStartMs = 0;
bool suspendOffShown = false;

struct KeyAnimationEvent {
  bool active;
  uint8_t center;
  uint32_t startMs;
  uint32_t targetColor;
  bool preserveBaseChannels;
  uint8_t rainbowPosition;
};

static_assert(Config::EXTERNAL_RGB_LED_COUNT > 0);
static_assert(Config::EXTERNAL_RGB_LED_COUNT == 4, "Layer patterns require four status LEDs");
static_assert(Config::LAYER_COUNT <= 8, "Layer pattern table supports up to eight layers");
static_assert(Config::STATUS_KEY_ANIMATION_SLOTS > 0);
KeyAnimationEvent keyAnimations[Config::STATUS_KEY_ANIMATION_SLOTS] = {};
uint8_t nextKeyAnimationSlot = 0;
uint32_t keyAnimationLastFrameMs = 0;
bool keyAnimationShown = false;
Adafruit_NeoPixel statusPixel(
  Config::EXTERNAL_RGB_LED_COUNT,
  Config::STATUS_LED_PIN,
  NEO_GRB + NEO_KHZ800
);
#if defined(PIN_NEOPIXEL)
Adafruit_NeoPixel builtInStatusPixel(1, PIN_NEOPIXEL, NEO_GRB + NEO_KHZ800);
#endif

uint8_t colorChannel(uint32_t color, uint8_t shift) {
  return static_cast<uint8_t>((color >> shift) & 0xFFU);
}

uint8_t scaleChannelForBrightness(uint8_t channel, uint8_t brightness) {
  return static_cast<uint8_t>(
    (static_cast<uint16_t>(channel) * brightness + 127U) / 255U
  );
}

uint32_t scalePixelColor(uint32_t color, uint8_t brightness) {
  return statusPixel.Color(
    scaleChannelForBrightness(colorChannel(color, 16), brightness),
    scaleChannelForBrightness(colorChannel(color, 8), brightness),
    scaleChannelForBrightness(colorChannel(color, 0), brightness)
  );
}

uint8_t physicalPixelIndex(uint8_t logicalPixel) {
  return statusLedReversed()
    ? static_cast<uint8_t>(Config::EXTERNAL_RGB_LED_COUNT - 1U - logicalPixel)
    : logicalPixel;
}

uint32_t layerAnimationTargetColor(const LayerColor& color) {
  const uint8_t peak = color.red > color.green
    ? (color.red > color.blue ? color.red : color.blue)
    : (color.green > color.blue ? color.green : color.blue);
  const uint8_t brightness = statusKeyAnimationBrightness();
  if (peak == 0 || brightness == 0) {
    return 0;
  }

  return statusPixel.Color(
    static_cast<uint8_t>(
      (static_cast<uint32_t>(color.red) * brightness + peak / 2U) / peak
    ),
    static_cast<uint8_t>(
      (static_cast<uint32_t>(color.green) * brightness + peak / 2U) / peak
    ),
    static_cast<uint8_t>(
      (static_cast<uint32_t>(color.blue) * brightness + peak / 2U) / peak
    )
  );
}

void writeDisplayedPixelColors() {
  for (uint8_t pixel = 0; pixel < Config::EXTERNAL_RGB_LED_COUNT; ++pixel) {
    statusPixel.setPixelColor(
      physicalPixelIndex(pixel),
      scalePixelColor(displayedPixelColors[pixel], statusLedBrightness())
    );
  }
  statusPixel.show();

#if defined(PIN_NEOPIXEL)
  if (PIN_NEOPIXEL != Config::STATUS_LED_PIN) {
    builtInStatusPixel.setPixelColor(
      0,
      scalePixelColor(displayedColor, statusLedBrightness())
    );
    builtInStatusPixel.show();
  }
#endif
}

void showPixelColors(
  const uint32_t colors[Config::EXTERNAL_RGB_LED_COUNT],
  uint32_t mirrorColor
) {
  displayedColor = mirrorColor;
  for (uint8_t pixel = 0; pixel < Config::EXTERNAL_RGB_LED_COUNT; ++pixel) {
    displayedPixelColors[pixel] = colors[pixel];
  }
  writeDisplayedPixelColors();
}

void showPixelColor(uint32_t color) {
  uint32_t colors[Config::EXTERNAL_RGB_LED_COUNT];
  for (uint8_t pixel = 0; pixel < Config::EXTERNAL_RGB_LED_COUNT; ++pixel) {
    colors[pixel] = color;
  }
  showPixelColors(colors, color);
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

uint8_t layerDisplayPattern(uint8_t layer) {
  // Bit 0 is logical LED 1 at the left edge. Comments show LED 1 -> LED 4.
  static constexpr uint8_t patterns[8] = {
    0b0001,  // 1000
    0b0010,  // 0100
    0b0100,  // 0010
    0b1000,  // 0001
    0b1110,  // 0111
    0b1101,  // 1011
    0b1011,  // 1101
    0b0111,  // 1110
  };
  return patterns[layer < 8 ? layer : 0];
}

void buildLayerPixelColors(
  uint8_t layer,
  const LayerColor& color,
  uint32_t colors[Config::EXTERNAL_RGB_LED_COUNT]
) {
  const uint32_t pixelColor = balancedPixelColor(color.red, color.green, color.blue);
  const uint8_t pattern = statusLayerDisplayMode() == StatusLayerDisplayMode::Pattern
    ? layerDisplayPattern(layer)
    : 0x0FU;
  for (uint8_t pixel = 0; pixel < Config::EXTERNAL_RGB_LED_COUNT; ++pixel) {
    colors[pixel] = (pattern & static_cast<uint8_t>(1U << pixel)) != 0
      ? pixelColor
      : 0;
  }
}

bool pixelColorsEqual(
  const uint32_t first[Config::EXTERNAL_RGB_LED_COUNT],
  const uint32_t second[Config::EXTERNAL_RGB_LED_COUNT]
) {
  for (uint8_t pixel = 0; pixel < Config::EXTERNAL_RGB_LED_COUNT; ++pixel) {
    if (first[pixel] != second[pixel]) {
      return false;
    }
  }
  return true;
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

uint8_t blendAnimationChannel(
  uint8_t base,
  uint8_t target,
  uint16_t strength
) {
  return static_cast<uint8_t>(
    (static_cast<uint32_t>(base) * (255U - strength) +
     static_cast<uint32_t>(target) * strength + 127U) / 255U
  );
}

uint32_t blendPixelColorToAnimation(
  uint32_t color,
  uint32_t targetColor,
  uint16_t strength,
  bool preserveBaseChannels
) {
  const uint32_t baseColor = scalePixelColor(color, statusLedBrightness());
  uint8_t targetRed = colorChannel(targetColor, 16);
  uint8_t targetGreen = colorChannel(targetColor, 8);
  uint8_t targetBlue = colorChannel(targetColor, 0);
  if (preserveBaseChannels) {
    const uint8_t baseRed = colorChannel(baseColor, 16);
    const uint8_t baseGreen = colorChannel(baseColor, 8);
    const uint8_t baseBlue = colorChannel(baseColor, 0);
    targetRed = targetRed > baseRed ? targetRed : baseRed;
    targetGreen = targetGreen > baseGreen ? targetGreen : baseGreen;
    targetBlue = targetBlue > baseBlue ? targetBlue : baseBlue;
  }

  return statusPixel.Color(
    blendAnimationChannel(
      colorChannel(baseColor, 16),
      targetRed,
      strength
    ),
    blendAnimationChannel(
      colorChannel(baseColor, 8),
      targetGreen,
      strength
    ),
    blendAnimationChannel(
      colorChannel(baseColor, 0),
      targetBlue,
      strength
    )
  );
}

uint8_t animationCenterForKey(uint8_t keyIndex) {
  const uint8_t lastPixel =
    static_cast<uint8_t>(Config::EXTERNAL_RGB_LED_COUNT - 1U);

  // Encoder CCW / CW / SW share the logical right-end LED.
  if (keyIndex >= Config::PHYSICAL_KEY_COUNT) {
    return lastPixel;
  }

  const uint8_t column = Config::KEY_MATRIX_COLUMNS[keyIndex];
  return column < Config::EXTERNAL_RGB_LED_COUNT ? column : lastPixel;
}

void cancelKeyAnimations() {
  for (uint8_t slot = 0; slot < Config::STATUS_KEY_ANIMATION_SLOTS; ++slot) {
    keyAnimations[slot].active = false;
  }
  keyAnimationLastFrameMs = 0;
  keyAnimationShown = false;
}

void startKeyAnimation(
  uint8_t keyIndex,
  uint32_t targetColor,
  bool preserveBaseChannels
) {
  const bool rainbow = statusKeyAnimation() == StatusKeyAnimation::Rainbow;
  if (
    statusKeyAnimation() == StatusKeyAnimation::Disabled ||
    statusKeyAnimationBrightness() == 0 ||
    (!rainbow && targetColor == 0)
  ) {
    return;
  }

  uint8_t slot = Config::STATUS_KEY_ANIMATION_SLOTS;
  for (uint8_t candidate = 0; candidate < Config::STATUS_KEY_ANIMATION_SLOTS; ++candidate) {
    if (!keyAnimations[candidate].active) {
      slot = candidate;
      break;
    }
  }

  if (slot == Config::STATUS_KEY_ANIMATION_SLOTS) {
    slot = nextKeyAnimationSlot;
    nextKeyAnimationSlot = static_cast<uint8_t>(
      (nextKeyAnimationSlot + 1U) % Config::STATUS_KEY_ANIMATION_SLOTS
    );
  }

  keyAnimations[slot] = {
    true,
    animationCenterForKey(keyIndex),
    millis(),
    targetColor,
    preserveBaseChannels,
    keyRainbowPosition,
  };
  keyRainbowPosition = static_cast<uint8_t>(keyRainbowPosition + 37U);
  keyAnimationLastFrameMs = 0;
}

uint32_t animationDurationMs(
  StatusKeyAnimation animation,
  const KeyAnimationEvent& event
) {
  if (animation == StatusKeyAnimation::Flash) {
    return Config::STATUS_KEY_FLASH_MS;
  }
  if (animation == StatusKeyAnimation::Spark) {
    return Config::STATUS_KEY_SPARK_MS;
  }
  if (animation == StatusKeyAnimation::Rainbow) {
    return Config::STATUS_KEY_RAINBOW_MS;
  }

  const uint8_t distanceToStart = event.center;
  const uint8_t distanceToEnd =
    static_cast<uint8_t>(Config::EXTERNAL_RGB_LED_COUNT - 1U - event.center);
  const uint8_t maximumDistance =
    distanceToStart > distanceToEnd ? distanceToStart : distanceToEnd;
  return Config::STATUS_KEY_RIPPLE_PULSE_MS +
         static_cast<uint32_t>(maximumDistance) * Config::STATUS_KEY_RIPPLE_STEP_MS;
}

uint16_t animationStrength(
  StatusKeyAnimation animation,
  const KeyAnimationEvent& event,
  uint8_t pixel,
  uint32_t elapsedMs
) {
  if (animation == StatusKeyAnimation::Flash) {
    return static_cast<uint16_t>(
      (Config::STATUS_KEY_FLASH_MS - elapsedMs) * 255U /
      Config::STATUS_KEY_FLASH_MS
    );
  }

  if (animation == StatusKeyAnimation::Rainbow) {
    return static_cast<uint16_t>(
      (Config::STATUS_KEY_RAINBOW_MS - elapsedMs) * 255U /
      Config::STATUS_KEY_RAINBOW_MS
    );
  }

  const uint8_t distance =
    pixel > event.center ? pixel - event.center : event.center - pixel;
  if (animation == StatusKeyAnimation::Spark) {
    const uint16_t temporalStrength = static_cast<uint16_t>(
      (Config::STATUS_KEY_SPARK_MS - elapsedMs) * 255U /
      Config::STATUS_KEY_SPARK_MS
    );
    const uint16_t spatialStrength = static_cast<uint16_t>(255U / (1U + distance * 2U));
    return static_cast<uint16_t>(
      (temporalStrength * spatialStrength + 127U) / 255U
    );
  }

  const uint32_t delayMs =
    static_cast<uint32_t>(distance) * Config::STATUS_KEY_RIPPLE_STEP_MS;
  if (elapsedMs < delayMs) {
    return 0;
  }

  const uint32_t localElapsedMs = elapsedMs - delayMs;
  if (localElapsedMs >= Config::STATUS_KEY_RIPPLE_PULSE_MS) {
    return 0;
  }

  return static_cast<uint16_t>(
    (Config::STATUS_KEY_RIPPLE_PULSE_MS - localElapsedMs) * 255U /
    Config::STATUS_KEY_RIPPLE_PULSE_MS
  );
}

void updateKeyAnimations() {
  const StatusKeyAnimation animation = statusKeyAnimation();
  if (animation == StatusKeyAnimation::Disabled) {
    if (keyAnimationShown) {
      writeDisplayedPixelColors();
    }
    cancelKeyAnimations();
    return;
  }

  const uint32_t now = millis();
  uint16_t weights[Config::EXTERNAL_RGB_LED_COUNT] = {};
  uint32_t weightedRed[Config::EXTERNAL_RGB_LED_COUNT] = {};
  uint32_t weightedGreen[Config::EXTERNAL_RGB_LED_COUNT] = {};
  uint32_t weightedBlue[Config::EXTERNAL_RGB_LED_COUNT] = {};
  bool preserveBaseChannels[Config::EXTERNAL_RGB_LED_COUNT];
  for (uint8_t pixel = 0; pixel < Config::EXTERNAL_RGB_LED_COUNT; ++pixel) {
    preserveBaseChannels[pixel] = true;
  }
  bool anyActive = false;

  for (uint8_t slot = 0; slot < Config::STATUS_KEY_ANIMATION_SLOTS; ++slot) {
    KeyAnimationEvent& event = keyAnimations[slot];
    if (!event.active) {
      continue;
    }

    const uint32_t elapsedMs = now - event.startMs;
    if (elapsedMs >= animationDurationMs(animation, event)) {
      event.active = false;
      continue;
    }

    anyActive = true;
    for (uint8_t pixel = 0; pixel < Config::EXTERNAL_RGB_LED_COUNT; ++pixel) {
      const uint16_t strength = animationStrength(animation, event, pixel, elapsedMs);
      if (strength == 0) {
        continue;
      }

      weights[pixel] = static_cast<uint16_t>(weights[pixel] + strength);
      const uint32_t targetColor = animation == StatusKeyAnimation::Rainbow
        ? scalePixelColor(
            colorWheel(static_cast<uint8_t>(
              event.rainbowPosition +
              pixel * (256U / Config::EXTERNAL_RGB_LED_COUNT)
            )),
            statusKeyAnimationBrightness()
          )
        : event.targetColor;
      weightedRed[pixel] +=
        static_cast<uint32_t>(colorChannel(targetColor, 16)) * strength;
      weightedGreen[pixel] +=
        static_cast<uint32_t>(colorChannel(targetColor, 8)) * strength;
      weightedBlue[pixel] +=
        static_cast<uint32_t>(colorChannel(targetColor, 0)) * strength;
      if (!event.preserveBaseChannels) {
        preserveBaseChannels[pixel] = false;
      }
    }
  }

  if (!anyActive) {
    if (keyAnimationShown) {
      writeDisplayedPixelColors();
    }
    keyAnimationLastFrameMs = 0;
    keyAnimationShown = false;
    return;
  }

  if (
    keyAnimationLastFrameMs != 0 &&
    now - keyAnimationLastFrameMs < Config::STATUS_LED_FRAME_MS
  ) {
    return;
  }

  keyAnimationLastFrameMs = now;
  for (uint8_t pixel = 0; pixel < Config::EXTERNAL_RGB_LED_COUNT; ++pixel) {
    if (weights[pixel] == 0) {
      statusPixel.setPixelColor(
        physicalPixelIndex(pixel),
        scalePixelColor(displayedPixelColors[pixel], statusLedBrightness())
      );
      continue;
    }

    const uint16_t strength = weights[pixel] > 255U ? 255U : weights[pixel];
    const uint32_t targetColor = statusPixel.Color(
      static_cast<uint8_t>(
        (weightedRed[pixel] + weights[pixel] / 2U) / weights[pixel]
      ),
      static_cast<uint8_t>(
        (weightedGreen[pixel] + weights[pixel] / 2U) / weights[pixel]
      ),
      static_cast<uint8_t>(
        (weightedBlue[pixel] + weights[pixel] / 2U) / weights[pixel]
      )
    );
    statusPixel.setPixelColor(
      physicalPixelIndex(pixel),
      blendPixelColorToAnimation(
        displayedPixelColors[pixel],
        targetColor,
        strength,
        preserveBaseChannels[pixel]
      )
    );
  }
  statusPixel.show();

#if defined(PIN_NEOPIXEL)
  if (PIN_NEOPIXEL != Config::STATUS_LED_PIN) {
    builtInStatusPixel.setPixelColor(
      0,
      scalePixelColor(displayedColor, statusLedBrightness())
    );
    builtInStatusPixel.show();
  }
#endif

  keyAnimationShown = true;
}

void cancelLayerTransition() {
  layerTransitionActive = false;
}

void startLayerTransition(uint8_t layer) {
  const LayerColor color = layerColor(layer);
  const uint32_t targetColor = balancedPixelColor(color.red, color.green, color.blue);
  buildLayerPixelColors(layer, color, layerTransitionTargetPixelColors);
  displayedLayer = layer;

  if (
    displayedColor == targetColor &&
    pixelColorsEqual(displayedPixelColors, layerTransitionTargetPixelColors)
  ) {
    cancelLayerTransition();
    showPixelColors(layerTransitionTargetPixelColors, targetColor);
    return;
  }

  layerTransitionStartColor = displayedColor;
  layerTransitionTargetColor = targetColor;
  for (uint8_t pixel = 0; pixel < Config::EXTERNAL_RGB_LED_COUNT; ++pixel) {
    layerTransitionStartPixelColors[pixel] = displayedPixelColors[pixel];
  }
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
    showPixelColors(layerTransitionTargetPixelColors, layerTransitionTargetColor);
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
  uint32_t frameColors[Config::EXTERNAL_RGB_LED_COUNT];
  for (uint8_t pixel = 0; pixel < Config::EXTERNAL_RGB_LED_COUNT; ++pixel) {
    frameColors[pixel] = interpolatePixelColor(
      layerTransitionStartPixelColors[pixel],
      layerTransitionTargetPixelColors[pixel],
      elapsedMs
    );
  }
  showPixelColors(
    frameColors,
    interpolatePixelColor(
      layerTransitionStartColor,
      layerTransitionTargetColor,
      elapsedMs
    )
  );
}

void setRescueLed() {
  showPixelColor(balancedPixelColor(0, Config::STATUS_RESCUE_GREEN, 0));
}

void showFlowingColorWheel(uint8_t position) {
  const uint8_t pixelSpacing = static_cast<uint8_t>(256U / Config::EXTERNAL_RGB_LED_COUNT);
  uint32_t colors[Config::EXTERNAL_RGB_LED_COUNT];
  for (uint8_t pixel = 0; pixel < Config::EXTERNAL_RGB_LED_COUNT; ++pixel) {
    colors[pixel] = colorWheel(static_cast<uint8_t>(position + pixel * pixelSpacing));
  }
  showPixelColors(colors, colorWheel(position));
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
  if (statusLayerDisplayMode() == StatusLayerDisplayMode::RainbowCycle) {
    cancelLayerTransition();
    idleShown = true;
    displayedLayer = layer;
    const uint32_t now = millis();
    if (lastUpdateMs == 0 || now - lastUpdateMs >= Config::STATUS_COLOR_WHEEL_MS) {
      lastUpdateMs = now;
      colorWheelPosition += 2;
      showFlowingColorWheel(colorWheelPosition);
      keyAnimationLastFrameMs = 0;
    }
    updateKeyAnimations();
    return;
  }

  if (!idleShown || displayedLayer != layer) {
    startLayerTransition(layer);
    idleShown = true;
  }
  updateLayerTransition();
  updateKeyAnimations();
  lastUpdateMs = 0;
}

}  // namespace

void beginStatusLed() {
  statusPixel.begin();
  statusPixel.setBrightness(255);

#if defined(PIN_NEOPIXEL)
  if (PIN_NEOPIXEL != Config::STATUS_LED_PIN) {
    builtInStatusPixel.begin();
    builtInStatusPixel.setBrightness(255);
  }
#endif

  setStatusLed(false);
}

void applyStatusLedBrightness() {
  writeDisplayedPixelColors();
  keyAnimationLastFrameMs = 0;
}

void setStatusLed(bool on) {
  cancelKeyAnimations();
  cancelLayerTransition();
  showPixelColor(on ? colorWheel(colorWheelPosition) : 0);

  if (!on) {
    displayedLayer = 0xFF;
  }
}

void previewStatusLedColor(
  uint8_t layer,
  uint8_t red,
  uint8_t green,
  uint8_t blue
) {
  cancelKeyAnimations();
  cancelLayerTransition();
  const LayerColor color = { red, green, blue };
  uint32_t colors[Config::EXTERNAL_RGB_LED_COUNT];
  buildLayerPixelColors(layer, color, colors);
  showPixelColors(colors, balancedPixelColor(red, green, blue));
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

void applyStatusKeyAnimation() {
  const bool restoreBaseColor = keyAnimationShown;
  cancelKeyAnimations();
  if (restoreBaseColor) {
    writeDisplayedPixelColors();
  }
}

void applyStatusLayerDisplayMode() {
  cancelKeyAnimations();
  cancelLayerTransition();
  previewActive = false;
  idleShown = false;
  displayedLayer = 0xFF;
  lastUpdateMs = 0;
}

void showStatusLedWebUsbLandingAcknowledgement() {
  cancelKeyAnimations();
  cancelLayerTransition();
  showPixelColor(balancedPixelColor(0, 160, 255));
  previewActive = true;
  idleShown = true;
  displayedLayer = 0xFF;
  lastUpdateMs = 0;
}

void triggerStatusLedKeyAnimation(uint8_t keyIndex) {
  if (keyIndex >= Config::KEY_COUNT) {
    return;
  }
  startKeyAnimation(
    keyIndex,
    layerAnimationTargetColor(layerColor(activeLayer())),
    false
  );
}

void triggerStatusLedLayerAnimation(uint8_t keyIndex, uint8_t layer) {
  if (keyIndex >= Config::KEY_COUNT || layer >= Config::LAYER_COUNT) {
    return;
  }

  startKeyAnimation(
    keyIndex,
    layerAnimationTargetColor(layerColor(layer)),
    false
  );
}

void updateStatusHeartbeat(
  bool mounted,
  bool suspended,
  bool remapperConnected,
  bool rescueActive,
  uint8_t layer
) {
  if (mounted && suspended) {
    remapperSessionActive = false;
    if (previewActive) {
      clearStatusLedPreview();
    }
    cancelKeyAnimations();
    cancelLayerTransition();
    if (!suspendOffShown) {
      setStatusLed(false);
      suspendOffShown = true;
    }
    idleShown = false;
    lastUpdateMs = 0;
    return;
  }

  suspendOffShown = false;

  if (!mounted) {
    remapperSessionActive = false;
    if (previewActive) {
      clearStatusLedPreview();
    }
    cancelKeyAnimations();
    cancelLayerTransition();
    updateColorWheelLed(true);
    return;
  }

  if (rescueActive) {
    remapperSessionActive = false;
    if (previewActive) {
      clearStatusLedPreview();
    }
    cancelKeyAnimations();
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
    cancelKeyAnimations();
    return;
  }

  if (millis() - remapperAnimationStartMs < Config::STATUS_REMAPPER_ANIMATION_MS) {
    cancelKeyAnimations();
    cancelLayerTransition();
    updateColorWheelLed(false);
    return;
  }

  updateLayerLed(layer);
}
