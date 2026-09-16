"use server";

import { differenceInCalendarDays, parseISO } from "date-fns";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createBookingRequest(
  propertyId: string,
  startDate: string,
  endDate: string,
  guestNote: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/connexion?toast=error&toast_msg=${encodeURIComponent("Connecte-toi pour envoyer une demande de réservation.")}`
    );
  }

  const { data: property } = await supabase
    .from("properties")
    .select("owner_id, price_per_night")
    .eq("id", propertyId)
    .single();

  if (!property) throw new Error("Bien introuvable.");
  if (property.owner_id === user.id) {
    throw new Error("Tu ne peux pas réserver ta propre annonce.");
  }

  const nights = differenceInCalendarDays(parseISO(endDate), parseISO(startDate));
  if (nights < 1) throw new Error("Sélectionne au moins une nuit.");

  const totalAmount = nights * property.price_per_night;

  const { error } = await supabase.from("bookings").insert({
    property_id: propertyId,
    tenant_id: user.id,
    start_date: startDate,
    end_date: endDate,
    total_amount: totalAmount,
    guest_note: guestNote || null,
  });

  if (error) {
    if (error.code === "23P01") {
      throw new Error(
        "Ces dates viennent d'être prises. Merci d'en choisir d'autres."
      );
    }
    throw new Error("Erreur lors de l'envoi de la demande.");
  }

  revalidatePath(`/annonces/${propertyId}`);
  revalidatePath("/tableau-de-bord/reservations");
}