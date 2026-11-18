# Sparkline Marketing — Audience Intelligence & Customer Segmentation Architecture

This document specifies the technical architecture, segmentation algorithms, and customer profiling methodology implemented in the **Target Audience & Customer Persona Analyzer** (Phase 08).

---

## 1. Executive Summary & Product Vision

Audience intelligence bridges high-level marketing goals and ground-level campaign execution. Generic AI tools produce superficial demographic summaries; Sparkline Marketing’s Audience Intelligence Engine analyzes customer friction, purchasing psychology, objection barriers, and multi-stage decision journeys to build actionable customer personas.

```
+-----------------------------------------------------------------------------------------+
|                               AUDIENCE INTELLIGENCE FLOW                                |
+-----------------------------------------------------------------------------------------+
|  1. Context Extraction: Ingests brand profile, products, unit economics, and geography  |
|  2. User Parameter Tuning: Allows fine-tuning market scope, customer model, and needs   |
|  3. Segmentation Engine: Groups audience into up to 5 strategic, prioritized cohorts    |
|  4. Persona Archetypes: Constructs rich fictional personas with psychological drivers    |
|  5. 6-Stage Journey: Details mindset, questions, obstacles, activities, formats, KPIs    |
|  6. Messaging Matrix: Generates main message + 4 angles (pain, benefit, emotion, logic) |
|  7. Channel Strategy: Evaluates platform behaviors, creative formats, and assumptions   |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Segmentation Methodology & Hypotheses Framework

### 2.1 The Need for Epistemic Modesty
AI models cannot know empirical customer behavior without direct analytics access. Therefore, Sparkline Marketing adheres to strict transparency rules:
- **Hypothesis Labeling**: All AI-generated audience segments are explicitly flagged with `isHypothesis: true` until verified by live cohort metrics or customer interviews.
- **Dynamic Segment Count**: Generates up to 5 useful segments only when justified by business data. If only 2 or 3 segments are supported by the product proposition, the engine does not force unnecessary segmentation.

### 2.2 Core Segment Attributes
Each segment (`AudienceSegment`) contains:
- **Segment Identity**: Title and descriptive overview.
- **Psychological Grounding**: Main customer need, acute pain points, purchase motivation, and buying behavior.
- **Objection Matrix**: Potential reasons for hesitation or rejection.
- **Commercial Alignment**: Product relevance, recommended messaging angle, content format preferences, suggested call-to-action (CTA).
- **Strategic Priority**: Categorized as `High`, `Medium`, or `Low` priority to focus early ad spend on the highest-leverage cohort.

---

## 3. The 6-Stage Customer Decision Journey

The engine maps customer evolution across six sequential phases:
1. **Awareness**: Problem-aware realization; discovers that existing alternatives are inadequate.
2. **Interest**: Information gathering; inspects ingredients, technical specifications, or compliance standards.
3. **Consideration**: Direct comparison against rivals; evaluates risk reversal (guarantees, trials, POCs).
4. **Purchase**: Commercial transaction; evaluates pricing, shipping speed, payment friction, and checkout velocity.
5. **Retention**: Onboarding, habituation, and replenishment; automated post-purchase communication.
6. **Advocacy**: Vocal brand evangelism; referral rewards, reviews, and community involvement.

Every journey stage specifies:
- Customer Mindset
- Main Question
- Possible Obstacle
- Recommended Marketing Activity
- Suitable Content Format
- Recommended Channel
- Relevant KPI

---

## 4. Client Persistence & Persona Library

Audience analyses and saved customer personas are managed via `AudienceService`:
- **Analyses Storage**: `sparkline_marketing_audience_analyses` in `localStorage`.
- **Persona Bookmarking**: Users can bookmark individual personas to a global library stored under `sparkline_marketing_saved_personas`.
- **Pre-Seeded Blueprints**: Pre-seeded with comprehensive reference blueprints for *GlowBiome Organics* (DTC Skincare) and *ApexSec Cloud Intelligence* (B2B SaaS).

