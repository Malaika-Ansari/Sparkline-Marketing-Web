/**
 * SPARKLINE MARKETING — SERVERLESS API ENDPOINT
 * Route: /api/competitor-assistant
 * Description: Interactive Competitor Intelligence Assistant
 * Secure Node.js Serverless Function for Vercel, Netlify, and Cloud Deployments.
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { handleCompetitorAssistant } from '../src/server/ai-proxy-middleware';

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  return handleCompetitorAssistant(req, res);
}
