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

export function LoginForm() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const success = await login(code.trim());
    if (!success) {
      setError(
        "Invalid invitation code. Please check your invitation and try again."
      );
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
              Guest Login
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your personal invitation code to access event details
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium">
                  Invitation Code
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="e.g., SMITH2025"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="h-12 text-center tracking-widest uppercase bg-background"
                  required
                />
                <p className="text-xs text-muted-foreground text-center">
                  You can find your code on your printed invitation
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={isLoading || !code.trim()}
              >
                {isLoading ? "Verifying..." : "Access Event Details"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
