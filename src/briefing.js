(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./employerCost"), require("./offer"));
  } else {
    root.Briefing = factory(root.EmployerCost, root.Offer);
  }
})(typeof self !== "undefined" ? self : this, function (EmployerCost, Offer) {
  "use strict";

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function ils(amount) {
    const n = Number(amount);
    const sign = n < 0 ? "-" : "";
    const abs = Math.abs(n).toFixed(2);
    return sign + "₪" + abs;
  }

  function pct(ratio) {
    return (ratio * 100).toFixed(1) + "%";
  }

  function filenameFor(input) {
    const gross = Math.round(Number(input.grossIls) || 0);
    return "cost-to-hire-il-" + gross + "-briefing.html";
  }

  function lineRows(result, locale) {
    return result.lines
      .map(function (line) {
        const label = locale === "he" ? line.labelHe : line.labelEn;
        return (
          "<tr><th scope=\"row\">" +
          escapeHtml(label) +
          "</th><td>" +
          ils(line.amountIls) +
          "</td></tr>"
        );
      })
      .join("");
  }

  function monthRows(months) {
    return months
      .map(function (row) {
        return (
          "<tr><td>" +
          row.month +
          "</td><td>" +
          ils(row.employerCostIls) +
          "</td><td>" +
          ils(row.runningTotalIls) +
          "</td></tr>"
        );
      })
      .join("");
  }

  function sourceList(rates) {
    const items = [
      rates.bituachLeumi,
      rates.pension,
      rates.havraa,
      rates.minimumWage,
    ];
    return items
      .map(function (item) {
        return (
          "<li><a href=\"" +
          escapeHtml(item.sourceUrl) +
          "\">" +
          escapeHtml(item.sourceName) +
          "</a> — effective " +
          escapeHtml(item.effectiveFrom || rates.asOf) +
          "</li>"
        );
      })
      .join("");
  }

  function generateBriefing(input, rates, options) {
    const opts = options || {};
    const result = EmployerCost.computeEmployerCost(input, rates);
    const offer = Offer.getOffer();
    const locale = result.input.locale;
    const compare = EmployerCost.firstYearVersusSteady(input, rates);
    const months = EmployerCost.twelveMonthCash(result);
    const alt = EmployerCost.computeEmployerCost(
      Object.assign({}, input, {
        severanceMode: result.input.severanceMode === "mandatory" ? "section14" : "mandatory",
      }),
      rates
    );
    const generatedAt = opts.generatedAt || new Date().toISOString();
    const sample = Boolean(opts.sample);
    const title =
      locale === "he"
        ? "תדריך עלות מעסיק בישראל"
        : "Israel employer-cost briefing";
    const html =
      "<!DOCTYPE html><html lang=\"" +
      (locale === "he" ? "he" : "en") +
      "\" dir=\"" +
      (locale === "he" ? "rtl" : "ltr") +
      "\"><head><meta charset=\"utf-8\"><title>" +
      escapeHtml(title) +
      "</title><style>body{font-family:Georgia,serif;max-width:760px;margin:32px auto;padding:0 16px;color:#16324F}table{width:100%;border-collapse:collapse;margin:16px 0}th,td{border-bottom:1px solid #c5d4c8;padding:8px;text-align:inherit}tfoot td{font-weight:700}small,footer{color:#4d5d68}h1{font-size:1.6rem}.stamp{display:inline-block;border:3px solid #B4232C;color:#B4232C;padding:8px 14px;font-family:Consolas,monospace;font-size:1.4rem}.banner{background:#F2E27A;padding:8px 12px;margin:12px 0}</style></head><body>" +
      (sample
        ? "<p class=\"banner\">SAMPLE FORMAT — live checkout is waiting on seller payment-account verification. Figures use the same shipped engine as a paid briefing.</p>"
        : "") +
      "<p>CostToHire IL · " +
      escapeHtml(offer.sku) +
      " · " +
      Offer.formatPrice(offer.priceIls, offer.currency) +
      "</p><h1>" +
      escapeHtml(title) +
      "</h1><p>Rates version " +
      escapeHtml(rates.version) +
      " as of " +
      escapeHtml(rates.asOf) +
      ". Generated " +
      escapeHtml(generatedAt) +
      ".</p><p class=\"stamp\">" +
      ils(result.totalEmployerCostIls) +
      " / month</p><p>Gross " +
      ils(result.grossIls) +
      " · on-cost " +
      ils(result.oncostIls) +
      " · load " +
      pct(result.loadRatio) +
      (result.input.roleLabel ? " · " + escapeHtml(result.input.roleLabel) : "") +
      "</p><table><thead><tr><th>Line</th><th>ILS</th></tr></thead><tbody>" +
      lineRows(result, locale) +
      "</tbody><tfoot><tr><td>Total employer cost</td><td>" +
      ils(result.totalEmployerCostIls) +
      "</td></tr><tr><td>Annual</td><td>" +
      ils(result.annualEmployerCostIls) +
      "</td></tr></tfoot></table><h2>First year versus steady state</h2><p>Year 1 monthly " +
      ils(compare.firstYearMonthlyIls) +
      " (" +
      ils(compare.firstYearAnnualIls) +
      " annual). Steady monthly " +
      ils(compare.steadyMonthlyIls) +
      " (" +
      ils(compare.steadyAnnualIls) +
      " annual). Convalescence gap " +
      ils(compare.havraaGapMonthlyIls) +
      " / month.</p><h2>Alternate severance setting</h2><p>The other severance mode totals " +
      ils(alt.totalEmployerCostIls) +
      " / month (difference " +
      ils(alt.totalEmployerCostIls - result.totalEmployerCostIls) +
      ").</p><h2>12-month cash table</h2><table><thead><tr><th>Month</th><th>This month</th><th>Running</th></tr></thead><tbody>" +
      monthRows(months) +
      "</tbody></table><h2>Sources</h2><ul>" +
      sourceList(rates) +
      "</ul><footer><p>" +
      escapeHtml(rates.disclaimer) +
      "</p><p>National insurance uses the reduced band up to " +
      ils(rates.bituachLeumi.reducedLimitIls) +
      " and the ceiling " +
      ils(rates.bituachLeumi.ceilingIls) +
      ". Pensionable base in this run: " +
      ils(result.pensionBaseIls) +
      " (" +
      escapeHtml(result.input.pensionBaseMode) +
      ").</p></footer></body></html>";

    const text = [
      title,
      "SKU " + offer.sku + " price " + Offer.formatPrice(offer.priceIls, offer.currency),
      "totalEmployerCostIls=" + result.totalEmployerCostIls,
      "annualEmployerCostIls=" + result.annualEmployerCostIls,
      "oncostIls=" + result.oncostIls,
      "ratesVersion=" + rates.version,
      rates.disclaimer,
    ].join("\n");

    return {
      filename: filenameFor(result.input),
      html: html,
      text: text,
      json: {
        sku: offer.sku,
        priceIls: offer.priceIls,
        generatedAt: generatedAt,
        sample: sample,
        result: result,
        compare: compare,
        months: months,
        alternateSeveranceTotalIls: alt.totalEmployerCostIls,
      },
    };
  }

  return {
    generateBriefing: generateBriefing,
    filenameFor: filenameFor,
    escapeHtml: escapeHtml,
  };
});
