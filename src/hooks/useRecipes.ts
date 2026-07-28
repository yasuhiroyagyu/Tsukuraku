import { useEffect, useState } from "react";
import { recipeRepository } from "../repositories/recipeRepository";
import type { Recipe } from "../types";

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reload = () => {
    setLoading(true);
    setError(null);
    recipeRepository.getAll()
      .then(setRecipes)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "料理の取得に失敗しました"))
      .finally(() => setLoading(false));
  };
  useEffect(reload, []);
  return { recipes, loading, error, reload };
};
