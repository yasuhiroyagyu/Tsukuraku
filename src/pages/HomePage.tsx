import { ArrowRight, Check, ChefHat, ListChecks, ShoppingBasket, Sparkles, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { mockRecipes } from "../mocks/recipes";

const steps = [
  { icon: ChefHat, title: "料理を選ぶ", detail: "安くて簡単な20のレシピから" },
  { icon: ListChecks, title: "家にあるもの", detail: "チェックするだけで不足を計算" },
  { icon: Store, title: "スーパー比較", detail: "筑大周辺の店舗からお得な上位3店を比較" },
  { icon: ShoppingBasket, title: "買い物へ", detail: "買うものをリストで確認" },
];

export function HomePage() {
  const heroRecipe = mockRecipes[0];
  return (
    <PageContainer className="pt-4 sm:pt-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-teal-950 px-6 py-10 text-white sm:px-10 sm:py-14 lg:grid lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-10 lg:px-14">
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-teal-600/20 blur-3xl" />
        <div className="relative z-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-800/50 px-3 py-1.5 text-xs font-bold text-teal-100"><Sparkles size={15} />筑波大生のための、ごはんナビ</div>
          <p className="eyebrow !text-teal-300">DECIDE. COMPARE. SHOP.</p>
          <h1 className="mt-3 text-4xl font-black leading-[1.18] tracking-tight sm:text-5xl">今日のごはんを、<br /><span className="text-teal-300">かしこく決めよう。</span></h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-teal-50/80 sm:text-base">安くて簡単な料理を選んだら、家にある食材をチェック。筑波大学周辺のスーパー価格を比べて、買い物リストまで一気に作れます。</p>
          <Link to="/recipes" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-black text-teal-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-teal-950">料理を選ぶ <ArrowRight size={18} /></Link>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-teal-100/80"><span className="flex items-center gap-1"><Check size={14} />登録不要</span><span className="flex items-center gap-1"><Check size={14} />最短1分</span><span className="flex items-center gap-1"><Check size={14} />無料で使える</span></div>
        </div>
        <div className="relative z-10 mt-10 lg:mt-0">
          <div className="rotate-2 rounded-[1.75rem] bg-white p-3 shadow-2xl shadow-black/30">
            <img src={heroRecipe.imageUrl} alt="親子丼の盛り付け例" className="h-56 w-full rounded-2xl object-cover sm:h-72" />
            <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-4 text-ink"><div><p className="text-xs font-bold text-teal-700">きょうの推しごはん</p><p className="text-xl font-black">とろとろ親子丼</p></div><div className="rounded-xl bg-amber-50 px-3 py-2 text-right"><p className="text-xs font-bold text-amber-700">約15分</p><p className="font-black text-amber-900">290円</p></div></div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="text-center"><p className="eyebrow">HOW IT WORKS</p><h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">買い物まで、たったの4ステップ</h2><p className="mt-3 text-sm text-slate-600">面倒な計算はつくらくにおまかせ。</p></div>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, detail }, index) => <li key={title} className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-card"><span className="absolute right-4 top-3 text-4xl font-black text-slate-100">0{index + 1}</span><span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-teal-700"><Icon size={22} /></span><h3 className="mt-4 font-black">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{detail}</p></li>)}
        </ol>
      </section>
    </PageContainer>
  );
}
