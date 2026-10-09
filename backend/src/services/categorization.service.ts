import { CATEGORY_RULES, type Category } from "../constants/categories";

// "SWIGGY ORDER 48213" -> "Swiggy Order". Strips trailing order/reference numbers so the
// same merchant collapses to one readable name instead of one row per transaction ID.
export function cleanMerchantName(raw: string): string {
  const withoutRef = raw.trim().replace(/\s+/g, " ").replace(/\s+#?\d{3,}$/, "");
  return withoutRef
    .toLowerCase()
    .replace(/\b[a-z]/g, (c) => c.toUpperCase());
}

export function categorize(raw: string): Category {
  const upper = raw.toUpperCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.pattern.test(upper)) return rule.category;
  }
  return "Other";
}

export function categorizeAndClean(raw: string): { cleanDescription: string; category: Category } {
  return { cleanDescription: cleanMerchantName(raw), category: categorize(raw) };
}
