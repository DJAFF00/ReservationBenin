"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireOwnerOf(propertyId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: property } = await supabase
    .from("properties")
    .select("id")
    .eq("id", propertyId)
    .eq("owner_id", user.id)
    .single();

  if (!property) throw new Error("Bien introuvable.");
  return { supabase, user };
}

// startDate et endDate au format YYYY-MM-DD. endDate est exclusif
// (c'est la date de "libération" — dernière nuit bloquée = endDate - 1 jour).
export async function addAvailabilityBlock(
  propertyId: string,
  startDate: string,
  endDate: string,
  reason: string
) {
  const { supabase } = await requireOwnerOf(propertyId);

  const { error } = await supabase.from("availability_blocks").insert({
    property_id: propertyId,
    start_date: startDate,
    end_date: endDate,
    reason: reason || null,
  });

  if (error) {
    if (error.code === "23P01") {
      throw new Error("Ces dates chevauchent une période déjà bloquée.");
    }
    throw new Error("Erreur lors de l'enregistrement.");
  }

  revalidatePath(`/tableau-de-bord/annonces/${propertyId}/disponibilites`);
}

export async function removeAvailabilityBlock(
  blockId: string,
  propertyId: string
) {
  const { supabase } = await requireOwnerOf(propertyId);

  await supabase
    .from("availability_blocks")
    .delete()
    .eq("id", blockId)
    .eq("property_id", propertyId);

  revalidatePath(`/tableau-de-bord/annonces/${propertyId}/disponibilites`);
}