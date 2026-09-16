import { requireAdmin } from "@/lib/admin";

export default async function AdminOverviewPage() {
  const { supabase } = await requireAdmin();

  const [
    { count: totalUsers },
    { count: totalLocataires },
    { count: totalProprietaires },
    { count: totalProperties },
    { count: publishedProperties },
    { count: pendingBookings },
    { count: confirmedBookings },
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "locataire"),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "proprietaire"),
    supabase.from("properties").select("id", { count: "exact", head: true }),
    supabase
      .from("properties")
      .select("id", { count: "exact", head: true })
      .eq("status", "publie"),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("status", "en_attente"),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("status", "confirmee"),
  ]);

  const stats = [
    {
      label: "Utilisateurs",
      value: totalUsers ?? 0,
      detail: `${totalLocataires ?? 0} locataires · ${totalProprietaires ?? 0} propriétaires`,
    },
    {
      label: "Annonces",
      value: totalProperties ?? 0,
      detail: `${publishedProperties ?? 0} publiées`,
    },
    {
      label: "Demandes en attente",
      value: pendingBookings ?? 0,
      detail: "à traiter par les propriétaires",
    },
    {
      label: "Réservations confirmées",
      value: confirmedBookings ?? 0,
      detail: "",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">
        Vue d&apos;ensemble
      </h1>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border p-5">
            <p className="text-sm text-foreground-muted">{s.label}</p>
            <p className="mt-1 font-display text-3xl font-semibold text-foreground">
              {s.value}
            </p>
            {s.detail && (
              <p className="mt-1 text-xs text-foreground-muted">{s.detail}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}