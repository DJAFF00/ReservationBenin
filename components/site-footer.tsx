import Link from "next/link";
import { VILLES } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2">
            <p className="font-display text-lg font-semibold text-foreground">
              Kajola
            </p>
            <p className="mt-2 max-w-xs text-sm text-foreground-muted">
              Location de logements meublés au Bénin — recherche simple,
              disponibilité vérifiée, réservation sans complications.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">Découvrir</p>
            <ul className="mt-3 space-y-2 text-sm text-foreground-muted">
              <li>
                <Link href="/annonces" className="hover:text-foreground">
                  Explorer les logements
                </Link>
              </li>
              <li>
                <Link href="/devenir-hote" className="hover:text-foreground">
                  Devenir hôte
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">Villes</p>
            <ul className="mt-3 space-y-2 text-sm text-foreground-muted">
              {VILLES.map((ville) => (
                <li key={ville}>
                  <Link
                    href={`/annonces?ville=${encodeURIComponent(ville)}`}
                    className="hover:text-foreground"
                  >
                    {ville}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-border pt-6 text-xs text-foreground-muted">
          © {new Date().getFullYear()} Kajola. Plateforme de location
          meublée au Bénin.
        </p>
      </div>
    </footer>
  );
}