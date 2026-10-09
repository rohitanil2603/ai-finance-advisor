import { describe, expect, it } from "vitest";
import { categorize, cleanMerchantName } from "../src/services/categorization.service";

describe("categorize", () => {
  it("maps known merchants to the expected category", () => {
    expect(categorize("SWIGGY ORDER 48213")).toBe("Food");
    expect(categorize("UBER TRIP 2201")).toBe("Travel");
    expect(categorize("RENT PAYMENT LANDLORD KUMAR")).toBe("Rent");
    expect(categorize("AMAZON.IN PURCHASE")).toBe("Shopping");
    expect(categorize("ELECTRICITY BOARD BBPS")).toBe("Bills");
    expect(categorize("NETFLIX SUBSCRIPTION")).toBe("Entertainment");
    expect(categorize("SALARY CREDIT ACME CORP")).toBe("Income");
  });

  it("falls back to Other for unknown merchants", () => {
    expect(categorize("SOME RANDOM MERCHANT XYZ")).toBe("Other");
  });

  it("is case-insensitive", () => {
    expect(categorize("swiggy order")).toBe("Food");
  });
});

describe("cleanMerchantName", () => {
  it("strips trailing reference numbers and title-cases the result", () => {
    expect(cleanMerchantName("SWIGGY ORDER 48213")).toBe("Swiggy Order");
    expect(cleanMerchantName("UBER TRIP 2201")).toBe("Uber Trip");
  });

  it("collapses extra whitespace", () => {
    expect(cleanMerchantName("  BIG   BAZAAR   STORE  ")).toBe("Big Bazaar Store");
  });

  it("leaves short descriptions without trailing numbers untouched", () => {
    expect(cleanMerchantName("ATM WITHDRAWAL")).toBe("Atm Withdrawal");
  });
});
