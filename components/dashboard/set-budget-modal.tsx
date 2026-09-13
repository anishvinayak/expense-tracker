"use client";

import { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import { number } from "zod";

type Category = {
  id: string;
  name: string;
  color: string;
};

export default function SetBudgetModal({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        if (data.length > 0) setCategoryId(data[0].id);
      });
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const now = new Date();

    const res = await fetch("/api/budgets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        categoryId,
        amount: Number(amount),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      }),
    });

    setLoading(false);

    if (res.ok) {
      setOpen(false);
      setAmount("");
      onSuccess();
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
      >
        <Plus size={18} />
        Set Budget
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-800 p-5">
              <h2 className="text-xl font-bold text-white">
                Set Monthly Budget
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 hover:bg-zinc-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5">
              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Category
                </label>

                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Monthly Budget
                </label>

                <input
                  type="number"
                  placeholder="5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white"
                />
              </div>

              <button
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Budget"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}