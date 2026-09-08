/**
 * KHETSETU — Market Intelligence, Price Discovery & Buyer Linkage Platform
 * SIH 2026 Problem Statement 26132 Solution
 * 
 * Multi-Language Support: English (Default), Hindi (हिंदी), Kannada (ಕನ್ನಡ), Tamil (தமிழ்)
 * Supports 5 Central Farmer Questions:
 * 1. WHERE should I sell? (Net Realization Channel Comparison)
 * 2. WHAT price can I expect? (Expected Price Range)
 * 3. WHEN should I sell? (Explainable Sale-Window Advisory)
 * 4. WHO is the most suitable/reliable buyer? (Verified Buyer Trust Cards & 5-Factor Match Breakdown)
 * 5. HOW MUCH will I actually realize? (Itemized Net Realization after logistics/storage/fees)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useGlobalState } from '../../context/GlobalStateContext';
import { COMMODITIES, getCommodityById } from '../../services/market/cropCommodityRegistry';
import { getMarketChannelsForCommodity } from '../../services/market/marketIntelligenceService';
import { calculateMatchScore } from '../../services/market/matchingEngine';
import { getPriceForecastAndRecommendation } from '../../services/market/priceforecastService';
import { agmarknetService, formatDate, getDateOffset } from '../../services/market/agmarknetService';
import QRCode from 'react-qr-code';

import {
  TrendingUp, TrendingDown, MapPin, Check, ChevronDown, ChevronUp,
  ShieldCheck, ArrowRight, PackagePlus, WalletCards,
  MessageSquareWarning, Gavel, X, Sparkles, Filter, Info, Building2,
  Truck, Award, FileText, CheckCircle2, BarChart3, Globe
} from 'lucide-react';

const TRANSLATIONS = {
  en: {
    brandTitle: 'KHETSETU',
    brandSubtitle: 'Field Bridge',
    headerTitle: 'Market Intelligence & Direct Price Discovery',
    cropLabel: 'CROP / COMMODITY',
    mandiLocation: 'MANDI LOCATION',
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
    netIntroTitle: "Don't look at headline prices alone — compare NET earnings",
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
    headerTitle: 'मंडी भाव सूचना एवं प्रत्यक्ष मूल्य खोज',
    cropLabel: 'फसल / उपज',
    mandiLocation: 'मंडी स्थान',
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
    netIntroTitle: 'केवल मुख्य भाव न देखें — शुद्ध लाभ की तुलना करें',
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
    headerTitle: 'ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ ಮತ್ತು ನೇರ ಬೆಲೆ ಶೋಧನೆ',
    cropLabel: 'ಬೆಳೆ / ಕೃಷಿ ಉತ್ಪನ್ನ',
    mandiLocation: 'ಮಂಡಿ ಸ್ಥಳ',
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
    netIntroTitle: 'ಕೇವಲ ಪ್ರಮುಖ ಬೆಲೆಯನ್ನು ನೋಡಬೇಡಿ — ನಿವ್ವಳ ಗಳಿಕೆಯನ್ನು ಹೋಲಿಸಿ',
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
    brandSubtitle: 'ஃபீಲ್ಡ್ பிரிட்ஜ்',
    headerTitle: 'சந்தை நுண்ணறிவு மற்றும் நேரடி விலை கண்டறிதல்',
    cropLabel: 'பயிர் / விளைபொருள்',
    mandiLocation: 'சந்தை இடம்',
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
    netIntroTitle: 'முக்கிய விலையை மட்டும் பார்க்காதீர்கள் — நிகர வருவாயை ஒப்பிடுங்கள்',
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
  const globalContext = useGlobalState() || {};
  const {
    buyerDemands = [],
    woolLots = [],
    createWoolLot,
    submitOffer
  } = globalContext;

  const [language, setLanguage] = useState('en'); // 'en' | 'hi' | 'kn' | 'ta'
  const t = useMemo(() => TRANSLATIONS[language] || TRANSLATIONS.en, [language]);

  const [selectedCrop, setSelectedCrop] = useState('WHEAT');
  const [selectedState, setSelectedState] = useState('Rajasthan');
  const [selectedDistrict, setSelectedDistrict] = useState('Kota');
  const [activeTab, setActiveTab] = useState('overview');

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

  // Expandable accordions
  const [expandedReasoning, setExpandedReasoning] = useState(false);
  const [expandedBuyerId, setExpandedBuyerId] = useState(null);

  // Lot Creation Form State
  const [newLot, setNewLot] = useState({
    crop: 'Wheat',
    variety: 'HD-2967 (Sharbati)',
    quantity: '100',
    unit: 'Quintal (qtl)',
    grade: 'A',
    window: 'Next 7 days',
    minPrice: '2400',
    needsStorage: false
  });

  // Derived Commodity Data from Registry
  const commodity = useMemo(() => {
    return getCommodityById(selectedCrop) || COMMODITIES[0];
  }, [selectedCrop]);

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
            marketName: latest.market_name || (selectedDistrict + ' Mandi')
          });
          setDataSource('CEDA / Agmarknet API');
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

        return {
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
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [buyerDemands, selectedCrop, commodity, selectedDistrict, currentModalPrice]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
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

  return (
    <div className="ks-platform-root">
      {toastMessage && (
        <div className="ks-toast">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER BAR WITH TOP-RIGHT LANGUAGE SELECTOR */}
      <header className="ks-platform-header">
        <div className="ks-header-top-row">
          <div className="ks-header-left">
            <div className="ks-brand-pill">
              <span className="ks-brand-title">{t.brandTitle}</span>
              <span className="ks-brand-sub">{t.brandSubtitle}</span>
            </div>
            <h1>{t.headerTitle}</h1>
          </div>

          {/* TOP RIGHT LANGUAGE DROPDOWN */}
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

      {/* NAVIGATION TABS */}
      <nav className="ks-tab-nav">
        <button 
          className={activeTab === 'overview' ? 'active' : ''} 
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 size={16} /> {t.tabOverview}
        </button>
        <button 
          className={activeTab === 'comparison' ? 'active' : ''} 
          onClick={() => setActiveTab('comparison')}
        >
          <Building2 size={16} /> {t.tabChannels}
        </button>
        <button 
          className={activeTab === 'buyers' ? 'active' : ''} 
          onClick={() => setActiveTab('buyers')}
        >
          <ShieldCheck size={16} /> {t.tabBuyers} ({matchedBuyers.length})
        </button>
        <button 
          className={activeTab === 'demand' ? 'active' : ''} 
          onClick={() => setActiveTab('demand')}
        >
          <Award size={16} /> {t.tabDemand}
        </button>
        <button 
          className={activeTab === 'lots' ? 'active' : ''} 
          onClick={() => setActiveTab('lots')}
        >
          <PackagePlus size={16} /> {t.tabLots} ({woolLots ? woolLots.length : 1})
        </button>
        <button 
          className={activeTab === 'payments' ? 'active' : ''} 
          onClick={() => setActiveTab('payments')}
        >
          <WalletCards size={16} /> {t.tabPayments}
        </button>
        <button 
          className={activeTab === 'disputes' ? 'active' : ''} 
          onClick={() => setActiveTab('disputes')}
        >
          <MessageSquareWarning size={16} /> {t.tabDisputes}
        </button>
      </nav>

      {/* MAIN BODY */}
      <main className="ks-platform-body">
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
                      <td><button className="ks-link-btn" onClick={() => setActiveTab('comparison')}>Compare Net</button></td>
                    </tr>
                    <tr>
                      <td><b>Ramganj Mandi</b></td>
                      <td>Kota, Rajasthan</td>
                      <td><b>₹{(Math.round(currentModalPrice * 1.016) || 0).toLocaleString('en-IN')} / qtl</b></td>
                      <td>850 t</td>
                      <td>32 km</td>
                      <td><button className="ks-link-btn" onClick={() => setActiveTab('comparison')}>Compare Net</button></td>
                    </tr>
                    <tr>
                      <td><b>Baran Mandi</b></td>
                      <td>Baran, Rajasthan</td>
                      <td><b>₹{(Math.round(currentModalPrice * 0.98) || 0).toLocaleString('en-IN')} / qtl</b></td>
                      <td>1,100 t</td>
                      <td>45 km</td>
                      <td><button className="ks-link-btn" onClick={() => setActiveTab('comparison')}>Compare Net</button></td>
                    </tr>
                    <tr>
                      <td><b>Bundi APMC</b></td>
                      <td>Bundi, Rajasthan</td>
                      <td><b>₹{(Math.round(currentModalPrice * 1.004) || 0).toLocaleString('en-IN')} / qtl</b></td>
                      <td>620 t</td>
                      <td>38 km</td>
                      <td><button className="ks-link-btn" onClick={() => setActiveTab('comparison')}>Compare Net</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'comparison' && (
          <div className="ks-tab-content">
            <section className="ks-card ks-intro-banner">
              <div className="ks-eyebrow"><Building2 size={14} /> {t.netIntroEyebrow}</div>
              <h2>{t.netIntroTitle}</h2>
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
              <div className="ks-card ks-lot-card">
                <div className="ks-lot-header">
                  <div>
                    <span className="ks-lot-id">LOT #KS-038</span>
                    <h3>{selectedCrop} — 100 Quintals (Grade A)</h3>
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
            </div>
          </div>
        )}

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

      {/* MODAL 1: CREATE SELL LOT MODAL */}
      {lotModalOpen && (
        <div className="ks-modal-backdrop">
          <form className="ks-modal" onSubmit={(e) => {
            e.preventDefault();
            setLotModalOpen(false);
            if (createWoolLot) {
              createWoolLot({
                cropId: selectedCrop,
                cropName: newLot.crop,
                woolType: newLot.crop + ' (' + newLot.grade + ')',
                variety: newLot.variety,
                quantity: Number(newLot.quantity) || 100,
                unit: 'qtl',
                qualityGrade: newLot.grade,
                minPrice: Number(newLot.minPrice) || 2400,
                saleWindow: newLot.window
              });
            }
            showToast('Sell Lot created for ' + newLot.quantity + ' qtl of ' + newLot.crop + '. Matched buyers notified!');
            setActiveTab('buyers');
          }}>
            <button type="button" className="ks-close" onClick={() => setLotModalOpen(false)}><X /></button>
            <div className="ks-eyebrow"><PackagePlus size={14} /> SELL-READY LOT</div>
            <h2>Create a Sell Lot</h2>
            <p>Post your produce to KhetSetu matching engine to receive direct buyer offers.</p>

            <label>Crop / Commodity
              <select value={newLot.crop} onChange={e => setNewLot({ ...newLot, crop: e.target.value })}>
                {COMMODITIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </label>

            <div className="ks-form-grid">
              <label>Quantity (Quintals)
                <input 
                  required 
                  type="number" 
                  value={newLot.quantity} 
                  onChange={e => setNewLot({ ...newLot, quantity: e.target.value })} 
                />
              </label>
              <label>Quality Grade
                <select value={newLot.grade} onChange={e => setNewLot({ ...newLot, grade: e.target.value })}>
                  <option value="A">Grade A (Premium)</option>
                  <option value="FAQ">FAQ (Fair Average Quality)</option>
                  <option value="B">Grade B (Standard)</option>
                </select>
              </label>
            </div>

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
