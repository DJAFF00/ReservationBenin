import { requireAdmin } from "@/lib/admin";
import { UserRoleForm } from "@/components/admin/user-role-form";

const ROLE_LABEL: Record<string, string> = {
  locataire: "Locataire",
  proprietaire: "Propriétaire",
  admin: "Admin",
};

export default async function AdminUsersPage() {
  const { supabase, user: currentUser } = await requireAdmin();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, role, city, phone, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">
        Utilisateurs
      </h1>
      <p className="mt-1 text-sm text-foreground-muted">
        {profiles?.length ?? 0} comptes au total
      </p>

      <div className="mt-6 divide-y divide-border rounded-lg border border-border">
        {(profiles ?? []).map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5"
          >
            <div>
              <p className="text-sm font-medium text-foreground">
                {p.full_name}
              </p>
              <p className="text-xs text-foreground-muted">
                {p.city ?? "Ville non renseignée"}
                {p.phone ? ` · ${p.phone}` : ""}
              </p>
            </div>

            {p.id === currentUser.id ? (
              <span className="rounded bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground-muted">
                Toi · {ROLE_LABEL[p.role] ?? p.role}
              </span>
            ) : (
              <UserRoleForm userId={p.id} currentRole={p.role} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}