"use client";

import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, Heart, Users, Bus, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  BusSchedule,
  generateGoogleCalendarUrl,
  generateICSFile,
  getBusDetails,
} from "@/components/wedding/bus-schedule";
import { useLanguage } from "@/lib/i18n";

export function RSVPForm() {
  const { guest, weddingDetails, rsvpResponse, submitRsvp } = useAuth();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [plusOneName, setPlusOneName] = useState(
    rsvpResponse?.plus_one_name ?? ""
  );
  const [dietaryRestrictions, setDietaryRestrictions] = useState(
    rsvpResponse?.dietary_restrictions ?? ""
  );
  const [message, setMessage] = useState(rsvpResponse?.message ?? "");
  const [needsBus, setNeedsBus] = useState<"true" | "false" | "null">(
    rsvpResponse?.needs_bus ?? "null"
  );
  const [showConfirmation, setShowConfirmation] = useState(!!rsvpResponse);
  const [postAcceptSaved, setPostAcceptSaved] = useState(false);
  const [isSavingPostAccept, setIsSavingPostAccept] = useState(false);

  useEffect(() => {
    if (rsvpResponse) {
      setShowConfirmation(true);
    }
  }, [rsvpResponse]);

  if (!guest || !weddingDetails) return null;

  const busDetails = getBusDetails(weddingDetails, {
    couple_names: t("defaults.couple"),
    ceremony_venue: t("defaults.venue"),
    bus_pickup_location: t("defaults.pickupLocation"),
    bus_pickup_arrival_location: t("defaults.pickupArrivalLocation"),
    bus_dropoff_location: t("defaults.dropoffLocation"),
    bus_dropoff_arrival_location: t("defaults.dropoffArrivalLocation"),
  });

  const handleRSVP = async (attending: boolean) => {
    setIsSubmitting(true);

    const success = await submitRsvp(
      attending,
      attending && plusOneName ? plusOneName : undefined,
      dietaryRestrictions || undefined,
      message || undefined,
      attending ? needsBus : "null"
    );

    if (success) {
      setShowConfirmation(true);
      if (attending) {
        setPostAcceptSaved(false);
      }
    }
    setIsSubmitting(false);
  };

  const handleBusPreferenceSelect = async (value: "true" | "false") => {
    const attendingState = rsvpResponse?.attending ?? true;
    setNeedsBus(value);
    setIsSavingPostAccept(true);
    const success = await submitRsvp(
      attendingState,
      plusOneName || undefined,
      dietaryRestrictions || undefined,
      message || undefined,
      attendingState ? value : "null"
    );
    if (success) {
      setPostAcceptSaved(true);
      window.setTimeout(() => setPostAcceptSaved(false), 2000);
    }
    setIsSavingPostAccept(false);
  };

  const saveDraftNow = async () => {
    const attendingState = rsvpResponse?.attending ?? true;
    setIsSavingPostAccept(true);
    const success = await submitRsvp(
      attendingState,
      plusOneName || undefined,
      dietaryRestrictions || undefined,
      message || undefined,
      attendingState ? needsBus : "null"
    );
    if (success) {
      setPostAcceptSaved(true);
      window.setTimeout(() => setPostAcceptSaved(false), 2000);
    }
    setIsSavingPostAccept(false);
  };

  if (showConfirmation && rsvpResponse) {
    const displayName = guest.name;
    const hotel = {
      name: "Hotel Cádiz Bahía",
      googleUrl: "https://maps.app.goo.gl/t4u3ver2mJzokUaj8",
      websiteUrl: "https://www.hotelcadizbahia.com/",
      bookingUrl:
        "https://www.booking.com/hotel/es/cadiz-bahia.es.html?aid=356935&label=metagha-link-MRES-hotel-8283925_dev-desktop_los-4_bw-56_dow-Tuesday_defdate-1_room-0_gstadt-2_rateid-public_aud-9183044718_gacid-21404702604_mcid-10_ppa-0_clrid-0_ad-1_gstkid-0_checkin-20260324_ppt-Ce_lp-2724_r-10069890879519705604&sid=d3c674d67672c61d95a0583d68bf1b5d&all_sr_blocks=828392550_347369089_2_33_0_403781&checkin=2026-03-24&checkout=2026-03-28&dest_id=8283925&dest_type=hotel&dist=0&group_adults=2&group_children=0&hapos=1&highlighted_blocks=828392550_347369089_2_33_0_403781&hpos=1&matching_block_id=828392550_347369089_2_33_0_403781&no_rooms=1&req_adults=2&req_children=0&room1=A%2CA&sb_price_type=total&sr_order=popularity&sr_pri_blocks=828392550_347369089_2_33_0_403781_45518&srepoch=1769469225&srpvid=45d9a350d9ef00d7&type=total&ucfs=1&",
      imageUrl:
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/419433655.jpg?k=a730670baf8c704dfbd0d541cd8ec5620ecdcc2a48537869519a761b75393e92&o=",
      discountCode: "BODAIGNACIOALBA",
    };

    const handleCopyCode = async () => {
      try {
        await navigator.clipboard.writeText(hotel.discountCode);
        setIsCopied(true);
        window.setTimeout(() => setIsCopied(false), 2000);
      } catch {
        setIsCopied(false);
      }
    };

    const weddingGoogleCalendarUrl = generateGoogleCalendarUrl(
      t("calendar.weddingTitle", { names: busDetails.couple_names }),
      t("calendar.weddingDetails"),
      busDetails.ceremony_venue,
      busDetails.wedding_date,
      busDetails.reception_time?.replace(/[^0-9:]/g, "") || "18:00",
      busDetails.end_time?.replace(/[^0-9:]/g, "") || "23:00"
    );

    const weddingIcsFileUrl = generateICSFile(
      t("calendar.weddingTitle", { names: busDetails.couple_names }),
      t("calendar.weddingDetails"),
      busDetails.ceremony_venue,
      busDetails.wedding_date,
      busDetails.reception_time?.replace(/[^0-9:]/g, "") || "18:00",
      busDetails.end_time?.replace(/[^0-9:]/g, "") || "23:00"
    );

    const pickupLocationForCalendar =
      busDetails.bus_pickup_location &&
      busDetails.bus_pickup_location !== t("defaults.pickupLocation")
        ? busDetails.bus_pickup_location
        : busDetails.bus_pickup_maps_url;

    const shuttleGoogleCalendarUrl = generateGoogleCalendarUrl(
      t("calendar.busTitle", { label: t("bus.pickup") }),
      t("calendar.busDetails", {
        from: busDetails.bus_pickup_location,
        to: busDetails.ceremony_venue,
      }),
      pickupLocationForCalendar,
      busDetails.wedding_date,
      busDetails.bus_pickup_time,
      busDetails.bus_pickup_arrival_time
    );

    const shuttleIcsFileUrl = generateICSFile(
      t("calendar.busTitle", { label: t("bus.pickup") }),
      t("calendar.busDetails", {
        from: busDetails.bus_pickup_location,
        to: busDetails.ceremony_venue,
      }),
      pickupLocationForCalendar,
      busDetails.wedding_date,
      busDetails.bus_pickup_time,
      busDetails.bus_pickup_arrival_time
    );


    return (
      <section className="py-16 px-4">
        <div className="max-w-lg mx-auto space-y-6">
          <Card className="border-border/50 text-center">
            <CardContent className="pt-8 pb-8">
              {rsvpResponse.attending ? (
                <>
                  <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-serif text-2xl mb-2 text-foreground">
                    {t("rsvp.confirmTitle")}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {t("rsvp.confirmBody", { name: displayName })}
                    {rsvpResponse.plus_one_name &&
                      ` ${t("rsvp.confirmPlusOne", {
                        plusOne: rsvpResponse.plus_one_name,
                      })}`}
                    {rsvpResponse.needs_bus === "true" &&
                      ` ${t("rsvp.confirmBus")}`}
                  </p>
                  {rsvpResponse.needs_bus === "true" && (
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        {t("rsvp.confirmBusDetails", {
                          time: busDetails.bus_pickup_time,
                          location: busDetails.bus_pickup_location,
                        })}{" "}
                        <a
                          href={busDetails.bus_pickup_maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2"
                        >
                          {t("hotel.google")}
                        </a>
                      </p>
                      <p>
                        {t("rsvp.confirmBusReturnDetails", {
                          time: busDetails.bus_dropoff_time,
                          location: busDetails.bus_dropoff_arrival_location,
                        })}{" "}
                        <a
                          href={busDetails.bus_dropoff_arrival_maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2"
                        >
                          {t("hotel.google")}
                        </a>
                      </p>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {t("rsvp.confirmDate", {
                      date: weddingDetails.wedding_date,
                    })}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6 bg-transparent"
                    onClick={() => {
                      setShowConfirmation(false);
                    }}
                  >
                    {t("rsvp.update")}
                  </Button>
                  <div className="mt-6 space-y-4 text-left">
                      <div className="space-y-2">
                        <Label htmlFor="dietary" className="text-sm font-medium">
                          {t("rsvp.dietary")}
                        </Label>
                        <Textarea
                          id="dietary"
                          placeholder={t("rsvp.dietaryPlaceholder")}
                          value={dietaryRestrictions}
                          onChange={(e) => setDietaryRestrictions(e.target.value)}
                          className="resize-none"
                          rows={2}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 bg-transparent"
                          onClick={() => void saveDraftNow()}
                        >
                          Guardar
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm font-medium">
                          {t("rsvp.message")}
                        </Label>
                        <Textarea
                          id="message"
                          placeholder={t("rsvp.messagePlaceholder")}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="resize-none"
                          rows={2}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 bg-transparent"
                          onClick={() => void saveDraftNow()}
                        >
                          Guardar
                        </Button>
                      </div>
                      <div className="space-y-4 p-4 bg-secondary/40 rounded-md">
                        <div className="flex items-center gap-2">
                          <Bus className="w-4 h-4 text-primary" />
                          <h4 className="font-serif text-base text-foreground">
                            {t("rsvp.busTitle")}
                          </h4>
                        </div>
                        <BusSchedule weddingDetails={weddingDetails} />
                        <div className="pt-3 border-t border-border/50">
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                              type="button"
                              variant={needsBus === "true" ? "default" : "outline"}
                              className="flex-1 h-11 gap-2"
                              onClick={() => void handleBusPreferenceSelect("true")}
                              disabled={isSavingPostAccept}
                            >
                              {t("rsvp.busYes")}
                            </Button>
                            <Button
                              type="button"
                              variant={needsBus === "false" ? "default" : "outline"}
                              className="flex-1 h-11 gap-2"
                              onClick={() => void handleBusPreferenceSelect("false")}
                              disabled={isSavingPostAccept}
                            >
                              {t("rsvp.busNo")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  {postAcceptSaved && (
                    <p className="mt-4 text-sm text-emerald-600">
                      {t("rsvp.saved")}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
                    <Heart className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-serif text-2xl mb-2 text-foreground">
                    {t("rsvp.missTitle")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("rsvp.missBody", { name: displayName })}
                  </p>
                  <div className="mt-6 space-y-4 text-left">
                    <div className="space-y-2">
                      <Label htmlFor="dietary" className="text-sm font-medium">
                        {t("rsvp.dietary")}
                      </Label>
                      <Textarea
                        id="dietary"
                        placeholder={t("rsvp.dietaryPlaceholder")}
                        value={dietaryRestrictions}
                        onChange={(e) => setDietaryRestrictions(e.target.value)}
                        className="resize-none"
                        rows={2}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 bg-transparent"
                        onClick={() => void saveDraftNow()}
                      >
                        Guardar
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium">
                        {t("rsvp.message")}
                      </Label>
                      <Textarea
                        id="message"
                        placeholder={t("rsvp.messagePlaceholder")}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="resize-none"
                        rows={2}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 bg-transparent"
                        onClick={() => void saveDraftNow()}
                      >
                        Guardar
                      </Button>
                    </div>
                    <div className="space-y-4 p-4 bg-secondary/40 rounded-md">
                      <div className="flex items-center gap-2">
                        <Bus className="w-4 h-4 text-primary" />
                        <h4 className="font-serif text-base text-foreground">
                          {t("rsvp.busTitle")}
                        </h4>
                      </div>
                      <BusSchedule weddingDetails={weddingDetails} />
                      <div className="pt-3 border-t border-border/50">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            type="button"
                            variant={needsBus === "true" ? "default" : "outline"}
                            className="flex-1 h-11 gap-2"
                            onClick={() => void handleBusPreferenceSelect("true")}
                            disabled={isSavingPostAccept}
                          >
                            {t("rsvp.busYes")}
                          </Button>
                          <Button
                            type="button"
                            variant={needsBus === "false" ? "default" : "outline"}
                            className="flex-1 h-11 gap-2"
                            onClick={() => void handleBusPreferenceSelect("false")}
                            disabled={isSavingPostAccept}
                          >
                            {t("rsvp.busNo")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {!rsvpResponse.attending && (
                <Button
                  variant="outline"
                  className="mt-6 bg-transparent"
                  onClick={() => {
                    setShowConfirmation(false);
                  }}
                >
                  {t("rsvp.update")}
                </Button>
              )}
            </CardContent>
          </Card>
          {rsvpResponse.attending &&
            weddingGoogleCalendarUrl &&
            weddingIcsFileUrl && (
              <Card className="border-border/50 text-center">
                <CardContent className="pt-6 pb-6 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Reserva la fecha: {weddingDetails.wedding_date}
                  </p>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {t("rsvp.addWedding")}
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8 gap-1.5 bg-transparent"
                        asChild
                      >
                        <a
                          href={weddingGoogleCalendarUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          {t("calendar.google")}
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8 gap-1.5 bg-transparent"
                        asChild
                      >
                        <a href={weddingIcsFileUrl} download="wedding.ics">
                          <Calendar className="w-3.5 h-3.5" />
                          {t("calendar.apple")}
                        </a>
                      </Button>
                    </div>
                  </div>
                  {rsvpResponse.needs_bus === "true" &&
                    shuttleGoogleCalendarUrl &&
                    shuttleIcsFileUrl && (
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          {t("rsvp.addShuttle")}
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-8 gap-1.5 bg-transparent"
                            asChild
                          >
                            <a
                              href={shuttleGoogleCalendarUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              {t("calendar.google")}
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-8 gap-1.5 bg-transparent"
                            asChild
                          >
                            <a
                              href={shuttleIcsFileUrl}
                              download="shuttle-pickup.ics"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              {t("calendar.apple")}
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            )}
          {rsvpResponse.attending && (
            <>
              <Card className="border-border/50">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="font-serif text-xl font-normal">
                    {t("hotel.title")}
                  </CardTitle>
                  <CardDescription>{t("hotel.stay")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img
                    src={hotel.imageUrl}
                    alt={hotel.name}
                    className="w-full h-44 object-cover rounded-lg"
                  />
                  <div className="text-center">
                    <p className="font-serif text-lg text-foreground">
                      {hotel.name}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 gap-1.5 bg-transparent"
                      asChild
                    >
                      <a href={hotel.googleUrl} target="_blank" rel="noopener noreferrer">
                        {t("hotel.google")}
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 gap-1.5 bg-transparent"
                      asChild
                    >
                      <a href={hotel.websiteUrl} target="_blank" rel="noopener noreferrer">
                        {t("hotel.website")}
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 gap-1.5 bg-transparent"
                      asChild
                    >
                      <a href={hotel.bookingUrl} target="_blank" rel="noopener noreferrer">
                        {t("hotel.booking")}
                      </a>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-secondary/30 px-3 py-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {t("hotel.discountLabel")}
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {hotel.discountCode}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 bg-transparent"
                      onClick={handleCopyCode}
                    >
                      {isCopied ? t("hotel.copied") : t("hotel.copy")}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="font-serif text-xl font-normal">
                    {t("gifts.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img
                    src="/galleta.jpg"
                    alt="Foto para regalos"
                    className="w-full h-48 object-contain rounded-lg bg-secondary/30"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    {t("gifts.message")}
                  </p>
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {t("gifts.ibanLabel")}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {weddingDetails.iban || t("gifts.ibanMissing")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-2">
            {t("rsvp.kicker")}
          </p>
          <h2 className="font-serif text-4xl font-light text-foreground">
            {t("rsvp.title")}
          </h2>
        </div>

        <Card className="border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-xl font-normal">
              {t("rsvp.hello", { name: guest.name })}
            </CardTitle>
            <CardDescription>{t("rsvp.question")}</CardDescription>
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <Button
                className="flex-1 h-12 gap-2"
                onClick={() => handleRSVP(true)}
                disabled={isSubmitting}
              >
                <CheckCircle2 className="w-5 h-5" />
                {isSubmitting ? t("rsvp.submitting") : t("rsvp.accept")}
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12 gap-2 bg-transparent"
                onClick={() => handleRSVP(false)}
                disabled={isSubmitting}
              >
                <XCircle className="w-5 h-5" />
                {t("rsvp.decline")}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {guest.plus_one_allowed && (
              <div className="space-y-2 p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="plusOneName" className="text-sm font-medium">
                    {t("rsvp.plusOne")}
                  </Label>
                </div>
                <Input
                  id="plusOneName"
                  placeholder={t("rsvp.plusOnePlaceholder")}
                  value={plusOneName}
                  onChange={(e) => setPlusOneName(e.target.value)}
                />
              </div>
            )}

            {rsvpResponse?.attending && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="dietary" className="text-sm font-medium">
                    {t("rsvp.dietary")}
                  </Label>
                  <Textarea
                    id="dietary"
                    placeholder={t("rsvp.dietaryPlaceholder")}
                    value={dietaryRestrictions}
                    onChange={(e) => setDietaryRestrictions(e.target.value)}
                    className="resize-none"
                    rows={2}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 bg-transparent"
                    onClick={() => void saveDraftNow()}
                  >
                    Guardar
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium">
                    {t("rsvp.message")}
                  </Label>
                  <Textarea
                    id="message"
                    placeholder={t("rsvp.messagePlaceholder")}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="resize-none"
                    rows={2}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 bg-transparent"
                    onClick={() => void saveDraftNow()}
                  >
                    Guardar
                  </Button>
                </div>

                {/* Bus Service Section */}
                <div className="space-y-4 p-4 bg-secondary/40 rounded-md">
                  <div className="flex items-center gap-2">
                    <Bus className="w-4 h-4 text-primary" />
                    <h4 className="font-serif text-base text-foreground">
                      {t("rsvp.busTitle")}
                    </h4>
                  </div>
                  <BusSchedule weddingDetails={weddingDetails} />

                  <div className="pt-3 border-t border-border/50">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        type="button"
                        variant={needsBus === "true" ? "default" : "outline"}
                        className="flex-1 h-11 gap-2"
                        onClick={() => void handleBusPreferenceSelect("true")}
                      >
                        {t("rsvp.busYes")}
                      </Button>
                      <Button
                        type="button"
                        variant={needsBus === "false" ? "default" : "outline"}
                        className="flex-1 h-11 gap-2"
                        onClick={() => void handleBusPreferenceSelect("false")}
                      >
                        {t("rsvp.busNo")}
                      </Button>
                    </div>
                  </div>
                </div>
                {postAcceptSaved && (
                  <p className="text-sm text-emerald-600">{t("rsvp.saved")}</p>
                )}
              </>
            )}

          </CardContent>
        </Card>
      </div>
    </section>
  );
}
