import { FileImage, ScanLine, Soup, Timer, UploadCloud } from "lucide-react";
import { Link } from "react-router-dom";
import { AdminStatsCard } from "../../components/admin/AdminStatsCard";
import { Card } from "../../components/common/Card";
import { PageContainer } from "../../components/layout/PageContainer";
import { mockFlyerItems } from "../../mocks/flyerItems";
import { mockFlyers } from "../../mocks/flyers";
import { mockRecipes } from "../../mocks/recipes";

export function AdminDashboardPage() {
  const stats = [
    { label: "登録済みチラシ", value: mockFlyers.length, icon: FileImage, tone: "blue" as const },
    { label: "OCR処理待ち", value: mockFlyers.filter((item) => item.status === "ocr_processing").length, icon: Timer, tone: "amber" as const },
    { label: "確認待ち商品", value: mockFlyerItems.filter((item) => item.status === "review_required").length, icon: ScanLine, tone: "rose" as const },
    { label: "公開中商品", value: mockFlyerItems.filter((item) => item.status === "published").length, icon: UploadCloud, tone: "teal" as const },
    { label: "登録済み料理", value: mockRecipes.length, icon: Soup, tone: "blue" as const },
  ];
  return <PageContainer className="max-w-none"><div><p className="eyebrow">ADMIN CONSOLE</p><h1 className="mt-2 text-3xl font-black">管理ダッシュボード</h1><p className="mt-2 text-sm text-slate-600">チラシ・OCR・料理データの現在地をまとめて確認できます。</p></div><div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{stats.map((stat) => <AdminStatsCard key={stat.label} {...stat} />)}</div><div className="mt-7 grid gap-5 lg:grid-cols-2"><Card className="p-5"><h2 className="font-black">次に確認すること</h2><div className="mt-4 space-y-3"><Link to="/admin/review" className="flex items-center justify-between rounded-xl bg-amber-50 p-4 text-sm font-bold text-amber-900 hover:bg-amber-100"><span>信頼度の低いOCR商品を確認</span><span>1件 →</span></Link><Link to="/admin/flyers/upload" className="flex items-center justify-between rounded-xl bg-teal-50 p-4 text-sm font-bold text-teal-900 hover:bg-teal-100"><span>新しいチラシを登録</span><span>登録へ →</span></Link></div></Card><Card className="p-5"><h2 className="font-black">接続ステータス</h2><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between border-b pb-3"><dt className="text-slate-500">データソース</dt><dd className="font-bold">モックデータ</dd></div><div className="flex justify-between border-b pb-3"><dt className="text-slate-500">管理者認証</dt><dd className="font-bold text-amber-700">MVP・未接続</dd></div><div className="flex justify-between"><dt className="text-slate-500">最終更新</dt><dd className="font-bold">たった今</dd></div></dl></Card></div></PageContainer>;
}
