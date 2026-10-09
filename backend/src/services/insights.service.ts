import { z } from "zod";
import { prisma } from "../config/db";
import { AppError } from "../utils/errors";
import { chatCompletionJson } from "./llm.service";
import * as analyticsService from "./analytics.service";

const PERIOD_DAYS = 90;

const llmResponseSchema = z.object({
  summary: z.string().min(1),
  unusual: z
    .array(
      z.object({
        description: z.string(),
        amount: z.number(),
        date: z.string(),
        reason: z.string(),
      }),
    )
    .max(10),
  observations: z.array(z.string()).max(10),
  tips: z.array(z.string()).min(1).max(5),
});

interface InsightRow {
  id: string;
  periodStart: Date;
  periodEnd: Date;
  summary: string;
  unusual: unknown;
  observations: unknown;
  tips: unknown;
  createdAt: Date;
}

function serialize(insight: InsightRow) {
  const unusualList = insight.unusual as { description: string; amount: number; date: string; reason: string }[];
  return {
    id: insight.id,
    periodStart: insight.periodStart.toISOString().slice(0, 10),
    periodEnd: insight.periodEnd.toISOString().slice(0, 10),
    summary: insight.summary,
    unusual: unusualList.map((u, i) => ({ id: `u-${i}`, ...u })),
    observations: insight.observations as string[],
    tips: insight.tips as string[],
    createdAt: insight.createdAt.toISOString(),
  };
}

export async function getLatest(userId: string) {
  const latest = await prisma.insight.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } });
  return latest ? serialize(latest) : null;
}

const SYSTEM_PROMPT =
  "You are a personal finance advisor. You are given a JSON summary of a user's spending for a " +
  "period: category totals, monthly income/expense totals, their savings rate, top merchants, and " +
  "their largest individual debit transactions in that period. Respond with ONLY a JSON object, no " +
  'markdown, matching exactly this shape: {"summary": string, "unusual": [{"description": string, ' +
  '"amount": number, "date": "YYYY-MM-DD", "reason": string}], "observations": string[], "tips": ' +
  'string[]}. "summary" is a short 3-5 sentence plain-language overview of their spending this ' +
  'period. "unusual" selects up to 5 of the largestTransactions provided that are worth flagging ' +
  "and briefly explains why each stands out — never invent a transaction that isn't in the data " +
  'given. "observations" is 2-4 short category-level observations grounded in byCategory. "tips" is ' +
  "3-5 concrete, actionable saving tips based on the actual numbers provided.";

export async function generate(userId: string) {
  const allTransactions = await prisma.transaction.findMany({ where: { userId }, orderBy: { date: "asc" } });
  if (allTransactions.length === 0) {
    throw new AppError(400, "Upload some transactions before generating insights.");
  }

  const periodEnd = allTransactions[allTransactions.length - 1].date;
  const earliest = allTransactions[0].date;
  const windowStart = new Date(periodEnd);
  windowStart.setDate(windowStart.getDate() - PERIOD_DAYS);
  const periodStart = earliest > windowStart ? earliest : windowStart;

  const range = {
    from: periodStart.toISOString().slice(0, 10),
    to: periodEnd.toISOString().slice(0, 10),
  };
  const [summaryStats, charts] = await Promise.all([
    analyticsService.getSummary(userId, range),
    analyticsService.getCharts(userId, range),
  ]);

  const periodTransactions = allTransactions.filter((t) => t.date >= periodStart && t.date <= periodEnd);
  const largestTransactions = [...periodTransactions]
    .filter((t) => t.amount < 0)
    .sort((a, b) => a.amount - b.amount)
    .slice(0, 10)
    .map((t) => ({
      description: t.description,
      amount: t.amount,
      date: t.date.toISOString().slice(0, 10),
      category: t.category,
    }));

  const promptData = {
    periodStart: range.from,
    periodEnd: range.to,
    totalIncome: summaryStats.totalIncome,
    totalExpense: summaryStats.totalExpense,
    savingsRate: summaryStats.savingsRate,
    byCategory: charts.byCategory,
    topMerchants: charts.topMerchants,
    largestTransactions,
  };

  const raw = await chatCompletionJson(SYSTEM_PROMPT, JSON.stringify(promptData));

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch {
    throw new AppError(502, "The AI response was not valid JSON. Please try again.");
  }

  const result = llmResponseSchema.safeParse(parsedJson);
  if (!result.success) {
    throw new AppError(502, "The AI response did not match the expected format. Please try again.");
  }

  const saved = await prisma.insight.create({
    data: {
      userId,
      periodStart,
      periodEnd,
      summary: result.data.summary,
      unusual: result.data.unusual,
      observations: result.data.observations,
      tips: result.data.tips,
      rawResponse: parsedJson as object,
    },
  });

  return serialize(saved);
}
