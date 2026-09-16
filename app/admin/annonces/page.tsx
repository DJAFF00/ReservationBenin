import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { ActionForm } from "@/components/toast/action-form";
import { labelType } from "@/lib/constants";
import { adminUpdatePropertyStatus, adminDeleteProperty } from "./actions";

const STATUT_LABEL: Record<string, { label: string; className: string }> = {
  brouillon: { label: "Brouillon", className: "bg-surface-muted text-foreground-muted" },
  publie: { label: "Publiée", className: "bg-palm/10 text-palm" },
  suspendu: { label: "Suspendue", className: "bg-danger/10 text-danger" },
};

export default async function AdminAnnoncesPage() {
  const { supabase } = await requireAdmin();

  const { data: properties } = await supabase
    .from("properties")
    .select(
      "id, title, city, property_type, price_per_night, status, owner_id, profiles(full_name)"
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">
        Annonces
      </h1>
      <p className="mt-1 text-sm text-foreground-muted">
        {properties?.length ?? 0} annonces au total
      </p>

      <div className="mt-6 divide-y divide-border rounded-lg border border-border">
        {(properties ?? []).map((p) => {
          const statut = STATUT_LABEL[p.status] ?? {
            label: p.status,
            className: "bg-surface-muted text-foreground-muted",
          };
          const owner = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;

          return (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
            >
              <div>
                <Link
                  href={`/annonces/${p.id}`}
                  className="text-sm font-medium text-foreground hover:underline"
                >
                  {p.title}
                </Link>
                <p className="mt-0.5 text-xs text-foreground-muted">
                  {labelType(p.property_type)} · {p.city} ·{" "}
                  {p.price_per_night.toLocaleString("fr-FR")} FCFA/nuit · par{" "}
                  {owner?.full_name ?? "propriétaire inconnu"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`rounded px-2.5 py-1 text-xs font-medium ${statut.className}`}
                >
                  {statut.label}
                </span>

                <ActionForm
                  action={adminUpdatePropertyStatus}
                  fields={[
                    { name: "property_id", value: p.id },
                    {
                      name: "status",
                      value: p.status === "suspendu" ? "publie" : "suspendu",
                    },
                  ]}
                  successMessage={
                    p.status === "suspendu" ? "Annonce réactivée." : "Annonce suspendue."
                  }
                >
                  <Button type="submit" variant="ghost" className="text-xs">
                    {p.status === "suspendu" ? "Réactiver" : "Suspendre"}
                  </Button>
                </ActionForm>

                <ActionForm
                  action={adminDeleteProperty}
                  fields={[{ name: "property_id", value: p.id }]}
                  successMessage="Annonce supprimée."
                >
                  <Button
                    type="submit"
                    variant="ghost"
                    className="border-danger/30 text-xs text-danger hover:border-danger/60"
                  >
                    Supprimer
                  </Button>
                </ActionForm>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}