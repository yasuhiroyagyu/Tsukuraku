import { ingredientAliases } from "../mocks/ingredientAliases";
import { mockIngredients } from "../mocks/ingredients";

const normalize = (value: string) =>
  value.normalize("NFKC").toLocaleLowerCase("ja-JP").replace(/[\s\u3000]+/g, "");

const candidates = [
  ...mockIngredients.map((ingredient) => ({
    name: normalize(ingredient.name),
    ingredientId: ingredient.id,
  })),
  ...ingredientAliases.map((alias) => ({
    name: normalize(alias.alias),
    ingredientId: alias.ingredientId,
  })),
].sort((left, right) => right.name.length - left.name.length);

export const resolveIngredientId = (productName: string): string | null => {
  const normalizedProductName = normalize(productName);
  if (!normalizedProductName) return null;
  return candidates.find((candidate) => normalizedProductName.includes(candidate.name))?.ingredientId ?? null;
};
