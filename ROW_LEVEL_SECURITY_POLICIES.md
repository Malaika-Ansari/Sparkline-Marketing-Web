# Sparkline Marketing Intelligence Platform
## Row-Level Security (RLS) & Access Control Specification
**Phase: Prompt 22 of 25 — Database Architecture, Permissions & Advanced Security**

---

### 1. Security Architecture Principles

In Sparkline Marketing, frontend route protection is merely a user experience convenience. Real multi-tenant data isolation is enforced at the database engine level via PostgreSQL Row-Level Security (RLS).

1. **Deny by Default**: With RLS enabled, any query that does not match an explicit permissive policy returns zero rows (or an error for writes).
2. **Cryptographic Identity Anchor**: All policies bind to `auth.uid()`, the cryptographically verified user ID embedded in the JWT by Supabase Auth.
3. **Non-Recursive Role Resolution**: Access to project-tied records is evaluated using the security definer function `public.has_project_access(project_ref, required_role)`, preventing deep or circular SQL joins.

---

### 2. Security Helper Function Specification

```sql
create or replace function public.has_project_access(project_ref text, required_role text default 'viewer')
returns boolean as $$
begin
  if auth.uid() is null then
    return false;
  end if;

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
```

---

### 3. Comprehensive Policy Catalog

#### 3.1 User Identity & Preferences Policies
| Table | Operation | Policy Name | Enforcement Logic |
| :--- | :--- | :--- | :--- |
| **`public.profiles`** | `SELECT` | `Users can view own profile` | `auth.uid() = id` |
| **`public.profiles`** | `UPDATE` | `Users can update own profile` | `auth.uid() = id` |
| **`public.profiles`** | `INSERT` | `Users can insert own profile` | `auth.uid() = id` (with check) |
| **`public.user_preferences`** | `SELECT` | `Users can view own preferences` | `auth.uid() = user_id` |
| **`public.user_preferences`** | `UPDATE` | `Users can update own preferences` | `auth.uid() = user_id` |
| **`public.user_preferences`** | `INSERT` | `Users can insert own preferences` | `auth.uid() = user_id` (with check) |

#### 3.2 Projects & Workspace Policies
| Table | Operation | Policy Name | Enforcement Logic |
| :--- | :--- | :--- | :--- |
| **`public.marketing_projects`** | `SELECT` | `Users view own or member projects` | `auth.uid() = user_id OR exists in project_members` |
| **`public.marketing_projects`** | `INSERT` | `Users can insert own projects` | `auth.uid() = user_id` (prevents forging ownership) |
| **`public.marketing_projects`** | `UPDATE` | `Users update own or editable projects`| `auth.uid() = user_id OR member role in ('owner', 'editor')` |
| **`public.marketing_projects`** | `DELETE` | `Only project owners can delete` | `auth.uid() = user_id` (collaborators cannot delete) |
| **`public.project_members`** | `SELECT` | `Users view members of accessible projects` | `has_project_access(project_id, 'viewer')` |
| **`public.project_members`** | `ALL` | `Project owners can manage members` | `exists in marketing_projects where user_id = auth.uid()` |

#### 3.3 Project-Tied Child Module Policies
For all child tables (`business_profiles`, `products_services`, `target_audiences`, `customer_personas`, `market_research`, `research_sources`, `competitors`, `swot_pestle_analyses`, `marketing_strategies`, `strategy_recommendations`, `marketing_budgets`, `budget_allocations`, `marketing_metrics`, `forecast_scenarios`, `advertising_campaigns`, `campaign_performance`, `social_media_posts`, `content_calendars`, `seo_audits`, `seo_keywords`, `marketing_tasks`, `reports`):

1. **`SELECT` Policy**:
   ```sql
   CREATE POLICY "Project members view [module]"
     ON public.[table] FOR SELECT
     USING (public.has_project_access(project_id, 'viewer'));
   ```
2. **`INSERT / UPDATE / DELETE` Policy**:
   ```sql
   CREATE POLICY "Project editors modify [module]"
     ON public.[table] FOR ALL
     USING (public.has_project_access(project_id, 'editor'));
   ```

#### 3.4 Sensitive & Append-Only Tables
| Table | Operation | Policy | Enforcement Logic |
| :--- | :--- | :--- | :--- |
| **`public.report_exports`** | `SELECT` | `Users view own report exports` | `auth.uid() = user_id AND has_project_access(project_id, 'viewer')` |
| **`public.report_exports`** | `INSERT` | `Users insert own report exports` | `auth.uid() = user_id AND has_project_access(project_id, 'viewer')` |
| **`public.user_integrations`** | `ALL` | `Users manage own integrations` | `auth.uid() = user_id` |
| **`public.notifications`** | `ALL` | `Users manage own notifications` | `auth.uid() = user_id` |
| **`public.audit_logs`** | `SELECT` | `Users read own audit logs` | `auth.uid() = user_id` |
| **`public.audit_logs`** | `INSERT` | `Users insert own audit events` | `auth.uid() = user_id` (append-only; updates forbidden) |
| **`public.exchange_rate_history`**| `SELECT` | `Authenticated users read exchange rates` | `auth.uid() is not null` (updates forbidden) |

---

### 4. Cross-Tenant Isolation Verification

Access control was tested with two distinct test actors:

- **Actor A**: `alex.morgan@sparkline.ai` (`usr-alex-morgan`)
- **Actor B**: `sarah.jenkins@athleticedge.com` (`usr-sarah-jenkins`)

#### Verified Test Outcomes:
1. **Direct Query Isolation**: When Actor A queries `SELECT * FROM public.marketing_projects`, zero records belonging to Actor B are returned.
2. **Unauthorized Mutation Block**: When Actor A sends an update with `id = 'proj-b1'`, the query affects 0 rows, preventing silent cross-tenant modifications.
3. **Direct Injection Defense**: When an attacker attempts to supply `user_id = 'usr-victim'`, the RLS `WITH CHECK (auth.uid() = user_id)` policy immediately aborts the insert with an authorization fault.

