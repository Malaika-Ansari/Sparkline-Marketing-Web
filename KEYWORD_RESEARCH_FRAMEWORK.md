# Keyword Research & Semantic Clustering Framework
**Sparkline Marketing Intelligence & Strategy Platform — Phase 18**

## 1. Overview & Methodological Principles

Effective keyword research in modern search engines is no longer about discovering arbitrary high-volume keywords and stuffing them into body copy. Search algorithms prioritize **user intent fulfillment, topical authority, semantic breadth, and page experience**.

Sparkline Marketing’s Keyword Research Engine (`/dashboard/seo?tab=keywords`) is built around four foundational principles:
1. **Intent-First Categorization**: Aligning every search term with the user's stage in the buying cycle.
2. **Pillar & Cluster Topic Modeling**: Establishing authority through interconnected content networks.
3. **Transparent Ground-Truth**: Explicitly disclosing AI-generated conceptual ideas versus authenticated data sources.
4. **Actionable Implementation Mapping**: Connecting every keyword directly to a target page type, content plan, and conversion goal.

---

## 2. Six-Tier Search Intent Taxonomy

Every keyword opportunity analyzed by Sparkline is categorized into one of six distinct search intents:

| Intent Category | User Psychology | Example Query | Target Content Format | Primary Conversion Goal |
|---|---|---|---|---|
| **Informational** | Seeking knowledge, answering questions, researching concepts. | *"how to calculate customer acquisition cost"* | Comprehensive Tactical Guide, Academy Article | Email newsletter signup, template download |
| **Navigational** | Seeking a specific brand, login portal, or destination URL. | *"sparkline marketing platform login"* | Homepage, Brand Portal, Product Tour | Direct sign-in, platform engagement |
| **Commercial** | Comparing solutions, evaluating features, weighing options before purchase. | *"best marketing intelligence software 2026"* | Comparison Table, Versus Page, Buyer's Guide | Product demo request, trial signup |
| **Transactional** | High commercial intent, ready to buy, subscribe, or contract. | *"buy b2b audience analysis software"* | Pricing Page, Checkout, Feature Landing Page | Paid checkout, subscription conversion |
| **Local** | Seeking localized services, agencies, or regional providers. | *"digital marketing agency near me"* | Local Landing Page, Google Business Profile | Phone call, office appointment, consultation |
| **Long-Tail** | Highly specific multi-word query with high topical focus. | *"multi currency marketing budget planner with ecb rates"* | Niche Solution Page, Tool Page | Immediate tool usage, high-intent signup |

---

## 3. Topic Cluster Architecture (Hub & Spoke Model)

To establish domain authority and capture search traffic across competitive verticals, keywords must be grouped into hierarchical topic clusters:

```
                      +-----------------------------+
                      |         Pillar Page         |
                      |   "The Definitive Guide     |
                      |   to Marketing Strategy"    |
                      |  (Broad, High-Value Target) |
                      +--------------+--------------+
                                     |
         +---------------------------+---------------------------+
         |                           |                           |
         v                           v                           v
+------------------+       +-------------------+       +-------------------+
|  Cluster Page 1  |       |  Cluster Page 2   |       |  Cluster Page 3   |
|  "Customer CAC   |       |  "Audience Persona|       |  "Marketing Budget|
|   Benchmarks"    |       |   Templates"      |       |   Allocation"     |
+--------+---------+       +---------+---------+       +---------+---------+
         |                           |                           |
         +---------------------------+---------------------------+
                                     |
                       (Bidirectional Internal Links)
```

### 3.1 Pillar Page Criteria
- Covers the core topic comprehensively at a high level (2,500+ words).
- Targets broad, high-value commercial or informational keywords.
- Links out to all supporting sub-topic cluster articles using descriptive anchor text.

### 3.2 Cluster Page Criteria
- Dives deeply into a specific sub-topic or practical implementation question.
- Targets long-tail and question-based keywords.
- Always contains a prominent contextual hyperlink back to the pillar page.

---

## 4. Opportunity Prioritization Scoring

Keywords are assigned priorities based on three objective strategic criteria:

1. **High Priority**:
   - Direct alignment with primary product offering or service capability.
   - Clear commercial or transactional intent.
   - High customer lifetime value potential.
2. **Medium Priority**:
   - Informational queries where the business provides a free calculation or educational guide.
   - Comparison and alternative queries against adjacent workflows.
3. **Low Priority**:
   - Broad industry terminology with low conversion velocity.
   - Top-of-funnel curiosities with distant commercial intent.

---

## 5. Ground-Truth Data Verification Policy

- **Transparent Labeling**: AI-generated suggestions are permanently badged as `AI-Generated Suggestion` until verified.
- **No Synthetic Numbers**: Sparkline strictly prohibits the generation of artificial search volume counts (e.g., claiming a term has exactly "14,200 monthly searches" without an active API connection).
- **API Extensibility**: The keyword engine provides schema slots for `verifiedMetrics` (`searchVolume`, `cpc`, `difficulty`, `providerName`, `retrievedDate`), ready for Google Search Console or authorized SEO data partner feeds.

