"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SimpleLoginTest() {
  const [email, setEmail] = useState("adadad@gmail.com");
  const [password, setPassword] = useState("Password123");
  const { login, user, isAuthenticated, isLoading } = useAuth();

  const handleLogin = async () => {
    console.log("=== SIMPLE LOGIN TEST ===");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Current pathname:", window.location.pathname);

    try {
      const result = await login(email, password);
      console.log("Login result:", result);

      // Check state after login
      setTimeout(() => {
        console.log("=== AFTER LOGIN ===");
        console.log("Current URL:", window.location.href);
        console.log("Current pathname:", window.location.pathname);
        console.log("Cookies:", document.cookie);

        // Parse cookies to show specific tokens
        const cookies = document.cookie.split(";").reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split("=");
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);

        console.log("sessionToken cookie:", cookies.sessionToken);
        console.log("refreshToken cookie:", cookies.refreshToken);
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Simple Login Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Email:</label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Password:</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        <Button onClick={handleLogin} disabled={isLoading} className="w-full">
          {isLoading ? "Logging in..." : "Test Login"}
        </Button>

        <div className="p-3 bg-gray-100 rounded text-sm">
          <p>
            <strong>Status:</strong>{" "}
            {isLoading
              ? "Loading"
              : isAuthenticated
              ? "Authenticated"
              : "Not authenticated"}
          </p>
          {user && (
            <p>
              <strong>User:</strong> {user.firstName} {user.lastName}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
