import type { LucideIcon } from "lucide-react";
import { Card } from "../common/Card";

export function AdminStatsCard({ label, value, icon: Icon, tone = "teal" }: { label: string; value: number; icon: LucideIcon; tone?: "teal" | "amber" | "blue" | "rose" }) {
  const tones = { teal: "bg-teal-50 text-teal-700", amber: "bg-amber-50 text-amber-700", blue: "bg-blue-50 text-blue-700", rose: "bg-rose-50 text-rose-700" };
  return <Card className="flex items-center gap-4 p-5"><span className={`grid h-11 w-11 place-items-center rounded-xl ${tones[tone]}`}><Icon size={22} aria-hidden="true" /></span><div><p className="text-sm font-bold text-slate-500">{label}</p><p className="mt-0.5 text-2xl font-black text-ink">{value.toLocaleString("ja-JP")}</p></div></Card>;
}
