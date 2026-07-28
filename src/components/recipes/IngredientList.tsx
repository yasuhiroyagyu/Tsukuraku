import { ingredientMap } from "../../mocks/ingredients";
import type { RecipeIngredient } from "../../types";
import { formatQuantity } from "../../utils/format";

export function IngredientList({ ingredients }: { ingredients: RecipeIngredient[] }) {
  return (
    <ul className="divide-y divide-slate-100">
      {ingredients.map((item) => (
        <li key={item.ingredientId} className="flex items-center justify-between gap-4 py-3 text-sm">
          <span className="font-bold text-slate-800">{ingredientMap.get(item.ingredientId)?.name ?? item.ingredientId}{item.isOptional ? <span className="ml-1 text-xs font-medium text-slate-500">（お好みで）</span> : null}</span>
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-600">{formatQuantity(item.quantity, item.unit)}</span>
        </li>
      ))}
    </ul>
  );
}
