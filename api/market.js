import { fetchCedaApi, handleCedaError } from './_utils/ceda.js';

// ── Main dispatcher ───────────────────────────────────────────────────────
export default async function handler(req, res) {
  const url = req.url || '';

  // GET /api/market/commodities
  if (url.includes('/commodities')) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    try {
      const data = await fetchCedaApi('/commodities');
      return res.status(200).json(data);
    } catch (error) { return handleCedaError(error, res); }
  }

  // GET /api/market/geographies
  if (url.includes('/geographies')) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const { commodity_id } = req.query;
    if (!commodity_id) return res.status(400).json({ error: 'Missing commodity_id parameter' });
    try {
      const data = await fetchCedaApi(`/geographies?commodity_id=${commodity_id}`);
      return res.status(200).json(data);
    } catch (error) { return handleCedaError(error, res); }
  }

  // POST /api/market/markets
  if (url.includes('/markets')) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    try {
      const data = await fetchCedaApi('/markets', { method: 'POST', body: req.body });
      return res.status(200).json(data);
    } catch (error) { return handleCedaError(error, res); }
  }

  // POST /api/market/prices
  if (url.includes('/prices')) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    try {
      const data = await fetchCedaApi('/prices', { method: 'POST', body: req.body });
      return res.status(200).json(data);
    } catch (error) { return handleCedaError(error, res); }
  }

  // POST /api/market/quantities
  if (url.includes('/quantities')) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    try {
      const data = await fetchCedaApi('/quantities', { method: 'POST', body: req.body });
      return res.status(200).json(data);
    } catch (error) { return handleCedaError(error, res); }
  }

  return res.status(404).json({ error: 'Not found' });
}
