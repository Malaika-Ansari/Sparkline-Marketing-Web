/**
 * SPARKLINE MARKETING — SERVERLESS API ENDPOINT
 * Route: /api/audit-website-seo
 * Description: Secure Website SEO Crawler & Audit
 * Secure Node.js Serverless Function for Vercel, Netlify, and Cloud Deployments.
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { handleAuditWebsiteSeo } from '../src/server/ai-proxy-middleware';

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  return handleAuditWebsiteSeo(req, res);
}
