"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast, type ToastType } from "./toast-provider";

function ToastFromParamsInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const type = searchParams.get("toast") as ToastType | null;
    const message = searchParams.get("toast_msg");

    if (type && message) {
      toast({ type, message });

      const params = new URLSearchParams(searchParams.toString());
      params.delete("toast");
      params.delete("toast_msg");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return null;
}

export function ToastFromParams() {
  return (
    <Suspense fallback={null}>
      <ToastFromParamsInner />
    </Suspense>
  );
}