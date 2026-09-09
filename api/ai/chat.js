const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const LANGUAGES = new Set(['English', 'Hindi', 'Bengali', 'Marathi', 'Telugu', 'Tamil', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Odia']);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });
  const apiKey = process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY;
  if (!apiKey) return res.status(503).json({ success: false, message: 'Chat service is not configured.' });
  const { messages = [], language = 'English', context = {} } = req.body || {};
  if (!Array.isArray(messages) || !messages.length) return res.status(400).json({ success: false, message: 'A message is required.' });
  const selectedLanguage = LANGUAGES.has(language) ? language : 'English';
  const safeMessages = messages.filter(item => item && ['user', 'assistant'].includes(item.role) && typeof item.content === 'string').slice(-12);
  try {
    const usingGroq = Boolean(process.env.GROQ_API_KEY);
    const response = await fetch(usingGroq ? GROQ_ENDPOINT : 'https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', ...(usingGroq ? {} : { 'HTTP-Referer': process.env.PUBLIC_APP_URL || 'https://khetsetu.app', 'X-Title': 'KhetSetu Market Assistant' }) },
      body: JSON.stringify({ model: usingGroq ? 'qwen/qwen3.6-27b' : 'openrouter/free', messages: [{ role: 'system', content: `You are KhetSetu's practical farming and market assistant. Reply only in ${selectedLanguage}. Give concise, actionable guidance about mandi prices, selling windows, quality, buyers, logistics, storage, payments and grievances. Never invent live prices, buyer credentials or transaction status. If data is missing, say what the farmer should check. User context: ${JSON.stringify(context)}` }, ...safeMessages], temperature: 0.2, max_tokens: 500 })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) return res.status(502).json({ success: false, message: payload?.error?.message || 'Chat provider unavailable.' });
    const answer = payload?.choices?.[0]?.message?.content?.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    if (!answer) return res.status(502).json({ success: false, message: 'Chat provider returned an empty answer.' });
    return res.status(200).json({ success: true, answer, model: payload.model || (usingGroq ? 'qwen/qwen3.6-27b' : 'openrouter/free'), language: selectedLanguage });
  } catch (error) { return res.status(502).json({ success: false, message: error.message || 'Chat provider unavailable.' }); }
}
