# Sparkline Marketing Intelligence Platform
## User Profile & Account Settings Guide
**Phase: Prompt 21 of 25 — User Authentication & Project Management**

---

### 1. Overview

The User Profile Management module (`/dashboard/settings/account`) provides users with granular control over their corporate identity, account credentials, localization parameters, and preferred financial currency standards.

All profile updates are immediately reflected across the entire platform, including dashboard greetings, PDF report dossiers, budget calculations, and currency conversion tables.

---

### 2. Profile Attributes

| Field Name | Description | Default Value | Validation & Format |
| :--- | :--- | :--- | :--- |
| **Full Name** | Personal identity displayed in headers and reports. | Alex Morgan | Required, trimmed string. |
| **Email Address** | Primary account identifier and login credential. | Bound to Auth Provider | Read-only in settings; modified via auth workflows. |
| **Company / Organization** | Brand or agency name representing the workspace. | Sparkline Growth Labs | Freeform string, e.g. "Athletic Edge Ltd." |
| **Job Title** | Corporate function (e.g., VP of Marketing, Founder). | VP of Growth & Strategy | Freeform string. |
| **Country** | Geographic jurisdiction for tax and market research. | United States | Selection from curated global list. |
| **Preferred Language** | Language for system copy, emails, and exports. | English (United States) | English, Spanish, German, French, Urdu. |
| **Preferred Currency** | Default financial standard for budgets and calculations. | USD ($) | USD, EUR, GBP, CAD, AUD, JPY, PKR, INR, AED, SAR, SGD. |
| **Time Zone** | Operational reference for campaign flight scheduling. | America/New_York (EST) | Standard IANA time zone strings. |
| **Avatar / Initials** | Visual representation in header menus and comments. | Auto-derived initials | Two-letter initials or uploaded image URL. |

---

### 3. Dynamic Currency Synchronization

When a user changes their `preferredCurrency` in Account Settings:
1. The profile is updated in `auth.service.ts` and propagated via `AuthContext`.
2. Existing budget plans and ad spend allocations remain preserved in their native currencies, but all comparative summaries and report outputs automatically adopt the user's preferred currency standard.
3. The Multi-Currency Converter (`/dashboard/currency`) defaults to the user's active preference.

---

### 4. Password Security & Credential Updates

The Account Settings workspace provides a hardened credential update workflow:
- **Current Password Verification**: Ensures that unauthorized individuals cannot change credentials on an unattended device.
- **Minimum Complexity Enforcement**: New passwords must meet or exceed 8 characters in length.
- **Confirmation Verification**: Protects against typographical errors.
- **Cryptographic Re-Hashing**: Generates a fresh salt and SHA-256 hash in the Local Vault (or delegates to Cloud Supabase Auth).
- **Security Event Notification**: Displays instant feedback toasts upon successful credential rotation.

---

### 5. Account Lifecycle & Sign-Out

- **Session Invalidation**: Clicking "Sign Out" invokes `signOut()` on `AuthService`, clearing tokens from both `localStorage` and `sessionStorage`.
- **Navigation Safety**: Following sign-out, the user is redirected to `/login` with an informational toast.
- **Data Protection**: Local user data is preserved in tenant storage until explicitly purged or overridden.

