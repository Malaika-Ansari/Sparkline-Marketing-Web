# Sparkline Marketing Intelligence Platform
## Database Architecture & Access Security Policies
**Phase: Prompt 21 of 25 — User Authentication & Project Management**

---

### 1. Schema Architecture Overview

Sparkline Marketing leverages a PostgreSQL database architecture with strict Row-Level Security (RLS). When integrated with Cloud Supabase Auth, PostgreSQL security policies isolate each tenant's marketing data at the database engine level, preventing unauthorized cross-tenant queries.

```
                  +-----------------------------------+
                  |            auth.users             |
                  |     (Supabase Auth Service)       |
                  +-----------------+-----------------+
                                    | 1:1
                                    v
+-----------------------+     +-----+-----------------+     +-----------------------+
|  public.user_         |     |    public.profiles    |     |  public.marketing_    |
|  preferences          | <---+                       +---> |  projects             |
+-----------------------+     +-----------------------+     +-----------+-----------+
                                                                        | 1:N
                                                                        v
                                                            +-----------+-----------+
                                                            |  public.project_      |
                                                            |  members              |
                                                            +-----------------------+
```

---

### 2. Table Specifications

#### Table: `public.profiles`
Stores extended user profile information linked directly to the `auth.users` table:
```sql
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
```

#### Table: `public.user_preferences`
Maintains user interface preferences:
```sql
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
```

#### Table: `public.marketing_projects`
Holds the core workspace definitions and configuration payloads:
```sql
create table if not exists public.marketing_projects (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  brand_name text not null,
  industry text not null,
  status text default 'Draft' not null check (status in ('Draft', 'In Strategy', 'Ready for Strategy', 'Active Flight', 'Active', 'On Hold', 'Completed', 'Archived')),
  project_data jsonb not null default '{}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
```

#### Table: `public.project_members`
Enables multi-user role-based access control (RBAC):
```sql
create table if not exists public.project_members (
  id uuid primary key default gen_random_uuid(),
  project_id text references public.marketing_projects(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text default 'editor' not null check (role in ('owner', 'editor', 'viewer')),
  invited_by uuid references auth.users(id) on delete set null,
  joined_at timestamptz default now() not null,
  unique (project_id, user_id)
);
```

---

### 3. Row-Level Security (RLS) Policies

All tables have RLS enabled via `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`.

#### 3.1 Profiles RLS
- **Select**: Users can read only their own profile:
  ```sql
  create policy "Users can view their own profile"
    on public.profiles for select
    using (auth.uid() = id);
  ```
- **Update**: Users can modify only their own profile:
  ```sql
  create policy "Users can update their own profile"
    on public.profiles for update
    using (auth.uid() = id);
  ```

#### 3.2 Marketing Projects RLS
- **Select**: Users can read their own projects or projects where they are listed in `project_members`:
  ```sql
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
  ```
- **Insert**: Users can create projects only under their own `auth.uid()`:
  ```sql
  create policy "Users can create their own marketing projects"
    on public.marketing_projects for insert
    with check (auth.uid() = user_id);
  ```
- **Update**: Users can update projects they own or where they have `owner` or `editor` roles:
  ```sql
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
  ```
- **Delete**: Only the project creator/owner can delete a project:
  ```sql
  create policy "Users can delete only their own projects"
    on public.marketing_projects for delete
    using (auth.uid() = user_id);
  ```

---

### 4. Automated User Onboarding Trigger

When a user registers via Supabase Auth, a PostgreSQL trigger automatically initializes their profile and preference records:

```sql
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

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

