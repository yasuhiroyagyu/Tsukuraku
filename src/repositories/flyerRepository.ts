import { supabase } from "../lib/supabase";
import { mockFlyerItems } from "../mocks/flyerItems";
import { mockFlyers } from "../mocks/flyers";
import type { Flyer, FlyerItem } from "../types";

export interface FlyerRepository {
  getAll(): Promise<Flyer[]>;
  getItems(): Promise<FlyerItem[]>;
  save(flyer: Flyer, items: FlyerItem[]): Promise<void>;
}

type StoredFlyerData = {
  flyers: Flyer[];
  items: FlyerItem[];
};

const storageKey = "tsukuraku-flyer-database";

const loadLocalData = (): StoredFlyerData => {
  if (typeof localStorage === "undefined") return { flyers: [], items: [] };
  const raw = localStorage.getItem(storageKey);
  if (!raw) return { flyers: [], items: [] };
  try {
    const parsed = JSON.parse(raw) as Partial<StoredFlyerData>;
    return {
      flyers: Array.isArray(parsed.flyers) ? parsed.flyers : [],
      items: Array.isArray(parsed.items) ? parsed.items : [],
    };
  } catch {
    return { flyers: [], items: [] };
  }
};

const saveLocalData = (data: StoredFlyerData) => {
  localStorage.setItem(storageKey, JSON.stringify(data));
};

class MockFlyerRepository implements FlyerRepository {
  async getAll() {
    const stored = loadLocalData();
    const storedIds = new Set(stored.flyers.map((flyer) => flyer.id));
    return [...stored.flyers, ...mockFlyers.filter((flyer) => !storedIds.has(flyer.id))];
  }

  async getItems() {
    const stored = loadLocalData();
    const approved = stored.items.filter((item) =>
      item.status === "approved" || item.status === "published",
    );
    const storedKeys = new Set(approved.map((item) => `${item.storeId}:${item.ingredientId}`));
    return [
      ...approved,
      ...mockFlyerItems.filter((item) => !storedKeys.has(`${item.storeId}:${item.ingredientId}`)),
    ];
  }

  async save(flyer: Flyer, items: FlyerItem[]) {
    const stored = loadLocalData();
    saveLocalData({
      flyers: [flyer, ...stored.flyers.filter((candidate) => candidate.id !== flyer.id)],
      items: [
        ...items,
        ...stored.items.filter((candidate) => candidate.flyerId !== flyer.id),
      ],
    });
  }
}

class SupabaseFlyerRepository implements FlyerRepository {
  async getAll() {
    if (!supabase) return mockFlyers;
    const { data, error } = await supabase.from("flyers").select("*").order("validFrom", { ascending: false });
    if (error) throw new Error(`チラシの取得に失敗しました: ${error.message}`);
    return data as Flyer[];
  }
  async getItems() {
    if (!supabase) return mockFlyerItems;
    const { data, error } = await supabase.from("flyer_items").select("*");
    if (error) throw new Error(`価格情報の取得に失敗しました: ${error.message}`);
    return data as FlyerItem[];
  }

  async save(flyer: Flyer, items: FlyerItem[]) {
    if (!supabase) return;
    const { error: flyerError } = await supabase.from("flyers").upsert(flyer);
    if (flyerError) throw new Error(`チラシの保存に失敗しました: ${flyerError.message}`);
    const { error: itemsError } = await supabase.from("flyer_items").upsert(items);
    if (itemsError) throw new Error(`商品データの保存に失敗しました: ${itemsError.message}`);
  }
}

export const flyerRepository: FlyerRepository = supabase
  ? new SupabaseFlyerRepository()
  : new MockFlyerRepository();
