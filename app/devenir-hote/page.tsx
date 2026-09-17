import Link from "next/link";
import {
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Gauge,
  ImagePlus,
  ShieldCheck,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const ETAPES = [
  {
    icon: ImagePlus,
    title: "Créez votre annonce",
    text: "Titre, description, photos, équipements et prix par nuit, semaine ou mois — en quelques minutes.",
  },
  {
    icon: ClipboardList,
    title: "Recevez des demandes",
    text: "Les locataires intéressés vous envoient une demande pour des dates précises.",
  },
  {
    icon: CheckCircle2,
    title: "Confirmez ou refusez",
    text: "Vous décidez, sans engagement automatique. Rien n'est réservé sans votre accord.",
  },
];

const REASSURANCES = [
  {
    icon: ShieldCheck,
    title: "Vous gardez le contrôle",
    text: "Aucune réservation ne se confirme automatiquement. Chaque demande passe par vous, et vous seul décidez.",
  },
  {
    icon: CalendarCheck,
    title: "Un calendrier centralisé",
    text: "Bloquez vos dates personnelles ou de travaux, et gérez plusieurs logements depuis un seul tableau de bord.",
  },
  {
    icon: Gauge,
    title: "Gratuit pour commencer",
    text: "Publier une annonce ne coûte rien. Le paiement du séjour se règle directement avec le locataire.",
  },
];

const FAQ = [
  {
    q: "Combien coûte la publication d'une annonce ?",
    a: "Rien. La création et la publication d'annonces sont gratuites.",
  },
  {
    q: "Comment se passe le paiement du séjour ?",
    a: "Pour l'instant, les réservations sont confirmées manuellement entre vous et le locataire ; le règlement se fait directement entre vous, hors plateforme.",
  },
  {
    q: "Puis-je gérer plusieurs logements ?",
    a: "Oui. Vous pouvez publier autant d'annonces que vous le souhaitez et suivre toutes vos demandes depuis un seul tableau de bord.",
  },
];

export default function DevenirHotePage() {
  return (
    <>
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-3xl px-6 py-16 text-center md:py-20">
            <h1 className="font-display text-4xl font-semibold leading-[1.1] text-foreground md:text-5xl">
              Louez votre logement meublé, à votre rythme.
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-foreground-muted">
              Publiez votre annonce gratuitement, choisissez qui vous
              acceptez et gardez le contrôle total sur votre calendrier.
            </p>
            <Link
              href="/inscription?role=proprietaire"
              className="mt-8 inline-flex items-center rounded bg-ochre px-6 py-3 text-sm font-medium text-ochre-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_hsl(var(--ochre)/0.45)]"
            >
              Publier mon logement
            </Link>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Comment ça marche
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {ETAPES.map((etape, i) => (
              <div key={etape.title}>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo text-sm font-semibold text-indigo-foreground">
                    {i + 1}
                  </span>
                  <etape.icon size={18} className="text-ochre" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                  {etape.title}
                </h3>
                <p className="mt-1.5 text-sm text-foreground-muted">
                  {etape.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Réassurance */}
        <section className="border-t border-border bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Ce que vous gardez en main
            </h2>
            <div className="mt-8 divide-y divide-border">
              {REASSURANCES.map((r) => (
                <div
                  key={r.title}
                  className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:gap-6"
                >
                  <r.icon size={20} className="mt-0.5 shrink-0 text-palm" />
                  <div>
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {r.title}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-foreground-muted">
                      {r.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Questions fréquentes
          </h2>
          <div className="mt-6 divide-y divide-border">
            {FAQ.map((item) => (
              <div key={item.q} className="py-5">
                <h3 className="font-display text-base font-semibold text-foreground">
                  {item.q}
                </h3>
                <p className="mt-1.5 text-sm text-foreground-muted">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-indigo">
          <div className="mx-auto max-w-6xl px-6 py-14 text-center">
            <h2 className="font-display text-2xl font-semibold text-indigo-foreground">
              Prêt à publier votre premier logement ?
            </h2>
            <Link
              href="/inscription?role=proprietaire"
              className="mt-6 inline-flex items-center rounded bg-ochre px-6 py-3 text-sm font-medium text-ochre-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_hsl(var(--ochre)/0.45)]"
            >
              Publier mon logement
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}