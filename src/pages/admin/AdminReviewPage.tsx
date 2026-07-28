import { CheckCheck, ScanText } from "lucide-react";
import { useMemo, useState } from "react";
import { OcrReviewCard } from "../../components/admin/OcrReviewCard";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { PageContainer } from "../../components/layout/PageContainer";
import { useFlyerWorkflow } from "../../contexts/FlyerWorkflowContext";

export function AdminReviewPage() {
  const { reviewBatch, updateItem, setItemStatus, approveAll } = useFlyerWorkflow();
  const [lowOnly, setLowOnly] = useState(false);
  const pending = reviewBatch.items.filter((item) => item.status === "review_required").length;
  const visible = useMemo(
    () => lowOnly
      ? reviewBatch.items.filter((item) => item.confidence < 0.8)
      : reviewBatch.items,
    [reviewBatch.items, lowOnly],
  );
  const sourceLabel = reviewBatch.source === "manual_checked"
    ? "目視確認済みデータ"
    : reviewBatch.source === "entry_required"
      ? "抽出結果の入力待ち"
      : "サンプルデータ";

  return <PageContainer className="max-w-none"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">FLYER REVIEW</p><h1 className="mt-2 text-3xl font-black">チラシ解析結果を確認</h1><p className="mt-2 text-sm text-slate-600">商品データを修正し、価格比較で使える状態に整えます。</p></div><Button onClick={() => { void approveAll(); }} disabled={pending === 0}><CheckCheck size={17} />未確認を一括承認</Button></div><div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white p-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-700"><ScanText size={20} /></span><div><p className="text-xs text-slate-500">{reviewBatch.storeName}・{reviewBatch.fileName}</p><p className="text-xl font-black">{pending}件を確認</p><p className="mt-1 text-xs font-bold text-teal-700">{sourceLabel}</p></div></div><label className="flex cursor-pointer items-center gap-2 text-sm font-bold"><input type="checkbox" checked={lowOnly} onChange={(event) => setLowOnly(event.target.checked)} />信頼度80%未満のみ表示</label></div><div className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]"><div className="xl:sticky xl:top-20 xl:self-start"><div className="overflow-hidden rounded-2xl border bg-white shadow-card"><img src={reviewBatch.flyer.imageUrl} alt="確認対象のチラシ" className="max-h-[650px] w-full object-contain" /><div className="p-3 text-xs text-slate-500">画像を見ながら右側の商品データを確認してください。</div></div></div><div className="space-y-4">{visible.length === 0 ? <EmptyState title="解析結果がありません" description="条件に一致する確認対象はありません。" /> : visible.map((item) => <OcrReviewCard key={item.id} item={item} onChange={updateItem} onStatus={(next) => { void setItemStatus(item.id, next); }} />)}</div></div></PageContainer>;
}
