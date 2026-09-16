import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { NotificationBadge } from "@/components/notification-badge";
import {
  countPendingRequestsForOwner,
  countUnseenBookingUpdatesForTenant,
} from "@/lib/notifications";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let notificationCount = 0;
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    isAdmin = profile?.role === "admin";
    notificationCount = isAdmin
      ? 0
      : profile?.role === "proprietaire"
        ? await countPendingRequestsForOwner(supabase, user.id)
        : await countUnseenBookingUpdatesForTenant(supabase, user.id);
  }

  return (
    <header className="glass sticky top-0 z-50 border-b border-border/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 font-display text-xl font-semibold tracking-tight text-foreground"
        >
          Kajola
          <span className="h-1.5 w-1.5 rounded-full bg-ochre" />
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-foreground-muted md:flex">
          <Link href="/annonces" className="transition-colors hover:text-foreground">
            Explorer les logements
          </Link>
          <Link href="/devenir-hote" className="transition-colors hover:text-foreground">
            Devenir hôte
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <>
              <Link
                href={isAdmin ? "/admin" : "/tableau-de-bord"}
                className="flex items-center rounded border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-foreground-muted hover:bg-surface-muted"
              >
                {isAdmin ? "Administration" : "Tableau de bord"}
                <NotificationBadge count={notificationCount} />
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="hidden text-sm text-foreground-muted transition-colors hover:text-foreground sm:block"
                >
                  Déconnexion
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/connexion"
                className="rounded border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-foreground-muted hover:bg-surface-muted"
              >
                Connexion
              </Link>
              <Link
                href="/inscription"
                className="hidden rounded bg-ochre px-4 py-2 text-sm font-medium text-ochre-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_hsl(var(--ochre)/0.4)] sm:block"
              >
                Créer un compte
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}