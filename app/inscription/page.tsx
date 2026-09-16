import Link from "next/link";
import { Home, User } from "lucide-react";
import { signUp } from "./actions";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function InscriptionPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="font-display text-xl font-semibold text-foreground"
        >
          Kajola
        </Link>

        <h1 className="mt-8 font-display text-2xl font-semibold text-foreground">
          Créer un compte
        </h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Quelques informations pour commencer.
        </p>

        <form action={signUp} className="mt-6 space-y-5">
          {/* Choix du rôle — deux cartes sélectionnables en CSS pur */}
          <div>
            <span className="mb-1.5 block text-sm font-medium text-foreground">
              Vous êtes...
            </span>
            <div className="grid grid-cols-2 gap-3">
              <label className="group cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="locataire"
                  defaultChecked
                  className="peer sr-only"
                />
                <div className="flex flex-col items-center gap-2 rounded border border-border px-3 py-4 text-center transition-colors peer-checked:border-indigo peer-checked:bg-indigo/5">
                  <User size={18} className="text-foreground-muted" />
                  <span className="text-sm font-medium text-foreground">
                    Locataire
                  </span>
                  <span className="text-xs text-foreground-muted">
                    Je cherche un logement
                  </span>
                </div>
              </label>

              <label className="group cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="proprietaire"
                  className="peer sr-only"
                />
                <div className="flex flex-col items-center gap-2 rounded border border-border px-3 py-4 text-center transition-colors peer-checked:border-indigo peer-checked:bg-indigo/5">
                  <Home size={18} className="text-foreground-muted" />
                  <span className="text-sm font-medium text-foreground">
                    Propriétaire
                  </span>
                  <span className="text-xs text-foreground-muted">
                    Je loue un logement
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="full_name">Nom complet</Label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              autoComplete="name"
              required
              placeholder="Ex : Adjovi Houngbo"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="vous@exemple.com"
            />
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="8 caractères minimum"
            />
          </div>
          <Button type="submit" className="w-full">
            Créer mon compte
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground-muted">
          Déjà un compte ?{" "}
          <Link
            href="/connexion"
            className="font-medium text-foreground hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}