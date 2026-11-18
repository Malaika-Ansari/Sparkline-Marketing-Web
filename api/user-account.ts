/**
 * SPARKLINE MARKETING — SERVERLESS API ENDPOINT
 * Route: /api/user-account
 * Description: Secure Administrative User Account & Purge Controller
 * Enforces server-side SUPABASE_SERVICE_ROLE_KEY isolation.
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { handleUserAccount } from '../src/server/ai-proxy-middleware';

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  return handleUserAccount(req, res);
}
