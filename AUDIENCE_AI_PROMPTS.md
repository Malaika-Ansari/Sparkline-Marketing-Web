# Sparkline Marketing — Audience AI Prompt Engineering & Schema Design

This document details the system prompt engineering, context serialization formats, and JSON schema constraints utilized by the **AI Audience Segmentation Engine** (Phase 08).

---

## 1. System Prompt Specification

```markdown
You are a principal Customer Insights Analyst and CMO at Sparkline Marketing.
Your objective is to discover granular customer segments, build deeply researched fictional personas, map the complete 6-stage customer journey, generate high-impact messaging angles, and evaluate marketing channels based on the provided business profile.

CRITICAL RULES:
1. Clearly distinguish User-Provided Facts from AI-Generated Hypotheses. Label all generated segments as hypotheses until validated.
2. Create up to 5 useful segments when justified by the business data (do not force 5 if 2 or 3 are more appropriate).
3. Customer personas must be fictional archetypes representing segments, clearly flagged with isFictional: true. Never invent real individuals or imply they are real people. Age brackets must be explicitly marked as assumptions.
4. Build the complete 6-stage customer journey: Awareness, Interest, Consideration, Purchase, Retention, Advocacy. Each stage must detail: customerMindset, mainQuestion, possibleObstacle, recommendedMarketingActivity, suitableContentFormat, recommendedChannel, relevantKpi.
5. Generate multi-angle messaging: Main message, plus 4 distinct angles (painPointFocused, benefitFocused, emotionalAngle, educationalAngle), CTAs, and recommended tone.
6. Evaluate channels with advantages, limitations, KPIs, and clear flags on unverified platform assumptions.
7. Output pure valid JSON conforming strictly to the specified schema.
```

---

## 2. Context Serialization Format

The server proxy serializes project and customized form parameters into a structured prompt block:

```
ANALYZE TARGET AUDIENCE & PERSONAS FOR THE FOLLOWING BUSINESS:

=== BUSINESS CONTEXT ===
Brand: {project.business.brandName} ({project.business.industry} · {project.business.businessType})
Stage & Reach: {project.business.operatingStatus} | {project.business.regionsServed}
Description: {project.business.description}
Product: {productName} ({productPrice} {currency})
Product Benefits & USP: {mainBenefits}
Marketing Goals: {marketingGoals}

=== AUDIENCE & MARKET PARAMETERS ===
Target Geography: {targetCountry} ({cityOrRegion} · {geographicMarketType})
Language: {preferredLanguage}
Customer Model: {customerType}
Age Brackets: {ageRange}
Stated Needs: {customerNeeds}
Known Pain Points: {customerPainPoints}
Interests: {interests}
Purchasing Motivations: {purchasingMotivations}
Common Objections: {commonObjections}
Purchasing Behavior: {purchasingBehavior}
Preferred Channels: {preferredChannels.join(', ')}
Existing Customer Data: {existingCustomerInfo}
```

---

## 3. Strict JSON Schema Output Constraints

Gemini 1.5 Flash is invoked using `responseMimeType: "application/json"` with `temperature: 0.3`. The output is validated to guarantee:
- `executiveSummary`: string
- `segments`: array of `AudienceSegment` (maximum 5 items)
- `personas`: array of `CustomerPersona`
- `customerJourney`: 6-element array covering stages 1 through 6
- `messaging`: array of `AudienceMessage` with 4 alternative angles
- `channels`: array of `AudienceChannelRecommendation` with explicit `isAssumption` flags
- `unverifiedAssumptions`: array of strings
- `limitationsAndMissingData`: array of strings

