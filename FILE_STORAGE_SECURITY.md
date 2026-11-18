# Sparkline Marketing Intelligence Platform
## File Storage Architecture & Upload Security Policy
**Phase: Prompt 22 of 25 — Database Architecture, Permissions & Advanced Security**

---

### 1. Storage Overview

The Sparkline Marketing platform processes confidential files, including:
- **Executive Marketing Strategy Dossiers** (PDF format)
- **Brand Identity Logos & Badges** (PNG, JPG, SVG, WebP)
- **Campaign Creative Ad Assets** (Images, copy specs)
- **Financial & Performance Data Exports** (CSV tabular spreadsheets)

All user-generated files are treated as **confidential private assets** and are **never publicly accessible by default**.

---

### 2. File Upload Validation Engine

All file uploads are validated before processing using `securityService.validateUploadedFile()`:

```
[Incoming File]
       |
       v
+------------------------------------------+
| 1. Size Verification (< 10MB)            |
+------------------------------------------+
       |
       v
+------------------------------------------+
| 2. Extension Check (No .exe, .sh, .bat)  |
+------------------------------------------+
       |
       v
+------------------------------------------+
| 3. MIME Whitelist (PDF, PNG, JPG, CSV)   |
+------------------------------------------+
       |
       v
+------------------------------------------+
| 4. Path Traversal & Name Sanitization    |
+------------------------------------------+
       |
       v
[Safe File Stored in Private Tenant Bucket]
```

#### 2.1 File Size Boundaries
- **Marketing Reports (PDF)**: 10MB maximum.
- **Brand Logos & Creative Assets**: 5MB maximum.
- **CSV Data Exports**: 5MB maximum.

#### 2.2 MIME Type Whitelist
Only explicitly approved media types are accepted:
- `application/pdf`
- `image/png`
- `image/jpeg`
- `image/webp`
- `image/svg+xml`
- `text/csv`
- `application/json`

#### 2.3 Forbidden Executable Extensions
The following file extensions are unconditionally blocked:
`exe`, `bat`, `cmd`, `sh`, `bin`, `js`, `ts`, `jsx`, `tsx`, `html`, `htm`, `xhtml`, `php`, `phtml`, `py`, `rb`, `jar`, `vbs`, `scr`, `dll`, `so`, `msi`, `com`, `app`.

#### 2.4 Path Traversal Defense
Filenames are stripped of directory path separators and special characters before storage:
```typescript
const rawFileName = file.name.replace(/^.*[\\\/]/, '').replace(/[\\\/]/g, '_');
const parts = rawFileName.split('.');
const ext = parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
const safeExt = ext.replace(/[^a-zA-Z0-9]/g, '');
const rawBaseName = parts.join('.');
const safeBaseName = rawBaseName.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 80);
const sanitizedName = safeExt ? `${safeBaseName}.${safeExt}` : safeBaseName;
```
For example, an attacker submitting `../../../../etc/passwd` resolves strictly to the safe filename `passwd`.

---

### 3. Supabase Private Storage Bucket Architecture

When running with Cloud Supabase Storage, three isolated private buckets are provisioned:

| Bucket Name | Visibility | Allowed MIME Types | Max Size | Access Policy |
| :--- | :--- | :--- | :--- | :--- |
| **`report_dossiers`** | **Private** | `application/pdf`, `text/csv` | 10MB | Project owners and collaborators |
| **`brand_assets`** | **Private** | `image/*` | 5MB | Project members only |
| **`creative_specs`** | **Private** | `image/*`, `application/pdf` | 10MB | Project members only |

#### 3.1 Storage Row-Level Security Policies
```sql
-- Allow users to read files only from projects they have access to
create policy "Project members can read report files"
  on storage.objects for select
  using (
    bucket_id = 'report_dossiers' and
    public.has_project_access(split_part(name, '/', 1), 'viewer')
  );

-- Allow project editors to upload report files
create policy "Project editors can upload report files"
  on storage.objects for insert
  with check (
    bucket_id = 'report_dossiers' and
    public.has_project_access(split_part(name, '/', 1), 'editor')
  );

-- Allow project owners to delete report files
create policy "Project owners can delete report files"
  on storage.objects for delete
  using (
    bucket_id = 'report_dossiers' and
    exists (
      select 1 from public.marketing_projects p
      where p.id = split_part(name, '/', 1)
        and p.user_id = auth.uid()
    )
  );
```

---

### 4. Signed URLs and Enumeration Defense

- Public URLs are disabled across all report storage buckets.
- File downloads generate cryptographically signed URLs with a short **15-minute time-to-live (TTL)**.
- Before generating a signed URL, the server verifies that `auth.uid()` has `viewer` or `editor` permissions on the parent project.
- Bucket enumeration (`LIST` operations) is forbidden for unauthorized actors, preventing attackers from discovering other tenants' files.

