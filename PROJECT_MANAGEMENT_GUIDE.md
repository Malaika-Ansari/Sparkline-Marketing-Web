# Sparkline Marketing Intelligence Platform
## Project Management Workspace Guide
**Phase: Prompt 21 of 25 — User Authentication & Project Management**

---

### 1. Overview

The Project Management Workspace is the command center for multi-brand and multi-campaign operations in Sparkline Marketing. It organizes brand intelligence, product catalogs, competitor landscapes, AI strategies, budgets, ad campaigns, content calendars, SEO audits, financial forecasts, and executive reports into unified workspace containers.

---

### 2. Projects Hub (`/dashboard/projects`)

The main Projects Hub features:

```
+-----------------------------------------------------------------------------------+
|  Projects Command Center                        [+ New Project]                   |
|  Manage your business workspaces, strategy action plans, and campaign flights.     |
+-----------------------------------------------------------------------------------+
|  [ Total: 4 ]      [ Active: 2 ]       [ In Strategy: 1 ]     [ Archived: 1 ]     |
+-----------------------------------------------------------------------------------+
|  [Search projects...]   [Status: All v]   [Industry: All v]   [Sort: Recent v] [::|#]|
+-----------------------------------------------------------------------------------+
|  +-------------------------------------+   +-------------------------------------+ |
|  | Athletic Edge Pro                   |   | Nimbus Cloud AI                     | |
|  | Fitness & Athletics • Active Flight |   | SaaS / AI • Ready for Strategy      | |
|  | Budget: $15,000 USD/mo              |   | Budget: $25,000 USD/mo              | |
|  | Strategic Readiness: [=======--] 80%|   | Strategic Readiness: [====------] 40%| |
|  | [View Command Center]  [... Actions]|   | [View Command Center]  [... Actions]| |
|  +-------------------------------------+   +-------------------------------------+ |
+-----------------------------------------------------------------------------------+
```

#### Key Capabilities:
- **KPI Metrics Ribbon**: Real-time rollups for Total Projects, Active Flights, In Strategy / Drafts, and Archived Dossiers.
- **Search & Multi-Filter**: Sub-string filtering across brand names, descriptions, industries, and project status codes.
- **View Toggle**: Switch effortlessly between a responsive **Grid View** (rich visual cards with readiness bars) and a **Dense Table View** (data-dense tabular layout with inline actions).
- **Sorting**: Order projects by Last Updated, Creation Date, Brand Name (A-Z), or Monthly Budget.

---

### 3. Real Milestone Progress Calculation

Strategic Readiness is not an arbitrary number; it is dynamically calculated by inspecting actual saved records across all 10 core modules:

$$\text{Readiness \%} = \left( \frac{\sum \text{Completed Modules}}{\text{Total Modules (10)}} \right) \times 100$$

| Module Check | Evaluation Logic | Weight |
| :--- | :--- | :--- |
| **1. Business Foundation** | `project.business.brandName` and `description` defined. | 10% |
| **2. Product Offering** | `project.products.length > 0`. | 10% |
| **3. Market & Competitors** | `project.competitors.length > 0` and market position defined. | 10% |
| **4. AI Strategy Engine** | Strategy record exists in `unifiedStrategyService.getLatestStrategy(id)`. | 10% |
| **5. Budget Allocation** | Balanced budget plan exists in `budgetService.getPlans(id)`. | 10% |
| **6. Ad Campaigns** | Active campaigns exist in `campaignService.getCampaigns()`. | 10% |
| **7. Content Studio** | Content posts exist in `contentService.getPosts(id)`. | 10% |
| **8. SEO Intelligence** | Keyword clusters or audit records exist for project. | 10% |
| **9. ROI Forecasting** | Break-even acquisition forecast modeled. | 10% |
| **10. Executive Reports** | Published report dossier exists in `reportService.getReports()`. | 10% |

---

### 4. Project Details Command Center (`/dashboard/projects/:projectId`)

The dedicated Project Details workspace provides a unified command center organized into 10 structured tabs:

1. **Overview**: Executive summary, quick KPIs, milestone readiness, and direct workspace shortcuts.
2. **Business Profile**: Core identity, industry, mission statement, value proposition, and brand pillars.
3. **Products & Services**: Product catalog items, pricing tiers, margins, and target customer profiles.
4. **Competitors**: Competitive matrix, rival positioning, threat ratings, and differentiation vectors.
5. **Marketing Strategy**: AI-generated action plans, priority matrices, and quarterly execution roadmaps.
6. **Budget Allocation**: Channel distribution, paid media spend, software costs, and currency balances.
7. **Ad Campaigns**: Multi-platform ad flights (Google, Meta, LinkedIn, TikTok) with budget and status tracking.
8. **Content Studio**: Scheduled social media posts, platform formatting, hooks, and publication cadence.
9. **SEO Intelligence**: Search visibility metrics, keyword target clusters, and technical recommendations.
10. **Reports & Exports**: Published executive dossiers with one-click PDF generation and print actions.

---

### 5. Defensive Project Management Actions

- **Duplicate Project**: Creates an exact clone of the project configuration with a customizable name (defaults to `"Copy of [Brand Name]"`).
- **Archive / Restore**: Toggles project between active and archived states without deleting underlying strategy records.
- **Defensive Deletion**: Projects cannot be deleted accidentally. A modal requires the user to explicitly type the exact brand name before deletion is enabled:
  ```
  [Type "Athletic Edge Pro" to confirm permanent deletion]
  [ Cancel ] [ Permanently Delete Project ] (Disabled until exact match)
  ```

