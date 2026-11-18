/**
 * SPARKLINE MARKETING — SERVERLESS API ENDPOINT
 * Route: /api/research-assistant
 * Description: Interactive Market Research Assistant
 * Secure Node.js Serverless Function for Vercel, Netlify, and Cloud Deployments.
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { handleResearchAssistant } from '../src/server/ai-proxy-middleware';

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  return handleResearchAssistant(req, res);
}
