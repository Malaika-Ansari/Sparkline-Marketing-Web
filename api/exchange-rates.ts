/**
 * SPARKLINE MARKETING — SERVERLESS API ENDPOINT
 * Route: /api/exchange-rates
 * Description: Multi-Currency Institutional Exchange Rates
 * Secure Node.js Serverless Function for Vercel, Netlify, and Cloud Deployments.
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { handleExchangeRates } from '../src/server/ai-proxy-middleware';

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  return handleExchangeRates(req, res);
}
