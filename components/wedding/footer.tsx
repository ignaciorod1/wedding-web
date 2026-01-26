"use client";

import { useAuth } from "@/lib/auth-context";
import { Heart } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function Footer() {
  const { weddingDetails } = useAuth();
  const { t } = useLanguage();

  const name1 = weddingDetails?.couple_name_1 ?? "";
  const name2 = weddingDetails?.couple_name_2 ?? "";

  const coupleName =
    name1 && name2 ? `${name1} & ${name2}` : t("defaults.weddingTitle");

  const date = weddingDetails?.date ?? "";

  return (
    <footer className="relative overflow-hidden">
      {/* OVERLAY OSCURO */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* CONTENIDO */}
      <div className="relative z-10 py-12 px-4 border-t border-white/20 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-8 h-px bg-white/50" />
            <Heart className="w-4 h-4 text-white" />
            <span className="w-8 h-px bg-white/50" />
          </div>

          <p className="font-serif text-2xl mb-2">{coupleName}</p>
          <p className="text-sm text-white/80">{date}</p>

          <p className="text-xs text-white/70 mt-6">
            {t("footer.message")}
          </p>
        </div>
      </div>
    </footer>
  );
}
