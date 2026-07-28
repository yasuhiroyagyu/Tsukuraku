import { ChefHat, Home, ListChecks, ShoppingBasket, Store } from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "ホーム", icon: Home },
  { to: "/recipes", label: "料理", icon: ChefHat },
  { to: "/inventory", label: "食材", icon: ListChecks },
  { to: "/compare", label: "比較", icon: Store },
  { to: "/shopping-list", label: "買い物", icon: ShoppingBasket },
];

export function BottomNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden" aria-label="モバイルナビゲーション">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `flex flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-bold ${isActive ? "text-teal-700" : "text-slate-500"}`}>
            <Icon size={20} aria-hidden="true" />{label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
