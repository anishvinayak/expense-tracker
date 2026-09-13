"use client";

import { signOut } from "next-auth/react";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-6 py-4">
      <h2 className="text-xl font-semibold">Dashboard</h2>

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="rounded-lg bg-red-600 px-4 py-2 hover:bg-red-500"
      >
        Logout
      </button>
    </header>
  );
}