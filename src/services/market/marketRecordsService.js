const KIND_TO_KEY = { LOT: 'lots', DEMAND: 'demands', OFFER: 'offers', TRANSACTION: 'transactions', DISPUTE: 'disputes' };

export async function fetchMarketRecords() {
  const response = await fetch('/api/market-records');
  if (!response.ok) throw new Error(`Market sync failed (${response.status})`);
  const data = await response.json();
  return (data.records || []).reduce((grouped, record) => {
    const key = KIND_TO_KEY[record.kind];
    if (key) grouped[key].push(record);
    return grouped;
  }, { lots: [], demands: [], offers: [], transactions: [], disputes: [] });
}

export async function upsertMarketRecord(kind, record) {
  const response = await fetch('/api/market-records', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kind, record })
  });
  if (!response.ok) throw new Error(`Market sync failed (${response.status})`);
  return response.json();
}
