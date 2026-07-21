import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { en } from "./translations/en";
import { ja } from "./translations/ja";
import { it } from "./translations/it";
import { fr } from "./translations/fr";

export type Locale = "en" | "ja" | "it" | "fr";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  ja: "日本語",
  it: "Italiano",
  fr: "Français",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🇬🇧",
  ja: "🇯🇵",
  it: "🇮🇹",
  fr: "🇫🇷",
};

type Translations = Record<string, any>;

const translationMap: Record<Locale, Translations> = { en, ja, it, fr };

function getNestedValue(obj: any, path: string): string {
  const keys = path.split(".");
  let current = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return path;
    current = current[key];
  }
  return typeof current === "string" ? current : path;
}

type LanguageContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  tArray: (key: string) => string[];
};

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
  tArray: () => [],
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("maisone-locale") as Locale | null;
      if (stored && translationMap[stored]) {
        setLocaleState(stored);
      }
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("maisone-locale", l);
      document.documentElement.lang = l;
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      // Try selected locale first, fallback to English
      const value = getNestedValue(translationMap[locale], key);
      if (value !== key) return value;
      return getNestedValue(translationMap.en, key);
    },
    [locale]
  );

  const tArray = useCallback(
    (key: string): string[] => {
      const getArray = (obj: any, path: string) => {
        const keys = path.split(".");
        let current = obj;
        for (const k of keys) {
          if (current == null || typeof current !== "object") return null;
          current = current[k];
        }
        return Array.isArray(current) ? current : null;
      };

      const value = getArray(translationMap[locale], key);
      if (value) return value;
      return getArray(translationMap.en, key) || [];
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, tArray }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
