# Sparkline Marketing — Technical SEO & Content Guidelines

## 1. Overview
Sparkline Marketing is architected for top-tier organic search performance, semantic crawlability, and rich social sharing. This document sets the standards for all public-facing pages, landing pages, and educational content.

---

## 2. Technical SEO Standards

### 2.1 Metadata & Document Headers
Each public route must define:
- **Unique `<title>` Tag**: Maximum 60 characters, structured as: `[Page Topic] — Sparkline Marketing` or `Sparkline Marketing | [Core Value Proposition]`.
- **Meta Description**: 140–160 characters describing the unique value proposition with natural search intent alignment.
- **Canonical URL**: Self-referencing canonical URL on every canonical indexable page (`<link rel="canonical" href="..." />`).
- **Open Graph (OG)**: `og:title`, `og:description`, `og:type`, `og:image`, `og:url`, `og:site_name`.
- **Twitter Cards**: `twitter:card` (summary_large_image), `twitter:title`, `twitter:description`, `twitter:image`.
- **Robots Meta Tag**: `index, follow` on all public marketing pages; `noindex, nofollow` on all dashboard, workspace, and preview screens.

### 2.2 Semantic HTML Hierarchy
- **Single `<h1>`**: Every page must have exactly one semantic `<h1>` tag containing the primary topic and keyword concept.
- **Logical Heading Progression**: `<h2>` for major sections, `<h3>` for cards/features. Never skip levels for aesthetic purposes.
- **Descriptive Alt Attributes**: All images, brand vectors, and chart illustrations must include meaningful `alt` text. Decorative SVGs must include `aria-hidden="true"`.
- **Semantic Tags**: Use `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>` rather than generic `<div>` blocks.

### 2.3 Structured Data (JSON-LD)
Pages implement schema.org structured data:
- **Organization**: Global entity information for Sparkline Marketing.
- **SoftwareApplication**: Software SaaS metadata on product and feature pages.
- **WebSite**: Sitelinks searchbox and root identity.
- **BreadcrumbList**: Breadcrumb hierarchies for deep pages and academy lessons.

---

## 3. SEO Target Landing Pages (Future Expansion)

The platform architecture is prepared to host high-intent landing pages:
1. **AI Marketing Strategy Generator** (`/tools/ai-strategy-generator`): Targeting marketers seeking automated, data-backed strategy frameworks.
2. **Digital Marketing Strategy** (`/tools/digital-marketing-strategy`): Full-funnel digital marketing planning templates.
3. **Marketing Budget Calculator** (`/tools/budget-calculator`): Dynamic budget allocation models across channels.
4. **Marketing ROI Calculator** (`/tools/roi-calculator`): ROAS and ROI projection tools.
5. **Marketing Metrics & KPI Guide** (`/tools/marketing-metrics`): Standard formula reference and benchmarks.
6. **Competitor Analysis Tools** (`/tools/competitor-analysis`): Competitor intelligence and positioning matrix guides.
7. **Social Media Marketing Strategy** (`/tools/social-media-strategy`): Organic and paid social campaign planning.

---

## 4. Crawl Control & Accessibility
- `public/robots.txt`: Clearly specifies allowed crawl paths and explicitly blocks `/dashboard/*` and `/api/*`.
- `public/sitemap.xml`: Formatted according to sitemap protocol 0.9 with updated `<lastmod>` timestamps and appropriate priorities.

