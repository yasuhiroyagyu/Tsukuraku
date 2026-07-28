import { mockRecipes } from "../mocks/recipes";
import type { Recipe } from "../types";
import { supabase } from "../lib/supabase";

export interface RecipeRepository {
  getAll(): Promise<Recipe[]>;
  getById(id: string): Promise<Recipe | null>;
}

class MockRecipeRepository implements RecipeRepository {
  async getAll() { return mockRecipes; }
  async getById(id: string) { return mockRecipes.find((recipe) => recipe.id === id) ?? null; }
}

class SupabaseRecipeRepository implements RecipeRepository {
  async getAll() {
    if (!supabase) return mockRecipes;
    const { data, error } = await supabase.from("recipes").select("*, ingredients:recipe_ingredients(*)");
    if (error) throw new Error(`料理データの取得に失敗しました: ${error.message}`);
    return data as Recipe[];
  }
  async getById(id: string) {
    if (!supabase) return null;
    const { data, error } = await supabase.from("recipes").select("*, ingredients:recipe_ingredients(*)").eq("id", id).maybeSingle();
    if (error) throw new Error(`料理データの取得に失敗しました: ${error.message}`);
    return data as Recipe | null;
  }
}

export const recipeRepository: RecipeRepository = supabase
  ? new SupabaseRecipeRepository()
  : new MockRecipeRepository();
