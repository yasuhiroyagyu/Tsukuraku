import { CircleAlert, RotateCcw } from "lucide-react";
import { Button } from "./Button";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center" role="alert">
      <CircleAlert className="mx-auto text-rose-600" aria-hidden="true" />
      <p className="mt-3 font-bold text-rose-900">うまく読み込めませんでした</p>
      <p className="mt-1 text-sm text-rose-700">{message}</p>
      {onRetry && <Button variant="ghost" className="mt-4" onClick={onRetry}><RotateCcw size={16} />再読み込み</Button>}
    </div>
  );
}
