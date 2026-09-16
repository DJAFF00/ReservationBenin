"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useToast, type ToastItem, type ToastType } from "./toast-provider";

const ICONS: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const ACCENT: Record<ToastType, string> = {
  success: "text-palm",
  error: "text-danger",
  info: "text-indigo",
};

export function ToastViewport() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end">
      {toasts.map((t) => (
        <ToastRow key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastRow({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  const Icon = ICONS[toast.type];

  return (
    <div className="glass pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-lg border border-border/60 px-4 py-3 shadow-xl">
      <Icon size={18} className={`mt-0.5 shrink-0 ${ACCENT[toast.type]}`} />
      <p className="flex-1 text-sm text-foreground">{toast.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 text-foreground-muted transition-colors hover:text-foreground"
        aria-label="Fermer la notification"
      >
        <X size={15} />
      </button>
    </div>
  );
}