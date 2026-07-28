import { ArrowRight, CheckCheck, PackageOpen, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { EmptyState } from "../components/common/EmptyState";
import { PageContainer } from "../components/layout/PageContainer";
import { useMealPlanning } from "../contexts/MealPlanningContext";
import { ingredientMap } from "../mocks/ingredients";
import { mockRecipes } from "../mocks/recipes";
import { formatQuantity } from "../utils/format";

export function InventoryPage() {
  const navigate = useNavigate();
  const [comparing, setComparing] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);
  const { selectedRecipeId, inventory, setInventoryItem, setAllInventory, compareStores } = useMealPlanning();
  const recipe = mockRecipes.find((item) => item.id === selectedRecipeId);
  if (!recipe) return <PageContainer><EmptyState title="先に料理を選びましょう" description="料理を選ぶと、必要な食材をここで確認できます。" action={<Button onClick={() => navigate("/recipes")}>料理を選ぶ</Button>} /></PageContainer>;
  const setSeasonings = () => setAllInventory(inventory.map((item) => ({ ...item, hasItem: ingredientMap.get(item.ingredientId)?.isSeasoning ? true : item.hasItem })));
  const hasCount = inventory.filter((item) => item.hasItem).length;
  const proceed = async () => {
    if (comparing) return;
    setComparing(true);
    setCompareError(null);
    try {
      await compareStores(recipe);
      navigate("/compare");
    } catch (reason: unknown) {
      setCompareError(reason instanceof Error ? reason.message : "価格情報の取得に失敗しました");
    } finally {
      setComparing(false);
    }
  };
  return (
    <PageContainer>
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">CHECK YOUR PANTRY</p><h1 className="mt-2 text-3xl font-black tracking-tight">家にあるものは？</h1><p className="mt-2 text-sm leading-6 text-slate-600"><strong className="text-ink">{recipe.name}</strong>に必要な食材です。あるものにチェックを入れてください。</p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
          <div className="flex items-center justify-between border-b bg-teal-50 px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-teal-700"><PackageOpen size={21} /></span><div><p className="text-xs font-bold text-teal-700">必要な食材</p><p className="font-black">{recipe.ingredients.length}品中 {hasCount}品が家にある</p></div></div><span className="text-2xl font-black text-teal-800">{Math.round((hasCount / recipe.ingredients.length) * 100)}%</span></div>
          <div className="divide-y divide-slate-100">
            {recipe.ingredients.map((needed) => { const info = ingredientMap.get(needed.ingredientId); const checked = inventory.find((item) => item.ingredientId === needed.ingredientId)?.hasItem ?? false; return <label key={needed.ingredientId} className={`flex cursor-pointer items-center gap-4 px-5 py-4 transition hover:bg-slate-50 ${checked ? "bg-teal-50/40" : ""}`}><input type="checkbox" checked={checked} onChange={(event) => setInventoryItem(needed.ingredientId, event.target.checked)} /><span className="min-w-0 flex-1"><span className="block font-bold text-slate-800">{info?.name ?? needed.ingredientId}</span><span className="mt-0.5 block text-xs text-slate-500">必要量 {formatQuantity(needed.quantity, needed.unit)}{info?.isSeasoning ? "・調味料" : ""}</span></span>{checked && <span className="flex items-center gap-1 text-xs font-bold text-teal-700"><CheckCheck size={15} />家にある</span>}</label>; })}
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2"><Button variant="ghost" onClick={() => setAllInventory(inventory.map((item) => ({ ...item, hasItem: false }))) }><PackageOpen size={17} />すべて家にない</Button><Button variant="secondary" onClick={setSeasonings}><Sparkles size={17} />調味料は家にある</Button></div>
        {compareError && <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700" role="alert">{compareError}</p>}
        <div className="sticky bottom-20 z-20 mt-6 rounded-2xl border border-teal-200 bg-white/95 p-3 shadow-xl backdrop-blur md:bottom-4"><Button fullWidth className="min-h-13" onClick={proceed} disabled={comparing}>{comparing ? "価格を取得中…" : "スーパーを比較する"} {!comparing && <ArrowRight size={18} />}</Button></div>
      </div>
    </PageContainer>
  );
}
