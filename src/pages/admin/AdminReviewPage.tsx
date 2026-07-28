import { CheckCheck, ScanText } from "lucide-react";
import { useMemo, useState } from "react";
import { OcrReviewCard } from "../../components/admin/OcrReviewCard";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { PageContainer } from "../../components/layout/PageContainer";
import { mockFlyerItems } from "../../mocks/flyerItems";
import { mockFlyers } from "../../mocks/flyers";
import type { FlyerItem, FlyerItemStatus } from "../../types";

export function AdminReviewPage() {
  const seed = mockFlyerItems.filter((item) => ["chicken-thigh", "onion", "egg"].includes(item.ingredientId ?? ""));
  const [items, setItems] = useState<FlyerItem[]>(seed.map((item, index) => ({ ...item, status: index < 5 ? "review_required" : item.status })));
  const [lowOnly, setLowOnly] = useState(false);
  const pending = items.filter((item) => item.status === "review_required").length;
  const visible = useMemo(() => lowOnly ? items.filter((item) => item.confidence < 0.8) : items, [items, lowOnly]);
  const update = (next: FlyerItem) => setItems((current) => current.map((item) => item.id === next.id ? next : item));
  const status = (id: string, next: FlyerItemStatus) => setItems((current) => current.map((item) => item.id === id ? { ...item, status: next } : item));
  const approveAll = () => setItems((current) => current.map((item) => item.status === "review_required" ? { ...item, status: "approved" } : item));
  return <PageContainer className="max-w-none"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">OCR REVIEW</p><h1 className="mt-2 text-3xl font-black">OCR結果を確認</h1><p className="mt-2 text-sm text-slate-600">抽出結果を修正し、公開できる価格データに整えます。</p></div><Button onClick={approveAll} disabled={pending === 0}><CheckCheck size={17} />未確認を一括承認</Button></div><div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white p-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-700"><ScanText size={20} /></span><div><p className="text-xs text-slate-500">未確認件数</p><p className="text-xl font-black">{pending}件</p></div></div><label className="flex cursor-pointer items-center gap-2 text-sm font-bold"><input type="checkbox" checked={lowOnly} onChange={(event) => setLowOnly(event.target.checked)} />信頼度80%未満のみ表示</label></div><div className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]"><div className="xl:sticky xl:top-20 xl:self-start"><div className="overflow-hidden rounded-2xl border bg-white shadow-card"><img src={mockFlyers[0]?.imageUrl} alt="OCR確認対象のチラシ" className="max-h-[650px] w-full object-cover" /><div className="p-3 text-xs text-slate-500">画像を見ながら右側の抽出結果を確認してください。</div></div></div><div className="space-y-4">{visible.length === 0 ? <EmptyState title="OCR結果がありません" description="条件に一致する確認対象はありません。" /> : visible.map((item) => <OcrReviewCard key={item.id} item={item} onChange={update} onStatus={(next) => status(item.id, next)} />)}</div></div></PageContainer>;
}
