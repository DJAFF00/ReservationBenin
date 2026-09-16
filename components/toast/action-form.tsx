"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./toast-provider";

type Field = { name: string; value: string };

export function ActionForm({
  action,
  fields,
  successMessage,
  children,
  className,
}: {
  action: (formData: FormData) => Promise<void>;
  fields: Field[];
  successMessage?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    fields.forEach((f) => formData.append(f.name, f.value));

    startTransition(async () => {
      try {
        await action(formData);
        if (successMessage) toast({ type: "success", message: successMessage });
        router.refresh();
      } catch (err) {
        toast({
          type: "error",
          message: err instanceof Error ? err.message : "Une erreur est survenue.",
        });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
}