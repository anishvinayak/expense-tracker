import Link from "next/link";
import { Wallet } from "lucide-react";

export default function Brand() {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600">
        <Wallet className="h-6 w-6 text-white" />
      </div>

      <div>
        <h1 className="text-xl font-bold text-white">FlowLedger</h1>
        <p className="text-xs text-zinc-400">
          Track every rupee. Know where it flows.
        </p>
      </div>
    </Link>
  );
}