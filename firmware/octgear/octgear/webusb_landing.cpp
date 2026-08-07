#include "webusb_landing.h"

#include "Adafruit_TinyUSB.h"
#include "status_led.h"

#if defined(ARDUINO_ARCH_RP2040)
#include "hardware/structs/watchdog.h"
#endif

namespace {

constexpr uint32_t WEBUSB_BOOT_MAGIC = 0x4F475755UL;
constexpr uint32_t WEBUSB_BOOT_MAGIC_INVERSE = ~WEBUSB_BOOT_MAGIC;
constexpr uint8_t WEBUSB_BOOT_SCRATCH_INDEX = 0;
constexpr uint8_t WEBUSB_BOOT_GUARD_SCRATCH_INDEX = 1;

constexpr Config::KeyMask keyBit(uint8_t keyIndex) {
  return static_cast<Config::KeyMask>(1U << keyIndex);
}

constexpr Config::KeyMask WEBUSB_LANDING_SHORTCUT_MASK =
  keyBit(Config::WEBUSB_LANDING_KEY_1_INDEX) |
  keyBit(Config::WEBUSB_LANDING_KEY_2_INDEX) |
  keyBit(Config::ENCODER_SWITCH_KEY_INDEX);

static_assert(Config::WEBUSB_LANDING_KEY_1_INDEX < Config::PHYSICAL_KEY_COUNT);
static_assert(Config::WEBUSB_LANDING_KEY_2_INDEX < Config::PHYSICAL_KEY_COUNT);
static_assert(Config::ENCODER_SWITCH_KEY_INDEX < Config::KEY_COUNT);

WEBUSB_URL_DEF(
  octgearRemapperLandingPage,
  1,
  "studio-juh.github.io/octgear/octgear-remapper.html"
);

Adafruit_USBD_WebUSB webUsbLanding;
bool landingBoot = false;
bool shortcutHeld = false;
uint32_t shortcutStartedMs = 0;

bool consumeLandingBootRequest() {
#if defined(ARDUINO_ARCH_RP2040)
  const bool requested =
    watchdog_hw->scratch[WEBUSB_BOOT_SCRATCH_INDEX] == WEBUSB_BOOT_MAGIC &&
    watchdog_hw->scratch[WEBUSB_BOOT_GUARD_SCRATCH_INDEX] ==
      WEBUSB_BOOT_MAGIC_INVERSE;
  watchdog_hw->scratch[WEBUSB_BOOT_SCRATCH_INDEX] = 0;
  watchdog_hw->scratch[WEBUSB_BOOT_GUARD_SCRATCH_INDEX] = 0;
  return requested;
#else
  return false;
#endif
}

void rebootWithLandingPage() {
#if defined(ARDUINO_ARCH_RP2040)
  showStatusLedWebUsbLandingAcknowledgement();
  delay(Config::WEBUSB_LANDING_ACK_MS);
  watchdog_hw->scratch[WEBUSB_BOOT_SCRATCH_INDEX] = WEBUSB_BOOT_MAGIC;
  watchdog_hw->scratch[WEBUSB_BOOT_GUARD_SCRATCH_INDEX] =
    WEBUSB_BOOT_MAGIC_INVERSE;
  rp2040.reboot();
#endif
}

}  // namespace

bool beginWebUsbLanding() {
  const bool requested = consumeLandingBootRequest();
  if (!requested) {
    return false;
  }

  landingBoot = true;
  TinyUSBDevice.setDeviceVersion(Config::WEBUSB_LANDING_DEVICE_VERSION);
  webUsbLanding.setLandingPage(&octgearRemapperLandingPage);
  webUsbLanding.begin();
  return true;
}

bool updateWebUsbLandingShortcut(Config::KeyMask keyMask) {
  if (landingBoot || keyMask != WEBUSB_LANDING_SHORTCUT_MASK) {
    shortcutHeld = false;
    return false;
  }

  if (!shortcutHeld) {
    shortcutHeld = true;
    shortcutStartedMs = millis();
    return true;
  }

  if (millis() - shortcutStartedMs >= Config::WEBUSB_LANDING_HOLD_MS) {
    rebootWithLandingPage();
  }

  return true;
}
