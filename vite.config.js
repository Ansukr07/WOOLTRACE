import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import loginHandler from './api/login.js';
import registerHandler from './api/register.js';
import marketHandler from './api/market.js';
import marketAdvisorHandler from './api/ai/market-advisor.js';
import paymentsHandler from './api/payments.js';

const LOCAL_HANDLERS = [
  ['/api/ai/market-advisor', marketAdvisorHandler],
  ['/api/login', loginHandler],
  ['/api/register', registerHandler],
  ['/api/payments', paymentsHandler],
  ['/api/market', marketHandler]
];

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function localApiBridge() {
  return {
    name: 'khetsetu-local-api-bridge',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || '/', 'http://localhost');
        const match = LOCAL_HANDLERS.find(([path]) => url.pathname === path || url.pathname.startsWith(`${path}/`));
        if (!match) return next();

        try {
          req.query = Object.fromEntries(url.searchParams.entries());
          req.body = ['POST', 'PUT', 'PATCH'].includes(req.method || '') ? await readBody(req) : {};
          let statusCode = 200;
          let responseBody;
          const adapter = {
            status(code) { statusCode = code; return this; },
            json(data) { responseBody = data; return this; }
          };
          await match[1](req, adapter);
          res.statusCode = statusCode;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(responseBody ?? { success: false, message: 'Local API returned no response.' }));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, message: error.message || 'Local API failed.' }));
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  return {
    plugins: [react(), localApiBridge()],
    server: {
      watch: { usePolling: true, interval: 500, ignored: ['**/dist/**', '**/.git/**', '**/node_modules/**'] }
    },
    optimizeDeps: { include: ['leaflet'] }
  };
});
