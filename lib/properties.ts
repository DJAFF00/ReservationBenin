import type { SupabaseClient } from "@supabase/supabase-js";

export type PropertySearchFilters = {
  city?: string;
  propertyType?: string;
  capacity?: number;
  checkIn?: string; // YYYY-MM-DD
  checkOut?: string; // YYYY-MM-DD (exclusif)
  limit?: number;
};

export async function searchPublishedProperties(
  supabase: SupabaseClient,
  filters: PropertySearchFilters = {}
) {
  let query = supabase
    .from("properties")
    .select(
      "id, title, city, neighborhood, property_type, bedrooms, capacity, price_per_night, property_images(url, position)"
    )
    .eq("status", "publie")
    .order("created_at", { ascending: false })
    .order("position", { foreignTable: "property_images", ascending: true });

  if (filters.city) query = query.ilike("city", `%${filters.city}%`);
  if (filters.propertyType) query = query.eq("property_type", filters.propertyType);
  if (filters.capacity) query = query.gte("capacity", filters.capacity);
  if (filters.limit) query = query.limit(filters.limit);

  const { data } = await query;
  let properties = data ?? [];

  // Filtre de disponibilité : on exclut les biens dont les dates demandées
  // chevauchent un blocage manuel ou une réservation active.
  if (filters.checkIn && filters.checkOut && properties.length > 0) {
    const ids = properties.map((p) => p.id);

    const [{ data: blocks }, { data: bookings }] = await Promise.all([
      supabase
        .from("availability_blocks")
        .select("property_id")
        .in("property_id", ids)
        .lt("start_date", filters.checkOut)
        .gt("end_date", filters.checkIn),
      supabase
        .from("bookings")
        .select("property_id")
        .in("property_id", ids)
        .in("status", ["en_attente", "confirmee"])
        .lt("start_date", filters.checkOut)
        .gt("end_date", filters.checkIn),
    ]);

    const unavailable = new Set([
      ...(blocks ?? []).map((b) => b.property_id),
      ...(bookings ?? []).map((b) => b.property_id),
    ]);

    properties = properties.filter((p) => !unavailable.has(p.id));
  }

  return properties;
}