import { ingredientMap } from "../../mocks/ingredients";
import type { StoreComparisonItem } from "../../types";
import { formatPrice, formatQuantity } from "../../utils/format";

export function PriceBreakdown({ items }: { items: StoreComparisonItem[] }) {
  return (
    <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50/60 px-3">
      {items.map((item) => (
        <div key={item.ingredientId} className="flex items-center justify-between gap-3 py-2.5 text-sm">
          <div><p className="font-bold text-slate-800">{ingredientMap.get(item.ingredientId)?.name ?? item.ingredientId}</p><p className="text-xs text-slate-500">必要 {formatQuantity(item.requiredQuantity, item.requiredUnit)}</p></div>
          <div className="text-right"><p className={`font-black ${item.purchasePrice === null ? "text-amber-700" : "text-slate-900"}`}>{item.purchasePrice === null ? "価格不明" : formatPrice(item.purchasePrice)}</p>{item.packagesRequired !== null && <p className="text-xs text-slate-500">{item.packagesRequired}パック購入</p>}</div>
        </div>
      ))}
    </div>
  );
}
