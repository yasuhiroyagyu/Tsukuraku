import type {
  FlyerItem,
  InventoryItem,
  RecipeIngredient,
  ShoppingListItem,
  Store,
  StoreComparison,
  StoreComparisonItem,
  Unit,
} from "../../types";

const toBaseQuantity = (quantity: number, unit: Unit): { quantity: number; family: string } => {
  if (unit === "kg") return { quantity: quantity * 1000, family: "weight" };
  if (unit === "g") return { quantity, family: "weight" };
  if (unit === "l") return { quantity: quantity * 1000, family: "volume" };
  if (unit === "ml") return { quantity, family: "volume" };
  if (unit === "大さじ") return { quantity: quantity * 15, family: "volume" };
  if (unit === "小さじ") return { quantity: quantity * 5, family: "volume" };
  return { quantity, family: unit };
};

export const getMissingIngredients = (
  required: RecipeIngredient[],
  inventory: InventoryItem[],
) => {
  const available = new Set(inventory.filter((item) => item.hasItem).map((item) => item.ingredientId));
  return required.filter((item) => !item.isOptional && !available.has(item.ingredientId));
};

export const calculatePackagesRequired = (
  requiredQuantity: number,
  requiredUnit: Unit,
  packageQuantity: number,
  packageUnit: Unit,
): number | null => {
  if (requiredQuantity < 0 || packageQuantity <= 0) return null;

  const required = toBaseQuantity(requiredQuantity, requiredUnit);
  const packageSize = toBaseQuantity(packageQuantity, packageUnit);
  if (required.family !== packageSize.family) return null;

  return Math.ceil(required.quantity / packageSize.quantity);
};

const toComparisonItem = (
  required: RecipeIngredient,
  flyerItem?: FlyerItem,
): StoreComparisonItem => {
  if (!flyerItem || flyerItem.packageQuantity === null || flyerItem.packageUnit === null) {
    return {
      ingredientId: required.ingredientId,
      flyerItemId: flyerItem?.id ?? null,
      requiredQuantity: required.quantity,
      requiredUnit: required.unit,
      packagesRequired: null,
      purchasePrice: null,
      isPriceUnknown: true,
    };
  }

  const packagesRequired = calculatePackagesRequired(
    required.quantity,
    required.unit,
    flyerItem.packageQuantity,
    flyerItem.packageUnit,
  );

  return {
    ingredientId: required.ingredientId,
    flyerItemId: flyerItem.id,
    requiredQuantity: required.quantity,
    requiredUnit: required.unit,
    packagesRequired,
    purchasePrice: flyerItem.price === null || packagesRequired === null
      ? null
      : packagesRequired * flyerItem.price,
    isPriceUnknown: flyerItem.price === null || packagesRequired === null,
  };
};

const compareItem = (
  required: RecipeIngredient,
  flyerItems: FlyerItem[],
): StoreComparisonItem => {
  const candidates = flyerItems
    .filter((item) => item.ingredientId === required.ingredientId && item.status === "published")
    .map((item) => toComparisonItem(required, item));

  const pricedCandidates = candidates
    .filter((item) => item.purchasePrice !== null)
    .sort((left, right) => (left.purchasePrice as number) - (right.purchasePrice as number));

  return pricedCandidates[0] ?? candidates[0] ?? toComparisonItem(required);
};

export const calculateStoreComparisons = (
  stores: Store[],
  required: RecipeIngredient[],
  inventory: InventoryItem[],
  flyerItems: FlyerItem[],
): StoreComparison[] => {
  const missing = getMissingIngredients(required, inventory);
  const comparisons = stores.map((store) => {
    const storeItems = flyerItems.filter((item) => item.storeId === store.id);
    const items = missing.map((needed) => compareItem(needed, storeItems));
    const missingPriceCount = items.filter((item) => item.isPriceUnknown).length;
    const knownTotal = items.reduce((sum, item) => sum + (item.purchasePrice ?? 0), 0);

    return {
      store,
      items,
      totalPrice: missingPriceCount === 0 ? knownTotal : null,
      missingPriceCount,
      availableItemCount: items.length - missingPriceCount,
      isCheapest: false,
    } satisfies StoreComparison;
  });

  const priced = comparisons.filter((item) => item.totalPrice !== null);
  const cheapestTotal = priced.length > 0
    ? Math.min(...priced.map((item) => item.totalPrice as number))
    : null;

  return comparisons.map((item) => ({
    ...item,
    isCheapest: cheapestTotal !== null && item.totalPrice === cheapestTotal,
  }));
};

export const buildShoppingList = (
  comparison: StoreComparison,
  flyerItems: FlyerItem[],
  ingredientNames: Map<string, string>,
): ShoppingListItem[] =>
  comparison.items.map((item) => {
    const flyerItem = flyerItems.find((candidate) => candidate.id === item.flyerItemId);
    const quantityLabel = flyerItem
      && flyerItem.packageQuantity !== null
      && flyerItem.packageUnit !== null
      && item.packagesRequired !== null
      ? flyerItem.packageQuantity + flyerItem.packageUnit + "入り × " + item.packagesRequired
      : "必要 " + item.requiredQuantity + item.requiredUnit;

    return {
      id: comparison.store.id + "-" + item.ingredientId,
      ingredientId: item.ingredientId,
      name: ingredientNames.get(item.ingredientId) ?? flyerItem?.productNameRaw ?? item.ingredientId,
      quantityLabel,
      price: item.purchasePrice,
      checked: false,
    };
  });
