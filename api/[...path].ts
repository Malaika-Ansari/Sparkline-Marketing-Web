/**
 * SPARKLINE MARKETING — SERVERLESS CATCH-ALL API ROUTER
 * Route: /api/*
 * Description: Fallback router for any unmapped serverless API requests.
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { handleApiRequest } from '../src/server/ai-proxy-middleware';

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  return handleApiRequest(req, res);
}
