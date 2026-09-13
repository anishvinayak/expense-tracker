"use client";

import { useEffect, useMemo, useState } from "react";
import BudgetCard from "./budget-card";
import SetBudgetModal from "./set-budget-modal";

export default function BudgetSection({
  transactions,
}: {
  transactions: any[];
}) {
  const [budgets, setBudgets] = useState<any[]>([]);

  async function loadBudgets() {
    const res = await fetch("/api/budgets");
    const data = await res.json();
    setBudgets(data);
  }

  useEffect(() => {
    loadBudgets();
  }, []);

  const computed = useMemo(() => {
    return budgets.map((budget) => {
      const spent = transactions
        .filter(
          (t) =>
            t.type === "EXPENSE" &&
            t.categoryId === budget.categoryId
        )
        .reduce((sum, t) => sum + Number(t.amount), 0);

      return {
        ...budget,
        spent,
      };
    });
  }, [budgets, transactions]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          Monthly Budgets
        </h2>

        <SetBudgetModal onSuccess={loadBudgets} />
      </div>

      {computed.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-700 p-8 text-center text-zinc-400">
          No budgets created yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {computed.map((budget) => (
            <BudgetCard key={budget.id} budget={budget} />
          ))}
        </div>
      )}
    </div>
  );
}