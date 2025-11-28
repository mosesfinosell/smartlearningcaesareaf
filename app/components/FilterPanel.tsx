'use client';

import { useState } from 'react';

export type FilterOption = { label: string; value: string };
export type FilterGroup = { label: string; options: FilterOption[]; type?: 'single' | 'multi' };
export type FilterSelection = Record<string, string[]>;

export default function FilterPanel({
  title,
  description,
  groups,
  onChange,
}: {
  title: string;
  description?: string;
  groups: FilterGroup[];
  onChange?: (selection: FilterSelection) => void;
}) {
  const [selection, setSelection] = useState<FilterSelection>({});

  const toggle = (group: string, option: string, type: 'single' | 'multi' = 'multi') => {
    setSelection((prev) => {
      const current = prev[group] || [];
      const updated =
        type === 'single'
          ? { ...prev, [group]: [option] }
          : current.includes(option)
            ? { ...prev, [group]: current.filter((o) => o !== option) }
            : { ...prev, [group]: [...current, option] };
      onChange?.(updated);
      return updated;
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 space-y-4">
      <div>
        <h3 className="text-xl font-bold text-maroon">{title}</h3>
        {description && <p className="text-gray-600 text-sm mt-1">{description}</p>}
      </div>
      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="text-sm font-semibold text-gray-800 mb-2">{group.label}</p>
            <div className="flex flex-wrap gap-2">
              {group.options.map((opt) => {
                const active = (selection[group.label] || []).includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => toggle(group.label, opt.value, group.type)}
                    className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                      active
                        ? 'bg-maroon text-white border-maroon'
                        : 'bg-gray-50 text-gray-800 border-gray-200 hover:border-maroon hover:text-maroon'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {Object.values(selection).some((arr) => arr?.length) && (
        <div className="text-xs text-gray-600 border-t border-gray-200 pt-3 space-y-2">
          <p className="font-semibold text-gray-800">Selected:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selection).flatMap(([group, values]) =>
              values.map((value) => (
                <span key={`${group}-${value}`} className="px-2 py-1 rounded-full bg-maroon text-white text-xs">
                  {group}: {value}
                </span>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
