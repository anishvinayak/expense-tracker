"use client";

import { useState } from "react";
import TransactionTable from "./transaction-table";
import AddTransactionModal from "./add-transaction-modal";

type Transaction = {
  id: string;
  title: string;
  amount: number | string;
  type: "INCOME" | "EXPENSE";
  categoryId: string;
  date: string | Date;
  note?: string | null;
  category: {
    name: string;
    color: string;
  };
};

export default function DashboardClient({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [editing, setEditing] = useState<Transaction | null>(null);

  return (
    <>
      <TransactionTable
        transactions={transactions}
        onEdit={setEditing}
      />

      <AddTransactionModal
        editing={editing}
        onCloseEdit={() => setEditing(null)}
      />
    </>
  );
}