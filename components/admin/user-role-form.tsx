"use client";

import { useState, useTransition } from "react";
import { Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toast/toast-provider";
import { updateUserRole } from "@/app/admin/utilisateurs/actions";

export function UserRoleForm({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: string;
}) {
  const [role, setRole] = useState(currentRole);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("user_id", userId);
        formData.append("role", role);
        await updateUserRole(formData);
        toast({ type: "success", message: "Rôle mis à jour." });
      } catch (err) {
        toast({
          type: "error",
          message: err instanceof Error ? err.message : "Erreur lors de la mise à jour.",
        });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-auto py-1.5"
      >
        <option value="locataire">Locataire</option>
        <option value="proprietaire">Propriétaire</option>
        <option value="admin">Admin</option>
      </Select>
      <Button type="submit" variant="ghost" className="text-sm" disabled={isPending}>
        {isPending ? "..." : "Mettre à jour"}
      </Button>
    </form>
  );
}