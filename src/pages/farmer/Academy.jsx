import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Download,
  Factory,
  FileText,
  Globe2,
  GraduationCap,
  Handshake,
  IndianRupee,
  Languages,
  Leaf,
  MapPin,
  Mic2,
  Package,
  PlayCircle,
  QrCode,
  Search,
  Scissors,
  Shirt,
  Sprout,
  TrendingUp,
  Truck,
  Users,
  Video,
  Warehouse,
  X,
  Phone,
  ExternalLink,
  ChevronRight,
  Star,
} from 'lucide-react';
import { moduleData } from './components/moduleData';
import './Academy.css';
import { jsPDF } from 'jspdf';

/* ─── Languages ─────────────────────────────────────────────────────────── */
const languages = [
  { code: 'en',  label: 'English',    native: 'English'     },
  { code: 'hi',  label: 'Hindi',      native: 'हिन्दी'       },
  { code: 'raj', label: 'Rajasthani', native: 'राजस्थानी'   },
  { code: 'gu',  label: 'Gujarati',   native: 'ગુજરાતી'     },
  { code: 'ks',  label: 'Kashmiri',   native: 'कॉशुर'       },
  { code: 'ur',  label: 'Urdu',       native: 'اردو'        },
  { code: 'ta',  label: 'Tamil',      native: 'தமிழ்'       },
  { code: 'te',  label: 'Telugu',     native: 'తెలుగు'      },
  { code: 'kn',  label: 'Kannada',    native: 'ಕನ್ನಡ'       },
  { code: 'mr',  label: 'Marathi',    native: 'मराठी'       },
  { code: 'bn',  label: 'Bengali',    native: 'বাংলা'       },
  { code: 'pa',  label: 'Punjabi',    native: 'ਪੰਜਾਬੀ'      },
];

