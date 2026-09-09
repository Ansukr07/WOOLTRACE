import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { useGlobalState } from '../../context/GlobalStateContext';
import { useAuth } from '../../context/AuthContext';
import {
  COMMODITIES,
  COMMODITY_CATEGORIES,
  getCommodityById,
  getCommoditiesByCategory,
  getMarketChannelsForCommodity,
  calculateNetRealization,
  getSaleWindowRecommendation,
  generatePriceTrends
} from '../../services/market/marketIntelligenceService';
import { calculateMatchScore } from '../../services/market/matchingEngine';

import MarketOverviewTab from './market_tabs/MarketOverviewTab';
import PriceDiscoveryTab from './market_tabs/PriceDiscoveryTab';
import PriceTrendsTab from './market_tabs/PriceTrendsTab';
import BuyerDiscoveryTab from './market_tabs/BuyerDiscoveryTab';
import MyLotsTab from './market_tabs/MyLotsTab';
import OffersTab from './market_tabs/OffersTab';
import TransactionsTab from './market_tabs/TransactionsTab';
import DisputesTab from './market_tabs/DisputesTab';
import PaymentModal from './market_tabs/PaymentModal';
import { createUpiPayment } from '../../services/payment/paymentService';

import {
  LineChart,
  Target,
  BarChart2,
  Building,
  Layers,
  FileText,
  CreditCard,
  AlertTriangle,
  Plus,
  Users,
  CheckCircle2,
  X,
  Search,
  Filter
} from 'lucide-react';
import './Market.css';

