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
  dress_code: string;
}

export interface RsvpResponse {
  id: string;
  guest_id: string;
  guest_name: string;
  attending: boolean;
  plus_one_name: string | null;
  dietary_restrictions: string | null;
  message: string | null;
  responded_at: string;
}

interface AuthContextType {
  guest: Guest | null;
  weddingDetails: WeddingDetails | null;
  rsvpResponse: RsvpResponse | null;
  isLoading: boolean;
  login: (code: string) => Promise<boolean>;
  logout: () => void;
  submitRsvp: (attending: boolean, plusOneName?: string, dietary?: string, message?: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [weddingDetails, setWeddingDetails] = useState<WeddingDetails | null>(null);
  const [rsvpResponse, setRsvpResponse] = useState<RsvpResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

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

  const login = async (code: string): Promise<boolean> => {
    const { data: guestData, error } = await supabase
      .from("guests")
      .select("*")
      .ilike("code", code.trim())
      .single();

    if (guestData) {
      setGuest(guestData);
      localStorage.setItem("wedding-guest-id", guestData.id);
      
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
  };

  const submitRsvp = async (
    attending: boolean,
    plusOneName?: string,
    dietary?: string,
    message?: string
  ): Promise<boolean> => {
    if (!guest) return false;

    console.log("[v0] Submitting RSVP for guest:", guest.id, { attending, plusOneName, dietary, message });

    // Check if RSVP already exists
    const { data: existingRsvp } = await supabase
      .from("rsvp_responses")
      .select("*")
      .eq("guest_id", guest.id)
      .single();

    console.log("[v0] Existing RSVP check:", existingRsvp);

    if (existingRsvp) {
      // Update existing RSVP
      const { data, error } = await supabase
        .from("rsvp_responses")
        .update({
          guest_name: guest.name,
          attending,
          plus_one_name: plusOneName || null,
          dietary_restrictions: dietary || null,
          message: message || null,
        })
        .eq("guest_id", guest.id)
        .select()
        .single();

      console.log("[v0] Update RSVP result - data:", data, "error:", error);
      if (error) return false;
      setRsvpResponse(data);
    } else {
      // Create new RSVP
      const { data, error } = await supabase
        .from("rsvp_responses")
        .insert({
          guest_id: guest.id,
          guest_name: guest.name,
          attending,
          plus_one_name: plusOneName || null,
          dietary_restrictions: dietary || null,
          message: message || null,
        })
        .select()
        .single();

      console.log("[v0] Insert RSVP result - data:", data, "error:", error);
      if (error) return false;
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
