"use client";

type Budget = {
  amount: number;
  spent: number;
  category: {
    name: string;
    color: string;
  };
};

export default function BudgetCard({
  budget,
}: {
  budget: Budget;
}) {
  const percent = Math.min(
    (budget.spent / budget.amount) * 100,
    100
  );

  const color =
    percent < 70
      ? "bg-green-500"
      : percent < 100
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="h-4 w-4 rounded-full"
            style={{
              backgroundColor: budget.category.color,
            }}
          />

          <h3 className="font-semibold text-white">
            {budget.category.name}
          </h3>
        </div>

        <span className="text-sm text-zinc-400">
          ₹{budget.amount.toLocaleString("en-IN")}
        </span>
      </div>

      <div className="mb-3 h-3 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-zinc-300">
          ₹{budget.spent.toLocaleString("en-IN")} spent
        </span>

        <span className="text-zinc-400">
          {Math.round(percent)}%
        </span>
      </div>
    </div>
  );
}