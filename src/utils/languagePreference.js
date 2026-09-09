export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'mr', label: 'मराठी' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' }
];

const accountKey = (identifier = '') => `khetsetu_language_${identifier.trim().toLowerCase()}`;

export const getSavedLanguage = (identifier, fallback = 'en') =>
  localStorage.getItem(accountKey(identifier)) || fallback;

export const saveLanguage = (identifier, language) => {
  if (identifier?.trim()) localStorage.setItem(accountKey(identifier), language);
  localStorage.setItem('khetsetu_language_guest', language);
};

export const applyPageLanguage = (language = 'en') => {
  const host = window.location.hostname;
  const cookieValue = language === 'en' ? '' : `/en/${language}`;
  const expiry = language === 'en' ? '; expires=Thu, 01 Jan 1970 00:00:00 UTC' : '';
  document.cookie = `googtrans=${cookieValue}${expiry}; path=/`;
  document.cookie = `googtrans=${cookieValue}${expiry}; path=/; domain=${host}`;
  document.cookie = `googtrans=${cookieValue}${expiry}; path=/; domain=.${host}`;

  if (language !== 'en' && !document.getElementById('google-translate-script')) {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({ pageLanguage: 'en', autoDisplay: false }, 'google_translate_element');
    };
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(script);
  }
};
