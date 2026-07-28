import type { Unit } from "../types";

export type ManualFlyerRow = {
  id: string;
  productName: string;
  ingredientId: string | null;
  price: number;
  quantity: number;
  unit: Unit;
};

export type ManualFlyer = {
  sourceFiles: string[];
  rows: ManualFlyerRow[];
};

export const manualFlyers: ManualFlyer[] = [
  {
    sourceFiles: ["IMG_3323.jpg", "flyer-ropia-0728-1.jpg"],
    rows: [
      { id: "beef-komagire", productName: "国産牛小間切れ", ingredientId: null, price: 259, quantity: 100, unit: "g" },
      { id: "beef-angus", productName: "ロピアアンガス牛バラ切落とし", ingredientId: null, price: 222, quantity: 100, unit: "g" },
      { id: "pork-shabu", productName: "豚ロース冷しゃぶ用", ingredientId: "pork-slice", price: 99, quantity: 100, unit: "g" },
      { id: "chicken", productName: "鶏むね肉", ingredientId: null, price: 69, quantity: 100, unit: "g" },
      { id: "lettuce", productName: "レタス", ingredientId: null, price: 111, quantity: 1, unit: "個" },
      { id: "eggplant", productName: "なす", ingredientId: null, price: 199, quantity: 5, unit: "本" },
    ],
  },
  {
    sourceFiles: ["IMG_3324.jpg", "flyer-ropia-0728-2.jpg"],
    rows: [
      { id: "corn", productName: "シャキッとコーン", ingredientId: null, price: 299, quantity: 3, unit: "缶" },
      { id: "ramen", productName: "辛ラーメン", ingredientId: null, price: 269, quantity: 3, unit: "食" },
      { id: "ponzu", productName: "味ぽん", ingredientId: null, price: 239, quantity: 500, unit: "ml" },
      { id: "rice", productName: "千葉県産コシヒカリ", ingredientId: "rice", price: 2499, quantity: 5, unit: "kg" },
      { id: "teppan", productName: "わが家のテッパン", ingredientId: null, price: 169, quantity: 110, unit: "g" },
      { id: "country-maam", productName: "カントリーマアム バニラ＆ココア", ingredientId: null, price: 189, quantity: 14, unit: "枚" },
      { id: "cheese", productName: "生さけるチーズ", ingredientId: "cheese", price: 499, quantity: 7, unit: "本" },
      { id: "fried-rice", productName: "本格炒め炒飯", ingredientId: null, price: 333, quantity: 450, unit: "g" },
    ],
  },
];

export function findManualFlyer(fileName: string) {
  return manualFlyers.find((flyer) => flyer.sourceFiles.includes(fileName));
}
