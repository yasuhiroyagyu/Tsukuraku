import { describe, expect, it } from "vitest";
import { resolveIngredientId } from "./ingredientMatching";

describe("食材名の表記ゆれ解決", () => {
  it.each([
    ["国産 若鶏ひき肉 200g", "chicken-mince"],
    ["お徳用あらびきウインナー", "sausage"],
    ["ライトツナ 3缶パック", "tuna"],
    ["玉葱 3個入", "onion"],
    ["スパゲティ 500g", "pasta"],
  ])("%s を %s に対応付ける", (productName, ingredientId) => {
    expect(resolveIngredientId(productName)).toBe(ingredientId);
  });

  it("未登録の商品名はnullを返す", () => {
    expect(resolveIngredientId("登録されていない商品")).toBeNull();
  });
});
