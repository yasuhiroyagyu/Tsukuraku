import { CheckCircle2, ChefHat, Home, LocateFixed, ShoppingBasket } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoreComparisonCard } from "../components/comparison/StoreComparisonCard";
import { Button } from "../components/common/Button";
import { EmptyState } from "../components/common/EmptyState";
import { PageContainer } from "../components/layout/PageContainer";
import { useMealPlanning } from "../contexts/MealPlanningContext";
import { aggregateRecipeIngredients } from "../features/comparison/comparison";
import { canUseCurrentLocationForStore, getStoreTravelTime } from "../features/location/travelTime";
import { useTravelTimes } from "../hooks/useTravelTimes";
import { mockRecipes } from "../mocks/recipes";

export function ComparePage() {
  const navigate = useNavigate();
  const [selectError, setSelectError] = useState<string | null>(null);
  const { position, status: locationStatus, retry: retryLocation } = useTravelTimes();
  const { selectedRecipeIds, inventory, comparisons, selectStore } = useMealPlanning();
  const recipes = mockRecipes.filter((item) => selectedRecipeIds.includes(item.id));
  const requiredIngredients = aggregateRecipeIngredients(recipes);
  if (recipes.length === 0 || comparisons.length === 0) return <PageContainer><EmptyState title="比較する準備ができていません" description="料理を選び、家にある食材を確認すると、スーパーごとの購入金額を比べられます。" action={<Button onClick={() => navigate(recipes.length > 0 ? "/inventory" : "/recipes")}>{recipes.length > 0 ? "食材を確認する" : "料理を選ぶ"}</Button>} /></PageContainer>;
  const homeCount = requiredIngredients.filter((item) => inventory.find((stored) => stored.ingredientId === item.ingredientId)?.hasItem).length;
  const missingCount = requiredIngredients.length - homeCount;
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
      <div className="mb-7 grid gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-3"><div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><ChefHat className="text-teal-700" size={21} /><div><p className="text-xs text-slate-500">選択中の料理</p><p className="font-black">{recipes.length}品</p><p className="mt-0.5 text-xs text-slate-600">{recipes.map((recipe) => recipe.name).join("・")}</p></div></div><div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><ShoppingBasket className="text-amber-600" size={21} /><div><p className="text-xs text-slate-500">買う必要あり</p><p className="font-black">{missingCount}品</p></div></div><div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><Home className="text-blue-600" size={21} /><div><p className="text-xs text-slate-500">家にある</p><p className="font-black">{homeCount}品</p></div></div></div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
        <div className="flex items-center gap-2"><LocateFixed size={18} className="text-teal-700" /><span className="font-bold">{locationStatus === "requesting" ? "現在地を確認しています" : locationStatus === "current" ? "現在地からの移動時間を表示中" : "位置情報を使えないため筑波大学からの目安を表示中"}</span></div>
        {locationStatus === "fallback" && <Button variant="ghost" onClick={retryLocation}>位置情報を再取得</Button>}
      </div>
      {selectError && <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700" role="alert">{selectError}</p>}
      {missingCount === 0 ? <EmptyState title="買い足す食材はありません" description="必要な食材はすべて家にあります。そのまま料理を始められます。" action={<div className="flex items-center gap-2 font-bold text-teal-700"><CheckCircle2 />準備OK！</div>} /> : <div className="grid items-start gap-5 lg:grid-cols-3">{comparisons.map((comparison) => <StoreComparisonCard key={comparison.store.id} comparison={comparison} travelTime={getStoreTravelTime(comparison.store, position)} usesCurrentLocation={locationStatus === "current" && canUseCurrentLocationForStore(comparison.store)} onSelect={() => { void choose(comparison.store.id); }} />)}</div>}
    </PageContainer>
  );
}
