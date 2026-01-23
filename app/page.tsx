"use client";

import { AuthProvider, useAuth } from "@/lib/auth-context";
import { HeroSection } from "@/components/wedding/hero-section";
import { LoginForm } from "@/components/wedding/login-form";
import { EventDetails } from "@/components/wedding/event-details";
import { RSVPForm } from "@/components/wedding/rsvp-form";
import { GuestHeader } from "@/components/wedding/guest-header";
import { Footer } from "@/components/wedding/footer";

function WeddingContent() {
  const { guest, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {guest && <GuestHeader />}
      <main className={guest ? "pt-16" : ""}>
        <HeroSection />
        
        {!guest ? (
          <LoginForm />
        ) : (
          <>
            <EventDetails />
            <RSVPForm />
          </>
        )}
        
        <Footer />
      </main>
    </>
  );
}

export default function WeddingPage() {
  return (
    <AuthProvider>
      <WeddingContent />
    </AuthProvider>
  );
}
