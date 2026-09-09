export async function getMandiForecast(observations = []) {
  if (!Array.isArray(observations) || observations.length < 31) return null;
  const response = await fetch('/api/ai/mandi-forecast', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ observations })
  });
  if (!response.ok) throw new Error(`Mandi model unavailable (${response.status})`);
  const payload = await response.json();
  if (!payload.success) throw new Error(payload.message || 'Mandi model unavailable');
  return payload;
}
