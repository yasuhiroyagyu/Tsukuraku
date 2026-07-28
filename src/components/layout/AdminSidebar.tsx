import { FileImage, Gauge, ScanText, Soup, Upload } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin", label: "ダッシュボード", icon: Gauge, end: true },
  { to: "/admin/flyers", label: "チラシ一覧", icon: FileImage },
  { to: "/admin/flyers/upload", label: "アップロード", icon: Upload },
  { to: "/admin/review", label: "OCR確認", icon: ScanText },
  { to: "/admin/recipes", label: "料理管理", icon: Soup },
];

export function AdminSidebar() {
  return (
    <aside className="border-b border-slate-200 bg-slate-900 text-white lg:min-h-[calc(100vh-4rem)] lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex gap-2 overflow-x-auto p-3 lg:block lg:space-y-1 lg:p-5">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition ${isActive ? "bg-teal-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}>
            <Icon size={18} aria-hidden="true" />{label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
