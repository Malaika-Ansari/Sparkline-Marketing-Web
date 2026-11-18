-- ==============================================================================
-- Sparkline Marketing Intelligence Platform
-- Migration: 20261114_auth_and_projects.sql
-- Description: User Profiles, User Preferences, Marketing Projects, Project Members & Row Level Security (RLS)
-- Phase: Prompt 21 of 25 — Authentication & Project Management
-- ==============================================================================

-- 1. Enable UUID Extension if not already present
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ==============================================================================
-- 2. User Profiles Table
-- Holds personal identity, company information, and localization preferences
-- ==============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  avatar_url text default '',
  company_name text default '',
  job_title text default '',
  country text default 'United States' not null,
  preferred_language text default 'English' not null,
  preferred_currency text default 'USD' not null,
  time_zone text default 'America/New_York (EST)' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ==============================================================================
-- 3. User Preferences Table
-- Stores display preferences, notification switches, and interface defaults
-- ==============================================================================
create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  theme text default 'light' not null,
  notifications_email boolean default true not null,
  notifications_marketing boolean default false not null,
  compact_tables boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ==============================================================================
-- 4. Marketing Projects Table
-- High-level project workspace containers holding full business configurations
-- ==============================================================================
create table if not exists public.marketing_projects (
  id text primary key, -- e.g. "prj-sparkline-athletic-edge-1700000000" or UUID
  user_id uuid references auth.users(id) on delete cascade not null,
  brand_name text not null,
  industry text not null,
  status text default 'Draft' not null check (status in ('Draft', 'In Strategy', 'Ready for Strategy', 'Active Flight', 'Active', 'On Hold', 'Completed', 'Archived')),
  project_data jsonb not null default '{}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ==============================================================================
-- 5. Project Members Table
-- Multi-user workspace collaboration with role-based access control
-- ==============================================================================
create table if not exists public.project_members (
  id uuid primary key default gen_random_uuid(),
  project_id text references public.marketing_projects(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text default 'editor' not null check (role in ('owner', 'editor', 'viewer')),
  invited_by uuid references auth.users(id) on delete set null,
  joined_at timestamptz default now() not null,
  unique (project_id, user_id)
);

-- ==============================================================================
-- 6. Performance Indexes
-- ==============================================================================
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_projects_user_id on public.marketing_projects(user_id);
create index if not exists idx_projects_status on public.marketing_projects(status);
create index if not exists idx_projects_industry on public.marketing_projects(industry);
create index if not exists idx_project_members_user on public.project_members(user_id);
create index if not exists idx_project_members_project on public.project_members(project_id);

-- ==============================================================================
-- 7. Row Level Security (RLS) Policies
-- Enforce tenant isolation so users can strictly access only their authorized records
-- ==============================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.marketing_projects enable row level security;
alter table public.project_members enable row level security;

-- PROFILES POLICIES
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- USER PREFERENCES POLICIES
create policy "Users can view their own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy "Users can update their own preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id);

create policy "Users can insert their own preferences"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

-- MARKETING PROJECTS POLICIES
create policy "Users can view own projects or projects they collaborate on"
  on public.marketing_projects for select
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.project_members pm
      where pm.project_id = marketing_projects.id
        and pm.user_id = auth.uid()
    )
  );

create policy "Users can create their own marketing projects"
  on public.marketing_projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects or editable collaborations"
  on public.marketing_projects for update
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.project_members pm
      where pm.project_id = marketing_projects.id
        and pm.user_id = auth.uid()
        and pm.role in ('owner', 'editor')
    )
  );

create policy "Users can delete only their own projects"
  on public.marketing_projects for delete
  using (auth.uid() = user_id);

-- PROJECT MEMBERS POLICIES
create policy "Users can view members of their projects"
  on public.project_members for select
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.marketing_projects p
      where p.id = project_members.project_id
        and (p.user_id = auth.uid() or exists (
          select 1 from public.project_members pm2
          where pm2.project_id = p.id and pm2.user_id = auth.uid()
        ))
    )
  );

create policy "Project owners can manage project members"
  on public.project_members for all
  using (
    exists (
      select 1 from public.marketing_projects p
      where p.id = project_members.project_id
        and p.user_id = auth.uid()
    )
  );

-- ==============================================================================
-- 8. Auto-Provision Profile Trigger
-- Automatically creates a profile row when a new user signs up in auth.users
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, country, preferred_language, preferred_currency, time_zone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    coalesce(new.raw_user_meta_data->>'country', 'United States'),
    coalesce(new.raw_user_meta_data->>'preferred_language', 'English'),
    coalesce(new.raw_user_meta_data->>'preferred_currency', 'USD'),
    coalesce(new.raw_user_meta_data->>'time_zone', 'America/New_York (EST)')
  );

  insert into public.user_preferences (user_id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

