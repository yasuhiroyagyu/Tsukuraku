import type { ShoppingListItem as ShoppingListItemType } from "../../types";
import { formatPrice } from "../../utils/format";

export function ShoppingListItem({ item, onToggle }: { item: ShoppingListItemType; onToggle: () => void }) {
  const priceLabel = item.price === null ? "価格不明" : formatPrice(item.price);

  return (
    <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${item.checked ? "border-slate-200 bg-slate-50" : "border-slate-200 bg-white hover:border-teal-300"}`}>
      <input type="checkbox" checked={item.checked} onChange={onToggle} />
      <span className={`min-w-0 flex-1 ${item.checked ? "text-slate-400 line-through" : "text-slate-800"}`}><span className="flex items-center gap-2 font-bold">{item.name}{item.isManual && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-black text-blue-700">手動追加</span>}</span><span className="mt-0.5 block text-xs">{item.quantityLabel}</span></span>
      <span className={`shrink-0 font-black ${item.price === null ? "text-amber-700" : item.checked ? "text-slate-400 line-through" : "text-teal-800"}`}>{priceLabel}</span>
    </label>
  );
}
