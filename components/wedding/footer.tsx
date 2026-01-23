"use client";

import { useAuth } from "@/lib/auth-context";
import { Heart } from "lucide-react";

export function Footer() {
  const { weddingDetails } = useAuth();

  const coupleName = weddingDetails
    ? `${weddingDetails.couple_name_1} & ${weddingDetails.couple_name_2}`
    : "Our Wedding";

  const date = weddingDetails?.date ?? "";

  return (
    <footer className="py-12 px-4 border-t border-border/50">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="w-8 h-px bg-accent/50" />
          <Heart className="w-4 h-4 text-accent" />
          <span className="w-8 h-px bg-accent/50" />
        </div>
        <p className="font-serif text-2xl text-foreground mb-2">{coupleName}</p>
        <p className="text-sm text-muted-foreground">{date}</p>
        <p className="text-xs text-muted-foreground mt-6">
          With love and excitement, we look forward to celebrating with you.
        </p>
      </div>
    </footer>
  );
}
