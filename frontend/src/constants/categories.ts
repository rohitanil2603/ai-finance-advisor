// Fixed category list + colors shared by the category filter, the edit dropdown, and every
// chart. Colors are assigned by category identity (not by rank/position in a filtered view),
// using the validated categorical palette from the dataviz skill (8 slots, CVD-safe ordering).

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

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: "#2a78d6",
  Rent: "#eb6834",
  Travel: "#1baf7a",
  Shopping: "#eda100",
  Bills: "#e87ba4",
  Entertainment: "#008300",
  Income: "#4a3aa7",
  Other: "#e34948",
};

export function categoryColor(category: string): string {
  return CATEGORY_COLORS[category as Category] ?? CATEGORY_COLORS.Other;
}
