import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "../common/Button";

export const recipeFilterOptions = ["10分以内", "15分以内", "300円以内", "電子レンジ", "丼・ご飯", "麺", "副菜", "肉料理", "洗い物が少ない"] as const;

export function RecipeFilters({ selected, onToggle, onClear }: { selected: string[]; onToggle: (filter: string) => void; onClear: () => void }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-black text-ink"><SlidersHorizontal size={17} className="text-teal-700" />クイックフィルター</p>
        {selected.length > 0 && <Button variant="ghost" className="min-h-8 px-2 py-1 text-xs" onClick={onClear}><X size={14} />クリア</Button>}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap">
        {recipeFilterOptions.map((filter) => {
          const active = selected.includes(filter);
          return <button key={filter} onClick={() => onToggle(filter)} aria-pressed={active} className={`shrink-0 rounded-full border px-3.5 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-teal-600 ${active ? "border-teal-700 bg-teal-700 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-teal-300"}`}>{filter}</button>;
        })}
      </div>
    </div>
  );
}
