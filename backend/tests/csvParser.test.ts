import { describe, expect, it } from "vitest";
import { parseCsv } from "../src/services/csvParser.service";

function toBuffer(csv: string): Buffer {
  return Buffer.from(csv, "utf-8");
}

describe("parseCsv", () => {
  it("parses valid rows with date, description, amount, balance", () => {
    const csv = "date,description,amount,balance\n2025-07-01,Salary Credit,65000,115000\n2025-07-02,Swiggy Order,-540.50,114459.50\n";
    const { validRows, rowErrors } = parseCsv(toBuffer(csv));

    expect(rowErrors).toHaveLength(0);
    expect(validRows).toHaveLength(2);
    expect(validRows[0].amount).toBe(65000);
    expect(validRows[1].amount).toBe(-540.5);
    expect(validRows[1].balance).toBe(114459.5);
  });

  it("collects a row error for an invalid date instead of throwing", () => {
    const csv = "date,description,amount\nnot-a-date,Swiggy Order,-540.50\n2025-07-02,Uber Trip,-230\n";
    const { validRows, rowErrors } = parseCsv(toBuffer(csv));

    expect(validRows).toHaveLength(1);
    expect(rowErrors).toHaveLength(1);
    expect(rowErrors[0]).toMatchObject({ row: 1 });
  });

  it("collects a row error for an invalid amount", () => {
    const csv = "date,description,amount\n2025-07-02,Uber Trip,not-a-number\n";
    const { rowErrors } = parseCsv(toBuffer(csv));
    expect(rowErrors).toHaveLength(1);
    expect(rowErrors[0].message).toMatch(/Invalid amount/);
  });

  it("supports separate debit/credit columns", () => {
    const csv = "date,description,debit,credit\n2025-07-01,Salary,,65000\n2025-07-02,Rent,18000,\n";
    const { validRows } = parseCsv(toBuffer(csv));
    expect(validRows[0].amount).toBe(65000);
    expect(validRows[1].amount).toBe(-18000);
  });

  it("throws for a file missing required columns", () => {
    const csv = "foo,bar\n1,2\n";
    expect(() => parseCsv(toBuffer(csv))).toThrow(/date, description, and amount/);
  });

  it("throws for an empty file", () => {
    expect(() => parseCsv(toBuffer(""))).toThrow(/empty/);
  });

  it("parses amounts with currency symbols, commas, and parentheses", () => {
    const csv = 'date,description,amount\n2025-07-01,Test,"₹1,234.50"\n2025-07-02,Refund,"(500)"\n';
    const { validRows } = parseCsv(toBuffer(csv));
    expect(validRows[0].amount).toBe(1234.5);
    expect(validRows[1].amount).toBe(-500);
  });
});
