/**
 * SPARKLINE MARKETING — SERVERLESS API ENDPOINT
 * Route: /api/generate-seo-content
 * Description: AI SEO Content Blueprint Generator
 * Secure Node.js Serverless Function for Vercel, Netlify, and Cloud Deployments.
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { handleGenerateSeoContent } from '../src/server/ai-proxy-middleware';

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  return handleGenerateSeoContent(req, res);
}
