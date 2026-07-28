import { supabase } from "../lib/supabase";
import { mockStores } from "../mocks/stores";
import type { Store } from "../types";

export interface StoreRepository { getAll(): Promise<Store[]>; }

class MockStoreRepository implements StoreRepository {
  async getAll() { return mockStores; }
}

class SupabaseStoreRepository implements StoreRepository {
  async getAll() {
    if (!supabase) return mockStores;
    const { data, error } = await supabase.from("stores").select("*").order("distanceKm");
    if (error) throw new Error(`店舗データの取得に失敗しました: ${error.message}`);
    return data as Store[];
  }
}

export const storeRepository: StoreRepository = supabase
  ? new SupabaseStoreRepository()
  : new MockStoreRepository();
