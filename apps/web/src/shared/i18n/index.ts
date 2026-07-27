import { useSyncExternalStore } from "react";

import { en } from "./en";
import { ja } from "./ja";

export type Locale = "ja" | "en";
export type Messages = typeof ja;

export const messages = {
  ja,
  en,
} satisfies Record<Locale, Messages>;

export const DEFAULT_LOCALE: Locale = "ja";
export const LOCALE_STORAGE_KEY = "studio-juh.locale";

const localeListeners = new Set<() => void>();
let currentLocale = loadLocale();

export let t: Messages = messages[currentLocale];

syncDocumentLanguage(currentLocale);

export function getLocale() {
  return currentLocale;
}

export function setLocale(locale: Locale) {
  if (locale === currentLocale) {
    return;
  }

  currentLocale = locale;
  t = messages[locale];
  syncDocumentLanguage(locale);

  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Language switching still works when storage is unavailable.
  }

  localeListeners.forEach((listener) => listener());
}

export function useI18n() {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getLocale,
    () => DEFAULT_LOCALE,
  );

  return {
    locale,
    setLocale,
    t: messages[locale],
  };
}

function subscribeToLocale(listener: () => void) {
  localeListeners.add(listener);
  return () => localeListeners.delete(listener);
}

function loadLocale(): Locale {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  try {
    const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return storedLocale === "ja" || storedLocale === "en"
      ? storedLocale
      : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

function syncDocumentLanguage(locale: Locale) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = locale;
  }
}
