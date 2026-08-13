# WoolTrace Brand Guidelines

## 1. Typography

### Primary Typeface

**Plus Jakarta Sans**

Use Plus Jakarta Sans as the primary typeface across the entire WoolTrace product.

It should be used for:

* Headings
* Body text
* Navigation
* Buttons
* Dashboard metrics
* Forms
* Tables
* Charts
* Labels
* Notifications
* Marketplace content

### Font Weights

| Weight       | Usage                                              |
| ------------ | -------------------------------------------------- |
| Regular 400  | Body text, descriptions, secondary information     |
| Medium 500   | Navigation, labels, buttons, metadata              |
| SemiBold 600 | Card titles, section headings                      |
| Bold 700     | Main headings, important metrics, primary emphasis |

### Typography Hierarchy

```text
Display
Plus Jakarta Sans Bold
Large hero statements

H1
Plus Jakarta Sans Bold
Major page headings

H2
Plus Jakarta Sans SemiBold
Section headings

H3
Plus Jakarta Sans SemiBold
Card headings

Body
Plus Jakarta Sans Regular
Descriptions and general content

Label
Plus Jakarta Sans Medium
Navigation, tags, metadata

Metric
Plus Jakarta Sans Bold
Prices, quantities, statistics
```

### Recommended Web Font

```css
font-family: "Plus Jakarta Sans", sans-serif;
```

Google Fonts:

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
```

---

# 2. Color Palette

## Primary Palette

### Ink Green

**HEX:** `#0B120D`

**RGB:** `11, 18, 13`

**CMYK:** `39, 0, 28, 93`

Primary brand color.

Use for:

* Primary backgrounds
* Navigation
* Headers
* Footer
* Primary text on light backgrounds
* Primary buttons
* High-contrast sections

This is the dominant WoolTrace color.

---

### Soft Lime

**HEX:** `#DDFF86`

**RGB:** `221, 255, 134`

**CMYK:** `13, 0, 47, 0`

Primary accent color.

Use for:

* CTAs
* Active states
* Important highlights
* Positive trends
* Selected navigation
* Key metrics
* Interactive elements

Use sparingly against Ink Green for maximum contrast.

---

### Light Sky Blue

**HEX:** `#BED5E5`

**RGB:** `190, 213, 229`

**CMYK:** `17, 7, 0, 10`

Secondary accent.

Use for:

* Information states
* Logistics
* Transportation
* Maps
* Secondary cards
* Charts
* Background highlights

---

### Soft Coral

**HEX:** `#FFAAA4`

**RGB:** `255, 164, 164`

**CMYK:** `0, 36, 36, 0`

Attention / secondary accent.

Use for:

* Alerts
* Important notifications
* Pending actions
* Marketplace highlights
* Warm visual accents
* Selected promotional elements

Do not use it as the dominant color.

---

### Warm Ivory

**HEX:** `#EDEDCE`

**RGB:** `237, 237, 206`

**CMYK:** `0, 0, 13, 7`

Primary warm background/accent.

Use for:

* Page sections
* Cards
* Empty states
* Educational sections
* Wool/fabric-related visual areas
* Soft backgrounds

---

# 3. Color Tokens

```css
:root {
  --color-ink-green: #0B120D;
  --color-soft-lime: #DDFF86;
  --color-sky-blue: #BED5E5;
  --color-soft-coral: #FFAAA4;
  --color-warm-ivory: #EDEDCE;

  --color-white: #FFFFFF;
  --color-black: #000000;
}
```

---

# 4. Recommended Color Roles

| UI Purpose      | Color                  |
| --------------- | ---------------------- |
| Primary brand   | Ink Green              |
| Primary CTA     | Soft Lime              |
| Primary text    | Ink Green              |
| Main background | Warm Ivory / Off-white |
| Information     | Light Sky Blue         |
| Attention       | Soft Coral             |
| Success         | Soft Lime              |
| Dark sections   | Ink Green              |
| Cards           | White / Warm Ivory     |
| Borders         | Low-opacity Ink Green  |
| Charts          | Brand palette          |

---

# 5. Brand Color Combinations

## Combination 01 — Primary

```text
Ink Green
+
Soft Lime
```

Use for the primary WoolTrace identity.

Example:

```text
┌─────────────────────────────┐
│                             │
│         WOOLTRACE            │
│                             │
│      [ Explore Market ]      │
│                             │
└─────────────────────────────┘
```

Ink Green background with Soft Lime CTA.

---

## Combination 02 — Natural

```text
Warm Ivory
+
Ink Green
+
Soft Lime
```

Use for the main application.

This should be the dominant dashboard combination.

---

## Combination 03 — Supply Chain

```text
Ink Green
+
Light Sky Blue
```

Use for:

* Logistics
* Tracking
* Transportation
* Maps
* Shipment screens

---

## Combination 04 — Marketplace

```text
Warm Ivory
+
Ink Green
+
Soft Lime
+
Soft Coral
```

Use Soft Coral sparingly for attention and marketplace actions.

