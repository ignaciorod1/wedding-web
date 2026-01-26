"use client";

import React from "react"

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, KeyRound } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function LoginForm() {
  const [code, setCode] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();      
    setHasError(false);
    setIsLoading(true);

    const success = await login(code.trim());
    if (!success) {
      setHasError(true);
    }
    setIsLoading(false);
  };

  return (
    <section id="login" className="py-20 px-4">
      <div className="max-w-md mx-auto">
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
              <KeyRound className="w-6 h-6 text-primary" />
            </div>
              <CardTitle className="font-serif text-2xl font-normal">
              {t("login.title")}
              </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t("login.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium">
                  {t("login.label")}
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder={t("login.placeholder")}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="h-12 text-center tracking-widest uppercase bg-background"
                  required
                />
                <p className="text-xs text-muted-foreground text-center">
                  {t("login.helper")}
                </p>
              </div>

              {hasError && (
                <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p>{t("login.invalid")}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={isLoading || !code.trim()}
              >
                {isLoading ? t("login.verifying") : t("login.submit")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
