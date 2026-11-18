# SEO Security Policy: SSRF Defenses & Safe Retrieval
**Sparkline Marketing Intelligence & Strategy Platform — Phase 18**

## 1. Overview & Security Objectives

The Website SEO Audit Engine (`POST /api/audit-website-seo`) allows users to analyze the public on-page SEO characteristics of any website by submitting its URL. Allowing a server to fetch arbitrary URLs introduces critical security risks if unmitigated, most notably **Server-Side Request Forgery (SSRF)**, where an attacker tricks the server into making unauthorized requests to internal infrastructure, cloud metadata endpoints, or local loopback interfaces.

This document details the multi-layered security controls deployed in Sparkline's server proxy middleware (`src/server/ai-proxy-middleware.ts`) to ensure 100% safe, hardened, and sandboxed audit execution.

---

## 2. Server-Side Request Forgery (SSRF) Mitigations

### 2.1 Private & Loopback IP Blacklist (`isPrivateOrLocalHost`)
Before initiating any network socket connection, the target hostname is resolved and evaluated against an exhaustive blocklist of private, local, and reserved IP address spaces:

| Range / Hostname | Classification | Security Threat Prevented |
|---|---|---|
| `127.0.0.0/8` | Loopback (`127.0.0.1`, etc.) | Prevents probing local services (Vite dev server, redis, databases). |
| `localhost` | Local alias | Prohibits access to internal host processes. |
| `10.0.0.0/8` | RFC 1918 Private Class A | Blocks scanning internal corporate enterprise networks. |
| `172.16.0.0/12` | RFC 1918 Private Class B | Protects Docker/Kubernetes container subnets. |
| `192.168.0.0/16` | RFC 1918 Private Class C | Shields internal LAN and office subnet resources. |
| `169.254.0.0/16` | Link-Local / Cloud Metadata | **Critical**: Blocks AWS EC2, GCP, and Azure metadata API access (`http://169.254.169.254/`). |
| `100.64.0.0/10` | Carrier-Grade NAT (CGNAT) | Prevents carrier internal routing traversal. |
| `::1` | IPv6 Loopback | Prevents IPv6 local socket discovery. |
| `fc00::/7` | IPv6 Unique Local Address | Blocks IPv6 internal private networks. |
| `fe80::/10` | IPv6 Link-Local Address | Prohibits IPv6 link-local metadata requests. |
| `*.internal`, `*.local`, `*.lan`, `*.home`, `*.corp` | Internal Domain Suffixes | Prevents resolving internal corporate intranet hostnames. |

### 2.2 Redirect Traversal & Re-Validation
Attackers often attempt to bypass initial URL checks by pointing a public domain to a redirect script that returns a `302 Found` pointing to `http://169.254.169.254/` or `http://localhost:3000/`.

**Our Defense**:
- Node.js `fetch` tracks redirect chains.
- Following the response, Sparkline explicitly checks `response.url` (the final landing destination after all redirects) against `isPrivateOrLocalHost`.
- If a redirect resolves to any private, loopback, or cloud metadata IP, the request is immediately aborted with a `403 Forbidden` SSRF block error.

---

## 3. Resource Exhaustion & Denial of Service Protection

### 3.1 Strict Timeout Enforcing (10,000ms)
- All outbound requests utilize an `AbortController` configured to abort at exactly **10 seconds**.
- Protects the server thread pool against slow-loris attacks and hanging external endpoints.

### 3.2 Maximum Response Body Size Cap (2 MB)
- Crawled HTML documents are capped at a maximum buffer limit of **2,097,152 bytes (2 MB)**.
- If a target endpoint serves an oversized payload, excessive download is immediately terminated, mitigating decompression bombs and memory exhaustion.

### 3.3 Safe Regex Parsing (No Script Execution)
- Target HTML payloads are never executed inside a headless browser or JavaScript VM.
- Data extraction (titles, descriptions, headings, alt tags, schema JSON) executes using deterministic, non-backtracking regular expressions, ensuring malicious JavaScript payloads on external websites cannot execute within Sparkline's server environment.

---

## 4. User-Facing Fallback: Raw HTML Paste Mode

For teams auditing pre-production staging environments behind private corporate VPNs or firewall restrictions, Sparkline provides a **Raw HTML Paste Mode**. Users can copy and paste their staging template's raw HTML source directly into the client. The audit engine analyzes the HTML structure completely locally without making outbound network requests.

