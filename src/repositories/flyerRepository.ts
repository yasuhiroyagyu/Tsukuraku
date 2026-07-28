import { supabase } from "../lib/supabase";
import { mockFlyerItems } from "../mocks/flyerItems";
import { mockFlyers } from "../mocks/flyers";
import type { Flyer, FlyerItem } from "../types";

export interface FlyerRepository {
  getAll(): Promise<Flyer[]>;
  getItems(): Promise<FlyerItem[]>;
}

class MockFlyerRepository implements FlyerRepository {
  async getAll() { return mockFlyers; }
  async getItems() { return mockFlyerItems; }
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
}

export const flyerRepository: FlyerRepository = supabase
  ? new SupabaseFlyerRepository()
  : new MockFlyerRepository();
