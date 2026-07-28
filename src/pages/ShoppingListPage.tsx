import { CheckCircle2, ChefHat, PartyPopper, RotateCcw, Store } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { EmptyState } from "../components/common/EmptyState";
import { PageContainer } from "../components/layout/PageContainer";
import { ShoppingList } from "../components/shopping/ShoppingList";
import { useMealPlanning } from "../contexts/MealPlanningContext";
import { mockRecipes } from "../mocks/recipes";
import { mockStores } from "../mocks/stores";
import { formatPrice } from "../utils/format";

export function ShoppingListPage() {
  const navigate = useNavigate();
  const { selectedRecipeId, selectedStoreId, shoppingList, toggleShoppingItem, resetPlan } = useMealPlanning();
  const [complete, setComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const recipe = mockRecipes.find((item) => item.id === selectedRecipeId);
  const store = mockStores.find((item) => item.id === selectedStoreId);
  if (!recipe || !store || shoppingList.length === 0) return <PageContainer><EmptyState title="買い物リストはまだ空です" description="料理とスーパーを選ぶと、ここに買うものがまとまります。" action={<Button onClick={() => navigate("/recipes")}>料理を選ぶ</Button>} /></PageContainer>;
  const total = shoppingList.reduce((sum, item) => sum + item.price, 0);
  const checked = shoppingList.filter((item) => item.checked).length;
  const finish = () => { if (submitting) return; setSubmitting(true); setComplete(true); setSubmitting(false); };
  if (complete) return <PageContainer><Card className="mx-auto max-w-xl px-6 py-14 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-100 text-teal-700"><PartyPopper size={30} /></span><h1 className="mt-5 text-2xl font-black">買い物、おつかれさまでした！</h1><p className="mt-3 text-sm leading-6 text-slate-600">これで{recipe.name}の準備はばっちり。おいしいごはんを楽しんでください。</p><Button className="mt-7" onClick={() => { resetPlan(); navigate("/recipes"); }}><RotateCcw size={17} />次の料理を探す</Button></Card></PageContainer>;
  return (
    <PageContainer><div className="mx-auto max-w-3xl"><p className="eyebrow">SHOPPING LIST</p><h1 className="mt-2 text-3xl font-black tracking-tight">買うものリスト</h1><div className="mt-5 grid gap-2 sm:grid-cols-2"><div className="flex items-center gap-3 rounded-xl border bg-white p-4"><Store className="text-teal-700" /><div><p className="text-xs text-slate-500">買い物する店舗</p><p className="font-black">{store.name} {store.branchName}</p></div></div><div className="flex items-center gap-3 rounded-xl border bg-white p-4"><ChefHat className="text-amber-600" /><div><p className="text-xs text-slate-500">つくる料理</p><p className="font-black">{recipe.name}</p></div></div></div>
      <Card className="mt-5 p-4 sm:p-6"><div className="mb-4 flex items-end justify-between"><div><p className="text-xs font-bold text-slate-500">進み具合</p><p className="mt-1 font-black">{checked} / {shoppingList.length}品 完了</p></div><span className="text-2xl font-black text-teal-800">{Math.round((checked / shoppingList.length) * 100)}%</span></div><div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${(checked / shoppingList.length) * 100}%` }} /></div><ShoppingList items={shoppingList} onToggle={toggleShoppingItem} /><div className="mt-5 flex items-center justify-between border-t pt-5"><span className="font-bold text-slate-600">合計</span><span className="text-2xl font-black text-teal-900">{formatPrice(total)}</span></div></Card>
      <div className="sticky bottom-20 z-20 mt-5 grid gap-2 rounded-2xl border bg-white/95 p-3 shadow-xl backdrop-blur sm:grid-cols-2 md:bottom-4"><Button variant="ghost" onClick={() => navigate("/recipes")}><RotateCcw size={17} />料理を変更する</Button><Button onClick={finish} disabled={submitting}><CheckCircle2 size={17} />買い物を完了する</Button></div></div></PageContainer>
  );
}
