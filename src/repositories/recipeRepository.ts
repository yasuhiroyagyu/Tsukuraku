import { mockRecipes } from "../mocks/recipes";
import type { Recipe, Unit } from "../types";
import { supabase } from "../lib/supabase";

export interface RecipeRepository {
  getAll(): Promise<Recipe[]>;
  getById(id: string): Promise<Recipe | null>;
}

class MockRecipeRepository implements RecipeRepository {
  async getAll() { return mockRecipes; }
  async getById(id: string) { return mockRecipes.find((recipe) => recipe.id === id) ?? null; }
}

type RecipeIngredientRow = {
  ingredient_id: string;
  quantity: number | string;
  unit: Unit;
  is_optional: boolean | null;
  sort_order: number | null;
};

type RecipeStepRow = {
  step_number: number;
  instruction: string;
};

type RecipeRow = {
  id: string;
  name: string;
  description: string | null;
  cooking_time: number;
  estimated_cost: number | null;
  difficulty: Recipe["difficulty"] | number;
  servings: number;
  category: string;
  wattage: number | null;
  image_url: string | null;
  tags: string[] | null;
  ingredients: RecipeIngredientRow[] | null;
  steps: RecipeStepRow[] | null;
};

const fallbackImageUrl =
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80";

export const mapRecipeRow = (row: RecipeRow): Recipe => ({
  id: row.id,
  name: row.name,
  description: row.description ?? "",
  cookingTime: row.cooking_time,
  estimatedCost: row.estimated_cost,
  difficulty: row.difficulty === 1 || row.difficulty === "簡単" ? "簡単" : "普通",
  servings: row.servings,
  category: row.category,
  wattage: row.wattage,
  imageUrl: row.image_url ?? fallbackImageUrl,
  tags: row.tags ?? [],
  ingredients: [...(row.ingredients ?? [])]
    .sort((left, right) => (left.sort_order ?? 0) - (right.sort_order ?? 0))
    .map((ingredient) => ({
      ingredientId: ingredient.ingredient_id,
      quantity: Number(ingredient.quantity),
      unit: ingredient.unit,
      isOptional: ingredient.is_optional ?? false,
    })),
  instructions: [...(row.steps ?? [])]
    .sort((left, right) => left.step_number - right.step_number)
    .map((step) => step.instruction),
});

class SupabaseRecipeRepository implements RecipeRepository {
  async getAll() {
    if (!supabase) return mockRecipes;
    const { data, error } = await supabase
      .from("recipes")
      .select("*, ingredients:recipe_ingredients(*), steps:recipe_steps(*)");
    if (error) throw new Error(`料理データの取得に失敗しました: ${error.message}`);
    return ((data ?? []) as RecipeRow[]).map(mapRecipeRow);
  }
  async getById(id: string) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("recipes")
      .select("*, ingredients:recipe_ingredients(*), steps:recipe_steps(*)")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(`料理データの取得に失敗しました: ${error.message}`);
    return data ? mapRecipeRow(data as RecipeRow) : null;
  }
}

export const recipeRepository: RecipeRepository = supabase
  ? new SupabaseRecipeRepository()
  : new MockRecipeRepository();
