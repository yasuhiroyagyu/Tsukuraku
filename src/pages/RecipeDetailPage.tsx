import { ArrowLeft, ChefHat, Clock3, Coins, ListChecks } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { EmptyState } from "../components/common/EmptyState";
import { LoadingState } from "../components/common/LoadingState";
import { PageContainer } from "../components/layout/PageContainer";
import { IngredientList } from "../components/recipes/IngredientList";
import { useMealPlanning } from "../contexts/MealPlanningContext";
import { recipeRepository } from "../repositories/recipeRepository";
import type { Recipe } from "../types";
import { formatPrice } from "../utils/format";

export function RecipeDetailPage() {
  const { recipeId = "" } = useParams();
  const navigate = useNavigate();
  const { selectRecipe } = useMealPlanning();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { recipeRepository.getById(recipeId).then(setRecipe).finally(() => setLoading(false)); }, [recipeId]);
  if (loading) return <PageContainer><LoadingState /></PageContainer>;
  if (!recipe) return <PageContainer><EmptyState title="料理が見つかりません" description="この料理は削除されたか、URLが間違っている可能性があります。" action={<Link className="font-bold text-teal-700 underline" to="/recipes">料理一覧へ戻る</Link>} /></PageContainer>;
  const choose = () => { selectRecipe(recipe); navigate("/inventory"); };
  return (
    <PageContainer>
      <Link to="/recipes" className="mb-5 inline-flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-teal-700"><ArrowLeft size={17} />料理一覧へ</Link>
      <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-card lg:grid lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative min-h-72 bg-teal-50 lg:min-h-[560px]"><img src={recipe.imageUrl} alt={recipe.name} className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-24 text-white lg:hidden"><Badge>{recipe.difficulty}</Badge><h1 className="mt-3 text-3xl font-black">{recipe.name}</h1></div></div>
        <div className="p-6 sm:p-8 lg:p-10">
          <div className="hidden lg:block"><Badge>{recipe.difficulty}</Badge><h1 className="mt-3 text-4xl font-black tracking-tight">{recipe.name}</h1></div>
          <p className="mt-3 leading-7 text-slate-600">{recipe.description}</p>
          <dl className="mt-6 grid grid-cols-3 gap-2"><div className="rounded-xl bg-teal-50 p-3 text-center"><Clock3 className="mx-auto text-teal-700" size={19} /><dt className="mt-1 text-xs text-slate-500">調理時間</dt><dd className="font-black">{recipe.cookingTime}分</dd></div><div className="rounded-xl bg-teal-50 p-3 text-center"><Coins className="mx-auto text-teal-700" size={19} /><dt className="mt-1 text-xs text-slate-500">想定金額</dt><dd className="font-black">{formatPrice(recipe.estimatedCost)}</dd></div><div className="rounded-xl bg-teal-50 p-3 text-center"><ListChecks className="mx-auto text-teal-700" size={19} /><dt className="mt-1 text-xs text-slate-500">食材</dt><dd className="font-black">{recipe.ingredients.length}品</dd></div></dl>
          <section className="mt-8"><h2 className="text-lg font-black">必要な食材</h2><IngredientList ingredients={recipe.ingredients} /></section>
          <section className="mt-8"><h2 className="text-lg font-black">つくり方</h2><ol className="mt-3 space-y-4">{recipe.instructions.map((step, index) => <li key={step} className="flex gap-3 text-sm leading-6 text-slate-700"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-teal-700 text-xs font-black text-white">{index + 1}</span><span>{step}</span></li>)}</ol></section>
          <Button fullWidth className="mt-9 min-h-13" onClick={choose}><ChefHat size={19} />この料理に決める</Button>
        </div>
      </article>
    </PageContainer>
  );
}
