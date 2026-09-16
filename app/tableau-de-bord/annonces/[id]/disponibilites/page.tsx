import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CalendarBlocker } from "@/components/calendar-blocker";

export default async function DisponibilitesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: property } = await supabase
    .from("properties")
    .select("id, title")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (!property) notFound();

  const { data: blocks } = await supabase
    .from("availability_blocks")
    .select("id, start_date, end_date, reason")
    .eq("property_id", id)
    .order("start_date", { ascending: true });

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href={`/tableau-de-bord/annonces/${id}`}
        className="text-sm text-foreground-muted hover:text-foreground"
      >
        ← {property.title}
      </Link>
      <h1 className="mt-1 font-display text-2xl font-semibold text-foreground">
        Disponibilités
      </h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Clique sur une date pour commencer une sélection, puis sur une
        seconde date pour définir la période à bloquer.
      </p>

      <div className="mt-8 rounded-lg border border-border p-5">
        <CalendarBlocker propertyId={id} initialBlocks={blocks ?? []} />
      </div>
    </main>
  );
}