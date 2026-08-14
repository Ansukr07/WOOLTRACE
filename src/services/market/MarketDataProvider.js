/**
 * WoolTrace Market Data Provider — Abstract Interface
 *
 * This defines the contract that every market data provider must fulfil.
 * Providers: DemoDataProvider (shipped), AgmarknetProvider (stub — needs API key).
 *
 * ALL price values returned must be in ₹ per KG.
 * AGMARKNET reports prices in ₹/quintal (÷100 to convert).
 */

/**
 * @typedef {Object} MarketRecord
 * @property {string} date          — ISO date string e.g. "2026-08-14"
 * @property {string} state
 * @property {string} district
 * @property {string} market
 * @property {string} commodity     — "Wool"
 * @property {string} variety       — "Fine" | "Medium" | "Coarse" | "Mixed"
 * @property {string} grade         — "A" | "B" | "C" | "Unknown"
 * @property {number} minPrice      — ₹/kg
 * @property {number} maxPrice      — ₹/kg
 * @property {number} modalPrice    — ₹/kg (most traded price)
 * @property {number} arrivalQty    — metric tonnes
 * @property {number} lat
 * @property {number} lng
 */

/**
 * @typedef {Object} ProviderMeta
 * @property {string} name          — Human-readable source name
 * @property {boolean} isDemo       — true → UI must show demo label
 * @property {string|null} lastUpdated — ISO datetime or null
 */

export class MarketDataProvider {
  /** @returns {ProviderMeta} */
  getMeta() { throw new Error('Not implemented'); }

  /** @returns {Promise<MarketRecord[]>} Latest price records for all markets */
  async getCurrentPrices(/* filters */) { throw new Error('Not implemented'); }

  /**
   * @param {string} market
   * @param {number} days
   * @returns {Promise<MarketRecord[]>}
   */
  async getHistoricalPrices(market, days) { throw new Error('Not implemented'); }

  /** @returns {Promise<MarketRecord[]>} Arrival quantity data */
  async getArrivals(market, days) { throw new Error('Not implemented'); }

  /** @returns {Promise<{headline:string,summary:string,source:string,date:string,category:string}[]>} */
  async getNews() { throw new Error('Not implemented'); }
}
