/**
 * SPARKLINE MARKETING — SERVERLESS ROOT API
 * Route: /api
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { handleHealth } from '../src/server/ai-proxy-middleware';

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  return handleHealth(req, res);
}
