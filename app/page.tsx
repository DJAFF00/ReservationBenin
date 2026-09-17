import Link from "next/link";
import {
  CalendarCheck,
  Home as HomeIcon,
  Key,
  MapPinned,
  MessageCircle,
  Search,
  ShieldCheck,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PropertyCard } from "@/components/property-card";
import { createClient } from "@/lib/supabase/server";
import { searchPublishedProperties } from "@/lib/properties";

const ETAPES = [
  {
    icon: Search,
    title: "Cherchez",
    text: "Parcourez les logements meublés disponibles par ville, dates et budget.",
  },
  {
    icon: CalendarCheck,
    title: "Réservez",
    text: "Envoyez une demande ; le propriétaire confirme les dates en quelques heures.",
  },
  {
    icon: Key,
    title: "Emménagez",
    text: "Récupérez les clés et profitez de votre logement, sans complications.",
  },
];

const AVANTAGES = [
  {
    icon: ShieldCheck,
    title: "Disponibilité vérifiée",
    text: "Chaque réservation est confirmée en base : deux locataires ne peuvent jamais se retrouver sur les mêmes dates.",
  },
  {
    icon: MapPinned,
    title: "Pensé pour le Bénin",
    text: "Cotonou, Porto-Novo, Ouidah, Abomey, Parakou — des logements dans les villes où vous en avez besoin.",
  },
  {
    icon: MessageCircle,
    title: "Contact direct",
    text: "Un message au propriétaire avant de confirmer, pour partir sans mauvaise surprise.",
  },
  {
    icon: HomeIcon,
    title: "Propriétaires locaux",
    text: "Chaque annonce est publiée et gérée directement par la personne qui possède le logement.",
  },
];

export default async function HomePage() {
  const supabase = await createClient();
  const properties = await searchPublishedProperties(supabase, { limit: 6 });

  const heroPhotos = properties
    .flatMap((p) => p.property_images?.[0]?.url ?? [])
    .slice(0, 2);

  return (
    <>
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border bg-surface">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-32 h-96 w-96 animate-float-slow rounded-full bg-ochre/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 top-10 h-[26rem] w-[26rem] animate-float-slower rounded-full bg-indigo/15 blur-3xl"
          />

          <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
            <div>
              <h1 className="max-w-lg font-display text-4xl font-semibold leading-[1.1] text-foreground md:text-5xl">
                Un chez-vous, partout au Bénin.
              </h1>
              <p className="mt-4 max-w-md text-foreground-muted">
                Kajola connecte locataires et propriétaires de logements
                meublés — recherche simple, disponibilité vérifiée,
                réservation sans complications.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/annonces"
                  className="flex items-center gap-2 rounded bg-ochre px-5 py-3 text-sm font-medium text-ochre-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_hsl(var(--ochre)/0.45)]"
                >
                  <Search size={16} />
                  Explorer les logements
                </Link>
                <Link
                  href="/devenir-hote"
                  className="flex items-center rounded border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground-muted hover:bg-surface-muted"
                >
                  Devenir hôte
                </Link>
              </div>
            </div>

            {/* Collage de vraies photos de logements, ou panneau de secours */}
            <div className="relative hidden h-72 md:block">
              {heroPhotos.length > 0 ? (
                <>
                  <div className="absolute left-4 top-0 h-56 w-64 -rotate-2 overflow-hidden rounded-photo shadow-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={heroPhotos[0]}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {heroPhotos[1] && (
                    <div className="absolute bottom-0 right-0 h-48 w-56 rotate-3 overflow-hidden rounded-photo shadow-xl ring-4 ring-surface">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={heroPhotos[1]}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="glass flex h-full w-full items-center justify-center rounded-photo border border-border">
                  <HomeIcon size={40} className="text-foreground-muted/40" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Comment ça marche
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {ETAPES.map((etape, i) => (
              <div key={etape.title}>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo text-sm font-semibold text-indigo-foreground">
                    {i + 1}
                  </span>
                  <etape.icon size={18} className="text-ochre" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                  {etape.title}
                </h3>
                <p className="mt-1.5 text-sm text-foreground-muted">
                  {etape.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Pourquoi Kajola */}
        <section className="border-t border-border bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Pourquoi Kajola
            </h2>
            <div className="mt-8 divide-y divide-border">
              {AVANTAGES.map((a) => (
                <div
                  key={a.title}
                  className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:gap-6"
                >
                  <a.icon size={20} className="mt-0.5 shrink-0 text-palm" />
                  <div>
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {a.title}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-foreground-muted">
                      {a.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Logements récents */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Logements récents
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
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
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

        {/* CTA propriétaires */}
        <section className="bg-indigo">
          <div className="mx-auto max-w-6xl px-6 py-14 text-center">
            <h2 className="font-display text-2xl font-semibold text-indigo-foreground">
              Vous avez un logement à louer ?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-indigo-foreground/80">
              Publiez votre annonce gratuitement et gérez vos disponibilités
              en quelques clics.
            </p>
            <Link
              href="/inscription"
              className="mt-6 inline-flex items-center rounded bg-ochre px-6 py-3 text-sm font-medium text-ochre-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_hsl(var(--ochre)/0.45)]"
            >
              Publier mon logement
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}