/* ─── Copy / Translations ─────────────────────────────────────────────── */
const copy = {
  en: {
    title: 'Wool Academy',
    subtitle: 'Learn everything about wool — from clean shearing to certified sale. Practical lessons in your language, built for Indian farmers.',
    badge: 'From Farm to Fabric',
    heroTitle: 'Learn. Grow. Earn more from your wool.',
    heroBody: 'Master wool shearing, grading, batch traceability, and market access through practical video lessons, audio guides, and village field sessions — all available in 12 Indian languages.',
    primaryCta: 'Start Learning',
    secondaryCta: 'Download Guides',
    search: 'Search lessons, wool topics, guides...',
    schedule: 'Upcoming sessions',
    journeyTitle: 'The Wool Journey',
    journeySubtitle: 'Understand how your wool travels from farm to fabric. Each step adds value.',
    modulesTitle: 'Training Modules',
    modulesSubtitle: 'Practical lessons covering every stage of wool production — from shearing techniques to market readiness.',
    cohortsTitle: 'Village Learning Groups',
    cohortsSubtitle: 'Join a nearby farmer training group. Learn together, improve wool quality, and access better markets.',
    guidesTitle: 'Practical Guides',
    guidesSubtitle: 'Quick-reference guides you can download and use in the field.',
    schemesTitle: 'Government Schemes & Support',
    schemesSubtitle: 'Know the wool-related schemes that can help you earn more and access support.',
    startLesson: 'Start Lesson',
    joinGroup: 'Join Group',
    learnMore: 'Learn More',
    applyNow: 'Apply Now',
    noResults: 'No results for',
    lessons: 'lessons',
    completed: 'completed',
    resume: 'Resume',
    resumeLearning: 'Resume Learning',
    indiaReady: 'India-ready curriculum',
    learningHub: 'Farmer Learning Hub',
    activeGroups: 'active groups',
    modulesLabel: 'modules',
    activeFarmers: 'Active farmers learning',
    trainingModules: 'Training modules',
    avgCompletion: 'Avg. completion rate',
    villageLearningGroups: 'Village learning groups',
    farmersLabel: 'Farmers',
    attendanceLabel: 'Attendance',
    currentFocusLabel: 'Current focus',
    nextSessionLabel: 'Next session',
    pagesLabel: 'pages',
    clearSearch: 'Clear search',
    upcomingSessions: 'Upcoming Sessions',
    joinSession: 'Join a live village training session near you',
    seatsLeft: 'seats left',
    facilitatorLabel: 'Facilitator',
    close: 'Close',
    rsvp: 'RSVP',
    rsvped: '✓ RSVPed',
    downloadUse: 'Download and use in the field',
    fullName: 'Full Name',
    yourName: 'Your name',
    phoneNumber: 'Phone Number',
    preferredLang: 'Preferred Language',
    villageDistrict: 'Village / District',
    yourVillage: 'Your village or district',
    joinGroup2: 'Join Group',
    youJoined: "You've joined!",
    youreNowPart: 'You are now part of',
    topicLabel: 'Topic',
    doneBtn: 'Done',
    applyOnline: 'Apply Online',
    callHelpline: 'Call Helpline',
    eligibility: 'Eligibility',
    benefits: 'Benefits',
    requiredDocs: 'Required Documents',
    downloaded: 'Downloaded',
    trainingPath: ['Farm', 'Wool', 'Quality', 'Market', 'Logistics', 'Processing', 'Fabric'],
  },
  hi: {
    title: 'ऊन अकादमी',
    subtitle: 'ऊन के बारे में सब कुछ सीखें — साफ कतराई से लेकर प्रमाणित बिक्री तक। आपकी भाषा में व्यावहारिक पाठ।',
    badge: 'खेत से कपड़े तक',
    heroTitle: 'सीखो। बढ़ो। अपनी ऊन से ज़्यादा कमाओ।',
    heroBody: 'व्यावहारिक वीडियो पाठ, ऑडियो गाइड के ज़रिए ऊन कतराई, ग्रेडिंग, बैच ट्रेसेबिलिटी और बाज़ार पहुंच में महारत हासिल करें — सभी 12 भारतीय भाषाओं में।',
    primaryCta: 'सीखना शुरू करें',
    secondaryCta: 'गाइड डाउनलोड करें',
    search: 'पाठ, ऊन विषय, गाइड खोजें...',
    schedule: 'आगामी सत्र',
    journeyTitle: 'ऊन की यात्रा',
    journeySubtitle: 'समझें कि आपकी ऊन खेत से कपड़े तक कैसे पहुंचती है।',
    modulesTitle: 'प्रशिक्षण मॉड्यूल',
    modulesSubtitle: 'कतराई से लेकर बाज़ार तैयारी तक व्यावहारिक पाठ।',
    cohortsTitle: 'गांव शिक्षा समूह',
    cohortsSubtitle: 'पास के किसान प्रशिक्षण समूह से जुड़ें।',
    guidesTitle: 'व्यावहारिक गाइड',
    guidesSubtitle: 'त्वरित-संदर्भ गाइड जिन्हें आप डाउनलोड कर सकते हैं।',
    schemesTitle: 'सरकारी योजनाएं और सहायता',
    schemesSubtitle: 'ऊन-संबंधित योजनाओं को जानें।',
    startLesson: 'पाठ शुरू करें',
    joinGroup: 'समूह से जुड़ें',
    learnMore: 'और जानें',
    applyNow: 'अभी आवेदन करें',
    noResults: 'कोई परिणाम नहीं',
    lessons: 'पाठ',
    completed: 'पूर्ण',
    resume: 'जारी रखें',
    resumeLearning: 'सीखना जारी रखें',
    indiaReady: 'भारत-तैयार पाठ्यक्रम',
    learningHub: 'किसान शिक्षा केंद्र',
    activeGroups: 'सक्रिय समूह',
    modulesLabel: 'मॉड्यूल',
    activeFarmers: 'सक्रिय किसान सीख रहे हैं',
    trainingModules: 'प्रशिक्षण मॉड्यूल',
    avgCompletion: 'औसत पूर्णता दर',
    villageLearningGroups: 'गांव शिक्षा समूह',
    farmersLabel: 'किसान',
    attendanceLabel: 'उपस्थिति',
    currentFocusLabel: 'वर्तमान विषय',
    nextSessionLabel: 'अगला सत्र',
    pagesLabel: 'पृष्ठ',
    clearSearch: 'खोज साफ करें',
    upcomingSessions: 'आगामी सत्र',
    joinSession: 'अपने पास के लाइव गांव प्रशिक्षण सत्र से जुड़ें',
    seatsLeft: 'सीटें बची हैं',
    facilitatorLabel: 'सुविधाकर्ता',
    close: 'बंद करें',
    rsvp: 'RSVP',
    rsvped: '✓ पंजीकृत',
    downloadUse: 'डाउनलोड करें और खेत में उपयोग करें',
    fullName: 'पूरा नाम',
    yourName: 'आपका नाम',
    phoneNumber: 'फोन नंबर',
    preferredLang: 'पसंदीदा भाषा',
    villageDistrict: 'गांव / जिला',
    yourVillage: 'आपका गांव या जिला',
    joinGroup2: 'समूह से जुड़ें',
    youJoined: 'आप जुड़ गए!',
    youreNowPart: 'आप अब हिस्सा हैं',
    topicLabel: 'विषय',
    doneBtn: 'हो गया',
    applyOnline: 'ऑनलाइन आवेदन करें',
    callHelpline: 'हेल्पलाइन पर कॉल करें',
    eligibility: 'पात्रता',
    benefits: 'लाभ',
    requiredDocs: 'आवश्यक दस्तावेज़',
    downloaded: 'डाउनलोड हुआ',
    trainingPath: ['खेत', 'ऊन', 'गुणवत्ता', 'बाजार', 'लॉजिस्टिक्स', 'प्रसंस्करण', 'कपड़ा'],
  },
  raj: {
    title: 'ऊन अकादमी',
    subtitle: 'ऊन रे बारे में सब सीखो — कतराई से लेकर बिक्री तक। राजस्थानी भाषा में पाठ।',
    badge: 'खेत से कपड़ा',
    heroTitle: 'सीखो। बढ़ो। ऊन से ज्यादा कमाओ।',
    heroBody: 'वीडियो पाठ, ऑडियो गाइड रे जरिए ऊन कतराई, ग्रेडिंग, बाजार पहुंच में महारत पाओ।',
    primaryCta: 'सीखणो शुरू करो',
    secondaryCta: 'गाइड डाउनलोड करो',
    search: 'पाठ, ऊन विषय खोजो...',
    schedule: 'आगामी सत्र',
    journeyTitle: 'ऊन री यात्रा',
    journeySubtitle: 'समझो कि आपकी ऊन खेत से कपड़ा बनने तक कैसे जाती है।',
    modulesTitle: 'सिखलाई मॉड्यूल',
    modulesSubtitle: 'ऊन उत्पादन रे हर चरण रा पाठ।',
    cohortsTitle: 'गांव सिखलाई समूह',
    cohortsSubtitle: 'पास रे किसान सिखलाई समूह से जुड़ो।',
    guidesTitle: 'काम री गाइड',
    guidesSubtitle: 'डाउनलोड करने री गाइड।',
    schemesTitle: 'सरकारी योजना',
    schemesSubtitle: 'ऊन री योजनाओ को जानो।',
    startLesson: 'पाठ शुरू करो',
    joinGroup: 'समूह से जुड़ो',
    learnMore: 'और जानो',
    applyNow: 'अभी आवेदन करो',
    noResults: 'कोई नतीजो नईं',
    lessons: 'पाठ',
    completed: 'पूरो',
    resume: 'जारी राखो',
    resumeLearning: 'सीखणो जारी राखो',
    indiaReady: 'भारत तैयार पाठ्यक्रम',
    learningHub: 'किसान शिक्षा केंद्र',
    activeGroups: 'सक्रिय समूह',
    modulesLabel: 'मॉड्यूल',
    activeFarmers: 'सक्रिय किसान सीख रया हैं',
    trainingModules: 'सिखलाई मॉड्यूल',
    avgCompletion: 'औसत पूर्णता',
    villageLearningGroups: 'गांव सिखलाई समूह',
    farmersLabel: 'किसान',
    attendanceLabel: 'उपस्थिति',
    currentFocusLabel: 'वर्तमान विषय',
    nextSessionLabel: 'अगलो सत्र',
    pagesLabel: 'पृष्ठ',
    clearSearch: 'खोज मिटाओ',
    upcomingSessions: 'आगामी सत्र',
    joinSession: 'पास रे लाइव सत्र से जुड़ो',
    seatsLeft: 'सीटें बची हैं',
    facilitatorLabel: 'सुविधाकर्ता',
    close: 'बंद करो',
    rsvp: 'RSVP',
    rsvped: '✓ पंजीकृत',
    downloadUse: 'डाउनलोड करो',
    fullName: 'पूरो नाम',
    yourName: 'आपरो नाम',
    phoneNumber: 'फोन नंबर',
    preferredLang: 'पसंदीदा भाषा',
    villageDistrict: 'गांव / जिलो',
    yourVillage: 'आपरो गांव',
    joinGroup2: 'समूह से जुड़ो',
    youJoined: 'आप जुड़ गया!',
    youreNowPart: 'आप हिस्सो हो',
    topicLabel: 'विषय',
    doneBtn: 'हो गयो',
    applyOnline: 'ऑनलाइन आवेदन करो',
    callHelpline: 'हेल्पलाइन पे फोन करो',
    eligibility: 'पात्रता',
    benefits: 'फायदा',
    requiredDocs: 'जरूरी कागजात',
    downloaded: 'डाउनलोड हुयो',
    trainingPath: ['खेत', 'ऊन', 'गुणवत्ता', 'बाजार', 'ट्रांसपोर्ट', 'प्रसंस्करण', 'कपड़ो'],
  },
  gu: {
    title: 'ઊન અકાડેમી',
    subtitle: 'ઊન વિશે બધું શીખો — ઊની કાતરોથી પ્રમાણિત વેચાણ સુધી.',
    badge: 'ખેત થી કાપડ',
    heroTitle: 'શીખો. વધો. ઊન થી વધુ કમાઓ.',
    heroBody: 'વ્યવહારુ વીડિયો પાઠ, ઑડિઓ ગાઈડ દ્વારા ઊન કાતરો, ગ્રેડિંગ, બજાર ઍક્સેસ માં નિષ્ણાત બનો.',
    primaryCta: 'શીખવાનું શરૂ કરો',
    secondaryCta: 'ગાઈડ ડાઉનલોડ',
    search: 'પાઠ, ઊન વિષયો, ગાઈડ શોધો...',
    schedule: 'આગળ ના સત્રો',
    journeyTitle: 'ઊન ની યાત્રા',
    journeySubtitle: 'સમજો કે ઊન ખેત થી કાપડ સુધી કેવી રીતે જાય છે.',
    modulesTitle: 'તાલીમ મૉડ્યૂલ',
    modulesSubtitle: 'ઊન ઉત્પાદન ના દરેક તબક્કા ના વ્યવહારુ પાઠ.',
    cohortsTitle: 'ગ્રામ શિક્ષણ જૂથ',
    cohortsSubtitle: 'નજીકના ખેડૂત તાલીમ જૂથ માં જોડાઓ.',
    guidesTitle: 'વ્યવહારુ ગાઈડ',
    guidesSubtitle: 'ખેત માં ઉપયોગ માટે ડાઉનલોડ ગાઈડ.',
    schemesTitle: 'સરકારી યોજનાઓ',
    schemesSubtitle: 'ઊન સંબંધિત યોજનાઓ જાણો.',
    startLesson: 'પાઠ શરૂ કરો',
    joinGroup: 'જૂથ માં જોડાઓ',
    learnMore: 'વધુ જાણો',
    applyNow: 'અભી અરજી કરો',
    noResults: 'કોઈ પરિણામ નથી',
    lessons: 'પાઠ',
    completed: 'સંપૂર્ણ',
    resume: 'ફરી શરૂ',
    resumeLearning: 'શીખવાનું ચાલુ રાખો',
    indiaReady: 'ભારત-તૈયાર અભ્યાસક્રમ',
    learningHub: 'ખેડૂત શિક્ષણ કેન્દ્ર',
    activeGroups: 'સક્રિય જૂથ',
    modulesLabel: 'મૉડ્યૂલ',
    activeFarmers: 'સક્રિય ખેડૂત શીખી રહ્યા છે',
    trainingModules: 'તાલીમ મૉડ્યૂલ',
    avgCompletion: 'સરેરાશ પૂર્ણ દર',
    villageLearningGroups: 'ગ્રામ શિક્ષણ જૂથ',
    farmersLabel: 'ખેડૂત',
    attendanceLabel: 'હાજરી',
    currentFocusLabel: 'વર્તમાન વિષય',
    nextSessionLabel: 'આગળ નો સત્ર',
    pagesLabel: 'પૃષ્ઠ',
    clearSearch: 'શોધ સાફ',
    upcomingSessions: 'આગળ ના સત્રો',
    joinSession: 'પાસ ના લાઇવ ટ્રેનિંગ સત્ર માં જોડાઓ',
    seatsLeft: 'સીટ બાકી',
    facilitatorLabel: 'સુવિધાપ્રદ',
    close: 'બંધ',
    rsvp: 'RSVP',
    rsvped: '✓ નોંધ્યા',
    downloadUse: 'ડાઉનલોડ કરો',
    fullName: 'પૂરું નામ',
    yourName: 'તમારું નામ',
    phoneNumber: 'ફોન નંબર',
    preferredLang: 'પ્રિય ભાષા',
    villageDistrict: 'ગામ / જિલ્લો',
    yourVillage: 'તમારું ગામ',
    joinGroup2: 'જૂથ માં જોડાઓ',
    youJoined: 'તમે જોડાઈ ગયા!',
    youreNowPart: 'તમે હવે ભાગ છો',
    topicLabel: 'વિષય',
    doneBtn: 'થઈ ગયું',
    applyOnline: 'ઑનલાઇન અરજી',
    callHelpline: 'હેલ્પલાઇન',
    eligibility: 'પાત્રતા',
    benefits: 'ફાયદા',
    requiredDocs: 'જરૂરી દસ્તાવેજ',
    downloaded: 'ડાઉનલોડ',
    trainingPath: ['ખેત', 'ઊન', 'ગુણવત્તા', 'બજાર', 'લૉજિસ્ટિક્સ', 'પ્રક્રિયા', 'કાપડ'],
  },
  ks: {
    title: 'ऊन अकादमी',
    subtitle: 'पश्म बारे वुछ سیکھ — کتروایس ته مستند فروخت تک. ہندوستانی کسانوں کے لیے عملی سبق۔',
    badge: 'کھیت سے کپڑا',
    heroTitle: 'سیکھو۔ بڑھو۔ اپنی ऊن سے زیادہ کماؤ۔',
    heroBody: 'عملی ویڈیو سبق، آڈیو گائیڈ کے ذریعے ऊन کتروائی، گریڈنگ میں مہارت حاصل کرو۔',
    primaryCta: 'سیکھنا شروع کرو',
    secondaryCta: 'گائیڈ ڈاؤنلوڈ',
    search: 'سبق، موضوعات تلاش کریں...',
    schedule: 'آئندہ سیشن',
    journeyTitle: 'ऊन کا سفر',
    journeySubtitle: 'سمجھو کہ ऊन کھیت سے کپڑے تک کیسے سفر کرتی ہے۔',
    modulesTitle: 'تربیتی ماڈیول',
    modulesSubtitle: 'ऊन پیداوار کے ہر مرحلے کے عملی سبق۔',
    cohortsTitle: 'گاؤں سیکھنے کے گروپ',
    cohortsSubtitle: 'قریبی کسان تربیتی گروپ سے جڑیں۔',
    guidesTitle: 'عملی گائیڈ',
    guidesSubtitle: 'ڈاؤنلوڈ کرنے والی گائیڈ۔',
    schemesTitle: 'سرکاری اسکیمیں',
    schemesSubtitle: 'ऊन سے متعلق اسکیمیں جانیں۔',
    startLesson: 'سبق شروع کرو',
    joinGroup: 'گروپ سے جڑو',
    learnMore: 'مزید جانو',
    applyNow: 'ابھی درخواست دیں',
    noResults: 'کوئی نتیجہ نہیں',
    lessons: 'سبق',
    completed: 'مکمل',
    resume: 'جاری رکھو',
    resumeLearning: 'سیکھنا جاری رکھو',
    indiaReady: 'ہندوستان کے لیے نصاب',
    learningHub: 'کسان سیکھنے کا مرکز',
    activeGroups: 'فعال گروپ',
    modulesLabel: 'ماڈیول',
    activeFarmers: 'فعال کسان سیکھ رہے ہیں',
    trainingModules: 'تربیتی ماڈیول',
    avgCompletion: 'اوسط تکمیل کی شرح',
    villageLearningGroups: 'گاؤں سیکھنے کے گروپ',
    farmersLabel: 'کسان',
    attendanceLabel: 'حاضری',
    currentFocusLabel: 'موجودہ موضوع',
    nextSessionLabel: 'اگلا سیشن',
    pagesLabel: 'صفحات',
    clearSearch: 'تلاش صاف کریں',
    upcomingSessions: 'آئندہ سیشن',
    joinSession: 'قریبی لائیو ٹریننگ سیشن میں شامل ہوں',
    seatsLeft: 'نشستیں باقی ہیں',
    facilitatorLabel: 'سہولت کار',
    close: 'بند کریں',
    rsvp: 'RSVP',
    rsvped: '✓ رجسٹرڈ',
    downloadUse: 'ڈاؤنلوڈ کریں',
    fullName: 'پورا نام',
    yourName: 'آپ کا نام',
    phoneNumber: 'فون نمبر',
    preferredLang: 'پسندیدہ زبان',
    villageDistrict: 'گاؤں / ضلع',
    yourVillage: 'آپ کا گاؤں',
    joinGroup2: 'گروپ میں شامل ہوں',
    youJoined: 'آپ شامل ہو گئے!',
    youreNowPart: 'آپ اب حصہ ہیں',
    topicLabel: 'موضوع',
    doneBtn: 'ٹھیک ہے',
    applyOnline: 'آن لائن درخواست',
    callHelpline: 'ہیلپ لائن',
    eligibility: 'اہلیت',
    benefits: 'فوائد',
    requiredDocs: 'ضروری دستاویزات',
    downloaded: 'ڈاؤنلوڈ ہوا',
    trainingPath: ['کھیت', 'اون', 'معیار', 'مارکیٹ', 'لاجسٹکس', 'پروسیسنگ', 'کپڑا'],
  },
  ur: {
    title: 'اون اکیڈمی',
    subtitle: 'اون کے بارے میں سب کچھ سیکھیں۔ آپ کی زبان میں عملی سبق۔',
    badge: 'کھیت سے کپڑا تک',
    heroTitle: 'سیکھیں۔ بڑھیں۔ اون سے زیادہ کمائیں۔',
    heroBody: 'عملی ویڈیو سبق اور آڈیو گائیڈ کے ذریعے اون کٹائی، گریڈنگ، اور مارکیٹ تک رسائی میں مہارت حاصل کریں۔',
    primaryCta: 'سیکھنا شروع کریں',
    secondaryCta: 'گائیڈ ڈاؤنلوڈ',
    search: 'سبق، موضوعات تلاش کریں...',
    schedule: 'آنے والے سیشن',
    journeyTitle: 'اون کا سفر',
    journeySubtitle: 'سمجھیں کہ اون کھیت سے کپڑے تک کیسے سفر کرتی ہے۔',
    modulesTitle: 'تربیتی ماڈیول',
    modulesSubtitle: 'اون پیداوار کے ہر مرحلے کے عملی سبق۔',
    cohortsTitle: 'گاؤں سیکھنے کے گروپ',
    cohortsSubtitle: 'قریبی کسان تربیتی گروپ سے جڑیں۔',
    guidesTitle: 'عملی گائیڈ',
    guidesSubtitle: 'میدان میں استعمال کے لیے ڈاؤنلوڈ گائیڈ۔',
    schemesTitle: 'سرکاری اسکیمیں',
    schemesSubtitle: 'اون سے متعلق اسکیمیں جانیں۔',
    startLesson: 'سبق شروع کریں',
    joinGroup: 'گروپ میں شامل ہوں',
    learnMore: 'مزید جانیں',
    applyNow: 'ابھی درخواست دیں',
    noResults: 'کوئی نتیجہ نہیں',
    lessons: 'سبق',
    completed: 'مکمل',
    resume: 'جاری رکھیں',
    resumeLearning: 'سیکھنا جاری رکھیں',
    indiaReady: 'ہندوستان کے لیے نصاب',
    learningHub: 'کسان سیکھنے کا مرکز',
    activeGroups: 'فعال گروپ',
    modulesLabel: 'ماڈیول',
    activeFarmers: 'فعال کسان سیکھ رہے ہیں',
    trainingModules: 'تربیتی ماڈیول',
    avgCompletion: 'اوسط تکمیل کی شرح',
    villageLearningGroups: 'گاؤں سیکھنے کے گروپ',
    farmersLabel: 'کسان',
    attendanceLabel: 'حاضری',
    currentFocusLabel: 'موجودہ موضوع',
    nextSessionLabel: 'اگلا سیشن',
    pagesLabel: 'صفحات',
    clearSearch: 'تلاش صاف کریں',
    upcomingSessions: 'آنے والے سیشن',
    joinSession: 'قریبی لائیو ٹریننگ سیشن میں شامل ہوں',
    seatsLeft: 'نشستیں باقی ہیں',
    facilitatorLabel: 'سہولت کار',
    close: 'بند کریں',
    rsvp: 'RSVP',
    rsvped: '✓ رجسٹرڈ',
    downloadUse: 'ڈاؤنلوڈ کریں',
    fullName: 'پورا نام',
    yourName: 'آپ کا نام',
    phoneNumber: 'فون نمبر',
    preferredLang: 'پسندیدہ زبان',
    villageDistrict: 'گاؤں / ضلع',
    yourVillage: 'آپ کا گاؤں',
    joinGroup2: 'گروپ میں شامل ہوں',
    youJoined: 'آپ شامل ہو گئے!',
    youreNowPart: 'آپ اب حصہ ہیں',
    topicLabel: 'موضوع',
    doneBtn: 'ہو گیا',
    applyOnline: 'آن لائن درخواست',
    callHelpline: 'ہیلپ لائن',
    eligibility: 'اہلیت',
    benefits: 'فوائد',
    requiredDocs: 'ضروری دستاویزات',
    downloaded: 'ڈاؤنلوڈ ہوا',
    trainingPath: ['کھیت', 'اون', 'معیار', 'مارکیٹ', 'لاجسٹکس', 'پروسیسنگ', 'کپڑا'],
  },
  ta: {
    title: 'கம்பளி அகாடமி',
    subtitle: 'கம்பளி பற்றி அனைத்தும் கற்றுக்கொள்ளுங்கள். உங்கள் மொழியில் நடைமுறை பாடங்கள்.',
    badge: 'பண்ணையிலிருந்து துணி வரை',
    heroTitle: 'கற்றுக்கொள்ளுங்கள். வளருங்கள். அதிகம் சம்பாதியுங்கள்.',
    heroBody: 'நடைமுறை வீடியோ பாடங்கள், ஒலி வழிகாட்டிகள் மூலம் கம்பளி வெட்டுதல், தரப்படுத்தல், சந்தை அணுகல் ஆகியவற்றில் தேர்ச்சி பெறுங்கள்.',
    primaryCta: 'கற்க தொடங்கு',
    secondaryCta: 'வழிகாட்டி பதிவிறக்கு',
    search: 'பாடங்கள், கம்பளி தலைப்புகள் தேடுங்கள்...',
    schedule: 'வரவிருக்கும் அமர்வுகள்',
    journeyTitle: 'கம்பளி பயணம்',
    journeySubtitle: 'உங்கள் கம்பளி பண்ணையிலிருந்து துணி வரை எவ்வாறு பயணிக்கிறது என்பதை புரிந்து கொள்ளுங்கள்.',
    modulesTitle: 'பயிற்சி தொகுதிகள்',
    modulesSubtitle: 'கம்பளி உற்பத்தியின் ஒவ்வொரு கட்டத்தையும் உள்ளடக்கிய நடைமுறை பாடங்கள்.',
    cohortsTitle: 'கிராம கற்றல் குழுக்கள்',
    cohortsSubtitle: 'அருகிலுள்ள விவசாயி பயிற்சி குழுவில் சேருங்கள்.',
    guidesTitle: 'நடைமுறை வழிகாட்டிகள்',
    guidesSubtitle: 'நிலத்தில் பயன்படுத்த பதிவிறக்கம் செய்யக்கூடிய வழிகாட்டிகள்.',
    schemesTitle: 'அரசு திட்டங்கள் & ஆதரவு',
    schemesSubtitle: 'கம்பளி தொடர்பான திட்டங்களை தெரிந்துகொள்ளுங்கள்.',
    startLesson: 'பாடம் தொடங்கு',
    joinGroup: 'குழுவில் சேர',
    learnMore: 'மேலும் அறிக',
    applyNow: 'இப்போது விண்ணப்பி',
    noResults: 'முடிவுகள் இல்லை',
    lessons: 'பாடங்கள்',
    completed: 'முடிந்தது',
    resume: 'தொடர்',
    resumeLearning: 'கற்றலை தொடர்',
    indiaReady: 'இந்தியாவுக்கு தயாரான பாடத்திட்டம்',
    learningHub: 'விவசாயி கற்றல் மையம்',
    activeGroups: 'செயலில் உள்ள குழுக்கள்',
    modulesLabel: 'தொகுதிகள்',
    activeFarmers: 'செயலில் விவசாயிகள் கற்கின்றனர்',
    trainingModules: 'பயிற்சி தொகுதிகள்',
    avgCompletion: 'சராசரி நிறைவு விகிதம்',
    villageLearningGroups: 'கிராம கற்றல் குழுக்கள்',
    farmersLabel: 'விவசாயிகள்',
    attendanceLabel: 'வருகை',
    currentFocusLabel: 'தற்போதைய கவனம்',
    nextSessionLabel: 'அடுத்த அமர்வு',
    pagesLabel: 'பக்கங்கள்',
    clearSearch: 'தேடலை அழி',
    upcomingSessions: 'வரவிருக்கும் அமர்வுகள்',
    joinSession: 'அருகிலுள்ள லைவ் பயிற்சி அமர்வில் சேருங்கள்',
    seatsLeft: 'இடங்கள் உள்ளன',
    facilitatorLabel: 'வசதி செய்பவர்',
    close: 'மூடு',
    rsvp: 'RSVP',
    rsvped: '✓ பதிவு செய்யப்பட்டது',
    downloadUse: 'பதிவிறக்கி பயன்படுத்துங்கள்',
    fullName: 'முழு பெயர்',
    yourName: 'உங்கள் பெயர்',
    phoneNumber: 'தொலைபேசி எண்',
    preferredLang: 'விருப்பமான மொழி',
    villageDistrict: 'கிராமம் / மாவட்டம்',
    yourVillage: 'உங்கள் கிராமம்',
    joinGroup2: 'குழுவில் சேர',
    youJoined: 'நீங்கள் சேர்ந்தீர்கள்!',
    youreNowPart: 'நீங்கள் இப்போது ஒரு பகுதி',
    topicLabel: 'தலைப்பு',
    doneBtn: 'முடிந்தது',
    applyOnline: 'ஆன்லைனில் விண்ணப்பி',
    callHelpline: 'உதவி எண்ணை அழை',
    eligibility: 'தகுதி',
    benefits: 'நன்மைகள்',
    requiredDocs: 'தேவையான ஆவணங்கள்',
    downloaded: 'பதிவிறக்கப்பட்டது',
    trainingPath: ['பண்ணை', 'கம்பளி', 'தரம்', 'சந்தை', 'கவிர்ச்சி', 'செயலாக்கம்', 'துணி'],
  },
  te: {
    title: 'ఉన్ని అకాడమీ',
    subtitle: 'ఉన్ని గురించి అన్నీ నేర్చుకోండి. మీ భాషలో ప్రాక్టికల్ పాఠాలు.',
    badge: 'పొలం నుండి వస్త్రం వరకు',
    heroTitle: 'నేర్చుకోండి. ఎదగండి. మీ ఉన్ని నుండి ఎక్కువ సంపాదించండి.',
    heroBody: 'ప్రాక్టికల్ వీడియో పాఠాలు, ఆడియో గైడ్‌ల ద్వారా ఉన్ని కత్తిరింపు, గ్రేడింగ్, మార్కెట్ యాక్సెస్‌లో నైపుణ్యం సాధించండి.',
    primaryCta: 'నేర్చుకోవడం ప్రారంభించు',
    secondaryCta: 'గైడ్ డౌన్‌లోడ్',
    search: 'పాఠాలు, ఉన్ని విషయాలు, గైడ్‌లు...',
    schedule: 'రాబోయే సెషన్లు',
    journeyTitle: 'ఉన్ని ప్రయాణం',
    journeySubtitle: 'మీ ఉన్ని పొలం నుండి వస్త్రం వరకు ఎలా ప్రయాణిస్తుందో అర్థం చేసుకోండి.',
    modulesTitle: 'శిక్షణ మాడ్యూల్స్',
    modulesSubtitle: 'ఉన్ని ఉత్పత్తి యొక్క ప్రతి దశను కవర్ చేసే ప్రాక్టికల్ పాఠాలు.',
    cohortsTitle: 'గ్రామ నేర్చుకునే బృందాలు',
    cohortsSubtitle: 'సమీపంలోని రైతు శిక్షణ బృందంలో చేరండి.',
    guidesTitle: 'ప్రాక్టికల్ గైడ్‌లు',
    guidesSubtitle: 'పొలంలో ఉపయోగించడానికి డౌన్‌లోడ్ చేయగల గైడ్‌లు.',
    schemesTitle: 'ప్రభుత్వ పథకాలు & మద్దతు',
    schemesSubtitle: 'ఉన్ని సంబంధిత పథకాలు తెలుసుకోండి.',
    startLesson: 'పాఠం ప్రారంభించు',
    joinGroup: 'బృందంలో చేరండి',
    learnMore: 'మరింత తెలుసుకోండి',
    applyNow: 'ఇప్పుడు దరఖాస్తు చేయండి',
    noResults: 'ఫలితాలు లేవు',
    lessons: 'పాఠాలు',
    completed: 'పూర్తయింది',
    resume: 'కొనసాగించు',
    resumeLearning: 'నేర్చుకోవడం కొనసాగించు',
    indiaReady: 'భారత్‌కు సిద్ధమైన పాఠ్యాంశం',
    learningHub: 'రైతు నేర్చుకునే కేంద్రం',
    activeGroups: 'చురుకైన బృందాలు',
    modulesLabel: 'మాడ్యూల్స్',
    activeFarmers: 'చురుకైన రైతులు నేర్చుకుంటున్నారు',
    trainingModules: 'శిక్షణ మాడ్యూల్స్',
    avgCompletion: 'సగటు పూర్తి రేటు',
    villageLearningGroups: 'గ్రామ నేర్చుకునే బృందాలు',
    farmersLabel: 'రైతులు',
    attendanceLabel: 'హాజరు',
    currentFocusLabel: 'ప్రస్తుత దృష్టి',
    nextSessionLabel: 'తదుపరి సెషన్',
    pagesLabel: 'పేజీలు',
    clearSearch: 'శోధనను క్లియర్ చేయి',
    upcomingSessions: 'రాబోయే సెషన్లు',
    joinSession: 'సమీప లైవ్ ట్రైనింగ్ సెషన్‌లో చేరండి',
    seatsLeft: 'సీట్లు మిగిలాయి',
    facilitatorLabel: 'సౌకర్యకర్త',
    close: 'మూసివేయి',
    rsvp: 'RSVP',
    rsvped: '✓ నమోదు',
    downloadUse: 'డౌన్‌లోడ్ చేయి',
    fullName: 'పూర్తి పేరు',
    yourName: 'మీ పేరు',
    phoneNumber: 'ఫోన్ నంబర్',
    preferredLang: 'ఇష్టమైన భాష',
    villageDistrict: 'గ్రామం / జిల్లా',
    yourVillage: 'మీ గ్రామం',
    joinGroup2: 'బృందంలో చేరండి',
    youJoined: 'మీరు చేరారు!',
    youreNowPart: 'మీరు ఇప్పుడు భాగం',
    topicLabel: 'విషయం',
    doneBtn: 'పూర్తయింది',
    applyOnline: 'ఆన్‌లైన్‌లో దరఖాస్తు',
    callHelpline: 'హెల్ప్‌లైన్',
    eligibility: 'అర్హత',
    benefits: 'ప్రయోజనాలు',
    requiredDocs: 'అవసరమైన పత్రాలు',
    downloaded: 'డౌన్‌లోడ్',
    trainingPath: ['పొలం', 'ఉన్ని', 'నాణ్యత', 'మార్కెట్', 'లాజిస్టిక్స్', 'ప్రాసెసింగ్', 'వస్త్రం'],
  },
  kn: {
    title: 'ಉಣ್ಣೆ ಅಕಾಡೆಮಿ',
    subtitle: 'ಉಣ್ಣೆ ಬಗ್ಗೆ ಎಲ್ಲವನ್ನೂ ಕಲಿಯಿರಿ. ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಪ್ರಾಯೋಗಿಕ ಪಾಠಗಳು.',
    badge: 'ಕೃಷಿಯಿಂದ ಬಟ್ಟೆಯವರೆಗೆ',
    heroTitle: 'ಕಲಿಯಿರಿ. ಬೆಳೆಯಿರಿ. ನಿಮ್ಮ ಉಣ್ಣೆಯಿಂದ ಹೆಚ್ಚು ಗಳಿಸಿ.',
    heroBody: 'ಪ್ರಾಯೋಗಿಕ ವೀಡಿಯೊ ಪಾಠಗಳು, ಆಡಿಯೋ ಮಾರ್ಗದರ್ಶಿಗಳ ಮೂಲಕ ಉಣ್ಣೆ ಕತ್ತರಿಸುವಿಕೆ, ಗ್ರೇಡಿಂಗ್, ಮಾರುಕಟ್ಟೆ ಪ್ರವೇಶದಲ್ಲಿ ಪ್ರಾವೀಣ್ಯ ಪಡೆಯಿರಿ.',
    primaryCta: 'ಕಲಿಯಲು ಆರಂಭಿಸಿ',
    secondaryCta: 'ಮಾರ್ಗದರ್ಶಿ ಡೌನ್‌ಲೋಡ್',
    search: 'ಪಾಠಗಳು, ಉಣ್ಣೆ ವಿಷಯಗಳು...',
    schedule: 'ಮುಂಬರುವ ಅಧಿವೇಶನಗಳು',
    journeyTitle: 'ಉಣ್ಣೆ ಪ್ರಯಾಣ',
    journeySubtitle: 'ನಿಮ್ಮ ಉಣ್ಣೆ ಕೃಷಿಯಿಂದ ಬಟ್ಟೆಯವರೆಗೆ ಹೇಗೆ ಪ್ರಯಾಣಿಸುತ್ತದೆ ಎಂದು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.',
    modulesTitle: 'ತರಬೇತಿ ಮಾಡ್ಯೂಲ್‌ಗಳು',
    modulesSubtitle: 'ಉಣ್ಣೆ ಉತ್ಪಾದನೆಯ ಪ್ರತಿ ಹಂತವನ್ನು ಒಳಗೊಂಡ ಪ್ರಾಯೋಗಿಕ ಪಾಠಗಳು.',
    cohortsTitle: 'ಗ್ರಾಮ ಕಲಿಕೆ ಗುಂಪುಗಳು',
    cohortsSubtitle: 'ಹತ್ತಿರದ ರೈತ ತರಬೇತಿ ಗುಂಪಿಗೆ ಸೇರಿ.',
    guidesTitle: 'ಪ್ರಾಯೋಗಿಕ ಮಾರ್ಗದರ್ಶಿಗಳು',
    guidesSubtitle: 'ಕ್ಷೇತ್ರದಲ್ಲಿ ಬಳಸಲು ಡೌನ್‌ಲೋಡ್ ಮಾಡಬಹುದಾದ ಮಾರ್ಗದರ್ಶಿಗಳು.',
    schemesTitle: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು & ಬೆಂಬಲ',
    schemesSubtitle: 'ಹೆಚ್ಚು ಗಳಿಸಲು ಸಹಾಯ ಮಾಡುವ ಯೋಜನೆಗಳನ್ನು ತಿಳಿಯಿರಿ.',
    startLesson: 'ಪಾಠ ಪ್ರಾರಂಭಿಸಿ',
    joinGroup: 'ಗುಂಪಿಗೆ ಸೇರಿ',
    learnMore: 'ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ',
    applyNow: 'ಈಗ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    noResults: 'ಫಲಿತಾಂಶಗಳಿಲ್ಲ',
    lessons: 'ಪಾಠಗಳು',
    completed: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    resume: 'ಮುಂದುವರಿಸಿ',
    resumeLearning: 'ಕಲಿಯುವುದನ್ನು ಮುಂದುವರಿಸಿ',
    indiaReady: 'ಭಾರತ-ಸಿದ್ಧ ಪಠ್ಯಕ್ರಮ',
    learningHub: 'ರೈತ ಕಲಿಕೆ ಕೇಂದ್ರ',
    activeGroups: 'ಸಕ್ರಿಯ ಗುಂಪುಗಳು',
    modulesLabel: 'ಮಾಡ್ಯೂಲ್‌ಗಳು',
    activeFarmers: 'ಸಕ್ರಿಯ ರೈತರು ಕಲಿಯುತ್ತಿದ್ದಾರೆ',
    trainingModules: 'ತರಬೇತಿ ಮಾಡ್ಯೂಲ್‌ಗಳು',
    avgCompletion: 'ಸರಾಸರಿ ಪೂರ್ಣ ದರ',
    villageLearningGroups: 'ಗ್ರಾಮ ಕಲಿಕೆ ಗುಂಪುಗಳು',
    farmersLabel: 'ರೈತರು',
    attendanceLabel: 'ಹಾಜರಾತಿ',
    currentFocusLabel: 'ಪ್ರಸ್ತುತ ಗಮನ',
    nextSessionLabel: 'ಮುಂದಿನ ಅಧಿವೇಶನ',
    pagesLabel: 'ಪುಟಗಳು',
    clearSearch: 'ಹುಡುಕಾಟ ತೆರವುಗೊಳಿಸಿ',
    upcomingSessions: 'ಮುಂಬರುವ ಅಧಿವೇಶನಗಳು',
    joinSession: 'ಹತ್ತಿರದ ಲೈವ್ ತರಬೇತಿ ಅಧಿವೇಶನಕ್ಕೆ ಸೇರಿ',
    seatsLeft: 'ಆಸನಗಳು ಉಳಿದಿವೆ',
    facilitatorLabel: 'ಸೌಲಭ್ಯ ನೀಡುವವರು',
    close: 'ಮುಚ್ಚಿ',
    rsvp: 'RSVP',
    rsvped: '✓ ನೋಂದಾಯಿಸಲಾಗಿದೆ',
    downloadUse: 'ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    fullName: 'ಪೂರ್ಣ ಹೆಸರು',
    yourName: 'ನಿಮ್ಮ ಹೆಸರು',
    phoneNumber: 'ಫೋನ್ ಸಂಖ್ಯೆ',
    preferredLang: 'ಆದ್ಯತೆಯ ಭಾಷೆ',
    villageDistrict: 'ಗ್ರಾಮ / ಜಿಲ್ಲೆ',
    yourVillage: 'ನಿಮ್ಮ ಗ್ರಾಮ',
    joinGroup2: 'ಗುಂಪಿಗೆ ಸೇರಿ',
    youJoined: 'ನೀವು ಸೇರಿದ್ದೀರಿ!',
    youreNowPart: 'ನೀವು ಈಗ ಭಾಗ',
    topicLabel: 'ವಿಷಯ',
    doneBtn: 'ಮುಗಿಯಿತು',
    applyOnline: 'ಆನ್‌ಲೈನ್ ಅರ್ಜಿ',
    callHelpline: 'ಹೆಲ್ಪ್‌ಲೈನ್',
    eligibility: 'ಅರ್ಹತೆ',
    benefits: 'ಪ್ರಯೋಜನಗಳು',
    requiredDocs: 'ಅಗತ್ಯ ದಾಖಲೆಗಳು',
    downloaded: 'ಡೌನ್‌ಲೋಡ್',
    trainingPath: ['ಕೃಷಿ', 'ಉಣ್ಣೆ', 'ಗುಣಮಟ್ಟ', 'ಮಾರುಕಟ್ಟೆ', 'ಲಾಜಿಸ್ಟಿಕ್ಸ್', 'ಸಂಸ್ಕರಣೆ', 'ಬಟ್ಟೆ'],
  },
  mr: {
    title: 'ऊन अकॅडमी',
    subtitle: 'ऊन बद्दल सर्वकाही शिका. तुमच्या भाषेत व्यावहारिक धडे.',
    badge: 'शेतापासून कापडापर्यंत',
    heroTitle: 'शिका. वाढा. तुमच्या ऊनपासून अधिक कमवा.',
    heroBody: 'व्यावहारिक व्हिडिओ धडे, ऑडिओ मार्गदर्शक यांद्वारे ऊन कातरणी, श्रेणीकरण, बाजारपेठ प्रवेश यात निपुणता मिळवा.',
    primaryCta: 'शिकायला सुरुवात करा',
    secondaryCta: 'मार्गदर्शक डाउनलोड',
    search: 'धडे, ऊन विषय, मार्गदर्शक शोधा...',
    schedule: 'आगामी सत्रे',
    journeyTitle: 'ऊन प्रवास',
    journeySubtitle: 'तुमची ऊन शेतापासून कापडापर्यंत कसा प्रवास करते ते समजून घ्या.',
    modulesTitle: 'प्रशिक्षण मॉड्यूल',
    modulesSubtitle: 'ऊन उत्पादनाच्या प्रत्येक टप्प्याला कव्हर करणारे व्यावहारिक धडे.',
    cohortsTitle: 'गाव शिक्षण गट',
    cohortsSubtitle: 'जवळच्या शेतकरी प्रशिक्षण गटात सामील व्हा.',
    guidesTitle: 'व्यावहारिक मार्गदर्शक',
    guidesSubtitle: 'शेतात वापरण्यासाठी डाउनलोड करता येणारे मार्गदर्शक.',
    schemesTitle: 'सरकारी योजना आणि सहाय्य',
    schemesSubtitle: 'अधिक कमावण्यास मदत करणाऱ्या योजना जाणून घ्या.',
    startLesson: 'धडा सुरू करा',
    joinGroup: 'गटात सामील व्हा',
    learnMore: 'अधिक जाणा',
    applyNow: 'आता अर्ज करा',
    noResults: 'कोणतेही परिणाम नाही',
    lessons: 'धडे',
    completed: 'पूर्ण',
    resume: 'सुरू ठेवा',
    resumeLearning: 'शिकणे सुरू ठेवा',
    indiaReady: 'भारत-तयार अभ्यासक्रम',
    learningHub: 'शेतकरी शिक्षण केंद्र',
    activeGroups: 'सक्रिय गट',
    modulesLabel: 'मॉड्यूल',
    activeFarmers: 'सक्रिय शेतकरी शिकत आहेत',
    trainingModules: 'प्रशिक्षण मॉड्यूल',
    avgCompletion: 'सरासरी पूर्णता दर',
    villageLearningGroups: 'गाव शिक्षण गट',
    farmersLabel: 'शेतकरी',
    attendanceLabel: 'उपस्थिती',
    currentFocusLabel: 'सध्याचा विषय',
    nextSessionLabel: 'पुढील सत्र',
    pagesLabel: 'पाने',
    clearSearch: 'शोध साफ करा',
    upcomingSessions: 'आगामी सत्रे',
    joinSession: 'जवळच्या लाइव्ह प्रशिक्षण सत्रात सामील व्हा',
    seatsLeft: 'जागा शिल्लक',
    facilitatorLabel: 'सुविधाकर्ता',
    close: 'बंद करा',
    rsvp: 'RSVP',
    rsvped: '✓ नोंदणी',
    downloadUse: 'डाउनलोड करा',
    fullName: 'पूर्ण नाव',
    yourName: 'तुमचे नाव',
    phoneNumber: 'फोन नंबर',
    preferredLang: 'आवडती भाषा',
    villageDistrict: 'गाव / जिल्हा',
    yourVillage: 'तुमचे गाव',
    joinGroup2: 'गटात सामील व्हा',
    youJoined: 'तुम्ही सामील झालात!',
    youreNowPart: 'तुम्ही आता भाग आहात',
    topicLabel: 'विषय',
    doneBtn: 'झाले',
    applyOnline: 'ऑनलाइन अर्ज',
    callHelpline: 'हेल्पलाइन',
    eligibility: 'पात्रता',
    benefits: 'फायदे',
    requiredDocs: 'आवश्यक कागदपत्रे',
    downloaded: 'डाउनलोड',
    trainingPath: ['शेत', 'ऊन', 'गुणवत्ता', 'बाजार', 'लॉजिस्टिक्स', 'प्रक्रिया', 'कापड'],
  },
  bn: {
    title: 'উল একাডেমি',
    subtitle: 'উল সম্পর্কে সবকিছু শিখুন। আপনার ভাষায় ব্যবহারিক পাঠ।',
    badge: 'খামার থেকে কাপড় পর্যন্ত',
    heroTitle: 'শিখুন। বড় হন। আপনার উল থেকে বেশি আয় করুন।',
    heroBody: 'ব্যবহারিক ভিডিও পাঠ, অডিও গাইডের মাধ্যমে উল কাটা, গ্রেডিং, বাজার অ্যাক্সেসে দক্ষতা অর্জন করুন।',
    primaryCta: 'শেখা শুরু',
    secondaryCta: 'গাইড ডাউনলোড',
    search: 'পাঠ, উল বিষয়, গাইড খুঁজুন...',
    schedule: 'আসন্ন সেশন',
    journeyTitle: 'উলের যাত্রা',
    journeySubtitle: 'আপনার উল খামার থেকে কাপড় পর্যন্ত কীভাবে যাত্রা করে তা বুঝুন।',
    modulesTitle: 'প্রশিক্ষণ মডিউল',
    modulesSubtitle: 'উল উৎপাদনের প্রতিটি পর্যায় কভার করা ব্যবহারিক পাঠ।',
    cohortsTitle: 'গ্রাম শিক্ষা দল',
    cohortsSubtitle: 'কাছের কৃষক প্রশিক্ষণ দলে যোগ দিন।',
    guidesTitle: 'ব্যবহারিক গাইড',
    guidesSubtitle: 'মাঠে ব্যবহারের জন্য ডাউনলোডযোগ্য গাইড।',
    schemesTitle: 'সরকারি প্রকল্প ও সহায়তা',
    schemesSubtitle: 'উল-সম্পর্কিত প্রকল্পগুলো জানুন।',
    startLesson: 'পাঠ শুরু',
    joinGroup: 'দলে যোগ দিন',
    learnMore: 'আরও জানুন',
    applyNow: 'এখনই আবেদন',
    noResults: 'কোনো ফলাফল নেই',
    lessons: 'পাঠ',
    completed: 'সম্পন্ন',
    resume: 'চালিয়ে যান',
    resumeLearning: 'শেখা চালিয়ে যান',
    indiaReady: 'ভারত-প্রস্তুত পাঠ্যক্রম',
    learningHub: 'কৃষক শেখার কেন্দ্র',
    activeGroups: 'সক্রিয় দল',
    modulesLabel: 'মডিউল',
    activeFarmers: 'সক্রিয় কৃষক শিখছেন',
    trainingModules: 'প্রশিক্ষণ মডিউল',
    avgCompletion: 'গড় সমাপ্তির হার',
    villageLearningGroups: 'গ্রাম শেখার দল',
    farmersLabel: 'কৃষক',
    attendanceLabel: 'উপস্থিতি',
    currentFocusLabel: 'বর্তমান বিষয়',
    nextSessionLabel: 'পরবর্তী সেশন',
    pagesLabel: 'পৃষ্ঠা',
    clearSearch: 'অনুসন্ধান মুছুন',
    upcomingSessions: 'আসন্ন সেশন',
    joinSession: 'কাছের লাইভ প্রশিক্ষণ সেশনে যোগ দিন',
    seatsLeft: 'আসন বাকি',
    facilitatorLabel: 'সহায়তাকারী',
    close: 'বন্ধ করুন',
    rsvp: 'RSVP',
    rsvped: '✓ নিবন্ধিত',
    downloadUse: 'ডাউনলোড করুন',
    fullName: 'পূর্ণ নাম',
    yourName: 'আপনার নাম',
    phoneNumber: 'ফোন নম্বর',
    preferredLang: 'পছন্দের ভাষা',
    villageDistrict: 'গ্রাম / জেলা',
    yourVillage: 'আপনার গ্রাম',
    joinGroup2: 'দলে যোগ দিন',
    youJoined: 'আপনি যোগ দিয়েছেন!',
    youreNowPart: 'আপনি এখন অংশ',
    topicLabel: 'বিষয়',
    doneBtn: 'সম্পন্ন',
    applyOnline: 'অনলাইনে আবেদন',
    callHelpline: 'হেল্পলাইন',
    eligibility: 'যোগ্যতা',
    benefits: 'সুবিধা',
    requiredDocs: 'প্রয়োজনীয় নথি',
    downloaded: 'ডাউনলোড',
    trainingPath: ['খামার', 'উল', 'গুণমান', 'বাজার', 'লজিস্টিক্স', 'প্রক্রিয়া', 'কাপড়'],
  },
  pa: {
    title: 'ਉੱਨ ਅਕੈਡਮੀ',
    subtitle: 'ਉੱਨ ਬਾਰੇ ਸਭ ਕੁਝ ਸਿੱਖੋ। ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ ਅਮਲੀ ਪਾਠ।',
    badge: 'ਖੇਤ ਤੋਂ ਕੱਪੜੇ ਤੱਕ',
    heroTitle: 'ਸਿੱਖੋ। ਵਧੋ। ਆਪਣੀ ਉੱਨ ਤੋਂ ਵੱਧ ਕਮਾਓ।',
    heroBody: 'ਅਮਲੀ ਵੀਡੀਓ ਪਾਠਾਂ, ਆਡੀਓ ਗਾਈਡਾਂ ਰਾਹੀਂ ਉੱਨ ਕਤਰਾਈ, ਗਰੇਡਿੰਗ, ਬਾਜ਼ਾਰ ਪਹੁੰਚ ਵਿੱਚ ਮੁਹਾਰਤ ਹਾਸਲ ਕਰੋ।',
    primaryCta: 'ਸਿੱਖਣਾ ਸ਼ੁਰੂ ਕਰੋ',
    secondaryCta: 'ਗਾਈਡ ਡਾਊਨਲੋਡ',
    search: 'ਪਾਠ, ਉੱਨ ਵਿਸ਼ੇ, ਗਾਈਡ ਖੋਜੋ...',
    schedule: 'ਆਉਣ ਵਾਲੇ ਸੈਸ਼ਨ',
    journeyTitle: 'ਉੱਨ ਦੀ ਯਾਤਰਾ',
    journeySubtitle: 'ਸਮਝੋ ਕਿ ਤੁਹਾਡੀ ਉੱਨ ਖੇਤ ਤੋਂ ਕੱਪੜੇ ਤੱਕ ਕਿਵੇਂ ਪਹੁੰਚਦੀ ਹੈ।',
    modulesTitle: 'ਸਿਖਲਾਈ ਮੋਡਿਊਲ',
    modulesSubtitle: 'ਉੱਨ ਉਤਪਾਦਨ ਦੇ ਹਰ ਪੜਾਅ ਨੂੰ ਕਵਰ ਕਰਨ ਵਾਲੇ ਅਮਲੀ ਪਾਠ।',
    cohortsTitle: 'ਪਿੰਡ ਸਿੱਖਣ ਸਮੂਹ',
    cohortsSubtitle: 'ਨੇੜੇ ਦੇ ਕਿਸਾਨ ਸਿਖਲਾਈ ਸਮੂਹ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ।',
    guidesTitle: 'ਅਮਲੀ ਗਾਈਡ',
    guidesSubtitle: 'ਖੇਤ ਵਿੱਚ ਵਰਤਣ ਲਈ ਡਾਊਨਲੋਡ ਕਰਨ ਯੋਗ ਗਾਈਡ।',
    schemesTitle: 'ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਅਤੇ ਸਹਾਇਤਾ',
    schemesSubtitle: 'ਉੱਨ-ਸੰਬੰਧੀ ਯੋਜਨਾਵਾਂ ਜਾਣੋ।',
    startLesson: 'ਪਾਠ ਸ਼ੁਰੂ ਕਰੋ',
    joinGroup: 'ਸਮੂਹ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ',
    learnMore: 'ਹੋਰ ਜਾਣੋ',
    applyNow: 'ਹੁਣੇ ਅਰਜ਼ੀ ਦਿਓ',
    noResults: 'ਕੋਈ ਨਤੀਜਾ ਨਹੀਂ',
    lessons: 'ਪਾਠ',
    completed: 'ਪੂਰਾ',
    resume: 'ਜਾਰੀ ਰੱਖੋ',
    resumeLearning: 'ਸਿੱਖਣਾ ਜਾਰੀ ਰੱਖੋ',
    indiaReady: 'ਭਾਰਤ-ਤਿਆਰ ਪਾਠ੍ਯਕ੍ਰਮ',
    learningHub: 'ਕਿਸਾਨ ਸਿੱਖਣ ਕੇਂਦਰ',
    activeGroups: 'ਸਰਗਰਮ ਸਮੂਹ',
    modulesLabel: 'ਮੋਡਿਊਲ',
    activeFarmers: 'ਸਰਗਰਮ ਕਿਸਾਨ ਸਿੱਖ ਰਹੇ ਹਨ',
    trainingModules: 'ਸਿਖਲਾਈ ਮੋਡਿਊਲ',
    avgCompletion: 'ਔਸਤ ਪੂਰਨਤਾ ਦਰ',
    villageLearningGroups: 'ਪਿੰਡ ਸਿੱਖਣ ਸਮੂਹ',
    farmersLabel: 'ਕਿਸਾਨ',
    attendanceLabel: 'ਹਾਜ਼ਰੀ',
    currentFocusLabel: 'ਮੌਜੂਦਾ ਵਿਸ਼ਾ',
    nextSessionLabel: 'ਅਗਲਾ ਸੈਸ਼ਨ',
    pagesLabel: 'ਪੰਨੇ',
    clearSearch: 'ਖੋਜ ਸਾਫ਼ ਕਰੋ',
    upcomingSessions: 'ਆਉਣ ਵਾਲੇ ਸੈਸ਼ਨ',
    joinSession: 'ਨੇੜੇ ਦੇ ਲਾਈਵ ਸੈਸ਼ਨ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ',
    seatsLeft: 'ਸੀਟਾਂ ਬਾਕੀ',
    facilitatorLabel: 'ਸਹੂਲਤਕਰਤਾ',
    close: 'ਬੰਦ ਕਰੋ',
    rsvp: 'RSVP',
    rsvped: '✓ ਰਜਿਸਟਰਡ',
    downloadUse: 'ਡਾਊਨਲੋਡ ਕਰੋ',
    fullName: 'ਪੂਰਾ ਨਾਮ',
    yourName: 'ਤੁਹਾਡਾ ਨਾਮ',
    phoneNumber: 'ਫ਼ੋਨ ਨੰਬਰ',
    preferredLang: 'ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ',
    villageDistrict: 'ਪਿੰਡ / ਜ਼ਿਲ੍ਹਾ',
    yourVillage: 'ਤੁਹਾਡਾ ਪਿੰਡ',
    joinGroup2: 'ਸਮੂਹ ਵਿੱਚ ਸ਼ਾਮਲ',
    youJoined: 'ਤੁਸੀਂ ਸ਼ਾਮਲ ਹੋ ਗਏ!',
    youreNowPart: 'ਤੁਸੀਂ ਹੁਣ ਹਿੱਸਾ ਹੋ',
    topicLabel: 'ਵਿਸ਼ਾ',
    doneBtn: 'ਹੋ ਗਿਆ',
    applyOnline: 'ਔਨਲਾਈਨ ਅਰਜ਼ੀ',
    callHelpline: 'ਹੈਲਪਲਾਈਨ',
    eligibility: 'ਯੋਗਤਾ',
    benefits: 'ਫ਼ਾਇਦੇ',
    requiredDocs: 'ਜ਼ਰੂਰੀ ਦਸਤਾਵੇਜ਼',
    downloaded: 'ਡਾਊਨਲੋਡ',
    trainingPath: ['ਖੇਤ', 'ਉੱਨ', 'ਗੁਣਵੱਤਾ', 'ਬਾਜ਼ਾਰ', 'ਲੌਜਿਸਟਿਕਸ', 'ਪ੍ਰਕਿਰਿਆ', 'ਕੱਪੜਾ'],
  },
};

