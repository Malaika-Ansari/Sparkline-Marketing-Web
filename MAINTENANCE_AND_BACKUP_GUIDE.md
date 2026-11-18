# Sparkline Marketing — Maintenance & Backup Guide

## 1. Executive Summary
This document establishes the ongoing operational maintenance, database backup procedures, disaster recovery runbooks, and credential rotation policies for **Sparkline Marketing**.

---

## 2. Disaster Recovery Metrics & SLA Targets

* **Recovery Point Objective (RPO)**: $\le 1\text{ hour}$ (Maximum allowable data loss during catastrophic outage)
* **Recovery Time Objective (RTO)**: $\le 2\text{ hours}$ (Maximum allowable system restoration timeline)
* **High Availability Target**: 99.9% uptime for core analytics and reporting services

---

## 3. Database Backup Procedures (Supabase PostgreSQL)

### A. Automated Managed Backups
* In Supabase Pro / Team tiers, automated daily logical and physical snapshots are executed and archived in geo-redundant storage with a 7 to 30-day retention window.
* Point-in-Time Recovery (PITR) enables restoring the database state to any specific second within the retention window.

### B. Manual Backup Runbook (CLI `pg_dump`)
To create an offline cold backup snapshot:
```bash
# Export complete schema and data excluding system internal tables
pg_dump -h db.<PROJECT_ID>.supabase.co \
        -U postgres \
        -d postgres \
        -F c \
        -b \
        -v \
        -f "sparkline_backup_$(date +%Y%m%d_%H%M%S).dump"
```

### C. Database Restoration Procedure
To restore from a snapshot file into a new or recovered instance:
```bash
pg_restore -h db.<NEW_PROJECT_ID>.supabase.co \
           -U postgres \
           -d postgres \
           -v \
           --clean \
           --no-owner \
           "sparkline_backup_<TIMESTAMP>.dump"
```

---

## 4. Local Vault Backup & Data Portability

For users operating in zero-configuration or offline mode:
* **1-Click GDPR User Archive**: In **Account Settings &rarr; Data Privacy & Export**, users can click **Export Account Data (JSON)** to download a complete cryptographic archive of all business models, competitors, strategies, budgets, campaigns, posts, SEO keywords, and reports.
* **Import / Restore**: The JSON archive can be re-imported into any browser running Sparkline Marketing to instantly restore project state.

---

## 5. Credential & Secret Rotation Policy

| Secret / Credential | Rotation Cadence | Procedure |
| :--- | :--- | :--- |
| **GEMINI_API_KEY** | Every 90 days | Generate new key in Google AI Studio; update environment variable in Vercel / Cloud Run; verify `/api/ai-status`; revoke old key. |
| **SUPABASE_SERVICE_ROLE_KEY** | Every 180 days | Rotate in Supabase Project Settings &rarr; API; update backend environment variables. |
| **TOKEN_ENCRYPTION_SECRET** | Annual | Re-encrypt existing tokens using dual-key migration script before retiring previous master secret. |
| **OAuth Client Secrets** | Annual or on breach | Rotate in Meta, Google, TikTok, or LinkedIn developer consoles; update hosting environment variables. |

---

## 6. Routine Operational Maintenance

### Weekly Maintenance Checklist:
1. Review error logs in Vercel / Cloud Run dashboard for 4xx or 5xx spikes.
2. Monitor database connection pool usage in Supabase dashboard.
3. Review audit logs (`/dashboard/settings/account`) for anomalous authentication failures or rate limit triggers.

### Monthly Maintenance Checklist:
1. Run `npm test` to verify zero regression in calculation services.
2. Inspect Google Search Console for crawl errors or indexing anomalies.
3. Review dependency security advisories (`npm audit`).

