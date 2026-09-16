-- =========================================================
-- PLATEFORME DE RÉSERVATION — LOCATION MEUBLÉE (BÉNIN)
-- Schéma Supabase (PostgreSQL)
-- =========================================================

-- Extension nécessaire pour la contrainte d'exclusion sur les plages de dates
create extension if not exists btree_gist;

-- ---------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------
create type user_role as enum ('locataire', 'proprietaire', 'admin');
create type property_type as enum ('appartement', 'studio', 'villa', 'chambre', 'maison');
create type property_status as enum ('brouillon', 'publie', 'suspendu');
create type booking_status as enum ('en_attente', 'confirmee', 'refusee', 'annulee', 'terminee');

-- ---------------------------------------------------------
-- PROFILES (extension de auth.users)
-- ---------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'locataire',
  full_name text not null,
  phone text,
  city text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- PROPERTIES (biens meublés)
-- ---------------------------------------------------------
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null default '',
  property_type property_type not null,
  address text not null,
  city text not null,
  neighborhood text,
  capacity int not null default 1 check (capacity > 0),
  bedrooms int not null default 1 check (bedrooms >= 0),
  bathrooms int not null default 1 check (bathrooms >= 0),
  amenities text[] not null default '{}',
  price_per_night numeric(12,2) not null check (price_per_night >= 0),
  price_per_week numeric(12,2),
  price_per_month numeric(12,2),
  status property_status not null default 'brouillon',
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_properties_city on public.properties(city);
create index idx_properties_status on public.properties(status);
create index idx_properties_owner on public.properties(owner_id);

-- ---------------------------------------------------------
-- PROPERTY_IMAGES
-- ---------------------------------------------------------
create table public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  url text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_property_images_property on public.property_images(property_id);

-- ---------------------------------------------------------
-- AVAILABILITY_BLOCKS (indisponibilités manuelles posées par le propriétaire)
-- ---------------------------------------------------------
create table public.availability_blocks (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  start_date date not null,
  end_date date not null check (end_date > start_date),
  reason text,
  created_at timestamptz not null default now(),
  -- Empêche deux blocages qui se chevauchent sur le même bien
  exclude using gist (
    property_id with =,
    daterange(start_date, end_date, '[)') with &&
  )
);

create index idx_availability_blocks_property on public.availability_blocks(property_id);

-- ---------------------------------------------------------
-- BOOKINGS (réservations)
-- ---------------------------------------------------------
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  tenant_id uuid not null references public.profiles(id) on delete cascade,
  start_date date not null,
  end_date date not null check (end_date > start_date),
  status booking_status not null default 'en_attente',
  total_amount numeric(12,2) not null check (total_amount >= 0),
  guest_note text,
  owner_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Empêche deux réservations actives (en_attente/confirmee) qui se chevauchent sur le même bien
  exclude using gist (
    property_id with =,
    daterange(start_date, end_date, '[)') with &&
  ) where (status in ('en_attente', 'confirmee'))
);

create index idx_bookings_property on public.bookings(property_id);
create index idx_bookings_tenant on public.bookings(tenant_id);
create index idx_bookings_status on public.bookings(status);

-- ---------------------------------------------------------
-- TRIGGER : updated_at automatique
-- ---------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger trg_properties_updated_at before update on public.properties
  for each row execute function public.set_updated_at();
create trigger trg_bookings_updated_at before update on public.bookings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------
-- TRIGGER : création automatique du profil à l'inscription
-- ---------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Utilisateur'),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'locataire')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.property_images enable row level security;
alter table public.availability_blocks enable row level security;
alter table public.bookings enable row level security;

-- Fonction utilitaire : l'utilisateur courant est-il admin ?
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql stable security definer;

-- ---- PROFILES ----
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());

-- ---- PROPERTIES ----
create policy "properties_public_read_published" on public.properties
  for select using (status = 'publie' or owner_id = auth.uid() or public.is_admin());
create policy "properties_owner_insert" on public.properties
  for insert with check (owner_id = auth.uid());
create policy "properties_owner_update" on public.properties
  for update using (owner_id = auth.uid() or public.is_admin());
create policy "properties_owner_delete" on public.properties
  for delete using (owner_id = auth.uid() or public.is_admin());

-- ---- PROPERTY_IMAGES ----
create policy "property_images_public_read" on public.property_images
  for select using (
    exists (
      select 1 from public.properties p
      where p.id = property_id
      and (p.status = 'publie' or p.owner_id = auth.uid() or public.is_admin())
    )
  );
create policy "property_images_owner_write" on public.property_images
  for all using (
    exists (
      select 1 from public.properties p
      where p.id = property_id and p.owner_id = auth.uid()
    ) or public.is_admin()
  );

-- ---- AVAILABILITY_BLOCKS ----
create policy "availability_public_read" on public.availability_blocks
  for select using (true);
create policy "availability_owner_write" on public.availability_blocks
  for all using (
    exists (
      select 1 from public.properties p
      where p.id = property_id and p.owner_id = auth.uid()
    ) or public.is_admin()
  );

-- ---- BOOKINGS ----
create policy "bookings_tenant_read_own" on public.bookings
  for select using (
    tenant_id = auth.uid()
    or exists (select 1 from public.properties p where p.id = property_id and p.owner_id = auth.uid())
    or public.is_admin()
  );
create policy "bookings_tenant_insert" on public.bookings
  for insert with check (tenant_id = auth.uid());
create policy "bookings_update_tenant_or_owner" on public.bookings
  for update using (
    tenant_id = auth.uid()
    or exists (select 1 from public.properties p where p.id = property_id and p.owner_id = auth.uid())
    or public.is_admin()
  );
