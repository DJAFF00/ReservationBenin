import Link from "next/link";
import { redirect } from "next/navigation";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { createClient } from "@/lib/supabase/server";

const STATUT_LABEL: Record<string, { label: string; className: string }> = {
  en_attente: { label: "En attente", className: "bg-surface-muted text-foreground-muted" },
  confirmee: { label: "Confirmée", className: "bg-palm/10 text-palm" },
  refusee: { label: "Refusée", className: "bg-danger/10 text-danger" },
  annulee: { label: "Annulée", className: "bg-danger/10 text-danger" },
  terminee: { label: "Terminée", className: "bg-surface-muted text-foreground-muted" },
};

export default async function MesReservationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, start_date, end_date, status, total_amount, properties(id, title, city)")
    .eq("tenant_id", user.id)
    .order("created_at", { ascending: false });

  // Marque comme vues les réservations dont le statut vient de changer
  // (fait tomber le badge de notification une fois la page consultée)
  await supabase
    .from("bookings")
    .update({ tenant_seen: true })
    .eq("tenant_id", user.id)
    .eq("tenant_seen", false);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/tableau-de-bord"
        className="text-sm text-foreground-muted hover:text-foreground"
      >
        ← Tableau de bord
      </Link>
      <h1 className="mt-1 font-display text-2xl font-semibold text-foreground">
        Mes réservations
      </h1>

      {!bookings || bookings.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-border p-10 text-center">
          <p className="text-foreground-muted">
            Aucune demande de réservation pour l&apos;instant.
          </p>
          <Link
            href="/annonces"
            className="mt-3 inline-block text-sm font-medium text-indigo hover:underline"
          >
            Explorer les logements →
          </Link>
        </div>
      ) : (
        <div className="mt-8 divide-y divide-border rounded-lg border border-border">
          {bookings.map((b) => {
            const statut = STATUT_LABEL[b.status] ?? {
              label: b.status,
              className: "bg-surface-muted text-foreground-muted",
            };
            const property = Array.isArray(b.properties)
              ? b.properties[0]
              : b.properties;

            return (
              <div
                key={b.id}
                className="flex items-center justify-between px-5 py-4"
              >
                <div>
                  <Link
                    href={`/annonces/${property?.id}`}
                    className="font-medium text-foreground hover:underline"
                  >
                    {property?.title ?? "Annonce supprimée"}
                  </Link>
                  <p className="mt-0.5 text-sm text-foreground-muted">
                    {format(parseISO(b.start_date), "d MMM", { locale: fr })} →{" "}
                    {format(parseISO(b.end_date), "d MMM yyyy", { locale: fr })} ·{" "}
                    {b.total_amount.toLocaleString("fr-FR")} FCFA
                  </p>
                </div>
                <span
                  className={`rounded px-2.5 py-1 text-xs font-medium ${statut.className}`}
                >
                  {statut.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}