---

# 6. Product-Specific Color Mapping

WoolTrace's colors should also communicate meaning.

### Farm

**Ink Green**

Represents:

* Agriculture
* Nature
* Production

### Wool / Quality

**Warm Ivory**

Represents:

* Wool
* Natural materials
* Craft
* Authenticity

### Market

**Soft Lime**

Represents:

* Opportunity
* Growth
* Positive price movement

### Logistics

**Light Sky Blue**

Represents:

* Movement
* Transportation
* Tracking
* Location

### Alerts / Attention

**Soft Coral**

Represents:

* Attention
* Pending action
* Important notification

---

# 7. UI Style

## Cards

Use:

```text
Border radius: 12–16px
Border: subtle
Shadow: subtle
Background: White / Warm Ivory
```

Avoid excessive floating cards.

Cards should feel structured and functional rather than decorative.

---

## Buttons

### Primary

```text
Background: Ink Green
Text: White
```

### Accent CTA

```text
Background: Soft Lime
Text: Ink Green
```

### Secondary

```text
Background: transparent
Border: Ink Green
Text: Ink Green
```

### Information

```text
Background: Light Sky Blue
Text: Ink Green
```

---

# 8. Visual Language

The visual language should communicate:

**Natural + Modern + Trusted + Connected + Traceable**

WoolTrace should visually communicate movement and continuity.

Use:

* Connected timelines
* Supply-chain paths
* Location markers
* Batch IDs
* QR codes
* Progress indicators
* Traceability maps
* Quality badges
* Clear status indicators

Avoid making the interface look:

* Too corporate
* Too agricultural
* Too playful
* Too futuristic
* Too government-portal-like
* Too much like a generic e-commerce platform

WoolTrace should feel like a modern technology platform built specifically for India's wool ecosystem.

---

# 9. Photography Direction

Use authentic imagery wherever photography is required.

Preferred imagery:

* Indian sheep farmers
* Sheep herds
* Wool shearing
* Raw wool
* Wool grading
* Textile processing
* Indian artisans
* Spinning
* Weaving
* Wool fabric
* Warehouses
* Rural landscapes
* Wool transportation

Photography should feel:

* Natural
* Documentary
* Warm
* Authentic
* Indian
* Human

Avoid generic Western stock photography where possible.

---

# 10. Iconography

Use a single consistent icon family.

Recommended:

**Lucide Icons**

Use icons for:

* Farm
* Sheep / livestock
* Wool
* Quality
* Marketplace
* Warehouse
* Transport
* Processing
* Education
* Analytics
* Users
* Notifications
* Location
* QR
* Payments
* Traceability

Do not mix multiple icon styles.

---

# 11. Brand Personality

WoolTrace should communicate:

### Trust

**"Your wool is verified."**

### Transparency

**"Know where your wool came from."**

### Empowerment

**"Farmers get better access to markets."**

### Connection

**"Every participant is connected."**

### Traceability

**"Follow every step from farm to fabric."**

### Progress

**"Traditional wool meets modern technology."**

---

# 12. Brand Statement

**WoolTrace**

### From Farm to Fabric.

**A connected digital ecosystem for India's wool industry.**

---

# 13. Brand Positioning

WoolTrace is not simply a wool marketplace.

It is a **Farm-to-Fabric digital ecosystem** that connects:

```text
Farmers
   ↓
Wool Producers
   ↓
Quality Inspectors
   ↓
Buyers / Sellers
   ↓
Warehouses
   ↓
Transporters
   ↓
Processing Units
   ↓
Artisans
   ↓
Fabric Producers
   ↓
Consumers
```

The platform combines:

* Wool management
* Market intelligence
* Quality assurance
* Trading
* Reverse bidding
* Logistics
* Warehousing
* Processing
* Education
* Traceability

into one connected system.

---

# 14. Design Principle

Every major screen should reinforce the central idea:

```text
FARM
 ↓
WOOL
 ↓
QUALITY
 ↓
MARKET
 ↓
LOGISTICS
 ↓
WAREHOUSE
 ↓
PROCESSING
 ↓
YARN
 ↓
FABRIC
```

The product should visually communicate that **WoolTrace connects and records the entire journey of wool.**

---

# 15. Signature Visual Motif

The **trace line** should become a recurring visual element throughout WoolTrace.

Use a subtle connected line to represent:

```text
🐑 Farm
   │
   ●
   │
🔬 Quality
   │
   ●
   │
🛒 Market
   │
   ●
   │
🚚 Transport
   │
   ●
   │
🏭 Processing
   │
   ●
   │
🧶 Fabric
```

This can appear in:

* Batch tracking
* Shipment tracking
* Order timelines
* Quality history
* Processing status
* QR verification
* Dashboard widgets

The trace line becomes a recognizable WoolTrace design element.

---

# 16. Brand Essence

### WOOLTRACE

**Trace. Trust. Trade. Transform.**

The platform gives wool a digital identity, creates transparency across the supply chain, and connects every participant from farm to fabric.
