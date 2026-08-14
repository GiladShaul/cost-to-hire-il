# Owner Tasks

This file lists only actions that require the living owner, account holder, or an explicitly authorized professional. The agent continues all other work while these remain open.

Do not put passwords, government identifiers, identity documents, payment details, or private credentials in this repository.

## Task status

| Status | Meaning |
|---|---|
| Open | The trigger has occurred and owner action is now useful. |
| Waiting | The agent must first produce a named input, or a later commercial trigger. |
| Complete | The owner confirmed completion and any necessary non-secret result was recorded. |

## Current owner action

Do **Step 1** this afternoon. Do **Step 2** this week. Acquisition pages and community drafts are already built; they do not wait on you.

---

## Step 1 — Verify live Paddle checkout

- **Status:** Open
- **Needed by:** Before sending traffic or taking a real card.
- **Time:** about 10 minutes.
- **Why you:** only you can change Paddle Checkout settings and website approval.

### Do this

1. Open the live site: https://cost.vinesautomation.com/
2. Enter any salary (the default is fine) and click **Pay and download the briefing**.
3. **If the Paddle overlay opens:** Step 1 is done. Close the overlay. Do **not** pay with a real card unless you want a live test sale.
4. **If you see an error or nothing happens:** stay in the **live** Paddle dashboard (not Sandbox) and:
   1. Go to **Checkout → Checkout settings → Default payment link**.
   2. Set it to `https://cost.vinesautomation.com` and save.
   3. Go to **Checkout → Website approval**.
   4. Add `cost.vinesautomation.com` if it is missing.
   5. Wait until the status is **Approved**.
   6. Repeat step 2 on the live site.
5. Open **Catalog → Products** → the briefing product → **Prices**.
   - Confirm the live price is about **USD 40** if you still want this to match a ₪149 product.
   - If it is **USD 149**, change it to about **USD 40** (₪149). Tell the agent the new amount only — not keys.

### Return to the agent

One line, no secrets:

- `overlay: opened` or `overlay: error` (paste the on-screen words, not a screenshot of keys)
- `website approval: approved / pending`
- `paddle price: $__`

### Blocking effect

Blocks confidence that a stranger can pay. Does not block the calculator, SEO pages, or preview briefing.

---

## Step 2 — Open the Israeli tax files

- **Status:** Open
- **Needed by:** Before treating the first Paddle payout as spendable income.
- **Why you:** only the living owner can open VAT and income-tax files. This file is not tax advice.

### Do this

1. Book a short session with an Israeli accountant (the ₪400 reserve in `DESIGN.md` is for this).
2. Show them: this is an information product sold through **Paddle** (merchant of record), priced in **USD**, site at `cost.vinesautomation.com`.
3. Ask them to confirm whether the activity can start as **Osek Patur** (turnover under the current ~₪120,000–122,833 ceiling) or must be **Osek Murshe**.
4. Open the files they specify:
   - VAT (Ma’am) — Patur or Murshe
   - Income tax
   - National Insurance as a self-employed activity, if they say it is required
5. Do **not** put your tax ID, address, or login codes in this repository.

### Return to the agent

Non-secret only:

- Classification: `Patur` or `Murshe`
- Effective date
- Whether you charge VAT on the public price
- Allowed receipt type (Paddle invoice only / Israeli kabala / other)

### Blocking effect

Does not block building, SEO, or Paddle taking a card. Blocks treating received money as cleared business income and blocks filling the public seller block on the terms page (Step 4).

---

## Other tasks

### 3. Custom domain

- **Status:** Complete
- **Owner action:** Pointed the existing Cloudflare domain at the product. Public hostname is `cost.vinesautomation.com`.
- **Blocking effect:** None.

### 4. Legal seller details for the public terms

- **Status:** Waiting
- **Trigger:** Step 2 produces a classification.
- **Owner action:** Provide the public-facing seller name, business identifier, service address, and a business contact route through a channel that is appropriate for identity information. Do not commit those identifiers to git.
- **Return to the agent:** The exact wording that may appear on the terms page.
- **Blocking effect:** Blocks the production seller block on the terms page. Does not block the calculator or checkout overlay.

### 5. Reconcile tax treatment as money arrives

- **Status:** Waiting
- **Trigger:** First paid sale, each month-end, and when forecast annual gross reaches 75% of the current Osek Patur ceiling.
- **Owner action:** Reconcile Paddle receipts, fees, refunds, and FX with the accountant. Confirm before switching to Osek Murshe.
- **Return to the agent:** Non-secret monthly totals and the confirmed status.
- **Blocking effect:** Blocks continued selling only if the accountant says the current registration is no longer valid.
