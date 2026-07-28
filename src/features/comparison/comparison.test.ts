import { describe, expect, it } from "vitest";
import { mockFlyerItems } from "../../mocks/flyerItems";
import { mockRecipes } from "../../mocks/recipes";
import { mockStores } from "../../mocks/stores";
import type { InventoryItem } from "../../types";
import {
  buildShoppingList,
  calculatePackagesRequired,
  calculateStoreComparisons,
  getMissingIngredients,
} from "./comparison";

const oyakodon = mockRecipes.find((recipe) => recipe.id === "oyakodon");
if (!oyakodon) throw new Error("親子丼のモックが必要です");

const pantry: InventoryItem[] = [
  { ingredientId: "rice", hasItem: true },
  { ingredientId: "soy-sauce", hasItem: true },
  { ingredientId: "mirin", hasItem: true },
  { ingredientId: "dashi", hasItem: true },
];

describe("価格比較ロジック", () => {
  it("家にある食材を除外する", () => {
    expect(getMissingIngredients(oyakodon.ingredients, pantry).map((item) => item.ingredientId)).not.toContain("rice");
  });

  it("必要パック数を切り上げる", () => {
    expect(calculatePackagesRequired(150, "g", 100, "g")).toBe(2);
  });

  it("店舗ごとの合計金額を正しく計算する", () => {
    const result = calculateStoreComparisons(mockStores, oyakodon.ingredients, pantry, mockFlyerItems);
    expect(result.find((item) => item.store.id === "kasumi")?.totalPrice).toBe(632);
    expect(result.find((item) => item.store.id === "trial")?.totalPrice).toBe(556);
  });

  it("価格不明商品がある店舗の合計金額をnullにする", () => {
    const result = calculateStoreComparisons(mockStores, oyakodon.ingredients, pantry, mockFlyerItems);
    expect(result.find((item) => item.store.id === "lopia")?.totalPrice).toBeNull();
  });

  it("価格が揃う店舗の中から最安を決める", () => {
    const result = calculateStoreComparisons(mockStores, oyakodon.ingredients, pantry, mockFlyerItems);
    expect(result.find((item) => item.isCheapest)?.store.id).toBe("trial");
  });

  it("すべて家にある場合は買い物リストが空になる", () => {
    const allAvailable = oyakodon.ingredients.map((item) => ({ ingredientId: item.ingredientId, hasItem: true }));
    const [comparison] = calculateStoreComparisons(mockStores, oyakodon.ingredients, allAvailable, mockFlyerItems);
    expect(buildShoppingList(comparison, mockFlyerItems, new Map())).toEqual([]);
  });
});
