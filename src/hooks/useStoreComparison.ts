import { useMealPlanning } from "../contexts/MealPlanningContext";
export const useStoreComparison = () => {
  const { comparisons, selectedStoreId, compareStores, selectStore } = useMealPlanning();
  return { comparisons, selectedStoreId, compareStores, selectStore };
};
