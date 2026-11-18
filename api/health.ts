/**
 * SPARKLINE MARKETING — SERVERLESS API ENDPOINT
 * Route: /api/health
 * Description: Container & Load-Balancer Health Probe
 * Secure Node.js Serverless Function for Vercel, Netlify, and Cloud Deployments.
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { handleHealth } from '../src/server/ai-proxy-middleware';

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  return handleHealth(req, res);
}
