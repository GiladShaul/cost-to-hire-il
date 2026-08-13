# Design: CostToHire IL

Standalone online information product, operated from Israel.

**Offer:** A free bilingual calculator of the fully loaded employer cost of hiring an employee in Israel, plus a dated, source-cited briefing (HTML, printable to PDF) sold for **ILS 149**.

Claude was consulted on 2026-08-13 (`claude -p`). It compared four candidates and selected this model. The consult note is in `docs/claude-consult.md`.

## Legal operation from Israel

This is an **information product**, not a regulated profession.

- It reprints published National Insurance, pension-order, convalescence, and minimum-wage figures and does arithmetic on user-entered salary inputs.
- It does **not** give tax, legal, payroll, or accounting advice.
- It does **not** file, submit, or represent anyone before an authority.
- It does **not** hold client funds or run payroll.
- It does **not** claim affiliation with ביטוח לאומי, רשות המסים, or משרד העבודה.
- Checkout, when the owner completes KYC, is through a merchant of record (Lemon Squeezy, Polar, or Paddle) so foreign VAT/sales tax is their problem. Israeli income-tax and VAT files remain the owner's.

Seller status for year one: **Osek Patur** is available if annual turnover stays under the 2026 ceiling (published around ILS 120,000–122,833). Osek Patur cannot issue a tax invoice and cannot charge VAT. Crossing the ceiling, or selling in a listed liberal profession, requires **Osek Murshe**. The ILS 100,000 / month path requires Osek Murshe or a company. That conversion is an owner task, not a product feature.

## Standalone

This is not a clone of the sibling Iceland travel affiliate, hotel affiliate, used-car dealer site, or API-docs drift watch. It is a new brand, engine, and customer.

## Why this model

| Model | Verdict |
|---|---|
| **A. Employer-cost briefing → SMB SaaS (chosen)** | Pure arithmetic on citable rates. Recurring (rates and headcount change). English-first buyers pay more than consumers. An agent can ship 100% of v1. |
| B. Personal-import / car landed cost | Official free calculator exists. Car tax needs model-level green scores. One-time consumer LTV. Sits closer to customs-broker positioning. |
| C. Accessibility statement generator | The money is certification, which we must not sell. Remainder is a commodity text generator. |
| D. Marketplace public-source audit | Requires the living owner in sales and delivery. Fails minimal-involvement and the ILS 100k path without hiring. |

## Itemized initial capital (ceiling ILS 1,000)

| Use | ILS | Notes |
|---|---:|---|
| GitHub Pages hosting | 0 | Public customer path |
| Domain `costtohireil.com` (optional, owner purchase) | 60 | One year, privacy on, no upsells. Reject if premium. |
| Merchant-of-record account | 0 | Setup is free; fees are a % of sales |
| Accountant consult reserve | 400 | Only if the owner wants a subsidized first-year classification check |
| Unallocated reserve | 540 | Do not spend on ads or inventory in v1 |
| **Total authorized** | **1,000** | Nothing is pre-spent by the agent |

No inventory. No paid ads required to start. No software licenses.

## Minimal owner involvement

After the owner finishes the identity items in `Owner_Task.md`, the living owner does **not** deliver briefings, answer salary questions, or rebuild the calculator.

Ongoing owner load, by design:

- Payment-account KYC once.
- Tax file / VAT classification once, then a monthly reconcile when money arrives.
- Optional: buy the domain.
- Optional: one 20-minute batch a week to send any account-bound message the agent drafted.
- Convert to Osek Murshe only when turnover approaches the Patur ceiling.

The agent owns rate updates (JSON + tests), SEO pages, briefing delivery, and the public site.

## Numeric path to ILS 5,000 monthly net in 3–6 months

Prices (VAT not charged while Osek Patur):

| SKU | Price | Delivery |
|---|---:|---|
| Free calculator | 0 | Instant, client-side |
| Briefing v1 | **149** | Instant HTML briefing |
| Pro (from month 3) | 99 / month | Unlimited saved scenarios |
| Agency | 390 / month | Client-branded exports |
| Firm / API | 1,500 / month | After Osek Murshe / company |

**Base case, month 5–6**

| Line | Qty | Unit ILS | Gross ILS |
|---|---:|---:|---:|
| One-off briefings | 28 | 149 | 4,172 |
| Pro subscriptions | 18 | 99 | 1,782 |
| **Gross** | | | **5,954** |
| MoR + card fees (~8%) | | | −476 |
| Hosting / domain / email | | | −80 |
| **Net** | | | **5,398** |

That is 46 paying actions. At a 3% free-calculator → paid conversion the site needs about 1,550 calculator runs that month. English high-intent pages (“cost to hire an employee in Israel 2026”, “employer cost Israel software engineer”) plus Hebrew “עלות מעסיק 2026” are the acquisition path. No paid ads inside the ILS 1,000 cap.

**Conservative alternate (no subscriptions yet):** 40 briefings × 149 = 5,960 − 477 fees − 80 infra = **5,403 net**.

Year-one run-rate at ILS 5,400 / month is ILS 64,800, under the Osek Patur ceiling.

These figures are a **design-and-validation target**, not a same-session P&L.

## Credible path toward ILS 100,000 monthly profit

Same rate engine, three stacked layers after the owner is Osek Murshe (or incorporated):

1. **Firm / API** at ILS 1,500 / month to EOR, global payroll, relocation, and accounting firms. 40 accounts = 60,000.
2. **Pro + Agency seats** at 99–390. 300 mixed seats ≈ 30,000.
3. **Country packs and a January rate-change report.** Same architecture, new `rates.json`. ≈ 10,000.

Trigger: open Osek Murshe before annual turnover nears 75% of the Patur ceiling. Incorporate before the first firm contract.

## Product shape

- `src/rates.json` — versioned statutory table with `source_url` and `effective_from`.
- `src/employerCost.js` — pure calculation.
- `src/briefing.js` — dated HTML/text/JSON pack.
- `src/cli.js` — real entry point (`calculate`, `briefing`, `offer`).
- `index.html` — public bilingual page. Classic scripts so `file:` still runs the calculator.

Free surface: line-item employer cost. Paid briefing: 12-month cash table, first-year vs steady-state, alternate severance, source appendix.

## Positioning rules

Must say: informational estimate; sources and dates on every figure; verify with a licensed accountant or payroll bureau.

Must never: advice, ruling, certification, compliance stamp; “accountant”, “רו״ח”, “יועץ מס”, “lawyer”, “customs broker” as a brand or byline; state emblems; holding client money; guaranteeing outcomes.

## Risks

1. **Stale or wrong rate.** One JSON file, unit tests against hand-checked examples, “rates as of” on every page, January review.
2. **Free Hebrew calculators.** Compete in English, sell the dated artifact, then the API.
3. **Traffic miss.** Seed relocation / EOR / Anglo-Israeli hiring communities; one firm account replaces ~10 briefings.
