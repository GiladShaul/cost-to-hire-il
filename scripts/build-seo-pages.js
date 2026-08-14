#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const EmployerCost = require("../src/employerCost");
const { getSeoPages } = require("../src/seoPages");

const root = path.join(__dirname, "..");
const rates = JSON.parse(fs.readFileSync(path.join(root, "src", "rates.json"), "utf8"));
const origin = "https://cost.vinesautomation.com";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function ils(amount) {
  return "₪" + Number(amount).toFixed(2);
}

function pageHtml(page, result) {
  const he = page.lang === "he";
  const calcHref =
    "./index.html?gross=" +
    encodeURIComponent(page.grossIls) +
    "&role=" +
    encodeURIComponent(page.role) +
    (he ? "&lang=he" : "");
  const sections = page.sections
    .map(function (section) {
      return (
        "<h2>" +
        escapeHtml(section.heading) +
        "</h2><p>" +
        escapeHtml(section.body) +
        "</p>"
      );
    })
    .join("");
  return `<!DOCTYPE html>
<html lang="${he ? "he" : "en"}" dir="${he ? "rtl" : "ltr"}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.description)}">
  <link rel="canonical" href="${origin}/${page.slug}.html">
  <link rel="stylesheet" href="styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Hebrew:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Serif:ital,wght@0,500;1,400&display=swap" rel="stylesheet">
</head>
<body>
  <div class="wrap">
    <header class="top">
      <div class="brand"><a href="./index.html">CostToHire IL</a><strong>${he ? "העלות השקלית של העסקה" : "The shekel cost of a hire"}</strong></div>
    </header>
    <article class="legal">
      <h1>${escapeHtml(page.h1)}</h1>
      <p class="lede">${escapeHtml(page.lede)}</p>
      <p class="price-pill">${he ? "עלות מעסיק מחושבת" : "Computed employer cost"} <strong>${ils(result.totalEmployerCostIls)}</strong> / ${he ? "חודש" : "month"}</p>
      <p>${he ? "ברוטו" : "Gross"} ${ils(page.grossIls)} · ${he ? "תפקיד" : "role"} ${escapeHtml(page.role)} · ${he ? "עלות נלווית" : "on-cost"} ${ils(result.oncostIls)} · ${he ? "העמסה" : "load"} ${(result.loadRatio * 100).toFixed(1)}% · ${he ? "שיעורים נכון ל" : "rates as of"} ${escapeHtml(rates.asOf)}</p>
      ${sections}
      <p><a class="buy" href="${calcHref}#buy">${he ? "פתחו את המחשבון עם השכר הזה" : "Open the calculator with this salary"}</a></p>
      <p class="fine">${he ? "הערכה מידעית בלבד. זה אינו ייעוץ חשבונאי, משפטי, שכר או מס." : "Informational estimate. Not accounting, legal, payroll, or tax advice."}</p>
    </article>
    <nav class="legal">
      <p>${he ? "עוד מדריכים" : "More guides"}:
        <a href="./hire-in-israel-2026.html">Hire in Israel 2026</a> ·
        <a href="./employer-cost-software-engineer-israel.html">Software engineer</a> ·
        <a href="./employer-cost-first-hire-israel.html">First hire</a> ·
        <a href="./alut-maasik-2026.html">עלות מעסיק</a>
      </p>
    </nav>
  </div>
</body>
</html>
`;
}

function sitemapXml(pages) {
  const urls = ["", "embed.html"].concat(pages.map(function (page) { return page.slug + ".html"; }));
  const body = urls
    .map(function (rel) {
      return "  <url><loc>" + origin + "/" + rel + "</loc></url>";
    })
    .join("\n");
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + body + "\n</urlset>\n";
}

function embedHtml() {
  const ratesJson = fs.readFileSync(path.join(root, "src", "rates.json"), "utf8");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CostToHire IL embed</title>
  <link rel="stylesheet" href="styles.css">
  <style>body{min-height:0}.wrap{width:min(520px,calc(100% - 16px));padding:12px 0 24px}.hero{grid-template-columns:1fr;margin-top:12px}</style>
</head>
<body>
  <div class="wrap">
    <div class="brand">CostToHire IL<strong>The shekel cost of a hire</strong></div>
    <form class="form-card" id="calc-form">
      <label><span>Monthly gross salary (ILS)</span><input id="gross" type="number" min="1" value="18000"></label>
      <label><span>Role</span><input id="role" type="text" value="First Israeli hire"></label>
      <input id="seniority" type="hidden" value="0">
      <input id="travel" type="hidden" value="0">
      <select id="severance" hidden><option value="section14" selected>section14</option></select>
      <select id="pension-base" hidden><option value="gross" selected>gross</option></select>
      <input id="havraa" type="checkbox" checked hidden>
      <input id="hishtalmut" type="checkbox" hidden>
      <p id="calc-error" class="error" hidden></p>
    </form>
    <div class="stub" id="stub">
      <div class="stub-kicker">Employer stub</div>
      <div id="rates-as-of"></div>
      <div class="stamp" id="total-stamp">—</div>
      <div class="stub-meta"><span>On-cost</span><span id="result-oncost">—</span></div>
      <div class="stub-meta"><span>Annual</span><span id="result-annual">—</span></div>
      <div id="result-lines"></div>
    </div>
    <p><a class="buy" href="${origin}/?gross=18000" target="_blank" rel="noopener">Open full calculator</a></p>
  </div>
  <script type="application/json" id="rates-data">
${ratesJson}
  </script>
  <script src="src/offer.js"></script>
  <script src="src/employerCost.js"></script>
  <script src="src/briefing.js"></script>
  <script src="src/paddleConfig.js"></script>
  <script src="app.js"></script>
</body>
</html>
`;
}

function main() {
  fs.writeFileSync(path.join(root, "embed.html"), embedHtml(), "utf8");
  process.stdout.write("wrote embed.html\n");
  const pages = getSeoPages();
  pages.forEach(function (page) {
    const result = EmployerCost.computeEmployerCost(
      {
        grossIls: page.grossIls,
        roleLabel: page.role,
        locale: page.lang,
        seniorityYears: 0,
        severanceMode: "section14",
        pensionBaseMode: "gross",
      },
      rates
    );
    const file = path.join(root, page.slug + ".html");
    fs.writeFileSync(file, pageHtml(page, result), "utf8");
    process.stdout.write("wrote " + path.basename(file) + " total=" + result.totalEmployerCostIls + "\n");
  });
  fs.writeFileSync(path.join(root, "sitemap.xml"), sitemapXml(pages), "utf8");
  fs.writeFileSync(
    path.join(root, "robots.txt"),
    "User-agent: *\nAllow: /\nSitemap: " + origin + "/sitemap.xml\n",
    "utf8"
  );
}

main();
