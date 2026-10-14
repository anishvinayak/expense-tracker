import { prisma } from "@/lib/db";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  const categories = await prisma.category.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json(categories);
}