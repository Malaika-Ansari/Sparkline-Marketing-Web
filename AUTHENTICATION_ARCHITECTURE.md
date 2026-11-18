# Sparkline Marketing Intelligence Platform
## Authentication & Identity Architecture
**Phase: Prompt 21 of 25 — User Authentication & Project Management**

---

### 1. Executive Summary

The Sparkline Marketing Intelligence Platform implements an enterprise-grade, resilient dual-provider authentication architecture. Designed for both cloud-native deployments and zero-setup local workstation execution, the platform guarantees seamless data sovereignty, cryptographic security, and multi-tenant project isolation.

```
                      +-----------------------------------+
                      |         User Interface            |
                      |   /login, /signup, /reset, etc.   |
                      +-----------------+-----------------+
                                        |
                                        v
                      +-----------------+-----------------+
                      |          AuthContext              |
                      |  useAuth() Hook & Route Guards    |
                      +-----------------+-----------------+
                                        |
                                        v
                      +-----------------+-----------------+
                      |        AuthService Core           |
                      |   Provider Resolution & Hashing   |
                      +--------+-----------------+--------+
                               |                 |
            [VITE_SUPABASE_URL |                 | [Default / Offline]
             configured]       v                 v
                 +-------------+--+   +----------+-------------+
                 |  Cloud Supabase|   | Sparkline Local Vault   |
                 |  Auth REST API |   | Web Crypto API (SHA-256)|
                 +----------------+   +-------------------------+
```

---

### 2. Dual-Provider Architecture

The platform dynamically resolves the active authentication provider at runtime without code changes:

| Feature / Dimension | Cloud Supabase Auth | Sparkline Local Vault Provider |
| :--- | :--- | :--- |
| **Activation Trigger** | `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` present in environment. | Default fallback when environment keys are unconfigured or offline. |
| **User Persistence** | Remote PostgreSQL database in `auth.users` and `public.profiles`. | Browser sandboxed `localStorage` with AES/SHA cryptographically secured structures. |
| **Password Cryptography** | Cloud bcrypt / Argon2 managed by Supabase Auth engine. | Client-side Web Crypto API `crypto.subtle.digest('SHA-256')` with unique salt per user. |
| **Session Lifetime** | JWT access tokens (1 hour default) + refresh tokens. | Cryptographically generated session tokens with configurable expiration (7 days). |
| **Offline Capability** | Requires internet connectivity. | 100% offline and air-gapped capable. |
| **Data Isolation** | PostgreSQL Row-Level Security (RLS) enforcement. | Tenant isolation keyed by authenticated `userId`. |

---

### 3. Client-Side Cryptographic Vault

When operating in Local Vault mode, security is enforced through native browser cryptography:

1. **Password Salting & Hashing**:
   - Each account is generated with a unique 32-character hexadecimal salt (`sparkline_salt_<timestamp>_<random>`).
   - The password hash is generated via `SHA-256` using the formula:
     $$\text{Hash} = \text{SHA-256}(\text{salt} \parallel \text{password} \parallel \text{salt})$$
   - Plaintext passwords are never saved in storage or state.
2. **Session Persistence**:
   - When **Remember Me** is checked, the active session is persisted to `localStorage`.
   - When **Remember Me** is unchecked, the session is stored strictly in `sessionStorage` and cleared upon browser tab closure.
   - Sessions expire deterministically after 7 days (`expiresAt` timestamp in UNIX seconds).
3. **Password Recovery**:
   - Reset requests generate single-use 64-character reset tokens with a 15-minute expiration.
   - Tokens can be redeemed on `/reset-password?token=...` to update the password hash.

---

### 4. Route Protection Architecture

Route guarding is enforced by two dedicated React Router wrapper components:

- **`ProtectedRoute`** (`src/components/auth/ProtectedRoute.tsx`):
  - Wraps `/dashboard/*` routes and child management consoles.
  - Checks `isAuthenticated` and session validity.
  - Redirects unauthenticated traffic to `/login` with `from` location state for seamless post-login redirection.
- **`PublicOnlyRoute`** (`src/components/auth/PublicOnlyRoute.tsx`):
  - Wraps authentication screens (`/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-email`).
  - Automatically redirects already-authenticated users to `/dashboard` to avoid redundant login prompts.

---

### 5. Multi-Tenant Project Isolation

Every marketing workspace project in the platform (`MarketingProject`) is associated with a `userId`:

```typescript
export interface MarketingProject {
  id: string;
  userId?: string; // Foreign key binding to authenticated UserProfile
  business: BusinessProfile;
  products: ProductService[];
  competitors: Competitor[];
  marketPosition: MarketPosition;
  marketing: MarketingParameters;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}
```

- When `projectService.getProjects(userId)` is invoked, projects are filtered to return only workspaces owned by or shared with the authenticated user.
- If a guest or demo user creates a project, it is automatically claimed by the active authenticated session.
- Project duplication and deletion verify ownership boundaries before state commits.

