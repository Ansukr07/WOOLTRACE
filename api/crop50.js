import { crop50Service } from '../src/services/market/crop50Service.js';

export default async function handler(req, res) {
  const url = req.url || '';

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const indexData = crop50Service.getCurrentIndex();
    const categories = crop50Service.getCategorySubIndices();
    const topGainersLosers = crop50Service.getTopGainersAndLosers('1D');
    const contributors = crop50Service.getIndexContributors().slice(0, 10);
    const sentiment = crop50Service.getMarketSentiment();
    const chartSeries = crop50Service.getHistoricalSeries('1M');

    return res.status(200).json({
      success: true,
      data: {
        index: indexData,
        categories,
        topMovers: topGainersLosers,
        topContributors: contributors,
        sentiment,
        chart: chartSeries,
        methodology: crop50Service.metadata
      }
    });
  } catch (error) {
    console.error('CROP50 API Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
