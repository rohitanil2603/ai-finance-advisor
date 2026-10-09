import { useState } from "react";
import { CATEGORIES, categoryColor } from "@/constants/categories";

interface CategoryEditDropdownProps {
  value: string;
  onChange: (category: string) => Promise<void> | void;
}

export function CategoryEditDropdown({ value, onChange }: CategoryEditDropdownProps) {
  const [saving, setSaving] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSaving(true);
    try {
      await onChange(e.target.value);
    } finally {
      setSaving(false);
    }
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={saving}
      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      style={{ color: categoryColor(value) }}
    >
      {CATEGORIES.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
}
