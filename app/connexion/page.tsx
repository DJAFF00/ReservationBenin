import Link from "next/link";
import { signIn } from "./actions";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ConnexionPage() {
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
          Content de vous revoir
        </h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Connectez-vous pour accéder à votre compte.
        </p>

        <form action={signIn} className="mt-6 space-y-4">
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
              autoComplete="current-password"
              required
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full">
            Se connecter
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground-muted">
          Pas encore de compte ?{" "}
          <Link
            href="/inscription"
            className="font-medium text-foreground hover:underline"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </main>
  );
}