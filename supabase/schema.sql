-- ==============================================================================
-- INTELLUS NEWS INDIA - SUPABASE DATABASE SCHEMA & POLICIES
-- Safe & idempotent script: can be run repeatedly without duplicate policy errors.
-- Run this in your Supabase Dashboard SQL Editor (SQL Editor -> New query -> Run)
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. PROFILES TABLE (Linked with Supabase Auth users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  role text default 'CONTRIBUTOR' check (role in ('CONTRIBUTOR', 'EDITOR', 'ADMIN')),
  contributor_id text,
  avatar_url text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Policies for profiles (safe drop & recreate)
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
declare
  user_name text;
  user_role text;
  contributor_code text;
begin
  user_name := coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));
  user_role := coalesce(new.raw_user_meta_data->>'role', 'CONTRIBUTOR');
  contributor_code := 'CONT-' || upper(substr(md5(random()::text), 1, 5));

  insert into public.profiles (id, email, name, role, contributor_id)
  values (new.id, new.email, user_name, user_role, contributor_code)
  on conflict (id) do update set
    email = excluded.email,
    name = coalesce(public.profiles.name, excluded.name),
    role = coalesce(public.profiles.role, excluded.role);

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 3. CATEGORIES TABLE
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz default now()
);

alter table public.categories enable row level security;

-- Policies for categories
drop policy if exists "Categories are viewable by everyone" on public.categories;
create policy "Categories are viewable by everyone"
  on public.categories for select
  using (true);

drop policy if exists "Authenticated users can insert categories" on public.categories;
create policy "Authenticated users can insert categories"
  on public.categories for insert
  with check (auth.role() = 'authenticated');


-- 4. ARTICLES TABLE
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  content text,
  hero_image text,
  category_id uuid references public.categories(id) on delete set null,
  category_slug text,
  category_name text,
  author_id uuid references public.profiles(id) on delete set null,
  author_name text default 'Desk',
  is_featured boolean default false,
  is_trending boolean default false,
  status text default 'PUBLISHED' check (status in ('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED')),
  views integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.articles enable row level security;

-- Policies for articles
drop policy if exists "Published articles are viewable by everyone" on public.articles;
create policy "Published articles are viewable by everyone"
  on public.articles for select
  using (status = 'PUBLISHED' or auth.uid() = author_id);

drop policy if exists "Authenticated users can insert articles" on public.articles;
create policy "Authenticated users can insert articles"
  on public.articles for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "Authors or editors can update articles" on public.articles;
create policy "Authors or editors can update articles"
  on public.articles for update
  using (auth.uid() = author_id or exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role in ('EDITOR', 'ADMIN')
  ));

drop policy if exists "Editors can delete articles" on public.articles;
create policy "Editors can delete articles"
  on public.articles for delete
  using (exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role in ('EDITOR', 'ADMIN')
  ));


-- 5. REPORTS TABLE (Citizen / Community Leads)
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text,
  source_links text,
  submitter_name text,
  submitter_email text,
  user_id uuid references auth.users(id) on delete set null,
  status text default 'PENDING' check (status in ('PENDING', 'VERIFIED', 'REJECTED', 'PUBLISHED')),
  created_at timestamptz default now()
);

alter table public.reports enable row level security;

-- Policies for reports
drop policy if exists "Anyone can submit a report" on public.reports;
create policy "Anyone can submit a report"
  on public.reports for insert
  with check (true);

drop policy if exists "Users can view their own reports or editors can view all" on public.reports;
create policy "Users can view their own reports or editors can view all"
  on public.reports for select
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role in ('EDITOR', 'ADMIN')
    )
  );


-- 6. SEED DATA
-- Insert standard news categories
insert into public.categories (name, slug, description)
values
  ('Crime', 'crime', 'Breaking crime updates, investigations & trends'),
  ('Law', 'law', 'Court updates, legal insights & constitutional analysis'),
  ('Tech', 'tech', 'Latest tech news, cybersecurity, innovations & policy'),
  ('India', 'india', 'National governance, policy & society'),
  ('World', 'world', 'Global affairs, geopolitics & international markets')
on conflict (slug) do nothing;

