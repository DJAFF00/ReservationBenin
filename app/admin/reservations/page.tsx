import Link from "next/link";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { requireAdmin } from "@/lib/admin";

const STATUT_LABEL: Record<string, { label: string; className: string }> = {
  en_attente: { label: "En attente", className: "bg-surface-muted text-foreground-muted" },
  confirmee: { label: "Confirmée", className: "bg-palm/10 text-palm" },
  refusee: { label: "Refusée", className: "bg-danger/10 text-danger" },
  annulee: { label: "Annulée", className: "bg-danger/10 text-danger" },
  terminee: { label: "Terminée", className: "bg-surface-muted text-foreground-muted" },
};

export default async function AdminReservationsPage() {
  const { supabase } = await requireAdmin();

  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      "id, start_date, end_date, status, total_amount, created_at, properties(id, title), profiles(full_name)"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  const total = bookings?.length ?? 0;
  const totalConfirme = (bookings ?? [])
    .filter((b) => b.status === "confirmee")
    .reduce((sum, b) => sum + b.total_amount, 0);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">
        Réservations
      </h1>
      <p className="mt-1 text-sm text-foreground-muted">
        {total} réservations (100 plus récentes) ·{" "}
        {totalConfirme.toLocaleString("fr-FR")} FCFA confirmés
      </p>

      <div className="mt-6 divide-y divide-border rounded-lg border border-border">
        {(bookings ?? []).map((b) => {
          const statut = STATUT_LABEL[b.status] ?? {
            label: b.status,
            className: "bg-surface-muted text-foreground-muted",
          };
          const property = Array.isArray(b.properties)
            ? b.properties[0]
            : b.properties;
          const tenant = Array.isArray(b.profiles)
            ? b.profiles[0]
            : b.profiles;

          return (
            <div
              key={b.id}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5"
            >
              <div>
                <Link
                  href={`/annonces/${property?.id}`}
                  className="text-sm font-medium text-foreground hover:underline"
                >
                  {property?.title ?? "Annonce supprimée"}
                </Link>
                <p className="mt-0.5 text-xs text-foreground-muted">
                  {format(parseISO(b.start_date), "d MMM", { locale: fr })} →{" "}
                  {format(parseISO(b.end_date), "d MMM yyyy", { locale: fr })} ·{" "}
                  {b.total_amount.toLocaleString("fr-FR")} FCFA · par{" "}
                  {tenant?.full_name ?? "locataire inconnu"}
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
    </div>
  );
}