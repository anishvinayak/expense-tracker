import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";

import DashboardContent from "@/components/dashboard/dashboard-content";
import Brand from "@/components/brand";
import LogoutButton from "@/components/logout-button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      transactions: {
        include: {
          category: true,
        },
        orderBy: {
          date: "desc",
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const serializedTransactions = user.transactions.map((transaction) => ({
    ...transaction,
    amount: Number(transaction.amount),
    date: transaction.date.toISOString(),
    createdAt: transaction.createdAt.toISOString(),
  }));

  const isDemoUser = session.user.email === "demo@flowledger.app";

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <Brand />

            {isDemoUser && (
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm text-amber-300">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Demo Mode
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-white">
                {session.user.name || "User"}
              </p>

              <p className="text-sm text-zinc-400">
                {session.user.email}
              </p>
            </div>

            <LogoutButton />
          </div>
        </div>

        {/* Dashboard */}
        <DashboardContent transactions={serializedTransactions} />
      </div>
    </div>
  );
}