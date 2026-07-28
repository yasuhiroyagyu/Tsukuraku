import { ArrowRight, ChefHat, Search, ShoppingBasket } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { Button } from "../components/common/Button";
import { PageContainer } from "../components/layout/PageContainer";
import { RecipeCard } from "../components/recipes/RecipeCard";
import { RecipeFilters } from "../components/recipes/RecipeFilters";
import { useMealPlanning } from "../contexts/MealPlanningContext";
import { useRecipes } from "../hooks/useRecipes";

export function RecipesPage() {
  const navigate = useNavigate();
  const { recipes, loading, error, reload } = useRecipes();
  const { selectedRecipeIds, removeRecipe } = useMealPlanning();
  const [filters, setFilters] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => recipes.filter((recipe) => {
    const matchesQuery = recipe.name.includes(query) || recipe.description.includes(query);
    return matchesQuery && filters.every((filter) => recipe.tags.includes(filter));
  }), [recipes, query, filters]);
  const toggle = (filter: string) => setFilters((current) => current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter]);
  const selectedRecipes = recipes.filter((recipe) => selectedRecipeIds.includes(recipe.id));

  return (
    <PageContainer>
      <div className="mb-6 sm:flex sm:items-end sm:justify-between"><div><p className="eyebrow">CHOOSE YOUR MEAL</p><h1 className="mt-2 text-3xl font-black tracking-tight">今日は何をつくる？</h1><p className="mt-2 text-sm text-slate-600">手軽さも、予算も。ちょうどいいごはんを見つけよう。</p></div><label className="relative mt-4 block sm:mt-0 sm:w-72"><span className="sr-only">料理を検索</span><Search className="absolute left-3 top-3 text-slate-400" size={19} /><input className="field-input pl-10" placeholder="料理名で検索" value={query} onChange={(event) => setQuery(event.target.value)} /></label></div>
      <RecipeFilters selected={filters} onToggle={toggle} onClear={() => setFilters([])} />
      {selectedRecipes.length > 0 && <section className="sticky top-3 z-20 mt-5 rounded-2xl border border-teal-200 bg-white/95 p-4 shadow-card backdrop-blur"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-100 text-teal-700"><ShoppingBasket size={20} /></span><div><p className="text-xs font-bold text-teal-700">献立かご</p><p className="font-black">{selectedRecipes.length}品を選択中</p><div className="mt-1 flex flex-wrap gap-1">{selectedRecipes.map((recipe) => <button key={recipe.id} type="button" onClick={() => removeRecipe(recipe.id)} className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-bold text-teal-800 hover:bg-teal-100" title={`${recipe.name}をかごから外す`}>{recipe.name} ×</button>)}</div></div></div><Button onClick={() => navigate("/inventory")}><ChefHat size={17} />食材をまとめて確認 <ArrowRight size={17} /></Button></div></section>}
      {loading ? <LoadingState label="おいしい候補を探しています" /> : error ? <div className="mt-6"><ErrorState message={error} onRetry={reload} /></div> : filtered.length === 0 ? <div className="mt-6"><EmptyState title="条件に合う料理がありません" description="フィルターや検索ワードを少し変えてみてください。" /></div> : <><div className="mb-4 mt-7 flex items-center justify-between"><p className="text-sm font-bold text-slate-600"><span className="text-lg font-black text-ink">{filtered.length}</span>件の料理</p></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtered.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}</div></>}
    </PageContainer>
  );
}
