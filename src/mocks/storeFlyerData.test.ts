import { describe, expect, it } from "vitest";
import { mockFlyerItems } from "./flyerItems";
import { mockFlyers } from "./flyers";
import { mockStores } from "./stores";

const addedStoreIds = [
  "tairaya-tsukuba-sakura",
  "taiyo-gakuen-no-mori",
  "york-benimaru-tsukuba-takezono",
  "york-benimaru-tsukuba-sakuranomori",
  "hanamasa-plus-tsukuba",
  "tairaya-tsukuba-oho",
] as const;

describe("追加店舗のチラシデータ", () => {
  it("指定された6店舗が一意なIDで1件ずつ存在する", () => {
    expect(new Set(mockStores.map((store) => store.id)).size).toBe(mockStores.length);

    for (const storeId of addedStoreIds) {
      expect(mockStores.filter((store) => store.id === storeId)).toHaveLength(1);
    }
  });

  it.each(addedStoreIds)("%s に公開済みチラシが1件存在する", (storeId) => {
    const publishedFlyers = mockFlyers.filter(
      (flyer) => flyer.storeId === storeId && flyer.status === "published",
    );

    expect(publishedFlyers).toHaveLength(1);
  });

  it.each(addedStoreIds)("%s に公開済み商品が23件あり、参照が整合する", (storeId) => {
    const [flyer] = mockFlyers.filter(
      (candidate) => candidate.storeId === storeId && candidate.status === "published",
    );
    const publishedItems = mockFlyerItems.filter(
      (item) => item.storeId === storeId && item.status === "published",
    );

    expect(flyer).toBeDefined();
    expect(publishedItems).toHaveLength(23);
    for (const item of publishedItems) {
      expect(item.storeId).toBe(storeId);
      expect(item.flyerId).toBe(flyer.id);
      expect(mockFlyers.find((candidate) => candidate.id === item.flyerId)?.storeId).toBe(storeId);
    }
  });
});
