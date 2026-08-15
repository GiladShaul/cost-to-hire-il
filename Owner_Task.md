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

## Step 1 — Unblock live Paddle checkout (and use HTTPS)

- **Status:** Open
- **Needed by:** Before a stranger can pay. This is why Pay currently says “Something went wrong.”
- **Why you:** only the Paddle account owner can approve the subdomain and set the default payment link.

Paddle will **not** open a live overlay on a subdomain until that exact host is approved. Approving `vinesautomation.com` is not enough. You must approve **`cost.vinesautomation.com`**.

### A. Always open the secure URL

Use this, including `https://`:

**https://cost.vinesautomation.com/**

Do **not** use `http://`, `www.cost.vinesautomation.com`, or the parked root `vinesautomation.com`. Those are different hosts. The calculator host already has a Let’s Encrypt certificate (valid to 12 Nov 2026). If the lock is missing, you are on the wrong URL.

### B. Paddle dashboard (live account, not Sandbox)

1. Open [Website approval](https://vendors.paddle.com/request-domain-approval) (**Checkout → Website approval**).
2. Click **Add a new domain** (or resubmit if they already rejected the root).
3. Enter **exactly** `cost.vinesautomation.com` — not `vinesautomation.com`, no `https://`, no path.
4. Submit and wait until status is **Approved**. Manual review can take several business days.
5. Open **Checkout → Checkout settings → Default payment link**.
6. Set it to **`https://cost.vinesautomation.com`** and save.

Paddle reviews the live site for: product description, price, what you get, and **visible links** to Terms of Service, Privacy Notice, and Refund Policy. Those three are now in the **header and footer** of https://cost.vinesautomation.com/ :

- https://cost.vinesautomation.com/terms.html
- https://cost.vinesautomation.com/privacy.html
- https://cost.vinesautomation.com/refund.html

Then **resubmit** `cost.vinesautomation.com` (the subdomain, not the root). Paddle does not inherit approval from `vinesautomation.com`.

### C. Retry Pay

Hard-refresh https://cost.vinesautomation.com/ and click **Pay and download the briefing** again.

- Overlay opens → write `overlay: opened` and `website approval: approved`.
- Still “Something went wrong” → copy the red **Paddle status** line on the page (not your password) and the Website approval status (`approved` / `pending` / `rejected`).

### D. Price check

**Catalog → Products → Prices.** If the amount is **$149**, change it to about **$40** so it matches a ₪149 product. Reply with `paddle price: $__` only.

### Blocking effect

Blocks live card checkout. Does not block the free calculator or preview briefing.

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
