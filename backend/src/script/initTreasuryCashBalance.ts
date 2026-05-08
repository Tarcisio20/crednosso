import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const treasuries = await prisma.treasury.findMany({
    select: {
      id_system: true,
    },
  });

  for (const treasury of treasuries) {
    await prisma.treasuryCashBalance.upsert({
      where: {
        id_treasury: treasury.id_system,
      },
      update: {},
      create: {
        id_treasury: treasury.id_system,

        available_bills_10: 0,
        available_bills_20: 0,
        available_bills_50: 0,
        available_bills_100: 0,

        transit_bills_10: 0,
        transit_bills_20: 0,
        transit_bills_50: 0,
        transit_bills_100: 0,
      },
    });
  }

  console.log("Saldos inicializados com zero.");
}

main()
  .catch((error) => {
    console.error("Erro ao inicializar saldos:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });