import { prisma } from "@/lib/db";
import PieChartCard from "./pie-chart-card";
import MonthlyChartCard from "./monthly-chart-card";

export default async function Analytics({
  userId,
}: {
  userId: string;
}) {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
  });

  const expenses = transactions.filter((t) => t.type === "EXPENSE");

  // Category totals
  const categoryMap = new Map<
    string,
    { name: string; color: string; value: number }
  >();

  for (const transaction of expenses) {
    const current = categoryMap.get(transaction.category.id);

    if (current) {
      current.value += Number(transaction.amount);
    } else {
      categoryMap.set(transaction.category.id, {
        name: transaction.category.name,
        color: transaction.category.color,
        value: Number(transaction.amount),
      });
    }
  }

  const categoryData = Array.from(categoryMap.values());

  // Last 6 months
  const monthMap = new Map<string, number>();

  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);

    monthMap.set(
      d.toLocaleString("en-US", { month: "short" }),
      0
    );
  }

  for (const transaction of expenses) {
    const key = new Date(transaction.date).toLocaleString(
      "en-US",
      { month: "short" }
    );

    if (monthMap.has(key)) {
      monthMap.set(
        key,
        monthMap.get(key)! + Number(transaction.amount)
      );
    }
  }

  const monthlyData = Array.from(monthMap).map(
    ([month, amount]) => ({
      month,
      amount,
    })
  );

  // ===== Insights =====

  const now = new Date();

  const monthExpense = expenses
    .filter((t) => {
      const d = new Date(t.date);

      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const topCategory =
    categoryData.sort((a, b) => b.value - a.value)[0];

  const totalExpense = expenses.reduce(
    (sum, t) => sum + Number(t.amount),
    0
  );

  const averageDaily =
    expenses.length === 0
      ? 0
      : Math.round(totalExpense / now.getDate());

  const biggestExpense =
    expenses.sort(
      (a, b) => Number(b.amount) - Number(a.amount)
    )[0];

  return (
    <div className="space-y-6">
      {/* Insight Cards */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InsightCard
          title="This Month"
          value={`₹${monthExpense.toLocaleString("en-IN")}`}
          subtitle="Spent this month"
        />

        <InsightCard
          title="Top Category"
          value={topCategory?.name || "—"}
          subtitle={
            topCategory
              ? `₹${topCategory.value.toLocaleString("en-IN")}`
              : "No expenses"
          }
        />

        <InsightCard
          title="Daily Avg"
          value={`₹${averageDaily.toLocaleString("en-IN")}`}
          subtitle="Average per day"
        />

        <InsightCard
          title="Biggest Expense"
          value={
            biggestExpense
              ? `₹${Number(biggestExpense.amount).toLocaleString("en-IN")}`
              : "—"
          }
          subtitle={biggestExpense?.title || "No expenses"}
        />
      </div>

      {/* Charts */}

      <div className="grid gap-6 lg:grid-cols-2">
        <PieChartCard data={categoryData} />
        <MonthlyChartCard data={monthlyData} />
      </div>
    </div>
  );
}

function InsightCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <p className="text-sm text-zinc-400">{title}</p>

      <h3 className="mt-2 text-2xl font-bold text-white">
        {value}
      </h3>

      <p className="mt-1 text-xs text-zinc-500">
        {subtitle}
      </p>
    </div>
  );
}