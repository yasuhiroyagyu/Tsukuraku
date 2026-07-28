import { CircleAlert } from "lucide-react";
export function MissingPriceAlert({ count }: { count: number }) {
  return <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900"><CircleAlert size={18} className="mt-0.5 shrink-0" aria-hidden="true" /><span><strong>価格不明：{count}商品</strong><br />チラシで価格を確認できていない商品があります。</span></div>;
}
