/**
 * SPARKLINE MARKETING — SERVERLESS API ENDPOINT
 * Route: /api/generate-budget-plan
 * Description: Marketing Budget Allocation Generator
 * Secure Node.js Serverless Function for Vercel, Netlify, and Cloud Deployments.
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { handleGenerateBudgetPlan } from '../src/server/ai-proxy-middleware';

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  return handleGenerateBudgetPlan(req, res);
}
