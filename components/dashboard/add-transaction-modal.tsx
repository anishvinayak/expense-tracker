"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

type Category = {
  id: string;
  name: string;
  color: string;
};

type Transaction = {
  id: string;
  title: string;
  amount: number | string;
  type: "INCOME" | "EXPENSE";
  categoryId: string;
  date: string | Date;
  note?: string | null;
};

type Props = {
  editing?: Transaction | null;
  onCloseEdit?: () => void;
};

export default function AddTransactionModal({
  editing = null,
  onCloseEdit,
}: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "EXPENSE" as "INCOME" | "EXPENSE",
    categoryId: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  // Load categories when modal opens
  useEffect(() => {
    if (!open && !editing) return;

    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();

        setCategories(data);

        if (!editing && data.length > 0) {
          setForm((prev) => ({
            ...prev,
            categoryId: data[0].id,
          }));
        }
      } catch {
        setError("Failed to load categories.");
      }
    }

    loadCategories();
  }, [open, editing]);

  // Populate form when editing
  useEffect(() => {
    if (!editing) return;

    setOpen(true);

    setForm({
      title: editing.title,
      amount: String(editing.amount),
      type: editing.type,
      categoryId: editing.categoryId,
      date: new Date(editing.date).toISOString().split("T")[0],
      note: editing.note || "",
    });
  }, [editing]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.title || !form.amount || !form.categoryId) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const url = editing
        ? `/api/transactions/${editing.id}`
        : "/api/transactions";

      const method = editing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          amount: Number(form.amount),
          type: form.type,
          categoryId: form.categoryId,
          date: form.date,
          note: form.note,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save transaction.");
        return;
      }

      closeModal();
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  function closeModal() {
    setOpen(false);
    onCloseEdit?.();
    setError("");

    setForm({
      title: "",
      amount: "",
      type: "EXPENSE",
      categoryId: categories[0]?.id || "",
      date: new Date().toISOString().split("T")[0],
      note: "",
    });
  }

  return (
    <>
      {!editing && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-40 flex h-14 items-center gap-2 rounded-full bg-indigo-600 px-5 text-white shadow-xl transition hover:bg-indigo-500 sm:bottom-6 sm:right-6"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Add Transaction</span>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm">
          <div className="flex min-h-screen items-center justify-center p-3 sm:p-6">
            <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl">
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-5 py-4">
                <h2 className="text-xl font-bold text-white sm:text-2xl">
                  {editing ? "Edit Transaction" : "Add Transaction"}
                </h2>

                <button
                  onClick={closeModal}
                  className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="max-h-[calc(100vh-120px)] overflow-y-auto px-5 py-5">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                      {error}
                    </div>
                  )}

                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Pizza"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                    />
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Amount</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={form.amount}
                      onChange={(e) =>
                        setForm({ ...form, amount: e.target.value })
                      }
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                    />
                  </div>

                  {/* Type */}
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Type</label>

                    <div className="grid grid-cols-2 rounded-xl bg-zinc-800 p-1">
                      <button
                        type="button"
                        onClick={() =>
                          setForm({ ...form, type: "EXPENSE" })
                        }
                        className={`rounded-lg py-3 text-sm font-medium transition ${
                          form.type === "EXPENSE"
                            ? "bg-red-600 text-white"
                            : "text-zinc-300"
                        }`}
                      >
                        Expense
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setForm({ ...form, type: "INCOME" })
                        }
                        className={`rounded-lg py-3 text-sm font-medium transition ${
                          form.type === "INCOME"
                            ? "bg-green-600 text-white"
                            : "text-zinc-300"
                        }`}
                      >
                        Income
                      </button>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Category</label>

                    <select
                      value={form.categoryId}
                      onChange={(e) =>
                        setForm({ ...form, categoryId: e.target.value })
                      }
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Date</label>

                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                    />
                  </div>

                  {/* Note */}
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Note</label>

                    <textarea
                      rows={4}
                      placeholder="Optional note..."
                      value={form.note}
                      onChange={(e) =>
                        setForm({ ...form, note: e.target.value })
                      }
                      className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                    />
                  </div>

                  {/* Footer Buttons */}
                  <div className="sticky bottom-0 flex gap-3 border-t border-zinc-800 bg-zinc-900 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 rounded-xl border border-zinc-700 py-3 text-zinc-300 transition hover:bg-zinc-800"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading
                        ? "Saving..."
                        : editing
                        ? "Update"
                        : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}