/* ─── Static Data ─────────────────────────────────────────────────────────── */
const cohorts = [
  { village: 'Bikaner Cluster', state: 'Rajasthan', learners: 126, attendance: '91%', focus: 'Pre-shearing hygiene', next: 'Today, 4:00 PM' },
  { village: 'Kullu Valley Group', state: 'Himachal Pradesh', learners: 84, attendance: '87%', focus: 'Fiber sorting & grading', next: 'Tomorrow, 10:30 AM' },
  { village: 'Mandya Shepherd Circle', state: 'Karnataka', learners: 112, attendance: '94%', focus: 'Batch QR creation', next: '16 Aug, 9:00 AM' },
  { village: 'Jodhpur Wool Collective', state: 'Rajasthan', learners: 98, attendance: '89%', focus: 'Market price analysis', next: '17 Aug, 3:00 PM' },
  { village: 'Leh Pashmina Farmers', state: 'Ladakh', learners: 67, attendance: '92%', focus: 'Sustainable grazing', next: '18 Aug, 11:00 AM' },
];

const woolJourney = [
  { step: 'Farm', desc: 'A farmer produces wool from their sheep flock', icon: Sprout },
  { step: 'Shearing', desc: 'Wool is carefully sheared and a digital batch is created', icon: Scissors },
  { step: 'Quality', desc: 'Wool is inspected — fiber diameter, strength, purity tested', icon: Award },
  { step: 'Certification', desc: 'The batch receives a quality certificate and QR code', icon: CheckCircle2 },
  { step: 'Market', desc: 'The farmer sees live market prices and buyer bids', icon: TrendingUp },
  { step: 'Trade', desc: 'Buyers place offers, a fair transaction is created', icon: Handshake },
  { step: 'Logistics', desc: 'Transport is arranged and tracked in real-time', icon: Truck },
  { step: 'Warehouse', desc: 'Wool is stored in climate-controlled facilities', icon: Warehouse },
  { step: 'Processing', desc: 'Wool is cleaned, carded, combed, and spun into yarn', icon: Factory },
  { step: 'Fabric', desc: 'Yarn becomes fabric — the consumer can verify the full journey', icon: Shirt },
];

