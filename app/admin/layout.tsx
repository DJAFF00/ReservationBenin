import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="font-display text-sm font-semibold text-foreground">
              Espace admin
            </p>
            <Link
              href="/"
              className="text-sm text-foreground-muted hover:text-foreground"
            >
              ← Retour au site
            </Link>
          </div>
          <nav className="mt-3 flex gap-6 text-sm text-foreground-muted">
            <Link href="/admin" className="hover:text-foreground">
              Vue d&apos;ensemble
            </Link>
            <Link href="/admin/utilisateurs" className="hover:text-foreground">
              Utilisateurs
            </Link>
            <Link href="/admin/annonces" className="hover:text-foreground">
              Annonces
            </Link>
            <Link href="/admin/reservations" className="hover:text-foreground">
              Réservations
            </Link>
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
    </div>
  );
}