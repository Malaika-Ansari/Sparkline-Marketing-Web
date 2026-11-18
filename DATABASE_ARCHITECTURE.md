# Sparkline Marketing Intelligence Platform
## Complete Relational Database Architecture
**Phase: Prompt 22 of 25 — Database Architecture, Permissions & Advanced Security**

---

### 1. Executive Summary

The Sparkline Marketing Intelligence Platform features an enterprise-grade relational database architecture implemented for PostgreSQL 15+ and Supabase. The schema unifies **32 normalized relational tables** supporting all 22 phases of marketing intelligence, campaign automation, budget allocation, econometric forecasting, executive reporting, and security audit logging.

Every private record maintains a strict foreign key relationship terminating at either a `project_id` or a `user_id`, guaranteeing mathematical tenant isolation through database-level Row-Level Security (RLS).

---

### 2. High-Level Entity Relationship Architecture

```
                                  +-----------------------+
                                  |      auth.users       |
                                  +-----------+-----------+
                                              |
                   +--------------------------+--------------------------+
                   | 1:1                                                 | 1:N
                   v                                                     v
        +---------------------+                               +---------------------+
        |   public.profiles   |                               |  marketing_projects |
        +----------+----------+                               +----------+----------+
                   | 1:1                                                 |
                   v                                      +--------------+--------------+
        +---------------------+                           | 1:N                         | 1:N
        |   user_preferences  |                           v                             v
        +---------------------+                 +-------------------+         +-------------------+
                                                | business_profiles |         | products_services |
                                                +-------------------+         +-------------------+
                                                          |                             |
                                        +-----------------+-------------------+         |
                                        |                                     |         |
                                        v                                     v         v
                              +--------------------+               +--------------------+
                              |  market_research   |               |  target_audiences  |
                              +---------+----------+               +--------------------+
                                        |
                                        v
                              +--------------------+
                              |  research_sources  | (Preserves Provenance & Evidence)
                              +--------------------+
                                        |
       +--------------------------------+--------------------------------+
       |                                |                                |
       v                                v                                v
+----------------------+      +----------------------+      +----------------------+
| marketing_strategies |      |  marketing_budgets   |      | advertising_campaigns|
+----------+-----------+      +----------+-----------+      +----------+-----------+
       | 1:N                         | 1:N                         | 1:N
       v                             v                             v
+----------------------+      +----------------------+      +----------------------+
|strategy_recs         |      |  budget_allocations  |      | campaign_performance |
+----------------------+      +----------------------+      +----------------------+
                                                                   |
                                                                   v
                                                            +----------------------+
                                                            |  social_media_posts  |
                                                            +----------+-----------+
                                                                   | 1:1
                                                                   v
                                                            +----------------------+
                                                            |  content_calendars   |
                                                            +----------------------+
```

---

### 3. Detailed Relational Schema Catalog

#### 3.1 User & Identity Foundation
1. **`public.profiles`**: Extended user identity linked 1:1 to `auth.users(id)`. Stores corporate title, company name, country, localization settings, and default currency.
2. **`public.user_preferences`**: UI themes (`light`, `dark`, `system`), notification toggles, and compact table layout switches.
3. **`public.user_integrations`**: Connected advertising and analytics platforms (`google_analytics`, `meta_ads`). All access tokens are encrypted at rest and never exposed to the frontend.
4. **`public.notifications`**: In-app notifications with read/unread tracking and direct application links.

#### 3.2 Workspace & Multi-Tenant Access Control
5. **`public.marketing_projects`**: Core workspace container. Holds brand metadata, industry classification, lifecycle status (`Draft`, `In Strategy`, `Active Flight`, `Archived`), and project ownership (`user_id`).
6. **`public.project_members`**: Multi-user collaboration with role-based access control (`owner`, `editor`, `viewer`).

