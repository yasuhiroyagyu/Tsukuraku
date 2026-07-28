import { describe, expect, it } from "vitest";
import { mockFlyerItems } from "../../mocks/flyerItems";
import { mockRecipes } from "../../mocks/recipes";
import { mockStores } from "../../mocks/stores";
import type { FlyerItem, InventoryItem, StoreComparison } from "../../types";
import {
  buildShoppingList,
  calculatePackagesRequired,
  calculateStoreComparisons,
  getMissingIngredients,
  refreshComparisonStores,
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

  it("お好みの食材は買い物対象から除外する", () => {
    expect(getMissingIngredients(
      [{ ingredientId: "pepper", quantity: 1, unit: "少々", isOptional: true }],
      [],
    )).toEqual([]);
  });

  it("必要パック数を切り上げる", () => {
    expect(calculatePackagesRequired(150, "g", 100, "g")).toBe(2);
  });

  it("大さじ・小さじをmlへ換算する", () => {
    expect(calculatePackagesRequired(2, "大さじ", 500, "ml")).toBe(1);
    expect(calculatePackagesRequired(3, "小さじ", 10, "ml")).toBe(2);
  });

  it("単位が異なる商品は購入額を確定しない", () => {
    expect(calculatePackagesRequired(150, "g", 1, "個")).toBeNull();
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

  it("同じ食材では必要パック数を含めた購入額が最小の商品を選ぶ", () => {
    const discountedChicken: FlyerItem = {
      ...mockFlyerItems.find((item) => item.id === "trial-chicken-thigh")!,
      id: "trial-chicken-thigh-discount",
      price: 100,
      packageQuantity: 200,
    };
    const result = calculateStoreComparisons(
      mockStores,
      oyakodon.ingredients,
      pantry,
      [...mockFlyerItems, discountedChicken],
    );
    const chicken = result.find((item) => item.store.id === "trial")?.items
      .find((item) => item.ingredientId === "chicken-thigh");

    expect(chicken?.flyerItemId).toBe("trial-chicken-thigh-discount");
    expect(chicken?.purchasePrice).toBe(100);
  });

  it("未公開のOCR結果は比較に利用しない", () => {
    const unpublishedChicken: FlyerItem = {
      ...mockFlyerItems.find((item) => item.id === "trial-chicken-thigh")!,
      id: "trial-chicken-thigh-unpublished",
      price: 1,
      status: "review_required",
    };
    const result = calculateStoreComparisons(
      mockStores,
      oyakodon.ingredients,
      pantry,
      [...mockFlyerItems, unpublishedChicken],
    );
    const chicken = result.find((item) => item.store.id === "trial")?.items
      .find((item) => item.ingredientId === "chicken-thigh");

    expect(chicken?.flyerItemId).toBe("trial-chicken-thigh");
    expect(chicken?.purchasePrice).toBe(270);
  });

  it("価格不明の商品も買い物リストへ残す", () => {
    const comparison = calculateStoreComparisons(mockStores, oyakodon.ingredients, pantry, mockFlyerItems)
      .find((item) => item.store.id === "lopia");
    if (!comparison) throw new Error("ロピアの比較結果が必要です");

    const list = buildShoppingList(comparison, mockFlyerItems, new Map([["egg", "卵"]]));
    expect(list).toHaveLength(3);
    expect(list.find((item) => item.ingredientId === "egg")).toMatchObject({
      name: "卵",
      quantityLabel: "必要 2個",
      price: null,
    });
  });

  it("すべて家にある場合は買い物リストが空になる", () => {
    const allAvailable = oyakodon.ingredients.map((item) => ({ ingredientId: item.ingredientId, hasItem: true }));
    const [comparison] = calculateStoreComparisons(mockStores, oyakodon.ingredients, allAvailable, mockFlyerItems);
    expect(buildShoppingList(comparison, mockFlyerItems, new Map())).toEqual([]);
  });

  it("保存済みの比較結果を最新の店舗情報で更新する", () => {
    const [comparison] = calculateStoreComparisons(
      [mockStores[0]],
      oyakodon.ingredients,
      pantry,
      mockFlyerItems,
    );
    const savedComparison = {
      ...comparison,
      store: {
        ...comparison.store,
        latitude: undefined,
        longitude: undefined,
      },
    } as unknown as StoreComparison;

    const [refreshed] = refreshComparisonStores([savedComparison], mockStores);

    expect(refreshed.store.latitude).toBe(mockStores[0].latitude);
    expect(refreshed.store.longitude).toBe(mockStores[0].longitude);
  });
});
