/**
 * KHETSETU - Market Intelligence & CROP50 National Crop Market Index
 * SIH 2026 Problem Statement 26132 Solution
 * 
 * Includes CROP50 National Agricultural Commodity Index, Sub-Indices, Movers & Farmer Decision Layer.
 * Multi-Language: English (Default), Hindi (हिंदी), Kannada (ಕನ್ನಡ), Tamil (தமிழ்)
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../context/GlobalStateContext';
import { useAuth } from '../../context/AuthContext';
import { COMMODITIES, getCommodityById } from '../../services/market/cropCommodityRegistry';
import { calculateNetRealization, getMarketChannelsForCommodity } from '../../services/market/marketIntelligenceService';
import { calculateMatchScore } from '../../services/market/matchingEngine';
import { getPriceForecastAndRecommendation } from '../../services/market/priceforecastService';
import { getMandiForecast } from '../../services/market/mandiForecastService';
import { agmarknetService, formatDate, getDateOffset } from '../../services/market/agmarknetService';
import { crop50Service, CROP50_METADATA } from '../../services/market/crop50Service';
import { calculateWoolQualityPrice, compareOfferToQualityReference } from '../../services/market/woolQualityPricingService';
import { qaService } from '../../services/qa/qaService';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import QRCode from 'react-qr-code';
import './KhetSetu.css';

import {
  TrendingUp, TrendingDown, MapPin, Check, ChevronDown, ChevronUp,
  ShieldCheck, ArrowRight, PackagePlus, WalletCards,
  MessageSquareWarning, Gavel, X, Sparkles, Filter, Info, Building2,
  Truck, Award, FileText, CheckCircle2, BarChart3, Globe, ArrowLeft,
  Compass, Activity, HelpCircle, ClipboardList, Users
} from 'lucide-react';

const TRANSLATIONS = {
  en: {
    brandTitle: 'KHETSETU',
    brandSubtitle: 'Field Bridge',
    headerTitle: 'Market Intelligence & Direct Price Discovery',
    backToHome: 'Back to Landing Page',
    cropLabel: 'CROP / COMMODITY',
    mandiLocation: 'MANDI LOCATION',
    tabCrop50: 'CROP50 National Index',
    tabOverview: 'Market Overview & Forecast',
    tabChannels: 'Net Realization Channels',
    tabBuyers: 'Verified Buyers',
    tabDemand: 'Demand by Quality',
    tabLots: 'My Sell Lots',
    tabPayments: 'Payments & Settlement',
    tabDisputes: 'Resolution Desk',
    currentPriceLabel: 'CURRENT MODAL PRICE (CEDA / AGMARKNET)',
    arrivalsLabel: "TODAY'S ARRIVALS",
    demandLabel: 'VERIFIED BUYER DEMAND',
    pressureLabel: 'MARKET PRESSURE SIGNAL',
    pressureSignal: 'BUYER COMPETITION HIGH',
    pressureDesc: 'Demand exceeds local arrivals by 3.06x. Upward price support detected.',
    advisoryEyebrow: 'EXPLAINABLE SALE-WINDOW ADVISORY',
    shouldSellQuestion: 'Should I sell',
    nowOrHold: 'now or hold?',
    expectedRangeLabel: 'EXPECTED 7-DAY PRICE RANGE',
    upsideLabel: 'POTENTIAL UPSIDE',
    confidenceLabel: 'CONFIDENCE LEVEL',
    createLotBtn: 'Create Sell Lot Now',
    whyReasoning: 'Why is this recommendation given? (Empirical Market Signals)',
    nearbyTitle: 'Nearby Mandi Price Comparison',
    nearbySub: 'Spot rates across neighboring district markets',
    netIntroEyebrow: 'NET REALIZATION CALCULATOR',
    netIntroTitle: "Don't look at headline prices alone - compare NET earnings",
    netIntroDesc: 'KhetSetu automatically deducts transport freight, storage fees, and mandatory mandi cess to show what you actually take home.',
    bestNetBadge: 'HIGHEST NET REALIZATION',
    bestNetHigher: 'HIGHER than selling at local APMC Mandi',
    grossOffered: 'Gross Offered Price',
    freightMinus: '- Freight',
    feesMinus: '- Mandi Fees / Cess',
    storageMinus: '- Storage / Handling',
    estimatedNet: 'ESTIMATED NET REALIZATION',
    requestQuote: 'Request Quote',
    postLotToAll: 'Post Sell Lot to All Buyers',
    verifiedBusiness: 'Platform Verified Business',
    matchScore: 'MATCH SCORE',
    reqCommodity: 'REQUIRED COMMODITY',
    demandVolume: 'DEMAND VOLUME',
    offeredPrice: 'OFFERED PRICE',
    deliveryDeadline: 'DELIVERY DEADLINE',
    paymentRel: 'Payment Reliability',
    avgPayTime: 'Avg Payment Time',
    completedPurchases: 'Completed Purchases',
    disputeRate: 'Dispute Rate',
    whyBuyerRecommended: 'Why is this buyer recommended? (Match Breakdown)',
    sendOfferBtn: 'Send Offer to Buyer',
    dynamicQualityTitle: 'DYNAMIC QUALITY SPECIFICATIONS',
    demandByQualityTitle: 'Demand by Crop & Quality',
    demandByQualitySub: 'Quality specifications dynamically generated from KhetSetu Commodity Registry',
    qualitySchemaHead: 'Dynamic Quality Schema for',
    demandVolumeByGrade: 'Demand Volume by Quality Grade',
    myLotsHead: 'My Active Sell Lots',
    myLotsSub: 'Track created produce lots, matched buyers, and direct buyer offers',
    createNewLot: 'Create New Sell Lot',
    matchedBuyersCount: 'MATCHED BUYERS',
    minAcceptablePrice: 'MIN ACCEPTABLE PRICE',
    bestOfferReceived: 'BEST OFFER RECEIVED',
    saleWindow: 'SALE WINDOW',
    statusLabel: 'STATUS',
    negotiationActive: 'Negotiation Active',
    timelineTitle: 'Transparent Transaction Timeline',
    respondToOffer: 'Respond to Offer',
    settleUpi: 'Settle Payment via UPI',
    paymentsHead: 'Transparent Payment Release',
    paymentsSub: 'Every transaction record is timestamped from offer acceptance to bank/UPI release.',
    availableToSettle: 'AVAILABLE TO SETTLE',
    settleDbt: 'Settle via UPI / Bank DBT',
    disputeHead: 'Grievance & Dispute Resolution',
    disputeSub: 'Escalate quality, weight, or logistics issues with complete transaction evidence.',
    noOpenGrievances: 'No open grievances',
    noGrievanceSub: 'All your transaction records are clear and verified.',
    raiseGrievanceBtn: 'Raise a Grievance'
  },
  hi: {
    brandTitle: 'खेत सेतु',
    brandSubtitle: 'फील्ड ब्रिज',
    headerTitle: 'मंडी भाव सूचना एवं CROP50 राष्ट्रीय सूचकांक',
    backToHome: 'मुख्य पृष्ठ पर वापस जाएं',
    cropLabel: 'फसल / उपज',
    mandiLocation: 'मंडी स्थान',
    tabCrop50: 'CROP50 राष्ट्रीय सूचकांक',
    tabOverview: 'मंडी अवलोकन एवं पूर्वानुमान',
    tabChannels: 'शुद्ध प्राप्ति चैनल',
    tabBuyers: 'सत्यापित खरीदार',
    tabDemand: 'गुणवत्ता अनुसार मांग',
    tabLots: 'मेरे विक्रय लॉट',
    tabPayments: 'भुगतान एवं निपटान',
    tabDisputes: 'समाधान सहायता',
    currentPriceLabel: 'वर्तमान मॉडल भाव (CEDA / एग्मार्कनेट)',
    arrivalsLabel: 'आज की आवक',
    demandLabel: 'सत्यापित खरीदार मांग',
    pressureLabel: 'मंडी दबाव संकेत',
    pressureSignal: 'खरीदार प्रतिस्पर्धा उच्च',
    pressureDesc: 'मांग स्थानीय आवक से 3.06 गुना अधिक है। मूल्य वृद्धि के संकेत।',
    advisoryEyebrow: 'बिक्री-समय परामर्श',
    shouldSellQuestion: 'क्या मुझे',
    nowOrHold: 'अभी बेचना चाहिए या प्रतीक्षा करें?',
    expectedRangeLabel: '7-दिवसीय अनुमानित मूल्य सीमा',
    upsideLabel: 'संभावित लाभ',
    confidenceLabel: 'विश्वसनीयता स्तर',
    createLotBtn: 'नया विक्रय लॉट बनाएं',
    whyReasoning: 'यह सिफारिश क्यों दी गई है? (बाजार संकेत)',
    nearbyTitle: 'निकटवर्ती मंडी भाव तुलना',
    nearbySub: 'पड़ोसी जिला मंडियों में हाजिर भाव',
    netIntroEyebrow: 'शुद्ध प्राप्ति कैलकुलेटर',
    netIntroTitle: 'केवल मुख्य भाव न देखें - शुद्ध लाभ की तुलना करें',
    netIntroDesc: 'खेत सेतु परिवहन, भंडारण और मंडी सेस काटकर आपकी वास्तविक शुद्ध आय दिखाता है।',
    bestNetBadge: 'सर्वोत्तम शुद्ध प्राप्ति',
    bestNetHigher: 'स्थानीय मंडी से अधिक शुद्ध लाभ',
    grossOffered: 'सकल प्रस्तावित मूल्य',
    freightMinus: '- परिवहन भाड़ा',
    feesMinus: '- मंडी सेस / शुल्क',
    storageMinus: '- भंडारण शुल्क',
    estimatedNet: 'अनुमानित शुद्ध प्राप्ति',
    requestQuote: 'कोटेशन का अनुरोध करें',
    postLotToAll: 'सभी खरीदारों को लॉट भेजें',
    verifiedBusiness: 'प्लेटफॉर्म सत्यापित खरीदार',
    matchScore: 'मैच स्कोर',
    reqCommodity: 'आवश्यक उपज',
    demandVolume: 'मांग मात्रा',
    offeredPrice: 'प्रस्तावित भाव',
    deliveryDeadline: 'डिलीवरी समयसीमा',
    paymentRel: 'भुगतान विश्वसनीयता',
    avgPayTime: 'औसत भुगतान समय',
    completedPurchases: 'पूर्ण खरीदारी',
    disputeRate: 'विवाद दर',
    whyBuyerRecommended: 'यह खरीदार क्यों अनुशंसित है? (मैच विवरण)',
    sendOfferBtn: 'खरीदार को प्रस्ताव भेजें',
    dynamicQualityTitle: 'गतिशील गुणवत्ता विनिर्देश',
    demandByQualityTitle: 'उपज और गुणवत्ता अनुसार मांग',
    demandByQualitySub: 'खेत सेतु कमोडिटी रजिस्ट्री से स्वचालित गुणवत्ता विनिर्देश',
    qualitySchemaHead: 'गुणवत्ता मानदंड:',
    demandVolumeByGrade: 'ग्रेड अनुसार मांग मात्रा',
    myLotsHead: 'मेरे सक्रिय विक्रय लॉट',
    myLotsSub: 'निर्मित लॉट, मेल खाने वाले खरीदार और सीधे प्रस्ताव देखें',
    createNewLot: 'नया विक्रय लॉट बनाएं',
    matchedBuyersCount: 'मेल खाने वाले खरीदार',
    minAcceptablePrice: 'न्यूनतम स्वीकार्य भाव',
    bestOfferReceived: 'प्राप्त सर्वोत्तम प्रस्ताव',
    saleWindow: 'विक्रय अवधि',
    statusLabel: 'स्थिति',
    negotiationActive: 'बातचीत सक्रिय',
    timelineTitle: 'पारदर्शी लेनदेन समयसीमा',
    respondToOffer: 'प्रस्ताव का उत्तर दें',
    settleUpi: 'UPI द्वारा भुगतान प्राप्त करें',
    paymentsHead: 'पारदर्शी भुगतान निपटान',
    paymentsSub: 'प्रस्ताव स्वीकृति से लेकर बैंक/UPI रिलीज तक हर रिकॉर्ड समय-मुद्रित है।',
    availableToSettle: 'निपटान हेतु उपलब्ध',
    settleDbt: 'UPI / बैंक DBT द्वारा निपटान',
    disputeHead: 'शिकायत एवं विवाद समाधान',
    disputeSub: 'लेनदेन प्रमाण के साथ गुणवत्ता या वजन संबंधी मुद्दे दर्ज करें।',
    noOpenGrievances: 'कोई खुला विवाद नहीं',
    noGrievanceSub: 'आपके सभी लेनदेन रिकॉर्ड स्पष्ट और सत्यापित हैं।',
    raiseGrievanceBtn: 'शिकायत दर्ज करें'
  },
  kn: {
    brandTitle: 'ಖೇತ್ ಸೇತು',
    brandSubtitle: 'ಫೀಲ್ಡ್ ಬ್ರಿಡ್ಜ್',
    headerTitle: 'ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ ಮತ್ತು CROP50 ರಾಷ್ಟ್ರೀಯ ಸೂಚ್ಯಂಕ',
    backToHome: 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
    cropLabel: 'ಬೆಳೆ / ಕೃಷಿ ಉತ್ಪನ್ನ',
    mandiLocation: 'ಮಂಡಿ ಸ್ಥಳ',
    tabCrop50: 'CROP50 ರಾಷ್ಟ್ರೀಯ ಸೂಚ್ಯಂಕ',
    tabOverview: 'ಮಾರುಕಟ್ಟೆ ಅವಲೋಕನ ಮತ್ತು ಮುನ್ಸೂಚನೆ',
    tabChannels: 'ನಿವ್ವಳ ಗಳಿಕೆಯ ಚಾನೆಲ್‌ಗಳು',
    tabBuyers: 'ಪರಿಶೀಲಿತ ಖರೀದಿದಾರರು',
    tabDemand: 'ಗುಣಮಟ್ಟದ ಆಧಾರಿತ ಬೇಡಿಕೆ',
    tabLots: 'ನನ್ನ ಮಾರಾಟ ಲಾಟ್‌ಗಳು',
    tabPayments: 'ಪಾವತಿಗಳು ಮತ್ತು ಇತ್ಯರ್ಥ',
    tabDisputes: 'ಪರಿಹಾರ ಕೇಂದ್ರ',
    currentPriceLabel: 'ಪ್ರಸ್ತುತ ಮಾದರಿ ಬೆಲೆ (CEDA / AGMARKNET)',
    arrivalsLabel: 'ಇಂದಿನ ಒಳಹರಿವು',
    demandLabel: 'ಪರಿಶೀಲಿತ ಖರೀದಿದಾರರ ಬೇಡಿಕೆ',
    pressureLabel: 'ಮಾರುಕಟ್ಟೆ ಒತ್ತಡ ಸಂಕೇತ',
    pressureSignal: 'ಖರೀದಿದಾರರ ಸ್ಪರ್ಧೆ ಹೆಚ್ಚು',
    pressureDesc: 'ಬೇಡಿಕೆಯು ಸ್ಥಳೀಯ ಒಳಹರಿವಿಗಿಂತ 3.06 ಪಟ್ಟು ಹೆಚ್ಚಾಗಿದೆ.',
    advisoryEyebrow: 'ಮಾರಾಟ ಸಮಯದ ಸಲಹೆ',
    shouldSellQuestion: 'ನಾನು',
    nowOrHold: 'ಈಗ ಮಾರಾಟ ಮಾಡಬೇಕೇ ಅಥವಾ ಕಾಯಬೇಕೇ?',
    expectedRangeLabel: '7-ದಿನಗಳ ನಿರೀಕ್ಷಿತ ಬೆಲೆ ಶ್ರೇಣಿ',
    upsideLabel: 'ಸಂಭಾವ್ಯ ಹೆಚ್ಚುವರಿ ಲಾಭ',
    confidenceLabel: 'ವಿಶ್ವಾಸಾರ್ಹತೆಯ ಮಟ್ಟ',
    createLotBtn: 'ಮಾರಾಟ ಲಾಟ್ ರಚಿಸಿ',
    whyReasoning: 'ಈ ಶಿಫಾರಸು ಏಕೆ ನೀಡಲಾಗಿದೆ? (ಮಾರುಕಟ್ಟೆ ಸಂಕೇತಗಳು)',
    nearbyTitle: 'ಹತ್ತಿರದ ಮಂಡಿ ಬೆಲೆ ಹೋಲಿಕೆ',
    nearbySub: 'ನೆರೆಯ ಜಿಲ್ಲಾ ಮಾರುಕಟ್ಟೆಗಳ ದರಗಳು',
    netIntroEyebrow: 'ನಿವ್ವಳ ಗಳಿಕೆ ಕ್ಯಾಲ್ಕುಲೇಟರ್',
    netIntroTitle: 'ಕೇವಲ ಪ್ರಮುಖ ಬೆಲೆಯನ್ನು ನೋಡಬೇಡಿ - ನಿವ್ವಳ ಗಳಿಕೆಯನ್ನು ಹೋಲಿಸಿ',
    netIntroDesc: 'ಸಾರಿಗೆ, ಗೋದಾಮು ಮತ್ತು ಮಂಡಿ ಶುಲ್ಕಗಳನ್ನು ಕಳೆದು ನಿಮ್ಮ ನಿವ್ವಳ ಆದಾಯವನ್ನು ತೋರಿಸುತ್ತದೆ.',
    bestNetBadge: 'ಅತ್ಯುತ್ತಮ ನಿವ್ವಳ ಗಳಿಕೆ',
    bestNetHigher: 'ಸ್ಥಳೀಯ ಮಂಡಿಗಿಂತ ಹೆಚ್ಚು ನಿವ್ವಳ ಲಾಭ',
    grossOffered: 'ಒಟ್ಟು ಪ್ರಸ್ತಾಪಿತ ಬೆಲೆ',
    freightMinus: '- ಸಾರಿಗೆ ವೆಚ್ಚ',
    feesMinus: '- ಮಂಡಿ ಶುಲ್ಕಗಳು',
    storageMinus: '- ಗೋದಾಮು ಶುಲ್ಕ',
    estimatedNet: 'ಅಂದಾಜು ನಿವ್ವಳ ಗಳಿಕೆ',
    requestQuote: 'ದರ ಕೇಳಿ',
    postLotToAll: 'ಎಲ್ಲಾ ಖರೀದಿದಾರರಿಗೆ ಲಾಟ್ ಪೋಸ್ಟ್ ಮಾಡಿ',
    verifiedBusiness: 'ಪರಿಶೀಲಿತ ವ್ಯಾಪಾರ',
    matchScore: 'ಹೊಂದಾಣಿಕೆ ಸ್ಕೋರ್',
    reqCommodity: 'ಅಗತ್ಯವಿರುವ ಉತ್ಪನ್ನ',
    demandVolume: 'ಬೇಡಿಕೆಯ ಪ್ರಮಾಣ',
    offeredPrice: 'ಪ್ರಸ್ತಾಪಿತ ಬೆಲೆ',
    deliveryDeadline: 'ವಿತರಣೆಯ ಗಡುವು',
    paymentRel: 'ಪಾವತಿ ವಿಶ್ವಾಸಾರ್ಹತೆ',
    avgPayTime: 'ಸರಾಸರಿ ಪಾವತಿ ಸಮಯ',
    completedPurchases: 'ಪೂರ್ಣಗೊಂಡ ಖರೀದಿಗಳು',
    disputeRate: 'ವಿವಾದ ದರ',
    whyBuyerRecommended: 'ಈ ಖರೀದಿದಾರನನ್ನು ಏಕೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ?',
    sendOfferBtn: 'ಖರೀದಿದಾರರಿಗೆ ಆಫರ್ ಕಳುಹಿಸಿ',
    dynamicQualityTitle: 'ಗುಣಮಟ್ಟದ ಮಾನದಂಡಗಳು',
    demandByQualityTitle: 'ಉತ್ಪನ್ನ ಮತ್ತು ಗುಣಮಟ್ಟ ಆಧಾರಿತ ಬೇಡಿಕೆ',
    demandByQualitySub: 'ಖೇತ್ ಸೇತು ಕಮಾಡಿಟಿ ರಿಜಿಸ್ಟ್ರಿಯಿಂದ ಗುಣಮಟ್ಟದ ಮಾನದಂಡಗಳು',
    qualitySchemaHead: 'ಗುಣಮಟ್ಟದ ಮಾನದಂಡ:',
    demandVolumeByGrade: 'ಗ್ರೇಡ್ ಪ್ರಕಾರ ಬೇಡಿಕೆ ಪ್ರಮಾಣ',
    myLotsHead: 'ನನ್ನ ಸಕ್ರಿಯ ಮಾರಾಟ ಲಾಟ್‌ಗಳು',
    myLotsSub: 'ರಚಿಸಲಾದ ಲಾಟ್‌ಗಳು ಮತ್ತು ಖರೀದಿದಾರರ ಕೊಡುಗೆಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    createNewLot: 'ಹೊಸ ಮಾರಾಟ ಲಾಟ್ ರಚಿಸಿ',
    matchedBuyersCount: 'ಹೊಂದಾಣಿಕೆಯಾದ ಖರೀದಿದಾರರು',
    minAcceptablePrice: 'ಕನಿಷ್ಠ ಸ್ವೀಕಾರಾರ್ಹ ಬೆಲೆ',
    bestOfferReceived: 'ಸ್ವೀಕರಿಸಿದ ಅತ್ಯುತ್ತಮ ಆಫರ್',
    saleWindow: 'ಮಾರಾಟದ ಅವಧಿ',
    statusLabel: 'ಸ್ಥಿತಿ',
    negotiationActive: 'ಚರ್ಚೆ ಸಕ್ರಿಯವಾಗಿದೆ',
    timelineTitle: 'ಪಾರದರ್ಶಕ ವಹಿವಾಟು ಟೈಮ್‌ಲೈನ್',
    respondToOffer: 'ಆಫರ್‌ಗೆ ಪ್ರತಿಕ್ರಿಯಿಸಿ',
    settleUpi: 'UPI ಮೂಲಕ ಇತ್ಯರ್ಥಗೊಳಿಸಿ',
    paymentsHead: 'ಪಾರದರ್ಶಕ ಪಾವತಿ ಬಿಡುಗಡೆ',
    paymentsSub: 'ಆಫರ್ ಸ್ವೀಕಾರದಿಂದ ಬ್ಯಾಂಕ್/UPI ವರೆಗೆ ಪ್ರತಿ ದಾಖಲೆಯೂ ಸಮಯ-ಮುದ್ರಿತವಾಗಿದೆ.',
    availableToSettle: 'ಇತ್ಯರ್ಥಕ್ಕೆ ಲಭ್ಯವಿದೆ',
    settleDbt: 'UPI / ಬ್ಯಾಂಕ್ DBT ಮೂಲಕ ಪಾವತಿಸಿ',
    disputeHead: 'ದೂರು ಮತ್ತು ವಿವಾದ ಪರಿಹಾರ',
    disputeSub: 'ವಹಿವಾಟಿನ ಪುರಾವೆಗಳೊಂದಿಗೆ ಗುಣಮಟ್ಟ ಅಥವಾ ತೂಕದ ಸಮಸ್ಯೆಗಳನ್ನು ಪರಿಹರಿಸಿ.',
    noOpenGrievances: 'ಯಾವುದೇ ತೆರೆದ ವಿವಾದಗಳಿಲ್ಲ',
    noGrievanceSub: 'ನಿಮ್ಮ ಎಲ್ಲಾ ವಹಿವಾಟು ದಾಖಲೆಗಳು ಸ್ಪಷ್ಟವಾಗಿವೆ.',
    raiseGrievanceBtn: 'ದೂರು ದಾಖಲಿಸಿ'
  },
  ta: {
    brandTitle: 'கேத் சேது',
    brandSubtitle: 'ஃபீல்ட் பிரிட்ஜ்',
    headerTitle: 'சந்தை நுண்ணறிவு மற்றும் CROP50 தேசிய குறியீடு',
    backToHome: 'முகப்புப் பக்கத்திற்குத் திரும்பு',
    cropLabel: 'பயிர் / விளைபொருள்',
    mandiLocation: 'சந்தை இடம்',
    tabCrop50: 'CROP50 தேசிய குறியீடு',
    tabOverview: 'சந்தை கண்ணோட்டம் & முன்னறிவிப்பு',
    tabChannels: 'நிகர வரவு வழிகள்',
    tabBuyers: 'சரிபார்க்கப்பட்ட வாங்குபவர்கள்',
    tabDemand: 'தரத்தின் அடிப்படையிலான தேவை',
    tabLots: 'எனது விற்பனை லாட்கள்',
    tabPayments: 'பணம் செலுத்துதல் & தீர்வு',
    tabDisputes: 'தீர்க்கும் மையம்',
    currentPriceLabel: 'தற்போதைய மாதிரி விலை (CEDA / AGMARKNET)',
    arrivalsLabel: 'இன்றைய சந்தை வரத்து',
    demandLabel: 'சரிபார்க்கப்பட்ட வாங்குபவர் தேவை',
    pressureLabel: 'சந்தை அழுத்த சமிக்ஞை',
    pressureSignal: 'வாங்குபவர் போட்டி அதிகம்',
    pressureDesc: 'தேவை உள்ளூர் வரத்தை விட 3.06 மடங்கு அதிகமாக உள்ளது.',
    advisoryEyebrow: 'விற்பனை நேர ஆலோசனை',
    shouldSellQuestion: 'நான்',
    nowOrHold: 'இப்போது விற்க வேண்டுமா அல்லது வைத்திருக்க வேண்டுமா?',
    expectedRangeLabel: '7-நாள் எதிர்பார்க்கப்படும் விலை வரம்பு',
    upsideLabel: 'சாத்தியமான கூடுதல் லாபம்',
    confidenceLabel: 'நம்பகத்தன்மை நிலை',
    createLotBtn: 'விற்பனை லாட் உருவாக்கு',
    whyReasoning: 'இந்த பரிந்துரை ஏன் வழங்கப்பட்டது? (சந்தை சமிக்ஞைகள்)',
    nearbyTitle: 'அருகிலுள்ள மண்டி விலை ஒப்பீடு',
    nearbySub: 'அண்டை மாவட்ட சந்தைகளின் விலை நிலவரம்',
    netIntroEyebrow: 'நிகர வரவு கால்குலேட்டர்',
    netIntroTitle: 'முக்கிய விலையை மட்டும் பார்க்காதீர்கள் - நிகர வருவாயை ஒப்பிடுங்கள்',
    netIntroDesc: 'போக்குவரத்து, சேமிப்பு மற்றும் மண்டி வரிகளை கழித்து உங்கள் உண்மையான நிகர வருவாயைக் காட்டுகிறது.',
    bestNetBadge: 'சிறந்த நிகர வரவு',
    bestNetHigher: 'உள்ளூர் மண்டியை விட அதிக நிகர வருவாய்',
    grossOffered: 'மொத்த விலை',
    freightMinus: '- போக்குவரத்து கட்டணம்',
    feesMinus: '- மண்டி கட்டணம்',
    storageMinus: '- சேமிப்பு கட்டணம்',
    estimatedNet: 'மதிப்பிடப்பட்ட நிகர வருவாய்',
    requestQuote: 'விலைப்புள்ளி கோருங்கள்',
    postLotToAll: 'அனைத்து வாங்குபவர்களுக்கும் லாட் அனுப்பவும்',
    verifiedBusiness: 'சரிபார்க்கப்பட்ட வணிகம்',
    matchScore: 'பொருத்தம் மதிப்பெண்',
    reqCommodity: 'தேவையான விளைபொருள்',
    demandVolume: 'தேவை அளவு',
    offeredPrice: 'வழங்கப்படும் விலை',
    deliveryDeadline: 'டெலிவரி காலக்கெடு',
    paymentRel: 'பணம் செலுத்தும் நம்பகத்தன்மை',
    avgPayTime: 'சராசரி பணம் செலுத்தும் நேரம்',
    completedPurchases: 'முடிக்கப்பட்ட கொள்முதல்',
    disputeRate: 'சர்ச்சை விகிதம்',
    whyBuyerRecommended: 'இந்த வாங்குபவர் ஏன் பரிந்துரைக்கப்படுகிறார்?',
    sendOfferBtn: 'வாங்குபவருக்கு சலுகையை அனுப்பு',
    dynamicQualityTitle: 'டைனமிக் தர விவரக்குறிப்புகள்',
    demandByQualityTitle: 'பயிர் மற்றும் தரத்தின் அடிப்படையிலான தேவை',
    demandByQualitySub: 'கேத் சேது கமாடிட்டி பதிவேட்டிலிருந்து தர விவரக்குறிப்புகள்',
    qualitySchemaHead: 'தர விவரக்குறிப்பு:',
    demandVolumeByGrade: 'தரம் வாரியாக தேவை அளவு',
    myLotsHead: 'எனது செயலில் உள்ள விற்பனை லாட்கள்',
    myLotsSub: 'உருவாக்கப்பட்ட லாட்கள் மற்றும் வாங்குபவர் சலுகைகளை கண்காணிக்கவும்',
    createNewLot: 'புதிய விற்பனை லாட் உருவாக்கு',
    matchedBuyersCount: 'பொருந்திய வாங்குபவர்கள்',
    minAcceptablePrice: 'குறைந்தபட்ச ஏற்கத்தக்க விலை',
    bestOfferReceived: 'பெறப்பட்ட சிறந்த சலுகை',
    saleWindow: 'விற்பனை காலம்',
    statusLabel: 'நிலை',
    negotiationActive: 'பேச்சுவார்த்தை செயலில் உள்ளது',
    timelineTitle: 'வெளிப்படையான பரிவர்த்தனை காலவரிசை',
    respondToOffer: 'சலுகைக்கு பதிலளிக்கவும்',
    settleUpi: 'UPI மூலம் பணம் செலுத்துங்கள்',
    paymentsHead: 'வெளிப்படையான கட்டண தீர்வு',
    paymentsSub: 'சலுகை ஏற்பு முதல் வங்கி/UPI வரை ஒவ்வொரு பதிவும் நேர முத்திரையிடப்பட்டுள்ளது.',
    availableToSettle: 'தீர்வுக்கு கிடைக்கிறது',
    settleDbt: 'UPI / வங்கி DBT மூலம் தீர்க்கவும்',
    disputeHead: 'புகார் மற்றும் சர்ச்சை தீர்வு',
    disputeSub: 'பரிவர்த்தனை சான்றுகளுடன் தரம் அல்லது எடை சிக்கல்களை தெரிவிக்கவும்.',
    noOpenGrievances: 'திறந்த சர்ச்சைகள் எதுவும் இல்லை',
    noGrievanceSub: 'உங்கள் பரிவர்த்தனை பதிவுகள் அனைத்தும் தெளிவாக உள்ளன.',
    raiseGrievanceBtn: 'புகாரைப் பதிவு செய்யவும்'
  }
};

export default function MarketIntelligence() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const requestedView = useMemo(() => new URLSearchParams(location.search).get('view'), [location.search]);
  const isQualityPartner = user?.role === 'QUALITY_INSPECTOR';
  const globalContext = useGlobalState() || {};
  const {
    batches = [],
    certificates = [],
    buyerDemands = [],
    woolLots = [],
    addCertificate,
    updateBatch,
    createWoolLot,
    submitOffer
  } = globalContext;

  const [language, setLanguage] = useState('en');
  const t = useMemo(() => TRANSLATIONS[language] || TRANSLATIONS.en, [language]);

  const [selectedCrop, setSelectedCrop] = useState('WHEAT');
  const [selectedState, setSelectedState] = useState('Rajasthan');
  const [selectedDistrict, setSelectedDistrict] = useState('Kota');
  const [activeTab, setActiveTab] = useState(requestedView || (isQualityPartner ? 'trust' : 'overview'));

  const normalizeView = useCallback((view) => {
    const aliases = {
      market: 'overview',
      prices: 'overview',
      forecast: 'overview',
      logistics: 'comparison',
      transaction: 'payments',
      transactions: 'payments',
      grievance: 'disputes',
      demand: 'demand'
    };
    return aliases[view] || ['overview', 'crop50', 'comparison', 'logistics', 'demand', 'buyers', 'trust', 'lots', 'fpo', 'payments', 'disputes'].includes(view)
      ? (aliases[view] || view)
      : 'overview';
  }, []);

  const selectTab = useCallback((tab) => {
    const nextTab = normalizeView(tab);
    setActiveTab(nextTab);
    navigate(`/platform?view=${nextTab}`);
  }, [navigate, normalizeView]);

  // Derived Commodity Data from Registry
  const commodity = useMemo(() => {
    return getCommodityById(selectedCrop) || COMMODITIES[0];
  }, [selectedCrop]);
  const woolCommodityId = useMemo(() => (
    COMMODITIES.find(c => c.id === 'WOOL' || /wool/i.test(c.name))?.id || 'WOOL'
  ), []);
  const isWoolCommodity = selectedCrop === woolCommodityId;

  // CROP50 States
  const [crop50TimeRange, setCrop50TimeRange] = useState('1M');
  const [moversPeriod, setMoversPeriod] = useState('1D');
  const [selectedCrop50Detail, setSelectedCrop50Detail] = useState(null);
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);

  // Live Price State from CEDA / Agmarknet
  const [livePriceData, setLivePriceData] = useState(null);
  const [dataSource, setDataSource] = useState('Agmarknet Live Feed');
  const [loadingPrices, setLoadingPrices] = useState(false);

  // Modals & Notifications
  const [lotModalOpen, setLotModalOpen] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [selectedBuyerForOffer, setSelectedBuyerForOffer] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [apiWoolBatches, setApiWoolBatches] = useState([]);
  const [inspectionRequests, setInspectionRequests] = useState([]);
  const [backendCertificates, setBackendCertificates] = useState([]);
  const [loadingInspections, setLoadingInspections] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [issuingCertificate, setIssuingCertificate] = useState(false);
  const [inspectionError, setInspectionError] = useState('');
  const [inspectionForm, setInspectionForm] = useState({
    fiberDiameter: '',
    stapleLength: '',
    cleanYield: '',
    moisture: '',
    cleanliness: '',
    vegetableMatter: '',
    contamination: 'Low',
    foreignMatter: 'Low',
    strength: 'Good',
    overallScore: '',
    grade: '',
    remarks: ''
  });

  // Expandable accordions
  const [expandedReasoning, setExpandedReasoning] = useState(false);
  const [expandedBuyerId, setExpandedBuyerId] = useState(null);
  const [aiEvidenceOpen, setAiEvidenceOpen] = useState(false);
  const [aiAssistantLoading, setAiAssistantLoading] = useState(false);
  const [aiAssistantResult, setAiAssistantResult] = useState(null);
  const [aiAssistantEvidence, setAiAssistantEvidence] = useState([]);
  const [aiAssistantError, setAiAssistantError] = useState('');

  // Lot Creation Form State
  const [newLot, setNewLot] = useState({
    selectedBatchId: '',
    crop: 'Wheat',
    variety: 'HD-2967 (Sharbati)',
    quantity: '100',
    unit: 'Quintal (qtl)',
    grade: 'A',
    window: 'Next 7 days',
    minPrice: '2400',
    needsStorage: false
  });

  const getBatchKey = (batch = {}) => batch.batchId || batch.id;

  const getAvailableQuantity = (batch = {}) => {
    const available = Number(batch.availableQuantity);
    if (Number.isFinite(available)) return Math.max(0, available);
    const quantity = Number(batch.quantity);
    return Number.isFinite(quantity) ? Math.max(0, quantity) : 0;
  };

  const isRegisteredWoolBatch = useCallback((batch = {}) => {
    if (!getBatchKey(batch)) return false;
    if (batch.cropId) return batch.cropId === woolCommodityId;
    return Boolean(batch.woolType);
  }, [woolCommodityId]);

  const allRegisteredWoolBatches = useMemo(() => (
    [...apiWoolBatches, ...batches]
      .filter(isRegisteredWoolBatch)
      .filter((batch, index, list) => (
        list.findIndex(item => getBatchKey(item) === getBatchKey(batch)) === index
      ))
  ), [apiWoolBatches, batches, isRegisteredWoolBatch]);

  const registeredBatches = useMemo(() => (
    isWoolCommodity ? allRegisteredWoolBatches : []
  ), [allRegisteredWoolBatches, isWoolCommodity]);

  const selectedBatch = useMemo(() => (
    isWoolCommodity
      ? registeredBatches.find(batch => getBatchKey(batch) === newLot.selectedBatchId)
      : null
  ), [isWoolCommodity, registeredBatches, newLot.selectedBatchId]);

  const selectedBatchAvailableQuantity = selectedBatch ? getAvailableQuantity(selectedBatch) : 0;

  const resetInspectionForm = () => {
    setInspectionError('');
    setInspectionForm({
      fiberDiameter: '',
      stapleLength: '',
      cleanYield: '',
      moisture: '',
      cleanliness: '',
      vegetableMatter: '',
      contamination: 'Low',
      foreignMatter: 'Low',
      strength: 'Good',
      overallScore: '',
      grade: '',
      remarks: ''
    });
  };

  const allCertificates = useMemo(() => (
    [...backendCertificates, ...certificates]
      .filter(Boolean)
      .filter((cert, index, list) => (
        list.findIndex(item => (item.certificateId || item.id) === (cert.certificateId || cert.id)) === index
      ))
  ), [backendCertificates, certificates]);

  const findCertificateForBatch = useCallback((batchId) => (
    allCertificates.find(cert => cert.batchId === batchId || cert.id === batchId || cert.certificateId === batchId)
  ), [allCertificates]);

  const qualityPricingBatch = useMemo(() => {
    if (!isWoolCommodity) return null;
    if (selectedBatch) return selectedBatch;
    return allRegisteredWoolBatches.find(batch => findCertificateForBatch(getBatchKey(batch))) || null;
  }, [allRegisteredWoolBatches, findCertificateForBatch, isWoolCommodity, selectedBatch]);

  const qualityPricingCertificate = useMemo(() => (
    qualityPricingBatch ? findCertificateForBatch(getBatchKey(qualityPricingBatch)) : null
  ), [findCertificateForBatch, qualityPricingBatch]);

  const isWoolInspectionRequest = useCallback((request = {}) => {
    const batch = allRegisteredWoolBatches.find(item => getBatchKey(item) === request.batchId);
    if (batch) return true;
    return /wool|fleece/i.test(`${request.woolType || ''} ${request.cropName || ''}`);
  }, [allRegisteredWoolBatches]);

  const inspectionRows = useMemo(() => {
    const explicitRows = inspectionRequests.filter(isWoolInspectionRequest);
    const explicitBatchIds = new Set(explicitRows.map(request => request.batchId).filter(Boolean));
    const derivedRows = allRegisteredWoolBatches
      .filter(batch => !explicitBatchIds.has(getBatchKey(batch)))
      .filter(batch => !findCertificateForBatch(getBatchKey(batch)))
      .map(batch => ({
        id: `PENDING-${getBatchKey(batch)}`,
        requestId: `PENDING-${getBatchKey(batch)}`,
        batchId: getBatchKey(batch),
        farmerId: batch.farmerId,
        farmerName: batch.farmerName,
        location: batch.origin || batch.currentLocation,
        quantity: batch.quantity,
        woolType: batch.woolType || batch.variety || batch.cropName,
        status: batch.certificateStatus === 'Inspection Requested' ? 'PENDING_ASSIGNMENT' : 'PENDING_BATCH_REVIEW',
        createdAt: batch.createdAt,
        derivedFromBatch: true
      }));
    return [...explicitRows, ...derivedRows].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [allRegisteredWoolBatches, findCertificateForBatch, inspectionRequests, isWoolInspectionRequest]);

  const isCompletedInspection = useCallback((request = {}) => (
    request.status === 'CERTIFICATE_ISSUED' || Boolean(findCertificateForBatch(request.batchId))
  ), [findCertificateForBatch]);

  const pendingInspectionCount = inspectionRows.filter(request => !isCompletedInspection(request) && request.status !== 'REJECTED').length;
  const completedInspectionCount = inspectionRows.length - pendingInspectionCount;

  const handleBatchSelect = (batchId) => {
    const batch = registeredBatches.find(item => getBatchKey(item) === batchId);
    if (!batch) {
      setNewLot(prev => ({ ...prev, selectedBatchId: batchId }));
      return;
    }

    const availableQuantity = getAvailableQuantity(batch);
    setNewLot(prev => ({
      ...prev,
      selectedBatchId: batchId,
      crop: batch.cropName || batch.woolType || prev.crop,
      variety: batch.variety || batch.woolType || prev.variety,
      quantity: String(availableQuantity || ''),
      grade: batch.qualityGrade || prev.grade
    }));
  };

  useEffect(() => {
    setNewLot(prev => ({
      ...prev,
      selectedBatchId: '',
      crop: commodity.name,
      variety: commodity.varieties?.[0] || commodity.name,
      unit: commodity.defaultUnit || prev.unit,
      grade: 'A'
    }));
  }, [commodity]);

  useEffect(() => {
    if (requestedView) {
      setActiveTab(normalizeView(requestedView));
    } else if (isQualityPartner) {
      setActiveTab('trust');
    }
  }, [isQualityPartner, requestedView, normalizeView]);

  useEffect(() => {
    if (!(isWoolCommodity || isQualityPartner || activeTab === 'trust')) {
      setApiWoolBatches([]);
      return;
    }

    let isMounted = true;
    fetch('/api/batches')
      .then(res => (res.ok ? res.json() : null))
      .then(payload => {
        if (!isMounted) return;
        const list = Array.isArray(payload?.data) ? payload.data : [];
        setApiWoolBatches(list);
      })
      .catch(() => {
        if (isMounted) setApiWoolBatches([]);
      });

    return () => {
      isMounted = false;
    };
  }, [activeTab, isQualityPartner, isWoolCommodity]);

  useEffect(() => {
    if (!(isQualityPartner || activeTab === 'trust')) return;

    let isMounted = true;
    setLoadingInspections(true);
    Promise.all([
      qaService.getRequests(),
      qaService.getCertificates()
    ])
      .then(([requests, certs]) => {
        if (!isMounted) return;
        setInspectionRequests(Array.isArray(requests) ? requests : []);
        setBackendCertificates(Array.isArray(certs) ? certs : []);
      })
      .catch(() => {
        if (!isMounted) return;
        setInspectionRequests([]);
        setBackendCertificates([]);
      })
      .finally(() => {
        if (isMounted) setLoadingInspections(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeTab, isQualityPartner]);

  // CROP50 Derived Calculations
  const crop50Index = useMemo(() => crop50Service.getCurrentIndex(), []);
  const crop50ChartData = useMemo(() => crop50Service.getHistoricalSeries(crop50TimeRange), [crop50TimeRange]);
  const crop50Categories = useMemo(() => crop50Service.getCategorySubIndices(), []);
  const crop50Movers = useMemo(() => crop50Service.getTopGainersAndLosers(moversPeriod), [moversPeriod]);
  const crop50Contributors = useMemo(() => crop50Service.getIndexContributors(), []);
  const crop50Sentiment = useMemo(() => crop50Service.getMarketSentiment(), []);

  // Fetch Live Prices via CEDA / Agmarknet Service on Crop or Location Change
  useEffect(() => {
    let isMounted = true;
    async function loadLivePrices() {
      setLoadingPrices(true);
      try {
        const fromDate = formatDate(getDateOffset(30));
        const toDate = formatDate(new Date());
        const records = await agmarknetService.getPrices(selectedCrop, 8, null, null, fromDate, toDate);
        
        if (isMounted && records && records.length > 0) {
          const latest = records[records.length - 1];
          const previous = records.length > 7 ? records[records.length - 8] : records[0];
          const trendPct = previous && previous.modal_price 
            ? ((latest.modal_price - previous.modal_price) / previous.modal_price * 100).toFixed(1)
            : '3.8';

          setLivePriceData({
            modalPrice: latest.modal_price || (commodity.mandiPricePerKg * 100),
            minPrice: latest.min_price || Math.round(commodity.mandiPricePerKg * 94),
            maxPrice: latest.max_price || Math.round(commodity.mandiPricePerKg * 106),
            arrivals: latest.quantity ? latest.quantity * 10 : 1240,
            trendPct: Number(trendPct) >= 0 ? '+' + trendPct + '%' : trendPct + '%',
            isPositive: Number(trendPct) >= 0,
            marketName: latest.market_name || (selectedDistrict + ' Mandi'),
            history: records
          });
          setDataSource(records.source === 'ceda' ? 'CEDA / Agmarknet API' : 'KhetSetu demo dataset');
        }
      } catch (err) {
        console.warn('Live price fetch fallback:', err);
      } finally {
        if (isMounted) setLoadingPrices(false);
      }
    }
    loadLivePrices();
    return () => { isMounted = false; };
  }, [selectedCrop, selectedDistrict, commodity]);

  // Current effective modal price
  const currentModalPrice = livePriceData?.modalPrice || (commodity.mandiPricePerKg * 100) || 2400;
  const currentModalPricePerKg = Number((currentModalPrice / 100).toFixed(2));
  const woolQualityPrice = useMemo(() => (
    isWoolCommodity
      ? calculateWoolQualityPrice({
          basePrice: currentModalPricePerKg,
          certificate: qualityPricingCertificate
        })
      : null
  ), [currentModalPricePerKg, isWoolCommodity, qualityPricingCertificate]);
  const selectedBatchWoolQualityPrice = useMemo(() => (
    isWoolCommodity && selectedBatch
      ? calculateWoolQualityPrice({
          basePrice: currentModalPricePerKg,
          certificate: findCertificateForBatch(getBatchKey(selectedBatch))
        })
      : null
  ), [currentModalPricePerKg, findCertificateForBatch, isWoolCommodity, selectedBatch]);

  // Derived Channels & Net Realization
  const marketChannels = useMemo(() => {
    return getMarketChannelsForCommodity(selectedCrop, '', 'A');
  }, [selectedCrop]);

  // Derived Forecast & Recommendation (Signal Driven)
  const forecast = useMemo(() => {
    return getPriceForecastAndRecommendation(selectedCrop, selectedDistrict + ' Mandi', currentModalPrice / 100);
  }, [selectedCrop, selectedDistrict, currentModalPrice]);

  // Derived Matched Buyers with Full Safe Field Normalization
  const matchedBuyers = useMemo(() => {
    const rawBuyers = (buyerDemands && buyerDemands.length > 0)
      ? buyerDemands 
      : [
          {
            id: 'B1',
            companyName: 'Shree Roller Flour & Agro Mills Ltd.',
            buyerType: 'Processor',
            verificationStatus: 'PLATFORM_VERIFIED',
            cropId: selectedCrop,
            cropName: commodity.name,
            requiredGrade: 'A',
            quantityRequired: 500,
            unit: 'qtl',
            offeredPricePerQtl: Math.round(currentModalPrice * 1.05),
            location: selectedDistrict + ' Industrial Belt',
            distanceKm: 28,
            deliveryDeadline: '3 days',
            paymentTerms: 'Escrow Secured (Direct Bank Transfer in 24h)',
            avgPaymentDays: 1.2,
            paymentReliabilityPct: 99,
            completedPurchases: 342,
            disputeRatePct: 0.4,
            rating: 4.9
          },
          {
            id: 'B2',
            companyName: 'NAFED National Buffer Procurement Hub',
            buyerType: 'Institutional Co-op',
            verificationStatus: 'GOVERNMENT_VERIFIED',
            cropId: selectedCrop,
            cropName: commodity.name,
            requiredGrade: 'FAQ',
            quantityRequired: 1200,
            unit: 'qtl',
            offeredPricePerQtl: Math.round(currentModalPrice * 1.02),
            location: selectedDistrict + ' APMC Yard',
            distanceKm: 14,
            deliveryDeadline: '7 days',
            paymentTerms: 'APMC Direct DBT (2-4 Days)',
            avgPaymentDays: 2.5,
            paymentReliabilityPct: 96,
            completedPurchases: 1280,
            disputeRatePct: 0.2,
            rating: 4.8
          },
          {
            id: 'B3',
            companyName: 'Apex Harvest Exports & Trading Co.',
            buyerType: 'Exporter',
            verificationStatus: 'PLATFORM_VERIFIED',
            cropId: selectedCrop,
            cropName: commodity.name,
            requiredGrade: 'A+',
            quantityRequired: 800,
            unit: 'qtl',
            offeredPricePerQtl: Math.round(currentModalPrice * 1.09),
            location: 'Terminal Logistics Depot',
            distanceKm: 140,
            deliveryDeadline: '5 days',
            paymentTerms: 'Letter of Credit / Platform Escrow',
            avgPaymentDays: 1.8,
            paymentReliabilityPct: 97,
            completedPurchases: 189,
            disputeRatePct: 0.9,
            rating: 4.7
          }
        ];

    const currentLotSample = {
      cropId: selectedCrop,
      cropName: commodity.name,
      qualityGrade: 'A',
      quantity: 100,
      unit: 'qtl',
      origin: selectedDistrict
    };

    return rawBuyers
      .map(b => {
        const matchResult = calculateMatchScore(currentLotSample, b);
        const calcOfferedPrice = b.offeredPricePerQtl 
          || (b.budgetPrice ? Math.round(b.budgetPrice * 100) : null)
          || (b.maxPrice ? Math.round(b.maxPrice * 100) : null)
          || (b.minPrice ? Math.round(b.minPrice * 100) : null)
          || Math.round(currentModalPrice * 1.04);

        const normalizedBuyer = {
          id: b.id || ('B-' + Math.random()),
          companyName: b.companyName || b.buyerName || 'Verified Procurement Partner',
          buyerType: b.buyerType || 'Agro Processor',
          verificationStatus: b.verificationStatus || 'PLATFORM_VERIFIED',
          cropName: b.cropName || commodity.name,
          requiredGrade: b.requiredGrade || 'A',
          quantityRequired: b.quantityRequired || b.minQuantity || 500,
          unit: b.unit || 'qtl',
          offeredPricePerQtl: calcOfferedPrice || Math.round(currentModalPrice * 1.04),
          location: b.location || (selectedDistrict + ' Hub'),
          distanceKm: b.distanceKm || 32,
          deliveryDeadline: b.deliveryDeadline || (b.deliveryWindowDays ? (b.deliveryWindowDays + ' days') : '5 days'),
          paymentTerms: b.paymentTerms || 'Platform Escrow Secured',
          avgPaymentDays: b.avgPaymentDays || 1.8,
          paymentReliabilityPct: b.paymentReliabilityPct || (b.rating ? Math.round((b.rating / 5) * 100) : 98),
          completedPurchases: b.completedPurchases || b.transactionsCompleted || 240,
          disputeRatePct: b.disputeRatePct || 0.5,
          rating: b.rating || 4.8,
          matchScore: matchResult.percentage || 92,
          matchBreakdown: matchResult.breakdown || [],
          matchWarnings: matchResult.warnings || []
        };
        if (isWoolCommodity && woolQualityPrice?.hasVerifiedCertificate) {
          normalizedBuyer.qualityReference = compareOfferToQualityReference(calcOfferedPrice / 100, woolQualityPrice);
          normalizedBuyer.qualityRequirementMatch = (normalizedBuyer.requiredGrade === (woolQualityPrice.metrics?.grade || normalizedBuyer.requiredGrade))
            ? 'Exact grade match'
            : `Buyer asks Grade ${normalizedBuyer.requiredGrade}; certificate Grade ${woolQualityPrice.metrics?.grade || 'verified'}`;
        }
        return normalizedBuyer;
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [buyerDemands, selectedCrop, commodity, selectedDistrict, currentModalPrice, isWoolCommodity, woolQualityPrice]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openInspection = async (request) => {
    if (isCompletedInspection(request)) {
      showToast('Certificate already issued for this batch.');
      return;
    }

    let activeRequest = request;
    const sourceBatch = allRegisteredWoolBatches.find(batch => getBatchKey(batch) === request.batchId);
    if (sourceBatch) {
      const synced = await qaService.syncBatchToBackend(sourceBatch);
      if (!synced.success) {
        showToast(synced.error || 'Could not sync WoolBatch before inspection.');
        return;
      }
    }

    if (request.derivedFromBatch) {
      const created = await qaService.createRequest({
        batchId: request.batchId,
        farmerId: request.farmerId || 'FARMER-01',
        farmerName: request.farmerName,
        location: request.location,
        quantity: request.quantity,
        woolType: request.woolType,
        preferredDate: new Date().toISOString(),
        message: 'Inspection opened from KhetSetu Quality Partner workspace'
      });
      if (created?.success && created.data) {
        activeRequest = created.data;
        setInspectionRequests(prev => [
          activeRequest,
          ...prev.filter(item => item.batchId !== request.batchId)
        ]);
        if (created.persistedToBackend === false) {
          showToast('Inspection saved locally because backend is unavailable.');
        }
      } else {
        showToast(created?.error || 'Could not create inspection request.');
        return;
      }
    }

    if (activeRequest.status !== 'ASSIGNED') {
      const requestId = activeRequest.requestId || activeRequest.id;
      const assigned = await qaService.updateRequest(requestId, {
        status: 'ASSIGNED',
        inspectorId: user?.id || 'INS-01'
      });
      if (assigned?.success && assigned.data) {
        activeRequest = { ...activeRequest, ...assigned.data, status: assigned.data.status || 'ASSIGNED' };
        setInspectionRequests(prev => prev.map(item => (
          item.requestId === requestId || item.id === requestId || item.batchId === activeRequest.batchId
            ? activeRequest
            : item
        )));
        if (assigned.persistedToBackend === false) {
          showToast('Inspection assigned locally because backend is unavailable.');
        }
      } else {
        showToast(assigned?.error || 'Could not assign inspection request.');
        return;
      }
    }

    resetInspectionForm();
    setSelectedInspection(activeRequest);
  };

  const viewInspectionCertificate = async (request) => {
    const existingCert = findCertificateForBatch(request.batchId);
    if (existingCert?.certificateId || existingCert?.id) {
      navigate(`/verify/${existingCert.certificateId || existingCert.id}`);
      return;
    }

    const fetchedCert = await qaService.getCertificateByBatch(request.batchId);
    if (fetchedCert?.certificateId || fetchedCert?.id) {
      setBackendCertificates(prev => [
        fetchedCert,
        ...prev.filter(cert => (cert.certificateId || cert.id) !== (fetchedCert.certificateId || fetchedCert.id))
      ]);
      navigate(`/verify/${fetchedCert.certificateId || fetchedCert.id}`);
      return;
    }

    showToast('Certificate details are not available yet.');
  };

  const issueInspectionCertificate = async (event) => {
    event.preventDefault();
    if (!selectedInspection) return;
    setInspectionError('');
    if (findCertificateForBatch(selectedInspection.batchId)) {
      setSelectedInspection(null);
      showToast('Certificate already issued for this batch.');
      return;
    }

    const numericFields = [
      ['fiberDiameter', 'Fiber Diameter'],
      ['stapleLength', 'Staple Length'],
      ['cleanYield', 'Clean Yield'],
      ['moisture', 'Moisture'],
      ['cleanliness', 'Cleanliness'],
      ['overallScore', 'Overall Score']
    ];
    const parsedMetrics = {};
    for (const [key, label] of numericFields) {
      const rawValue = inspectionForm[key];
      const parsedValue = Number(rawValue);
      if (rawValue === '' || rawValue === null || rawValue === undefined || !Number.isFinite(parsedValue)) {
        const message = `${label} is required and must be a valid number.`;
        setInspectionError(message);
        showToast(message);
        return;
      }
      parsedMetrics[key] = parsedValue;
    }
    if (parsedMetrics.overallScore < 0 || parsedMetrics.overallScore > 100) {
      const message = 'Overall Score must be between 0 and 100.';
      setInspectionError(message);
      showToast(message);
      return;
    }
    if (!inspectionForm.grade) {
      const message = 'Select final grade before issuing the certificate.';
      setInspectionError(message);
      showToast(message);
      return;
    }

    setIssuingCertificate(true);
    try {
      const sourceBatch = allRegisteredWoolBatches.find(batch => getBatchKey(batch) === selectedInspection.batchId);
      if (sourceBatch) {
        const synced = await qaService.syncBatchToBackend(sourceBatch);
        if (!synced.success) {
          throw new Error(synced.error || 'Could not sync WoolBatch before issuing certificate.');
        }
      }

      const result = await qaService.issueCertificate({
        batchId: selectedInspection.batchId,
        requestId: selectedInspection.requestId || selectedInspection.id,
        farmerName: selectedInspection.farmerName,
        origin: selectedInspection.location,
        quantity: Number(selectedInspection.quantity) || selectedInspection.quantity,
        woolType: selectedInspection.woolType,
        inspectorId: user?.id || 'INS-01',
        inspectorName: user?.name || 'Quality Partner',
        ...inspectionForm,
        ...parsedMetrics,
        vegetableMatter: inspectionForm.vegetableMatter.trim(),
        remarks: inspectionForm.remarks.trim()
      });

      if (result?.success && result.data) {
        if (addCertificate) addCertificate(result.data);
        setBackendCertificates(prev => [
          result.data,
          ...prev.filter(cert => (cert.certificateId || cert.id) !== (result.data.certificateId || result.data.id))
        ]);
        if (updateBatch) {
          updateBatch(selectedInspection.batchId, {
            qualityGrade: result.data.grade || inspectionForm.grade,
            certificateStatus: 'Certified',
            certificateId: result.data.certificateId
          });
        }
        setInspectionRequests(prev => prev.map(request => (
          request.requestId === selectedInspection.requestId || request.id === selectedInspection.id || request.batchId === selectedInspection.batchId
            ? { ...request, status: 'CERTIFICATE_ISSUED' }
            : request
        )));
        setSelectedInspection(null);
        showToast(result.persistedToBackend === false
          ? 'Certificate saved locally because backend is unavailable.'
          : 'Quality certificate issued and linked to WoolBatch.'
        );
        return;
      }

      const message = result?.error || 'Certificate could not be issued.';
      setInspectionError(message);
      showToast(message);
    } catch (error) {
      const message = error.message || 'Certificate could not be issued.';
      setInspectionError(message);
      showToast(message);
    } finally {
      setIssuingCertificate(false);
    }
  };

  const bestChannel = useMemo(() => {
    if (!marketChannels || marketChannels.length === 0) return null;
    let top = marketChannels[0];
    let maxNet = 0;
    marketChannels.forEach(c => {
      const grossQtl = (c.pricePerKg || 25) * 100;
      const freight = (c.distanceKm || 20) * 2.5;
      const fees = c.channelId === 'APMC_MANDI' ? grossQtl * 0.015 : 20;
      const storage = c.channelId === 'PROCESSING_UNIT' ? 40 : 0;
      const net = grossQtl - freight - fees - storage;
      if (net > maxNet) {
        maxNet = net;
        top = { 
          ...c, 
          netRealizationPerQtl: Math.round(net), 
          grossQtl: Math.round(grossQtl), 
          freight: Math.round(freight), 
          fees: Math.round(fees), 
          storage: Math.round(storage) 
        };
      }
    });
    return top;
  }, [marketChannels]);

  const buildAiEvidence = useCallback(() => {
    const sourceLabel = livePriceData ? dataSource : 'KhetSetu demo data';
    const evidence = [
      {
        id: 'commodity-selected',
        type: 'commodity',
        label: 'Selected commodity',
        value: `${commodity.name} in ${selectedDistrict}, ${selectedState}`,
        source: 'KhetSetu UI selection'
      },
      {
        id: 'market-reference-price',
        type: 'price',
        label: 'Market/reference price',
        value: `Rs ${(currentModalPrice || 0).toLocaleString('en-IN')} per quintal`,
        source: sourceLabel
      },
      {
        id: 'price-trend',
        type: 'trend',
        label: '7-day price trend',
        value: livePriceData?.trendPct || 'Demo trend +3.8%',
        source: sourceLabel
      },
      {
        id: 'arrival-volume',
        type: 'supply',
        label: 'Arrival volume',
        value: `${(livePriceData?.arrivals || 1240).toLocaleString('en-IN')} tonnes`,
        source: livePriceData ? sourceLabel : 'KhetSetu demo data'
      },
      {
        id: 'forecast-recommendation',
        type: 'forecast',
        label: 'Sale-window recommendation',
        value: forecast.recommendation,
        source: 'KhetSetu forecast service'
      },
      {
        id: 'forecast-range',
        type: 'forecast',
        label: 'Expected price range',
        value: forecast.expectedPriceRange,
        source: 'KhetSetu forecast service'
      },
      {
        id: 'forecast-confidence',
        type: 'forecast',
        label: 'Forecast confidence',
        value: forecast.confidence,
        source: 'KhetSetu forecast service'
      }
    ];

    if (bestChannel) {
      evidence.push({
        id: 'best-net-realization-channel',
        type: 'net_realization',
        label: 'Best net realization channel',
        value: `${bestChannel.name || bestChannel.channelName || bestChannel.channelId}: Rs ${(bestChannel.netRealizationPerQtl || 0).toLocaleString('en-IN')} per quintal`,
        source: 'KhetSetu net realization calculation'
      });
    }

    matchedBuyers.slice(0, 3).forEach((buyer, index) => {
      evidence.push({
        id: `buyer-offer-${index + 1}`,
        type: 'buyer_offer',
        label: `${buyer.companyName} offer signal`,
        value: `Rs ${(buyer.offeredPricePerQtl || 0).toLocaleString('en-IN')} per quintal; match ${buyer.matchScore}%; required grade ${buyer.requiredGrade}`,
        source: 'KhetSetu buyer demand/demo data'
      });
      if (buyer.qualityReference) {
        evidence.push({
          id: `buyer-quality-reference-${index + 1}`,
          type: 'quality_offer_comparison',
          label: `${buyer.companyName} quality reference comparison`,
          value: `${buyer.qualityReference.label}; difference Rs ${(buyer.qualityReference.diff * 100).toLocaleString('en-IN')} per quintal`,
          source: 'KhetSetu quality-aware offer comparison'
        });
      }
    });

    if (isWoolCommodity && woolQualityPrice?.hasVerifiedCertificate) {
      evidence.push({
        id: 'wool-quality-adjusted-reference',
        type: 'wool_quality_price',
        label: 'Verified wool quality-adjusted reference',
        value: `Certificate ${woolQualityPrice.certificateId}; base Rs ${woolQualityPrice.basePrice.toLocaleString('en-IN')}/kg; adjustments ${woolQualityPrice.totalAdjustment >= 0 ? '+' : ''}Rs ${woolQualityPrice.totalAdjustment.toLocaleString('en-IN')}/kg; adjusted Rs ${woolQualityPrice.adjustedPrice.toLocaleString('en-IN')}/kg; fair range Rs ${woolQualityPrice.fairPriceRange.low.toLocaleString('en-IN')}-${woolQualityPrice.fairPriceRange.high.toLocaleString('en-IN')}/kg`,
        source: 'Verified QualityCertificate and KhetSetu wool quality pricing rules'
      });
    } else if (isWoolCommodity) {
      evidence.push({
        id: 'wool-quality-unverified',
        type: 'wool_quality_status',
        label: 'Wool quality verification status',
        value: 'Quality verification required for quality-adjusted estimate.',
        source: 'KhetSetu quality status'
      });
    }

    return evidence;
  }, [
    bestChannel,
    commodity,
    currentModalPrice,
    dataSource,
    forecast,
    isWoolCommodity,
    livePriceData,
    matchedBuyers,
    selectedDistrict,
    selectedState,
    woolQualityPrice
  ]);

  const handleAnalyzeMarketWithAi = async () => {
    const evidence = buildAiEvidence();
    setAiAssistantEvidence(evidence);
    setAiAssistantResult(null);
    setAiAssistantError('');
    setAiEvidenceOpen(false);
    setAiAssistantLoading(true);

    try {
      let trainedModelForecast = null;
      try { trainedModelForecast = await getMandiForecast(livePriceData?.history || []); } catch (_) { /* model is optional when the serverless Python runtime is unavailable */ }
      const aiEvidence = trainedModelForecast ? [...evidence, {
        id: 'trained-mandi-model', type: 'ml_forecast', label: 'Trained mandi forecast',
        value: `Predicted next reported modal price Rs ${trainedModelForecast.predictedNextModalPrice}/quintal (delta ${trainedModelForecast.predictedDelta >= 0 ? '+' : ''}${trainedModelForecast.predictedDelta})`,
        source: `${trainedModelForecast.modelVersion} trained on AGMARKNET historical observations`
      }] : evidence;
      setAiAssistantEvidence(aiEvidence);
      const response = await fetch('/api/ai/market-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: {
            assistantName: 'KhetSetu AI Market Assistant',
            commodityId: selectedCrop,
            commodityName: commodity.name,
            district: selectedDistrict,
            state: selectedState
          },
          evidence: aiEvidence
        })
      });
      const text = await response.text();
      const payload = text ? JSON.parse(text) : {};
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || payload.error || `AI assistant unavailable (${response.status})`);
      }
      setAiAssistantResult(payload.data);
      setAiAssistantEvidence(payload.evidence || evidence);
    } catch (error) {
      setAiAssistantError(error.message || 'KhetSetu AI Market Assistant is unavailable.');
    } finally {
      setAiAssistantLoading(false);
    }
  };

  return (
    <div className="ks-platform-root">
      {toastMessage && (
        <div className="ks-toast">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP CROP50 NATIONAL PULSE TICKER STRIP */}
      <aside className="ks-crop50-ticker-strip">
        <div className="ks-ticker-content" onClick={() => selectTab('crop50')}>
          <div className="ks-ticker-badge">
            <Activity size={13} />
            <b>CROP50 INDEX</b>
          </div>
          <div className="ks-ticker-val">
            <b>{crop50Index.indexValue}</b>
            <span className={crop50Index.isPositive ? 'green' : 'coral'}>
              {crop50Index.changePct} ({crop50Index.changePoints} pts)
            </span>
          </div>
          <div className="ks-ticker-sentiment">
            <span className={'ks-sent-dot ' + crop50Sentiment.tone} />
            <span>Market Breadth: <b>{crop50Index.gainersCount} Advancing, {crop50Index.losersCount} Softening</b></span>
          </div>
        </div>
        <button className="ks-ticker-view-btn" onClick={() => selectTab('crop50')}>
          Explore CROP50 Index <ArrowRight size={13} />
        </button>
      </aside>

      {/* HEADER BAR WITH HOME REDIRECT & TOP-RIGHT LANGUAGE SELECTOR */}
      <header className="ks-platform-header">
        <div className="ks-header-top-row">
          <div className="ks-header-left">
            <Link to="/" className="ks-brand-pill" title="KhetSetu Home">
              <span className="ks-brand-title">{t.brandTitle}</span>
              <span className="ks-brand-sub">{t.brandSubtitle}</span>
            </Link>
            <h1>{t.headerTitle}</h1>
          </div>

          <div className="ks-header-right-actions">
            <Link to="/" className="ks-home-redirect-btn" title="Back to KhetSetu Landing Page">
              <ArrowLeft size={14} />
              <span>{t.backToHome}</span>
            </Link>

            <div className="ks-lang-dropdown-wrapper">
              <Globe size={15} />
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="ks-lang-select"
                aria-label="Select Language"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>
          </div>
        </div>

        {/* CROP & LOCATION SELECTOR WITH CEDA INTEGRATION */}
        <div className="ks-selector-strip">
          <div className="ks-selector-group">
            <label><Filter size={13} /> {t.cropLabel}</label>
            <select 
              value={selectedCrop} 
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="ks-select-main"
            >
              {COMMODITIES.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.category})
                </option>
              ))}
            </select>
          </div>

          <div className="ks-selector-group">
            <label><MapPin size={13} /> {t.mandiLocation}</label>
            <div className="ks-location-inputs">
              <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Haryana">Haryana</option>
                <option value="Punjab">Punjab</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
              </select>
              <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}>
                <option value="Kota">Kota District</option>
                <option value="Ramganj">Ramganj Mandi</option>
                <option value="Indore">Indore Hub</option>
                <option value="Karnal">Karnal APMC</option>
                <option value="Nashik">Nashik Region</option>
              </select>
            </div>
          </div>

          <div className="ks-freshness-tag">
            <span className="ks-live-dot" />
            <div>
              <b>{dataSource}</b>
              <time>Live · {loadingPrices ? 'Updating...' : 'Synced'}</time>
            </div>
          </div>
        </div>
      </header>

      {/* 2-COLUMN PLATFORM LAYOUT: SIDEBAR NAVIGATION + MAIN CONTENT */}
      <div className="ks-platform-layout">
        <aside className="ks-platform-sidebar">
          <div className="ks-sidebar-section">
            <span className="ks-sidebar-heading">Market Discovery</span>
            <nav className="ks-sidebar-nav">
              <button 
                type="button"
                className={'ks-sidebar-btn ' + (activeTab === 'overview' ? 'active' : '')} 
                onClick={() => selectTab('overview')}
              >
                <BarChart3 size={17} />
                <span className="ks-sidebar-btn-label">{t.tabOverview}</span>
              </button>

              <button 
                type="button"
                className={'ks-sidebar-btn ' + (activeTab === 'crop50' ? 'active' : '')} 
                onClick={() => selectTab('crop50')}
              >
                <Activity size={17} />
                <span className="ks-sidebar-btn-label">CROP50 Index</span>
                <span className="ks-sidebar-badge-flagship">Flagship</span>
              </button>

              <button 
                type="button"
                className={'ks-sidebar-btn ' + (activeTab === 'comparison' ? 'active' : '')} 
                onClick={() => selectTab('comparison')}
              >
                <Building2 size={17} />
                <span className="ks-sidebar-btn-label">{t.tabChannels}</span>
              </button>

              <button
                type="button"
                className={'ks-sidebar-btn ' + (activeTab === 'logistics' ? 'active' : '')}
                onClick={() => selectTab('logistics')}
              >
                <Truck size={17} />
                <span className="ks-sidebar-btn-label">Logistics &amp; Storage</span>
              </button>

              <button 
                type="button"
                className={'ks-sidebar-btn ' + (activeTab === 'demand' ? 'active' : '')} 
                onClick={() => selectTab('demand')}
              >
                <Award size={17} />
                <span className="ks-sidebar-btn-label">{t.tabDemand}</span>
              </button>
            </nav>
          </div>

          <div className="ks-sidebar-section">
            <span className="ks-sidebar-heading">Transactions & Trade</span>
            <nav className="ks-sidebar-nav">
              {(isQualityPartner || activeTab === 'trust') && (
                <button 
                  type="button"
                  className={'ks-sidebar-btn ' + (activeTab === 'trust' ? 'active' : '')} 
                  onClick={() => selectTab('trust')}
                >
                  <ClipboardList size={17} />
                  <span className="ks-sidebar-btn-label">Quality Partner</span>
                  <span className="ks-sidebar-count-badge">{pendingInspectionCount}</span>
                </button>
              )}

              <button 
                type="button"
                className={'ks-sidebar-btn ' + (activeTab === 'buyers' ? 'active' : '')} 
                onClick={() => selectTab('buyers')}
              >
                <ShieldCheck size={17} />
                <span className="ks-sidebar-btn-label">{t.tabBuyers}</span>
                <span className="ks-sidebar-count-badge">{matchedBuyers.length}</span>
              </button>

              <button 
                type="button"
                className={'ks-sidebar-btn ' + (activeTab === 'lots' ? 'active' : '')} 
                onClick={() => selectTab('lots')}
              >
                <PackagePlus size={17} />
                <span className="ks-sidebar-btn-label">{t.tabLots}</span>
                <span className="ks-sidebar-count-badge">{woolLots ? woolLots.length : 1}</span>
              </button>

              <button
                type="button"
                className={'ks-sidebar-btn ' + (activeTab === 'fpo' ? 'active' : '')}
                onClick={() => selectTab('fpo')}
              >
                <Users size={17} />
                <span className="ks-sidebar-btn-label">FPO Aggregation</span>
              </button>

              <button 
                type="button"
                className={'ks-sidebar-btn ' + (activeTab === 'payments' ? 'active' : '')} 
                onClick={() => selectTab('payments')}
              >
                <WalletCards size={17} />
                <span className="ks-sidebar-btn-label">{t.tabPayments}</span>
              </button>

              <button 
                type="button"
                className={'ks-sidebar-btn ' + (activeTab === 'disputes' ? 'active' : '')} 
                onClick={() => selectTab('disputes')}
              >
                <MessageSquareWarning size={17} />
                <span className="ks-sidebar-btn-label">{t.tabDisputes}</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* MAIN BODY */}
        <main className="ks-platform-body">

                {/* TAB 0: CROP50 NATIONAL CROP MARKET INDEX */}
        {activeTab === 'crop50' && (
          <div className="ks-tab-content ks-crop50-suite">
            
            {/* HERO PULSE SECTION */}
            <section className="ks-crop50-hero-grid">
              
              {/* PRIMARY CROP50 HERO CARD */}
              <div className="ks-crop50-pulse-card">
                <div className="ks-crop50-pulse-header">
                  <div className="ks-crop50-badge">
                    <Activity size={14} />
                    <span>FLAGSHIP NATIONAL INDEX</span>
                  </div>
                  <button 
                    type="button"
                    className="ks-crop50-btn-methodology" 
                    onClick={() => setShowMethodologyModal(true)}
                  >
                    <HelpCircle size={13} />
                    <span>Methodology</span>
                  </button>
                </div>

                <div className="ks-crop50-title-area">
                  <h2 className="ks-crop50-heading">CROP50 - India's Crop Market Pulse</h2>
                  <p className="ks-crop50-lead">
                    Methodology-driven national index tracking representative price movements across 50 major agricultural commodities.
                  </p>
                </div>

                <div className="ks-crop50-val-section">
                  <div className="ks-crop50-main-val">
                    {crop50Index.indexValue}
                  </div>
                  <div className="ks-crop50-change-row">
                    <span className={'ks-crop50-change-pill ' + (crop50Index.isPositive ? 'pos' : 'neg')}>
                      {crop50Index.isPositive ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                      <span>{crop50Index.changePoints} pts ({crop50Index.changePct}) Today</span>
                    </span>
                    <span className="ks-crop50-period-tag">Base Value: 1,000.00 · Base Date: 08 Sep 2026</span>
                  </div>
                </div>

                <div className="ks-crop50-meta-grid">
                  <div className="ks-crop50-meta-item">
                    <span className="ks-crop50-meta-lbl">CONSTITUENTS</span>
                    <div className="ks-crop50-meta-val">
                      <span className="ks-status-dot-green" />
                      <b>50 / 50 Active</b>
                    </div>
                  </div>
                  <div className="ks-crop50-meta-item">
                    <span className="ks-crop50-meta-lbl">MARKET BREADTH</span>
                    <div className="ks-crop50-meta-val">
                      <b>{crop50Index.gainersCount} Up</b>
                      <span className="ks-meta-divider">/</span>
                      <b>{crop50Index.losersCount} Down</b>
                    </div>
                  </div>
                  <div className="ks-crop50-meta-item">
                    <span className="ks-crop50-meta-lbl">DATA SOURCE</span>
                    <div className="ks-crop50-meta-val">
                      <span className="ks-ceda-badge-pill">CEDA Live</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SENTIMENT & FARMER WORKFLOW CARD */}
              <div className="ks-crop50-sentiment-card">
                <div className="ks-sentiment-top-row">
                  <span className="ks-card-eyebrow">MARKET BREADTH & COMMODITY MOVEMENT</span>
                  <span className="ks-breadth-summary-pill">
                    {crop50Index.gainersCount} of 50 Advancing
                  </span>
                </div>

                <p className="ks-sentiment-explanation-text">
                  {crop50Index.gainersCount} of 50 tracked commodities are registering positive price momentum across regional mandis based on latest CEDA arrival volumes.
                </p>

                {/* ADVANCE / DECLINE PROGRESS BAR */}
                <div className="ks-breadth-meter-box">
                  <div className="ks-breadth-bar-track">
                    <div className="ks-breadth-bar-advance" style={{ width: `${crop50Sentiment.gainersPct}%` }} />
                    <div className="ks-breadth-bar-decline" style={{ width: `${100 - crop50Sentiment.gainersPct}%` }} />
                  </div>
                  <div className="ks-breadth-bar-labels">
                    <span className="ks-breadth-label-adv">
                      <b>{crop50Sentiment.gainersPct}%</b> Advancing
                    </span>
                    <span className="ks-breadth-label-dec">
                      <b>{100 - crop50Sentiment.gainersPct}%</b> Softening
                    </span>
                  </div>
                </div>

                {/* FARMER CONNECTION CALLOUT */}
                <div className="ks-farmer-conn-box">
                  <div className="ks-farmer-conn-header">
                    <Compass size={15} />
                    <b>Impact on your crop ({commodity.name}):</b>
                  </div>
                  <p className="ks-farmer-conn-text">
                    {commodity.name} is up <b>+3.8%</b>, contributing positively to CROP50. KhetSetu recommends: <strong className="ks-recommend-tag">HOLD 3-5 DAYS</strong> for optimal net price realization.
                  </p>
                  <div className="ks-farmer-conn-action">
                    <button 
                      type="button" 
                      className="ks-btn-view-advisory" 
                      onClick={() => selectTab('overview')}
                    >
                      <span>View {commodity.name} Advisory</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* INTERACTIVE INDEX CHART */}
            <section className="ks-crop50-chart-card">
              <div className="ks-crop50-chart-header">
                <div className="ks-crop50-chart-title-box">
                  <h3 className="ks-crop50-chart-title">CROP50 Historical Price Movement</h3>
                  <p className="ks-crop50-chart-sub">Weighted index trajectory calculated using CEDA Agmarknet historical observations</p>
                </div>

                <div className="ks-crop50-range-btns">
                  {['1D', '7D', '1M', '3M', '6M', '1Y', '3Y', '5Y', 'MAX'].map((range) => (
                    <button
                      key={range}
                      type="button"
                      className={'ks-crop50-range-btn ' + (crop50TimeRange === range ? 'active' : '')}
                      onClick={() => setCrop50TimeRange(range)}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ks-crop50-chart-container">
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={crop50ChartData} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="crop50AreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2D5A27" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#2D5A27" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11, fill: '#64748B' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0B120D', color: '#FFFFFF', borderRadius: 8, fontSize: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                      formatter={(val) => [`${val} pts`, 'CROP50 Index']}
                    />
                    <Area type="monotone" dataKey="indexValue" stroke="#2D5A27" strokeWidth={2.5} fillOpacity={1} fill="url(#crop50AreaGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="ks-crop50-chart-stats">
                <div className="ks-crop50-stat-col">
                  <span className="ks-crop50-stat-lbl">CURRENT LEVEL</span>
                  <span className="ks-crop50-stat-val">{crop50Index.indexValue} pts</span>
                </div>
                <div className="ks-crop50-stat-col">
                  <span className="ks-crop50-stat-lbl">TODAY'S RANGE</span>
                  <span className="ks-crop50-stat-val">1,014.20 - 1,023.50</span>
                </div>
                <div className="ks-crop50-stat-col">
                  <span className="ks-crop50-stat-lbl">30D RETURN</span>
                  <span className="ks-crop50-stat-val text-green">+2.14%</span>
                </div>
                <div className="ks-crop50-stat-col">
                  <span className="ks-crop50-stat-lbl">METHODOLOGY</span>
                  <span className="ks-crop50-stat-val">Unit-Normalized Returns</span>
                </div>
              </div>
            </section>

            {/* SECTOR / CATEGORY SUB-INDICES */}
            <section className="ks-subindices-section">
              <div className="ks-section-header-row">
                <div>
                  <h3 className="ks-section-heading">CROP50 Category Sub-Indices</h3>
                  <p className="ks-section-sub">Normalized sector indices calculated from constituent launch weights</p>
                </div>
              </div>

              <div className="ks-subindices-grid">
                {crop50Categories.map((cat) => (
                  <div key={cat.categoryName} className="ks-subindex-card">
                    <div className="ks-subindex-top-row">
                      <span className="ks-subindex-title">{cat.categoryName}</span>
                      <span className={'ks-subindex-chg ' + (cat.isPositive ? 'pos' : 'neg')}>
                        {cat.changePct}
                      </span>
                    </div>
                    <div className="ks-subindex-val">
                      {cat.indexValue} <span className="ks-subindex-pts-unit">pts</span>
                    </div>
                    <div className="ks-subindex-bottom-row">
                      <span className="ks-subindex-count">{cat.itemCount} Commodities</span>
                      <span className={'ks-subindex-delta ' + (cat.isPositive ? 'pos' : 'neg')}>
                        {cat.changePoints} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* WHAT'S MOVING CROP50 & TOP MOVERS */}
            <div className="ks-crop50-split-grid">
              
              {/* TOP CONTRIBUTORS TABLE */}
              <section className="ks-crop50-box-card ks-contributors-box">
                <div className="ks-box-header-row">
                  <div>
                    <h3 className="ks-box-title">What's Moving CROP50? (Top Drivers)</h3>
                    <p className="ks-box-sub">Index point contribution based on constituent weight × price return</p>
                  </div>
                </div>

                <div className="ks-table-wrapper">
                  <table className="ks-crop50-table">
                    <thead>
                      <tr>
                        <th>COMMODITY</th>
                        <th>WEIGHT</th>
                        <th>SPOT PRICE</th>
                        <th>CHANGE</th>
                        <th style={{ textAlign: 'right' }}>CONTRIBUTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {crop50Contributors.slice(0, 8).map((c) => (
                        <tr 
                          key={c.id} 
                          className="ks-crop50-row-clickable"
                          onClick={() => setSelectedCrop50Detail(c)}
                          title="Click to view crop details"
                        >
                          <td>
                            <div className="ks-crop-col-cell">
                              <span className="ks-crop-cell-name">{c.name}</span>
                              <span className="ks-crop-cell-cat">{c.category}</span>
                            </div>
                          </td>
                          <td>
                            <span className="ks-crop-weight-badge">{(c.weight * 100).toFixed(2)}%</span>
                          </td>
                          <td>
                            <span className="ks-crop-price-text">₹{c.currentPrice} {c.unit}</span>
                          </td>
                          <td>
                            <span className={'ks-change-pill-sm ' + (c.isPositive ? 'pos' : 'neg')}>
                              {c.isPositive ? '+' : ''}{c.priceChangePct}%
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span className={'ks-contrib-points ' + (c.isPositive ? 'pos' : 'neg')}>
                              {c.contributionPoints > 0 ? '+' : ''}{c.contributionPoints} pts
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* TOP GAINERS & LOSERS */}
              <section className="ks-crop50-box-card ks-movers-box">
                <div className="ks-box-header-row">
                  <div>
                    <h3 className="ks-box-title">Top Movers</h3>
                    <p className="ks-box-sub">Highest percentage gainers and decliners</p>
                  </div>
                  <div className="ks-period-toggle">
                    {['1D', '7D', '30D'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={'ks-period-btn ' + (moversPeriod === p ? 'active' : '')}
                        onClick={() => setMoversPeriod(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ks-movers-columns">
                  {/* GAINERS */}
                  <div className="ks-mover-column">
                    <div className="ks-mover-col-title gainers">
                      <TrendingUp size={14} />
                      <span>TOP GAINERS</span>
                    </div>
                    <div className="ks-mover-list">
                      {crop50Movers.gainers.map((g) => (
                        <div 
                          key={g.id} 
                          className="ks-mover-item" 
                          onClick={() => setSelectedCrop50Detail(g)}
                        >
                          <div className="ks-mover-left">
                            <span className="ks-mover-name">{g.name}</span>
                            <span className="ks-mover-price">₹{g.currentPrice} {g.unit}</span>
                          </div>
                          <span className="ks-mover-chg pos">+{g.periodChangePct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* LOSERS */}
                  <div className="ks-mover-column">
                    <div className="ks-mover-col-title losers">
                      <TrendingDown size={14} />
                      <span>TOP LOSERS</span>
                    </div>
                    <div className="ks-mover-list">
                      {crop50Movers.losers.map((l) => (
                        <div 
                          key={l.id} 
                          className="ks-mover-item" 
                          onClick={() => setSelectedCrop50Detail(l)}
                        >
                          <div className="ks-mover-left">
                            <span className="ks-mover-name">{l.name}</span>
                            <span className="ks-mover-price">₹{l.currentPrice} {l.unit}</span>
                          </div>
                          <span className="ks-mover-chg neg">{l.periodChangePct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* CEDA ATTRIBUTION FOOTER BANNER */}
            <div className="ks-ceda-attribution-banner">
              <div className="ks-ceda-attr-left">
                <Award size={20} className="ks-ceda-icon" />
                <div className="ks-ceda-attr-text">
                  <h4 className="ks-ceda-attr-title">CEDA Agmarknet Data Attribution</h4>
                  <p className="ks-ceda-attr-desc">{CROP50_METADATA.attribution}</p>
                </div>
              </div>
              <span className="ks-ceda-attr-badge">Official Agmarknet Source</span>
            </div>
          </div>
        )}

        {/* TAB 1: MARKET OVERVIEW & FORECAST */}
        {activeTab === 'overview' && (
          <div className="ks-tab-content">
            <section className="ks-snapshot-grid">
              <div className="ks-card ks-metric-card primary">
                <div className="ks-card-label">{t.currentPriceLabel}</div>
                <div className="ks-metric-large">
                  ₹{(currentModalPrice || 0).toLocaleString('en-IN')}
                  <span className="ks-unit">/ quintal</span>
                </div>
                <div className="ks-metric-sub green">
                  <TrendingUp size={14} /> {livePriceData?.trendPct || '↑ 3.8%'} over 7 days
                </div>
                <div className="ks-range-bar-wrapper">
                  <div className="ks-range-labels">
                    <span>Min ₹{(livePriceData?.minPrice || Math.round(currentModalPrice * 0.94) || 0).toLocaleString('en-IN')}</span>
                    <span>Max ₹{(livePriceData?.maxPrice || Math.round(currentModalPrice * 1.06) || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="ks-range-bar">
                    <div className="ks-range-fill" style={{ width: '68%' }} />
                  </div>
                </div>
              </div>

              <div className="ks-card ks-metric-card">
                <div className="ks-card-label">{t.arrivalsLabel}</div>
                <div className="ks-metric-large">
                  {(livePriceData?.arrivals || 1240).toLocaleString('en-IN')} <span className="ks-unit">tonnes</span>
                </div>
                <div className="ks-metric-sub orange">
                  <TrendingDown size={14} /> {forecast.arrivalTrendPct} 7-day arrival volume
                </div>
                <p className="ks-mini-hint">Supply is tightening across district mandis.</p>
              </div>

              <div className="ks-card ks-metric-card">
                <div className="ks-card-label">{t.demandLabel}</div>
                <div className="ks-metric-large">
                  3,800 <span className="ks-unit">tonnes</span>
                </div>
                <div className="ks-metric-sub green">
                  <TrendingUp size={14} /> {forecast.demandTrendPct} active procurement tenders
                </div>
                <p className="ks-mini-hint">8 active buyers bidding on platform.</p>
              </div>

              <div className="ks-card ks-metric-card highlight">
                <div className="ks-card-label">{t.pressureLabel}</div>
                <div className="ks-signal-badge">
                  <Sparkles size={15} /> {t.pressureSignal}
                </div>
                <p className="ks-signal-desc">
                  {t.pressureDesc}
                </p>
              </div>
            </section>

            {isWoolCommodity && (
              <section className="ks-card ks-forecast-banner">
                <div className="ks-forecast-header">
                  <div>
                    <div className="ks-eyebrow"><Award size={14} /> WOOL QUALITY PRICE DISCOVERY</div>
                    <h2>Quality-adjusted reference for {qualityPricingBatch?.batchId || 'registered wool lot'}</h2>
                    <p className="ks-mini-hint">
                      {woolQualityPrice?.hasVerifiedCertificate
                        ? `Using verified certificate ${woolQualityPrice.certificateId}.`
                        : 'Quality verification required for quality-adjusted estimate.'}
                    </p>
                  </div>
                  <span className={'ks-badge ' + (woolQualityPrice?.hasVerifiedCertificate ? 'green' : 'blue')}>
                    {woolQualityPrice?.hasVerifiedCertificate ? 'Verified Quality' : 'Base Reference'}
                  </span>
                </div>

                <div className="ks-forecast-metrics">
                  <div>
                    <span>Market reference</span>
                    <b>&#8377;{(woolQualityPrice?.basePrice || currentModalPricePerKg).toLocaleString('en-IN')} / kg</b>
                  </div>
                  <div>
                    <span>Quality adjustments</span>
                    <b className={(woolQualityPrice?.totalAdjustment || 0) >= 0 ? 'ks-green-text' : ''}>
                      {(woolQualityPrice?.totalAdjustment || 0) >= 0 ? '+' : ''}&#8377;{(woolQualityPrice?.totalAdjustment || 0).toLocaleString('en-IN')} / kg
                    </b>
                  </div>
                  <div>
                    <span>Quality-adjusted value</span>
                    <b>&#8377;{(woolQualityPrice?.adjustedPrice || currentModalPricePerKg).toLocaleString('en-IN')} / kg</b>
                  </div>
                  <div>
                    <span>Fair range</span>
                    <b>
                      &#8377;{(woolQualityPrice?.fairPriceRange?.low || currentModalPricePerKg * 0.97).toLocaleString('en-IN')} - &#8377;{(woolQualityPrice?.fairPriceRange?.high || currentModalPricePerKg * 1.03).toLocaleString('en-IN')} / kg
                    </b>
                  </div>
                </div>

                {woolQualityPrice?.hasVerifiedCertificate && (
                  <div className="ks-accordion-body">
                    <ul>
                      {woolQualityPrice.breakdown.map(item => (
                        <li key={item.label}>
                          <Check size={15} /> {item.label}: {item.value} ({item.percent >= 0 ? '+' : ''}{item.percent}%) - {item.reason}
                        </li>
                      ))}
                    </ul>
                    <p className="ks-disclaimer">
                      <Info size={13} /> {woolQualityPrice.explanation} {woolQualityPrice.confidence}.
                    </p>
                  </div>
                )}
              </section>
            )}

            <section className="ks-card ks-forecast-banner">
              <div className="ks-forecast-header">
                <div>
                  <div className="ks-eyebrow">
                    <Sparkles size={14} /> {t.advisoryEyebrow}
                  </div>
                  <h2>{t.shouldSellQuestion} {commodity.name} {t.nowOrHold}</h2>
                </div>

                <div className={'ks-recommendation-badge ' + (forecast.recommendation.includes('HOLD') ? 'hold' : 'sell')}>
                  {forecast.recommendation}
                </div>
              </div>

              <div className="ks-forecast-metrics">
                <div>
                  <span>{t.expectedRangeLabel}</span>
                  <b>{forecast.expectedPriceRange}</b>
                </div>

                <div>
                  <span>{t.upsideLabel}</span>
                  <b className="ks-green-text">{forecast.upsidePerQtl}</b>
                </div>

                <div>
                  <span>{t.confidenceLabel}</span>
                  <b className="ks-confidence-tag"><CheckCircle2 size={14} /> {forecast.confidence}</b>
                </div>

                <button 
                  className="ks-button ks-button-dark"
                  onClick={() => setLotModalOpen(true)}
                >
                  {t.createLotBtn} <ArrowRight size={16} />
                </button>
              </div>

              <div className="ks-forecast-accordion">
                <button 
                  className="ks-accordion-toggle"
                  onClick={() => setExpandedReasoning(!expandedReasoning)}
                >
                  <span>{t.whyReasoning}</span>
                  {expandedReasoning ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {expandedReasoning && (
                  <div className="ks-accordion-body">
                    <ul>
                      {forecast.reasoning.map((r, idx) => (
                        <li key={idx}>
                          <Check size={15} /> {r}
                        </li>
                      ))}
                    </ul>
                    <p className="ks-disclaimer">
                      <Info size={13} /> Transparent signal-driven recommendation based on arrival trends, buyer tender intensity, and regional mandi spreads. Not a financial guarantee.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="ks-card ks-forecast-banner">
              <div className="ks-forecast-header">
                <div>
                  <div className="ks-eyebrow">
                    <Sparkles size={14} /> ANALYTICAL HELPER
                  </div>
                  <h2>KhetSetu AI Market Assistant</h2>
                  <p className="ks-mini-hint">
                    Uses only the KhetSetu evidence listed below; it does not fetch news or invent market data.
                  </p>
                </div>
                <button
                  className="ks-button ks-button-dark"
                  onClick={handleAnalyzeMarketWithAi}
                  disabled={aiAssistantLoading}
                >
                  {aiAssistantLoading ? 'Analyzing...' : 'Analyze Market'} <Sparkles size={15} />
                </button>
              </div>

              {aiAssistantError && (
                <div className="ks-modal-note" style={{ marginBottom: 12 }}>
                  <Info size={16} />
                  <span>{aiAssistantError}</span>
                </div>
              )}

              {aiAssistantResult && (
                <div className="ks-accordion-body">
                  <div className="ks-forecast-metrics">
                    <div>
                      <span>Recommendation</span>
                      <b>{aiAssistantResult.recommendation.replaceAll('_', ' ')}</b>
                    </div>
                    <div>
                      <span>Confidence</span>
                      <b className="ks-confidence-tag"><CheckCircle2 size={14} /> {aiAssistantResult.confidence}</b>
                    </div>
                  </div>
                  <p style={{ marginTop: 12 }}>{aiAssistantResult.summary}</p>

                  <ul>
                    {aiAssistantResult.reasons.map((reason, index) => (
                      <li key={index}>
                        <Check size={15} /> {reason.text}
                        {reason.evidenceIds?.length > 0 && (
                          <span style={{ color: '#666', marginLeft: 6 }}>
                            Evidence: {reason.evidenceIds.join(', ')}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>

                  <p><b>Suggested action:</b> {aiAssistantResult.suggestedAction}</p>

                  {aiAssistantResult.limitations?.length > 0 && (
                    <ul>
                      {aiAssistantResult.limitations.map((item, index) => (
                        <li key={index}><Info size={15} /> {item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="ks-forecast-accordion">
                <button
                  className="ks-accordion-toggle"
                  onClick={() => {
                    if (aiAssistantEvidence.length === 0) {
                      setAiAssistantEvidence(buildAiEvidence());
                    }
                    setAiEvidenceOpen(!aiEvidenceOpen);
                  }}
                >
                  <span>View Evidence Used</span>
                  {aiEvidenceOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {aiEvidenceOpen && (
                  <div className="ks-accordion-body">
                    <ul>
                      {(aiAssistantEvidence.length > 0 ? aiAssistantEvidence : buildAiEvidence()).map(item => (
                        <li key={item.id}>
                          <Info size={15} /> <b>{item.id}</b> - {item.label}: {item.value} <span style={{ color: '#666' }}>({item.source})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <p className="ks-disclaimer">
                <Info size={13} /> AI-generated analytical assistance based on available KhetSetu data. Not financial advice. Verify current market conditions before making a sale decision.
              </p>
            </section>

            <section className="ks-card ks-nearby-section">
              <div className="ks-section-head">
                <div>
                  <h3>{t.nearbyTitle} ({commodity.name})</h3>
                  <p>{t.nearbySub}</p>
                </div>
              </div>

              <div className="ks-table-responsive">
                <table className="ks-table">
                  <thead>
                    <tr>
                      <th>Market Name</th>
                      <th>District / State</th>
                      <th>Modal Price</th>
                      <th>Arrival Volume</th>
                      <th>Distance</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><b>{selectedDistrict} Mandi (Selected)</b></td>
                      <td>{selectedDistrict}, {selectedState}</td>
                      <td><b>₹{(currentModalPrice || 0).toLocaleString('en-IN')} / qtl</b></td>
                      <td>1,240 t</td>
                      <td><span className="ks-badge blue">0 km</span></td>
                      <td><button className="ks-link-btn" onClick={() => selectTab('comparison')}>Compare Net</button></td>
                    </tr>
                    <tr>
                      <td><b>Ramganj Mandi</b></td>
                      <td>Kota, Rajasthan</td>
                      <td><b>₹{(Math.round(currentModalPrice * 1.016) || 0).toLocaleString('en-IN')} / qtl</b></td>
                      <td>850 t</td>
                      <td>32 km</td>
                      <td><button className="ks-link-btn" onClick={() => selectTab('comparison')}>Compare Net</button></td>
                    </tr>
                    <tr>
                      <td><b>Baran Mandi</b></td>
                      <td>Baran, Rajasthan</td>
                      <td><b>₹{(Math.round(currentModalPrice * 0.98) || 0).toLocaleString('en-IN')} / qtl</b></td>
                      <td>1,100 t</td>
                      <td>45 km</td>
                      <td><button className="ks-link-btn" onClick={() => selectTab('comparison')}>Compare Net</button></td>
                    </tr>
                    <tr>
                      <td><b>Bundi APMC</b></td>
                      <td>Bundi, Rajasthan</td>
                      <td><b>₹{(Math.round(currentModalPrice * 1.004) || 0).toLocaleString('en-IN')} / qtl</b></td>
                      <td>620 t</td>
                      <td>38 km</td>
                      <td><button className="ks-link-btn" onClick={() => selectTab('comparison')}>Compare Net</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: PRICE COMPARISON & NET REALIZATION */}
        {(activeTab === 'comparison' || activeTab === 'logistics') && (
          <div className="ks-tab-content">
            <section className="ks-card ks-intro-banner">
              <div className="ks-eyebrow"><Building2 size={14} /> {t.netIntroEyebrow}</div>
              <h2>{activeTab === 'logistics' ? 'Coordinate transport and storage with confidence' : t.netIntroTitle}</h2>
              <p>{t.netIntroDesc}</p>
            </section>

            {bestChannel && (
              <div className="ks-best-net-hero">
                <div className="ks-best-net-badge">
                  <Award size={18} /> {t.bestNetBadge}
                </div>
                <div className="ks-best-net-body">
                  <div>
                    <h3>{bestChannel.buyerName} ({bestChannel.channelType})</h3>
                    <p>{t.estimatedNet}</p>
                  </div>
                  <div className="ks-best-net-price">
                    ₹{(bestChannel.netRealizationPerQtl || 0).toLocaleString('en-IN')}
                    <span>/ quintal</span>
                  </div>
                </div>
                <div className="ks-best-net-footer">
                  <span>
                    ✓ <b>+₹{((bestChannel.netRealizationPerQtl || 0) - (Math.round(currentModalPrice * 0.985) || 0)).toLocaleString('en-IN')}/qtl {t.bestNetHigher}</b>
                  </span>
                  <button 
                    className="ks-button ks-button-dark"
                    onClick={() => setLotModalOpen(true)}
                  >
                    Sell to {bestChannel.buyerName} <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            <div className="ks-channel-grid">
              {marketChannels.map((c) => {
                const grossQtl = (c.pricePerKg || 25) * 100;
                const freight = (c.distanceKm || 20) * 2.5;
                const fees = c.channelId === 'APMC_MANDI' ? Math.round(grossQtl * 0.015) : 20;
                const storage = c.channelId === 'PROCESSING_UNIT' ? 40 : 0;
                const net = Math.round(grossQtl - freight - fees - storage);
                const qualityReference = isWoolCommodity && woolQualityPrice?.hasVerifiedCertificate
                  ? compareOfferToQualityReference(c.pricePerKg, woolQualityPrice)
                  : null;

                return (
                  <div key={c.channelId} className={'ks-card ks-channel-card ' + (c.channelId === bestChannel?.channelId ? 'featured' : '')}>
                    <div className="ks-channel-header">
                      <span className="ks-channel-type">{c.channelType}</span>
                      <h4>{c.buyerName}</h4>
                      <div className="ks-channel-badge">{c.badge}</div>
                    </div>

                    <div className="ks-channel-math">
                      <div className="ks-math-row">
                        <span>{t.grossOffered}</span>
                        <b>₹{(grossQtl || 0).toLocaleString('en-IN')} / qtl</b>
                      </div>
                      <div className="ks-math-row minus">
                        <span>{t.freightMinus} ({c.distanceKm || 20} km)</span>
                        <span>-₹{freight} / qtl</span>
                      </div>
                      <div className="ks-math-row minus">
                        <span>{t.feesMinus}</span>
                        <span>-₹{fees} / qtl</span>
                      </div>
                      <div className="ks-math-row minus">
                        <span>{t.storageMinus}</span>
                        <span>-₹{storage} / qtl</span>
                      </div>
                      <div className="ks-math-divider" />
                      <div className="ks-math-row net">
                        <span>{t.estimatedNet}</span>
                        <b>₹{(net || 0).toLocaleString('en-IN')} / qtl</b>
                      </div>
                      {qualityReference && (
                        <div className="ks-math-row">
                          <span>{qualityReference.label}</span>
                          <b>{qualityReference.diff >= 0 ? '+' : ''}&#8377;{(qualityReference.diff * 100).toLocaleString('en-IN')} / qtl</b>
                        </div>
                      )}
                    </div>

                    <div className="ks-channel-footer">
                      <div className="ks-channel-meta">
                        <span><Truck size={13} /> {c.distanceKm || 20} km away</span>
                        <span><ShieldCheck size={13} /> {c.paymentTerms}</span>
                      </div>
                      <button 
                        className="ks-button ks-button-lime"
                        onClick={() => {
                          setSelectedBuyerForOffer({ companyName: c.buyerName, price: grossQtl });
                          setOfferModalOpen(true);
                        }}
                      >
                        {t.requestQuote} <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: VERIFIED BUYERS */}
        {activeTab === 'buyers' && (
          <div className="ks-tab-content">
            <section className="ks-intro-strip">
              <div>
                <h2>{t.tabBuyers} ({commodity.name})</h2>
                <p>{t.postLotToAll}</p>
              </div>
              <button className="ks-button ks-button-dark" onClick={() => setLotModalOpen(true)}>
                <PackagePlus size={16} /> {t.postLotToAll}
              </button>
            </section>

            <div className="ks-buyers-list">
              {matchedBuyers.map((b) => (
                <div key={b.id} className="ks-card ks-buyer-trust-card">
                  <div className="ks-buyer-top">
                    <div className="ks-buyer-info">
                      <div className="ks-buyer-title-row">
                        <h3>{b.companyName}</h3>
                        <span className="ks-verified-tag"><CheckCircle2 size={14} /> {t.verifiedBusiness}</span>
                      </div>
                      <span className="ks-buyer-type-badge">{b.buyerType} · {b.location} ({b.distanceKm} km)</span>
                    </div>

                    <div className="ks-match-score-badge">
                      <div className="ks-match-num">{b.matchScore}%</div>
                      <div className="ks-match-lbl">{t.matchScore}</div>
                    </div>
                  </div>

                  <div className="ks-buyer-specs-grid">
                    <div>
                      <span>{t.reqCommodity}</span>
                      <b>{b.cropName} ({b.requiredGrade} Grade)</b>
                    </div>
                    <div>
                      <span>{t.demandVolume}</span>
                      <b>{b.quantityRequired} {b.unit}</b>
                    </div>
                    <div>
                      <span>{t.offeredPrice}</span>
                      <b className="ks-price-highlight">₹{(b.offeredPricePerQtl || 0).toLocaleString('en-IN')} / qtl</b>
                    </div>
                    <div>
                      <span>{t.deliveryDeadline}</span>
                      <b>Within {b.deliveryDeadline}</b>
                    </div>
                  </div>

                  {isWoolCommodity && b.qualityReference && (() => {
                    const buyerNet = calculateNetRealization({
                      pricePerKg: (b.offeredPricePerQtl || 0) / 100,
                      quantityKg: 100,
                      distanceKm: b.distanceKm || 20,
                      transportCostPerKm: 2.5,
                      platformFeePercent: 1
                    });
                    const buyerNetPerQtl = Math.round(buyerNet.netRealizationPerKg * 100);
                    return (
                      <div className="ks-buyer-specs-grid">
                        <div>
                          <span>Quality requirement match</span>
                          <b>{b.qualityRequirementMatch}</b>
                        </div>
                        <div>
                          <span>Net realization</span>
                          <b>&#8377;{buyerNetPerQtl.toLocaleString('en-IN')} / qtl</b>
                        </div>
                        <div>
                          <span>Quality reference position</span>
                          <b>{b.qualityReference.label}</b>
                        </div>
                        <div>
                          <span>Difference vs reference</span>
                          <b>
                            {b.qualityReference.diff >= 0 ? '+' : ''}&#8377;{(b.qualityReference.diff * 100).toLocaleString('en-IN')} / qtl ({b.qualityReference.diffPct}%)
                          </b>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="ks-buyer-trust-metrics">
                    <div className="ks-trust-item">
                      <ShieldCheck size={16} className="green" />
                      <div>
                        <b>{b.paymentReliabilityPct}%</b>
                        <span>{t.paymentRel}</span>
                      </div>
                    </div>

                    <div className="ks-trust-item">
                      <WalletCards size={16} className="blue" />
                      <div>
                        <b>{b.avgPaymentDays} Days</b>
                        <span>{t.avgPayTime}</span>
                      </div>
                    </div>

                    <div className="ks-trust-item">
                      <FileText size={16} />
                      <div>
                        <b>{b.completedPurchases}</b>
                        <span>{t.completedPurchases}</span>
                      </div>
                    </div>

                    <div className="ks-trust-item">
                      <MessageSquareWarning size={16} />
                      <div>
                        <b>{b.disputeRatePct}%</b>
                        <span>{t.disputeRate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="ks-buyer-accordion">
                    <button 
                      className="ks-accordion-toggle"
                      onClick={() => setExpandedBuyerId(expandedBuyerId === b.id ? null : b.id)}
                    >
                      <span>{t.whyBuyerRecommended}</span>
                      {expandedBuyerId === b.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {expandedBuyerId === b.id && (
                      <div className="ks-accordion-body">
                        <div className="ks-match-factors-grid">
                          <div className="ks-factor-row">
                            <span>Quality &amp; Variety Compatibility (30%)</span>
                            <div className="ks-factor-bar"><div style={{ width: '100%' }} /></div>
                            <b>100%</b>
                          </div>
                          <div className="ks-factor-row">
                            <span>Quantity / Aggregation Fit (20%)</span>
                            <div className="ks-factor-bar"><div style={{ width: '90%' }} /></div>
                            <b>90%</b>
                          </div>
                          <div className="ks-factor-row">
                            <span>Price Realization vs Mandi (20%)</span>
                            <div className="ks-factor-bar"><div style={{ width: '100%' }} /></div>
                            <b>100%</b>
                          </div>
                          <div className="ks-factor-row">
                            <span>Location &amp; Freight Corridor (15%)</span>
                            <div className="ks-factor-bar"><div style={{ width: '80%' }} /></div>
                            <b>80%</b>
                          </div>
                          <div className="ks-factor-row">
                            <span>Delivery Timing Window (15%)</span>
                            <div className="ks-factor-bar"><div style={{ width: '100%' }} /></div>
                            <b>100%</b>
                          </div>
                        </div>

                        {b.matchBreakdown && b.matchBreakdown.length > 0 && (
                          <ul className="ks-breakdown-bullets">
                            {b.matchBreakdown.map((item, idx) => (
                              <li key={idx}><Check size={14} /> {item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="ks-buyer-actions">
                    <button 
                      className="ks-button ks-button-dark"
                      onClick={() => {
                        setSelectedBuyerForOffer(b);
                        setOfferModalOpen(true);
                      }}
                    >
                      {t.sendOfferBtn} <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TRUST SERVICE: QUALITY PARTNER WORKSPACE */}
        {activeTab === 'trust' && (
          <div className="ks-tab-content">
            <section className="ks-intro-strip">
              <div>
                <h2>Quality Partner Workspace</h2>
                <p>Review wool inspection requests and issue verified quality certificates.</p>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span className="ks-badge blue">{pendingInspectionCount} Pending</span>
                <span className="ks-badge green">{completedInspectionCount} Completed</span>
              </div>
            </section>

            <section className="ks-snapshot-grid">
              <div className="ks-card ks-metric-card">
                <div className="ks-card-label">PENDING WOOL INSPECTIONS</div>
                <div className="ks-metric-large">{pendingInspectionCount}</div>
                <p className="ks-mini-hint">Open requests and uninspected registered wool batches.</p>
              </div>
              <div className="ks-card ks-metric-card">
                <div className="ks-card-label">CERTIFICATES ISSUED</div>
                <div className="ks-metric-large">{completedInspectionCount}</div>
                <p className="ks-mini-hint">Completed records linked to WoolBatch certificates.</p>
              </div>
              <div className="ks-card ks-metric-card highlight">
                <div className="ks-card-label">SERVICE ROLE</div>
                <div className="ks-signal-badge"><ShieldCheck size={15} /> Verification</div>
                <p className="ks-signal-desc">Quality Partner verifies wool quality only; marketplace transactions remain separate.</p>
              </div>
            </section>

            <section className="ks-card">
              <div className="ks-section-head">
                <div>
                  <h3>Wool Inspection Queue</h3>
                  <p>Certificates are issued through the existing QA backend and linked back to the production batch.</p>
                </div>
              </div>

              <div className="ks-table-responsive">
                <table className="ks-table">
                  <thead>
                    <tr>
                      <th>Request</th>
                      <th>Batch</th>
                      <th>Farmer / Origin</th>
                      <th>Wool</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingInspections ? (
                      <tr><td colSpan="6">Loading wool inspections...</td></tr>
                    ) : inspectionRows.length === 0 ? (
                      <tr><td colSpan="6">No wool inspection requests found.</td></tr>
                    ) : inspectionRows.map(request => {
                      const existingCert = findCertificateForBatch(request.batchId);
                      const status = existingCert ? 'CERTIFICATE_ISSUED' : request.status || 'PENDING_ASSIGNMENT';
                      const isIssued = status === 'CERTIFICATE_ISSUED';
                      const isAssigned = status === 'ASSIGNED';
                      return (
                        <tr key={request.requestId || request.id || request.batchId}>
                          <td><b>{request.requestId || request.id}</b></td>
                          <td>{request.batchId}</td>
                          <td>
                            <b>{request.farmerName || 'Registered Farmer'}</b>
                            <div style={{ fontSize: 11, color: '#66766A' }}>{request.location || 'Registered origin'}</div>
                          </td>
                          <td>{request.quantity || 0} KG {request.woolType || 'Raw Wool'}</td>
                          <td>
                            <span className={'ks-badge ' + (existingCert ? 'green' : 'blue')}>
                              {status.replaceAll('_', ' ')}
                            </span>
                          </td>
                          <td>
                            {isIssued && existingCert ? (
                              <Link to={`/verify/${existingCert.certificateId || existingCert.id}`} className="ks-link-btn">
                                View Certificate
                              </Link>
                            ) : isIssued ? (
                              <button className="ks-link-btn" type="button" onClick={() => viewInspectionCertificate(request)}>
                                View Certificate
                              </button>
                            ) : (
                              <button className="ks-link-btn" type="button" onClick={() => openInspection(request)}>
                                {isAssigned ? 'Open Inspection' : 'Assign / Start Inspection'}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* TAB 4: DEMAND BY QUALITY */}
        {activeTab === 'demand' && (
          <div className="ks-tab-content">
            <section className="ks-card ks-intro-banner">
              <div className="ks-eyebrow"><Award size={14} /> {t.dynamicQualityTitle}</div>
              <h2>{t.demandByQualityTitle} ({commodity.name})</h2>
              <p>{t.demandByQualitySub}</p>
            </section>

            <div className="ks-quality-panel-grid">
              <div className="ks-card ks-quality-card">
                <h3>{t.qualitySchemaHead} {commodity.name}</h3>
                <div className="ks-schema-list">
                  {commodity.qualityAttributes ? (
                    commodity.qualityAttributes.map((attr, i) => (
                      <div key={i} className="ks-schema-item">
                        <span>{attr.name || attr}</span>
                        <b>{attr.standard || 'Moisture < 12%'}</b>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="ks-schema-item"><span>Grade Requirement</span><b>FAQ / Grade A</b></div>
                      <div className="ks-schema-item"><span>Moisture Content</span><b>Less than 12%</b></div>
                      <div className="ks-schema-item"><span>Foreign Matter</span><b>Below 1.5%</b></div>
                      <div className="ks-schema-item"><span>Admixture</span><b>Below 1.0%</b></div>
                    </>
                  )}
                </div>
              </div>

              <div className="ks-card ks-quality-demand-card">
                <h3>{t.demandVolumeByGrade}</h3>
                <div className="ks-grade-demand-list">
                  <div className="ks-grade-row">
                    <div>
                      <b>FAQ Grade (Standard)</b>
                      <span>2,100 tonnes demand</span>
                    </div>
                    <b className="ks-grade-price">₹{(Math.round(currentModalPrice * 1.0) || 0).toLocaleString('en-IN')} - ₹{(Math.round(currentModalPrice * 1.04) || 0).toLocaleString('en-IN')} / qtl</b>
                  </div>

                  <div className="ks-grade-row">
                    <div>
                      <b>Premium Grade (Grade A+)</b>
                      <span>900 tonnes demand</span>
                    </div>
                    <b className="ks-grade-price">₹{(Math.round(currentModalPrice * 1.08) || 0).toLocaleString('en-IN')} - ₹{(Math.round(currentModalPrice * 1.15) || 0).toLocaleString('en-IN')} / qtl</b>
                  </div>

                  <div className="ks-grade-row">
                    <div>
                      <b>Standard Commercial Grade</b>
                      <span>800 tonnes demand</span>
                    </div>
                    <b className="ks-grade-price">₹{(Math.round(currentModalPrice * 0.92) || 0).toLocaleString('en-IN')} - ₹{(Math.round(currentModalPrice * 0.96) || 0).toLocaleString('en-IN')} / qtl</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MY SELL LOTS */}
        {activeTab === 'lots' && (
          <div className="ks-tab-content">
            <section className="ks-intro-strip">
              <div>
                <h2>{t.myLotsHead}</h2>
                <p>{t.myLotsSub}</p>
              </div>
              <button className="ks-button ks-button-dark" onClick={() => setLotModalOpen(true)}>
                <PackagePlus size={16} /> {t.createNewLot}
              </button>
            </section>

            <div className="ks-lots-list">
              {woolLots.map(lot => {
                const lotQuantity = lot.totalQuantity ?? lot.quantity ?? 0;
                const lotUnit = lot.unit || 'KG';
                const lotPrice = lot.minAcceptablePrice || lot.askingPrice || lot.minPrice || Math.round(currentModalPrice * 0.95) || 0;
                const lotStatus = lot.status || 'AVAILABLE';
                const lotTraceabilityUrl = lot.traceabilityUrl || (lot.batchIds?.[0] ? '/track/' + lot.batchIds[0] : '');

                return (
                  <div className="ks-card ks-lot-card" key={lot.id || lot.lotNumber}>
                    <div className="ks-lot-header">
                      <div>
                        <span className="ks-lot-id">{lot.lotNumber || lot.id}</span>
                        <h3>{lot.woolType || lot.cropName || 'Registered Wool Lot'} - {lotQuantity} {lotUnit} ({lot.qualityGrade || 'Pending QA'})</h3>
                        <span className="ks-lot-loc"><MapPin size={13} /> {lot.currentLocation || lot.origin || selectedDistrict + ', ' + selectedState}</span>
                      </div>
                      <div className="ks-badge green">5 {t.matchedBuyersCount}</div>
                    </div>

                    <div className="ks-lot-meta">
                      <div><span>{t.minAcceptablePrice}</span><b>Rs {Number(lotPrice).toLocaleString('en-IN')} / {lotUnit}</b></div>
                      <div><span>{t.bestOfferReceived}</span><b className="ks-green-text">Rs {(Math.round(currentModalPrice * 1.05) || 0).toLocaleString('en-IN')} / {lotUnit} (Shree Foods)</b></div>
                      <div><span>{t.saleWindow}</span><b>{lot.saleWindow || 'Next 7 days'}</b></div>
                      <div><span>{t.statusLabel}</span><b>{lotStatus.replaceAll('_', ' ')}</b></div>
                    </div>

                    {lotTraceabilityUrl && (
                      <div className="ks-modal-note">
                        <ShieldCheck size={16} />
                        <span>Batch traceability linked: <Link to={lotTraceabilityUrl}>{lot.batchIds?.[0] || 'Open record'}</Link>{lot.certificateId ? ' | Certificate ' + lot.certificateId : ''}</span>
                      </div>
                    )}

                    <div className="ks-timeline-wrapper">
                      <h4>{t.timelineTitle}</h4>
                      <div className="ks-timeline-steps">
                        <div className="ks-step completed">
                          <div className="ks-step-node"><Check size={12} /></div>
                          <span>Lot Created</span>
                        </div>
                        <div className="ks-step completed">
                          <div className="ks-step-node"><Check size={12} /></div>
                          <span>Quality Verified</span>
                        </div>
                        <div className="ks-step completed">
                          <div className="ks-step-node"><Check size={12} /></div>
                          <span>Buyer Matched</span>
                        </div>
                        <div className="ks-step active">
                          <div className="ks-step-node">4</div>
                          <span>Offer Received</span>
                        </div>
                        <div className="ks-step">
                          <div className="ks-step-node">5</div>
                          <span>Transport</span>
                        </div>
                        <div className="ks-step">
                          <div className="ks-step-node">6</div>
                          <span>Payment Released</span>
                        </div>
                      </div>
                    </div>

                    <div className="ks-lot-actions">
                      <button
                        className="ks-button ks-button-dark"
                        onClick={() => {
                          setSelectedBuyerForOffer({ companyName: 'Shree Foods Pvt. Ltd.', price: Math.round(currentModalPrice * 1.05), lotNumber: lot.lotNumber });
                          setOfferModalOpen(true);
                        }}
                      >
                        {t.respondToOffer} <ArrowRight size={15} />
                      </button>
                      <button
                        className="ks-button ks-button-lime"
                        onClick={() => setPaymentModalOpen(true)}
                      >
                        {t.settleUpi} <WalletCards size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
              {woolLots.length === 0 && (
              <div className="ks-card ks-lot-card">
                <div className="ks-lot-header">
                  <div>
                    <span className="ks-lot-id">LOT #KS-038</span>
                    <h3>{selectedCrop} - 100 Quintals (Grade A)</h3>
                    <span className="ks-lot-loc"><MapPin size={13} /> {selectedDistrict}, {selectedState}</span>
                  </div>
                  <div className="ks-badge green">5 {t.matchedBuyersCount}</div>
                </div>

                <div className="ks-lot-meta">
                  <div><span>{t.minAcceptablePrice}</span><b>₹{(Math.round(currentModalPrice * 0.95) || 0).toLocaleString('en-IN')} / qtl</b></div>
                  <div><span>{t.bestOfferReceived}</span><b className="ks-green-text">₹{(Math.round(currentModalPrice * 1.05) || 0).toLocaleString('en-IN')} / qtl (Shree Foods)</b></div>
                  <div><span>{t.saleWindow}</span><b>Next 7 days</b></div>
                  <div><span>{t.statusLabel}</span><b>{t.negotiationActive}</b></div>
                </div>

                <div className="ks-timeline-wrapper">
                  <h4>{t.timelineTitle}</h4>
                  <div className="ks-timeline-steps">
                    <div className="ks-step completed">
                      <div className="ks-step-node"><Check size={12} /></div>
                      <span>Lot Created</span>
                    </div>
                    <div className="ks-step completed">
                      <div className="ks-step-node"><Check size={12} /></div>
                      <span>Quality Verified</span>
                    </div>
                    <div className="ks-step completed">
                      <div className="ks-step-node"><Check size={12} /></div>
                      <span>Buyer Matched</span>
                    </div>
                    <div className="ks-step active">
                      <div className="ks-step-node">4</div>
                      <span>Offer Received</span>
                    </div>
                    <div className="ks-step">
                      <div className="ks-step-node">5</div>
                      <span>Transport</span>
                    </div>
                    <div className="ks-step">
                      <div className="ks-step-node">6</div>
                      <span>Payment Released</span>
                    </div>
                  </div>
                </div>

                <div className="ks-lot-actions">
                  <button 
                    className="ks-button ks-button-dark"
                    onClick={() => {
                      setSelectedBuyerForOffer({ companyName: 'Shree Foods Pvt. Ltd.', price: Math.round(currentModalPrice * 1.05) });
                      setOfferModalOpen(true);
                    }}
                  >
                    {t.respondToOffer} <ArrowRight size={15} />
                  </button>
                  <button 
                    className="ks-button ks-button-lime"
                    onClick={() => setPaymentModalOpen(true)}
                  >
                    {t.settleUpi} <WalletCards size={15} />
                  </button>
                </div>
              </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: FPO AGGREGATION */}
        {activeTab === 'fpo' && (
          <div className="ks-tab-content">
            <section className="ks-card ks-intro-banner">
              <div className="ks-eyebrow"><Users size={14} /> COLLECTIVE SELLING WORKSPACE</div>
              <h2>FPO aggregation &amp; shared bargaining power</h2>
              <p>Pool member lots, standardise quality, and take one verified offer to market with transparent settlement records.</p>
            </section>
            <div className="ks-grid-3">
              <div className="ks-card"><span className="ks-eyebrow">ACTIVE MEMBERS</span><strong className="ks-metric-value">128</strong><p>Farmers contributing this season</p></div>
              <div className="ks-card"><span className="ks-eyebrow">AGGREGATED VOLUME</span><strong className="ks-metric-value">486 qtl</strong><p>Sell-ready across 14 lots</p></div>
              <div className="ks-card"><span className="ks-eyebrow">NEGOTIATION LIFT</span><strong className="ks-metric-value ks-green-text">+8.4%</strong><p>Average premium vs. local mandi</p></div>
            </div>
            <section className="ks-card">
              <h3>Recommended aggregation action</h3>
              <p>Combine Grade A wheat lots from Kota and Bundi to meet Shree Foods’ 200 qtl tender. KhetSetu predicts a ₹90/qtl premium after shared transport.</p>
              <button className="ks-button ks-button-dark" onClick={() => selectTab('buyers')}>Review matched buyers <ArrowRight size={15} /></button>
            </section>
          </div>
        )}

        {/* TAB 6: PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="ks-tab-content">
            <section className="ks-card ks-intro-banner">
              <div className="ks-eyebrow"><ShieldCheck size={14} /> SECURE ESCROW &amp; UPI SETTLEMENT</div>
              <h2>{t.paymentsHead}</h2>
              <p>{t.paymentsSub}</p>
            </section>

            <div className="ks-payment-balance-card">
              <div>
                <span>{t.availableToSettle}</span>
                <b>₹{(Math.round(currentModalPrice * 100) || 0).toLocaleString('en-IN')}</b>
                <p>From Shree Foods Pvt. Ltd. · Lot #KS-038 (100 qtl {commodity.name})</p>
              </div>
              <button className="ks-button ks-button-lime" onClick={() => setPaymentModalOpen(true)}>
                {t.settleDbt} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* TAB 7: DISPUTES */}
        {activeTab === 'disputes' && (
          <div className="ks-tab-content">
            <section className="ks-card ks-intro-banner">
              <div className="ks-eyebrow"><MessageSquareWarning size={14} /> FAIR RESOLUTION DESK</div>
              <h2>{t.disputeHead}</h2>
              <p>{t.disputeSub}</p>
            </section>

            <div className="ks-card ks-dispute-card">
              <div className="ks-dispute-icon"><ShieldCheck size={24} /></div>
              <div>
                <b>{t.noOpenGrievances}</b>
                <span>{t.noGrievanceSub}</span>
              </div>
              <button className="ks-button ks-button-dark" onClick={() => showToast('Grievance form submitted to dispute desk')}>
                {t.raiseGrievanceBtn}
              </button>
            </div>
          </div>
        )}
        </main>
      </div>

      {/* CROP50 CONSTITUENT DETAIL DRILLDOWN MODAL */}
      {selectedCrop50Detail && (
        <div className="ks-modal-backdrop">
          <div className="ks-modal ks-crop50-detail-modal">
            <button className="ks-close" onClick={() => setSelectedCrop50Detail(null)}><X /></button>
            <div className="ks-eyebrow"><Activity size={14} /> CROP50 CONSTITUENT DRILLDOWN</div>
            <h2>{selectedCrop50Detail.name}</h2>
            <span className="ks-crop-category-pill">{selectedCrop50Detail.category}</span>

            <div className="ks-crop50-detail-metrics">
              <div>
                <span>CROP50 WEIGHT</span>
                <b>{(selectedCrop50Detail.weight * 100).toFixed(2)}%</b>
              </div>
              <div>
                <span>CURRENT SPOT PRICE</span>
                <b className="ks-green-text">₹{selectedCrop50Detail.currentPrice} {selectedCrop50Detail.unit}</b>
              </div>
              <div>
                <span>BASE PRICE (LAUNCH)</span>
                <b>₹{selectedCrop50Detail.basePrice} {selectedCrop50Detail.unit}</b>
              </div>
              <div>
                <span>INDEX CONTRIBUTION</span>
                <b className={selectedCrop50Detail.isPositive ? 'ks-green-text' : 'ks-coral-text'}>
                  {selectedCrop50Detail.contributionPoints > 0 ? '+' : ''}{selectedCrop50Detail.contributionPoints} pts
                </b>
              </div>
            </div>

            <div className="ks-crop50-market-meta">
              <div>
                <span>REPORTING MANDIS</span>
                <b>{selectedCrop50Detail.reportingMarkets} APMCs</b>
              </div>
              <div>
                <span>DAILY ARRIVALS</span>
                <b>{selectedCrop50Detail.arrivalTonnes} Tonnes</b>
              </div>
              <div>
                <span>BUYER DEMAND</span>
                <b>HIGH (Direct Millers Active)</b>
              </div>
            </div>

            <div className="ks-detail-actions-strip">
              <button 
                className="ks-button ks-button-dark"
                onClick={() => {
                  setSelectedCrop(selectedCrop50Detail.id);
                  setSelectedCrop50Detail(null);
                  selectTab('overview');
                }}
              >
                Analyze {selectedCrop50Detail.name} Advisory <ArrowRight size={15} />
              </button>
              <button 
                className="ks-button ks-button-lime"
                onClick={() => {
                  setSelectedCrop(selectedCrop50Detail.id);
                  setSelectedCrop50Detail(null);
                  selectTab('buyers');
                }}
              >
                View Buyers &amp; Net Realization
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CROP50 METHODOLOGY MODAL */}
      {showMethodologyModal && (
        <div className="ks-modal-backdrop">
          <div className="ks-modal ks-methodology-modal">
            <button className="ks-close" onClick={() => setShowMethodologyModal(false)}><X /></button>
            <div className="ks-eyebrow"><HelpCircle size={14} /> METHODOLOGY &amp; GOVERNANCE</div>
            <h2>CROP50 Index Calculation Methodology</h2>
            <p className="ks-methodology-intro">
              CROP50 is India's national crop market index tracking price movement across 50 agricultural commodities.
            </p>

            <div className="ks-methodology-facts">
              <div><span>Index Ticker</span><b>CROP50</b></div>
              <div><span>Base Value</span><b>1,000.00 pts</b></div>
              <div><span>Base Date</span><b>08 September 2026</b></div>
              <div><span>Constituents</span><b>50 Major Crops</b></div>
              <div><span>Weighting Method</span><b>KhetSetu Base Weights</b></div>
              <div><span>Rebalancing</span><b>Annual Governance Review</b></div>
              <div><span>Data Source</span><b>CEDA Agmarknet / Ashoka Univ</b></div>
            </div>

            <div className="ks-math-box">
              <b>Mathematical Formula:</b>
              <code>CROP50(t) = 1000 × Σ [ weight_i × (Price_i(t) / BasePrice_i) ]</code>
              <p>
                Prices are normalized against constituent-specific base prices, allowing commodities with different physical units (₹/kg, ₹/quintal, ₹/dozen) to contribute based on percentage price returns rather than raw price levels.
              </p>
            </div>

            <div className="ks-disclaimer-box">
              <Info size={14} />
              <span>{CROP50_METADATA.disclaimer}</span>
            </div>

            <button className="ks-button ks-button-dark ks-modal-action" onClick={() => setShowMethodologyModal(false)}>
              Close Methodology
            </button>
          </div>
        </div>
      )}

      {/* QUALITY CERTIFICATE ISSUANCE MODAL */}
      {selectedInspection && (
        <div className="ks-modal-backdrop">
          <form className="ks-modal" style={{ maxWidth: 680 }} onSubmit={issueInspectionCertificate}>
            <button type="button" className="ks-close" onClick={() => setSelectedInspection(null)}><X /></button>
            <div className="ks-eyebrow"><ShieldCheck size={14} /> QUALITY VERIFICATION</div>
            <h2>Issue Wool Quality Certificate</h2>
            <p>Enter inspection metrics for Batch {selectedInspection.batchId}. Certificate data will be persisted through the existing QA backend.</p>

            <div className="ks-modal-note">
              <FileText size={16} />
              <span>{selectedInspection.farmerName || 'Registered Farmer'} | {selectedInspection.quantity || 0} KG | {selectedInspection.woolType || 'Raw Wool'}</span>
            </div>

            {inspectionError && (
              <div className="ks-modal-note" style={{ background: '#FEE2E2', color: '#991B1B' }}>
                <Info size={16} />
                <span>{inspectionError}</span>
              </div>
            )}

            <div className="ks-form-grid">
              <label>Fiber Diameter (micron)
                <input required type="number" step="0.01" value={inspectionForm.fiberDiameter} onChange={e => setInspectionForm({ ...inspectionForm, fiberDiameter: e.target.value })} />
              </label>
              <label>Staple Length (mm)
                <input required type="number" step="0.01" value={inspectionForm.stapleLength} onChange={e => setInspectionForm({ ...inspectionForm, stapleLength: e.target.value })} />
              </label>
            </div>

            <div className="ks-form-grid">
              <label>Clean Yield (%)
                <input required type="number" step="0.01" value={inspectionForm.cleanYield} onChange={e => setInspectionForm({ ...inspectionForm, cleanYield: e.target.value })} />
              </label>
              <label>Moisture (%)
                <input required type="number" step="0.01" value={inspectionForm.moisture} onChange={e => setInspectionForm({ ...inspectionForm, moisture: e.target.value })} />
              </label>
            </div>

            <div className="ks-form-grid">
              <label>Cleanliness (%)
                <input required type="number" step="0.01" value={inspectionForm.cleanliness} onChange={e => setInspectionForm({ ...inspectionForm, cleanliness: e.target.value })} />
              </label>
              <label>Vegetable Matter
                <input type="text" value={inspectionForm.vegetableMatter} onChange={e => setInspectionForm({ ...inspectionForm, vegetableMatter: e.target.value })} />
              </label>
            </div>

            <div className="ks-form-grid">
              <label>Contamination
                <select value={inspectionForm.contamination} onChange={e => setInspectionForm({ ...inspectionForm, contamination: e.target.value })}>
                  <option>None</option><option>Low</option><option>Moderate</option><option>High</option>
                </select>
              </label>
              <label>Foreign Matter
                <select value={inspectionForm.foreignMatter} onChange={e => setInspectionForm({ ...inspectionForm, foreignMatter: e.target.value })}>
                  <option>None</option><option>Low</option><option>Moderate</option><option>High</option>
                </select>
              </label>
            </div>

            <div className="ks-form-grid">
              <label>Strength
                <select value={inspectionForm.strength} onChange={e => setInspectionForm({ ...inspectionForm, strength: e.target.value })}>
                  <option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option>
                </select>
              </label>
              <label>Overall Score
                <input required type="number" min="0" max="100" step="0.01" value={inspectionForm.overallScore} onChange={e => setInspectionForm({ ...inspectionForm, overallScore: e.target.value })} />
              </label>
            </div>

            <label>Final Grade
              <select required value={inspectionForm.grade} onChange={e => setInspectionForm({ ...inspectionForm, grade: e.target.value })}>
                <option value="">Select grade</option>
                <option value="A+">Grade A+</option>
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
              </select>
            </label>

            <label>Remarks
              <textarea rows="3" value={inspectionForm.remarks} onChange={e => setInspectionForm({ ...inspectionForm, remarks: e.target.value })} />
            </label>

            <button type="submit" className="ks-button ks-button-dark ks-modal-action" disabled={issuingCertificate}>
              {issuingCertificate ? 'Issuing Certificate...' : 'Issue Certificate'} <ArrowRight size={16} />
            </button>
          </form>
        </div>
      )}

      {/* MODAL 1: CREATE SELL LOT MODAL */}
      {lotModalOpen && (
        <div className="ks-modal-backdrop">
          <form className="ks-modal" onSubmit={(e) => {
            e.preventDefault();
            const listingQuantity = Number(newLot.quantity);
            if (!Number.isFinite(listingQuantity) || listingQuantity <= 0) {
              showToast('Enter a listing quantity greater than 0.');
              return;
            }

            if (isWoolCommodity && !selectedBatch) {
              showToast('Select a registered Wool Batch before creating a sell lot.');
              return;
            }
            if (isWoolCommodity && listingQuantity > selectedBatchAvailableQuantity) {
              showToast('Listing quantity cannot exceed available batch quantity.');
              return;
            }
            const batchId = isWoolCommodity ? getBatchKey(selectedBatch) : null;
            const price = Number(newLot.minPrice) || 2400;
            const genericUnit = commodity.defaultUnit || 'KG';
            setLotModalOpen(false);
            if (createWoolLot) {
              const lotPayload = isWoolCommodity ? {
                batchIds: [batchId],
                farmerId: selectedBatch.farmerId,
                farmerName: selectedBatch.farmerName,
                sellerId: selectedBatch.farmerId,
                sellerName: selectedBatch.farmerName,
                sellerType: 'FARMER',
                cropId: selectedBatch.cropId || selectedCrop,
                cropName: selectedBatch.cropName || newLot.crop,
                woolType: selectedBatch.woolType || newLot.variety || newLot.crop,
                variety: selectedBatch.variety || newLot.variety,
                origin: selectedBatch.origin,
                currentLocation: selectedBatch.currentLocation || selectedBatch.storageLocation || selectedBatch.origin,
                qualityGrade: selectedBatch.qualityGrade || newLot.grade,
                certificateId: selectedBatch.certificateId,
                traceabilityUrl: '/track/' + batchId,
                quantity: listingQuantity,
                totalQuantity: listingQuantity,
                availableQuantity: listingQuantity,
                unit: selectedBatch.unit || 'KG',
                minPrice: price,
                minAcceptablePrice: price,
                askingPrice: price,
                saleWindow: newLot.window
              } : {
                cropId: selectedCrop,
                cropName: commodity.name,
                woolType: commodity.name + ' (' + newLot.grade + ')',
                variety: newLot.variety,
                quantity: listingQuantity,
                totalQuantity: listingQuantity,
                availableQuantity: listingQuantity,
                unit: genericUnit,
                qualityGrade: newLot.grade,
                minPrice: price,
                minAcceptablePrice: price,
                askingPrice: price,
                saleWindow: newLot.window
              };
              createWoolLot(lotPayload);
            }
            showToast(
              isWoolCommodity
                ? 'Sell Lot created for ' + listingQuantity + ' ' + (selectedBatch.unit || 'KG') + ' from ' + batchId + '. Matched buyers notified!'
                : 'Sell Lot created for ' + listingQuantity + ' ' + genericUnit + ' of ' + commodity.name + '. Matched buyers notified!'
            );
            selectTab('lots');
          }}>
            <button type="button" className="ks-close" onClick={() => setLotModalOpen(false)}><X /></button>
            <div className="ks-eyebrow"><PackagePlus size={14} /> SELL-READY LOT</div>
            <h2>Create a Sell Lot</h2>
            <p>Post your produce to KhetSetu matching engine to receive direct buyer offers.</p>

            {isWoolCommodity ? (
              <>
                <label>Select Registered Wool Batch
                  <select required value={newLot.selectedBatchId} onChange={e => handleBatchSelect(e.target.value)}>
                    <option value="">Choose a registered batch</option>
                    {registeredBatches.map(batch => {
                      const batchId = getBatchKey(batch);
                      return (
                        <option key={batchId} value={batchId}>
                          {batchId} - {batch.woolType || batch.variety || 'Wool Batch'} - {getAvailableQuantity(batch)} {batch.unit || 'KG'}
                        </option>
                      );
                    })}
                  </select>
                </label>

                <div className="ks-form-grid">
                  <label>Wool Type / Variety
                    <input readOnly value={selectedBatch ? (selectedBatch.woolType || selectedBatch.variety || selectedBatch.cropName || '') : ''} />
                  </label>
                  <label>Available Quantity
                    <input readOnly value={selectedBatch ? `${selectedBatchAvailableQuantity} ${selectedBatch.unit || 'KG'}` : ''} />
                  </label>
                </div>

                <div className="ks-form-grid">
                  <label>Origin
                    <input readOnly value={selectedBatch?.origin || ''} />
                  </label>
                  <label>Current Location
                    <input readOnly value={selectedBatch?.currentLocation || selectedBatch?.storageLocation || ''} />
                  </label>
                </div>
              </>
            ) : (
              <>
                <label>Crop / Commodity
                  <select value={selectedCrop} onChange={e => setSelectedCrop(e.target.value)}>
                    {COMMODITIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </label>

                <label>Variety
                  <select value={newLot.variety} onChange={e => setNewLot({ ...newLot, variety: e.target.value })}>
                    {(commodity.varieties || [commodity.name]).map(variety => (
                      <option key={variety} value={variety}>{variety}</option>
                    ))}
                  </select>
                </label>
              </>
            )}

            <div className="ks-form-grid">
              <label>Listing Quantity ({isWoolCommodity ? (selectedBatch?.unit || 'KG') : (commodity.defaultUnit || 'KG')})
                <input 
                  required 
                  type="number" 
                  min="0.01"
                  max={isWoolCommodity && selectedBatch ? selectedBatchAvailableQuantity : undefined}
                  step="0.01"
                  value={newLot.quantity} 
                  onChange={e => setNewLot({ ...newLot, quantity: e.target.value })} 
                />
              </label>
              <label>Quality Grade
                {isWoolCommodity ? (
                  <input readOnly value={selectedBatch?.qualityGrade || ''} />
                ) : (
                  <select value={newLot.grade} onChange={e => setNewLot({ ...newLot, grade: e.target.value })}>
                    <option value="A">Grade A (Premium)</option>
                    <option value="FAQ">FAQ (Fair Average Quality)</option>
                    <option value="B">Grade B (Standard)</option>
                  </select>
                )}
              </label>
            </div>

            {isWoolCommodity && (
              <label>Certificate ID
                <input readOnly value={selectedBatch?.certificateId || ''} />
              </label>
            )}

            {isWoolCommodity && (
              <div className="ks-modal-note" style={{ alignItems: 'flex-start' }}>
                <Award size={16} />
                <span>
                  {selectedBatchWoolQualityPrice?.hasVerifiedCertificate ? (
                    <>
                      <b>Quality-adjusted reference: &#8377;{selectedBatchWoolQualityPrice.adjustedPrice.toLocaleString('en-IN')} / kg</b>
                      <br />
                      Market reference &#8377;{selectedBatchWoolQualityPrice.basePrice.toLocaleString('en-IN')} / kg;
                      adjustments {selectedBatchWoolQualityPrice.totalAdjustment >= 0 ? '+' : ''}&#8377;{selectedBatchWoolQualityPrice.totalAdjustment.toLocaleString('en-IN')} / kg;
                      fair range &#8377;{selectedBatchWoolQualityPrice.fairPriceRange.low.toLocaleString('en-IN')} - &#8377;{selectedBatchWoolQualityPrice.fairPriceRange.high.toLocaleString('en-IN')} / kg.
                    </>
                  ) : (
                    <>
                      <b>Market reference: &#8377;{currentModalPricePerKg.toLocaleString('en-IN')} / kg</b>
                      <br />
                      Quality verification required for quality-adjusted estimate.
                    </>
                  )}
                </span>
              </div>
            )}

            <div className="ks-form-grid">
              <label>Min Acceptable Price (₹/qtl)
                <input 
                  type="number" 
                  value={newLot.minPrice} 
                  onChange={e => setNewLot({ ...newLot, minPrice: e.target.value })} 
                />
              </label>
              <label>Sale Window
                <select value={newLot.window} onChange={e => setNewLot({ ...newLot, window: e.target.value })}>
                  <option>Immediate / Today</option>
                  <option>Next 7 days</option>
                  <option>Within 15 days</option>
                </select>
              </label>
            </div>

            <div className="ks-modal-note">
              <Sparkles size={16} />
              <span>KhetSetu will rank verified buyers by Net Realization after logistics and fees.</span>
            </div>

            <button type="submit" className="ks-button ks-button-dark ks-modal-action">
              Find Best Buyers Now <ArrowRight size={16} />
            </button>
          </form>
        </div>
      )}

      {/* MODAL 2: COUNTER OFFER MODAL */}
      {offerModalOpen && (
        <div className="ks-modal-backdrop">
          <div className="ks-modal">
            <button className="ks-close" onClick={() => setOfferModalOpen(false)}><X /></button>
            <div className="ks-eyebrow"><Gavel size={14} /> TRANSPARENT NEGOTIATION</div>
            <h2>Offer to {selectedBuyerForOffer?.companyName || 'Buyer'}</h2>
            <p>Send counter-offer or accept procurement terms.</p>

            <label>Offered Price (₹/quintal)
              <input defaultValue={selectedBuyerForOffer?.offeredPricePerQtl || selectedBuyerForOffer?.price || currentModalPrice} />
            </label>

            <label>Message / Delivery Notes
              <textarea defaultValue={"We can supply Grade A produce with direct pickup at " + selectedDistrict + " warehouse."} />
            </label>

            <button 
              className="ks-button ks-button-dark ks-modal-action"
              onClick={() => {
                if (submitOffer && selectedBuyerForOffer) {
                  submitOffer(selectedBuyerForOffer.id, {
                    offeredPrice: selectedBuyerForOffer.offeredPricePerQtl || currentModalPrice,
                    notes: 'Counter-offer sent via platform'
                  });
                }
                setOfferModalOpen(false);
                showToast('Offer submitted! Shared transaction record updated.');
              }}
            >
              Submit Offer <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: PAYMENT / UPI MODAL */}
      {paymentModalOpen && (
        <div className="ks-modal-backdrop">
          <div className="ks-modal ks-pay-modal">
            <button className="ks-close" onClick={() => setPaymentModalOpen(false)}><X /></button>
            <div className="ks-eyebrow"><ShieldCheck size={14} /> UPI / BANK DBT SETTLEMENT</div>
            <h2>Scan &amp; Settle ₹{((currentModalPrice || 0) * 100).toLocaleString('en-IN')}</h2>
            <p>Settlement for Lot #KS-038 (100 qtl {commodity.name})</p>

            <div className="ks-qr-container" style={{ margin: '1.5rem 0', textDecoration: 'none' }}>
              <QRCode value={"upi://pay?pa=khetsetu@okaxis&pn=KhetSetu%20Market&am=" + ((currentModalPrice || 0) * 100) + "&cu=INR"} size={160} />
            </div>

            <button 
              className="ks-button ks-button-dark ks-modal-action"
              onClick={() => {
                setPaymentModalOpen(false);
                showToast('Payment confirmed and recorded on transaction passport.');
              }}
            >
              Confirm Settlement <Check size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