#### 3.3 Strategic Intelligence & Market Research
7. **`public.business_profiles`**: Core business identity, mission statement, value propositions, and geographical boundaries.
8. **`public.products_services`**: Product catalog items with unit selling price, cost of goods, currency, target customer persona, and unique selling proposition (USP).
9. **`public.target_audiences`**: Demographic boundaries, pain points, buyer motivations, and preferred marketing channels.
10. **`public.customer_personas`**: Psychographic profiles, objections, and buying trigger taxonomies.
11. **`public.market_research`**: Addressable market sizing (TAM, SAM, SOM), CAGR projections, market drivers, and barriers.
12. **`public.research_sources`**: External evidence citations preserving publication year, source URLs, confidence ratings, and provenance classifications.
13. **`public.competitors`**: Competitor profiles, competitive threat ratings, pricing tiers, and differentiation matrices.
14. **`public.swot_pestle_analyses`**: Internal strengths/weaknesses and macro-environmental external forces.

#### 3.4 Planning, Budgeting & Financial Modeling
15. **`public.marketing_strategies`**: Multi-channel marketing strategies with overall readiness scores and execution roadmaps.
16. **`public.strategy_recommendations`**: Prioritized action items scored by impact (1–10), effort (1–10), and strategic priority.
17. **`public.marketing_budgets`**: Monthly and quarterly marketing budgets preserving native currency and allocation status.
18. **`public.budget_allocations`**: Channel-level spend allocations, percentage balances, and fixed vs. variable cost classifications.
19. **`public.currency_conversions`**: Cached user currency conversions and calculation parameters.
20. **`public.exchange_rate_history`**: **Immutable append-only ledger** recording ECB/Frankfurter institutional exchange rates with historical timestamps.
21. **`public.marketing_metrics`**: Calculation snapshots for CAC, ROAS, LTV, CPA, CTR, and CVR.
22. **`public.forecast_scenarios`**: 3-scenario performance simulations (Conservative, Balanced, Optimistic) and break-even points.

#### 3.5 Execution, Content & Organic Search
23. **`public.advertising_campaigns`**: Paid media flights across Google, Meta, TikTok, LinkedIn, YouTube, and Pinterest with daily/total budgets and target messaging angles.
24. **`public.campaign_performance`**: Actual ad flight telemetry (spend, impressions, clicks, conversions, attributed revenue).
25. **`public.social_media_posts`**: Content creation studio records with opening hooks, captions, CTAs, and platform specs.
26. **`public.content_calendars`**: Scheduled publishing dates, time slots, and publishing status.
27. **`public.seo_audits`**: Technical crawl checklists, meta tag audits, Core Web Vitals status, and prioritized audit findings.
28. **`public.seo_keywords`**: Search keyword targets, intent classifications, difficulty scores, and topic cluster groupings.
29. **`public.marketing_tasks`**: Execution tasks, milestones, assignees, and deadlines.

#### 3.6 Executive Reporting & Governance
30. **`public.reports`**: Generated executive report dossiers with immutable template structures, modular section configs, and data provenance tags.
31. **`public.report_exports`**: Immutable export audit trail logging PDF/CSV downloads, file names, and byte sizes.
32. **`public.audit_logs`**: **Append-only security audit ledger** tracking all authentication, authorization, and project events with zero credential leakage.

---

### 4. Integrity Constraints & Referential Safety

- **Primary Keys**: Every table defines an explicit `PRIMARY KEY` (UUID or deterministic ID string).
- **Foreign Key Cascades**:
  - `ON DELETE CASCADE` is applied to child workspace records when a project is deleted.
  - `ON DELETE SET NULL` is applied to assignees and audit user references so operational history is not destroyed if a user account is removed.
- **Check Constraints**:
  - `price >= 0`, `cost >= 0`, `total_budget >= 0`, `daily_budget >= 0` to prevent negative spend corrupting calculation formulas.
  - Percentage fields enforce `percentage >= 0 AND percentage <= 100`.
  - Enum-like statuses enforce domain-valid values (e.g. `check (status in ('Draft', 'In Strategy', ...))`).
- **Data Immutability**:
  - `exchange_rate_history` and `audit_logs` are strictly append-only; update policies are denied for all users.

