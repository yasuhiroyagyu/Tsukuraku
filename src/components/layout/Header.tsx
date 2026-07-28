import { Leaf, ShieldCheck } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-bold transition ${isActive ? "bg-teal-50 text-teal-800" : "text-slate-600 hover:bg-slate-50 hover:text-ink"}`;

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-ink" aria-label="つくらく ホーム">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-700 text-white"><Leaf size={20} aria-hidden="true" /></span>
          <span className="text-lg font-black tracking-tight">つくらく</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="メインナビゲーション">
          <NavLink to="/recipes" className={navClass}>料理を探す</NavLink>
          <NavLink to="/inventory" className={navClass}>家にあるもの</NavLink>
          <NavLink to="/compare" className={navClass}>価格比較</NavLink>
          <NavLink to="/shopping-list" className={navClass}>買い物リスト</NavLink>
        </nav>
        <Link to="/admin" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-teal-800">
          <ShieldCheck size={16} aria-hidden="true" /> 管理
        </Link>
      </div>
    </header>
  );
}
