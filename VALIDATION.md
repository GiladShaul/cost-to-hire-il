# Validation record — CostToHire IL

Date: 2026-08-13. Evidence is from live URLs, not invented demand. Captures also live under the session scratch `validation/` folder.

## Legal from Israel

| Claim | Source | What it shows |
|---|---|---|
| Small information businesses can start as Osek Patur under an annual ceiling near ILS 120,000–122,833 | https://invoicedataextraction.com/blog/israel-osek-patur-osek-murshe-invoicing · https://beancount.io/it/blog/2026/08/04/osek-patur-osek-murshe-israel-freelancer-registration-thresholds-guide · https://www.neto.work/en/neto-vs-osek-patur-2026/ | Patur is VAT-exempt, cannot issue a tax invoice, and must convert when the ceiling is crossed. Year-one ILS 5,000 / month net (≈ ILS 65k) fits under the ceiling. ILS 100k / month does not, so the scale path names Osek Murshe / a company. |
| This product is arithmetic on published rates, not a licensed payroll bureau | Engine in `src/employerCost.js` plus the on-page disclaimer | No filing, no client funds, no “advice” claim. |

## Reachable customer path

| Claim | Source | What it shows |
|---|---|---|
| Foreign companies already pay to understand Israel employer cost | https://www.deel.com/blog/employer-costs-for-an-employee-in-israel/ (updated 9 Jun 2026) | Deel publishes a 2026 Israel employer-cost guide and sells EOR. A ₪149 briefing is a cheap step before that conversation. |
| Israeli operators already use employer-cost calculators | https://www.shekelgroup.co.il/calculator/%D7%97%D7%99%D7%A9%D7%95%D7%91-%D7%A2%D7%9C%D7%95%D7%AA-%D7%9E%D7%A2%D7%A1%D7%99%D7%A7/ · https://www.hilan.co.il/ | Demand for “עלות מעסיק” is real. Those tools are free lead-gens for payroll bureaus — they prove the query, not that a dated English briefing cannot be sold. |
| English SEO inventory exists | Queries such as “employer costs for an employee in Israel” already have commercial pages (Deel, Papaya, CXC, Niural) | Reachable without paid ads, over 3–6 months, via the same intent. |

## Rates used in the offer are real

| Figure | Value | Source |
|---|---|---|
| Reduced NI threshold | ILS 7,703 from 1 Jan 2026 | https://www.btl.gov.il/English%20Homepage/Insurance/Ratesandamount/Pages/forSalaried.aspx |
| NI ceiling | ILS 51,910 from 1 Jan 2026 | same |
| Employer NI reduced / full | 4.51% / 7.6% | same + Hebrew table https://www.btl.gov.il/Insurance/Rates/Pages/%D7%9C%D7%A2%D7%95%D7%91%D7%93%D7%99%D7%9D%20%D7%A9%D7%9B%D7%99%D7%A8%D7%99%D7%9D.aspx |
| Pension order | 6.5% employer tagmulim, 6% employee, 6% severance minimum | https://www.kolzchut.org.il/he/%D7%97%D7%95%D7%91%D7%AA_%D7%91%D7%99%D7%98%D7%95%D7%97_%D7%A4%D7%A0%D7%A1%D7%99%D7%95%D7%A0%D7%99_%D7%9C%D7%A2%D7%95%D7%91%D7%93%D7%99%D7%9D |
| Section 14 reserve | 8.33% | same cluster of employer-cost guides; offered as a toggle, not as “the law says 8.33% always” |
| Minimum wage | ILS 6,443.85 from 1 Apr 2026 | https://www.btl.gov.il/Mediniyut/GeneralData/Pages/%D7%A9%D7%9B%D7%A8%20%D7%9E%D7%99%D7%A0%D7%99%D7%9E%D7%95%D7%9D.aspx |
| Personal-import rules (rejected model) | $75 exemption; 18% VAT in the $75–$500 band | https://www.gov.il/en/pages/customs-personal-import-general-info · https://www.kolzchut.org.il/he/זכותון_בנושא_יבוא_אישי_(חבילות_מחו"ל) |

## Consistency with ILS 5,000 / 3–6 month math

- A ₪149 digital briefing at 40 sales, or 28 briefings + 18 Pro seats at ₪99, clears ILS 5,000 net after ~8% MoR fees (`DESIGN.md`).
- Deel and the Hebrew payroll calculators show the intent exists. They do not prove our conversion rate. The 3% calculator → paid assumption is a planning figure, which is why the site ships a working free tool first and treats checkout KYC as an owner task rather than pretending money is already flowing.

No pivot is required. Model B (import) was rejected because the state already ships a free personal-import calculator and 2026 thresholds moved three times.

## Claude

See `docs/claude-consult.md`.
