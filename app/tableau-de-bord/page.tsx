import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { NotificationBadge } from "@/components/notification-badge";
import {
  countPendingRequestsForOwner,
  countUnseenBookingUpdatesForTenant,
} from "@/lib/notifications";

export default async function TableauDeBordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "locataire";

  if (role === "admin") {
    redirect("/admin");
  }

  const notificationCount =
    role === "proprietaire"
      ? await countPendingRequestsForOwner(supabase, user.id)
      : await countUnseenBookingUpdatesForTenant(supabase, user.id);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-foreground-muted">
            {role === "proprietaire" ? "Espace propriétaire" : "Espace locataire"}
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-foreground">
            Bonjour {profile?.full_name ?? ""}
          </h1>
        </div>
        <form action={signOut}>
          <Button type="submit" variant="ghost">
            Se déconnecter
          </Button>
        </form>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {role === "proprietaire" ? (
          <>
            <DashboardCard
              title="Mes annonces"
              description="Publier, modifier ou suspendre vos biens meublés."
              href="/tableau-de-bord/annonces"
            />
            <DashboardCard
              title="Demandes de réservation"
              description="Confirmer ou refuser les demandes reçues."
              href="/tableau-de-bord/demandes"
              badgeCount={notificationCount}
            />
          </>
        ) : (
          <>
            <DashboardCard
              title="Mes réservations"
              description="Suivre l'état de vos demandes en cours."
              href="/tableau-de-bord/reservations"
              badgeCount={notificationCount}
            />
            <DashboardCard
              title="Explorer les logements"
              description="Trouver un appartement, studio ou villa disponible."
              href="/annonces"
            />
          </>
        )}
      </div>
    </main>
  );
}

function DashboardCard({
  title,
  description,
  href,
  disabled,
  badgeCount,
}: {
  title: string;
  description: string;
  href?: string;
  disabled?: boolean;
  badgeCount?: number;
}) {
  return (
    <div
      className={`rounded-lg border border-border p-5 ${
        disabled
          ? "opacity-50"
          : "transition-all duration-200 hover:-translate-y-0.5 hover:border-ochre/50 hover:shadow-md"
      }`}
    >
      <div className="flex items-center">
        <h2 className="font-display text-base font-semibold text-foreground">
          {title}
        </h2>
        <NotificationBadge count={badgeCount ?? 0} />
      </div>
      <p className="mt-1.5 text-sm text-foreground-muted">{description}</p>
      {href && !disabled && (
        <a
          href={href}
          className="mt-3 inline-block text-sm font-medium text-indigo hover:underline"
        >
          Ouvrir →
        </a>
      )}
    </div>
  );
}