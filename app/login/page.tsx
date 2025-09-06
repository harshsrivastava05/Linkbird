"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [authView, setAuthView] = useState<"login" | "register">("login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);
    
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Invalid credentials. Please try again.");
    } else if (result?.ok) {
      router.push("/");
    }
  };

  const handleRegister = async () => {
    setError("");
    setIsLoading(true);

    try {
      // First, create the user via API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // If registration successful, sign them in
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Registration successful but login failed. Please try logging in.");
      } else if (result?.ok) {
        router.push("/");
      }
    } catch (error: any) {
      setError(error.message || "Registration failed. Please try again.");
    }

    setIsLoading(false);
  };

  const handleAuthAction = async () => {
    if (authView === "login") {
      await handleLogin();
    } else {
      await handleRegister();
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">
            {authView === "login" ? "Login" : "Register"}
          </CardTitle>
          <CardDescription>
            {authView === "login"
              ? "Enter your email below to login to your account"
              : "Enter your details to create an account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {authView === "register" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  id="first-name"
                  placeholder="Max"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  id="last-name"
                  placeholder="Robinson"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button onClick={handleAuthAction} className="w-full" disabled={isLoading}>
            {isLoading ? "Loading..." : authView === "login" ? "Login" : "Create an account"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            disabled={isLoading}
          >
            {authView === "login" ? "Login with Google" : "Sign up with Google"}
          </Button>
          <div className="mt-4 text-center text-sm">
            {authView === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <a
                  href="#"
                  className="underline"
                  onClick={() => setAuthView("register")}
                >
                  Sign up
                </a>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <a
                  href="#"
                  className="underline"
                  onClick={() => setAuthView("login")}
                >
                  Login
                </a>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}