import type { FlyerItem, Unit } from "../types";

const item = (
  storeId: string,
  ingredientId: string,
  productNameRaw: string,
  price: number | null,
  packageQuantity: number | null,
  packageUnit: Unit | null,
  confidence = 0.94,
): FlyerItem => ({
  id: `${storeId}-${ingredientId}`,
  flyerId: `flyer-${storeId}`,
  storeId,
  ingredientId,
  productNameRaw,
  price,
  packageQuantity,
  packageUnit,
  taxType: "included",
  confidence,
  validFrom: "2026-07-25",
  validTo: "2026-08-02",
  status: confidence < 0.8 ? "review_required" : "published",
});

const shared: Array<[string, string, number, number, Unit]> = [
  ["rice", "茨城県産こしひかり", 1980, 5000, "g"],
  ["pork-belly", "国産豚バラうす切り", 298, 200, "g"],
  ["pork-slice", "国産豚こま切れ", 198, 200, "g"],
  ["pork-mince", "国産豚ひき肉", 188, 200, "g"],
  ["chicken-mince", "国産鶏ひき肉", 148, 200, "g"],
  ["tofu", "木綿豆腐", 58, 1, "パック"],
  ["cabbage", "キャベツ 1/2玉", 128, 500, "g"],
  ["carrot", "にんじん", 138, 3, "本"],
  ["bean-sprout", "緑豆もやし", 29, 1, "袋"],
  ["green-onion", "長ねぎ", 128, 2, "本"],
  ["udon", "ゆでうどん", 39, 1, "袋"],
  ["yakisoba", "蒸し焼きそば", 118, 3, "袋"],
  ["pasta", "スパゲッティ", 198, 500, "g"],
  ["kimchi", "白菜キムチ", 198, 300, "g"],
  ["tuna", "ライトツナ", 298, 3, "個"],
  ["tomato-sauce", "トマトソース", 158, 300, "g"],
  ["potato", "じゃがいも", 198, 5, "個"],
  ["curry-roux", "カレールー", 198, 140, "g"],
  ["ketchup", "トマトケチャップ", 178, 500, "g"],
  ["mayonnaise", "マヨネーズ", 248, 400, "g"],
];

const sharedItems = (storeId: string, multiplier: number) =>
  shared.map(([ingredientId, name, price, quantity, unit]) =>
    item(storeId, ingredientId, name, Math.round(price * multiplier), quantity, unit),
  );

export const mockFlyerItems: FlyerItem[] = [
  item("kasumi", "chicken-thigh", "若鶏もも肉 100g", 98, 100, "g"),
  item("kasumi", "onion", "玉ねぎ 3個入", 198, 3, "個"),
  item("kasumi", "egg", "白たまご 10個", 238, 10, "個"),
  ...sharedItems("kasumi", 1),
  item("trial", "chicken-thigh", "国産若鶏もも肉", 270, 300, "g"),
  item("trial", "onion", "玉ねぎ 1個", 68, 1, "個"),
  item("trial", "egg", "たまご 10個パック", 218, 10, "個"),
  ...sharedItems("trial", 0.94),
  item("lopia", "chicken-thigh", "若鶏もも肉 大容量", 450, 500, "g"),
  item("lopia", "onion", "玉ねぎ 3個入", 180, 3, "個"),
  item("lopia", "egg", "たまご 特売", null, 10, "個", 0.61),
  ...sharedItems("lopia", 0.9),
];
