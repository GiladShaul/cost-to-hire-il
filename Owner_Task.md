# Owner Tasks

This file lists only actions that require the living owner, account holder, or an explicitly authorized professional. The agent continues all other work while these remain open.

Do not put passwords, government identifiers, identity documents, payment details, or private credentials in this repository.

## Task status

| Status | Meaning |
|---|---|
| Open | The trigger has occurred and owner action is now useful. |
| Waiting | The agent must first produce a named input, or a later commercial trigger. |
| Complete | The owner confirmed completion and any necessary non-secret result was recorded. |

## Required tasks

### 1. Open the Israeli tax files

- **Status:** Open
- **Needed by:** Before accepting the first paid briefing.
- **Owner action:** Confirm with an accountant whether this information product is eligible for Osek Patur. Open the VAT and income-tax files, and check National Insurance registration for a self-employed activity. Do not treat this file as tax advice.
- **Return to the agent:** Non-secret classification (Patur / Murshe), effective date, whether VAT is charged, and allowed receipt types.
- **Blocking effect:** Does not block the public calculator or sample briefing. Blocks keeping paid revenue.

### 2. Create the merchant-of-record account

- **Status:** Complete
- **Owner action:** Live Paddle account is connected. Client-side token and price `pri_01kzzgz4k6v40cseed86rhs3pr` are on the site. Catalog charge is USD.
- **Return to the agent:** Paddle live token and price ID received. No secrets stored beyond the publishable client token.
- **Blocking effect:** None for opening checkout. If Paddle shows a domain error, approve `cost.vinesautomation.com` under Checkout → Website approval and set it as the default payment link.

### 3. Custom domain

- **Status:** Complete
- **Owner action:** Pointed the existing Cloudflare domain at the product. Public hostname is `cost.vinesautomation.com`. No new domain was purchased.
- **Return to the agent:** DNS CNAME for `cost` → `giladshaul.github.io` is live.
- **Blocking effect:** None.

### 4. Legal seller details for the public terms

- **Status:** Waiting
- **Trigger:** Task 1 produces a classification and Task 2 is in progress.
- **Owner action:** Provide the legally required seller name, business identifier, service address, and a business contact route through a channel that is appropriate for identity information. Do not commit those identifiers to git.
- **Return to the agent:** Confirmation that the public terms may name the business; send the exact public-facing wording only.
- **Blocking effect:** Blocks filling the production seller block on the terms page. Does not block the calculator.

### 5. Reconcile tax treatment as money arrives

- **Status:** Waiting
- **Trigger:** First paid sale, each month-end, and when forecast annual gross reaches 75% of the current Osek Patur ceiling.
- **Owner action:** Reconcile receipts, fees, refunds, and FX. Confirm with an accountant before switching to Osek Murshe or changing VAT treatment. Plan the Murshe / company step before any ILS 1,500 / month firm contract.
- **Return to the agent:** Non-secret monthly totals and the confirmed status.
- **Blocking effect:** Blocks continued selling only if the accountant says the current registration is no longer valid.

## Current owner action

**Task 1** is still open (Israeli tax files). Checkout can take a card through Paddle. Keeping the revenue still needs the tax classification.
