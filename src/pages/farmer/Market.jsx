import React, { useState, useMemo, useEffect } from 'react';
import {
  BarChart2, Target, TrendingUp, Users, Layers, FileText, DollarSign, ShieldAlert,
  Sparkles, CheckCircle2
} from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';
import { useAuth } from '../../context/AuthContext';
import {
  getPriceDiscoveryChannels, getSaleWindowRecommendation, generatePriceTrends
} from '../../services/market/marketIntelligenceService';
import { findMatchingBuyers } from '../../services/market/matchingEngine';

import MarketOverviewTab from './market_tabs/MarketOverviewTab';
import PriceDiscoveryTab from './market_tabs/PriceDiscoveryTab';
import PriceTrendsTab from './market_tabs/PriceTrendsTab';
import BuyerDiscoveryTab from './market_tabs/BuyerDiscoveryTab';
import MyLotsTab from './market_tabs/MyLotsTab';
import OffersTab from './market_tabs/OffersTab';
import TransactionsTab from './market_tabs/TransactionsTab';
import DisputesTab from './market_tabs/DisputesTab';

import './Market.css';

export default function Market() {
  const { user } = useAuth();
  const {
    batches,
    woolLots, createWoolLot, aggregateFpoLot,
    buyerDemands,
    marketOffers, respondOffer,
    marketTransactions, updateTransactionPayment, updateTransactionDelivery,
    disputes, raiseTransactionDispute
  } = useGlobalState();

  const [activeTab, setActiveTab] = useState('OVERVIEW');

  // Price Discovery Parameters
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || '');
  const [customWoolType, setCustomWoolType] = useState('FINE_MERINO');
  const [customGrade, setCustomGrade] = useState('A');
  const [customQuantity, setCustomQuantity] = useState(450);
  const [customState, setCustomState] = useState('Karnataka');
  const [customCleanliness, setCustomCleanliness] = useState(90);
  const [customMoisture, setCustomMoisture] = useState(12);
  const [transportDistance, setTransportDistance] = useState(35);
  const [storageMonths, setStorageMonths] = useState(1);

  // Trend Analysis Parameters
  const [trendPeriod, setTrendPeriod] = useState('30D');
  const [trendWoolType, setTrendWoolType] = useState('FINE_MERINO');

  // Buyer Discovery Filters
  const [buyerTypeFilter, setBuyerTypeFilter] = useState('ALL');
  const [buyerSearchQuery, setBuyerSearchQuery] = useState('');
  const [matchedBatchForBuyer, setMatchedBatchForBuyer] = useState(batches[0]?.id || '');

  // Modals & Toast State
  const [showCreateLotModal, setShowCreateLotModal] = useState(false);
  const [showFpoAggregatorModal, setShowFpoAggregatorModal] = useState(false);
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [activeOfferForCounter, setActiveOfferForCounter] = useState(null);
  const [activeTxnForDispute, setActiveTxnForDispute] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Modal Form Inputs
  const [newLotBatchId, setNewLotBatchId] = useState(batches[0]?.id || '');
  const [newLotAskingPrice, setNewLotAskingPrice] = useState(450);
  const [newLotDescription, setNewLotDescription] = useState('');
  
  const [fpoSelectedBatches, setFpoSelectedBatches] = useState([]);
  const [fpoLotAskingPrice, setFpoLotAskingPrice] = useState(425);
  const [fpoLotName, setFpoLotName] = useState('Southern Wool Growers FPO Apex');

  const [counterPrice, setCounterPrice] = useState('');
  const [counterNote, setCounterNote] = useState('');

  const [disputeCategory, setDisputeCategory] = useState('Quality Discrepancy');
  const [disputeClaim, setDisputeClaim] = useState('');
  const [disputeDescription, setDisputeDescription] = useState('');

  useEffect(() => {
    if (selectedBatchId) {
      const b = batches.find(x => (x.id || x.batchId) === selectedBatchId);
      if (b) {
        if (b.quantity) setCustomQuantity(b.quantity);
        if (b.qualityGrade) setCustomGrade(b.qualityGrade);
        if (b.origin && b.origin.includes('Rajasthan')) setCustomState('Rajasthan');
        else if (b.origin && b.origin.includes('Himachal')) setCustomState('Himachal Pradesh');
        else setCustomState('Karnataka');
      }
    }
  }, [selectedBatchId, batches]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const discoveryChannels = useMemo(() => {
    return getPriceDiscoveryChannels({
      woolType: customWoolType,
      grade: customGrade,
      quantity: customQuantity,
      state: customState,
      cleanliness: customCleanliness,
      moisture: customMoisture
    });
  }, [customWoolType, customGrade, customQuantity, customState, customCleanliness, customMoisture]);

  const saleWindowAdvisory = useMemo(() => {
    const avgChannelPrice = Math.round(discoveryChannels.reduce((sum, c) => sum + c.pricePerKg, 0) / (discoveryChannels.length || 1));
    return getSaleWindowRecommendation({
      woolType: customWoolType,
      currentPrice: avgChannelPrice,
      historicalAvg30d: 420,
      storageCostPerMonth: 4.5,
      demandLevel: 'HIGH'
    });
  }, [discoveryChannels, customWoolType]);

  const trendResult = useMemo(() => {
    return generatePriceTrends(trendPeriod, trendWoolType);
  }, [trendPeriod, trendWoolType]);

  const targetLotOrBatch = useMemo(() => {
    const b = batches.find(x => (x.id || x.batchId) === matchedBatchForBuyer) || batches[0];
    return b || { woolType: 'Fine Merino', qualityGrade: 'A', quantity: 500, askingPrice: 450, origin: 'Mandya, Karnataka' };
  }, [matchedBatchForBuyer, batches]);

  const rankedBuyers = useMemo(() => {
    let list = buyerDemands;
    if (buyerTypeFilter !== 'ALL') {
      list = list.filter(b => b.buyerType === buyerTypeFilter);
    }
    if (buyerSearchQuery) {
      const q = buyerSearchQuery.toLowerCase();
      list = list.filter(b => b.buyerName.toLowerCase().includes(q) || b.location.toLowerCase().includes(q) || b.woolType.toLowerCase().includes(q));
    }
    return findMatchingBuyers(targetLotOrBatch, list);
  }, [buyerDemands, buyerTypeFilter, buyerSearchQuery, targetLotOrBatch]);

  // Handlers
  const handleCreateLot = (e) => {
    e.preventDefault();
    const batch = batches.find(b => (b.id || b.batchId) === newLotBatchId);
    if (!batch) return;

    createWoolLot({
      batchIds: [batch.id || batch.batchId],
      sellerId: user?.id || 'FARMER-01',
      sellerName: user?.name || batch.farmerName || 'Rajesh Gowda',
      sellerType: 'FARMER',
      woolType: batch.woolType || 'Fine Merino Wool',
      qualityGrade: batch.qualityGrade || 'A',
      qualityScore: 88,
      fiberDiameter: 21.5,
      origin: batch.origin || 'Mandya, Karnataka',
      currentLocation: batch.currentLocation || 'Mysuru Storage Centre',
      totalQuantity: batch.quantity || 400,
      availableQuantity: batch.quantity || 400,
      askingPrice: Number(newLotAskingPrice),
      minAcceptablePrice: Math.round(Number(newLotAskingPrice) * 0.94),
      storageLocation: batch.warehouseName || 'Mysuru Wool Storage Centre',
      certificateId: batch.certificateId || 'WTC-QA-2026-00124',
      traceabilityUrl: `/track/${batch.id || batch.batchId}`,
      availableFrom: new Date().toISOString().split('T')[0],
      description: newLotDescription || `Fresh farm batch ${batch.id}. Verified by WoolTrace.`
    });

    setShowCreateLotModal(false);
    showToast('✓ Wool Lot created and published to verified buyer exchange!');
    setActiveTab('MY_LOTS');
  };

  const handleCreateFpoLot = (e) => {
    e.preventDefault();
    if (fpoSelectedBatches.length < 2) {
      alert('Please select at least 2 farmer batches to aggregate into an FPO bulk lot.');
      return;
    }

    aggregateFpoLot(fpoSelectedBatches, {
      fpoId: 'FPO-KA-01',
      fpoName: fpoLotName,
      woolType: 'Consolidated Commercial Fleece (Grade A/B)',
      grade: 'A/B Mix',
      askingPrice: Number(fpoLotAskingPrice),
      minAcceptablePrice: Math.round(Number(fpoLotAskingPrice) * 0.95),
      currentLocation: 'FPO Central Aggregation Depot, Mysuru',
      storageLocation: 'Mysuru Central Wool Depot',
      description: `Aggregated bulk lot from ${fpoSelectedBatches.length} member farmer batches for industrial spinning mills.`
    });

    setShowFpoAggregatorModal(false);
    setFpoSelectedBatches([]);
    showToast('✓ Consolidated FPO bulk lot successfully created with collective bargaining power!');
    setActiveTab('MY_LOTS');
  };

  const handleAcceptOffer = (offer) => {
    respondOffer(offer.id, 'ACCEPT', { actor: user?.name || 'Seller', note: 'Offer accepted. Digital contract generated.' });
    showToast(`✓ Offer ${offer.offerNumber} accepted! Transaction initiated in Escrow.`);
    setActiveTab('TRANSACTIONS');
  };

  const handleRejectOffer = (offer) => {
    respondOffer(offer.id, 'REJECT', { actor: user?.name || 'Seller', reason: 'Price expectation not met.' });
    showToast(`Offer ${offer.offerNumber} rejected.`);
  };

  const handleOpenCounter = (offer) => {
    setActiveOfferForCounter(offer);
    setCounterPrice(offer.offeredPricePerKg + 15);
    setShowCounterModal(true);
  };

  const handleSubmitCounter = (e) => {
    e.preventDefault();
    if (!activeOfferForCounter) return;
    respondOffer(activeOfferForCounter.id, 'COUNTER', {
      actor: user?.name || 'Seller',
      counterPricePerKg: Number(counterPrice),
      counterQuantityKg: activeOfferForCounter.quantityKg,
      note: counterNote || `Counter-offer of ₹${counterPrice}/KG submitted.`
    });
    setShowCounterModal(false);
    showToast(`✓ Counter-offer of ₹${counterPrice}/KG submitted to ${activeOfferForCounter.buyerName}.`);
  };

  const handleOpenDispute = (txn) => {
    setActiveTxnForDispute(txn);
    setDisputeClaim(Math.round(txn.grossValue * 0.05));
    setShowDisputeModal(true);
  };

  const handleSubmitDispute = (e) => {
    e.preventDefault();
    if (!activeTxnForDispute) return;
    raiseTransactionDispute(activeTxnForDispute.id, {
      lotNumber: activeTxnForDispute.lotNumber,
      raisedBy: 'FARMER',
      raisedByName: user?.name || 'Rajesh Gowda',
      reasonCategory: disputeCategory,
      description: disputeDescription,
      claimedAmount: Number(disputeClaim)
    });
    setShowDisputeModal(false);
    showToast(`Dispute raised on ${activeTxnForDispute.transactionNumber}. Case routed to WoolTrace Ombudsman.`);
    setActiveTab('DISPUTES');
  };

  return (
    <div className="market-hub-container">
      {toastMessage && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
          background: '#0B120D', color: '#DDFF86', padding: '12px 20px',
          borderRadius: '10px', boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
          fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Hero */}
      <div className="market-header-hero">
        <div className="market-header-top">
          <div className="market-title-group">
            <h1>
              Market Linkage & Price Discovery
              <span className="sih-badge">SIH 2026 · PS 26132</span>
            </h1>
            <p>
              Empowering farmers & FPOs with transparent mandi benchmarks, verified buyer demand, net realization analysis, and digital offer negotiations.
            </p>
          </div>
          <div className="market-header-actions">
            <div className="live-feed-pill">
              <span className="live-pulse-dot" />
              <span>CEDA / AGMARKNET Live</span>
            </div>
            <button className="cta-sell-wool-btn" onClick={() => setActiveTab('DISCOVERY')}>
              <Sparkles size={16} />
              <span>Sell My Wool</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="market-nav-tabs">
          <button className={`market-tab-btn ${activeTab === 'OVERVIEW' ? 'active' : ''}`} onClick={() => setActiveTab('OVERVIEW')}>
            <BarChart2 size={16} />
            <span>Market Overview</span>
          </button>
          <button className={`market-tab-btn ${activeTab === 'DISCOVERY' ? 'active' : ''}`} onClick={() => setActiveTab('DISCOVERY')}>
            <Target size={16} />
            <span>Price Discovery & Net Return</span>
          </button>
          <button className={`market-tab-btn ${activeTab === 'TRENDS' ? 'active' : ''}`} onClick={() => setActiveTab('TRENDS')}>
            <TrendingUp size={16} />
            <span>Price Trends & History</span>
          </button>
          <button className={`market-tab-btn ${activeTab === 'BUYERS' ? 'active' : ''}`} onClick={() => setActiveTab('BUYERS')}>
            <Users size={16} />
            <span>Buyer Discovery & Demand</span>
            <span className="tab-badge-pill lime">{buyerDemands.length}</span>
          </button>
          <button className={`market-tab-btn ${activeTab === 'MY_LOTS' ? 'active' : ''}`} onClick={() => setActiveTab('MY_LOTS')}>
            <Layers size={16} />
            <span>My Lots & FPO Lots</span>
            <span className="tab-badge-pill">{woolLots.length}</span>
          </button>
          <button className={`market-tab-btn ${activeTab === 'OFFERS' ? 'active' : ''}`} onClick={() => setActiveTab('OFFERS')}>
            <FileText size={16} />
            <span>Offers & Negotiations</span>
            <span className="tab-badge-pill coral">{marketOffers.filter(o => o.status === 'PENDING').length}</span>
          </button>
          <button className={`market-tab-btn ${activeTab === 'TRANSACTIONS' ? 'active' : ''}`} onClick={() => setActiveTab('TRANSACTIONS')}>
            <DollarSign size={16} />
            <span>Transactions & Payments</span>
            <span className="tab-badge-pill">{marketTransactions.length}</span>
          </button>
          <button className={`market-tab-btn ${activeTab === 'DISPUTES' ? 'active' : ''}`} onClick={() => setActiveTab('DISPUTES')}>
            <ShieldAlert size={16} />
            <span>Disputes</span>
            {disputes.length > 0 && <span className="tab-badge-pill coral">{disputes.length}</span>}
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'OVERVIEW' && (
        <MarketOverviewTab
          saleWindowAdvisory={saleWindowAdvisory}
          marketTransactions={marketTransactions}
          onLaunchDiscovery={() => setActiveTab('DISCOVERY')}
        />
      )}

      {activeTab === 'DISCOVERY' && (
        <PriceDiscoveryTab
          batches={batches}
          selectedBatchId={selectedBatchId} setSelectedBatchId={setSelectedBatchId}
          customWoolType={customWoolType} setCustomWoolType={setCustomWoolType}
          customGrade={customGrade} setCustomGrade={setCustomGrade}
          customQuantity={customQuantity} setCustomQuantity={setCustomQuantity}
          transportDistance={transportDistance} setTransportDistance={setTransportDistance}
          storageMonths={storageMonths} setStorageMonths={setStorageMonths}
          discoveryChannels={discoveryChannels}
          onOpenCreateLot={(price) => {
            setNewLotAskingPrice(price);
            setShowCreateLotModal(true);
          }}
        />
      )}

      {activeTab === 'TRENDS' && (
        <PriceTrendsTab
          trendPeriod={trendPeriod}
          setTrendPeriod={setTrendPeriod}
          trendResult={trendResult}
        />
      )}

      {activeTab === 'BUYERS' && (
        <BuyerDiscoveryTab
          batches={batches}
          matchedBatchForBuyer={matchedBatchForBuyer} setMatchedBatchForBuyer={setMatchedBatchForBuyer}
          buyerTypeFilter={buyerTypeFilter} setBuyerTypeFilter={setBuyerTypeFilter}
          rankedBuyers={rankedBuyers}
          onOpenSubmitLot={(budgetPrice) => {
            setNewLotAskingPrice(budgetPrice);
            setShowCreateLotModal(true);
          }}
        />
      )}

      {activeTab === 'MY_LOTS' && (
        <MyLotsTab
          woolLots={woolLots}
          onOpenFpoAggregator={() => setShowFpoAggregatorModal(true)}
          onOpenCreateLot={(price) => {
            setNewLotAskingPrice(price);
            setShowCreateLotModal(true);
          }}
        />
      )}

      {activeTab === 'OFFERS' && (
        <OffersTab
          marketOffers={marketOffers}
          onAcceptOffer={handleAcceptOffer}
          onRejectOffer={handleRejectOffer}
          onOpenCounter={handleOpenCounter}
        />
      )}

      {activeTab === 'TRANSACTIONS' && (
        <TransactionsTab
          marketTransactions={marketTransactions}
          onOpenDispute={handleOpenDispute}
          onConfirmDelivery={(txn) => {
            updateTransactionDelivery(txn.id, 'DELIVERED');
            updateTransactionPayment(txn.id, 'PAID', txn.grossValue);
            showToast(`✓ Transaction ${txn.transactionNumber} marked as Delivered and Paid!`);
          }}
        />
      )}

      {activeTab === 'DISPUTES' && (
        <DisputesTab disputes={disputes} />
      )}

      {/* MODAL: CREATE WOOL LOT */}
      {showCreateLotModal && (
        <div className="wt-modal-overlay">
          <div className="wt-modal-card">
            <div className="modal-header-row">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Create Verified Wool Lot</h3>
              <button className="btn-close-modal" onClick={() => setShowCreateLotModal(false)}>×</button>
            </div>

            <form onSubmit={handleCreateLot}>
              <div className="form-field-group" style={{ marginBottom: '14px' }}>
                <label>Select Wool Batch</label>
                <select value={newLotBatchId} onChange={(e) => setNewLotBatchId(e.target.value)}>
                  {batches.map(b => (
                    <option key={b.id || b.batchId} value={b.id || b.batchId}>
                      {b.id || b.batchId} - {b.quantity} KG ({b.woolType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field-group" style={{ marginBottom: '14px' }}>
                <label>Asking Price (₹ / KG)</label>
                <input
                  type="number"
                  value={newLotAskingPrice}
                  onChange={(e) => setNewLotAskingPrice(e.target.value)}
                  required
                />
              </div>

              <div className="form-field-group" style={{ marginBottom: '14px' }}>
                <label>Description & Notes</label>
                <textarea
                  rows="3"
                  value={newLotDescription}
                  onChange={(e) => setNewLotDescription(e.target.value)}
                  placeholder="Specify moisture baseline, shearing season, packaging..."
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(11,18,13,0.2)', fontSize: '13px' }}
                />
              </div>

              <div className="modal-action-row">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateLotModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Publish Lot to Market</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: FPO MULTI-BATCH AGGREGATOR */}
      {showFpoAggregatorModal && (
        <div className="wt-modal-overlay">
          <div className="wt-modal-card">
            <div className="modal-header-row">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>FPO Collective Bulk Lot Aggregator</h3>
              <button className="btn-close-modal" onClick={() => setShowFpoAggregatorModal(false)}>×</button>
            </div>

            <form onSubmit={handleCreateFpoLot}>
              <div className="form-field-group" style={{ marginBottom: '14px' }}>
                <label>FPO Producer Co-op Name</label>
                <input
                  type="text"
                  value={fpoLotName}
                  onChange={(e) => setFpoLotName(e.target.value)}
                  required
                />
              </div>

              <div className="form-field-group" style={{ marginBottom: '14px' }}>
                <label>Select Member Batches to Consolidate</label>
                <div style={{ maxHeight: '160px', overflowY: 'auto', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px' }}>
                  {batches.map(b => (
                    <label key={b.id || b.batchId} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', fontSize: '13px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={fpoSelectedBatches.includes(b.id || b.batchId)}
                        onChange={(e) => {
                          const id = b.id || b.batchId;
                          if (e.target.checked) setFpoSelectedBatches(prev => [...prev, id]);
                          else setFpoSelectedBatches(prev => prev.filter(x => x !== id));
                        }}
                      />
                      <span><strong>{b.id || b.batchId}</strong> ({b.quantity} KG, {b.woolType}) - {b.farmerName}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-field-group" style={{ marginBottom: '14px' }}>
                <label>Consolidated Target Asking Price (₹ / KG)</label>
                <input
                  type="number"
                  value={fpoLotAskingPrice}
                  onChange={(e) => setFpoLotAskingPrice(e.target.value)}
                  required
                />
              </div>

              <div className="modal-action-row">
                <button type="button" className="btn-secondary" onClick={() => setShowFpoAggregatorModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Consolidated FPO Bulk Lot</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: COUNTER OFFER */}
      {showCounterModal && (
        <div className="wt-modal-overlay">
          <div className="wt-modal-card">
            <div className="modal-header-row">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Submit Counter-Offer</h3>
              <button className="btn-close-modal" onClick={() => setShowCounterModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmitCounter}>
              <p style={{ fontSize: '13px', color: '#475569' }}>
                Buyer <strong>{activeOfferForCounter?.buyerName}</strong> offered ₹{activeOfferForCounter?.offeredPricePerKg}/KG.
              </p>

              <div className="form-field-group" style={{ marginBottom: '14px' }}>
                <label>Your Counter Price (₹ / KG)</label>
                <input
                  type="number"
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(e.target.value)}
                  required
                />
              </div>

              <div className="form-field-group" style={{ marginBottom: '14px' }}>
                <label>Note to Buyer</label>
                <textarea
                  rows="3"
                  value={counterNote}
                  onChange={(e) => setCounterNote(e.target.value)}
                  placeholder="Explain quality justification, moisture certifications..."
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(11,18,13,0.2)', fontSize: '13px' }}
                />
              </div>

              <div className="modal-action-row">
                <button type="button" className="btn-secondary" onClick={() => setShowCounterModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Send Counter-Offer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DISPUTE GRIEVANCE */}
      {showDisputeModal && (
        <div className="wt-modal-overlay">
          <div className="wt-modal-card">
            <div className="modal-header-row">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Raise Transaction Grievance</h3>
              <button className="btn-close-modal" onClick={() => setShowDisputeModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmitDispute}>
              <div className="form-field-group" style={{ marginBottom: '14px' }}>
                <label>Grievance Category</label>
                <select value={disputeCategory} onChange={(e) => setDisputeCategory(e.target.value)}>
                  <option value="Moisture Level Discrepancy">Moisture Level Discrepancy</option>
                  <option value="Quantity / Weight Mismatch">Quantity / Weight Mismatch</option>
                  <option value="Payment Delay">Payment Release Delay</option>
                  <option value="Freight Transit Damage">Freight Transit Damage</option>
                </select>
              </div>

              <div className="form-field-group" style={{ marginBottom: '14px' }}>
                <label>Claim Amount (₹)</label>
                <input
                  type="number"
                  value={disputeClaim}
                  onChange={(e) => setDisputeClaim(e.target.value)}
                />
              </div>

              <div className="form-field-group" style={{ marginBottom: '14px' }}>
                <label>Details & Verification Evidence</label>
                <textarea
                  rows="3"
                  value={disputeDescription}
                  onChange={(e) => setDisputeDescription(e.target.value)}
                  placeholder="Describe the discrepancy and reference weighbridge / moisture lab slips..."
                  required
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(11,18,13,0.2)', fontSize: '13px' }}
                />
              </div>

              <div className="modal-action-row">
                <button type="button" className="btn-secondary" onClick={() => setShowDisputeModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Submit to Ombudsman</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}