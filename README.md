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
