# Sparkline Marketing Intelligence Platform
## Authentication & Workspace Setup Guide
**Phase: Prompt 21 of 25 — User Authentication & Project Management**

---

### 1. Introduction

This guide walks administrators, engineers, and self-hosted users through configuring authentication for the Sparkline Marketing Intelligence Platform. The platform runs out of the box in **Local Isolated Vault Mode** with zero configuration required, and supports seamless migration to **Cloud Supabase Auth**.

---

### 2. Mode 1: Instant Local Vault Mode (Zero Setup)

The default operating mode runs entirely inside the client browser:
- **No external cloud dependencies required.**
- **Instant testing with Pre-Configured Demo Account**:
  - **Email**: `alex.morgan@sparkline.ai`
  - **Password**: `Password123!`
  - **Full Name**: Alex Morgan
  - **Organization**: Sparkline Growth Labs
  - **Role**: VP of Growth & Strategy
- **One-Click Quick Login**: On the `/login` screen, click the **"Fill Demo Account"** button to auto-fill credentials.
- **Account Registration**: Create unlimited custom user accounts via `/signup`. All accounts are encrypted locally via Web Crypto API SHA-256 with isolated unique salts.
- **Password Recovery**: Request password reset on `/forgot-password`. In Local Vault mode, a secure token is immediately displayed with a copy button and a direct reset link.

---

### 3. Mode 2: Cloud Supabase Auth Setup

To connect to a production Supabase project:

#### Step 1: Create Supabase Project
1. Navigate to [https://supabase.com](https://supabase.com) and create a new project.
2. Note your **Project URL** and **Anon API Key** from **Project Settings > API**.

#### Step 2: Configure Environment Variables
Create or edit `.env` in the root of the project:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

#### Step 3: Run Database Migrations
1. In the Supabase Dashboard, open the **SQL Editor**.
2. Open `supabase/migrations/20261114_auth_and_projects.sql` from the Sparkline codebase.
3. Paste and run the entire script. This provisions:
   - `public.profiles`
   - `public.user_preferences`
   - `public.marketing_projects`
   - `public.project_members`
   - Row-Level Security (RLS) policies
   - Automated `on_auth_user_created` trigger

#### Step 4: Configure Email Templates & Site URL
1. In Supabase Dashboard, go to **Authentication > URL Configuration**.
2. Set **Site URL** to your frontend URL (e.g., `http://localhost:5173` or your production domain).
3. Under **Redirect URLs**, add:
   - `http://localhost:5173/verify-email`
   - `http://localhost:5173/reset-password`
   - `http://localhost:5173/dashboard`

---

### 4. Optional: Google Social Authentication Setup

If you wish to enable Google Social Sign-In:

1. **Google Cloud Console**:
   - Go to [Google Cloud Console > Credentials](https://console.cloud.google.com/apis/credentials).
   - Create an **OAuth 2.0 Client ID** (Web Application).
   - Add Authorized Redirect URI: `https://<your-supabase-project-id>.supabase.co/auth/v1/callback`.
   - Copy the Client ID and Client Secret.
2. **Supabase Dashboard**:
   - Navigate to **Authentication > Providers > Google**.
   - Enable the Google provider, paste the Client ID and Client Secret, and save.
3. **Frontend Experience**:
   - When Google OAuth is enabled in Supabase, the Google login button initiates the OAuth redirect.
   - When unconfigured, the UI transparently informs the user that cloud OAuth setup is required, never pretending an unconfigured service is operational.

---

### 5. Verification Checklist

| Test Case | Expected Behavior | Status |
| :--- | :--- | :--- |
| **Protected Route Redirection** | Navigating to `/dashboard` while signed out redirects to `/login`. | Verified |
| **Public Route Protection** | Navigating to `/login` while signed in redirects to `/dashboard`. | Verified |
| **Demo Login** | Logging in with demo credentials unlocks the dashboard with greeting. | Verified |
| **Sign Up Flow** | Registering a new account hashes the password and creates a clean profile. | Verified |
| **Profile Update** | Modifying preferred currency in `/dashboard/settings/account` updates the session. | Verified |
| **Password Change** | Changing password verifies the old password before applying the new hash. | Verified |
| **Project Duplication** | Duplicating a project preserves all nested products, competitors, and strategies. | Verified |
| **Defensive Delete** | Delete button remains disabled until typing the exact project brand name. | Verified |
| **Sign Out** | Invalidate session tokens and redirect to `/login`. | Verified |

