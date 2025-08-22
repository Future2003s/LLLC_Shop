"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginTest() {
  const [email, setEmail] = useState("adadad@gmail.com");
  const [password, setPassword] = useState("Password123");
  const { login, user, isAuthenticated, isLoading, logout } = useAuth();

  const handleLogin = async () => {
    console.log("Attempting login with:", { email, password });
    const result = await login(email, password);
    console.log("Login result:", result);

    // Debug: Check if redirect happened
    setTimeout(() => {
      console.log("Current URL after login:", window.location.href);
      console.log("Current pathname:", window.location.pathname);
    }, 1000);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Test Login</CardTitle>
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

        <div className="flex gap-2">
          <Button onClick={handleLogin} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          {isAuthenticated && (
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          )}
        </div>

        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-medium mb-2">Status:</h3>
          <p>Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
          <p>Loading: {isLoading ? "Yes" : "No"}</p>
          {user && (
            <div className="mt-2">
              <p>
                User: {user.firstName} {user.lastName}
              </p>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
