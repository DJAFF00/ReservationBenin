import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Users, BedDouble, Bath } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { BookingCalendar } from "@/components/booking-calendar";
import { AMENITES, labelType } from "@/lib/constants";

export default async function AnnoncePubliquePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("status", "publie")
    .single();

  if (!property) notFound();

  const [{ data: images }, { data: blocks }, { data: bookings }] =
    await Promise.all([
      supabase
        .from("property_images")
        .select("id, url")
        .eq("property_id", id)
        .order("position", { ascending: true }),
      supabase
        .from("availability_blocks")
        .select("start_date, end_date")
        .eq("property_id", id),
      supabase
        .from("bookings")
        .select("start_date, end_date")
        .eq("property_id", id)
        .in("status", ["en_attente", "confirmee"]),
    ]);

  const unavailable = [
    ...(blocks ?? []).map((b) => ({ start: b.start_date, end: b.end_date })),
    ...(bookings ?? []).map((b) => ({ start: b.start_date, end: b.end_date })),
  ];

  const amenitiesLabels = (property.amenities as string[]).map(
    (v) => AMENITES.find((a) => a.value === v)?.label ?? v
  );

  const isOwner = user?.id === property.owner_id;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-sm text-foreground-muted">
          {labelType(property.property_type)}
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-foreground">
          {property.title}
        </h1>
        <p className="mt-1 flex items-center gap-1 text-sm text-foreground-muted">
          <MapPin size={14} />
          {property.neighborhood ? `${property.neighborhood}, ` : ""}
          {property.city}
        </p>

        {images && images.length > 0 && (
          <div className="mt-6 grid grid-cols-4 gap-2">
            <div className="col-span-4 aspect-[16/9] overflow-hidden rounded-photo bg-surface-muted sm:col-span-2 sm:row-span-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[0].url}
                alt={property.title}
                className="h-full w-full object-cover"
              />
            </div>
            {images.slice(1, 5).map((img) => (
              <div
                key={img.id}
                className="col-span-2 aspect-square overflow-hidden rounded-photo bg-surface-muted sm:col-span-1"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-6 border-b border-t border-border py-5 text-sm text-foreground-muted">
              <span className="flex items-center gap-1.5">
                <Users size={15} /> {property.capacity} voyageurs
              </span>
              <span className="flex items-center gap-1.5">
                <BedDouble size={15} /> {property.bedrooms} chambres
              </span>
              <span className="flex items-center gap-1.5">
                <Bath size={15} /> {property.bathrooms} salles de bain
              </span>
            </div>

            {property.description && (
              <p className="mt-6 whitespace-pre-line leading-relaxed text-foreground">
                {property.description}
              </p>
            )}

            {amenitiesLabels.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-base font-semibold text-foreground">
                  Équipements
                </h2>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {amenitiesLabels.map((label) => (
                    <span key={label} className="text-sm text-foreground-muted">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Widget de réservation */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-border p-5 lg:sticky lg:top-24">
              <p className="font-display text-xl font-semibold text-foreground">
                {property.price_per_night.toLocaleString("fr-FR")} FCFA{" "}
                <span className="text-sm font-normal text-foreground-muted">
                  / nuit
                </span>
              </p>

              <div className="mt-4">
                {isOwner ? (
                  <p className="text-sm text-foreground-muted">
                    C&apos;est ta propre annonce.
                  </p>
                ) : !user ? (
                  <div>
                    <p className="text-sm text-foreground-muted">
                      Connecte-toi pour demander une réservation.
                    </p>
                    <Link
                      href="/connexion"
                      className="mt-3 inline-block rounded bg-indigo px-4 py-2.5 text-sm font-medium text-indigo-foreground hover:opacity-90"
                    >
                      Se connecter
                    </Link>
                  </div>
                ) : (
                  <BookingCalendar
                    propertyId={property.id}
                    pricePerNight={property.price_per_night}
                    unavailable={unavailable}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}