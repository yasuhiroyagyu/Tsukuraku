import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, UploadCloud, X } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { mockStores } from "../../mocks/stores";
import { Button } from "../common/Button";

const schema = z.object({
  supermarket: z.string().min(1, "スーパーを選択してください"),
  storeId: z.string().min(1, "店舗を選択してください"),
  validFrom: z.string().min(1, "掲載開始日を入力してください"),
  validTo: z.string().min(1, "掲載終了日を入力してください"),
  runOcr: z.boolean(),
}).refine((value) => value.validTo >= value.validFrom, { message: "終了日は開始日以降にしてください", path: ["validTo"] });

type FormValues = z.infer<typeof schema>;

export function FlyerUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { supermarket: "", storeId: "", validFrom: "2026-07-28", validTo: "2026-08-03", runOcr: true },
  });

  const handleFile = (nextFile?: File) => {
    setSuccess(false);
    if (!nextFile || !nextFile.type.startsWith("image/")) { setFileError("画像ファイルを選択してください"); return; }
    if (nextFile.size > 10 * 1024 * 1024) { setFileError("画像は10MB以下にしてください"); return; }
    if (preview) URL.revokeObjectURL(preview);
    setFile(nextFile); setPreview(URL.createObjectURL(nextFile)); setFileError(null);
  };
  const onDrop = (event: DragEvent<HTMLDivElement>) => { event.preventDefault(); handleFile(event.dataTransfer.files[0]); };
  const removeFile = () => { if (preview) URL.revokeObjectURL(preview); setFile(null); setPreview(null); };
  const submit = async () => {
    if (!file) { setFileError("チラシ画像を選択してください"); return; }
    await new Promise((resolve) => window.setTimeout(resolve, 500));
    setSuccess(true); removeFile(); reset();
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6" noValidate>
      {success && <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm font-bold text-teal-800" role="status">チラシを登録しました。モック環境ではOCR処理待ちとして扱います。</div>}
      <div className="grid gap-4 sm:grid-cols-2"><label><span className="field-label">スーパー</span><select className="field-input" {...register("supermarket")}><option value="">選択してください</option><option>カスミ</option><option>トライアル</option><option>ロピア</option></select>{errors.supermarket && <span className="mt-1 block text-xs text-rose-600">{errors.supermarket.message}</span>}</label><label><span className="field-label">店舗</span><select className="field-input" {...register("storeId")}><option value="">選択してください</option>{mockStores.map((store) => <option key={store.id} value={store.id}>{store.name} {store.branchName}</option>)}</select>{errors.storeId && <span className="mt-1 block text-xs text-rose-600">{errors.storeId.message}</span>}</label></div>
      <div className="grid gap-4 sm:grid-cols-2"><label><span className="field-label">掲載開始日</span><input type="date" className="field-input" {...register("validFrom")} />{errors.validFrom && <span className="mt-1 block text-xs text-rose-600">{errors.validFrom.message}</span>}</label><label><span className="field-label">掲載終了日</span><input type="date" className="field-input" {...register("validTo")} />{errors.validTo && <span className="mt-1 block text-xs text-rose-600">{errors.validTo.message}</span>}</label></div>
      <div><span className="field-label">チラシ画像</span>{preview ? <div className="relative overflow-hidden rounded-2xl border bg-slate-50"><img src={preview} alt="アップロードするチラシのプレビュー" className="mx-auto max-h-[480px] w-full object-contain" /><button type="button" onClick={removeFile} aria-label="選択した画像を削除" className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-slate-900/80 text-white hover:bg-slate-900"><X size={19} /></button></div> : <div onDragOver={(event) => event.preventDefault()} onDrop={onDrop} className="flex min-h-56 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 text-center transition hover:border-teal-500 hover:bg-teal-50/40"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-teal-700 shadow-sm"><ImagePlus size={27} /></span><p className="mt-4 font-black">画像をドラッグ＆ドロップ</p><p className="mt-1 text-xs text-slate-500">JPG / PNG / WEBP・最大10MB</p><Button type="button" variant="ghost" className="mt-4" onClick={() => inputRef.current?.click()}><UploadCloud size={17} />ファイルを選択</Button><input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(event) => handleFile(event.target.files?.[0])} aria-label="チラシ画像を選択" /></div>}{fileError && <span className="mt-2 block text-xs font-bold text-rose-600">{fileError}</span>}</div>
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border bg-slate-50 p-4"><input type="checkbox" className="mt-0.5" {...register("runOcr")} /><span><span className="block text-sm font-bold">アップロード後にOCRを実行する</span><span className="mt-1 block text-xs leading-5 text-slate-500">商品名・価格・容量を自動抽出し、確認待ちリストへ追加します。</span></span></label>
      <Button type="submit" fullWidth className="min-h-12" disabled={isSubmitting}><UploadCloud size={18} />{isSubmitting ? "アップロード中…" : "チラシをアップロード"}</Button>
    </form>
  );
}
