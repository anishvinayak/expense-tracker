"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Brand from "@/components/brand";

export default function LoginPage() {
  const router = useRouter();

  const [googleLoading, setGoogleLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setError("");

    const res = await signIn("google", {
      redirect: false,
      callbackUrl: "/dashboard",
    });

    setGoogleLoading(false);

    if (res?.error) {
      setError("Google sign-in failed.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleGuestLogin() {
    setGuestLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      callbackUrl: "/dashboard",
    });

    setGuestLoading(false);

    if (res?.error) {
      setError("Guest account is unavailable.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        {/* Brand */}
        <div className="mb-8 flex justify-center">
          <Brand />
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Welcome to FlowLedger</h1>
          <p className="mt-2 text-zinc-400">
            Track every rupee. Know where it flows.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-white py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C17 3.1 14.7 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.7-4.1 9.7-9.8 0-.7-.1-1.2-.2-1.7H12z"
              />
            </svg>

            {googleLoading ? "Signing in..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-zinc-800" />
            <span className="text-xs text-zinc-500">OR</span>
            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          {/* Guest */}
          <button
            onClick={handleGuestLogin}
            disabled={guestLoading}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 py-3 font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50"
          >
            {guestLoading ? "Entering Demo..." : "Continue as Guest"}
          </button>
        </div>

        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-800/40 p-4 text-center">
          <p className="text-sm font-medium text-white">Demo Account</p>
          <p className="mt-1 text-xs text-zinc-400">
            Recruiters can explore the app instantly using the Guest button.
          </p>
        </div>
      </div>
    </div>
  );
}