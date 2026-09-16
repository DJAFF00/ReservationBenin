import Link from "next/link";
import { MailCheck } from "lucide-react";

export default async function VerificationPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo/10 text-indigo">
          <MailCheck size={22} />
        </div>
        <h1 className="mt-5 font-display text-xl font-semibold text-foreground">
          Vérifiez votre boîte mail
        </h1>
        <p className="mt-2 text-sm text-foreground-muted">
          Nous avons envoyé un lien de confirmation
          {email ? ` à ${email}` : ""}. Cliquez dessus pour activer votre
          compte.
        </p>
        <Link
          href="/connexion"
          className="mt-6 inline-block text-sm font-medium text-foreground hover:underline"
        >
          Retour à la connexion
        </Link>
      </div>
    </main>
  );
}
