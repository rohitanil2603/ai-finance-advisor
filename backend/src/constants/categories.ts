// Kept in sync by hand with frontend/src/constants/categories.ts — the category list and
// spelling must match exactly since the frontend's filter dropdown and edit dropdown send
// these values verbatim.
export const CATEGORIES = [
  "Food",
  "Rent",
  "Travel",
  "Shopping",
  "Bills",
  "Entertainment",
  "Income",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

interface CategoryRule {
  category: Category;
  pattern: RegExp;
}

// First match wins; anything unmatched falls back to "Other". Keyword lists are derived from
// common Indian bank-statement merchant strings (see sample-data/sample_transactions.csv) —
// extend these as real-world statements surface new merchants.
export const CATEGORY_RULES: CategoryRule[] = [
  { category: "Income", pattern: /SALARY|PAYROLL|FREELANCE|INTEREST CREDIT|REFUND|CASHBACK|DIVIDEND/ },
  { category: "Rent", pattern: /\bRENT\b|LANDLORD/ },
  {
    category: "Food",
    pattern: /SWIGGY|ZOMATO|RESTAURANT|CAFE|STARBUCKS|PIZZA|DINING|BARBEQUE|DMART|BIG BAZAAR|GROCERY|SUPERMARKET/,
  },
  { category: "Travel", pattern: /UBER|\bOLA\b|PETROL|FUEL|IRCTC|FLIGHT|INDIGO|AIRLINES|METRO|\bTRAIN\b|TAXI/ },
  { category: "Shopping", pattern: /AMAZON|FLIPKART|MYNTRA|\bMALL\b/ },
  {
    category: "Bills",
    pattern: /ELECTRICITY|WATER BILL|GAS CYLINDER|MOBILE RECHARGE|BROADBAND|INTERNET|INSURANCE|BBPS|CREDIT CARD BILL/,
  },
  {
    category: "Entertainment",
    pattern: /NETFLIX|SPOTIFY|PRIME VIDEO|HOTSTAR|BOOKMYSHOW|\bPVR\b|MOVIE|CULTFIT|\bGYM\b/,
  },
];
