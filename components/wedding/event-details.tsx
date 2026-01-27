"use client";

import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Clock,
  CalendarDays,
  Shirt,
  Heart,
  Landmark,
  Camera,
  Wine,
  UtensilsCrossed,
  Music,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function EventDetails() {
  const { guest, weddingDetails } = useAuth();
  const { t } = useLanguage();

  if (!guest || !weddingDetails) return null;

  return (
    <section className="py-16 px-4 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-2">
            {t("event.kicker")}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground">
            {t("event.title")}
          </h2>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-xl font-normal flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-accent" />
                </div>
                {t("event.venueTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">
                    {weddingDetails.wedding_date}
                  </p>
                  <p className="text-muted-foreground">
                    {weddingDetails.ceremony_time}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">
                    {weddingDetails.ceremony_venue}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {weddingDetails.ceremony_address}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-xl font-normal flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                {t("event.scheduleTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                {[
                  {
                    label: t("event.scheduleCeremony"),
                    value: weddingDetails.ceremony_time,
                    Icon: Heart,
                  },
                  {
                    label: t("event.scheduleReception"),
                    value: weddingDetails.reception_time,
                    Icon: Landmark,
                  },
                  {
                    label: t("event.scheduleCocktail"),
                    value: weddingDetails.cocktail_time,
                    Icon: Wine,
                  },
                  {
                    label: t("event.scheduleBanquet"),
                    value: weddingDetails.banquet_time,
                    Icon: UtensilsCrossed,
                  },
                  {
                    label: t("event.scheduleDance"),
                    value: weddingDetails.dance_time,
                    Icon: Music,
                  },
                  {
                    label: t("event.scheduleEnd"),
                    value: weddingDetails.end_time,
                    Icon: CalendarDays,
                  },
                ].map(({ label, value, Icon }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center text-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-full border border-border/60 bg-secondary/40 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {value || t("event.timeTbd")}
                    </div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dress Code */}
        <Card className="mt-6 border-border/50">
          <CardContent className="flex items-center justify-center gap-4 py-6">
            <Shirt className="w-5 h-5 text-accent" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{t("event.dressCode")}</p>
              <p className="font-medium text-foreground">
                {weddingDetails.dress_code}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
