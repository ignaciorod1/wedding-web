"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";

export interface Guest {
  id: string;
  name: string;
  nickname?: string | null;
  code: string;
  plus_one_allowed: boolean;
  created_at: string;
}

export interface WeddingDetails {
  id: string;
  couple_names: string;
  wedding_date: string;
  ceremony_time: string;
  ceremony_venue: string;
  ceremony_address: string;
  reception_time: string;
  reception_venue: string;
  reception_address: string;
  cocktail_time?: string | null;
  banquet_time?: string | null;
  dance_time?: string | null;
  end_time?: string | null;
  dress_code: string;
  iban?: string | null;
  // Bus pickup details
  bus_pickup_time: string;
  bus_pickup_location: string;
  bus_pickup_maps_url: string;
  bus_pickup_arrival_time: string;
  bus_pickup_arrival_location: string;
  bus_pickup_arrival_maps_url: string;
  // Bus dropoff details
  bus_dropoff_time: string;
  bus_dropoff_location: string;
  bus_dropoff_maps_url: string;
  bus_dropoff_arrival_time: string;
  bus_dropoff_arrival_location: string;
  bus_dropoff_arrival_maps_url: string;
}

export interface RsvpResponse {
  id: string;
  guest_id: string;
  guest_name: string;
  guest_nickname: string | null;
  attending: boolean;
  plus_one_name: string | null;
  dietary_restrictions: string | null;
  message: string | null;
  needs_bus: boolean;
  responded_at: string;
}

interface AuthContextType {
  guest: Guest | null;
  weddingDetails: WeddingDetails | null;
  rsvpResponse: RsvpResponse | null;
  isLoading: boolean;
  login: (code: string) => Promise<boolean>;
  logout: () => void;
  submitRsvp: (attending: boolean, plusOneName?: string, dietary?: string, message?: string, needsBus?: boolean) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const RSVP_STORAGE_KEY = "wedding-rsvp-response";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [weddingDetails, setWeddingDetails] = useState<WeddingDetails | null>(null);
  const [rsvpResponse, setRsvpResponse] = useState<RsvpResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  const loadStoredRsvp = (guestId: string): RsvpResponse | null => {
    const raw = localStorage.getItem(RSVP_STORAGE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as RsvpResponse;
      if (parsed && parsed.guest_id === guestId) {
        return parsed;
      }
    } catch {
      // Ignore invalid cached data
    }
    return null;
  };

  // Fetch wedding details on mount
  useEffect(() => {
    async function fetchWeddingDetails() {
      const { data } = await supabase
        .from("wedding_details")
        .select("*")
        .limit(1)
        .single();
      
      if (data) {
        setWeddingDetails(data);
      }
    }
    fetchWeddingDetails();
  }, [supabase]);

  // Check for existing session on mount
  useEffect(() => {
    async function checkSession() {
      const savedGuestId = localStorage.getItem("wedding-guest-id");
      
      if (savedGuestId) {
        const { data: guestData } = await supabase
          .from("guests")
          .select("*")
          .eq("id", savedGuestId)
          .single();

        if (guestData) {
          setGuest(guestData);
          const storedRsvp = loadStoredRsvp(savedGuestId);
          if (storedRsvp) {
            setRsvpResponse(storedRsvp);
          }
          
          // Fetch existing RSVP response
          const { data: rsvpData } = await supabase
            .from("rsvp_responses")
            .select("*")
            .eq("guest_id", savedGuestId)
            .single();
          
          if (rsvpData) {
            setRsvpResponse(rsvpData);
          }
        }
      }
      setIsLoading(false);
    }
    checkSession();
  }, [supabase]);

  useEffect(() => {
    if (!guest) return;
    if (rsvpResponse) {
      localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(rsvpResponse));
    } else {
      localStorage.removeItem(RSVP_STORAGE_KEY);
    }
  }, [guest, rsvpResponse]);

  const login = async (code: string): Promise<boolean> => {
    const { data: guestData, error } = await supabase
      .from("guests")
      .select("*")
      .ilike("code", code.trim())
      .single();

    if (guestData) {
      setGuest(guestData);
      localStorage.setItem("wedding-guest-id", guestData.id);
      const storedRsvp = loadStoredRsvp(guestData.id);
      if (storedRsvp) {
        setRsvpResponse(storedRsvp);
      }
      
      // Check for existing RSVP
      const { data: rsvpData } = await supabase
        .from("rsvp_responses")
        .select("*")
        .eq("guest_id", guestData.id)
        .single();
      
      if (rsvpData) {
        setRsvpResponse(rsvpData);
      }
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setGuest(null);
    setRsvpResponse(null);
    localStorage.removeItem("wedding-guest-id");
    localStorage.removeItem(RSVP_STORAGE_KEY);
  };

  const submitRsvp = async (
    attending: boolean,
    plusOneName?: string,
    dietary?: string,
    message?: string,
    needsBus?: boolean
  ): Promise<boolean> => {
    if (!guest) {
      console.log("[v0] submitRsvp: No guest found");
      return false;
    }

    console.log("[v0] submitRsvp called with:", { attending, plusOneName, dietary, message, needsBus, guestId: guest.id });

    // Check if RSVP already exists
    const { data: existingRsvp, error: checkError } = await supabase
      .from("rsvp_responses")
      .select("*")
      .eq("guest_id", guest.id)
      .single();

    console.log("[v0] Existing RSVP check:", { existingRsvp, checkError });

    if (existingRsvp) {
      // Update existing RSVP
      const { data, error } = await supabase
        .from("rsvp_responses")
        .update({
          guest_name: guest.name,
          guest_nickname: guest.nickname || null,
          attending,
          plus_one_name: plusOneName || null,
          dietary_restrictions: dietary || null,
          message: message || null,
          needs_bus: needsBus || false,
        })
        .eq("guest_id", guest.id)
        .select()
        .single();

      console.log("[v0] Update RSVP result:", { data, error });
      if (error) {
        console.log("[v0] Update RSVP error:", error);
        return false;
      }
      setRsvpResponse(data);
    } else {
      // Create new RSVP
      const { data, error } = await supabase
        .from("rsvp_responses")
        .insert({
          guest_id: guest.id,
          guest_name: guest.name,
          guest_nickname: guest.nickname || null,
          attending,
          plus_one_name: plusOneName || null,
          dietary_restrictions: dietary || null,
          message: message || null,
          needs_bus: needsBus || false,
        })
        .select()
        .single();

      console.log("[v0] Insert RSVP result:", { data, error });
      if (error) {
        console.log("[v0] Insert RSVP error:", error);
        return false;
      }
      setRsvpResponse(data);
    }

    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        guest,
        weddingDetails,
        rsvpResponse,
        isLoading,
        login,
        logout,
        submitRsvp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
