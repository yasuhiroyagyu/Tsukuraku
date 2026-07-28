import { describe, expect, it } from "vitest";
import { mapRecipeRow } from "./recipeRepository";

describe("Supabase料理データの変換", () => {
  it("snake_caseと正規化済みの関連表を画面用Recipeへ変換する", () => {
    const recipe = mapRecipeRow({
      id: "test-recipe",
      name: "テスト料理",
      description: null,
      cooking_time: 8,
      estimated_cost: null,
      difficulty: 1,
      servings: 1,
      category: "副菜",
      wattage: 600,
      image_url: null,
      tags: ["電子レンジ"],
      ingredients: [
        { ingredient_id: "salt", quantity: "1", unit: "少々", is_optional: true, sort_order: 2 },
        { ingredient_id: "green-pepper", quantity: 3, unit: "個", is_optional: false, sort_order: 1 },
      ],
      steps: [
        { step_number: 2, instruction: "加熱する。" },
        { step_number: 1, instruction: "混ぜる。" },
      ],
    });

    expect(recipe.estimatedCost).toBeNull();
    expect(recipe.difficulty).toBe("簡単");
    expect(recipe.ingredients.map((item) => item.ingredientId)).toEqual(["green-pepper", "salt"]);
    expect(recipe.ingredients[1].isOptional).toBe(true);
    expect(recipe.instructions).toEqual(["混ぜる。", "加熱する。"]);
  });
});
