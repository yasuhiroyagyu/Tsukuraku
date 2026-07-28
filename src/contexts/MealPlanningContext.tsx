import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { buildShoppingList, calculateStoreComparisons } from "../features/comparison/comparison";
import { mockIngredients } from "../mocks/ingredients";
import { flyerRepository } from "../repositories/flyerRepository";
import { storeRepository } from "../repositories/storeRepository";
import type { InventoryItem, MealPlanningState, Recipe, StoreComparison } from "../types";

const storageKey = "tsukuraku-meal-plan";
const initialState: MealPlanningState = {
  selectedRecipeId: null,
  inventory: [],
  comparisons: [],
  selectedStoreId: null,
  shoppingList: [],
};

const loadState = (): MealPlanningState => {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return initialState;
  try { return { ...initialState, ...(JSON.parse(raw) as Partial<MealPlanningState>) }; }
  catch { return initialState; }
};

type MealPlanningContextValue = MealPlanningState & {
  selectRecipe: (recipe: Recipe) => void;
  setInventoryItem: (ingredientId: string, hasItem: boolean) => void;
  setAllInventory: (items: InventoryItem[]) => void;
  compareStores: (recipe: Recipe) => Promise<StoreComparison[]>;
  selectStore: (storeId: string) => Promise<void>;
  toggleShoppingItem: (id: string) => void;
  resetPlan: () => void;
};

const MealPlanningContext = createContext<MealPlanningContextValue | null>(null);

export function MealPlanningProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MealPlanningState>(loadState);

  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(state)); }, [state]);

  const selectRecipe = useCallback((recipe: Recipe) => {
    setState((current) => ({
      ...current,
      selectedRecipeId: recipe.id,
      inventory: recipe.ingredients.map((item) => ({
        ingredientId: item.ingredientId,
        hasItem: current.selectedRecipeId === recipe.id
          ? (current.inventory.find((stored) => stored.ingredientId === item.ingredientId)?.hasItem ?? false)
          : false,
      })),
      comparisons: [],
      selectedStoreId: null,
      shoppingList: [],
    }));
  }, []);

  const setInventoryItem = useCallback((ingredientId: string, hasItem: boolean) => {
    setState((current) => ({
      ...current,
      inventory: current.inventory.map((item) => item.ingredientId === ingredientId ? { ...item, hasItem } : item),
      comparisons: [],
      selectedStoreId: null,
      shoppingList: [],
    }));
  }, []);

  const setAllInventory = useCallback((inventory: InventoryItem[]) => {
    setState((current) => ({ ...current, inventory, comparisons: [], selectedStoreId: null, shoppingList: [] }));
  }, []);

  const compareStores = useCallback(async (recipe: Recipe) => {
    const [stores, flyerItems] = await Promise.all([
      storeRepository.getAll(),
      flyerRepository.getItems(),
    ]);
    const comparisons = calculateStoreComparisons(stores, recipe.ingredients, state.inventory, flyerItems);
    setState((current) => ({ ...current, comparisons, selectedStoreId: null, shoppingList: [] }));
    return comparisons;
  }, [state.inventory]);

  const selectStore = useCallback(async (storeId: string) => {
    const flyerItems = await flyerRepository.getItems();
    setState((current) => {
      const comparison = current.comparisons.find((item) => item.store.id === storeId);
      if (!comparison) return current;
      const names = new Map(mockIngredients.map((item) => [item.id, item.name]));
      return {
        ...current,
        selectedStoreId: storeId,
        shoppingList: buildShoppingList(comparison, flyerItems, names),
      };
    });
  }, []);

  const toggleShoppingItem = useCallback((id: string) => {
    setState((current) => ({
      ...current,
      shoppingList: current.shoppingList.map((item) => item.id === id ? { ...item, checked: !item.checked } : item),
    }));
  }, []);

  const resetPlan = useCallback(() => setState(initialState), []);
  const value = useMemo(() => ({
    ...state,
    selectRecipe,
    setInventoryItem,
    setAllInventory,
    compareStores,
    selectStore,
    toggleShoppingItem,
    resetPlan,
  }), [state, selectRecipe, setInventoryItem, setAllInventory, compareStores, selectStore, toggleShoppingItem, resetPlan]);

  return <MealPlanningContext.Provider value={value}>{children}</MealPlanningContext.Provider>;
}

export const useMealPlanning = () => {
  const context = useContext(MealPlanningContext);
  if (!context) throw new Error("useMealPlanning must be used within MealPlanningProvider");
  return context;
};
