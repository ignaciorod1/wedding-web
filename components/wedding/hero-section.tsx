"use client";

import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/i18n";

export function HeroSection() {
  const { weddingDetails, guest } = useAuth();
  const { t } = useLanguage();

  const coupleName =
    weddingDetails?.couple_names ?? t("defaults.weddingTitle");
  const date = weddingDetails?.wedding_date ?? "";

  return (
    <section className="relative min-h-screen md:min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background VIDEO - loops automatically */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="fixed
          inset-0
          w-screen
          h-screen
          object-cover
          z-[-1]"
      >
        <source
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_M7YK86wYeG2RNtxWTHWJgj0SK8DG/ncV2k8Zke-UvJlCtNTH_uV/public/background2.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <p className="text-sm tracking-[0.3em] uppercase text-white/80 mb-6">
          {t("hero.tagline")}
        </p>

        <h1 className="font-serif text-6xl md:text-8xl font-light text-white mb-6 tracking-wide text-balance drop-shadow-lg">
          {coupleName}
        </h1>

        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="w-16 h-px bg-white/60" />
          <span className="text-white/80 text-2xl font-serif">•</span>
          <span className="w-16 h-px bg-white/60" />
        </div>

        <p className="text-xl md:text-2xl text-white/90 font-light tracking-wide">
          {date}
        </p>

        {!guest && (
          <p className="mt-12 text-sm text-white/70 max-w-md mx-auto leading-relaxed">
            {t("hero.helper")}
          </p>
        )}
      </div>
    </section>
  );
}
