-- ==============================================================================
-- Sparkline Marketing Intelligence Platform
-- Migration: 20261114_advanced_database_and_security.sql
-- Description: Complete Relational Schema, Multi-Tenant Row Level Security (RLS),
--              Audit Logging, Integrity Constraints, and Access Controls.
-- Phase: Prompt 22 of 25 — Database Architecture, Permissions & Advanced Security
-- ==============================================================================

-- 1. Enable Cryptographic & UUID Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ==============================================================================
-- 2. Security Helper Functions
-- Used in RLS policies to evaluate project permissions without recursive joins
-- ==============================================================================

-- Check whether the authenticated user has access to a project
create or replace function public.has_project_access(project_ref text, required_role text default 'viewer')
returns boolean as $$
begin
  -- 1. Unauthenticated users have no access
  if auth.uid() is null then
    return false;
  end if;

  -- 2. Verify project ownership or collaboration membership
  return exists (
    select 1 from public.marketing_projects p
    where p.id = project_ref and (
      p.user_id = auth.uid() or
      exists (
        select 1 from public.project_members pm
        where pm.project_id = project_ref
          and pm.user_id = auth.uid()
          and (
            required_role = 'viewer' or
            (required_role = 'editor' and pm.role in ('owner', 'editor')) or
            (required_role = 'owner' and pm.role = 'owner')
          )
      )
    )
  );
end;
$$ language plpgsql security definer stable;

-- ==============================================================================
-- 3. Core Identity & User Preferences Tables
-- ==============================================================================

-- 3.1 User Profiles
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

-- 3.2 User Preferences
create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  theme text default 'light' not null check (theme in ('light', 'dark', 'system')),
  notifications_email boolean default true not null,
  notifications_marketing boolean default false not null,
  compact_tables boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ==============================================================================
-- 4. Projects & Workspace Governance Tables
-- ==============================================================================

