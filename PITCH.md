# KhetSetu — Market Intelligence to Market Action

## One-line pitch

KhetSetu helps farmers and FPOs decide when and where to sell, connect with the right buyer, and complete a transparent, payment-ready trade from one mobile-first workflow.

## The problem

Smallholder farmers often make a high-value selling decision with incomplete information. The current mandi price may be visible in one place, buyer requirements in another, transport quotes over a phone call, and storage availability through informal contacts. Expected prices, arrival volumes, payment reliability and buyer credentials are difficult to compare.

That information asymmetry creates predictable outcomes:

- distress selling immediately after harvest;
- weak bargaining power and poor price realisation;
- fragmented buyer connections and repeated phone-based negotiation;
- avoidable transport, storage and post-harvest costs;
- uncertainty about quality acceptance and payment release.

Buyers face the reverse problem: they cannot easily find consistent farmer/FPO volumes, compare quality, verify provenance, or coordinate pickup and payment across multiple sellers.

## The solution

KhetSetu turns fragmented market signals into a guided transaction workflow:

1. Compare nearby mandi, direct buyer and institutional signals.
2. See price direction, arrivals, buyer demand and estimated net realisation.
3. Get a sale-window recommendation based on price, demand, storage and logistics.
4. Create a crop lot with quantity, variety, grade, origin and quality evidence.
5. Match the lot to buyer requirements and exchange digital offers.
6. Accept or counter an offer to create a transaction record.
7. Coordinate storage and logistics around the agreed lot.
8. Request payment by UPI QR, record the reference, confirm delivery, and retain a transparent dispute trail.

The product is deliberately crop-agnostic. Produce quality records, certifications, origin and QR verification remain supporting trust capabilities rather than the centre of the experience.

## Product walkthrough

### 1. Role-aware access

The sign-in and registration flow separates the workspaces that have different jobs:

- **Farmer / FPO** — market intelligence, sale timing, demand, lots, offers, trade and payments.
- **Buyer** — procurement demand, matched lots, offers, orders and payments.
- **Quality partner** — grading and quality certificates.
- **Storage partner** — capacity, requests, check-in and release operations.
- **Logistics partner** — collection, dispatch and shipment tracking.

After authentication, each role lands on its own protected route. A buyer cannot be mistaken for a farmer because the dashboard, navigation and workflow are separate.

### 2. Farmer market intelligence

The farmer navigation is organised as focused destinations instead of one overloaded dashboard:

- `/farmer/market/overview` — mandi and channel comparison for the selected crop;
- `/farmer/market/discovery` — net realisation calculator and sale decision;
- `/farmer/market/trends` — price direction and arrivals;
- `/farmer/market/buyers` — current buyer demand and requirements;
- `/farmer/market/lots` — sell lots and FPO aggregation;
- `/farmer/market/offers` — offers and negotiation;
- `/farmer/market/transactions` — delivery, payment and settlement;
- `/farmer/market/disputes` — commercial grievance records.

Legacy `?tab=` links are automatically redirected to the equivalent focused route, so bookmarks continue to work without bringing back the cluttered layout.

### 3. Price discovery and sale timing

For a selected commodity and grade, KhetSetu compares:

- regulated mandi benchmark;
- direct buyer / processor quote;
- institutional procurement;
- digital buyer or export channel.

The comparison includes price per kilogram, distance, transport rate, payment terms, reliability and minimum lot size. The net-realisation calculation accounts for quantity, logistics, storage duration and platform fee. The sale-window advisory combines current price, recent average, storage cost and demand level to explain whether selling now, holding briefly or seeking a better channel is sensible.

### 4. Buyer demand and matching

Buyers publish a structured demand notice with crop, quantity, minimum grade, maximum price and delivery location. Farmers see the demand that matches their crop and quality. The matching engine scores crop fit, grade, quantity, price and origin so a farmer can prioritise the most actionable demand rather than browse an undifferentiated list.

### 5. Lot creation and FPO aggregation

The farmer can create a lot with:

- crop and variety;
- available quantity;
- asking price;
- quality grade;
- origin;
- linked batch / quality record where available.

FPO aggregation combines eligible farmer volumes into one bulk lot, retaining contributing farmer records and making larger institutional demand reachable. Creation is validated in the UI and stored in shared application state so the new lot appears immediately in the lots and buyer views.

