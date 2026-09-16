import Link from "next/link";
import { redirect } from "next/navigation";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ActionForm } from "@/components/toast/action-form";
import { respondToBooking } from "./actions";

const STATUT_LABEL: Record<string, { label: string; className: string }> = {
  en_attente: { label: "En attente", className: "bg-surface-muted text-foreground-muted" },
  confirmee: { label: "Confirmée", className: "bg-palm/10 text-palm" },
  refusee: { label: "Refusée", className: "bg-danger/10 text-danger" },
  annulee: { label: "Annulée", className: "bg-danger/10 text-danger" },
  terminee: { label: "Terminée", className: "bg-surface-muted text-foreground-muted" },
};

export default async function DemandesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      "id, start_date, end_date, status, total_amount, guest_note, created_at, properties!inner(id, title, city, owner_id), profiles(full_name, phone)"
    )
    .eq("properties.owner_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/tableau-de-bord"
        className="text-sm text-foreground-muted hover:text-foreground"
      >
        ← Tableau de bord
      </Link>
      <h1 className="mt-1 font-display text-2xl font-semibold text-foreground">
        Demandes de réservation
      </h1>

      {!bookings || bookings.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-border p-10 text-center">
          <p className="text-foreground-muted">
            Aucune demande reçue pour l&apos;instant.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {bookings.map((b) => {
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
              <div key={b.id} className="rounded-lg border border-border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <Link
                      href={`/annonces/${property?.id}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {property?.title}
                    </Link>
                    <p className="mt-0.5 text-sm text-foreground-muted">
                      {format(parseISO(b.start_date), "d MMM", { locale: fr })}{" "}
                      → {format(parseISO(b.end_date), "d MMM yyyy", { locale: fr })}{" "}
                      · {b.total_amount.toLocaleString("fr-FR")} FCFA
                    </p>
                    <p className="mt-1 text-sm text-foreground-muted">
                      Demandé par {tenant?.full_name ?? "un locataire"}
                      {tenant?.phone ? ` · ${tenant.phone}` : ""}
                    </p>
                    {b.guest_note && (
                      <p className="mt-2 rounded bg-surface-muted p-2 text-sm text-foreground">
                        « {b.guest_note} »
                      </p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded px-2.5 py-1 text-xs font-medium ${statut.className}`}
                  >
                    {statut.label}
                  </span>
                </div>

                {b.status === "en_attente" && (
                  <div className="mt-4 flex gap-2">
                    <ActionForm
                      action={respondToBooking}
                      fields={[
                        { name: "booking_id", value: b.id },
                        { name: "decision", value: "confirmee" },
                      ]}
                      successMessage="Réservation confirmée."
                    >
                      <Button type="submit" variant="secondary" className="text-sm">
                        Confirmer
                      </Button>
                    </ActionForm>
                    <ActionForm
                      action={respondToBooking}
                      fields={[
                        { name: "booking_id", value: b.id },
                        { name: "decision", value: "refusee" },
                      ]}
                      successMessage="Demande refusée."
                    >
                      <Button type="submit" variant="ghost" className="text-sm">
                        Refuser
                      </Button>
                    </ActionForm>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}