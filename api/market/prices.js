import { fetchCedaApi, handleCedaError } from '../_utils/ceda.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = await fetchCedaApi('/prices', {
      method: 'POST',
      body: req.body
    });
    res.status(200).json(data);
  } catch (error) {
    handleCedaError(error, res);
  }
}
