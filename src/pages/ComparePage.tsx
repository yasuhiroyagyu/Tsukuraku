import { CheckCircle2, ChefHat, Home, ShoppingBasket } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoreComparisonCard } from "../components/comparison/StoreComparisonCard";
import { Button } from "../components/common/Button";
import { EmptyState } from "../components/common/EmptyState";
import { PageContainer } from "../components/layout/PageContainer";
import { useMealPlanning } from "../contexts/MealPlanningContext";
import { mockRecipes } from "../mocks/recipes";

export function ComparePage() {
  const navigate = useNavigate();
  const [selectError, setSelectError] = useState<string | null>(null);
  const { selectedRecipeId, inventory, comparisons, selectStore } = useMealPlanning();
  const recipe = mockRecipes.find((item) => item.id === selectedRecipeId);
  if (!recipe || comparisons.length === 0) return <PageContainer><EmptyState title="比較する準備ができていません" description="料理を選び、家にある食材を確認すると、スーパーごとの購入金額を比べられます。" action={<Button onClick={() => navigate(recipe ? "/inventory" : "/recipes")}>{recipe ? "食材を確認する" : "料理を選ぶ"}</Button>} /></PageContainer>;
  const homeCount = inventory.filter((item) => item.hasItem).length;
  const missingCount = recipe.ingredients.length - homeCount;
  const choose = async (storeId: string) => {
    setSelectError(null);
    try {
      await selectStore(storeId);
      navigate("/shopping-list");
    } catch (reason: unknown) {
      setSelectError(reason instanceof Error ? reason.message : "買い物リストの作成に失敗しました");
    }
  };
  return (
    <PageContainer>
      <div className="mb-7"><p className="eyebrow">COMPARE STORES</p><h1 className="mt-2 text-3xl font-black tracking-tight">どこで買うのがお得？</h1><p className="mt-2 text-sm text-slate-600">チラシの掲載価格から、必要なパック数まで計算しました。</p></div>
      <div className="mb-7 grid gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-3"><div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><ChefHat className="text-teal-700" size={21} /><div><p className="text-xs text-slate-500">選択中の料理</p><p className="font-black">{recipe.name}</p></div></div><div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><ShoppingBasket className="text-amber-600" size={21} /><div><p className="text-xs text-slate-500">買う必要あり</p><p className="font-black">{missingCount}品</p></div></div><div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><Home className="text-blue-600" size={21} /><div><p className="text-xs text-slate-500">家にある</p><p className="font-black">{homeCount}品</p></div></div></div>
      {selectError && <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700" role="alert">{selectError}</p>}
      {missingCount === 0 ? <EmptyState title="買い足す食材はありません" description="必要な食材はすべて家にあります。そのまま料理を始められます。" action={<div className="flex items-center gap-2 font-bold text-teal-700"><CheckCircle2 />準備OK！</div>} /> : <div className="grid items-start gap-5 lg:grid-cols-3">{comparisons.map((comparison) => <StoreComparisonCard key={comparison.store.id} comparison={comparison} onSelect={() => { void choose(comparison.store.id); }} />)}</div>}
    </PageContainer>
  );
}
