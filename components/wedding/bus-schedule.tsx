"use client";

import { Bus, MapPin, ExternalLink } from "lucide-react";
import type { WeddingDetails } from "@/lib/auth-context";
import { useLanguage } from "@/lib/i18n";

interface BusScheduleProps {
  weddingDetails: WeddingDetails;
}

// Helper function to generate Google Calendar URL
function parseDateString(dateStr: string, timeStr: string) {
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  const monthMap: Record<string, number> = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
    enero: 0,
    febrero: 1,
    marzo: 2,
    abril: 3,
    mayo: 4,
    junio: 5,
    julio: 6,
    agosto: 7,
    septiembre: 8,
    octubre: 9,
    noviembre: 10,
    diciembre: 11,
    januar: 0,
    februar: 1,
    maerz: 2,
    märz: 2,
    april_de: 3,
    mai: 4,
    juni: 5,
    juli: 6,
    august_de: 7,
    september_de: 8,
    oktober: 9,
    november_de: 10,
    dezember: 11,
  };

  const normalized = trimmed
    .toLowerCase()
    .replace(/[.,]/g, "")
    .replace(/\s+/g, " ")
    .replace(" de ", " ")
    .trim();

  const parts = normalized.split(" ");
  let day = 0;
  let month: number | undefined;
  let year = 0;

  if (parts.length >= 3) {
    if (/^\d{1,2}$/.test(parts[0])) {
      day = Number(parts[0]);
      month = monthMap[parts[1]];
      year = Number(parts[2]);
    } else if (/^\d{1,2}$/.test(parts[1])) {
      month = monthMap[parts[0]];
      day = Number(parts[1]);
      year = Number(parts[2]);
    }
  }

  if (!day || month === undefined || !year) {
    const fallback = new Date(trimmed);
    if (Number.isNaN(fallback.getTime())) return null;
    const [hour, minute] = parseTime(timeStr);
    fallback.setHours(hour, minute, 0, 0);
    return fallback;
  }

  const [hour, minute] = parseTime(timeStr);
  return new Date(year, month, day, hour, minute, 0, 0);
}

function parseTime(timeStr: string) {
  const [rawHour, rawMinute] = timeStr.split(":");
  const hour = Number(rawHour);
  const minute = Number(rawMinute);
  return [
    Number.isFinite(hour) ? hour : 0,
    Number.isFinite(minute) ? minute : 0,
  ];
}

