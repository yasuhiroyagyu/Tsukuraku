import { ArrowRight, ImageOff, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/common/Badge";
import { EmptyState } from "../../components/common/EmptyState";
import { PageContainer } from "../../components/layout/PageContainer";
import { mockFlyerItems } from "../../mocks/flyerItems";
import { mockFlyers } from "../../mocks/flyers";
import { mockStores } from "../../mocks/stores";
import type { FlyerStatus } from "../../types";
import { formatDate } from "../../utils/format";

const labels: Record<FlyerStatus, string> = { uploaded: "登録済み", ocr_processing: "解析中", review_required: "確認待ち", approved: "承認済み", published: "公開中", failed: "エラー" };

export function AdminFlyersPage() {
  return <PageContainer className="max-w-none"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">FLYERS</p><h1 className="mt-2 text-3xl font-black">チラシ一覧</h1><p className="mt-2 text-sm text-slate-600">掲載期間と商品解析の状況を管理します。</p></div><Link to="/admin/flyers/upload" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-800"><Plus size={17} />チラシを登録</Link></div>{mockFlyers.length === 0 ? <div className="mt-7"><EmptyState title="チラシ画像がありません" description="最初のチラシをアップロードしてください。" /></div> : <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{mockFlyers.map((flyer) => { const store = mockStores.find((item) => item.id === flyer.storeId); const count = mockFlyerItems.filter((item) => item.flyerId === flyer.id).length; const tone = flyer.status === "failed" ? "rose" : flyer.status === "published" ? "teal" : "amber"; return <article key={flyer.id} className="overflow-hidden rounded-2xl border bg-white shadow-card"><div className="relative h-44 bg-slate-100">{flyer.imageUrl ? <img src={flyer.imageUrl} alt={`${store?.name ?? "店舗"}のチラシ`} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-slate-400"><ImageOff /></div>}<span className="absolute right-3 top-3"><Badge tone={tone}>{labels[flyer.status]}</Badge></span></div><div className="p-5"><p className="text-xs font-bold text-slate-500">{store?.name}</p><h2 className="text-lg font-black">{store?.branchName}</h2><dl className="mt-4 space-y-2 text-sm"><div className="flex justify-between"><dt className="text-slate-500">掲載期間</dt><dd className="font-bold">{formatDate(flyer.validFrom)}〜{formatDate(flyer.validTo)}</dd></div><div className="flex justify-between"><dt className="text-slate-500">登録商品</dt><dd className="font-bold">{count}件</dd></div></dl><Link to="/admin/review" className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-sm font-bold text-teal-800 hover:bg-teal-100">解析結果確認へ <ArrowRight size={16} /></Link></div></article>; })}</div>}</PageContainer>;
}
