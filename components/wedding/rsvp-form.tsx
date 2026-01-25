"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, Heart, Users, Bus } from "lucide-react";
import { Input } from "@/components/ui/input";

export function RSVPForm() {
  const { guest, weddingDetails, rsvpResponse, submitRsvp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [plusOneName, setPlusOneName] = useState(
    rsvpResponse?.plus_one_name ?? ""
  );
  const [dietaryRestrictions, setDietaryRestrictions] = useState(
    rsvpResponse?.dietary_restrictions ?? ""
  );
  const [message, setMessage] = useState(rsvpResponse?.message ?? "");
  const [needsBus, setNeedsBus] = useState(rsvpResponse?.needs_bus ?? false);
  const [showConfirmation, setShowConfirmation] = useState(!!rsvpResponse);

  if (!guest || !weddingDetails) return null;

  const handleRSVP = async (attending: boolean) => {
    setIsSubmitting(true);

    const success = await submitRsvp(
      attending,
      attending && plusOneName ? plusOneName : undefined,
      dietaryRestrictions || undefined,
      message || undefined,
      attending && needsBus ? needsBus : false
    );

    if (success) {
      setShowConfirmation(true);
    }
    setIsSubmitting(false);
  };

  if (showConfirmation && rsvpResponse) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-lg mx-auto">
          <Card className="border-border/50 text-center">
            <CardContent className="pt-8 pb-8">
              {rsvpResponse.attending ? (
                <>
                  <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-serif text-2xl mb-2 text-foreground">
                    {"We can't wait to see you!"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Thank you for confirming your attendance, {guest.name}.
                    {rsvpResponse.plus_one_name &&
                      ` We've noted that you'll be bringing ${rsvpResponse.plus_one_name}.`}
                    {rsvpResponse.needs_bus &&
                      ` We've reserved a spot for you on the shuttle bus.`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Mark your calendar for {weddingDetails.wedding_date}
                  </p>
                </>
              ) : (
                <>
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
                    <Heart className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-serif text-2xl mb-2 text-foreground">
                    {"We'll miss you!"}
                  </h3>
                  <p className="text-muted-foreground">
                    Thank you for letting us know, {guest.name}. {"You'll"} be
                    in our thoughts on our special day.
                  </p>
                </>
              )}
              <Button
                variant="outline"
                className="mt-6 bg-transparent"
                onClick={() => setShowConfirmation(false)}
              >
                Update Response
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-2">
            Kindly respond
          </p>
          <h2 className="font-serif text-4xl font-light text-foreground">
            RSVP
          </h2>
        </div>

        <Card className="border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-xl font-normal">
              Hello, {guest.name}
            </CardTitle>
            <CardDescription>
              Will you be joining us on our special day?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {guest.plus_one_allowed && (
              <div className="space-y-2 p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="plusOneName" className="text-sm font-medium">
                    {"Bringing a guest? Enter their name (+1)"}
                  </Label>
                </div>
                <Input
                  id="plusOneName"
                  placeholder="Guest's full name (leave blank if not bringing anyone)"
                  value={plusOneName}
                  onChange={(e) => setPlusOneName(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="dietary" className="text-sm font-medium">
                Dietary Restrictions (optional)
              </Label>
              <Textarea
                id="dietary"
                placeholder="Please let us know of any dietary restrictions or allergies..."
                value={dietaryRestrictions}
                onChange={(e) => setDietaryRestrictions(e.target.value)}
                className="resize-none"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium">
                Message for the couple (optional)
              </Label>
              <Textarea
                id="message"
                placeholder="Share a message or well wishes..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="resize-none"
                rows={2}
              />
            </div>

            {/* Bus Service Section */}
            <div className="space-y-4 p-4 bg-secondary/50 rounded-lg border border-border/50">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bus className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground mb-1">
                    Shuttle Bus Service
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    We are providing complimentary shuttle bus service for our guests.
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1 mb-3">
                    <p><span className="font-medium">Pick-up:</span> {weddingDetails.bus_pickup_schedule}</p>
                    <p><span className="font-medium">Drop-off:</span> {weddingDetails.bus_dropoff_schedule}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="needsBus"
                  checked={needsBus}
                  onCheckedChange={(checked) => setNeedsBus(checked === true)}
                />
                <Label htmlFor="needsBus" className="text-sm cursor-pointer">
                  {"Yes, I'd like to use the shuttle bus service"}
                </Label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="flex-1 h-12 gap-2"
                onClick={() => handleRSVP(true)}
                disabled={isSubmitting}
              >
                <CheckCircle2 className="w-5 h-5" />
                {isSubmitting ? "Submitting..." : "Joyfully Accept"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12 gap-2 bg-transparent"
                onClick={() => handleRSVP(false)}
                disabled={isSubmitting}
              >
                <XCircle className="w-5 h-5" />
                Regretfully Decline
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
