import { Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "./Card";

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <Card className="flex flex-col items-center px-6 py-12 text-center">
      <span className="mb-4 rounded-full bg-teal-50 p-3 text-teal-700"><Inbox aria-hidden="true" /></span>
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </Card>
  );
}
