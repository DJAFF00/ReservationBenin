"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";

export async function updateUserRole(formData: FormData) {
  const { supabase, user } = await requireAdmin();

  const targetId = formData.get("user_id") as string;
  const newRole = formData.get("role") as string;

  if (targetId === user.id) {
    throw new Error("Tu ne peux pas changer ton propre rôle.");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", targetId);

  if (error) throw new Error("Erreur lors de la mise à jour du rôle.");

  revalidatePath("/admin/utilisateurs");
}