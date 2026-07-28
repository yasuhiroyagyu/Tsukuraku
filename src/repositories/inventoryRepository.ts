import { supabase } from "../lib/supabase";
import type { InventoryItem } from "../types";

export interface InventoryRepository {
  save(items: InventoryItem[]): Promise<void>;
  getAll(): Promise<InventoryItem[]>;
}

const storageKey = "tsukuraku-inventory";

class MockInventoryRepository implements InventoryRepository {
  async save(items: InventoryItem[]) { localStorage.setItem(storageKey, JSON.stringify(items)); }
  async getAll() {
    const value = localStorage.getItem(storageKey);
    if (!value) return [];
    try { return JSON.parse(value) as InventoryItem[]; } catch { return []; }
  }
}

class SupabaseInventoryRepository implements InventoryRepository {
  async save(items: InventoryItem[]) {
    if (!supabase) return;
    const { error } = await supabase.from("inventory_items").upsert(items, { onConflict: "ingredientId" });
    if (error) throw new Error(`在庫情報の保存に失敗しました: ${error.message}`);
  }
  async getAll() {
    if (!supabase) return [];
    const { data, error } = await supabase.from("inventory_items").select("ingredientId, hasItem");
    if (error) throw new Error(`在庫情報の取得に失敗しました: ${error.message}`);
    return data as InventoryItem[];
  }
}

export const inventoryRepository: InventoryRepository = supabase
  ? new SupabaseInventoryRepository()
  : new MockInventoryRepository();