const guides = [
  { title: 'Shearing Season Calendar', desc: 'Breed-wise optimal shearing dates for each Indian region', icon: CalendarDays, pages: 4, file: 'shearing-calendar.pdf' },
  { title: 'Wool Grading Reference Card', desc: 'Quick visual reference for BIS wool grades — fiber, color, purity', icon: ClipboardList, pages: 2, file: 'grading-reference.pdf' },
  { title: 'Batch QR Step-by-Step', desc: 'How to create, scan, and share your wool batch QR code on WoolTrace', icon: QrCode, pages: 3, file: 'batch-qr-guide.pdf' },
  { title: 'Sheep Feed & Nutrition Chart', desc: 'Seasonal feeding plan for healthy sheep and stronger wool fiber', icon: Sprout, pages: 6, file: 'nutrition-chart.pdf' },
  { title: 'Market Price Comparison Guide', desc: 'How to read mandi prices, compare bids, and negotiate better rates', icon: IndianRupee, pages: 4, file: 'price-guide.pdf' },
  { title: 'Wool Storage Best Practices', desc: 'Keep wool dry, clean, and graded for maximum sale value', icon: Package, pages: 3, file: 'storage-guide.pdf' },
];

const schemes = [
  { name: 'SWIS – Sheep & Wool Improvement Scheme', body: 'Ministry of Textiles', benefit: 'Health camps, breed improvement, shearing machines', status: 'Active', url: 'https://texmin.nic.in' },
  { name: 'IWIDP – Integrated Wool Improvement & Development Programme', body: 'CWDB (Central Wool Development Board)', benefit: 'Wool marketing, CFC setup, training programs', status: 'Active', url: 'https://cwdb.gov.in' },
  { name: 'Pashmina Wool Development Scheme', body: 'CWDB', benefit: 'Pashmina goat health, dehairing machines, marketing support', status: 'Active', url: 'https://cwdb.gov.in/pashmina' },
  { name: 'HDP – Human Development Programme', body: 'CWDB', benefit: 'Skill development for wool artisans and weavers', status: 'Active', url: 'https://cwdb.gov.in/hdp' },
];

