"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { BusFront, CheckCircle, LogOut, User, UserPlus, Wheat, XCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function GuestHeader() {
  const { guest, logout, rsvpResponse } = useAuth();
  const { t } = useLanguage();

  if (!guest) return null;

  const hasRsvp = Boolean(rsvpResponse);
  const isAttending = rsvpResponse?.attending;
  const needsBus = rsvpResponse?.needs_bus;
  const plusOneName = rsvpResponse?.plus_one_name;
  const dietary = rsvpResponse?.dietary_restrictions;
  const showDetails = hasRsvp && isAttending === true;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{guest.name}</p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>{t("header.guest")}</span>
              {hasRsvp && isAttending !== undefined && (
                <span
                  className={`inline-flex items-center gap-1 ${
                    isAttending ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {isAttending ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  <span className="hidden sm:inline">
                    {isAttending
                      ? t("header.inviteAccepted")
                      : t("header.inviteRejected")}
                  </span>
                </span>
              )}
              {showDetails && needsBus !== undefined && (
                <span
                  className={`inline-flex items-center gap-1 ${
                    needsBus ? "text-emerald-600" : "text-rose-600"
                  } ${needsBus ? "" : "line-through"}`}
                >
                  <BusFront className="w-3 h-3" />
                  <span className="hidden sm:inline">{t("header.bus")}</span>
                </span>
              )}
              {showDetails && plusOneName && (
                <span className="inline-flex items-center gap-1 text-emerald-600">
                  <UserPlus className="w-3 h-3" />
                  <span className="hidden sm:inline">
                    {t("header.plusOne", { name: plusOneName })}
                  </span>
                </span>
              )}
              {showDetails && dietary && (
                <span className="inline-flex items-center gap-1 text-amber-600">
                  <Wheat className="w-3 h-3" />
                  <span className="hidden sm:inline">{t("header.allergies")}</span>
                </span>
              )}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {t("header.signOut")}
        </Button>
      </div>
    </div>
  );
}
