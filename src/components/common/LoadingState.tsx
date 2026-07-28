export function LoadingState({ label = "読み込んでいます" }: { label?: string }) {
  return (
    <div className="flex min-h-48 items-center justify-center gap-3 text-sm font-medium text-slate-600" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-teal-600 border-r-transparent" />
      {label}
    </div>
  );
}
