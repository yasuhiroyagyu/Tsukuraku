import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { PageContainer } from "../components/layout/PageContainer";
import { RecipeCard } from "../components/recipes/RecipeCard";
import { RecipeFilters } from "../components/recipes/RecipeFilters";
import { useRecipes } from "../hooks/useRecipes";

export function RecipesPage() {
  const { recipes, loading, error, reload } = useRecipes();
  const [filters, setFilters] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => recipes.filter((recipe) => {
    const matchesQuery = recipe.name.includes(query) || recipe.description.includes(query);
    return matchesQuery && filters.every((filter) => recipe.tags.includes(filter));
  }), [recipes, query, filters]);
  const toggle = (filter: string) => setFilters((current) => current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter]);

  return (
    <PageContainer>
      <div className="mb-6 sm:flex sm:items-end sm:justify-between"><div><p className="eyebrow">CHOOSE YOUR MEAL</p><h1 className="mt-2 text-3xl font-black tracking-tight">今日は何をつくる？</h1><p className="mt-2 text-sm text-slate-600">手軽さも、予算も。ちょうどいいごはんを見つけよう。</p></div><label className="relative mt-4 block sm:mt-0 sm:w-72"><span className="sr-only">料理を検索</span><Search className="absolute left-3 top-3 text-slate-400" size={19} /><input className="field-input pl-10" placeholder="料理名で検索" value={query} onChange={(event) => setQuery(event.target.value)} /></label></div>
      <RecipeFilters selected={filters} onToggle={toggle} onClear={() => setFilters([])} />
      {loading ? <LoadingState label="おいしい候補を探しています" /> : error ? <div className="mt-6"><ErrorState message={error} onRetry={reload} /></div> : filtered.length === 0 ? <div className="mt-6"><EmptyState title="条件に合う料理がありません" description="フィルターや検索ワードを少し変えてみてください。" /></div> : <><div className="mb-4 mt-7 flex items-center justify-between"><p className="text-sm font-bold text-slate-600"><span className="text-lg font-black text-ink">{filtered.length}</span>件の料理</p></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtered.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}</div></>}
    </PageContainer>
  );
}
