import { useMealPlanning } from "../contexts/MealPlanningContext";
export const useShoppingList = () => {
  const { shoppingList, toggleShoppingItem } = useMealPlanning();
  return { shoppingList, toggleShoppingItem };
};
