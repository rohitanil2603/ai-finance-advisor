import { useState } from "react";
import type { TransactionFilters as Filters } from "@/types/transaction";
import { CATEGORIES } from "@/constants/categories";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface TransactionFiltersProps {
  filters: Filters;
  onApply: (filters: Partial<Filters>) => void;
}

export function TransactionFilters({ filters, onApply }: TransactionFiltersProps) {
  const [draft, setDraft] = useState<Filters>(filters);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(draft);
  };

  const handleReset = () => {
    const cleared: Filters = { page: 1, pageSize: filters.pageSize };
    setDraft(cleared);
    onApply(cleared);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-2 gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-3 lg:grid-cols-6"
    >
      <Input
        label="From"
        type="date"
        value={draft.from ?? ""}
        onChange={(e) => setDraft({ ...draft, from: e.target.value || undefined })}
      />
      <Input
        label="To"
        type="date"
        value={draft.to ?? ""}
        onChange={(e) => setDraft({ ...draft, to: e.target.value || undefined })}
      />
      <div className="flex flex-col gap-1">
        <label htmlFor="category-filter" className="text-sm font-medium text-slate-700">
          Category
        </label>
        <select
          id="category-filter"
          value={draft.category ?? ""}
          onChange={(e) => setDraft({ ...draft, category: e.target.value || undefined })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">All</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <Input
        label="Min amount"
        type="number"
        value={draft.minAmount ?? ""}
        onChange={(e) =>
          setDraft({ ...draft, minAmount: e.target.value ? Number(e.target.value) : undefined })
        }
      />
      <Input
        label="Max amount"
        type="number"
        value={draft.maxAmount ?? ""}
        onChange={(e) =>
          setDraft({ ...draft, maxAmount: e.target.value ? Number(e.target.value) : undefined })
        }
      />
      <Input
        label="Search"
        type="text"
        placeholder="Description"
        value={draft.search ?? ""}
        onChange={(e) => setDraft({ ...draft, search: e.target.value || undefined })}
      />
      <div className="col-span-2 flex items-end gap-2 sm:col-span-3 lg:col-span-6">
        <Button type="submit">Apply filters</Button>
        <Button type="button" variant="secondary" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