export function generateGoogleCalendarUrl(
  title: string,
  description: string,
  location: string,
  startDate: string,
  startTime: string,
  endTime: string
): string | null {
  const safeStartDate = startDate || "June 15, 2025";
  const safeStartTime = startTime || "18:00";
  const safeEndTime = endTime || "19:00";

  const start = parseDateString(safeStartDate, safeStartTime);
  const end = parseDateString(safeStartDate, safeEndTime);

  if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  // If end time is before start time, assume it's the next day
  if (end < start) {
    end.setDate(end.getDate() + 1);
  }

  const formatDate = (date: Date) =>
    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details: description,
    location: location,
    dates: `${formatDate(start)}/${formatDate(end)}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Helper function to generate ICS file for Apple Calendar
export function generateICSFile(
  title: string,
  description: string,
  location: string,
  startDate: string,
  startTime: string,
  endTime: string
): string | null {
  const safeStartDate = startDate || "June 15, 2025";
  const safeStartTime = startTime || "18:00";
  const safeEndTime = endTime || "19:00";

  const start = parseDateString(safeStartDate, safeStartTime);
  const end = parseDateString(safeStartDate, safeEndTime);

  if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  if (end < start) {
    end.setDate(end.getDate() + 1);
  }

  const formatDate = (date: Date) =>
    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding//Bus Schedule//EN
BEGIN:VEVENT
DTSTART:${formatDate(start)}
DTEND:${formatDate(end)}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
}

function ScheduleStop({
  time,
  location,
  mapsUrl,
  isStart,
}: {
  time: string;
  location: string;
  mapsUrl: string;
  isStart: boolean;
}) {
  return (
    <div className={`flex flex-col items-center text-center ${isStart ? "items-start text-left" : "items-end text-right"}`}>
      <span className="text-lg font-semibold text-foreground">{time}</span>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <MapPin className="w-3 h-3" />
        <span className="underline underline-offset-2 decoration-dotted">{location}</span>
        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>
    </div>
  );
}

function BusIcon() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Bus className="w-6 h-6 text-primary" />
      </div>
    </div>
  );
}

export function getBusDetails(
  weddingDetails?: WeddingDetails,
  defaults?: Partial<WeddingDetails>
) {
  return {
    couple_names:
      weddingDetails?.couple_names ||
      defaults?.couple_names ||
      "La pareja",
    wedding_date:
      weddingDetails?.wedding_date ||
      defaults?.wedding_date ||
      "June 6, 2026",
    ceremony_venue:
      weddingDetails?.ceremony_venue ||
      defaults?.ceremony_venue ||
      "Lugar de la boda",
    ceremony_address:
      weddingDetails?.ceremony_address || defaults?.ceremony_address || "",
    ceremony_time:
      weddingDetails?.ceremony_time || defaults?.ceremony_time || "18:00",
    reception_time:
      weddingDetails?.reception_time || defaults?.reception_time || "16:00",
    bus_pickup_time:
      weddingDetails?.bus_pickup_time || defaults?.bus_pickup_time || "",
    bus_pickup_location:
      weddingDetails?.bus_pickup_location ||
      defaults?.bus_pickup_location ||
      "Lugar de recogida",
    bus_pickup_maps_url: weddingDetails?.bus_pickup_maps_url || "#",
    bus_pickup_arrival_time:
      weddingDetails?.bus_pickup_arrival_time ||
      defaults?.bus_pickup_arrival_time ||
      "18:30",
    bus_dropoff_time:
      weddingDetails?.bus_dropoff_time || defaults?.bus_dropoff_time || "",
    bus_dropoff_location:
      weddingDetails?.bus_dropoff_location ||
      defaults?.bus_dropoff_location ||
      "Lugar de la boda",
    bus_dropoff_maps_url: weddingDetails?.bus_dropoff_maps_url || "#",
    bus_dropoff_arrival_time:
      weddingDetails?.bus_dropoff_arrival_time ||
      defaults?.bus_dropoff_arrival_time ||
      "06:30",
    bus_dropoff_arrival_location:
      weddingDetails?.bus_dropoff_arrival_location ||
      defaults?.bus_dropoff_arrival_location ||
      "Hotel",
    bus_dropoff_arrival_maps_url: weddingDetails?.bus_dropoff_arrival_maps_url || "#",
    end_time: weddingDetails?.end_time || defaults?.end_time || "23:00",
  };
}

function ScheduleRow({
  title,
  startTime,
  startLocation,
  startMapsUrl,
  endTime,
  endLocation,
  endMapsUrl,
}: {
  title: string;
  startTime: string;
  startLocation: string;
  startMapsUrl: string;
  endTime: string;
  endLocation: string;
  endMapsUrl: string;
}) {
  return (
    <div className="space-y-4">
      <h4 className="font-serif text-xl text-center text-foreground">{title}</h4>
      
      <div className="relative">
        <div className="relative flex items-center justify-between">
          <ScheduleStop
            time={startTime}
            location={startLocation}
            mapsUrl={startMapsUrl}
            isStart={true}
          />

          <BusIcon />

          <ScheduleStop
            time={endTime}
            location={endLocation}
            mapsUrl={endMapsUrl}
            isStart={false}
          />
        </div>
      </div>
    </div>
  );
}

export function BusSchedule({ weddingDetails }: BusScheduleProps) {
  // Safe defaults for wedding details
  const { t } = useLanguage();
  const details = getBusDetails(weddingDetails, {
    couple_names: t("defaults.couple"),
    ceremony_venue: t("defaults.venue"),
    bus_pickup_location: t("defaults.pickupLocation"),
    bus_dropoff_arrival_location: t("defaults.dropoffArrivalLocation"),
  });

  return (
    <div className="space-y-6">
      {/* Pickup Schedule */}
      <ScheduleRow
        title={t("bus.pickup")}
        startTime={details.bus_pickup_time}
        startLocation={details.bus_pickup_location}
        startMapsUrl={details.bus_pickup_maps_url}
        endTime={details.bus_pickup_arrival_time}
        endLocation={details.ceremony_venue}
        endMapsUrl={details.bus_pickup_maps_url}
      />

      {/* Divider */}
      <div className="border-t border-border/50" />

      {/* Dropoff Schedule */}
      <ScheduleRow
        title={t("bus.dropoff")}
        startTime={details.bus_dropoff_time}
        startLocation={details.ceremony_venue}
        startMapsUrl={details.bus_dropoff_arrival_maps_url}
        endTime={details.bus_dropoff_arrival_time}
        endLocation={details.bus_dropoff_arrival_location}
        endMapsUrl={details.bus_dropoff_arrival_maps_url}
      />
    </div>
  );
}
