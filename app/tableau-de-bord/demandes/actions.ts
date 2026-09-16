"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function respondToBooking(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const bookingId = formData.get("booking_id") as string;
  const decision = formData.get("decision") as string; // "confirmee" | "refusee"

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, property_id")
    .eq("id", bookingId)
    .single();

  if (!booking) throw new Error("Réservation introuvable.");

  const { data: property } = await supabase
    .from("properties")
    .select("owner_id")
    .eq("id", booking.property_id)
    .single();

  if (!property || property.owner_id !== user.id) {
    throw new Error("Accès refusé.");
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status: decision, tenant_seen: false })
    .eq("id", bookingId);

  if (error) {
    if (error.code === "23P01") {
      throw new Error(
        "Impossible de confirmer : ces dates chevauchent déjà une autre réservation confirmée."
      );
    }
    throw new Error("Erreur lors de la mise à jour.");
  }

  revalidatePath("/tableau-de-bord/demandes");
  revalidatePath("/tableau-de-bord/reservations");
}