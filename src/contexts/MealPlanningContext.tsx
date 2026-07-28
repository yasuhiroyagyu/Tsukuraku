import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { aggregateRecipeIngredients, buildShoppingList, calculateStoreComparisons } from "../features/comparison/comparison";
import { mockIngredients } from "../mocks/ingredients";
import { flyerRepository } from "../repositories/flyerRepository";
import { storeRepository } from "../repositories/storeRepository";
import type { InventoryItem, MealPlanningState, Recipe, ShoppingListItem, StoreComparison } from "../types";

const storageKey = "tsukuraku-meal-plan";
const initialState: MealPlanningState = {
  selectedRecipeIds: [],
  inventory: [],
  comparisons: [],
  selectedStoreId: null,
  shoppingList: [],
};

const loadState = (): MealPlanningState => {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return initialState;
  try {
    const saved = JSON.parse(raw) as Partial<MealPlanningState> & { selectedRecipeId?: string | null };
    return {
      ...initialState,
      ...saved,
      selectedRecipeIds: Array.isArray(saved.selectedRecipeIds)
        ? saved.selectedRecipeIds
        : saved.selectedRecipeId ? [saved.selectedRecipeId] : [],
    };
  }
  catch { return initialState; }
};

type ManualShoppingItem = Pick<ShoppingListItem, "name" | "quantityLabel" | "price">;

type MealPlanningContextValue = MealPlanningState & {
  addRecipe: (recipe: Recipe) => void;
  removeRecipe: (recipeId: string) => void;
  setInventoryItem: (ingredientId: string, hasItem: boolean) => void;
  setAllInventory: (items: InventoryItem[]) => void;
  compareStores: (recipes: Recipe[]) => Promise<StoreComparison[]>;
  selectStore: (storeId: string) => Promise<void>;
  addShoppingItem: (item: ManualShoppingItem) => void;
  toggleShoppingItem: (id: string) => void;
  resetPlan: () => void;
};

const MealPlanningContext = createContext<MealPlanningContextValue | null>(null);

export function MealPlanningProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MealPlanningState>(loadState);

  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(state)); }, [state]);

  const addRecipe = useCallback((recipe: Recipe) => {
    setState((current) => ({
      ...current,
      selectedRecipeIds: current.selectedRecipeIds.includes(recipe.id)
        ? current.selectedRecipeIds
        : [...current.selectedRecipeIds, recipe.id],
      inventory: [...current.inventory, ...recipe.ingredients
        .filter((item) => !current.inventory.some((stored) => stored.ingredientId === item.ingredientId))
        .map((item) => ({ ingredientId: item.ingredientId, hasItem: false }))],
      comparisons: [],
      selectedStoreId: null,
      shoppingList: [],
    }));
  }, []);

  const removeRecipe = useCallback((recipeId: string) => {
    setState((current) => ({
      ...current,
      selectedRecipeIds: current.selectedRecipeIds.filter((id) => id !== recipeId),
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

  const compareStores = useCallback(async (recipes: Recipe[]) => {
    const [stores, flyerItems] = await Promise.all([
      storeRepository.getAll(),
      flyerRepository.getItems(),
    ]);
    const comparisons = calculateStoreComparisons(stores, aggregateRecipeIngredients(recipes), state.inventory, flyerItems);
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
        shoppingList: [...buildShoppingList(comparison, flyerItems, names), ...current.shoppingList.filter((item) => item.isManual)],
      };
    });
  }, []);

  const addShoppingItem = useCallback((item: ManualShoppingItem) => {
    setState((current) => ({
      ...current,
      shoppingList: [
        ...current.shoppingList,
        {
          id: "manual-" + Date.now() + "-" + Math.random().toString(36).slice(2),
          ingredientId: "manual",
          name: item.name,
          quantityLabel: item.quantityLabel,
          price: item.price,
          checked: false,
          isManual: true,
        },
      ],
    }));
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
    addRecipe,
    removeRecipe,
    setInventoryItem,
    setAllInventory,
    compareStores,
    selectStore,
    addShoppingItem,
    toggleShoppingItem,
    resetPlan,
  }), [state, addRecipe, removeRecipe, setInventoryItem, setAllInventory, compareStores, selectStore, addShoppingItem, toggleShoppingItem, resetPlan]);

  return <MealPlanningContext.Provider value={value}>{children}</MealPlanningContext.Provider>;
}

export const useMealPlanning = () => {
  const context = useContext(MealPlanningContext);
  if (!context) throw new Error("useMealPlanning must be used within MealPlanningProvider");
  return context;
};
