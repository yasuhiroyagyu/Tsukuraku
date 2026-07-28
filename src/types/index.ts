export type UserRole = "user" | "admin";

export type FlyerStatus =
  | "uploaded"
  | "ocr_processing"
  | "review_required"
  | "approved"
  | "published"
  | "failed";

export type FlyerItemStatus =
  | "review_required"
  | "approved"
  | "rejected"
  | "published";

export type Unit = "g" | "kg" | "ml" | "l" | "個" | "本" | "袋" | "パック";

export type Store = {
  id: string;
  name: string;
  branchName: string;
  address: string;
  distanceKm: number;
};

export type Ingredient = {
  id: string;
  name: string;
  category: string;
  standardUnit: Unit;
  isSeasoning?: boolean;
};

export type RecipeIngredient = {
  ingredientId: string;
  quantity: number;
  unit: Unit;
  isOptional?: boolean;
};

export type Recipe = {
  id: string;
  name: string;
  description: string;
  cookingTime: number;
  estimatedCost: number;
  difficulty: "簡単" | "普通";
  imageUrl: string;
  tags: string[];
  ingredients: RecipeIngredient[];
  instructions: string[];
};

export type Flyer = {
  id: string;
  storeId: string;
  imageUrl: string;
  validFrom: string;
  validTo: string;
  status: FlyerStatus;
};

export type FlyerItem = {
  id: string;
  flyerId: string;
  storeId: string;
  ingredientId: string | null;
  productNameRaw: string;
  price: number | null;
  packageQuantity: number | null;
  packageUnit: Unit | null;
  taxType: "included" | "excluded" | "unknown";
  confidence: number;
  validFrom: string;
  validTo: string;
  status: FlyerItemStatus;
};

export type InventoryItem = { ingredientId: string; hasItem: boolean };

export type StoreComparisonItem = {
  ingredientId: string;
  flyerItemId: string | null;
  requiredQuantity: number;
  requiredUnit: Unit;
  packagesRequired: number | null;
  purchasePrice: number | null;
  isPriceUnknown: boolean;
};

export type StoreComparison = {
  store: Store;
  items: StoreComparisonItem[];
  totalPrice: number | null;
  missingPriceCount: number;
  availableItemCount: number;
  isCheapest: boolean;
};

export type ShoppingListItem = {
  id: string;
  ingredientId: string;
  name: string;
  quantityLabel: string;
  price: number;
  checked: boolean;
};

export type MealPlanningState = {
  selectedRecipeId: string | null;
  inventory: InventoryItem[];
  comparisons: StoreComparison[];
  selectedStoreId: string | null;
  shoppingList: ShoppingListItem[];
};
