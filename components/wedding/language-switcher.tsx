"use client";

import { useLanguage } from "@/lib/i18n";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      className={`fixed right-4 z-50 rounded-full border border-border/60 bg-background/80 px-3 py-2 text-xs shadow-sm backdrop-blur-sm ${className ?? ""}`}
    >
      <label className="sr-only" htmlFor="language">
        {t("language.label")}
      </label>
      <select
        id="language"
        value={language}
        onChange={(event) =>
          setLanguage(event.target.value as "es" | "de-CH")
        }
        className="bg-transparent text-foreground outline-none"
      >
        <option value="es">{t("language.es")}</option>
        <option value="de-CH">{t("language.de-CH")}</option>
      </select>
    </div>
  );
}

