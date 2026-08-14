import { fetchCedaApi, handleCedaError } from '../_utils/ceda.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { commodity_id } = req.query;
  if (!commodity_id) {
    return res.status(400).json({ error: 'Missing commodity_id parameter' });
  }

  try {
    const data = await fetchCedaApi(`/geographies?commodity_id=${commodity_id}`);
    res.status(200).json(data);
  } catch (error) {
    handleCedaError(error, res);
  }
}
