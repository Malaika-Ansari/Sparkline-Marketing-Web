/**
 * SPARKLINE MARKETING — SERVERLESS ROOT API
 * Route: /api
 * Description: Root API entrypoint and service health catalog.
 * Consolidated for Vercel Hobby Plan (12-function limit).
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { handleApiRequest } from '../src/server/ai-proxy-middleware';

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void | boolean> {
  return handleApiRequest(req, res);
}
