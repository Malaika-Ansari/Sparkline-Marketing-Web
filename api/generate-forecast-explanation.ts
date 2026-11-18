/**
 * SPARKLINE MARKETING — SERVERLESS API ENDPOINT
 * Route: /api/generate-forecast-explanation
 * Description: Financial Forecast Scenario Explainer
 * Secure Node.js Serverless Function for Vercel, Netlify, and Cloud Deployments.
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { handleGenerateForecastExplanation } from '../src/server/ai-proxy-middleware';

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  return handleGenerateForecastExplanation(req, res);
}
