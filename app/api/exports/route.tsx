import { prisma } from "@/lib/db";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    include: { category: true },
    orderBy: { date: "desc" },
  });

  const rows = [
    ["Date", "Title", "Category", "Type", "Amount", "Note"],
    ...transactions.map((t) => [
      new Date(t.date).toLocaleDateString("en-IN"),
      t.title,
      t.category.name,
      t.type,
      Number(t.amount).toString(),
      t.note ?? "",
    ]),
  ];

  const csv = rows
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="expense-tracker-${
        new Date().toISOString().split("T")[0]
      }.csv"`,
    },
  });
}