import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { parse } from "csv-parse/sync";
import { categorizeAndClean } from "../src/services/categorization.service";
import { parseFlexibleDate } from "../src/utils/date";
import { hashPassword } from "../src/utils/password";

const prisma = new PrismaClient();

const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD = "password123";

async function main() {
  const passwordHash = await hashPassword(DEMO_PASSWORD);
  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: { email: DEMO_EMAIL, passwordHash },
  });

  const csvPath = path.resolve(__dirname, "../../sample-data/sample_transactions.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const records: Record<string, string>[] = parse(csvContent, {
    columns: (header: string[]) => header.map((h) => h.trim().toLowerCase()),
    skip_empty_lines: true,
    trim: true,
  });

  const rows = records
    .map((r) => {
      const date = parseFlexibleDate(r.date);
      const amount = Number(r.amount);
      if (!date || Number.isNaN(amount)) return null;
      const { cleanDescription, category } = categorizeAndClean(r.description);
      return {
        userId: user.id,
        date,
        rawDescription: r.description,
        description: cleanDescription,
        amount,
        balance: r.balance ? Number(r.balance) : null,
        category,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const { count } = await prisma.transaction.createMany({ data: rows, skipDuplicates: true });

  console.log(`Seeded user ${DEMO_EMAIL} / ${DEMO_PASSWORD} with ${count} transactions.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
