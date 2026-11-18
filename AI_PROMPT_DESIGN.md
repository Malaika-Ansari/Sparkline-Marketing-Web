# Sparkline Marketing — AI Prompt Design & Schema Specification

This document details the system prompt engineering, context injection format, and JSON schema constraints employed by Sparkline Marketing to communicate with the Google Gemini API (Phase 07).

---

## 1. Prompt Engineering Philosophy

Generic AI marketing advice fails because of hallucinated metrics, fabricated competitor case studies, and lack of commercial grounding. The Sparkline Marketing prompt design enforces four foundational principles:

1. **Strict Context Grounding**: The AI is instructed to reason exclusively over the provided business profile, product list, unit economics, audience inputs, and budget envelope.
2. **Epistemic Modesty & Transparency**: The model must separate user-provided baseline facts from AI-inferred behavioral hypotheses.
3. **Unit-Economic Awareness**: Recommendations must respect the user's selling price, COGS, gross margin, and monthly ad spend envelope.
4. **Deterministic Structured JSON**: Outputs use `responseMimeType: "application/json"` with temperature set to `0.3` to minimize hallucinations and guarantee schema conformity.

---

## 2. System Instruction

```markdown
You are a senior CMO, growth architect, and marketing intelligence specialist at Sparkline Marketing.
Your mission is to generate a comprehensive, actionable, commercially grounded Marketing Strategy based strictly on the provided business inputs.

CRITICAL RULES:
1. Ground all analysis strictly in the user-provided business details. Never invent non-existent business facts or false case studies.
2. Clearly separate User-Provided Facts from AI Strategic Hypotheses.
3. Explicitly distinguish technical product features from customer-perceived benefits.
4. Never guarantee revenue, sales, ROI, or ROAS numbers. Present targets as indicative benchmarks subject to ad auction testing.
5. In Marketing Channels, select only the most relevant 3-5 channels based on audience, unit economics, and budget. Explain advantages and risks for each.
6. Provide three strategic approaches: Conservative (low risk, validate demand), Balanced (sustainable organic/paid mix), and Aggressive Growth (faster scale, higher risk).
7. Flag explicit assumptions and highlight areas requiring external market research before scaling spend.
8. Output MUST strictly conform to the provided JSON schema. Output pure JSON only.
```

---

## 3. Context Serialization Format

Project information is serialized into structured markdown sections:

```
GENERATE A STRUCTURED MARKETING STRATEGY FOR THE FOLLOWING PROJECT:

=== BUSINESS PROFILE ===
Brand Name: {project.business.brandName}
Website: {project.business.websiteUrl}
Industry: {project.business.industry} ({project.business.customIndustry})
Business Type: {project.business.businessType}
Location: {project.business.location}
Regions Served: {project.business.regionsServed}
Operating Status: {project.business.operatingStatus}
Business Size: {project.business.businessSize}
Description: {project.business.description}

=== PRODUCTS & UNIT ECONOMICS ===
Product 1: {product.name}
  - Category: {product.category}
  - Price: ${product.sellingPrice} {product.currency} | COGS: ${product.costOfGoods}
  - USP: {product.usp}
  - Features: {product.features.join('; ')}
  - Customer Benefits: {product.benefits.join('; ')}
  - Availability: {product.availability}

=== TARGET AUDIENCE ===
Target Regions: {audience.targetLocations.join(', ')}
Age Brackets: {audience.ageRanges.join(', ')}
Customer Type: {audience.customerType}
Interests: {audience.interests.join(', ')}
Core Needs & Problems: {audience.needsAndProblems}
Pain Points & Objections: {audience.mainPainPoints.join('; ')}
Purchasing Behavior: {audience.purchasingBehavior}
Existing Customer Segments: {audience.existingCustomerSegments}

=== COMPETITORS & POSITIONING ===
Competitors: {competitorList}
Current Market Position: {marketPosition.currentPosition}
Core Differentiator: {marketPosition.whatMakesYouDifferent}
Competitive Advantages: {marketPosition.competitiveAdvantages.join('; ')}
Known Market Challenges: {marketPosition.knownMarketChallenges.join('; ')}

=== GOALS & BUDGET ===
Selected Goals: {marketing.selectedGoals.join(', ')}
Primary North Star: {marketing.primaryObjective}
Current Active Channels: {marketing.currentChannels.join(', ')}
Existing Campaign Status: {marketing.existingCampaignStatus}
Monthly Budget: ${marketing.monthlyBudget} {marketing.budgetCurrency}
Planned Horizon: {marketing.campaignDuration}
Target Outcome Milestone: {marketing.expectedOutcome}
```

---

## 4. Response Validation & Defensive Parsing

1. **JSON Envelope Extraction**: If the model wraps the output in markdown code blocks (` ```json ... ``` `), the parser strips the delimiters.
2. **Schema Integrity Verification**: The server proxy validates that all top-level keys (`executiveSummary`, `businessAnalysis`, `audienceAnalysis`, `messaging`, `approaches`, `recommendedChannels`, `funnelStrategy`, `budgetConsiderations`, `nextSteps`, `assumptions`) exist.
3. **Fallback Defaults**: In the rare event of missing subfields, defensive defaults are applied to prevent client rendering crashes.

