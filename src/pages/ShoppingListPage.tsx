import { CheckCircle2, ChefHat, PartyPopper, Plus, RotateCcw, Store } from "lucide-react";
import { useState, type FormEvent } from "react";
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
  const { selectedRecipeIds, selectedStoreId, shoppingList, addShoppingItem, toggleShoppingItem, resetPlan } = useMealPlanning();
  const [complete, setComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualQuantity, setManualQuantity] = useState("");
  const [manualPrice, setManualPrice] = useState("");
  const [manualError, setManualError] = useState<string | null>(null);
  const recipes = mockRecipes.filter((item) => selectedRecipeIds.includes(item.id));
  const store = mockStores.find((item) => item.id === selectedStoreId);

  if (recipes.length === 0 || !store || shoppingList.length === 0) return <PageContainer><EmptyState title="買い物リストはまだ空です" description="料理とスーパーを選ぶと、ここに買うものがまとまります。" action={<Button onClick={() => navigate("/recipes")}>料理を選ぶ</Button>} /></PageContainer>;

  const knownTotal = shoppingList.reduce((sum, item) => sum + (item.price ?? 0), 0);
  const unknownPriceCount = shoppingList.filter((item) => item.price === null).length;
  const checked = shoppingList.filter((item) => item.checked).length;
  const finish = () => { if (submitting) return; setSubmitting(true); setComplete(true); setSubmitting(false); };
  const addManualItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = manualName.trim();
    const price = manualPrice.trim() === "" ? null : Number(manualPrice);

    if (!name) {
      setManualError("商品名を入力してください");
      return;
    }
    if (price !== null && (!Number.isFinite(price) || price < 0)) {
      setManualError("価格は0以上の数値で入力してください");
      return;
    }

    addShoppingItem({
      name,
      quantityLabel: manualQuantity.trim() || "数量未指定",
      price,
    });
    setManualName("");
    setManualQuantity("");
    setManualPrice("");
    setManualError(null);
  };

  if (complete) return <PageContainer><Card className="mx-auto max-w-xl px-6 py-14 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-100 text-teal-700"><PartyPopper size={30} /></span><h1 className="mt-5 text-2xl font-black">買い物、おつかれさまでした！</h1><p className="mt-3 text-sm leading-6 text-slate-600">これで{recipes.map((recipe) => recipe.name).join("・")}の準備はばっちり。おいしいごはんを楽しんでください。</p><Button className="mt-7" onClick={() => { resetPlan(); navigate("/recipes"); }}><RotateCcw size={17} />次の料理を探す</Button></Card></PageContainer>;

  return (
    <PageContainer><div className="mx-auto max-w-3xl"><p className="eyebrow">SHOPPING LIST</p><h1 className="mt-2 text-3xl font-black tracking-tight">買うものリスト</h1><div className="mt-5 grid gap-2 sm:grid-cols-2"><div className="flex items-center gap-3 rounded-xl border bg-white p-4"><Store className="text-teal-700" /><div><p className="text-xs text-slate-500">買い物する店舗</p><p className="font-black">{store.name} {store.branchName}</p></div></div><div className="flex items-center gap-3 rounded-xl border bg-white p-4"><ChefHat className="text-amber-600" /><div><p className="text-xs text-slate-500">つくる料理</p><p className="font-black">{recipes.map((recipe) => recipe.name).join("・")}</p></div></div></div>
      <Card className="mt-5 p-4 sm:p-6"><div className="mb-4 flex items-end justify-between"><div><p className="text-xs font-bold text-slate-500">進み具合</p><p className="mt-1 font-black">{checked} / {shoppingList.length}品 完了</p></div><span className="text-2xl font-black text-teal-800">{Math.round((checked / shoppingList.length) * 100)}%</span></div><div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${(checked / shoppingList.length) * 100}%` }} /></div><ShoppingList items={shoppingList} onToggle={toggleShoppingItem} /><form className="mt-5 rounded-2xl border border-dashed border-teal-300 bg-teal-50/50 p-4" onSubmit={addManualItem} noValidate><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-700 text-white"><Plus size={17} /></span><div><h2 className="font-black text-ink">買いたいものを追加</h2><p className="text-xs text-slate-600">価格を空欄にすると「価格不明」として追加されます。</p></div></div><div className="mt-4 grid gap-3 sm:grid-cols-[1fr_140px_120px_auto]"><label><span className="field-label">商品名</span><input aria-label="追加する商品名" className="field-input" value={manualName} onChange={(event) => setManualName(event.target.value)} placeholder="例：牛乳" /></label><label><span className="field-label">数量・メモ</span><input aria-label="追加する商品の数量・メモ" className="field-input" value={manualQuantity} onChange={(event) => setManualQuantity(event.target.value)} placeholder="例：1本" /></label><label><span className="field-label">価格（円）</span><input aria-label="追加する商品の価格" type="number" min="0" step="1" className="field-input" value={manualPrice} onChange={(event) => setManualPrice(event.target.value)} placeholder="任意" /></label><div className="flex items-end"><Button type="submit" className="w-full"><Plus size={17} />追加</Button></div></div>{manualError && <p className="mt-3 text-sm font-bold text-rose-700" role="alert">{manualError}</p>}</form><div className="mt-5 flex items-start justify-between gap-4 border-t pt-5"><div><span className="font-bold text-slate-600">{unknownPriceCount > 0 ? "確認できた合計" : "合計"}</span>{unknownPriceCount > 0 && <p className="mt-1 text-xs font-bold text-amber-700">価格不明の商品が{unknownPriceCount}件あります</p>}</div><span className="text-2xl font-black text-teal-900">{formatPrice(knownTotal)}</span></div></Card>
      <div className="sticky bottom-20 z-20 mt-5 grid gap-2 rounded-2xl border bg-white/95 p-3 shadow-xl backdrop-blur sm:grid-cols-2 md:bottom-4"><Button variant="ghost" onClick={() => navigate("/recipes")}><RotateCcw size={17} />料理を変更する</Button><Button onClick={finish} disabled={submitting}><CheckCircle2 size={17} />買い物を完了する</Button></div></div></PageContainer>
  );
}
