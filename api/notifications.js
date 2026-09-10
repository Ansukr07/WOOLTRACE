import crypto from 'crypto';
import mongoose from 'mongoose';
import connectToDatabase from './_utils/db.js';
import User from './_models/User.js';
import NotificationLog from './_models/NotificationLog.js';
import { notifyUser, sendTelegram } from './_utils/telegram.js';
import { getApiRoute, handleCors } from './_utils/http.js';

const publicPreferences = (user) => ({
  telegram: {
    enabled: Boolean(user.notifications?.telegram?.enabled),
    connected: Boolean(user.notifications?.telegram?.chatId || process.env.TELEGRAM_CHAT_ID),
    fixedDemoChat: Boolean(!user.notifications?.telegram?.chatId && process.env.TELEGRAM_CHAT_ID),
    connectedAt: user.notifications?.telegram?.connectedAt || null,
  },
  whatsapp: { enabled: Boolean(user.notifications?.whatsapp?.enabled), phone: user.notifications?.whatsapp?.phone || '' },
  inApp: { enabled: user.notifications?.inApp?.enabled !== false },
});

const ensureNotifications = (user) => {
  user.notifications = user.notifications || {};
  user.notifications.telegram = user.notifications.telegram || { enabled: false, chatId: null, connectedAt: null };
  user.notifications.whatsapp = user.notifications.whatsapp || { enabled: false, phone: null };
  user.notifications.inApp = user.notifications.inApp || { enabled: true };
};

async function requestUser(req) {
  const id = req.headers['x-user-id'];
  const email = req.headers['x-user-email'];
  if (email) {
    const byEmail = await User.findOne({ email: String(email).toLowerCase() });
    if (byEmail) return byEmail;
  }
  if (id && mongoose.isValidObjectId(id)) return User.findById(id);
  return null;
}

