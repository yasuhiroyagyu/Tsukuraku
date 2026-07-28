import { beforeEach, describe, expect, it } from "vitest";
import type { Flyer, FlyerItem } from "../types";
import { flyerRepository } from "./flyerRepository";

const values = new Map<string, string>();

Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
    clear: () => { values.clear(); },
  },
  configurable: true,
});

describe("flyerRepository", () => {
  beforeEach(() => values.clear());

  it("uses an approved uploaded price in store comparisons", async () => {
    const flyer: Flyer = {
      id: "uploaded-lopia",
      storeId: "lopia",
      imageUrl: "data:image/jpeg;base64,demo",
      validFrom: "2026-07-28",
      validTo: "2026-08-03",
      status: "approved",
    };
    const rice: FlyerItem = {
      id: "uploaded-lopia-rice",
      flyerId: flyer.id,
      storeId: "lopia",
      ingredientId: "rice",
      productNameRaw: "千葉県産コシヒカリ",
      price: 2499,
      packageQuantity: 5,
      packageUnit: "kg",
      taxType: "excluded",
      confidence: 1,
      validFrom: flyer.validFrom,
      validTo: flyer.validTo,
      status: "approved",
    };

    await flyerRepository.save(flyer, [rice]);
    const items = await flyerRepository.getItems();
    const savedRice = items.find((item) =>
      item.storeId === "lopia" && item.ingredientId === "rice",
    );

    expect(savedRice?.price).toBe(2499);
    expect(savedRice?.id).toBe(rice.id);
  });
});
