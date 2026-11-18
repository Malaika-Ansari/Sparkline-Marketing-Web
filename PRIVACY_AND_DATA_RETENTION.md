# Sparkline Marketing Intelligence Platform
## Privacy Policy, Data Governance & User Data Controls
**Phase: Prompt 22 of 25 — Database Architecture, Permissions & Advanced Security**

---

### 1. Privacy Framework & Data Sovereignty

Sparkline Marketing is built on strict data sovereignty principles:
1. **Zero Model Training**: Customer marketing plans, product parameters, competitive secrets, and financial metrics are **never** used to train AI models (including Google Gemini).
2. **Client-Side Data Isolation**: In default Local Vault mode, data remains strictly isolated in the user's browser local storage.
3. **Database Tenant Isolation**: In cloud mode, PostgreSQL Row-Level Security (RLS) ensures that no organization or user can query another tenant's records.

---

### 2. User Data Controls & Privacy Rights

Under GDPR (Articles 15–20), CCPA/CPRA, and global data privacy standards, users maintain complete sovereignty over their data:

```
+-----------------------------------------------------------------------------------+
| User Privacy Rights Matrix                                                        |
+-----------------------------------------------------------------------------------+
| 1. Right to Access (Art. 15)       | Inspect profile at /dashboard/settings/account|
| 2. Right to Rectification (Art. 16)| Modify corporate profile, currency & timezone|
| 3. Right to Erasure (Art. 17)      | Permanent Account Deletion with cascade purge|
| 4. Right to Restriction (Art. 18)  | Archive projects to cold storage             |
| 5. Right to Portability (Art. 20)  | 1-Click JSON export of complete account data |
| 6. Right to Revoke Consent         | Disconnect third-party platform integrations |
+-----------------------------------------------------------------------------------+
```

---

### 3. Step-by-Step Data Control Procedures

#### 3.1 Exporting Account & Workspace Data
1. Navigate to `/dashboard/settings/account`.
2. Locate the **"Data Sovereignty & Portability"** section.
3. Click **"Export All Data (JSON)"**.
4. The system compiles all marketing projects, product portfolios, competitor profiles, AI action plans, budget allocations, ad campaigns, SEO audits, reports, and security audit logs into a single structured file:
   `sparkline-user-data-export-<userId>-<YYYY-MM-DD>.json`.

#### 3.2 Permanent Account Deletion
1. In `/dashboard/settings/account`, scroll to the **"Danger Zone: Account Deletion"** panel.
2. Click **"Delete Account"**.
3. In the security modal, type `DELETE MY ACCOUNT` into the verification field.
4. Clicking **"Permanently Delete Account"** will:
   - Log an audit trail entry `account.deletion_requested`.
   - Cascade delete all marketing projects owned by the user.
   - Purge private report files and generated export artifacts.
   - Wipe active session tokens from both `localStorage` and `sessionStorage`.
   - Redirect the user out of the application.

#### 3.3 Disconnecting Integrations
When an integration (e.g. Google Analytics or Meta Ads) is disconnected:
- The access token is revoked with the third-party OAuth provider.
- The stored encrypted token is deleted from `public.user_integrations`.
- Future automated synchronization is blocked immediately.

---

### 4. Data Retention Disclosures

In accordance with statutory and operational integrity obligations, the following minimal data is retained:

| Data Category | Retention Period | Justification / Legal Basis | Anonymization Technique |
| :--- | :--- | :--- | :--- |
| **Security Audit Logs** | 12 months | Security monitoring, abuse prevention, fraud detection. | `user_id` set to `NULL` via `ON DELETE SET NULL`. |
| **Historical Exchange Rates** | Indefinite | Financial audit accuracy, multi-currency conversion integrity. | Contains zero personal data; institutional rate pairs only. |
| **Active Marketing Projects** | Lifetime of account | Operational workspace delivery. | Purged immediately upon account deletion. |
| **Authentication Session Tokens**| 7 days (or tab close) | User session verification. | Invalidate on logout or expiry. |

