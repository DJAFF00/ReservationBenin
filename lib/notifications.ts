import type { SupabaseClient } from "@supabase/supabase-js";

// Nombre de demandes de réservation en attente pour les biens de ce propriétaire
export async function countPendingRequestsForOwner(
  supabase: SupabaseClient,
  ownerId: string
) {
  const { count } = await supabase
    .from("bookings")
    .select("id, properties!inner(owner_id)", { count: "exact", head: true })
    .eq("status", "en_attente")
    .eq("properties.owner_id", ownerId);

  return count ?? 0;
}

// Nombre de réservations dont le locataire n'a pas encore vu la réponse
// (confirmée ou refusée) du propriétaire
export async function countUnseenBookingUpdatesForTenant(
  supabase: SupabaseClient,
  tenantId: string
) {
  const { count } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("tenant_seen", false);

  return count ?? 0;
}