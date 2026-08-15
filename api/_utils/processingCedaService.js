import { fetchCedaApi } from './ceda.js';

/**
 * CEDA Proxy Service for Processing Unit Operations
 * Performs server-side CEDA API requests using process.env.CEDA_API_TOKEN.
 * Never exposes credentials to client.
 */
export async function getProcessingCedaData() {
  try {
    // 1. Fetch Agmarknet Commodities to ensure token validity & market awareness
    const commoditiesRes = await fetchCedaApi('/commodities').catch(() => null);

    // 2. Fetch geography mappings for Karnataka / South India wool processing hubs
    const geographiesRes = await fetchCedaApi('/geographies?commodity_id=1').catch(() => null);

    const isAvailable = Boolean(commoditiesRes || geographiesRes);

    return {
      success: true,
      serviceStatus: isAvailable ? 'ONLINE' : 'DEGRADED',
      provider: 'CEDA (Centre for Economic Data and Analysis)',
      geographies: geographiesRes?.output?.data || [],
      commoditiesCount: commoditiesRes?.output?.data?.length || 0,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[CEDA Service Error]:', error.message);
    return {
      success: false,
      serviceStatus: 'OFFLINE',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}