const commandText = (command, user) => {
  if (command === '/status') return `🌾 KhetSetu account status\n\nName: ${user.name}\nRole: ${user.role}\nTelegram notifications: ${user.notifications?.telegram?.enabled ? 'Enabled' : 'Paused'}`;
  if (command === '/notifications') return 'Notification settings:\n\n✅ Important updates\n✅ Payments\n✅ Logistics\n✅ Quality\n✅ Offers\n\nManage detailed preferences on the KhetSetu website.';
  return 'KhetSetu bot commands:\n/status — account connection\n/notifications — notification settings\n/stop — pause notifications\n/help — show this help';
};

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  try {
    await connectToDatabase();
    const url = getApiRoute(req);

    if (url.includes('/telegram/webhook')) {
      if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });
      const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
      if (!expected) return res.status(503).json({ message: 'TELEGRAM_WEBHOOK_SECRET is not configured' });
      if (req.headers['x-telegram-bot-api-secret-token'] !== expected) return res.status(401).json({ message: 'Invalid webhook secret' });
      const message = req.body?.message;
      const chatId = message?.chat?.id ? String(message.chat.id) : null;
      const text = String(message?.text || '').trim();
      if (!chatId || !text) return res.status(200).json({ ok: true });

      if (text.startsWith('/start')) {
        const token = text.split(/\s+/)[1];
        const user = token ? await User.findOne({ telegramLinkToken: token, telegramLinkExpiresAt: { $gt: new Date() } }).select('+telegramLinkToken +telegramLinkExpiresAt') : null;
        if (!user) {
          await sendTelegram(chatId, 'This KhetSetu connection link is invalid or expired. Generate a new link from Settings → Notifications.');
          return res.status(200).json({ ok: true });
        }
        user.notifications = user.notifications || {};
        user.notifications.telegram = { enabled: true, chatId, connectedAt: new Date() };
        user.notifications.inApp = user.notifications.inApp || { enabled: true };
        user.telegramLinkToken = undefined;
        user.telegramLinkExpiresAt = undefined;
        await user.save();
        await sendTelegram(chatId, `🌾 Welcome to KhetSetu, ${user.name}.\n\nTelegram connected successfully. You will now receive important trade, payment, quality, storage and logistics updates here.`);
        return res.status(200).json({ ok: true });
      }

      const user = await User.findOne({ 'notifications.telegram.chatId': chatId });
      if (!user) return res.status(200).json({ ok: true });
      const command = text.split(/\s+/)[0].split('@')[0].toLowerCase();
      if (command === '/stop') {
        user.notifications.telegram.enabled = false;
        await user.save();
        await sendTelegram(chatId, 'Telegram notifications paused.\n\nYou can reconnect them anytime from KhetSetu Settings.');
      } else if (['/status', '/notifications', '/help'].includes(command)) {
        await sendTelegram(chatId, commandText(command, user));
      }
      return res.status(200).json({ ok: true });
    }

    const user = await requestUser(req);
    if (!user) return res.status(401).json({ message: 'Sign in with a server-backed KhetSetu account to manage notifications.' });
    ensureNotifications(user);

    if (url.includes('/preferences')) {
      if (req.method === 'GET') return res.status(200).json(publicPreferences(user));
      if (req.method !== 'PUT') return res.status(405).json({ message: 'Method Not Allowed' });
      const next = req.body || {};
      if (typeof next.telegram?.enabled === 'boolean') user.notifications.telegram.enabled = next.telegram.enabled && Boolean(user.notifications.telegram.chatId || process.env.TELEGRAM_CHAT_ID);
      if (typeof next.inApp?.enabled === 'boolean') user.notifications.inApp.enabled = next.inApp.enabled;
      if (typeof next.whatsapp?.enabled === 'boolean') user.notifications.whatsapp.enabled = next.whatsapp.enabled;
      if (typeof next.whatsapp?.phone === 'string') user.notifications.whatsapp.phone = next.whatsapp.phone;
      await user.save();
      return res.status(200).json(publicPreferences(user));
    }

    if (url.includes('/telegram/connect')) {
      if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });
      if (process.env.TELEGRAM_CHAT_ID) {
        user.notifications.telegram.enabled = true;
        await user.save();
        return res.status(200).json({ connected: true, fixedDemoChat: true });
      }
      const username = String(process.env.TELEGRAM_BOT_USERNAME || '').replace(/^@/, '');
      if (!username) return res.status(503).json({ message: 'TELEGRAM_BOT_USERNAME is not configured.' });
      const token = crypto.randomBytes(24).toString('hex');
      user.telegramLinkToken = token;
      user.telegramLinkExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();
      return res.status(200).json({ url: `https://t.me/${username}?start=${token}`, expiresInSeconds: 900 });
    }

    if (url.includes('/telegram/disconnect')) {
      if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });
      user.notifications.telegram = { enabled: false, chatId: null, connectedAt: null };
      await user.save();
      return res.status(200).json(publicPreferences(user));
    }

    if (url.includes('/telegram/test')) {
      if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });
      if (!user.notifications.telegram?.chatId && !process.env.TELEGRAM_CHAT_ID) return res.status(409).json({ message: 'Set TELEGRAM_CHAT_ID or connect Telegram before sending a test.' });
      const sent = await notifyUser(user, {
        eventType: 'TELEGRAM_TEST',
        title: 'Telegram test',
        message: `✅ Telegram is connected to KhetSetu, ${user.name}.\n\nImportant account updates will arrive here.`,
        idempotencyKey: `telegram:test:${user._id}:${Date.now()}`,
        force: true,
      });
      return res.status(200).json({ ok: sent?.status === 'SENT', notification: sent });
    }

    if (url.includes('/history')) {
      if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });
      return res.status(200).json(await NotificationLog.find({ userId: String(user._id) }).sort({ createdAt: -1 }).limit(50));
    }

    if (url.includes('/events')) {
      if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });
      const { eventType, title, message, idempotencyKey } = req.body || {};
      if (!eventType || !message || !idempotencyKey) return res.status(400).json({ message: 'eventType, message and idempotencyKey are required.' });
      if (user.notifications?.inApp?.enabled !== false) {
        await NotificationLog.findOneAndUpdate(
          { idempotencyKey: `inapp:${idempotencyKey}` },
          { $setOnInsert: { userId: String(user._id), channel: 'IN_APP', eventType, title, message, status: 'SENT', sentAt: new Date() } },
          { upsert: true, new: true }
        );
      }
      const telegram = await notifyUser(user, { eventType, title, message, idempotencyKey: `telegram:${idempotencyKey}` });
      return res.status(202).json({ ok: true, telegram });
    }

    return res.status(404).json({ message: 'Notification endpoint not found' });
  } catch (error) {
    console.error('Notification API error:', error);
    return res.status(500).json({ message: error.message });
  }
}
