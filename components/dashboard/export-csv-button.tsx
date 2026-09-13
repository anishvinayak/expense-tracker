"use client";

import { Download } from "lucide-react";

export default function ExportCsvButton() {
  async function handleExport() {
    const res = await fetch("/api/export");

    if (!res.ok) {
      alert("Failed to export CSV.");
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `expense-tracker-${
      new Date().toISOString().split("T")[0]
    }.csv`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-white transition hover:bg-zinc-800"
    >
      <Download size={18} />
      Export CSV
    </button>
  );
}