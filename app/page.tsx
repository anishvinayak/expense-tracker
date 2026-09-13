import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Wallet, PieChart, ShieldCheck, TrendingUp } from "lucide-react";

import { authOptions } from "@/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 py-12">
        {/* Navbar */}
        <nav className="mb-20 flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/30">
              <Wallet className="h-6 w-6 text-white" />
            </div>

            <div>
              <h1 className="text-xl font-bold">FlowLedger</h1>
              <p className="text-xs text-zinc-400">
                Track every rupee. Know where it flows.
              </p>
            </div>
          </div>

          <Link
            href="/login"
            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm transition hover:bg-zinc-800"
          >
            Sign In
          </Link>
        </nav>

        {/* Hero */}
        <section className="max-w-3xl text-center">
          <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-sm text-indigo-300">
            Personal Finance Dashboard
          </span>

          <h2 className="mt-6 text-5xl font-extrabold leading-tight sm:text-6xl">
            Your money deserves a better dashboard.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            FlowLedger helps you track expenses, monitor budgets, and visualize
            your spending with a clean fintech-inspired dashboard.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="rounded-xl bg-indigo-600 px-8 py-4 font-semibold transition hover:bg-indigo-500"
            >
              Continue with Google
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-8 py-4 font-semibold transition hover:bg-zinc-800"
            >
              Try Guest Demo
            </Link>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="mt-24 grid w-full gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<PieChart className="h-7 w-7 text-indigo-400" />}
            title="Smart Analytics"
            description="Interactive pie charts and monthly spending trends help you understand exactly where your money goes."
          />

          <FeatureCard
            icon={<TrendingUp className="h-7 w-7 text-green-400" />}
            title="Budget Tracking"
            description="Set monthly budgets and instantly see your spending progress with clear visual indicators."
          />

          <FeatureCard
            icon={<ShieldCheck className="h-7 w-7 text-amber-400" />}
            title="Secure Access"
            description="Sign in with Google or explore the app instantly using the built-in guest demo account."
          />
        </section>

        {/* Final CTA */}
        <section className="mt-24 w-full">
          <div className="rounded-3xl border border-zinc-800 bg-gradient-to-r from-indigo-600/10 via-zinc-900 to-indigo-600/10 p-10 text-center">
            <h3 className="text-3xl font-bold text-white">
              Ready to take control of your finances?
            </h3>

            <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
              Join FlowLedger with Google or explore the app instantly using
              the guest demo account.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/login"
                className="rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white transition hover:bg-indigo-500"
              >
                Get Started
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-zinc-700 px-8 py-3 font-semibold text-white transition hover:bg-zinc-800"
              >
                Explore Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 w-full border-t border-zinc-800 pt-8 text-center text-sm text-zinc-500">
          Built with Next.js, Prisma, PostgreSQL, Tailwind CSS, and NextAuth.
        </footer>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 p-7 transition-all duration-300 hover:-translate-y-2 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10">
      {/* Background Glow */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl transition-all duration-300 group-hover:bg-indigo-500/20" />

      {/* Icon */}
      <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-800 transition-colors duration-300 group-hover:border-indigo-500/40 group-hover:bg-indigo-500/10">
        {icon}
      </div>

      {/* Content */}
      <div className="relative">
        <h3 className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-indigo-300">
          {title}
        </h3>

        <p className="mt-3 leading-7 text-zinc-400">{description}</p>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 h-1 w-0 rounded-r-full bg-indigo-500 transition-all duration-300 group-hover:w-full" />
    </div>
  );
}