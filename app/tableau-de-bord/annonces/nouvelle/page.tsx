import Link from "next/link";
import { PropertyForm } from "@/components/property-form";

export default function NouvelleAnnoncePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href="/tableau-de-bord/annonces"
        className="text-sm text-foreground-muted hover:text-foreground"
      >
        ← Mes annonces
      </Link>
      <h1 className="mt-1 font-display text-2xl font-semibold text-foreground">
        Nouvelle annonce
      </h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Tu pourras ajouter des photos juste après la création.
      </p>

      <div className="mt-8">
        <PropertyForm property={null} />
      </div>
    </main>
  );
}