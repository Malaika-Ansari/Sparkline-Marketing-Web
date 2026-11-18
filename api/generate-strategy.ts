/**
 * SPARKLINE MARKETING — SERVERLESS API ENDPOINT
 * Route: /api/generate-strategy
 * Description: AI Marketing Strategy Generator
 * Secure Node.js Serverless Function for Vercel, Netlify, and Cloud Deployments.
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { handleGenerateStrategy } from '../src/server/ai-proxy-middleware';

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  return handleGenerateStrategy(req, res);
}
