-- ==============================================================================
-- SPARKLINE MARKETING PLATFORM — PHASE 23
-- Advanced Analytics, Integrations & Data Ingestion Schema Migration
-- ==============================================================================

-- 1. Imported Datasets Table (Tracks user CSV/Spreadsheet batch imports)
create table if not exists public.imported_datasets (
  id text primary key, -- e.g. "ds_1731589123456_a8bc"
  project_id text references public.marketing_projects(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  filename text not null,
  data_type text not null check (data_type in ('campaign_performance', 'expenses', 'traffic')),
  total_rows integer default 0 check (total_rows >= 0),
  imported_rows integer default 0 check (imported_rows >= 0),
  skipped_rows integer default 0 check (skipped_rows >= 0),
  error_rows integer default 0 check (error_rows >= 0),
  status text default 'completed' check (status in ('completed', 'partial', 'failed')),
  field_mapping jsonb not null default '{}'::jsonb,
  uploaded_at timestamptz default now() not null,
  created_at timestamptz default now() not null
);

-- 2. Platform Sync Logs Table (Tracks automated & manual third-party sync jobs)
create table if not exists public.sync_logs (
  id text primary key, -- e.g. "sync_1731589123456_f91a"
  user_id uuid references auth.users(id) on delete cascade not null,
  connection_id text not null,
  provider_id text not null,
  started_at timestamptz default now() not null,
  finished_at timestamptz,
  status text default 'running' check (status in ('running', 'success', 'failed')),
  records_processed integer default 0 check (records_processed >= 0),
  records_imported integer default 0 check (records_imported >= 0),
  duplicates_skipped integer default 0 check (duplicates_skipped >= 0),
  error_message text,
  created_at timestamptz default now() not null
);

-- 3. Analytics Snapshots Table (Stores aggregated historical summaries)
create table if not exists public.analytics_snapshots (
  id uuid primary key default gen_random_uuid(),
  project_id text references public.marketing_projects(id) on delete cascade not null,
  snapshot_date date not null,
  period_type text default 'daily' check (period_type in ('daily', 'weekly', 'monthly')),
  total_spend numeric(12, 2) default 0 check (total_spend >= 0),
  total_impressions bigint default 0 check (total_impressions >= 0),
  total_clicks bigint default 0 check (total_clicks >= 0),
  total_conversions bigint default 0 check (total_conversions >= 0),
  total_revenue numeric(12, 2) default 0 check (total_revenue >= 0),
  blended_roas numeric(8, 2) default 0 check (blended_roas >= 0),
  blended_cpc numeric(8, 2) default 0 check (blended_cpc >= 0),
  blended_cpa numeric(8, 2) default 0 check (blended_cpa >= 0),
  channel_breakdown jsonb not null default '{}'::jsonb,
  data_provenance text default 'calculated',
  created_at timestamptz default now() not null,
  unique (project_id, snapshot_date, period_type)
);

-- ==============================================================================
-- Indexes for High-Performance Analytics Queries
-- ==============================================================================
create index if not exists idx_imported_datasets_project on public.imported_datasets(project_id, uploaded_at desc);
create index if not exists idx_sync_logs_user on public.sync_logs(user_id, started_at desc);
create index if not exists idx_sync_logs_provider on public.sync_logs(provider_id, started_at desc);
create index if not exists idx_analytics_snapshots_project on public.analytics_snapshots(project_id, snapshot_date desc);

-- ==============================================================================
-- Row-Level Security (RLS) Enablement
-- ==============================================================================
alter table public.imported_datasets enable row level security;
alter table public.sync_logs enable row level security;
alter table public.analytics_snapshots enable row level security;

-- ==============================================================================
-- Row-Level Security (RLS) Policies
-- ==============================================================================

-- 1. Imported Datasets Policies
drop policy if exists "Project members view imported datasets" on public.imported_datasets;
create policy "Project members view imported datasets"
  on public.imported_datasets for select
  using (public.has_project_access(project_id, 'viewer'));

drop policy if exists "Project editors insert imported datasets" on public.imported_datasets;
create policy "Project editors insert imported datasets"
  on public.imported_datasets for insert
  with check (public.has_project_access(project_id, 'editor'));

drop policy if exists "Project editors delete imported datasets" on public.imported_datasets;
create policy "Project editors delete imported datasets"
  on public.imported_datasets for delete
  using (public.has_project_access(project_id, 'editor'));

-- 2. Sync Logs Policies (User private)
drop policy if exists "Users view own sync logs" on public.sync_logs;
create policy "Users view own sync logs"
  on public.sync_logs for select
  using (auth.uid() = user_id);

drop policy if exists "Users insert own sync logs" on public.sync_logs;
create policy "Users insert own sync logs"
  on public.sync_logs for insert
  with check (auth.uid() = user_id);

-- 3. Analytics Snapshots Policies
drop policy if exists "Project members view analytics snapshots" on public.analytics_snapshots;
create policy "Project members view analytics snapshots"
  on public.analytics_snapshots for select
  using (public.has_project_access(project_id, 'viewer'));

drop policy if exists "Project editors manage analytics snapshots" on public.analytics_snapshots;
create policy "Project editors manage analytics snapshots"
  on public.analytics_snapshots for all
  using (public.has_project_access(project_id, 'editor'));

