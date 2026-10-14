import { db } from "@/lib/db";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { z } from "zod";

const transactionSchema = z.object({
  title: z.string().min(1),
  amount: z.coerce.number().positive(),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string(),
  date: z.string(),
  note: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const data = transactionSchema.parse(body);

    const category = await db.category.findFirst({
      where: {
        id: data.categoryId,
        userId: user.id,
      },
    });

    if (!category) {
      return Response.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    const transaction = await db.transaction.create({
      data: {
        title: data.title,
        amount: data.amount,
        type: data.type,
        note: data.note,
        date: new Date(data.date),
        userId: user.id,
        categoryId: data.categoryId,
      },
      include: {
        category: true,
      },
    });

    return Response.json(transaction, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error(error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}