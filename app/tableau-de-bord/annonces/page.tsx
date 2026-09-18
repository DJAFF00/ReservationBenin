import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { labelType } from "@/lib/constants";

const STATUT_LABEL: Record<string, string> = {
  brouillon: "Brouillon",
  publie: "Publiée",
  suspendu: "Suspendue",
};

export default async function MesAnnoncesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: properties } = await supabase
    .from("properties")
    .select("id, title, city, property_type, price_per_night, status")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/tableau-de-bord"
            className="text-sm text-foreground-muted hover:text-foreground"
          >
            ← Tableau de bord
          </Link>
          <h1 className="mt-1 font-display text-2xl font-semibold text-foreground">
            Mes annonces
          </h1>
        </div>
        <Link
          href="/tableau-de-bord/annonces/nouvelle"
          className="flex items-center gap-1.5 rounded bg-indigo px-4 py-2.5 text-sm font-medium text-indigo-foreground hover:opacity-90"
        >
          <Plus size={16} />
          Nouvelle annonce
        </Link>
      </div>

      {!properties || properties.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-border p-10 text-center">
          <p className="text-foreground-muted">
            Tu n&apos;as pas encore d&apos;annonce.
          </p>
          <Link
            href="/tableau-de-bord/annonces/nouvelle"
            className="mt-3 inline-block text-sm font-medium text-indigo hover:underline"
          >
            Publier ton premier logement →
          </Link>
        </div>
      ) : (
        <div className="mt-8 divide-y divide-border rounded-lg border border-border">
          {properties.map((p) => (
            <Link
              key={p.id}
              href={`/tableau-de-bord/annonces/${p.id}`}
              className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-5 py-4 hover:bg-surface"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{p.title}</p>
                <p className="mt-0.5 text-sm text-foreground-muted">
                  {labelType(p.property_type)} · {p.city} ·{" "}
                  {p.price_per_night.toLocaleString("fr-FR")} FCFA/nuit
                </p>
              </div>
              <span
                className={`rounded px-2.5 py-1 text-xs font-medium ${
                  p.status === "publie"
                    ? "bg-palm/10 text-palm"
                    : "bg-surface-muted text-foreground-muted"
                }`}
              >
                {STATUT_LABEL[p.status] ?? p.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}