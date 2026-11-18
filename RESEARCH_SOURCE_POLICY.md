# Sparkline Research Source & Epistemic Grounding Policy
## Standards for Factual Grounding, Citation Integrity, and Claim Verification

> **"Transparent Claims. Verifiable Sources. Zero Hallucinated Numbers."**  
> Operational guidelines and ethical boundaries governing market research synthesis at Sparkline Marketing.

---

## 1. Core Epistemic Principles

At Sparkline Marketing, research outputs guide critical commercial investments: advertising spend, inventory commitments, and product positioning. When AI models fabricate statistics or invent false certainty, businesses lose money.

To prevent this, the Market Research Engine enforces strict **Epistemic Honesty**:

1. **Never Invent Search Volumes or Exact Metrics**:
   - The platform **never** outputs synthetic search volumes (e.g. "42,300 monthly searches"), fake CPC dollar figures, or fictional conversion rates unless referencing an official benchmark report.
   - When real-time search engine APIs are unconfigured, the platform displays **qualitative demand indicators** and behavioral search intent patterns.

2. **Explicit Technical Disclosures**:
   - The user interface renders a visible disclosure banner:
     > *"Sparkline Epistemic Grounding: Real-time search API unconfigured. Findings synthesized from verified industry frameworks, macroeconomic benchmarks, and strategic deduction. No synthetic search volume numbers have been generated."*

3. **Separation of Verified Evidence vs. Strategic Reasoning**:
   - Every analytical claim must be attributed either to an empirical external source or explicitly classified as **Sparkline Strategic Reasoning**.

---

## 2. Source Classification & Hierarchy

Sources referenced in Sparkline market reports are classified into four authoritative tiers:

| Source Type | Description | Representative Examples |
| :--- | :--- | :--- |
| **Tier 1: Regulatory & Government Registries** | Binding statutory guidelines, compliance mandates, official economic databases. | FDA Cosmetics Direct / MoCRA, FTC Endorsement Guides, SEC Cyber Disclosure Rules, Bureau of Labor Statistics (BLS), OECD Economic Outlook. |
| **Tier 2: Primary Industry Benchmarks** | Peer-reviewed market surveys, audited category studies, standardized analyst publications. | Gartner Magic Quadrants / Hype Cycles, Statista Category Benchmarks, Forrester Waves, McKinsey Global Institute Reports. |
| **Tier 3: Established Trade Publications** | Recognized editorial authorities with journalistic attribution standards. | Vogue Business Beauty Index, TechCrunch Enterprise, Adweek Performance Insights, Harvard Business Review. |
| **Tier 4: Analytical Commentary & Models** | Structural economic frameworks and validated business models. | Porter's Five Forces, PESTLE Framework, Kotler's Marketing Management models. |

---

## 3. Required Metadata for External Citations

Every source entry in a `MarketResearchReport` must include the following verified attributes:

```typescript
export interface ResearchSourceReference {
  id: string;                      // Unique identifier, e.g. "src-1"
  sourceTitle: string;             // Exact title of publication or study
  publisherOrWebsite: string;      // Sponsoring entity or research organization
  sourceUrl: string;               // Direct canonical URL
  publicationDate?: string;        // Year or ISO date of publication
  accessDate: string;              // Retrieval date
  relevantClaim: string;           // Direct summary of the validated fact
  researchCategory: string;        // Analytical section supported (e.g. "Regulatory Compliance")
  sourceType: SourceType;          // Primary Research | Industry Publication | Regulatory Document | Analytical Commentary
  isVerified: boolean;             // True if verified against benchmark registries
}
```

---

## 4. Confidence Level Assignment Rules

Confidence levels are assigned systematically according to supporting evidence:

- **High Confidence**: Supported by a Tier 1 or Tier 2 verifiable study published within the last 24 months, with consistent replication across independent category sources.
- **Medium Confidence**: Supported by established industry commentary, common commercial practice, or trailing historical trends.
- **Low Confidence**: Inferred from adjacent category behaviors or emerging consumer patterns that lack longitudinal data.
- **Insufficient Evidence**: Explicitly displayed when a proposed opportunity or hypothesis lacks empirical substantiation. Sparkline never forces a false high score when data is unavailable.

---

## 5. Research Assistant Grounding Protocol

When a user engages the interactive **AI Research Assistant**:
1. The assistant must first check the report's `sources` bibliography before answering empirical questions.
2. If an answer draws from a specific citation, the assistant includes the citation in `citedSourceIds`.
3. If an answer draws on marketing principles rather than empirical data, the message displays the tag:  
   `⚡ Sparkline Strategic Reasoning`.
4. If a user asks for live real-time web data that cannot be verified, the assistant explicitly clarifies the boundary rather than inventing a response.

