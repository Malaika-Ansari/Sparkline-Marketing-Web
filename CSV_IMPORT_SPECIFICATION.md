# CSV & Spreadsheet Ingestion Security Specification

> **Sparkline Marketing Intelligence & Strategy Platform — Phase 23**

---

## 1. Overview & Scope

The **Sparkline CSV & Spreadsheet Ingestion Engine** allows marketing teams, agencies, and e-commerce operators to import historical advertising spend, click logs, and conversion data from unsupported ad networks, manual tracking sheets, and legacy platforms.

Because user-supplied CSV files represent a high-risk vector for **CSV Injection (Formula Injection / DDE)**, denial of service via oversized files, and data corruption, the ingestion engine operates under strict defense-in-depth controls.

---

## 2. Security Boundaries & Constraints

1. **File Size Ceiling**: Strictly capped at **5MB** ($5 \times 1024 \times 1024$ bytes). Files exceeding this threshold are immediately rejected client-side and server-side before memory allocation.
2. **MIME & Extension Enforcement**: Only `.csv` extensions with MIME types `text/csv` or `application/vnd.ms-excel` are processed.
3. **Filename Path Traversal Neutralization**: All directory separators (`/`, `\`) and non-alphanumeric characters (except dots, underscores, hyphens) are stripped:
   ```typescript
   const safeFilename = filename.replace(/^.*[\\\/]/, '').replace(/[^\w.-]/g, '_');
   ```
4. **Execution Prevention**: Uploaded spreadsheets are parsed purely as flat text streams. No active macros, JavaScript, VBScript, or binary payloads are ever executed.

---

## 3. Spreadsheet Formula Injection Defense (CSV Injection)

### The Vulnerability (CWE-1236)
When CSV files are exported and later opened in desktop spreadsheet software (Microsoft Excel, LibreOffice Calc, Apple Numbers), cells beginning with `=`, `+`, `-`, `@`, `\t`, or `\r` can execute arbitrary operating system commands via Dynamic Data Exchange (DDE) or trigger outbound data exfiltration:
```csv
Date,Campaign,Spend
2026-11-14,=cmd|'/C calc'!A0,100
2026-11-14,@SUM(1+1)*cmd|' /C powershell ...'!A0,250
```

### The Sanitization Rule
Sparkline automatically sanitizes every cell. If a cell begins with a formula trigger character and is **not** a legitimate standalone numeric literal, a single quote (`'`) is prepended:

```typescript
function sanitizeCsvCell(value: string): string {
  if (!value) return '';
  const trimmed = value.trim();
  const dangerousPrefixes = ['=', '+', '-', '@', '\t', '\r'];
  if (dangerousPrefixes.some((p) => trimmed.startsWith(p)) && isNaN(Number(trimmed))) {
    return `'${trimmed}`;
  }
  return trimmed;
}
```

This renders the payload as harmless literal text in Excel while preserving genuine numerical metrics (e.g. `+100` or `-25.50`).

---

## 4. Multi-Step Import Workflow

```
[1. Upload File] ──→ [2. Header & Structure Validation] ──→ [3. Schema Mapping] ──→ [4. Row Ingestion & Dedupe]
```

1. **File Inspection**: Validates size (&le; 5MB), UTF-8 encoding, and ensures at least one header row and one data row exist.
2. **Column Mapping Interface**: Allows the user to map arbitrary source columns into Sparkline's standardized fields:
   - `Date` (Required)
   - `Platform / Channel` (Optional, defaults to "CSV Import")
   - `Campaign Name` (Optional, defaults to "Imported Campaign")
   - `Spend Amount` (Optional, defaults to 0)
   - `Impressions` (Optional, defaults to 0)
   - `Clicks` (Optional, defaults to 0)
   - `Conversions / Orders` (Optional, defaults to 0)
   - `Attributed Revenue` (Optional, defaults to 0)
3. **Row Validation**:
   - Rejects rows with column count mismatches.
   - Rejects corrupted or malformed date strings.
   - Enforces non-negative numerical values ($\ge 0$).
4. **Deduplication Commit**: Prevents re-importing duplicate records using compound uniqueness checking against `(projectId, platform, campaign, date)`.
5. **Import Summary**: Displays exact metrics: Rows Processed, Rows Imported, Rows Skipped (duplicates), and Dangerous Formula Cells Neutralized.

---

## 5. RFC 4180 Export Compliance

When exporting analytics tables back to CSV, Sparkline adheres strictly to IETF RFC 4180:
- Cells containing commas, quotation marks, or newlines are enclosed in double quotes.
- Internal double quotes are escaped as `""`.
- Line breaks terminate with standard CRLF (`\r\n`).
- Formula triggers are escaped to guarantee safe spreadsheet opening.

