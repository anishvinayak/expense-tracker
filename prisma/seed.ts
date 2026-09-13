import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const demoUser = await prisma.user.upsert({
    where: {
      email: "demo@flowledger.app",
    },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@flowledger.app",
    },
  });

  const categories = [
    { name: "Food", color: "#EF4444" },
    { name: "Transport", color: "#3B82F6" },
    { name: "Shopping", color: "#8B5CF6" },
    { name: "Bills", color: "#F59E0B" },
    { name: "Entertainment", color: "#10B981" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        userId_name: {
          userId: demoUser.id,
          name: category.name,
        },
      },
      update: {},
      create: {
        userId: demoUser.id,
        name: category.name,
        color: category.color,
      },
    });
  }

  console.log("Demo user created successfully.");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });