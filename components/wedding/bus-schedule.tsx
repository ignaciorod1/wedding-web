"use client";

import { Bus, MapPin, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WeddingDetails } from "@/lib/auth-context";

interface BusScheduleProps {
  weddingDetails: WeddingDetails;
}

// Helper function to generate Google Calendar URL
function generateGoogleCalendarUrl(
  title: string,
  description: string,
  location: string,
  startDate: string,
  startTime: string,
  endTime: string
): string {
  // Parse the wedding date and times
  // Assuming wedding_date is like "June 15, 2025" and times are like "18:00"
  const safeStartDate = startDate || "June 15, 2025";
  const safeStartTime = startTime || "18:00";
  const safeEndTime = endTime || "19:00";
  
  const eventDate = new Date(safeStartDate);
  const [startHour, startMin] = safeStartTime.split(":").map(Number);
  const [endHour, endMin] = safeEndTime.split(":").map(Number);

  const start = new Date(eventDate);
  start.setHours(startHour, startMin, 0);

  const end = new Date(eventDate);
  end.setHours(endHour, endMin, 0);

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
function generateICSFile(
  title: string,
  description: string,
  location: string,
  startDate: string,
  startTime: string,
  endTime: string
): string {
  const safeStartDate = startDate || "June 15, 2025";
  const safeStartTime = startTime || "18:00";
  const safeEndTime = endTime || "19:00";
  
  const eventDate = new Date(safeStartDate);
  const [startHour, startMin] = safeStartTime.split(":").map(Number);
  const [endHour, endMin] = safeEndTime.split(":").map(Number);

  const start = new Date(eventDate);
  start.setHours(startHour, startMin, 0);

  const end = new Date(eventDate);
  end.setHours(endHour, endMin, 0);

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

function ScheduleRow({
  title,
  startTime,
  startLocation,
  startMapsUrl,
  endTime,
  endLocation,
  endMapsUrl,
  weddingDate,
}: {
  title: string;
  startTime: string;
  startLocation: string;
  startMapsUrl: string;
  endTime: string;
  endLocation: string;
  endMapsUrl: string;
  weddingDate: string;
}) {
  const googleCalendarUrl = generateGoogleCalendarUrl(
    `Wedding Shuttle - ${title}`,
    `Shuttle bus service for the wedding. From ${startLocation} to ${endLocation}.`,
    startLocation,
    weddingDate,
    startTime,
    endTime
  );

  const icsFileUrl = generateICSFile(
    `Wedding Shuttle - ${title}`,
    `Shuttle bus service for the wedding. From ${startLocation} to ${endLocation}.`,
    startLocation,
    weddingDate,
    startTime,
    endTime
  );

  return (
    <div className="space-y-4">
      <h4 className="font-serif text-xl text-center text-foreground">{title}</h4>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2" />
        
        {/* Stops */}
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

      {/* Calendar buttons */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs h-8 gap-1.5 text-muted-foreground hover:text-foreground"
          asChild
        >
          <a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer">
            <Calendar className="w-3.5 h-3.5" />
            Google
          </a>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs h-8 gap-1.5 text-muted-foreground hover:text-foreground"
          asChild
        >
          <a href={icsFileUrl} download={`shuttle-${title.toLowerCase().replace(/\s+/g, "-")}.ics`}>
            <Calendar className="w-3.5 h-3.5" />
            Apple
          </a>
        </Button>
      </div>
    </div>
  );
}

export function BusSchedule({ weddingDetails }: BusScheduleProps) {
  // Safe defaults for wedding details
  const details = {
    couple_names: weddingDetails?.couple_names || "The Couple",
    wedding_date: weddingDetails?.wedding_date || "June 15, 2025",
    ceremony_venue: weddingDetails?.ceremony_venue || "Wedding Venue",
    ceremony_time: weddingDetails?.ceremony_time || "16:00",
    bus_pickup_time: weddingDetails?.bus_pickup_time || "18:00",
    bus_pickup_location: weddingDetails?.bus_pickup_location || "Pickup Location",
    bus_pickup_maps_url: weddingDetails?.bus_pickup_maps_url || "#",
    bus_pickup_arrival_time: weddingDetails?.bus_pickup_arrival_time || "18:30",
    bus_pickup_arrival_location: weddingDetails?.bus_pickup_arrival_location || "Wedding Venue",
    bus_pickup_arrival_maps_url: weddingDetails?.bus_pickup_arrival_maps_url || "#",
    bus_dropoff_time: weddingDetails?.bus_dropoff_time || "06:00",
    bus_dropoff_location: weddingDetails?.bus_dropoff_location || "Wedding Venue",
    bus_dropoff_maps_url: weddingDetails?.bus_dropoff_maps_url || "#",
    bus_dropoff_arrival_time: weddingDetails?.bus_dropoff_arrival_time || "06:30",
    bus_dropoff_arrival_location: weddingDetails?.bus_dropoff_arrival_location || "Hotel",
    bus_dropoff_arrival_maps_url: weddingDetails?.bus_dropoff_arrival_maps_url || "#",
  };

  // Wedding event calendar URLs
  const weddingGoogleCalendarUrl = generateGoogleCalendarUrl(
    `${details.couple_names} Wedding`,
    `Wedding ceremony and reception`,
    details.ceremony_venue,
    details.wedding_date,
    details.ceremony_time.replace(/[^0-9:]/g, "") || "16:00",
    "23:00"
  );

  const weddingIcsFileUrl = generateICSFile(
    `${details.couple_names} Wedding`,
    `Wedding ceremony and reception`,
    details.ceremony_venue,
    details.wedding_date,
    details.ceremony_time.replace(/[^0-9:]/g, "") || "16:00",
    "23:00"
  );

  return (
    <div className="space-y-6">
      {/* Pickup Schedule */}
      <ScheduleRow
        title="Pickup"
        startTime={details.bus_pickup_time}
        startLocation={details.bus_pickup_location}
        startMapsUrl={details.bus_pickup_maps_url}
        endTime={details.bus_pickup_arrival_time}
        endLocation={details.bus_pickup_arrival_location}
        endMapsUrl={details.bus_pickup_arrival_maps_url}
        weddingDate={details.wedding_date}
      />

      {/* Divider */}
      <div className="border-t border-border/50" />

      {/* Dropoff Schedule */}
      <ScheduleRow
        title="Drop off"
        startTime={details.bus_dropoff_time}
        startLocation={details.bus_dropoff_location}
        startMapsUrl={details.bus_dropoff_maps_url}
        endTime={details.bus_dropoff_arrival_time}
        endLocation={details.bus_dropoff_arrival_location}
        endMapsUrl={details.bus_dropoff_arrival_maps_url}
        weddingDate={details.wedding_date}
      />

      {/* Wedding Event Calendar */}
      <div className="border-t border-border/50 pt-4">
        <p className="text-xs text-center text-muted-foreground mb-2">
          Add the wedding to your calendar
        </p>
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8 gap-1.5 bg-transparent"
            asChild
          >
            <a href={weddingGoogleCalendarUrl} target="_blank" rel="noopener noreferrer">
              <Calendar className="w-3.5 h-3.5" />
              Google Calendar
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
              Apple Calendar
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
