import type { ShoppingListItem as ShoppingListItemType } from "../../types";
import { ShoppingListItem } from "./ShoppingListItem";

export function ShoppingList({ items, onToggle }: { items: ShoppingListItemType[]; onToggle: (id: string) => void }) {
  return <div className="space-y-2">{items.map((item) => <ShoppingListItem key={item.id} item={item} onToggle={() => onToggle(item.id)} />)}</div>;
}
