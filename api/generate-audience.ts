/**
 * SPARKLINE MARKETING — SERVERLESS API ENDPOINT
 * Route: /api/generate-audience
 * Description: AI Audience & Persona Generator
 * Secure Node.js Serverless Function for Vercel, Netlify, and Cloud Deployments.
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { handleGenerateAudience } from '../src/server/ai-proxy-middleware';

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  return handleGenerateAudience(req, res);
}
