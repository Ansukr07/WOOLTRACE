import NotificationLog from '../_models/NotificationLog.js';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function sendTelegram(chatId, text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not configured');
  let lastError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) throw new Error(body.description || `Telegram HTTP ${response.status}`);
      return body.result;
    } catch (error) {
      lastError = error;
      if (attempt === 0) await sleep(350);
    }
  }
  throw lastError;
}

export async function notifyUser(user, { eventType, title = '', message, idempotencyKey, force = false }) {
  const chatId = user?.notifications?.telegram?.chatId || process.env.TELEGRAM_CHAT_ID;
  if (!chatId || (!force && !user?.notifications?.telegram?.enabled)) return { skipped: true };
  if (idempotencyKey) {
    const existing = await NotificationLog.findOne({ idempotencyKey });
    if (existing) return existing;
  }
  let log;
  try {
    log = await NotificationLog.create({ userId: String(user._id), channel: 'TELEGRAM', eventType, title, message, status: 'PENDING', idempotencyKey });
  } catch (error) {
    if (error.code === 11000) return NotificationLog.findOne({ idempotencyKey });
    throw error;
  }
  try {
    const sent = await sendTelegram(chatId, message);
    log.status = 'SENT';
    log.providerMessageId = String(sent.message_id);
    log.sentAt = new Date();
  } catch (error) {
    log.status = 'FAILED';
    log.error = error.message;
  }
  await log.save();
  return log;
}
