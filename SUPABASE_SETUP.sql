-- TEMPLATE ONLY. Do not run against an unrelated existing project.
-- Create a separate project for Experience Foundry when ready.

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  building_name text,
  event_date timestamptz,
  location text,
  created_at timestamptz not null default now()
);

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  first_name text not null check (char_length(first_name) between 1 and 50),
  unit text not null check (char_length(unit) between 1 and 20),
  party_size text not null,
  time_slot text not null,
  email text,
  updates_ok boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_submissions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  social_url text not null,
  display_permission boolean not null default false,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;
alter table public.rsvps enable row level security;
alter table public.gallery_submissions enable row level security;

-- Public visitors may read event details only.
create policy "public can view event details"
on public.events for select to anon
using (true);

-- Public visitors may create RSVP rows, but may NOT read RSVPs.
create policy "public can create rsvp"
on public.rsvps for insert to anon
with check (true);

-- Public visitors may submit a gallery link only when they explicitly grant display permission.
create policy "public can submit gallery links with permission"
on public.gallery_submissions for insert to anon
with check (display_permission = true);

-- Do not add anonymous SELECT policies to RSVPs or unapproved gallery submissions.
-- Admin reads should be done via authenticated authorization designed for the production app.
