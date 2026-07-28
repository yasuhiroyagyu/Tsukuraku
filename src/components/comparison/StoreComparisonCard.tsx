import { MapPin, ShoppingBasket, Sparkles } from "lucide-react";
import type { StoreComparison } from "../../types";
import { formatPrice } from "../../utils/format";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { MissingPriceAlert } from "./MissingPriceAlert";
import { PriceBreakdown } from "./PriceBreakdown";

export function StoreComparisonCard({ comparison, onSelect }: { comparison: StoreComparison; onSelect: () => void }) {
  const knownAmount = comparison.items.reduce((sum, item) => sum + (item.purchasePrice ?? 0), 0);
  const canSelect = comparison.missingPriceCount === 0;

  return (
    <Card className={`relative flex h-full flex-col overflow-hidden ${comparison.isCheapest ? "border-teal-500 ring-2 ring-teal-100" : ""}`}>
      {comparison.isCheapest && <div className="flex items-center justify-center gap-1 bg-teal-700 py-2 text-xs font-black text-white"><Sparkles size={15} />価格確定店舗の中で最安</div>}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div><p className="text-xs font-bold text-slate-500">{comparison.store.name}</p><h2 className="mt-0.5 text-lg font-black text-ink">{comparison.store.branchName}</h2><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin size={13} />筑波大学から約{comparison.store.distanceKm}km</p></div>
          {comparison.isCheapest && <Badge>最安</Badge>}
        </div>
        <div className="my-5 rounded-2xl bg-teal-50 p-4">
          {comparison.totalPrice !== null ? <><p className="text-xs font-bold text-teal-800">予想購入金額</p><p className="mt-1 text-3xl font-black tracking-tight text-teal-900">{formatPrice(comparison.totalPrice)}</p></> : <><p className="text-xs font-bold text-amber-800">確認できた金額</p><p className="mt-1 text-3xl font-black tracking-tight text-amber-900">{formatPrice(knownAmount)}</p></>}
          <p className="mt-2 text-xs text-slate-600">購入可能 {comparison.availableItemCount}/{comparison.items.length}品</p>
        </div>
        {comparison.missingPriceCount > 0 && <div className="mb-4"><MissingPriceAlert count={comparison.missingPriceCount} /></div>}
        <PriceBreakdown items={comparison.items} />
        <Button fullWidth className="mt-5" onClick={onSelect} disabled={!canSelect}><ShoppingBasket size={17} />{canSelect ? "このスーパーを選ぶ" : "価格確認後に選択できます"}</Button>
      </div>
    </Card>
  );
}
