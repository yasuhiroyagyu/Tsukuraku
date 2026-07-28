import type { ShoppingListItem as ShoppingListItemType } from "../../types";
import { formatPrice } from "../../utils/format";

export function ShoppingListItem({ item, onToggle }: { item: ShoppingListItemType; onToggle: () => void }) {
  return (
    <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${item.checked ? "border-slate-200 bg-slate-50" : "border-slate-200 bg-white hover:border-teal-300"}`}>
      <input type="checkbox" checked={item.checked} onChange={onToggle} />
      <span className={`min-w-0 flex-1 ${item.checked ? "text-slate-400 line-through" : "text-slate-800"}`}><span className="block font-bold">{item.name}</span><span className="mt-0.5 block text-xs">{item.quantityLabel}</span></span>
      <span className={`shrink-0 font-black ${item.checked ? "text-slate-400 line-through" : "text-teal-800"}`}>{formatPrice(item.price)}</span>
    </label>
  );
}
