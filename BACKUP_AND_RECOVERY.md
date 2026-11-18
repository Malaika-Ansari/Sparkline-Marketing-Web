# Sparkline Marketing Intelligence Platform
## Database Backup, Disaster Recovery & Data Retention Policies
**Phase: Prompt 22 of 25 — Database Architecture, Permissions & Advanced Security**

---

### 1. Overview & Disaster Recovery Objectives

The Sparkline Marketing platform safeguards business-critical marketing plans, financial allocations, historical exchange rates, and executive reports.

This document details the operational standards, recovery point objectives (RPO), recovery time objectives (RTO), and safe rollback strategies across both **Cloud Supabase Deployments** and **Local Workstation Vault Deployments**.

---

### 2. Service Level Objectives

| Metric | Cloud Supabase Production | Local Isolated Vault |
| :--- | :--- | :--- |
| **Recovery Point Objective (RPO)** | $\le$ 24 hours (Automated daily snapshots) or $\le$ 2 minutes (with PITR) | User-initiated JSON snapshot on demand |
| **Recovery Time Objective (RTO)** | $\le$ 1 hour | Immediate (file restore via browser storage) |
| **Retention Window** | 30 days rolling snapshots | Indefinite until browser local storage cleared |

---

### 3. Backup Procedures

#### 3.1 Cloud Supabase Production Backups
1. **Automated Daily Physical Backups**:
   - Supabase executes automated daily physical database dumps (`pg_dump`) of the PostgreSQL instance.
   - Backups are encrypted at rest with AES-256 and replicated across multi-region availability zones.
2. **Point-in-Time Recovery (PITR)** (Supabase Pro/Enterprise):
   - Continuous Write-Ahead Logging (WAL) archiving allows database restoration to any specific second within the last 7 to 30 days.
3. **Manual CLI Database Dump**:
   To generate an off-site architectural snapshot before major migrations:
   ```bash
   # Export schema only
   supabase db dump --schema public > backup_schema_$(date +%F).sql

   # Export full database with data
   supabase db dump --data-only > backup_data_$(date +%F).sql
   ```

#### 3.2 Local Vault Backup & Data Portability
Users operating in Local Vault Mode can export a complete cryptographic snapshot at any time:
1. Navigate to `/dashboard/settings/account`.
2. Click **"Export All Data (JSON)"**.
3. A portable, machine-readable JSON archive (`sparkline-user-data-export-<userId>-<date>.json`) is generated and downloaded containing all configured brands, products, competitors, strategies, budgets, campaigns, and audit history.

---

### 4. Migration Rollback Strategy

Before running any SQL migration in production:
1. **Pre-Migration Safety Check**: Verify database snapshot exists.
2. **Transactional Migrations**: All DDL and DML operations must execute within an explicit transaction block (`BEGIN; ... COMMIT;`):
   ```sql
   BEGIN;
   -- Execute migration statements
   COMMIT;
   ```
   If any statement fails, PostgreSQL automatically rolls back the entire transaction, leaving the database in its previous valid state.
3. **Rollback Script Preservation**: Every forward migration (`20261114_advanced_database_and_security.sql`) maintains a documented rollback procedure.

---

### 5. Data Retention & Secure Deletion Policy

#### 5.1 Account Deletion & GDPR Compliance
When a user triggers **"Delete Account"** (`securityService.purgeUserAccount()`):
1. The user must explicitly type the confirmation string `DELETE MY ACCOUNT`.
2. A final immutable event `account.deletion_requested` is recorded in `audit_logs` before deletion.
3. All owned projects and associated records (`business_profiles`, `products_services`, `marketing_budgets`, `reports`, etc.) are purged via cascading delete (`ON DELETE CASCADE`).
4. Session storage and access tokens are immediately invalidated.

#### 5.2 Legal & Operational Retention Exceptions
In accordance with international privacy laws:
- Operational security audit logs (`audit_logs`) and historical financial exchange rates (`exchange_rate_history`) are retained in anonymized, pseudonymous form to satisfy regulatory compliance, prevent financial fraud, and maintain platform security integrity.
- In audit logs, `user_id` is set to `NULL` via `ON DELETE SET NULL`, stripping personal identifiers while preserving the security event timeline.

