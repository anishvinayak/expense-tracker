"use client";

import { useRouter } from "next/navigation";
import { Trash2, Pencil } from "lucide-react";

type Transaction = {
  id: string;
  title: string;
  amount: number | string;
  type: "INCOME" | "EXPENSE";
  note?: string | null;
  date: Date | string;
  categoryId: string;
  category: {
    name: string;
    color: string;
  };
};

export default function TransactionTable({
  transactions,
  onEdit,
}: {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
}) {
  const router = useRouter();

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this transaction?");

    if (!confirmed) return;

    const res = await fetch(`/api/transactions/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
    }
  }

  if (transactions.length === 0) {
    return <p className="text-zinc-400">No transactions yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-b border-zinc-800 text-zinc-400">
          <tr>
            <th className="pb-3">Title</th>
            <th className="pb-3">Category</th>
            <th className="pb-3">Date</th>
            <th className="pb-3 text-right">Amount</th>
            <th className="pb-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-b border-zinc-800/50">
              <td className="py-4 font-medium">{transaction.title}</td>

              <td>
                <span
                  className="rounded-full px-3 py-1 text-sm text-white"
                  style={{
                    backgroundColor: transaction.category.color,
                  }}
                >
                  {transaction.category.name}
                </span>
              </td>

              <td className="text-zinc-400">
                {new Date(transaction.date).toLocaleDateString("en-IN")}
              </td>

              <td
                className={`text-right font-bold ${
                  transaction.type === "INCOME"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {transaction.type === "INCOME" ? "+" : "-"}₹
                {Number(transaction.amount)}
              </td>

              <td>
                <div className="flex justify-end gap-2">
                  <button
  onClick={() => onEdit(transaction)}
  className="rounded-lg p-2 hover:bg-zinc-800"
>
  <Pencil size={18} />
</button>

                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="rounded-lg p-2 text-red-400 hover:bg-zinc-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
