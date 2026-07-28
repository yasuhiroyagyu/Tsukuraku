import { Check, Clock3, Coins, ListTree, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMealPlanning } from "../../contexts/MealPlanningContext";
import type { Recipe } from "../../types";
import { formatPrice } from "../../utils/format";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { Card } from "../common/Card";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const navigate = useNavigate();
  const { selectedRecipeIds, addRecipe, removeRecipe } = useMealPlanning();
  const isSelected = selectedRecipeIds.includes(recipe.id);
  const toggleCart = () => {
    if (isSelected) removeRecipe(recipe.id);
    else addRecipe(recipe);
  };

  return (
    <Card className="group flex h-full flex-col overflow-hidden">
      <button className="relative h-44 w-full overflow-hidden bg-teal-50 text-left" onClick={() => navigate(`/recipes/${recipe.id}`)} aria-label={`${recipe.name}の詳細を見る`}>
        <img src={recipe.imageUrl} alt={recipe.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
        <span className="absolute left-3 top-3"><Badge tone={recipe.difficulty === "簡単" ? "teal" : "amber"}>{recipe.difficulty}</Badge></span>
      </button>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex-1">
          <h2 className="text-lg font-black tracking-tight text-ink">{recipe.name}</h2>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{recipe.description}</p>
          <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-slate-50 px-1 py-2"><Clock3 className="mx-auto text-teal-700" size={16} /><dt className="sr-only">調理時間</dt><dd className="mt-1 text-xs font-bold">{recipe.cookingTime}分</dd></div>
            <div className="rounded-xl bg-slate-50 px-1 py-2"><Coins className="mx-auto text-teal-700" size={16} /><dt className="sr-only">想定金額</dt><dd className="mt-1 text-xs font-bold">{formatPrice(recipe.estimatedCost)}</dd></div>
            <div className="rounded-xl bg-slate-50 px-1 py-2"><ListTree className="mx-auto text-teal-700" size={16} /><dt className="sr-only">必要食材数</dt><dd className="mt-1 text-xs font-bold">{recipe.ingredients.length}品</dd></div>
          </dl>
        </div>
        <Button fullWidth variant={isSelected ? "secondary" : "primary"} className="mt-4" onClick={toggleCart}>{isSelected ? <Check size={17} /> : <Plus size={17} />}{isSelected ? "献立かごに追加済み" : "献立かごに追加"}</Button>
      </div>
    </Card>
  );
}
