"use client";

import { useMemo, useState } from "react";
import DashboardClient from "./dashboard-client";
import AnalyticsClient from "./analytics-client";
import BudgetSection from "./budget-section";
import ExportCsvButton from "./export-csv-button";

type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  note?: string | null;
  categoryId: string;
  date: string;
  createdAt: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
};

export default function DashboardContent({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [filter, setFilter] = useState("month");

  const filteredTransactions = useMemo(() => {
    const now = new Date();

    return transactions.filter((transaction) => {
      const date = new Date(transaction.date);

      switch (filter) {
        case "month":
          return (
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
          );

        case "last-month": {
          const lastMonth = new Date(now);
          lastMonth.setMonth(now.getMonth() - 1);

          return (
            date.getMonth() === lastMonth.getMonth() &&
            date.getFullYear() === lastMonth.getFullYear()
          );
        }

        case "3months": {
          const limit = new Date(now);
          limit.setMonth(now.getMonth() - 2);
          return date >= limit;
        }

        case "year":
          return date.getFullYear() === now.getFullYear();

        case "all":
        default:
          return true;
      }
    });
  }, [transactions, filter]);

  const income = filteredTransactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = filteredTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  return (
    <div className="space-y-8">
      {/* Header Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-2xl font-bold text-white">Overview</h2>

        <div className="flex flex-col gap-3 sm:flex-row">
          <ExportCsvButton />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-white outline-none transition focus:border-indigo-500"
          >
            <option value="month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Balance" value={balance} color="white" />
        <StatCard title="Income" value={income} color="green" />
        <StatCard title="Expense" value={expense} color="red" />
      </div>

      {/* Analytics */}
      <AnalyticsClient transactions={filteredTransactions} />

      {/* Budgets */}
      <BudgetSection transactions={filteredTransactions} />

      {/* Recent Transactions */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            Recent Transactions
          </h2>

          <span className="rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300">
            {filteredTransactions.length}{" "}
            {filteredTransactions.length === 1
              ? "Transaction"
              : "Transactions"}
          </span>
        </div>

        <DashboardClient transactions={filteredTransactions} />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: "white" | "green" | "red";
}) {
  const textColor = {
    white: "text-white",
    green: "text-green-400",
    red: "text-red-400",
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-zinc-700">
      <p className="text-sm text-zinc-400">{title}</p>

      <h3 className={`mt-2 text-3xl font-bold ${textColor[color]}`}>
        ₹{value.toLocaleString("en-IN")}
      </h3>
    </div>
  );
}