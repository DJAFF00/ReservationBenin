import Link from "next/link";
import { Search } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { PropertyCard } from "@/components/property-card";
import { createClient } from "@/lib/supabase/server";
import { searchPublishedProperties } from "@/lib/properties";
import { VILLES } from "@/lib/constants";

export default async function HomePage() {
  const supabase = await createClient();
  const properties = await searchPublishedProperties(supabase, { limit: 6 });

  return (
    <>
      <SiteHeader />

      <main>
        {/* Hero orienté recherche — le point d'entrée réel du produit */}
        <section className="relative overflow-hidden border-b border-border bg-surface">
          {/* Halos lumineux animés en arrière-plan */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-32 h-96 w-96 animate-float-slow rounded-full bg-ochre/25 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 top-10 h-[26rem] w-[26rem] animate-float-slower rounded-full bg-indigo/20 blur-3xl"
          />

          <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
            <h1 className="max-w-xl animate-fade-in-up font-display text-4xl font-semibold leading-[1.1] text-foreground md:text-5xl">
              Un logement meublé, disponible quand vous en avez besoin.
            </h1>
            <p className="mt-4 max-w-md animate-fade-in-up-delay-1 text-foreground-muted">
              Réservez un appartement, un studio ou une villa au Bénin, avec
              une disponibilité vérifiée en temps réel.
            </p>

            {/* Barre de recherche — soumet vers /annonces avec les critères */}
            <form
              method="GET"
              action="/annonces"
              className="glass mt-8 flex max-w-2xl animate-fade-in-up-delay-1 flex-col gap-3 rounded-lg border border-border p-3 shadow-lg sm:flex-row sm:items-center"
            >
              <div className="flex flex-1 items-center gap-2 px-2">
                <Search size={16} className="text-foreground-muted" />
                <input
                  type="text"
                  name="ville"
                  placeholder="Ville ou quartier"
                  className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-foreground-muted"
                />
              </div>
              <div className="hidden h-8 w-px bg-border sm:block" />
              <input
                type="date"
                name="arrivee"
                aria-label="Arrivée"
                className="rounded bg-transparent px-2 py-2 text-sm text-foreground-muted outline-none"
              />
              <input
                type="date"
                name="depart"
                aria-label="Départ"
                className="rounded bg-transparent px-2 py-2 text-sm text-foreground-muted outline-none"
              />
              <button
                type="submit"
                className="rounded bg-ochre px-5 py-2.5 text-sm font-medium text-ochre-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_hsl(var(--ochre)/0.45)]"
              >
                Rechercher
              </button>
            </form>

            <div className="mt-6 flex animate-fade-in-up-delay-2 flex-wrap gap-2">
              {VILLES.map((ville) => (
                <Link
                  key={ville}
                  href={`/annonces?ville=${encodeURIComponent(ville)}`}
                  className="rounded border border-border px-3 py-1.5 text-sm text-foreground-muted transition-colors hover:border-ochre hover:text-foreground"
                >
                  {ville}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Grille d'annonces */}
        <section className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Logements disponibles
            </h2>
            <Link
              href="/annonces"
              className="text-sm font-medium text-foreground-muted hover:text-foreground"
            >
              Tout voir →
            </Link>
          </div>

          {properties.length === 0 ? (
            <p className="mt-6 text-sm text-foreground-muted">
              Aucune annonce publiée pour l&apos;instant.
            </p>
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
        </section>
      </main>
    </>
  );
}