### 6. Offers and negotiation

Buyers send a digital offer containing price, quantity, delivery terms and payment terms. Farmers can decline, counter or accept. Accepting the full offer creates a transaction with gross value, deductions, expected delivery, payment state and dispute state. This is the bridge from “marketplace feature” to transaction enablement.

### 7. Transaction and UPI payment

Every transaction records:

- lot and counterparty;
- agreed price and gross value;
- transport, storage and platform deductions;
- net realisation;
- delivery status;
- payment status, method, reference and timestamp;
- dispute status.

The **Pay by UPI** action creates a UPI deep link and renders a QR code. It works even when the optional local API bridge is unavailable: the browser creates a test-mode intent locally, so a 404 cannot prevent a QR from appearing. When the API is available, `/api/payments` creates and confirms the intent server-side. After confirmation, the transaction is updated to `PAID` with a KhetSetu payment reference.

The current build uses `TEST_UPI` and `khetsetu@upi` as a safe demonstration configuration. A live merchant gateway must be configured with deployment-only credentials before real funds are accepted.

### 8. Trust, logistics and grievances

Quality grade, certificate, origin and QR verification remain attached to the lot. Storage discovery compares capacity, condition and cost. Logistics is kept as a separate partner workflow for pickup and dispatch. If quality, quantity, payment or delivery differs from the agreement, either party can raise a dispute with a category, description, claimed amount and resolution state.

## AI-assisted experience

KhetSetu is AI-first at the decision layer, not AI as decoration.

- **Market advisor:** turns current prices, arrivals, demand, storage and transport context into a plain-language recommendation.
- **Sale-window reasoning:** explains the trade-off between selling today and carrying produce for a better window.
- **Requirement normalisation:** structured crop, grade and quantity fields make buyer demand machine-matchable.
- **Match scoring:** ranks lots against demand so farmers and buyers see the highest-probability connections first.
- **Negotiation context:** price, quantity, grade and delivery terms stay visible together when a counter-offer is made.
- **Trust evidence:** quality and provenance records give the model and the users a verifiable basis for recommendations.

The Gemini integration is server-side through the market-advisor API. Mandi/arrival integration is isolated behind the market data provider, allowing a production CEDA/Agmarknet credential to be added without changing the UI.

## Technical architecture

- **Frontend:** React 19, React Router, Vite, responsive CSS, Recharts, React Leaflet and `react-qr-code`.
- **Application state:** shared `GlobalStateContext` for lots, demands, offers, transactions, payments, disputes, batches, warehouses and logistics actions.
- **Authentication:** role-aware API login/register with local fallback for development; protected routes redirect to the correct role home.
- **Local API bridge:** Vite mounts the project API handlers during development so authentication, market intelligence, AI advice and payments can be exercised from the same origin.
- **Backend routes:** `api/login.js`, `api/register.js`, `api/market.js`, `api/ai/market-advisor.js`, and `api/payments.js`.
- **Persistence:** MongoDB is supported through the existing model layer; browser state is used for the interactive demo and filtered to remove stale legacy records from the active market views.
- **Security boundary:** secrets belong in `.env.local` / deployment variables and are never exposed to client bundles or committed to Git.

## Eight-minute demo pitch

### 0:00–0:45 — Open with the farmer decision

“A farmer is not just looking for a price. They need to know which market will leave them with the best net realisation after transport and storage, whether a buyer can take their grade and volume, and whether payment will actually be recorded. Today those answers are fragmented. KhetSetu brings them into one guided trade workflow.”

Show the landing page briefly, then sign in as **Farmer / FPO**.

### 0:45–1:40 — Show role separation

Point to the farmer navigation: “This is not a generic feature dump. A farmer has a clear sequence: understand the market, decide when to sell, see demand, list a lot, negotiate and get paid.”

Sign out or use the role preview and sign in as **Buyer**. Show that the buyer lands on a different workspace with procurement demand, matched produce lots, offers and payments. Say: “The same platform serves the counterparty, but the information architecture follows their job.”

### 1:40–2:50 — Demonstrate market intelligence

Return to the farmer workspace and open **Market intelligence**. Select Wheat, Mustard or another crop. Explain the channel cards: “Here the farmer sees the mandi benchmark, direct buyer quote and institutional channel side by side, including distance, reliability and payment terms.”

