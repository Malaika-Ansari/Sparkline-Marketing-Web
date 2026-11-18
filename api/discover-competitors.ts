/**
 * SPARKLINE MARKETING — SERVERLESS API ENDPOINT
 * Route: /api/discover-competitors
 * Description: Real-World Competitor Discovery
 * Secure Node.js Serverless Function for Vercel, Netlify, and Cloud Deployments.
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { handleDiscoverCompetitors } from '../src/server/ai-proxy-middleware';

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  return handleDiscoverCompetitors(req, res);
}