// trainingPath is now per-language: t.trainingPath

const iconMap = {
  Scissors, ClipboardList, Sprout, QrCode, TrendingUp, Truck, Factory, Leaf,
};

/* ─── Tone gradients ────────────────────────────────────────────────────── */
const toneAccent = { ivory: '#EDEDCE', blue: '#BED5E5', lime: '#DDFF86', coral: '#FFAAA4' };

/* ─── Academy Component ──────────────────────────────────────────────────── */
const Academy = () => {
  const navigate = useNavigate();
  const modulesRef = useRef(null);

  const [activeLanguage, setActiveLanguage] = useState(
    () => localStorage.getItem('wt_academy_lang') || 'en'
  );
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState(false);
  const [joinCohort, setJoinCohort] = useState(null);
  const [schemeDetail, setSchemeDetail] = useState(null);

  // Download toast state
  const [downloadToast, setDownloadToast] = useState(null);

  const t = copy[activeLanguage] || copy.en;
  const filters = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Persist language choice
  const switchLanguage = (code) => {
    setActiveLanguage(code);
    localStorage.setItem('wt_academy_lang', code);
  };

  // Get module progress from localStorage
  const getProgress = (moduleId) => {
    try {
      const done = JSON.parse(localStorage.getItem(`wt_module_progress_${moduleId}`)) || [];
      const mod = moduleData.find((m) => m.id === moduleId);
      return mod ? Math.round((done.length / mod.lessons.length) * 100) : 0;
    } catch { return 0; }
  };

  // Search filter across modules + guides
  const searchLower = searchQuery.toLowerCase();
  const visibleModules = useMemo(() => {
    let mods = activeFilter === 'All' ? moduleData : moduleData.filter((m) => m.level === activeFilter);
    if (searchQuery) {
      mods = mods.filter((m) =>
        m.title.toLowerCase().includes(searchLower) ||
        m.description.toLowerCase().includes(searchLower) ||
        m.level.toLowerCase().includes(searchLower)
      );
    }
    return mods;
  }, [activeFilter, searchQuery]);

  const visibleGuides = useMemo(() => {
    if (!searchQuery) return guides;
    return guides.filter((g) => g.title.toLowerCase().includes(searchLower) || g.desc.toLowerCase().includes(searchLower));
  }, [searchQuery]);

  const visibleCohorts = useMemo(() => {
    if (!searchQuery) return cohorts;
    return cohorts.filter((c) => c.village.toLowerCase().includes(searchLower) || c.state.toLowerCase().includes(searchLower));
  }, [searchQuery]);

  // Download guide (creates a PDF using jsPDF)
  const downloadGuide = (guide) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("WoolTrace Farmer Academy", 20, 20);
      doc.setFontSize(14);
      doc.text(guide.title, 20, 40);
      doc.setFontSize(12);
      
      // Handle potentially long descriptions
      const splitDesc = doc.splitTextToSize(guide.desc, 170);
      doc.text(splitDesc, 20, 50);
      
      let currentY = 50 + (splitDesc.length * 7) + 10;
      
      doc.setFontSize(10);
      // Generate some dummy content based on the title to make it look like a real guide
      let content = "";
      if (guide.title.includes("Shearing")) {
        content = "1. Spring Shearing (March-April): Ideal for most regions.\n2. Autumn Shearing (Sept-Oct): Secondary shearing season.\n\nBest Practices:\n- Keep the shearing floor clean.\n- Avoid second cuts to maintain staple length.\n- Separate stained wool immediately.\n- Ensure sheep are dry before shearing.";
      } else if (guide.title.includes("Grading")) {
        content = "BIS Wool Grades:\n- Fine Wool: < 25 microns. Used for apparel.\n- Medium Wool: 25-35 microns. Used for blankets and knitwear.\n- Coarse Wool: > 35 microns. Used for carpets.\n\nColor Grading:\n- White: Premium value.\n- Yellow/Tinged: Lower value due to dyeing difficulty.\n- Black/Grey: Naturally colored, niche market.";
      } else if (guide.title.includes("QR")) {
        content = "Step 1: Open the WoolTrace Farmer App.\nStep 2: Go to 'My Wool' and select 'Create Batch'.\nStep 3: Enter the shearing details, weight, and breed.\nStep 4: Click 'Generate QR'.\nStep 5: Print the QR code and attach it to the wool bale.\nStep 6: When buyers scan it, they will see the full history.";
      } else if (guide.title.includes("Feed")) {
        content = "Summer Nutrition:\n- Ensure constant access to clean water.\n- Supplement with mineral blocks.\n\nWinter Nutrition:\n- Provide high-quality hay or silage.\n- Increase energy intake with grains like maize or oats.\n- Protein supplements (e.g., soybean meal) improve wool growth.";
      } else if (guide.title.includes("Price")) {
        content = "Understanding Mandi Prices:\n- Prices fluctuate based on global demand and local supply.\n- Check the WoolTrace 'Market' tab for real-time rates.\n- Premium prices are paid for well-skirted, clean, white wool.\n- Negotiate based on your wool's micron count and yield percentage.";
      } else if (guide.title.includes("Storage")) {
        content = "Storage Guidelines:\n1. Keep it Dry: Moisture ruins wool and causes rotting.\n2. Off the Ground: Store bales on pallets to prevent dampness.\n3. Pest Control: Keep the storage area free of rodents and moths.\n4. Avoid Contamination: Do not store near chemicals, fuels, or strong odors.\n5. Ventilation: Ensure good airflow in the warehouse.";
      } else {
        content = "1. Introduction to the topic.\n2. Step-by-step instructions.\n3. Best practices for farmers.\n4. Common mistakes to avoid.\n5. Resources and helpline numbers.";
      }
      
      const splitContent = doc.splitTextToSize(content, 170);
      doc.text(splitContent, 20, currentY);
      
      currentY += (splitContent.length * 5) + 20;
      
      doc.setFontSize(10);
      doc.text(`Pages: ${guide.pages}`, 20, currentY);
      doc.text("This guide is provided by WoolTrace — From Farm to Fabric.", 20, currentY + 10);
      doc.text("Visit: https://wooltrace.in", 20, currentY + 15);
      
      const fileName = guide.file.endsWith('.pdf') ? guide.file : guide.file.replace('.txt', '.pdf');
      doc.save(fileName);
      
      setDownloadToast(guide.title);
      setTimeout(() => setDownloadToast(null), 3000);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // Scroll to modules
  const scrollToModules = () => {
    modulesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Check if any module has progress (for CTA label)
  const hasProgress = moduleData.some((m) => getProgress(m.id) > 0);

  return (
    <div className="academy-page">

      {/* ── Header ── */}
      <section className="academy-header">
        <div>
          <span className="academy-kicker"><Languages size={16} /> {t.badge}</span>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
        <div className="language-switcher" aria-label="Choose training language">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={activeLanguage === lang.code ? 'active' : ''}
              onClick={() => switchLanguage(lang.code)}
              title={lang.label}
            >
              {lang.native}
            </button>
          ))}
        </div>
      </section>

      {/* ── Hero ── */}
      <section className="training-hero">
        <div className="hero-copy">
          <span><Globe2 size={16} /> {t.indiaReady}</span>
          <h2>{t.heroTitle}</h2>
          <p>{t.heroBody}</p>
          <div className="hero-actions">
            <button className="academy-primary" onClick={scrollToModules}>
              <PlayCircle size={18} /> {hasProgress ? t.resumeLearning : t.primaryCta}
            </button>
            <button className="academy-secondary" onClick={() => setGuidesOpen(true)}>
              <Download size={18} /> {t.secondaryCta}
            </button>
          </div>
        </div>
        <div className="hero-panel">
          <div className="teacher-card">
            <GraduationCap size={28} />
            <div>
              <strong>{t.learningHub}</strong>
              <span>{languages.length} languages • {cohorts.length} {t.activeGroups} • {moduleData.length} {t.modulesLabel}</span>
            </div>
          </div>
          <div className="trace-path">
            {(t.trainingPath || ['Farm','Wool','Quality','Market','Logistics','Processing','Fabric']).map((step) => (
              <div key={step} className="trace-step">
                <span />
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="academy-stats" aria-label="Training overview">
        <article><Users size={22} /><strong>487</strong><span>{t.activeFarmers}</span></article>
        <article><BookOpen size={22} /><strong>{moduleData.length}</strong><span>{t.trainingModules}</span></article>
        <article><CheckCircle2 size={22} /><strong>72%</strong><span>{t.avgCompletion}</span></article>
        <article><MapPin size={22} /><strong>{cohorts.length}</strong><span>{t.villageLearningGroups}</span></article>
      </section>

      {/* ── Toolbar ── */}
      <section className="academy-toolbar">
        <div className="academy-search">
          <Search size={18} />
          <input
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear-btn" onClick={() => setSearchQuery('')}><X size={16} /></button>
          )}
        </div>
        <button className="schedule-btn" onClick={() => setScheduleOpen(true)}>
          <CalendarDays size={18} /> {t.schedule}
        </button>
      </section>

      {/* ── Search empty state ── */}
      {searchQuery && visibleModules.length === 0 && visibleGuides.length === 0 && visibleCohorts.length === 0 && (
        <div className="academy-no-results">
          <Search size={36} />
          <p>{t.noResults} "<strong>{searchQuery}</strong>"</p>
          <button onClick={() => setSearchQuery('')}>{t.clearSearch}</button>
        </div>
      )}

      {/* ── Wool Journey ── */}
      {!searchQuery && (
        <section className="journey-section">
          <div className="section-heading">
            <div>
              <h2>{t.journeyTitle}</h2>
              <p>{t.journeySubtitle}</p>
            </div>
          </div>
          <div className="journey-timeline">
            {woolJourney.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="journey-node">
                  <div className="journey-dot"><Icon size={18} /></div>
                  {i < woolJourney.length - 1 && <div className="journey-line" />}
                  <strong>{item.step}</strong>
                  <p>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Training Modules ── */}
      <section className="module-section" ref={modulesRef}>
        <div className="section-heading">
          <div>
            <h2>{t.modulesTitle}</h2>
            <p>{t.modulesSubtitle}</p>
          </div>
          {!searchQuery && (
            <div className="module-tabs">
              {filters.map((f) => (
                <button
                  key={f}
                  className={activeFilter === f ? 'active' : ''}
                  onClick={() => setActiveFilter(f)}
                >{f}</button>
              ))}
            </div>
          )}
        </div>

        <div className="modules-grid">
          {visibleModules.map((module) => {
            const Icon = iconMap[module.icon] || BookOpen;
            const progress = getProgress(module.id);
            return (
              <article
                key={module.id}
                className={`module-card ${module.tone}`}
                onClick={() => navigate(`/farmer/academy/module/${module.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="module-icon"><Icon size={24} /></div>
                <span>{module.level}</span>
                <h3>{
                  activeLanguage === 'hi' ? module.titleHi
                  : activeLanguage === 'gu' ? module.titleGu
                  : activeLanguage === 'mr' ? module.titleMr
                  : activeLanguage === 'te' ? module.titleTe
                  : activeLanguage === 'ta' ? module.titleTa
                  : activeLanguage === 'kn' ? module.titleKn
                  : module.title
                }</h3>
                <p>{module.description}</p>
                <div className="module-detail-row">
                  <span><PlayCircle size={14} /> {module.lessons.length} {t.lessons}</span>
                  <span><Mic2 size={14} /> {module.duration}</span>
                  <span><Languages size={14} /> {module.languageCount} lang</span>
                </div>
                <div className="module-meta">
                  <strong>{module.format}</strong>
                  <strong>{progress > 0 ? `${progress}% ${t.completed}` : module.level}</strong>
                </div>
                <div className="progress-track">
                  <div style={{ width: `${progress}%`, background: toneAccent[module.tone] === '#DDFF86' ? '#0B120D' : '#0B120D' }} />
                </div>
                <button
                  className="module-start-btn"
                  onClick={(e) => { e.stopPropagation(); navigate(`/farmer/academy/module/${module.id}`); }}
                >
                  {progress > 0 ? t.resume : t.startLesson} <ChevronRight size={15} />
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Village Learning Groups ── */}
      {visibleCohorts.length > 0 && (
        <section className="cohort-section">
          <div className="section-heading">
            <div>
              <h2>{t.cohortsTitle}</h2>
              <p>{t.cohortsSubtitle}</p>
            </div>
          </div>
          <div className="cohort-table">
            {visibleCohorts.map((cohort) => (
              <article key={cohort.village}>
                <div>
                  <strong>{cohort.village}</strong>
                  <span>{cohort.state}</span>
                </div>
                <div><strong>{cohort.learners}</strong><span>{t.farmersLabel}</span></div>
                <div><strong>{cohort.attendance}</strong><span>{t.attendanceLabel}</span></div>
                <div><strong>{cohort.focus}</strong><span>{t.currentFocusLabel}</span></div>
                <div><strong>{cohort.next}</strong><span>{t.nextSessionLabel}</span></div>
                <button
                  className="cohort-join-btn"
                  onClick={() => setJoinCohort(cohort)}
                >
                  {t.joinGroup}
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── Practical Guides ── */}
      {visibleGuides.length > 0 && (
        <section className="guides-section">
          <div className="section-heading">
            <div>
              <h2>{t.guidesTitle}</h2>
              <p>{t.guidesSubtitle}</p>
            </div>
          </div>
          <div className="guides-grid">
            {visibleGuides.map((guide) => {
              const Icon = guide.icon;
              return (
                <article key={guide.title} className="guide-card">
                  <div className="guide-icon"><Icon size={20} /></div>
                  <div className="guide-content">
                    <h3>{guide.title}</h3>
                    <p>{guide.desc}</p>
                    <span className="guide-meta">{guide.pages} {t.pagesLabel} • PDF</span>
                  </div>
                  <button
                    className="guide-download"
                    title="Download guide"
                    onClick={() => downloadGuide(guide)}
                  >
                    <Download size={18} />
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Government Schemes ── */}
      {!searchQuery && (
        <section className="schemes-section">
          <div className="section-heading">
            <div>
              <h2>{t.schemesTitle}</h2>
              <p>{t.schemesSubtitle}</p>
            </div>
          </div>
          <div className="schemes-grid">
            {schemes.map((scheme) => (
              <article key={scheme.name} className="scheme-card">
                <div className="scheme-status">{scheme.status}</div>
                <h3>{scheme.name}</h3>
                <p className="scheme-body">{scheme.body}</p>
                <p className="scheme-benefit">{scheme.benefit}</p>
                <div className="scheme-actions">
                  <button
                    className="scheme-learn-btn"
                    onClick={() => setSchemeDetail(scheme)}
                  >
                    {t.learnMore}
                  </button>
                  <button
                    className="scheme-apply-btn"
                    onClick={() => window.open(scheme.url, '_blank', 'noopener')}
                  >
                    {t.applyNow} <ExternalLink size={13} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── Download Toast ── */}
      {downloadToast && (
        <div className="download-toast">
          <CheckCircle2 size={18} />
          <span>{t.downloaded}: <strong>{downloadToast}</strong></span>
        </div>
      )}

      {/* ── Modals (lazy-loaded when needed) ── */}
      {scheduleOpen && <ScheduleModal onClose={() => setScheduleOpen(false)} t={t} />}
      {guidesOpen && (
        <GuidesModal
          guides={guides}
          onDownload={downloadGuide}
          onClose={() => setGuidesOpen(false)}
          t={t}
        />
      )}
      {joinCohort && <CohortJoinModal cohort={joinCohort} onClose={() => setJoinCohort(null)} t={t} />}
      {schemeDetail && <SchemeDetailModal scheme={schemeDetail} onClose={() => setSchemeDetail(null)} t={t} />}
    </div>
  );
};

/* ─── Inline lightweight ScheduleModal ──────────────────────────────────── */
const scheduleSessions = [
  { date: 'Today', time: '4:00 PM', group: 'Bikaner Cluster', state: 'Rajasthan', topic: 'Pre-shearing hygiene & blade care', facilitator: 'Ramesh Kumar Sharma', seats: 20 },
  { date: 'Tomorrow', time: '10:30 AM', group: 'Kullu Valley Group', state: 'Himachal Pradesh', topic: 'Fiber sorting & BIS grading basics', facilitator: 'Priya Thakur', seats: 15 },
  { date: '16 Aug', time: '9:00 AM', group: 'Mandya Shepherd Circle', state: 'Karnataka', topic: 'Batch QR creation on WoolTrace', facilitator: 'Suresh Gowda', seats: 10 },
  { date: '17 Aug', time: '3:00 PM', group: 'Jodhpur Wool Collective', state: 'Rajasthan', topic: 'Market price analysis & reverse bidding', facilitator: 'Fatima Begum', seats: 25 },
  { date: '18 Aug', time: '11:00 AM', group: 'Leh Pashmina Farmers', state: 'Ladakh', topic: 'Sustainable grazing & water conservation', facilitator: 'Dorje Namgyal', seats: 12 },
  { date: '20 Aug', time: '2:00 PM', group: 'Barmer Wool Circle', state: 'Rajasthan', topic: 'Wool storage best practices', facilitator: 'Bhura Ram Joshi', seats: 18 },
];

const ScheduleModal = ({ onClose, t }) => {
  const [rsvpd, setRsvpd] = useState(new Set());
  const toggle = (idx) => {
    setRsvpd((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel schedule-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{t.upcomingSessions}</h2>
            <p>{t.joinSession}</p>
          </div>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="schedule-list">
          {scheduleSessions.map((s, idx) => (
            <div key={idx} className="schedule-item">
              <div className="schedule-date-badge">{s.date}</div>
              <div className="schedule-info">
                <div className="schedule-top">
                  <strong>{s.group}</strong>
                  <span className="schedule-state">{s.state}</span>
                </div>
                <p className="schedule-topic">{s.topic}</p>
                <div className="schedule-meta-row">
                  <span><CalendarDays size={13} /> {s.time}</span>
                  <span><Users size={13} /> {s.seats} {t.seatsLeft}</span>
                  <span>{t.facilitatorLabel}: {s.facilitator}</span>
                </div>
              </div>
              <button
                className={`rsvp-btn ${rsvpd.has(idx) ? 'rsvpd' : ''}`}
                onClick={() => toggle(idx)}
              >
                {rsvpd.has(idx) ? t.rsvped : t.rsvp}
              </button>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="modal-close-btn" onClick={onClose}>{t.close}</button>
        </div>
      </div>
    </div>
  );
};

/* ─── Inline GuidesModal ─────────────────────────────────────────────────── */
const GuidesModal = ({ guides, onDownload, onClose, t }) => (
  <div className="modal-backdrop" onClick={onClose}>
    <div className="modal-panel guides-modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <div>
          <h2>{t.guidesTitle}</h2>
          <p>{t.downloadUse}</p>
        </div>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
      </div>
      <div className="guides-modal-list">
        {guides.map((guide) => {
          const Icon = guide.icon;
          return (
            <div key={guide.title} className="guide-modal-item">
              <div className="guide-icon"><Icon size={20} /></div>
              <div className="guide-content">
                <h3>{guide.title}</h3>
                <p>{guide.desc}</p>
                <span className="guide-meta">{guide.pages} {t.pagesLabel} • PDF</span>
              </div>
              <button className="guide-download-full" onClick={() => { onDownload(guide); onClose(); }}>
                <Download size={16} /> {t.secondaryCta}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

/* ─── Inline CohortJoinModal ─────────────────────────────────────────────── */
const CohortJoinModal = ({ cohort, onClose, t }) => {
  const [form, setForm] = useState({ name: '', phone: '', language: 'English', village: '' });
  const [step, setStep] = useState('form');
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  if (step === 'success') return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel cohort-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cohort-success">
          <div className="cohort-success-icon"><CheckCircle2 size={40} /></div>
          <h2>{t.youJoined}</h2>
          <p>{t.youreNowPart} <strong>{cohort.village}</strong></p>
          <div className="cohort-next-info">
            <CalendarDays size={16} />
            <span>{t.nextSessionLabel}: <strong>{cohort.next}</strong></span>
          </div>
          <p className="cohort-success-sub">{t.topicLabel}: {cohort.focus}</p>
          <button className="modal-close-btn" onClick={onClose}>{t.doneBtn}</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel cohort-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{cohort.village}</h2>
            <p>{cohort.state} • Next: {cohort.next}</p>
          </div>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="cohort-chips">
          <span><Users size={14} /> {cohort.learners} farmers</span>
          <span><CheckCircle2 size={14} /> {cohort.attendance} attendance</span>
          <span><Star size={14} /> {cohort.focus}</span>
        </div>
        <div className="cohort-form">
          <label>{t.fullName}
            <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder={t.yourName} />
          </label>
          <label>{t.phoneNumber}
            <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 XXXXXXXXXX" />
          </label>
          <label>{t.preferredLang}
            <select value={form.language} onChange={(e) => set('language', e.target.value)}>
              {languages.map((l) => <option key={l.code}>{l.label}</option>)}
            </select>
          </label>
          <label>{t.villageDistrict}
            <input type="text" value={form.village} onChange={(e) => set('village', e.target.value)} placeholder={t.yourVillage} />
          </label>
        </div>
        <div className="modal-footer">
          <button
            className="cohort-submit-btn"
            onClick={() => { if (form.name && form.phone) setStep('success'); }}
            disabled={!form.name || !form.phone}
          >
            {t.joinGroup2}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Inline SchemeDetailModal ───────────────────────────────────────────── */
const schemeInfo = {
  'SWIS – Sheep & Wool Improvement Scheme': {
    description: 'The Sheep and Wool Improvement Scheme (SWIS) aims to improve sheep productivity and wool quality across India. It provides subsidized health camps, breed improvement services, and modern shearing equipment to registered sheep farmers.',
    eligibility: ['Registered sheep farmer with minimum 20 sheep', 'Member of a state sheep farmers cooperative', 'Aadhaar-linked bank account', 'Valid animal husbandry registration'],
    benefits: ['Free veterinary health camps', 'Subsidized shearing machines (50% subsidy)', 'Breed improvement rams', 'Training in modern wool handling'],
    documents: ['Aadhaar card', 'Bank passbook', 'Animal husbandry registration certificate', 'Cooperative membership certificate'],
    helpline: '1800-258-7150',
    deadline: 'Applications accepted year-round',
  },
  'IWIDP – Integrated Wool Improvement & Development Programme': {
    description: 'By the Central Wool Development Board (CWDB), IWIDP supports wool marketing infrastructure, Common Facility Centre (CFC) setup, and farmer training programs across wool-producing states.',
    eligibility: ['Active wool producing farmer or cooperative', 'Located in notified wool-producing district', 'Minimum annual production of 100 kg clean wool'],
    benefits: ['Access to Common Facility Centres (CFC)', 'Subsidized wool testing', 'Market linkage support', 'Annual training programs', 'Quality certification assistance'],
    documents: ['Farmer identity proof', 'Production records', 'Cooperative registration (if applicable)', 'Bank account details'],
    helpline: '0145-2637543',
    deadline: 'Annual window: April–June',
  },
  'Pashmina Wool Development Scheme': {
    description: 'A specialized CWDB scheme focused on Pashmina goat health, dehairing machines, and international marketing for Pashmina wool from Ladakh, HP, and J&K.',
    eligibility: ['Pashmina goat farmer in designated high-altitude zones', 'Registered with state animal husbandry department', 'J&K, Ladakh, Himachal Pradesh residents only'],
    benefits: ['Subsidized dehairing machines', 'Pashmina goat health camps', 'Direct market linkage with premium buyers', 'Export documentation support'],
    documents: ['State residency proof', 'Pashmina goat registration', 'Bank account details'],
    helpline: '0145-2637543',
    deadline: 'Applications open: August–October',
  },
  'HDP – Human Development Programme': {
    description: 'The Human Development Programme (HDP) by CWDB provides free skill development and vocational training for wool artisans, weavers, and herders.',
    eligibility: ['Any wool artisan, weaver, or sheep farmer', 'No minimum production requirement', 'Age 18–55 years', 'Priority for women and marginalized communities'],
    benefits: ['Free skill development training (5–30 days)', 'Stipend during training', 'Tool kit after completion', 'CWDB certificate'],
    documents: ['Aadhaar card', 'Age proof', 'Bank account details'],
    helpline: '0145-2637543',
    deadline: 'Rolling applications — monthly batches',
  },
};

const SchemeDetailModal = ({ scheme, onClose, t }) => {
  const info = schemeInfo[scheme.name] || {};
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel scheme-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="scheme-status" style={{ marginBottom: 8 }}>{scheme.status}</div>
            <h2>{scheme.name}</h2>
            <p>{scheme.body}</p>
          </div>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="scheme-detail-body">
          <p className="scheme-detail-desc">{info.description}</p>

          {info.eligibility && (
            <div className="scheme-detail-section">
              <h4>{t.eligibility}</h4>
              {info.eligibility.map((e, i) => (
                <div key={i} className="scheme-check-row"><CheckCircle2 size={15} /><span>{e}</span></div>
              ))}
            </div>
          )}

          {info.benefits && (
            <div className="scheme-detail-section">
              <h4>{t.benefits}</h4>
              {info.benefits.map((b, i) => (
                <div key={i} className="scheme-check-row benefit"><CheckCircle2 size={15} /><span>{b}</span></div>
              ))}
            </div>
          )}

          {info.documents && (
            <div className="scheme-detail-section">
              <h4>{t.requiredDocs}</h4>
              <ul className="scheme-docs-list">
                {info.documents.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>
          )}

          <div className="scheme-meta-row">
            <span><CalendarDays size={14} /> {info.deadline}</span>
            <span><Phone size={14} /> Helpline: {info.helpline}</span>
          </div>
        </div>
        <div className="modal-footer scheme-modal-footer">
          <button className="scheme-apply-btn-full" onClick={() => window.open(scheme.url, '_blank', 'noopener')}>
            {t.applyOnline} <ExternalLink size={15} />
          </button>
          <button className="scheme-call-btn" onClick={() => window.open(`tel:${info.helpline}`, '_self')}>
            <Phone size={15} /> {t.callHelpline}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Academy;