Open **Price & sale timing**. Enter the intended quantity, grade, distance and storage months. Say: “The important number is not the headline price. KhetSetu estimates net farm-gate realisation after the costs that usually remain invisible.”

Open the AI advisor and read the recommendation: “The recommendation is grounded in the selected crop, price movement, arrivals, demand and carry cost. It tells the farmer what action to take and why.”

### 2:50–3:45 — Demonstrate buyer demand and matching

Open **Buyer demand**. Show a demand notice with crop, volume, minimum grade, price ceiling and delivery point. Explain: “A farmer no longer needs to call every buyer. Demand is structured and matchable.”

Switch to the buyer workspace and open **Buyer demand**. Publish a small demand notice. Then open **Matched produce lots**. Point out that the buyer sees crop, volume, grade, origin and asking price, not an opaque product tile.

### 3:45–4:50 — Create a lot and show FPO leverage

Return to the farmer workspace and open **Sell lots & FPO**. Click **Create sell lot**. Enter a crop, variety, quantity, price, grade and origin, then publish it.

Say: “The lot is now a transaction-ready object. It carries the commercial fields the buyer needs and can retain quality, origin and QR evidence.”

Open **Aggregate FPO lots** and explain: “Small volumes can be pooled into one bulk offer, improving buyer access and reducing fragmented logistics.”

### 4:50–5:45 — Offer and negotiation

Open **Offers & negotiation** as the farmer. Show the buyer, quantity, price and terms. Demonstrate **Counter-offer**, change the price, and submit.

Say: “Negotiation is recorded as a structured history. When the farmer accepts, KhetSetu creates the transaction instead of leaving the agreement in chat messages.”

Accept an offer and navigate to **Trade & payments**.

### 5:45–7:00 — Live UPI QR transaction demo

Choose a transaction with a pending payment and click **Pay by UPI**.

“This is the point where market intelligence becomes transaction enablement. KhetSetu creates a UPI payment request for the agreed gross value and renders a QR that any UPI app can scan.”

Show the amount, transaction reference and **Open UPI app** link. Click **I completed the UPI payment**. Point to the updated `PAID` state and payment reference.

Clarify: “The demo is intentionally test-mode. The integration boundary is already in place; a production merchant VPA and gateway credentials are the only deployment step required for live collection.”

### 7:00–7:35 — Delivery, trust and grievance

Click **Confirm delivery**. Show the delivery state update. Open **Quality & trust** to show the supporting batch identity, quality grade and QR verification. Open **Disputes** and explain that a quality mismatch, weight shortage, payment delay or transit issue can be recorded with evidence rather than handled informally.

### 7:35–8:00 — Close on outcomes

“KhetSetu reduces information asymmetry before the sale, transaction cost during the sale and uncertainty after the sale. Farmers get a better-informed sale window and stronger bargaining power. FPOs unlock aggregation. Buyers get consistent, verifiable supply. Every decision, offer, payment and grievance leaves a transparent record. That is the journey from market signal to trusted settlement.”

## Demo checklist

Before presenting:

- run `npm install` and `npm run dev`;
- verify the browser is on the current Vite port;
- use the role preview accounts shown on the login page;
- choose a crop with seeded lots and transactions;
- use a transaction with `PAYMENT_PENDING` for the QR demo;
- keep the QR modal visible long enough to scan or show the UPI URI;
- use `TEST_UPI` for judging unless a real merchant gateway is configured;
- confirm the browser viewport is narrow once to show the mobile navigation drawer.

## Production handoff

Configure these deployment variables on the server, never in the browser bundle:

```text
MONGO_URI=...
CEDA_API_TOKEN=...
GEMINI_API_KEY=...
PAYMENT_GATEWAY_PROVIDER=...
UPI_COLLECT_VPA=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

The current API payment route is a safe test gateway. Production work should add gateway order creation, signature/webhook verification, idempotency keys, refund handling, reconciliation and audit logging before live money movement.

## Current verification

- `npm run build` completes successfully.
- Farmer and buyer login responses resolve to different roles and protected home routes.
- UPI intent creation and confirmation work through the API bridge.
- UPI QR creation also works when the payment API returns 404, using the browser fallback.
- Legacy market query URLs redirect to focused route pages.