export default function Market() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { view: routeView } = useParams();
  const { user } = useAuth();

  const {
    batches = [],
    woolLots = [],
    buyerDemands = [],
    marketOffers = [],
    marketTransactions = [],
    disputes = [],
    createWoolLot = () => {},
    aggregateFpoLot = () => {},
    respondOffer = () => {},
    recordTransactionPayment = () => {},
    updateTransactionDelivery = () => {},
    raiseTransactionDispute = () => {}
  } = useGlobalState();

  const validViews = ['overview', 'discovery', 'trends', 'buyers', 'lots', 'offers', 'transactions', 'disputes'];
  const routeTab = validViews.includes(routeView) ? routeView : null;
  const [activeTab, setActiveTab] = useState(routeTab || searchParams.get('tab') || 'overview');
  const openTab = (tab) => {
    setActiveTab(tab);
    if (routeTab) {
      navigate(`/farmer/market/${tab}?crop=${selectedCommodityId}`);
      return;
    }
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('tab', tab);
      next.set('crop', selectedCommodityId);
      return next;
    });
  };

  useEffect(() => {
    if (routeTab && routeTab !== activeTab) setActiveTab(routeTab);
    const tab = searchParams.get('tab');
    if (!routeTab && tab && tab !== activeTab) setActiveTab(tab);
  }, [searchParams, activeTab, routeTab]);

  useEffect(() => {
    const legacyTab = searchParams.get('tab');
    if (!routeTab && validViews.includes(legacyTab)) {
      const crop = searchParams.get('crop') || 'WHEAT';
      navigate(`/farmer/market/${legacyTab}?crop=${crop}`, { replace: true });
    }
  }, [navigate, routeTab, searchParams]);
  
  // Commodity & Category Selector State
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedCommodityId, setSelectedCommodityId] = useState(searchParams.get('crop') || 'WHEAT');
  const [commoditySearch, setCommoditySearch] = useState('');

  // Price discovery parameters
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [quantityInput, setQuantityInput] = useState(500);
  const [selectedVariety, setSelectedVariety] = useState('Sharbati');
  const [selectedGrade, setSelectedGrade] = useState('A');
  const [distanceKm, setDistanceKm] = useState(25);
  const [storageMonths, setStorageMonths] = useState(0);
  const [timeframe, setTimeframe] = useState('30D');

  // Modals state
  const [showCreateLotModal, setShowCreateLotModal] = useState(false);
  const [showFPOModal, setShowFPOModal] = useState(false);
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [activeOfferForCounter, setActiveOfferForCounter] = useState(null);
  const [counterPrice, setCounterPrice] = useState(30);
  const [counterTerms, setCounterTerms] = useState('');
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [activeTxnForDispute, setActiveTxnForDispute] = useState(null);
  const [disputeReasonCategory, setDisputeReasonCategory] = useState('QUALITY_MISMATCH');
  const [disputeDesc, setDisputeDesc] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [paymentTransaction, setPaymentTransaction] = useState(null);

  const pageCopy = {
    overview: ['Market intelligence', 'Compare nearby mandi signals, direct buyer quotes and price movement for one crop at a time.'],
    discovery: ['Price & sale timing', 'Model price, transport, storage and sale timing before you list a lot.'],
    trends: ['Price & arrivals', 'Read price direction and arrivals without leaving the decision context.'],
    buyers: ['Buyer demand', 'Review current procurement needs and the quality specifications attached to each demand.'],
    lots: ['Sell lots & FPO', 'Create an individual lot or pool volume through your FPO.'],
    offers: ['Offers & negotiation', 'Review one clear commercial offer at a time, then accept, decline or counter.'],
    transactions: ['Trade & payments', 'Follow delivery milestones and initiate a UPI payment request for each transaction.'],
    disputes: ['Disputes', 'Raise and track a commercial grievance with its evidence and payment status.']
  };
  const [pageTitle, pageDescription] = pageCopy[activeTab] || pageCopy.overview;

  const selectedCommodity = getCommodityById(selectedCommodityId);

  useEffect(() => {
    if (selectedCommodity && selectedCommodity.varieties && selectedCommodity.varieties.length > 0) {
      setSelectedVariety(selectedCommodity.varieties[0]);
    }
  }, [selectedCommodityId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const rawChannels = getMarketChannelsForCommodity(selectedCommodityId, selectedVariety, selectedGrade);
  const channelsComparison = rawChannels.map(ch => {
    const net = calculateNetRealization({
      pricePerKg: ch.pricePerKg,
      quantityKg: quantityInput,
      distanceKm: ch.distanceKm || distanceKm,
      transportCostPerKm: ch.transportRatePerKm || 18,
      storageMonths: storageMonths,
      storageRatePerKgMonth: selectedCommodity.storageCharacteristics?.monthlyRatePerKg || 1.0,
      platformFeePercent: ch.channelId === 'APMC_MANDI' ? 1.5 : ch.channelId === 'PROCESSING_UNIT' ? 0.0 : 1.0
    });
    return { ...ch, netCalc: net };
  });

  const saleWindowAdvisory = getSaleWindowRecommendation({
    commodityId: selectedCommodityId,
    currentPrice: selectedCommodity.basePricePerKg,
    historicalAvg30d: selectedCommodity.basePricePerKg * 0.95,
    storageCostPerMonth: selectedCommodity.storageCharacteristics?.monthlyRatePerKg || 1.0,
    demandLevel: selectedCommodity.demandLevel
  });

  const priceTrendsData = generatePriceTrends(timeframe, selectedCommodityId);

  const matchedDemands = buyerDemands.map(bd => {
    const match = calculateMatchScore({
      cropId: selectedCommodityId,
      cropName: selectedCommodity.name,
      woolType: selectedCommodity.name,
      qualityGrade: selectedGrade,
      quantity: quantityInput,
      askingPrice: selectedCommodity.basePricePerKg,
      origin: 'Regional Farm Hub'
    }, bd);
    return { ...bd, matchResult: match };
  }).sort((a, b) => b.matchResult.score - a.matchResult.score);

  const availableCategories = COMMODITIES.filter(c => 
    c.id !== 'WOOL' && c.category !== 'FIBER' &&
    (selectedCategory === 'ALL' || c.category === selectedCategory) &&
    (c.name.toLowerCase().includes(commoditySearch.toLowerCase()) || c.hindiName.includes(commoditySearch))
  );

  return (
    <div className="farmer-market-page">
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          background: '#0B120D', color: '#FFFFFF', padding: '14px 22px', borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)', borderLeft: '5px solid #DDFF86',
          display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '600'
        }}>
          <CheckCircle2 size={18} color="#DDFF86" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="market-header-banner">
        <div className="header-left">
          <div className="sih-tag">Market intelligence workspace</div>
          <h1 className="market-title">{routeTab ? pageTitle : 'KhetSetu Market & Trade Network'}</h1>
          <p className="market-subtitle">
            {routeTab ? pageDescription : 'One connected workflow for mandi prices, buyer demand, quality, logistics, offers, settlement, and resolution.'}
          </p>
        </div>
        {activeTab === 'lots' && <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowCreateLotModal(true)}>
            <Plus size={16} />
            <span>Create sell lot</span>
          </button>
          <button className="btn-accent" onClick={() => setShowFPOModal(true)}>
            <Users size={16} />
            <span>Aggregate FPO lots</span>
          </button>
        </div>}
      </div>

      {/* ── Global Commodity Selector Bar ── */}
      {['overview', 'discovery', 'trends', 'buyers'].includes(activeTab) && <div style={{
        background: '#FFFFFF', border: '1px solid rgba(11,18,13,0.10)',
        borderRadius: '14px', padding: '16px 20px', marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(11,18,13,0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="#0B120D" />
            <strong style={{ fontSize: '13px', color: '#0B120D', textTransform: 'uppercase' }}>Select Commodity Category:</strong>
          </div>

          <div className="commodity-scroll-row" style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {COMMODITY_CATEGORIES.filter(cat => cat.id !== 'FIBER').map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  background: selectedCategory === cat.id ? '#0B120D' : '#F8F8F3',
                  color: selectedCategory === cat.id ? '#FFFFFF' : '#0B120D',
                  border: '1px solid rgba(11,18,13,0.10)',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Commodity Horizontal Picker */}
        <div className="commodity-scroll-row" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
          {availableCategories.map(c => {
            const isSel = c.id === selectedCommodityId;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCommodityId(c.id)}
                style={{
                  background: isSel ? '#DDFF86' : '#FFFFFF',
                  color: '#0B120D',
                  border: isSel ? '2px solid #0B120D' : '1px solid rgba(11,18,13,0.12)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  fontWeight: isSel ? '800' : '600',
                  fontSize: '13px'
                }}
              >
                <span>{c.name}</span>
                <span style={{ fontSize: '12px', fontWeight: '800', background: isSel ? '#0B120D' : '#F8F8F3', color: isSel ? '#FFFFFF' : '#0B120D', padding: '2px 6px', borderRadius: '4px' }}>
                  ₹{c.basePricePerKg}/kg
                </span>
              </button>
            );
          })}
        </div>
      </div>}

      {/* Navigation Tabs */}
      {!routeTab && <div className="market-nav-tabs">
        <button className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => openTab('overview')}>
          <LineChart size={16} />
          <span>Mandi prices</span>
        </button>
        <button className={`nav-tab ${activeTab === 'discovery' ? 'active' : ''}`} onClick={() => openTab('discovery')}>
          <Target size={16} />
          <span>Sale decision</span>
        </button>
        <button className={`nav-tab ${activeTab === 'trends' ? 'active' : ''}`} onClick={() => openTab('trends')}>
          <BarChart2 size={16} />
          <span>Price &amp; arrivals</span>
        </button>
        <button className={`nav-tab ${activeTab === 'buyers' ? 'active' : ''}`} onClick={() => openTab('buyers')}>
          <Building size={16} />
          <span>Buyer demand</span>
        </button>
        <button className={`nav-tab ${activeTab === 'lots' ? 'active' : ''}`} onClick={() => openTab('lots')}>
          <Layers size={16} />
          <span>Sell lots &amp; FPO</span>
        </button>
        <button className={`nav-tab ${activeTab === 'offers' ? 'active' : ''}`} onClick={() => openTab('offers')}>
          <FileText size={16} />
          <span>Offers ({marketOffers.filter(o => o.status === 'PENDING').length})</span>
        </button>
        <button className={`nav-tab ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => openTab('transactions')}>
          <CreditCard size={16} />
          <span>Trade &amp; payments</span>
        </button>
        <button className={`nav-tab ${activeTab === 'disputes' ? 'active' : ''}`} onClick={() => openTab('disputes')}>
          <AlertTriangle size={16} />
          <span>Disputes ({disputes.length})</span>
        </button>
      </div>}

      {/* Tab Content Panes */}
      <div className="market-tab-content">
        {activeTab === 'overview' && (
          <MarketOverviewTab
            selectedCommodityId={selectedCommodityId}
            saleWindowAdvisory={saleWindowAdvisory}
            marketTransactions={marketTransactions}
            onLaunchDiscovery={() => openTab('discovery')}
          />
        )}

        {activeTab === 'discovery' && (
          <PriceDiscoveryTab
            selectedCommodityId={selectedCommodityId}
            selectedBatchId={selectedBatchId}
            setSelectedBatchId={setSelectedBatchId}
            batches={batches}
            quantityInput={quantityInput}
            setQuantityInput={setQuantityInput}
            selectedVariety={selectedVariety}
            setSelectedVariety={setSelectedVariety}
            selectedGrade={selectedGrade}
            setSelectedGrade={setSelectedGrade}
            distanceKm={distanceKm}
            setDistanceKm={setDistanceKm}
            storageMonths={storageMonths}
            setStorageMonths={setStorageMonths}
            channelsComparison={channelsComparison}
            onSelectChannel={(ch) => {
              showToast(`Initiated lot connection with ${ch.buyerName} at ₹${ch.pricePerKg}/KG.`);
              openTab('lots');
            }}
          />
        )}

        {activeTab === 'trends' && (
          <PriceTrendsTab
            selectedCommodityId={selectedCommodityId}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
            priceTrendsData={priceTrendsData}
          />
        )}

        {activeTab === 'buyers' && (
          <BuyerDiscoveryTab
            selectedCommodityId={selectedCommodityId}
            buyerDemands={matchedDemands}
            onQuoteBuyer={(buyer) => {
              showToast(`Direct lot quote submitted to ${buyer.buyerName}.`);
              openTab('offers');
            }}
          />
        )}

        {activeTab === 'lots' && (
          <MyLotsTab
            woolLots={woolLots}
            batches={batches}
            onOpenCreateLot={() => setShowCreateLotModal(true)}
            onOpenFpoAggregator={() => setShowFPOModal(true)}
          />
        )}

        {activeTab === 'offers' && (
          <OffersTab
            marketOffers={marketOffers}
            onAcceptOffer={(offer) => {
              respondOffer(offer.id, 'ACCEPT');
              showToast(`Offer ${offer.id} accepted. Payment-ready transaction created.`);
              openTab('transactions');
            }}
            onRejectOffer={(offer) => {
              respondOffer(offer.id, 'REJECTED');
              showToast(`Offer ${offer.id} declined.`);
            }}
            onOpenCounter={(offer) => {
              setActiveOfferForCounter(offer);
              setCounterPrice(offer.offeredPricePerKg + 1.5);
              setShowCounterModal(true);
            }}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsTab
            marketTransactions={marketTransactions}
            onConfirmDelivery={(txn) => {
              updateTransactionDelivery(txn.id, 'DELIVERED');
              showToast(`Delivery confirmed for ${txn.id}. Settlement record updated.`);
            }}
            onOpenDispute={(txn) => {
              setActiveTxnForDispute(txn);
              setShowDisputeModal(true);
            }}
            onStartPayment={async (txn) => {
              try {
                const request = await createUpiPayment(txn);
                setPaymentTransaction(txn);
                setPaymentRequest(request);
              } catch (error) { showToast(error.message || 'Could not create a UPI payment request.'); }
            }}
          />
        )}

        {activeTab === 'disputes' && (
          <DisputesTab disputes={disputes} />
        )}
      </div>

      {/* ── Modal: Create Produce Lot ── */}
      {showCreateLotModal && (
        <div className="wt-modal-overlay">
          <div className="wt-modal-card">
            <div className="modal-header-row">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Create Verified Produce Lot</h3>
              <button className="btn-close-modal" onClick={() => setShowCreateLotModal(false)}><X size={20}/></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const crop = getCommodityById(form.cropId.value);
              const quantity = Number(form.quantity.value);
              const askingPrice = Number(form.askingPrice.value);
              if (!crop || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(askingPrice) || askingPrice <= 0) {
                showToast('Enter a crop, a quantity above zero, and a valid asking price.');
                return;
              }
              createWoolLot({
                cropId: crop.id,
                cropName: crop.name,
                woolType: crop.name,
                variety: form.variety.value,
                totalQuantity: quantity,
                availableQuantity: quantity,
                askingPrice,
                origin: form.origin.value,
                qualityGrade: form.qualityGrade.value,
                farmerName: user?.name || 'Ramesh Kumar'
              });
              setShowCreateLotModal(false);
              showToast('Produce lot published to national buyer marketplace!');
              openTab('lots');
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Commodity</label>
                  <select name="cropId" defaultValue={selectedCommodityId} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC' }}>
                    {COMMODITIES.filter(c => c.id !== 'WOOL' && c.category !== 'FIBER').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Variety</label>
                  <input name="variety" defaultValue={selectedCommodity.varieties[0] || 'Standard'} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC' }} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Quantity (KG)</label>
                    <input name="quantity" type="number" defaultValue="500" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC' }} required />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Asking Price (₹/KG)</label>
                    <input name="askingPrice" type="number" step="0.5" defaultValue={selectedCommodity.basePricePerKg} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC' }} required />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Quality Grade</label>
                    <select name="qualityGrade" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC' }}>
                      <option value="A+">Grade A+ (Premium)</option>
                      <option value="A">Grade A (Standard)</option>
                      <option value="B">Grade B (Fair)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Origin Location</label>
                    <input name="origin" defaultValue="Punjab / Karnataka Farm" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC' }} required />
                  </div>
                </div>
              </div>
              <div className="modal-action-row">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateLotModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Publish Lot</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: FPO Bulk Aggregation ── */}
      {showFPOModal && (
        <div className="wt-modal-overlay">
          <div className="wt-modal-card">
            <div className="modal-header-row">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>FPO Multi-Farmer Bulk Aggregator</h3>
              <button className="btn-close-modal" onClick={() => setShowFPOModal(false)}><X size={20}/></button>
            </div>
            <p style={{ fontSize: '13px', color: '#475569' }}>
              Pool smallholder produce batches into an aggregated bulk lot (1,000+ KG) to unlock corporate procurement volume premiums.
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              aggregateFpoLot({
                fpoName: 'Kisan Samridhi Producer Co. (FPO)',
                cropId: selectedCommodityId,
                cropName: selectedCommodity.name,
                woolType: selectedCommodity.name,
                targetPrice: selectedCommodity.basePricePerKg + 2.5,
                batchIds: batches.filter(batch => batch.cropId === selectedCommodityId).slice(0, 3).map(batch => batch.id || batch.batchId),
                askingPrice: selectedCommodity.basePricePerKg + 2.5
              });
              setShowFPOModal(false);
              showToast('FPO Aggregated Lot created successfully!');
              openTab('lots');
            }}>
              <div style={{ background: '#F8F8F3', padding: '14px', borderRadius: '10px', marginBottom: '14px', fontSize: '13px' }}>
                <div style={{ fontWeight: '800', marginBottom: '6px' }}>Selected Batches to Aggregate:</div>
                <div>✓ Gurpreet Singh · 1,200 KG Sharbati Wheat (Grade A)</div>
                <div>✓ Shivaji Rao · 850 KG Nashik Red Onion (Grade A)</div>
                <div style={{ marginTop: '8px', fontWeight: '800', color: '#0B120D', borderTop: '1px dashed #CCC', paddingTop: '6px' }}>
                  Total Pooled Volume: 2,050 KG
                </div>
              </div>
              <div className="modal-action-row">
                <button type="button" className="btn-secondary" onClick={() => setShowFPOModal(false)}>Cancel</button>
                <button type="submit" className="btn-accent">Confirm FPO Bulk Lot</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Counter Offer ── */}
      {showCounterModal && activeOfferForCounter && (
        <div className="wt-modal-overlay">
          <div className="wt-modal-card">
            <div className="modal-header-row">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Submit Digital Counter-Offer</h3>
              <button className="btn-close-modal" onClick={() => setShowCounterModal(false)}><X size={20}/></button>
            </div>
            <div style={{ fontSize: '13px', color: '#475569', marginBottom: '14px' }}>
              Buyer: <strong>{activeOfferForCounter.buyerName}</strong> · Current Offer: <strong>₹{activeOfferForCounter.offeredPricePerKg}/KG</strong>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Counter Price (₹/KG)</label>
                <input 
                  type="number" 
                  step="0.25"
                  value={counterPrice} 
                  onChange={(e) => setCounterPrice(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC', fontSize: '16px', fontWeight: '800' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Revised Commercial Terms</label>
                <textarea 
                  value={counterTerms} 
                  onChange={(e) => setCounterTerms(e.target.value)}
                  placeholder="e.g. 30% advance escrow deposit before farm dispatch; buyer arranges freight container."
                  rows={3}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC', fontSize: '13px' }}
                />
              </div>
            </div>
            <div className="modal-action-row">
              <button className="btn-secondary" onClick={() => setShowCounterModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => {
                respondOffer(activeOfferForCounter.id, 'COUNTERED', { price: counterPrice, terms: counterTerms });
                setShowCounterModal(false);
                showToast(`Counter-offer of ₹${counterPrice}/KG submitted to ${activeOfferForCounter.buyerName}.`);
              }}>
                Transmit Counter-Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Dispute ── */}
      {showDisputeModal && activeTxnForDispute && (
        <div className="wt-modal-overlay">
          <div className="wt-modal-card">
            <div className="modal-header-row">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Raise Commercial Dispute / Grievance</h3>
              <button className="btn-close-modal" onClick={() => setShowDisputeModal(false)}><X size={20}/></button>
            </div>
            <div style={{ fontSize: '13px', color: '#475569', marginBottom: '14px' }}>
              Transaction: <strong>{activeTxnForDispute.id}</strong> · Counterparty: <strong>{activeTxnForDispute.buyerName}</strong>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Grievance Category</label>
                <select 
                  value={disputeReasonCategory} 
                  onChange={(e) => setDisputeReasonCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC' }}
                >
                  <option value="QUALITY_MISMATCH">Quality Specification Discrepancy</option>
                  <option value="WEIGHT_SHORTAGE">Weighbridge / Quantity Discrepancy</option>
                  <option value="PAYMENT_DELAY">Escrow Payment Release Delay</option>
                  <option value="LOGISTICS_DAMAGE">Transit Damage / Delayed Pickup</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Grievance Description & Evidence</label>
                <textarea 
                  value={disputeDesc} 
                  onChange={(e) => setDisputeDesc(e.target.value)}
                  placeholder="State the discrepancy in detail. QA certificates and weighbridge receipts will be attached."
                  rows={4}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC', fontSize: '13px' }}
                />
              </div>
            </div>
            <div className="modal-action-row">
              <button className="btn-secondary" onClick={() => setShowDisputeModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => {
                raiseTransactionDispute(activeTxnForDispute.id, { reasonCategory: disputeReasonCategory, description: disputeDesc });
                setShowDisputeModal(false);
                showToast(`Dispute raised for ${activeTxnForDispute.id}. Payment is held for review.`);
                openTab('disputes');
              }}>
                Submit for CEDA / APMC Mediation
              </button>
            </div>
          </div>
        </div>
      )}
      {paymentRequest && paymentTransaction && (
        <PaymentModal transaction={paymentTransaction} payment={paymentRequest} onClose={() => { setPaymentRequest(null); setPaymentTransaction(null); }} onPaid={(paidPayment) => {
          recordTransactionPayment(paymentTransaction.id, { amount: paidPayment.amount, status: paidPayment.status, method: paidPayment.method, reference: paidPayment.reference, gateway: paidPayment.gateway, paidAt: paidPayment.paidAt });
          setPaymentRequest(null); setPaymentTransaction(null); showToast(`UPI payment ${paidPayment.reference} recorded successfully.`);
        }} />
      )}
    </div>
  );
}
