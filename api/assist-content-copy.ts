/**
 * SPARKLINE MARKETING — SERVERLESS API ENDPOINT
 * Route: /api/assist-content-copy
 * Description: Copywriting & Caption Assistant
 * Secure Node.js Serverless Function for Vercel, Netlify, and Cloud Deployments.
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { handleAssistContentCopy } from '../src/server/ai-proxy-middleware';

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  return handleAssistContentCopy(req, res);
}
