"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";

export async function adminUpdatePropertyStatus(formData: FormData) {
  const { supabase } = await requireAdmin();
  const propertyId = formData.get("property_id") as string;
  const status = formData.get("status") as string;

  const { error } = await supabase
    .from("properties")
    .update({ status })
    .eq("id", propertyId);

  if (error) throw new Error("Erreur lors de la mise à jour.");
  revalidatePath("/admin/annonces");
}

export async function adminDeleteProperty(formData: FormData) {
  const { supabase } = await requireAdmin();
  const propertyId = formData.get("property_id") as string;

  await supabase.from("properties").delete().eq("id", propertyId);
  revalidatePath("/admin/annonces");
}