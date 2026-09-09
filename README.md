# KhetSetu

KhetSetu is a crop-market intelligence and transaction workspace for farmers, FPOs, buyers, quality partners, storage partners and logistics partners.

## Run locally

```bash
npm install
npm run dev
```

The local development server also serves the project API routes, including authentication, market intelligence and payment intent endpoints.

## Payment flow

The app creates a UPI payment request, displays a scannable QR code, and records the confirmed payment against its trade transaction. It defaults to `TEST_UPI` so a demo cannot capture real money. Set `PAYMENT_GATEWAY_PROVIDER`, `UPI_COLLECT_VPA`, and provider credentials in the deployment environment before enabling a real merchant payment gateway.
# Telegram notifications

Set `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME`, `TELEGRAM_WEBHOOK_SECRET`, and `APP_BASE_URL` as server-side Vercel environment variables. Never expose the bot token through a `VITE_` variable.

After deployment, register the webhook once:

```bash
curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://your-project.vercel.app/api/notifications/telegram/webhook","secret_token":"your_webhook_secret","allowed_updates":["message"]}'
```

Users can then open their profile menu, select **Notification settings**, and connect Telegram. Connection links expire after 15 minutes. The bot supports `/start`, `/status`, `/notifications`, `/help`, and `/stop`.
