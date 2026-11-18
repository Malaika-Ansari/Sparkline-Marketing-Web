/**
 * AI Service Architecture Layer
 *
 * IMPORTANT SECURITY POLICY:
 * In accordance with Phase 1 security directives, the Gemini API key must NEVER
 * be embedded in frontend code. All AI calls will route through authenticated serverless
 * proxy endpoints (Phase 3+).
 */

export interface StrategyRequest {
  productName: string;
  productDescription: string;
  targetAudience: string;
  budgetMonthly: number;
  currency: string;
  primaryGoal: 'Acquisition' | 'Awareness' | 'Retention' | 'Conversion';
}

export interface GeneratedStrategy {
  executiveSummary: string;
  channelAllocation: { channel: string; percentage: number; rationale: string }[];
  keyMessages: string[];
  projectedMetrics: { kpi: string; target: string; confidence: number }[];
  roadmap: { phase: string; duration: string; focus: string }[];
}

export const aiService = {
  /**
   * Placeholder architectural adapter.
   * Will integrate with secure server-side edge function in Phase 3.
   */
  async generateStrategy(
    _request: StrategyRequest
  ): Promise<{ status: 'preview'; message: string }> {
    return {
      status: 'preview',
      message:
        'AI Marketing Strategist engine is scheduled for full live proxy integration in Phase 3.',
    };
  },
};

