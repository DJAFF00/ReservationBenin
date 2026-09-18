"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NotificationBadge } from "@/components/notification-badge";

export function MobileNav({
  isLoggedIn,
  isAdmin,
  notificationCount,
  signOutAction,
}: {
  isLoggedIn: boolean;
  isAdmin: boolean;
  notificationCount: number;
  signOutAction: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded border border-border text-foreground-muted transition-colors hover:text-foreground"
      >
        {open ? <X size={16} /> : <Menu size={16} />}
      </button>

      {open && (
        <div className="glass absolute inset-x-0 top-full border-b border-border/60 px-6 py-3 shadow-lg">
          <nav className="flex flex-col gap-1 text-sm">
            <Link
              href="/annonces"
              onClick={() => setOpen(false)}
              className="rounded px-3 py-2.5 text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground"
            >
              Explorer les logements
            </Link>
            <Link
              href="/devenir-hote"
              onClick={() => setOpen(false)}
              className="rounded px-3 py-2.5 text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground"
            >
              Devenir hôte
            </Link>

            <div className="my-2 border-t border-border" />

            {isLoggedIn ? (
              <>
                <Link
                  href={isAdmin ? "/admin" : "/tableau-de-bord"}
                  onClick={() => setOpen(false)}
                  className="flex items-center rounded px-3 py-2.5 font-medium text-foreground hover:bg-surface-muted"
                >
                  {isAdmin ? "Administration" : "Tableau de bord"}
                  <NotificationBadge count={notificationCount} />
                </Link>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="w-full rounded px-3 py-2.5 text-left text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground"
                  >
                    Déconnexion
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/connexion"
                  onClick={() => setOpen(false)}
                  className="rounded px-3 py-2.5 font-medium text-foreground hover:bg-surface-muted"
                >
                  Connexion
                </Link>
                <Link
                  href="/inscription"
                  onClick={() => setOpen(false)}
                  className="mt-1 rounded bg-ochre px-3 py-2.5 text-center font-medium text-ochre-foreground"
                >
                  Créer un compte
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}