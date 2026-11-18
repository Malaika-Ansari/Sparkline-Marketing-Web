/**
 * SPARKLINE MARKETING — SERVERLESS API ENDPOINT
 * Route: /api/ai-status
 * Description: AI Provider Readiness Status
 * Secure Node.js Serverless Function for Vercel, Netlify, and Cloud Deployments.
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { handleAiStatus } from '../src/server/ai-proxy-middleware';

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  return handleAiStatus(req, res);
}
