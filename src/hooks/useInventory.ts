import { useMealPlanning } from "../contexts/MealPlanningContext";
export const useInventory = () => {
  const { inventory, setInventoryItem, setAllInventory } = useMealPlanning();
  return { inventory, setInventoryItem, setAllInventory };
};
