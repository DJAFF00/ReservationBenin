import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PropertyForm } from "@/components/property-form";
import { ImageUploader } from "@/components/image-uploader";
import { Button } from "@/components/ui/button";
import { togglePublish, deleteProperty } from "../actions";

export default async function ModifierAnnoncePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (!property) notFound();

  const { data: images } = await supabase
    .from("property_images")
    .select("id, url")
    .eq("property_id", id)
    .order("position", { ascending: true });

  const isPublished = property.status === "publie";

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href="/tableau-de-bord/annonces"
        className="text-sm text-foreground-muted hover:text-foreground"
      >
        ← Mes annonces
      </Link>

      <div className="mt-1 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Modifier l&apos;annonce
        </h1>
        <span
          className={`rounded px-2.5 py-1 text-xs font-medium ${
            isPublished
              ? "bg-palm/10 text-palm"
              : "bg-surface-muted text-foreground-muted"
          }`}
        >
          {isPublished ? "Publiée" : "Brouillon"}
        </span>
      </div>

      {/* Photos */}
      <section className="mt-8">
        <h2 className="font-display text-base font-semibold text-foreground">
          Photos
        </h2>
        <div className="mt-3">
          <ImageUploader propertyId={id} initialImages={images ?? []} />
        </div>
      </section>

      {/* Disponibilités */}
      <section className="mt-8 flex items-center justify-between rounded-lg border border-border p-4">
        <div>
          <p className="text-sm font-medium text-foreground">
            Disponibilités
          </p>
          <p className="text-sm text-foreground-muted">
            Bloque les dates où ce logement n&apos;est pas disponible.
          </p>
        </div>
        <Link
          href={`/tableau-de-bord/annonces/${id}/disponibilites`}
          className="rounded border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:border-foreground-muted"
        >
          Gérer le calendrier
        </Link>
      </section>

      {/* Publication */}
      <section className="mt-8 flex items-center justify-between rounded-lg border border-border p-4">
        <div>
          <p className="text-sm font-medium text-foreground">
            {isPublished ? "Annonce visible publiquement" : "Annonce non visible"}
          </p>
          <p className="text-sm text-foreground-muted">
            {isPublished
              ? "Les locataires peuvent la trouver et faire une demande."
              : "Publie-la une fois les informations et photos complètes."}
          </p>
        </div>
        <form action={togglePublish}>
          <input type="hidden" name="property_id" value={id} />
          <input
            type="hidden"
            name="next_status"
            value={isPublished ? "brouillon" : "publie"}
          />
          <Button type="submit" variant={isPublished ? "ghost" : "secondary"}>
            {isPublished ? "Dépublier" : "Publier"}
          </Button>
        </form>
      </section>

      {/* Formulaire */}
      <div className="mt-10">
        <PropertyForm property={property} />
      </div>

      {/* Suppression */}
      <section className="mt-10 border-t border-border pt-6">
        <form action={deleteProperty}>
          <input type="hidden" name="property_id" value={id} />
          <Button
            type="submit"
            variant="ghost"
            className="border-danger/30 text-danger hover:border-danger/60"
          >
            Supprimer cette annonce
          </Button>
        </form>
      </section>
    </main>
  );
}