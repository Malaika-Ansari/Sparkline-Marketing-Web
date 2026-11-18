/**
 * SPARKLINE MARKETING — SERVERLESS CENTRALIZED API ROUTER
 * Route: /api/*
 * Description: Consolidated catch-all router for all marketing intelligence,
 *              AI strategy, analytics, currency, and SEO serverless endpoints.
 * Consolidated for Vercel Hobby Plan (12-function limit).
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { handleApiRequest } from '../src/server/ai-proxy-middleware';

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void | boolean> {
  return handleApiRequest(req, res);
}
