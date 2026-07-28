import { describe, expect, it } from "vitest";
import { ingredientAliases } from "./ingredientAliases";
import { ingredientMap } from "./ingredients";
import { mockRecipes } from "./recipes";

const microwaveRecipes = mockRecipes.filter((recipe) => recipe.tags.includes("電子レンジ"));

describe("電子レンジ料理データ", () => {
  it("CSVの3料理をアプリ用データとして保持する", () => {
    expect(microwaveRecipes.map((recipe) => recipe.id)).toEqual([
      "soboro-don",
      "microwave-napolitan",
      "infinite-green-pepper",
    ]);
  });

  it("全食材IDが食材マスタに存在する", () => {
    for (const recipe of microwaveRecipes) {
      for (const ingredient of recipe.ingredients) {
        expect(ingredientMap.has(ingredient.ingredientId), `${recipe.name}: ${ingredient.ingredientId}`).toBe(true);
      }
    }
  });

  it("手順番号相当の配列順・1人分・600Wを保持する", () => {
    expect(microwaveRecipes.map((recipe) => recipe.instructions.length)).toEqual([5, 7, 4]);
    expect(microwaveRecipes.every((recipe) => recipe.servings === 1)).toBe(true);
    expect(microwaveRecipes.every((recipe) => recipe.wattage === 600)).toBe(true);
  });

  it("全別名の参照先が食材マスタに存在する", () => {
    expect(ingredientAliases.every((alias) => ingredientMap.has(alias.ingredientId))).toBe(true);
  });
});
