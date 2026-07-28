import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, UploadCloud, X } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useFlyerWorkflow } from "../../contexts/FlyerWorkflowContext";
import { findManualFlyer } from "../../data/manualFlyers";
import { mockStores } from "../../mocks/stores";
import { flyerRepository } from "../../repositories/flyerRepository";
import type { FlyerItem } from "../../types";
import { Button } from "../common/Button";

const schema = z.object({
  supermarket: z.string().min(1, "スーパーを選択してください"),
  storeId: z.string().min(1, "店舗を選択してください"),
  validFrom: z.string().min(1, "掲載開始日を入力してください"),
  validTo: z.string().min(1, "掲載終了日を入力してください"),
}).refine((value) => value.validTo >= value.validFrom, { message: "終了日は開始日以降にしてください", path: ["validTo"] });

type FormValues = z.infer<typeof schema>;

const supermarketNames = Array.from(new Set(mockStores.map((store) => store.name)));

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("画像を読み込めませんでした"));
    reader.readAsDataURL(file);
  });
}

export function FlyerUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { stageReview } = useFlyerWorkflow();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { supermarket: "", storeId: "", validFrom: "2026-07-28", validTo: "2026-08-03" },
  });

  const handleFile = (nextFile?: File) => {
    if (!nextFile || !nextFile.type.startsWith("image/")) { setFileError("画像ファイルを選択してください"); return; }
    if (nextFile.size > 10 * 1024 * 1024) { setFileError("画像は10MB以下にしてください"); return; }
    if (preview) URL.revokeObjectURL(preview);
    setFile(nextFile); setPreview(URL.createObjectURL(nextFile)); setFileError(null);
  };
  const onDrop = (event: DragEvent<HTMLDivElement>) => { event.preventDefault(); handleFile(event.dataTransfer.files[0]); };
  const removeFile = () => { if (preview) URL.revokeObjectURL(preview); setFile(null); setPreview(null); };
  const submit = async (values: FormValues) => {
    if (!file) { setFileError("チラシ画像を選択してください"); return; }
    setFileError(null);

    try {
      const imageUrl = await readAsDataUrl(file);
      const manualFlyer = findManualFlyer(file.name);
      const flyerId = `flyer-${values.storeId}-${Date.now()}`;
      const common = {
        flyerId,
        storeId: values.storeId,
        taxType: "excluded" as const,
        validFrom: values.validFrom,
        validTo: values.validTo,
        status: "review_required" as const,
      };
      const items: FlyerItem[] = manualFlyer
        ? manualFlyer.rows.map((row) => ({
            ...common,
            id: `${flyerId}-${row.id}`,
            ingredientId: row.ingredientId,
            productNameRaw: row.productName,
            price: row.price,
            packageQuantity: row.quantity,
            packageUnit: row.unit,
            confidence: 1,
          }))
        : [{
            ...common,
            id: `${flyerId}-pending-1`,
            ingredientId: null,
            productNameRaw: "",
            price: null,
            packageQuantity: null,
            packageUnit: null,
            confidence: 0,
          }];

      const flyer = {
        id: flyerId,
        storeId: values.storeId,
        imageUrl,
        validFrom: values.validFrom,
        validTo: values.validTo,
        status: "review_required" as const,
      };
      await flyerRepository.save(flyer, items);
      stageReview({
        flyer,
        fileName: file.name,
        source: manualFlyer ? "manual_checked" : "entry_required",
        items,
      });
      navigate("/admin/review");
    } catch {
      setFileError("画像の登録に失敗しました。もう一度選択してください");
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6" noValidate>
      <div className="grid gap-4 sm:grid-cols-2"><label><span className="field-label">スーパー</span><select className="field-input" {...register("supermarket")}><option value="">選択してください</option>{supermarketNames.map((name) => <option key={name}>{name}</option>)}</select>{errors.supermarket && <span className="mt-1 block text-xs text-rose-600">{errors.supermarket.message}</span>}</label><label><span className="field-label">店舗</span><select className="field-input" {...register("storeId")}><option value="">選択してください</option>{mockStores.map((store) => <option key={store.id} value={store.id}>{store.name} {store.branchName}</option>)}</select>{errors.storeId && <span className="mt-1 block text-xs text-rose-600">{errors.storeId.message}</span>}</label></div>
      <div className="grid gap-4 sm:grid-cols-2"><label><span className="field-label">掲載開始日</span><input type="date" className="field-input" {...register("validFrom")} />{errors.validFrom && <span className="mt-1 block text-xs text-rose-600">{errors.validFrom.message}</span>}</label><label><span className="field-label">掲載終了日</span><input type="date" className="field-input" {...register("validTo")} />{errors.validTo && <span className="mt-1 block text-xs text-rose-600">{errors.validTo.message}</span>}</label></div>
      <div><span className="field-label">チラシ画像</span>{preview ? <div className="relative overflow-hidden rounded-2xl border bg-slate-50"><img src={preview} alt="アップロードするチラシのプレビュー" className="mx-auto max-h-[480px] w-full object-contain" /><button type="button" onClick={removeFile} aria-label="選択した画像を削除" className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-slate-900/80 text-white hover:bg-slate-900"><X size={19} /></button></div> : <div onDragOver={(event) => event.preventDefault()} onDrop={onDrop} className="flex min-h-56 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 text-center transition hover:border-teal-500 hover:bg-teal-50/40"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-teal-700 shadow-sm"><ImagePlus size={27} /></span><p className="mt-4 font-black">画像をドラッグ＆ドロップ</p><p className="mt-1 text-xs text-slate-500">JPG / PNG / WEBP・最大10MB</p><Button type="button" variant="ghost" className="mt-4" onClick={() => inputRef.current?.click()}><UploadCloud size={17} />ファイルを選択</Button><input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(event) => handleFile(event.target.files?.[0])} aria-label="チラシ画像を選択" /></div>}{fileError && <span className="mt-2 block text-xs font-bold text-rose-600">{fileError}</span>}</div>
      <div className="rounded-xl border bg-slate-50 p-4"><p className="text-sm font-bold">解析方法</p><p className="mt-1 text-xs leading-5 text-slate-500">確認済みのデモ画像は登録済みの商品データを読み込みます。それ以外の画像は解析結果を手入力できる状態でデータベースへ保存します。</p></div>
      <Button type="submit" fullWidth className="min-h-12" disabled={isSubmitting}><UploadCloud size={18} />{isSubmitting ? "データベースへ登録中…" : "解析してデータベースに登録"}</Button>
    </form>
  );
}
