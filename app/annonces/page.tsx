import { Search } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { PropertyCard } from "@/components/property-card";
import { Select, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { searchPublishedProperties } from "@/lib/properties";
import { TYPES_BIEN, VILLES } from "@/lib/constants";

export default async function AnnoncesPage({
  searchParams,
}: {
  searchParams: Promise<{
    ville?: string;
    type?: string;
    capacite?: string;
    arrivee?: string;
    depart?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const properties = await searchPublishedProperties(supabase, {
    city: params.ville,
    propertyType: params.type,
    capacity: params.capacite ? Number(params.capacite) : undefined,
    checkIn: params.arrivee,
    checkOut: params.depart,
  });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Explorer les logements
        </h1>

        {/* Filtres */}
        <form
          method="GET"
          action="/annonces"
          className="mt-6 grid grid-cols-2 gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-3 lg:grid-cols-6"
        >
          <Select name="ville" defaultValue={params.ville ?? ""}>
            <option value="">Toutes les villes</option>
            {VILLES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Select>

          <Select name="type" defaultValue={params.type ?? ""}>
            <option value="">Tous les types</option>
            {TYPES_BIEN.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>

          <Input
            type="number"
            name="capacite"
            min={1}
            placeholder="Voyageurs"
            defaultValue={params.capacite ?? ""}
          />

          <Input
            type="date"
            name="arrivee"
            aria-label="Arrivée"
            defaultValue={params.arrivee ?? ""}
          />
          <Input
            type="date"
            name="depart"
            aria-label="Départ"
            defaultValue={params.depart ?? ""}
          />

          <Button type="submit" className="flex items-center gap-1.5">
            <Search size={15} />
            Rechercher
          </Button>
        </form>

        {/* Résultats */}
        <p className="mt-6 text-sm text-foreground-muted">
          {properties.length}{" "}
          {properties.length > 1 ? "logements trouvés" : "logement trouvé"}
        </p>

        {properties.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-border p-10 text-center text-foreground-muted">
            Aucun logement ne correspond à ta recherche. Essaie d&apos;élargir
            les critères.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <PropertyCard
                key={p.id}
                id={p.id}
                title={p.title}
                city={p.city}
                neighborhood={p.neighborhood}
                pricePerNight={p.price_per_night}
                bedrooms={p.bedrooms}
                imageUrl={p.property_images?.[0]?.url}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}