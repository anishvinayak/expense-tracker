"use client";

import { useMemo } from "react";
import PieChartCard from "./pie-chart-card";
import MonthlyChartCard from "./monthly-chart-card";

export default function AnalyticsClient({
  transactions,
}: {
  transactions: any[];
}) {
  const categoryData = useMemo(() => {
    const map = new Map();

    for (const t of transactions) {
      if (t.type !== "EXPENSE") continue;

      const current = map.get(t.category.id);

      if (current) {
        current.value += Number(t.amount);
      } else {
        map.set(t.category.id, {
          name: t.category.name,
          color: t.category.color,
          value: Number(t.amount),
        });
      }
    }

    return Array.from(map.values());
  }, [transactions]);

  const monthlyData = useMemo(() => {
    const months = new Map();

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);

      months.set(
        d.toLocaleString("en-US", { month: "short" }),
        0
      );
    }

    for (const t of transactions) {
      if (t.type !== "EXPENSE") continue;

      const key = new Date(t.date).toLocaleString(
        "en-US",
        {
          month: "short",
        }
      );

      if (months.has(key)) {
        months.set(
          key,
          months.get(key) + Number(t.amount)
        );
      }
    }

    return Array.from(months).map(
      ([month, amount]) => ({
        month,
        amount,
      })
    );
  }, [transactions]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <PieChartCard data={categoryData} />
      <MonthlyChartCard data={monthlyData} />
    </div>
  );
}