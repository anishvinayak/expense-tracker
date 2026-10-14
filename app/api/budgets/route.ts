import { db } from "@/lib/db";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const budgetSchema = z.object({
  categoryId: z.string(),
  amount: z.coerce.number().positive(),
  month: z.number(),
  year: z.number(),
});

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  const budgets = await db.budget.findMany({
    where: { userId: user!.id },
    include: { category: true },
    orderBy: { category: { name: "asc" } },
  });

  return NextResponse.json(budgets);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  const body = await req.json();
  const data = budgetSchema.parse(body);

  const budget = await db.budget.upsert({
    where: {
      userId_categoryId_month_year: {
        userId: user!.id,
        categoryId: data.categoryId,
        month: data.month,
        year: data.year,
      },
    },
    update: {
      amount: data.amount,
    },
    create: {
      userId: user!.id,
      categoryId: data.categoryId,
      amount: data.amount,
      month: data.month,
      year: data.year,
    },
  });

  return NextResponse.json(budget);
}