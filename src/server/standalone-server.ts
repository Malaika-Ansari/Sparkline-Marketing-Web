/**
 * SPARKLINE MARKETING — PRODUCTION STANDALONE API SERVER
 * Node.js HTTP server for containerized (Docker), Kubernetes, and VPS production deployments.
 * Mounts the complete suite of AI intelligence and calculation endpoints on a dedicated port.
 */

import http from 'http';
import { handleApiRequest } from './ai-proxy-middleware';

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

export const server = http.createServer(async (req, res) => {
  try {
    const handled = await handleApiRequest(req, res);
    if (!handled) {
      res.writeHead(404, {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
      });
      res.end(
        JSON.stringify({
          ok: false,
          error: 'NOT_FOUND',
          message: `The requested endpoint ${req.method} ${req.url} was not found on this server.`,
        })
      );
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    if (!res.headersSent) {
      res.writeHead(500, {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
      });
    }
    res.end(
      JSON.stringify({
        ok: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: errorMessage,
      })
    );
  }
});

// If executed directly via `node src/server/standalone-server.ts`
if (process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
  server.listen(PORT, HOST, () => {
    console.log(`================================================================`);
    console.log(`SPARKLINE MARKETING — PRODUCTION API SERVER`);
    console.log(`Listening on http://${HOST}:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
    console.log(`AI Proxy: ${process.env.GEMINI_API_KEY ? 'Configured (Active)' : 'Not Configured (Demo Mode)'}`);
    console.log(`================================================================`);
  });
}
