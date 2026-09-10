const normalizeOrigin = (value = '') => String(value).trim().replace(/\/$/, '');

const allowedOrigins = () => new Set([
  normalizeOrigin(process.env.PUBLIC_APP_URL),
  normalizeOrigin(process.env.FRONTEND_URL),
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
].filter(Boolean));

export function handleCors(req, res) {
  const origin = normalizeOrigin(req.headers?.origin);
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
  const isAllowed = !origin || isLocal || allowedOrigins().has(origin);

  if (origin && isAllowed) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Id, X-User-Email, X-Telegram-Bot-Api-Secret-Token');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (!isAllowed) {
    res.status(403).json({ success: false, message: 'Origin is not allowed' });
    return true;
  }
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

export function getApiRoute(req) {
  const captured = Array.isArray(req.query?.route) ? req.query.route[0] : req.query?.route;
  return captured ? `/${String(captured).replace(/^\/+/, '')}` : (req.url || '');
}
