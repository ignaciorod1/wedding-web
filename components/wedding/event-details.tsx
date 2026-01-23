"use client";

import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, CalendarDays, Shirt } from "lucide-react";

export function EventDetails() {
  const { guest, weddingDetails } = useAuth();

  if (!guest || !weddingDetails) return null;

  return (
    <section className="py-16 px-4 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-2">
            Event Information
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground">
            Ceremony & Reception
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Ceremony Card */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-xl font-normal flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-accent" />
                </div>
                The Ceremony
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">
                    {weddingDetails.date}
                  </p>
                  <p className="text-muted-foreground">{weddingDetails.time}</p>
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

          {/* Reception Card */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-xl font-normal flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                The Reception
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">
                    Following the ceremony
                  </p>
                  <p className="text-muted-foreground">
                    {weddingDetails.reception_time}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">
                    {weddingDetails.reception_venue}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {weddingDetails.reception_address}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dress Code */}
        <Card className="mt-6 border-border/50">
          <CardContent className="flex items-center justify-center gap-4 py-6">
            <Shirt className="w-5 h-5 text-accent" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Dress Code</p>
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