-- 4.1 Marketing Projects Container
create table if not exists public.marketing_projects (
  id text primary key, -- e.g. "prj-sparkline-athletic-edge-1700000000"
  user_id uuid references auth.users(id) on delete cascade not null,
  brand_name text not null,
  industry text not null,
  status text default 'Draft' not null check (status in ('Draft', 'In Strategy', 'Ready for Strategy', 'Active Flight', 'Active', 'On Hold', 'Completed', 'Archived')),
  project_data jsonb not null default '{}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 4.2 Project Members (RBAC: owner, editor, viewer)
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
-- 5. Business Foundation, Products & Customer Intelligence
-- ==============================================================================

-- 5.1 Business Profiles
create table if not exists public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  project_id text references public.marketing_projects(id) on delete cascade not null unique,
  brand_name text not null,
  tagline text default '',
  description text not null,
  industry text not null,
  business_type text default 'D2C' not null,
  target_geography text default 'United States' not null,
  website_url text default '',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 5.2 Products and Services Portfolio
create table if not exists public.products_services (
  id uuid primary key default gen_random_uuid(),
  project_id text references public.marketing_projects(id) on delete cascade not null,
  name text not null,
  type text default 'product' not null check (type in ('product', 'service', 'subscription', 'bundle')),
  description text default '',
  price numeric(12, 2) not null check (price >= 0),
  cost numeric(12, 2) default 0 check (cost >= 0),
  currency text default 'USD' not null,
  target_audience text default '',
  usp text default '',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 5.3 Target Audience Analyses
create table if not exists public.target_audiences (
  id uuid primary key default gen_random_uuid(),
  project_id text references public.marketing_projects(id) on delete cascade not null,
  segment_name text not null,
  age_range text default '25-45',
  gender text default 'All',
  income_level text default '',
  geography text default '',
  interests text[] default '{}',
  pain_points text[] default '{}',
  goals text[] default '{}',
  preferred_channels text[] default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 5.4 Customer Personas
create table if not exists public.customer_personas (
  id uuid primary key default gen_random_uuid(),
  project_id text references public.marketing_projects(id) on delete cascade not null,
  persona_name text not null,
  archetype text default '',
  demographics jsonb default '{}'::jsonb not null,
  psychographics jsonb default '{}'::jsonb not null,
  objections text[] default '{}',
  buying_triggers text[] default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ==============================================================================
-- 6. Market Research, Sources, Competitors & SWOT/PESTLE
-- ==============================================================================

-- 6.1 Market Research
create table if not exists public.market_research (
  id uuid primary key default gen_random_uuid(),
  project_id text references public.marketing_projects(id) on delete cascade not null,
  market_size_tam numeric(14, 2) default 0 check (market_size_tam >= 0),
  market_size_sam numeric(14, 2) default 0 check (market_size_sam >= 0),
  market_size_som numeric(14, 2) default 0 check (market_size_som >= 0),
  currency text default 'USD' not null,
  cagr_percent numeric(5, 2) default 0,
  growth_drivers text[] default '{}',
  market_barriers text[] default '{}',
  key_trends text[] default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 6.2 Research Sources (Preserves Provenance & Evidence)
create table if not exists public.research_sources (
  id uuid primary key default gen_random_uuid(),
  project_id text references public.marketing_projects(id) on delete cascade not null,
  title text not null,
  publisher text not null,
  publication_year integer check (publication_year >= 1990 and publication_year <= 2100),
  source_url text default '',
  provenance_type text default 'Verified external benchmark' not null,
  confidence_score numeric(3, 2) default 0.90 check (confidence_score >= 0 and confidence_score <= 1.0),
  created_at timestamptz default now() not null
);

-- 6.3 Competitor Analysis
create table if not exists public.competitors (
  id uuid primary key default gen_random_uuid(),
  project_id text references public.marketing_projects(id) on delete cascade not null,
  competitor_name text not null,
  website_url text default '',
  threat_level text default 'Medium' check (threat_level in ('Low', 'Medium', 'High', 'Critical')),
  market_share_percent numeric(5, 2) default 0 check (market_share_percent >= 0 and market_share_percent <= 100),
  strengths text[] default '{}',
  weaknesses text[] default '{}',
  pricing_position text default 'Moderate' check (pricing_position in ('Budget', 'Moderate', 'Premium', 'Luxury')),
  key_differentiators text[] default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 6.4 SWOT and PESTLE Synthesis
create table if not exists public.swot_pestle_analyses (
  id uuid primary key default gen_random_uuid(),
  project_id text references public.marketing_projects(id) on delete cascade not null unique,
  strengths text[] default '{}',
  weaknesses text[] default '{}',
  opportunities text[] default '{}',
  threats text[] default '{}',
  political text[] default '{}',
  economic text[] default '{}',
  social text[] default '{}',
  technological text[] default '{}',
  legal text[] default '{}',
  environmental text[] default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ==============================================================================
-- 7. Marketing Strategies & Prioritized Recommendations
-- ==============================================================================

-- 7.1 Marketing Strategies
create table if not exists public.marketing_strategies (
  id text primary key, -- e.g. "strat-sparkline-athletic-edge-1"
  project_id text references public.marketing_projects(id) on delete cascade not null,
  version integer default 1 not null check (version >= 1),
  overall_score numeric(4, 1) default 85.0 check (overall_score >= 0 and overall_score <= 100),
  primary_focus text not null,
  target_audience_summary text not null,
  executive_summary text not null,
  channels text[] default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 7.2 Strategy Recommendations
create table if not exists public.strategy_recommendations (
  id uuid primary key default gen_random_uuid(),
  strategy_id text references public.marketing_strategies(id) on delete cascade not null,
  project_id text references public.marketing_projects(id) on delete cascade not null,
  title text not null,
  description text not null,
  priority text default 'High' check (priority in ('Critical', 'High', 'Medium', 'Low')),
  impact numeric(3, 1) default 8.0 check (impact >= 1.0 and impact <= 10.0),
  effort numeric(3, 1) default 5.0 check (effort >= 1.0 and effort <= 10.0),
  timeframe text default 'Month 1',
  channel text not null,
  created_at timestamptz default now() not null
);

-- ==============================================================================
-- 8. Budgeting, Multi-Currency, Metrics & Forecasting
-- ==============================================================================

-- 8.1 Marketing Budgets
create table if not exists public.marketing_budgets (
  id uuid primary key default gen_random_uuid(),
  project_id text references public.marketing_projects(id) on delete cascade not null,
  planning_period text default 'Monthly' check (planning_period in ('Monthly', 'Quarterly', 'Annual', 'Campaign-specific')),
  total_budget numeric(12, 2) not null check (total_budget >= 0),
  currency text default 'USD' not null,
  status text default 'Active' check (status in ('Draft', 'Active', 'Archived', 'Superseded')),
  notes text default '',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 8.2 Budget Allocations
create table if not exists public.budget_allocations (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid references public.marketing_budgets(id) on delete cascade not null,
  project_id text references public.marketing_projects(id) on delete cascade not null,
  category text not null check (category in ('Paid Advertising', 'Content & Creative', 'Software & Tools', 'Agency & Freelancer', 'Events & PR', 'Reserve / Contingency')),
  channel_name text not null,
  allocated_amount numeric(12, 2) not null check (allocated_amount >= 0),
  percentage numeric(5, 2) not null check (percentage >= 0 and percentage <= 100),
  spend_type text default 'variable' check (spend_type in ('fixed', 'variable')),
  created_at timestamptz default now() not null
);

-- 8.3 User Currency Conversions
create table if not exists public.currency_conversions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  from_currency text not null,
  to_currency text not null,
  base_amount numeric(14, 2) not null check (base_amount >= 0),
  exchange_rate numeric(14, 6) not null check (exchange_rate > 0),
  converted_amount numeric(14, 2) not null check (converted_amount >= 0),
  created_at timestamptz default now() not null
);

-- 8.4 Historical Exchange Rates (Immutable Ledger)
create table if not exists public.exchange_rate_history (
  id uuid primary key default gen_random_uuid(),
  base_currency text not null,
  target_currency text not null,
  rate numeric(14, 6) not null check (rate > 0),
  source text default 'Frankfurter / ECB' not null,
  recorded_at timestamptz default now() not null
);

-- 8.5 Marketing Metric Calculations
create table if not exists public.marketing_metrics (
  id uuid primary key default gen_random_uuid(),
  project_id text references public.marketing_projects(id) on delete cascade not null,
  metric_name text not null, -- e.g. 'CAC', 'ROAS', 'LTV', 'CTR', 'CVR', 'CPA'
  value numeric(14, 4) not null,
  unit text default '',
  input_parameters jsonb default '{}'::jsonb not null,
  created_at timestamptz default now() not null
);

-- 8.6 Forecasts and Scenarios
create table if not exists public.forecast_scenarios (
  id text primary key, -- e.g. "fc-sparkline-athletic-edge-1"
  project_id text references public.marketing_projects(id) on delete cascade not null,
  title text not null,
  monthly_ad_spend numeric(12, 2) not null check (monthly_ad_spend >= 0),
  currency text default 'USD' not null,
  assumptions jsonb not null default '{}'::jsonb,
  scenarios jsonb not null default '{}'::jsonb,
  break_even_point numeric(12, 2) default 0,
  created_at timestamptz default now() not null
);

-- ==============================================================================
-- 9. Advertising Campaigns & Social Media Content Studio
-- ==============================================================================

-- 9.1 Advertising Campaigns
create table if not exists public.advertising_campaigns (
  id text primary key, -- e.g. "cmp-sparkline-athletic-edge-1"
  project_id text references public.marketing_projects(id) on delete cascade not null,
  name text not null,
  platform text not null check (platform in ('Google Ads', 'Meta (Facebook & Instagram)', 'TikTok Ads', 'LinkedIn Ads', 'YouTube Ads', 'Pinterest Ads')),
  objective text not null,
  status text default 'Draft' not null check (status in ('Draft', 'Scheduled', 'Active', 'Paused', 'Completed', 'Archived')),
  daily_budget numeric(12, 2) not null check (daily_budget >= 0),
  total_budget numeric(12, 2) not null check (total_budget >= 0),
  currency text default 'USD' not null,
  start_date date,
  end_date date,
  target_audience text default '',
  angles text[] default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 9.2 Campaign Performance Tracking
create table if not exists public.campaign_performance (
  id uuid primary key default gen_random_uuid(),
  campaign_id text references public.advertising_campaigns(id) on delete cascade not null,
  project_id text references public.marketing_projects(id) on delete cascade not null,
  spend numeric(12, 2) default 0 check (spend >= 0),
  impressions bigint default 0 check (impressions >= 0),
  clicks bigint default 0 check (clicks >= 0),
  conversions bigint default 0 check (conversions >= 0),
  revenue numeric(12, 2) default 0 check (revenue >= 0),
  recorded_date date default current_date not null,
  created_at timestamptz default now() not null
);

-- 9.3 Social Media Posts
create table if not exists public.social_media_posts (
  id text primary key, -- e.g. "post-sparkline-athletic-edge-1"
  project_id text references public.marketing_projects(id) on delete cascade not null,
  campaign_id text references public.advertising_campaigns(id) on delete set null,
  title text not null,
  platform text not null check (platform in ('Instagram', 'Facebook', 'LinkedIn', 'TikTok', 'YouTube', 'Pinterest', 'X')),
  format text not null,
  objective text not null,
  caption text not null,
  opening_hook text default '',
  call_to_action text default '',
  hashtags text[] default '{}',
  status text default 'Idea' not null check (status in ('Idea', 'Draft', 'Ready for Review', 'Approved', 'Scheduled', 'Published', 'Archived')),
  scheduled_for timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 9.4 Content Editorial Calendars
create table if not exists public.content_calendars (
  id uuid primary key default gen_random_uuid(),
  project_id text references public.marketing_projects(id) on delete cascade not null,
  post_id text references public.social_media_posts(id) on delete cascade not null,
  scheduled_date date not null,
  scheduled_time time not null,
  time_zone text default 'America/New_York (EST)' not null,
  publishing_status text default 'Scheduled' check (publishing_status in ('Draft', 'Scheduled', 'Published', 'Failed', 'Cancelled')),
  created_at timestamptz default now() not null
);

-- ==============================================================================
-- 10. SEO Audits, Tracked Keywords & Marketing Tasks
-- ==============================================================================

-- 10.1 Website SEO Audits
create table if not exists public.seo_audits (
  id text primary key,
  project_id text references public.marketing_projects(id) on delete cascade not null,
  target_url text not null,
  overall_score numeric(4, 1) not null check (overall_score >= 0 and overall_score <= 100),
  page_title text default '',
  meta_description text default '',
  findings jsonb default '[]'::jsonb not null,
  technical_checklist jsonb default '[]'::jsonb not null,
  created_at timestamptz default now() not null
);

-- 10.2 SEO Tracked Keywords
create table if not exists public.seo_keywords (
  id uuid primary key default gen_random_uuid(),
  project_id text references public.marketing_projects(id) on delete cascade not null,
  keyword text not null,
  search_intent text not null check (search_intent in ('Informational', 'Navigational', 'Commercial', 'Transactional', 'Local', 'Long-tail')),
  cluster_name text default '',
  difficulty text default 'Medium' check (difficulty in ('Low', 'Medium', 'High')),
  target_page text default '',
  created_at timestamptz default now() not null
);

-- 10.3 Marketing Tasks and Milestones
create table if not exists public.marketing_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id text references public.marketing_projects(id) on delete cascade not null,
  title text not null,
  description text default '',
  status text default 'To Do' check (status in ('To Do', 'In Progress', 'Under Review', 'Done')),
  priority text default 'Medium' check (priority in ('Low', 'Medium', 'High', 'Urgent')),
  due_date date,
  assigned_to uuid references auth.users(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ==============================================================================
-- 11. Executive Reports, PDF Exports, Integrations & Notifications
-- ==============================================================================

-- 11.1 Executive Reports
create table if not exists public.reports (
  id text primary key, -- e.g. "rep-sparkline-athletic-edge-1"
  project_id text references public.marketing_projects(id) on delete cascade not null,
  template_name text not null,
  version integer default 1 not null check (version >= 1),
  status text default 'Ready' check (status in ('Draft', 'Ready', 'Archived')),
  configuration jsonb not null default '{}'::jsonb,
  sections jsonb not null default '[]'::jsonb,
  data_provenance jsonb not null default '[]'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 11.2 Report Export Artifacts (Preserves Immutable Export Audit Trail)
create table if not exists public.report_exports (
  id uuid primary key default gen_random_uuid(),
  report_id text references public.reports(id) on delete cascade not null,
  project_id text references public.marketing_projects(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  format text not null check (format in ('pdf_print', 'pdf_binary', 'csv_tabular')),
  file_name text not null,
  file_size_bytes bigint default 0 check (file_size_bytes >= 0),
  created_at timestamptz default now() not null
);

-- 11.3 Third-Party Connected Integrations (Tokens encrypted at rest)
create table if not exists public.user_integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  provider text not null,
  account_id text default '',
  account_name text default '',
  status text default 'disconnected' check (status in ('connected', 'disconnected', 'expired', 'revoked')),
  encrypted_access_token text, -- Encrypted at rest; NEVER sent to client browser
  connected_at timestamptz,
  last_synced_at timestamptz,
  created_at timestamptz default now() not null,
  unique (user_id, provider)
);

-- 11.4 In-App Notifications
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text default 'info' check (type in ('info', 'success', 'warning', 'error')),
  read boolean default false not null,
  link text default '',
  created_at timestamptz default now() not null
);

-- 11.5 Security & Operational Audit Logs (Append-Only Immutable Ledger)
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null, -- e.g. 'auth.login_success', 'project.created', 'project.deleted'
  resource_type text not null, -- e.g. 'marketing_project', 'report', 'session'
  resource_id text default '',
  ip_address text default '',
  outcome text default 'success' check (outcome in ('success', 'failure', 'denied')),
  metadata jsonb default '{}'::jsonb not null, -- Redacted of secrets, passwords, sensitive bodies
  created_at timestamptz default now() not null
);

-- ==============================================================================
-- 12. Strategic Performance Indexes
-- Indexed on high-frequency filter, join, and order keys
-- ==============================================================================

create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_projects_user_id on public.marketing_projects(user_id);
create index if not exists idx_projects_status on public.marketing_projects(status);
create index if not exists idx_projects_industry on public.marketing_projects(industry);
create index if not exists idx_project_members_user on public.project_members(user_id);
create index if not exists idx_project_members_project on public.project_members(project_id);

create index if not exists idx_business_profiles_project on public.business_profiles(project_id);
create index if not exists idx_products_project on public.products_services(project_id);
create index if not exists idx_audiences_project on public.target_audiences(project_id);
create index if not exists idx_personas_project on public.customer_personas(project_id);
create index if not exists idx_market_research_project on public.market_research(project_id);
create index if not exists idx_sources_project on public.research_sources(project_id);
create index if not exists idx_competitors_project on public.competitors(project_id);
create index if not exists idx_swot_pestle_project on public.swot_pestle_analyses(project_id);
create index if not exists idx_strategies_project on public.marketing_strategies(project_id);
create index if not exists idx_strategy_recs_strat on public.strategy_recommendations(strategy_id);
create index if not exists idx_budgets_project on public.marketing_budgets(project_id);
create index if not exists idx_budget_alloc_budget on public.budget_allocations(budget_id);
create index if not exists idx_currency_conv_user on public.currency_conversions(user_id);
create index if not exists idx_rate_hist_pair on public.exchange_rate_history(base_currency, target_currency, recorded_at desc);
create index if not exists idx_metrics_project on public.marketing_metrics(project_id);
create index if not exists idx_forecasts_project on public.forecast_scenarios(project_id);
create index if not exists idx_campaigns_project on public.advertising_campaigns(project_id);
create index if not exists idx_camp_perf_campaign on public.campaign_performance(campaign_id);
create index if not exists idx_social_posts_project on public.social_media_posts(project_id);
create index if not exists idx_calendars_project on public.content_calendars(project_id);
create index if not exists idx_seo_audits_project on public.seo_audits(project_id);
create index if not exists idx_seo_keywords_project on public.seo_keywords(project_id);
create index if not exists idx_tasks_project on public.marketing_tasks(project_id);
create index if not exists idx_reports_project on public.reports(project_id);
create index if not exists idx_report_exports_report on public.report_exports(report_id);
create index if not exists idx_integrations_user on public.user_integrations(user_id);
create index if not exists idx_notifications_user_read on public.notifications(user_id, read);
create index if not exists idx_audit_logs_user_time on public.audit_logs(user_id, created_at desc);
create index if not exists idx_audit_logs_action on public.audit_logs(action);

-- ==============================================================================
-- 13. Enable Row-Level Security (RLS) on ALL Tables
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.marketing_projects enable row level security;
alter table public.project_members enable row level security;
alter table public.business_profiles enable row level security;
alter table public.products_services enable row level security;
alter table public.target_audiences enable row level security;
alter table public.customer_personas enable row level security;
alter table public.market_research enable row level security;
alter table public.research_sources enable row level security;
alter table public.competitors enable row level security;
alter table public.swot_pestle_analyses enable row level security;
alter table public.marketing_strategies enable row level security;
alter table public.strategy_recommendations enable row level security;
alter table public.marketing_budgets enable row level security;
alter table public.budget_allocations enable row level security;
alter table public.currency_conversions enable row level security;
alter table public.exchange_rate_history enable row level security;
alter table public.marketing_metrics enable row level security;
alter table public.forecast_scenarios enable row level security;
alter table public.advertising_campaigns enable row level security;
alter table public.campaign_performance enable row level security;
alter table public.social_media_posts enable row level security;
alter table public.content_calendars enable row level security;
alter table public.seo_audits enable row level security;
alter table public.seo_keywords enable row level security;
alter table public.marketing_tasks enable row level security;
alter table public.reports enable row level security;
alter table public.report_exports enable row level security;
alter table public.user_integrations enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

-- ==============================================================================
-- 14. Comprehensive RLS Policies
-- ==============================================================================

-- 14.1 PROFILES POLICIES
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 14.2 USER PREFERENCES POLICIES
drop policy if exists "Users can view own preferences" on public.user_preferences;
create policy "Users can view own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

drop policy if exists "Users can update own preferences" on public.user_preferences;
create policy "Users can update own preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own preferences" on public.user_preferences;
create policy "Users can insert own preferences"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

-- 14.3 MARKETING PROJECTS POLICIES
drop policy if exists "Users can view own or member projects" on public.marketing_projects;
create policy "Users can view own or member projects"
  on public.marketing_projects for select
  using (
    auth.uid() = user_id or
    exists (
      select 1 from public.project_members pm
      where pm.project_id = marketing_projects.id and pm.user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert own projects" on public.marketing_projects;
create policy "Users can insert own projects"
  on public.marketing_projects for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own or editable projects" on public.marketing_projects;
create policy "Users can update own or editable projects"
  on public.marketing_projects for update
  using (
    auth.uid() = user_id or
    exists (
      select 1 from public.project_members pm
      where pm.project_id = marketing_projects.id
        and pm.user_id = auth.uid()
        and pm.role in ('owner', 'editor')
    )
  );

drop policy if exists "Only project owners can delete projects" on public.marketing_projects;
create policy "Only project owners can delete projects"
  on public.marketing_projects for delete
  using (auth.uid() = user_id);

-- 14.4 PROJECT MEMBERS POLICIES
drop policy if exists "Users can view members of accessible projects" on public.project_members;
create policy "Users can view members of accessible projects"
  on public.project_members for select
  using (public.has_project_access(project_id, 'viewer'));

drop policy if exists "Project owners can manage members" on public.project_members;
create policy "Project owners can manage members"
  on public.project_members for all
  using (
    exists (
      select 1 from public.marketing_projects p
      where p.id = project_members.project_id and p.user_id = auth.uid()
    )
  );

-- 14.5 PROJECT-TIED TABLES GENERIC ACCESS POLICIES
-- Macro-level security: all project tables inherit project authorization!

-- Business Profiles
create policy "Project members view business profile" on public.business_profiles for select using (public.has_project_access(project_id, 'viewer'));
create policy "Project editors modify business profile" on public.business_profiles for all using (public.has_project_access(project_id, 'editor'));

-- Products and Services
create policy "Project members view products" on public.products_services for select using (public.has_project_access(project_id, 'viewer'));
create policy "Project editors modify products" on public.products_services for all using (public.has_project_access(project_id, 'editor'));

-- Target Audiences
create policy "Project members view target audiences" on public.target_audiences for select using (public.has_project_access(project_id, 'viewer'));
create policy "Project editors modify target audiences" on public.target_audiences for all using (public.has_project_access(project_id, 'editor'));

-- Customer Personas
create policy "Project members view customer personas" on public.customer_personas for select using (public.has_project_access(project_id, 'viewer'));
create policy "Project editors modify customer personas" on public.customer_personas for all using (public.has_project_access(project_id, 'editor'));

-- Market Research & Sources
create policy "Project members view market research" on public.market_research for select using (public.has_project_access(project_id, 'viewer'));
create policy "Project editors modify market research" on public.market_research for all using (public.has_project_access(project_id, 'editor'));
create policy "Project members view research sources" on public.research_sources for select using (public.has_project_access(project_id, 'viewer'));
create policy "Project editors modify research sources" on public.research_sources for all using (public.has_project_access(project_id, 'editor'));

-- Competitors
create policy "Project members view competitors" on public.competitors for select using (public.has_project_access(project_id, 'viewer'));
create policy "Project editors modify competitors" on public.competitors for all using (public.has_project_access(project_id, 'editor'));

-- SWOT & PESTLE
create policy "Project members view swot pestle" on public.swot_pestle_analyses for select using (public.has_project_access(project_id, 'viewer'));
create policy "Project editors modify swot pestle" on public.swot_pestle_analyses for all using (public.has_project_access(project_id, 'editor'));

-- Marketing Strategies & Recommendations
create policy "Project members view marketing strategies" on public.marketing_strategies for select using (public.has_project_access(project_id, 'viewer'));
create policy "Project editors modify marketing strategies" on public.marketing_strategies for all using (public.has_project_access(project_id, 'editor'));
create policy "Project members view strategy recommendations" on public.strategy_recommendations for select using (public.has_project_access(project_id, 'viewer'));
create policy "Project editors modify strategy recommendations" on public.strategy_recommendations for all using (public.has_project_access(project_id, 'editor'));

-- Budgets & Allocations
create policy "Project members view marketing budgets" on public.marketing_budgets for select using (public.has_project_access(project_id, 'viewer'));
create policy "Project editors modify marketing budgets" on public.marketing_budgets for all using (public.has_project_access(project_id, 'editor'));
create policy "Project members view budget allocations" on public.budget_allocations for select using (public.has_project_access(project_id, 'viewer'));
create policy "Project editors modify budget allocations" on public.budget_allocations for all using (public.has_project_access(project_id, 'editor'));

-- Currency Conversions & Exchange Rates
create policy "Users view own currency conversions" on public.currency_conversions for select using (auth.uid() = user_id);
create policy "Users insert own currency conversions" on public.currency_conversions for insert with check (auth.uid() = user_id);
create policy "Authenticated users read historical exchange rates" on public.exchange_rate_history for select using (auth.uid() is not null);

-- Marketing Metrics & Forecasts
create policy "Project members view marketing metrics" on public.marketing_metrics for select using (public.has_project_access(project_id, 'viewer'));
create policy "Project editors modify marketing metrics" on public.marketing_metrics for all using (public.has_project_access(project_id, 'editor'));
create policy "Project members view forecast scenarios" on public.forecast_scenarios for select using (public.has_project_access(project_id, 'viewer'));
create policy "Project editors modify forecast scenarios" on public.forecast_scenarios for all using (public.has_project_access(project_id, 'editor'));

-- Advertising Campaigns & Performance
create policy "Project members view advertising campaigns" on public.advertising_campaigns for select using (public.has_project_access(project_id, 'viewer'));
create policy "Project editors modify advertising campaigns" on public.advertising_campaigns for all using (public.has_project_access(project_id, 'editor'));
create policy "Project members view campaign performance" on public.campaign_performance for select using (public.has_project_access(project_id, 'viewer'));
create policy "Project editors modify campaign performance" on public.campaign_performance for all using (public.has_project_access(project_id, 'editor'));

-- Social Media & Content Calendar
create policy "Project members view social media posts" on public.social_media_posts for select using (public.has_project_access(project_id, 'viewer'));
create policy "Project editors modify social media posts" on public.social_media_posts for all using (public.has_project_access(project_id, 'editor'));
create policy "Project members view content calendars" on public.content_calendars for select using (public.has_project_access(project_id, 'viewer'));
create policy "Project editors modify content calendars" on public.content_calendars for all using (public.has_project_access(project_id, 'editor'));

-- SEO Audits & Tracked Keywords
create policy "Project members view seo audits" on public.seo_audits for select using (public.has_project_access(project_id, 'viewer'));
create policy "Project editors modify seo audits" on public.seo_audits for all using (public.has_project_access(project_id, 'editor'));
create policy "Project members view seo keywords" on public.seo_keywords for select using (public.has_project_access(project_id, 'viewer'));
create policy "Project editors modify seo keywords" on public.seo_keywords for all using (public.has_project_access(project_id, 'editor'));

-- Marketing Tasks
create policy "Project members view marketing tasks" on public.marketing_tasks for select using (public.has_project_access(project_id, 'viewer'));
create policy "Project editors modify marketing tasks" on public.marketing_tasks for all using (public.has_project_access(project_id, 'editor'));

-- Reports & Exports
create policy "Project members view executive reports" on public.reports for select using (public.has_project_access(project_id, 'viewer'));
create policy "Project editors modify executive reports" on public.reports for all using (public.has_project_access(project_id, 'editor'));
create policy "Users view own report exports" on public.report_exports for select using (auth.uid() = user_id and public.has_project_access(project_id, 'viewer'));
create policy "Users insert own report exports" on public.report_exports for insert with check (auth.uid() = user_id and public.has_project_access(project_id, 'viewer'));

-- User Integrations (Private to user)
create policy "Users manage own integrations" on public.user_integrations for all using (auth.uid() = user_id);

-- Notifications (Private to user)
create policy "Users manage own notifications" on public.notifications for all using (auth.uid() = user_id);

-- Audit Logs (Append-only; users read own activity; system/admin writes)
create policy "Users read own audit logs" on public.audit_logs for select using (auth.uid() = user_id);
create policy "Authenticated users insert own audit events" on public.audit_logs for insert with check (auth.uid() = user_id);

-- ==============================================================================
-- 15. Auto-Provision Profile Trigger
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
  )
  on conflict (id) do nothing;

  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  -- Log audit registration event
  insert into public.audit_logs (user_id, action, resource_type, resource_id, outcome, metadata)
  values (new.id, 'auth.signup_provisioned', 'profile', new.id::text, 'success', jsonb_build_object('email', new.email));

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

