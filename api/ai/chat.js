import { handleCors } from '../_utils/http.js';

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const LANGUAGES = new Set(['English', 'Hindi', 'Bengali', 'Marathi', 'Telugu', 'Tamil', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Odia']);

const cleanAnswer = (value = '') => String(value)
  .replace(/\\?<think>[\s\S]*?<\\?\/think>/gi, '')
  .replace(/\\?<think>[\s\S]*$/gi, '')
  .replace(/\\?<\\?\/think>/gi, '')
  .replace(/^#{1,6}\s+/gm, '')
  .trim();

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });
  const apiKey = process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY;
  if (!apiKey) return res.status(503).json({ success: false, message: 'Chat service is not configured.' });
  const { messages = [], language = 'English', context = {} } = req.body || {};
  if (!Array.isArray(messages) || !messages.length) return res.status(400).json({ success: false, message: 'A message is required.' });
  const selectedLanguage = LANGUAGES.has(language) ? language : 'English';
  const safeMessages = messages.filter(item => item && ['user', 'assistant'].includes(item.role) && typeof item.content === 'string').slice(-12);
  const latestQuestion = safeMessages.at(-1)?.content?.trim() || '';
  if (/^(today'?s?\s+)?mandi\s+prices?\??$/i.test(latestQuestion) && selectedLanguage === 'English') {
    return res.status(200).json({ success: true, answer: 'To check today’s mandi prices, choose your crop and district in Market Intelligence. Compare the modal price, arrivals and nearby buyer demand before deciding when to sell.\n\nTell me your crop and district for a more focused answer.', model: 'khetsetu-guidance', language: selectedLanguage });
  }
  try {
    const usingGroq = Boolean(process.env.GROQ_API_KEY);
    const response = await fetch(usingGroq ? GROQ_ENDPOINT : 'https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', ...(usingGroq ? {} : { 'HTTP-Referer': process.env.PUBLIC_APP_URL || 'https://khetsetu.app', 'X-Title': 'KhetSetu Market Assistant' }) },
      body: JSON.stringify({ model: usingGroq ? 'qwen/qwen3.6-27b' : 'openrouter/free', messages: [{ role: 'system', content: `You are KhetSetu's practical market assistant. Reply only in ${selectedLanguage}. Return only the final answer—never expose reasoning, analysis, XML tags or a thinking process. Write 2–4 short, polished paragraphs or bullets with the most useful action first. Help with mandi prices, selling windows, quality, buyers, logistics, storage, payments and grievances. Never invent live prices, buyer credentials or transaction status. When crop, district or current data is missing, state exactly what is needed and direct the user to the relevant KhetSetu page. User context: ${JSON.stringify(context)}` }, ...safeMessages], temperature: usingGroq ? 0.7 : 0.2, max_tokens: 350, ...(usingGroq ? { reasoning_format: 'hidden', reasoning_effort: 'none' } : {}) })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) return res.status(502).json({ success: false, message: payload?.error?.message || 'Chat provider unavailable.' });
    const answer = cleanAnswer(payload?.choices?.[0]?.message?.content);
    if (!answer) return res.status(502).json({ success: false, message: 'Chat provider returned an empty answer.' });
    return res.status(200).json({ success: true, answer, model: payload.model || (usingGroq ? 'qwen/qwen3.6-27b' : 'openrouter/free'), language: selectedLanguage });
  } catch (error) { return res.status(502).json({ success: false, message: error.message || 'Chat provider unavailable.' }); }
}