-- Insert initial sample articles matching the app
insert into public.articles (title, slug, summary, content, hero_image, category_slug, category_name, author_name, is_featured, is_trending, status)
values
  (
    'New Criminal Laws Come Into Effect: What Changes for Citizens',
    'new-criminal-laws-come-into-effect-what-changes',
    'India ushers in three landmark criminal statutes reforming procedures and definitions.',
    'India has officially replaced its colonial-era criminal penal codes with three new landmark statutes: Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA). Key overhauls include electronic summons, prioritized forensic examination for severe offenses, streamlined FIR procedures with zero-FIR provisions across all police stations, and codified timelines for investigations.',
    'https://picsum.photos/seed/law1/900/560',
    'law',
    'Law',
    'Legal Bureau',
    true,
    true,
    'PUBLISHED'
  ),
  (
    'CERT-In Issues High-Severity Advisory for Critical Infrastructure',
    'cert-in-high-severity-advisory-critical-infrastructure',
    'Urgent warning issued regarding state-sponsored threat actors targeting essential utilities.',
    'The Indian Computer Emergency Response Team (CERT-In) has published a high-severity alert cautioning government entities, power grid operators, and banking networks of targeted multi-vector cyber operations. Organizations are instructed to mandate multi-factor authentication, audit external-facing assets, and isolate legacy operational technologies.',
    'https://picsum.photos/seed/tech1/900/560',
    'tech',
    'Tech',
    'Cyber Desk',
    false,
    true,
    'PUBLISHED'
  ),
  (
    'RBI Strengthens Digital Banking Security Framework',
    'rbi-strengthens-digital-banking-security-framework',
    'New real-time anomaly detection mandates for high-value fund transfers.',
    'The Reserve Bank of India has introduced updated guidelines directing all scheduled commercial banks and digital payment service providers to integrate behavioral biometrics and real-time fraud mitigation telemetry. The mandate aims to arrest account takeover attempts and protect digital payment consumers.',
    'https://picsum.photos/seed/india1/900/560',
    'india',
    'India',
    'Finance Desk',
    false,
    true,
    'PUBLISHED'
  ),
  (
    'Cyber Fraud Ring Busted Across Three States',
    'cyber-fraud-ring-busted',
    'Joint inter-state police operation arrests 14 operatives in complex mule account syndicate.',
    'Law enforcement agencies across Delhi, Haryana, and Rajasthan dismantled an inter-state syndicate operating dozens of mule bank accounts for laundering money obtained through fraudulent investment schemes and fake parcel scams.',
    'https://picsum.photos/seed/crime1/900/560',
    'crime',
    'Crime',
    'Special Crime Cell',
    false,
    true,
    'PUBLISHED'
  ),
  (
    'High Court Seeks Response on Data Protection Rules',
    'high-court-data-protection-rules',
    'Judicial notice issued regarding compliance deadlines under DPDP legislation.',
    'The High Court has issued notices to key central ministries seeking clarification on rules formulated under the Digital Personal Data Protection Act, highlighting user consent mechanisms and grievance redressal timelines.',
    'https://picsum.photos/seed/law2/900/560',
    'law',
    'Law',
    'Legal Bureau',
    false,
    false,
    'PUBLISHED'
  ),
  (
    'India''s AI Policy Roadmap: What Startups Should Know',
    'india-ai-policy-roadmap',
    'Government allocates compute subsidies and outlines ethical AI deployment guardrails.',
    'Under the IndiaAI Mission, the Ministry of Electronics and Information Technology has opened compute grants for domestic artificial intelligence startups and established benchmarks for safety evaluations.',
    'https://picsum.photos/seed/tech2/900/560',
    'tech',
    'Tech',
    'Tech Desk',
    false,
    false,
    'PUBLISHED'
  ),
  (
    'Global Markets React to Fresh Trade Talks',
    'global-markets-trade-talks',
    'Asian equities rise as bilateral discussions suggest relaxed tariff thresholds.',
    'Stock indices across Asian and European markets posted gains following high-level bilateral trade negotiations focusing on supply chain diversification and reduced tariffs on electronic components.',
    'https://picsum.photos/seed/world1/900/560',
    'world',
    'World',
    'Global Desk',
    false,
    false,
    'PUBLISHED'
  ),
  (
    'Police Launch Awareness Drive on Online Scams',
    'police-awareness-drive-online-scams',
    'Community workshops and digital advisories to prevent digital arrest frauds.',
    'City police have initiated comprehensive awareness campaigns addressing rising digital arrest impersonation scams, cautioning citizens that statutory authorities never demand money over video calls.',
    'https://picsum.photos/seed/crime2/900/560',
    'crime',
    'Crime',
    'City Desk',
    false,
    false,
    'PUBLISHED'
  )
on conflict (slug) do nothing;
