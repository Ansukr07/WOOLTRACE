const CEDA_BASE_URL = 'https://api.ceda.ashoka.edu.in/v1/agmarknet';

export async function fetchCedaApi(endpoint, options = {}) {
  const token = process.env.CEDA_API_TOKEN;
  if (!token) {
    throw new Error('CEDA_API_TOKEN is not configured in the environment.');
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    ...(options.headers || {})
  };

  if (options.body && typeof options.body === 'object') {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${CEDA_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  let data;
  try {
    data = await response.json();
  } catch (err) {
    const text = await response.text().catch(() => '');
    const error = new Error(`CEDA API returned non-JSON response: ${text.substring(0, 100)}`);
    error.status = response.status;
    throw error;
  }

  if (!response.ok) {
    const error = new Error(data.message || 'CEDA API Error');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function handleCedaError(error, res) {
  console.error('CEDA API Error Details:', error.message, error.data || '');
  const status = error.status || 500;
  
  if (status === 401) {
    return res.status(401).json({ error: 'Market data authorization failed.' });
  }
  if (status === 429) {
    return res.status(429).json({ error: 'Market data request limit reached. Please try again later.' });
  }
  
  return res.status(status).json({ error: 'Market data service is temporarily unavailable.' });
}
