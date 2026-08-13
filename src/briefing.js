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

  function copy(locale) {
    if (locale === "he") {
      return {
        sample: "פורמט לדוגמה — התשלום החי יפתח אחרי אימות חשבון הסליקה. הסכומים מגיעים מאותו מנוע כמו התדריך בתשלום.",
        ratesLine: function (version, asOf, generatedAt) {
          return "גרסת שיעורים " + version + " נכון ל־" + asOf + ". נוצר ב־" + generatedAt + ".";
        },
        perMonth: "לחודש",
        gross: "ברוטו",
        oncost: "עלות נלווית",
        load: "העמסה",
        line: "סעיף",
        total: "סה״כ עלות מעסיק",
        annual: "שנתי",
        firstYear: "שנה ראשונה מול מצב יציב",
        firstYearBody: function (a, b, c, d, e) {
          return "חודשי בשנה הראשונה " + a + " (" + b + " שנתי). חודשי במצב יציב " + c + " (" + d + " שנתי). פער דמי הבראה " + e + " לחודש.";
        },
        alt: "הגדרת פיצויים חלופית",
        altBody: function (total, diff) {
          return "מצב הפיצויים האחר מסתכם ב־" + total + " לחודש (הפרש " + diff + ").";
        },
        cash: "טבלת מזומנים ל־12 חודשים",
        month: "חודש",
        thisMonth: "החודש",
        running: "מצטבר",
        sources: "מקורות",
        effective: "בתוקף מ־",
        disclaimerHe: "הערכה מידעית לפי שיעורים מפורסמים. זה אינו ייעוץ חשבונאי, משפטי, שכר או מס. אין זיקה למוסד לביטוח לאומי, לרשות המסים או למשרד העבודה. יש לאמת מול רואה חשבון או משרד שכר לפני הסתמכות.",
        footerBands: function (reduced, ceiling, base, mode) {
          const modeHe = mode === "average-wage-cap" ? "תקרת שכר ממוצע" : "מלוא הברוטו";
          return "ביטוח לאומי מחושב עד מדרגה מופחתת " + reduced + " ועד תקרה " + ceiling + ". שכר קובע בריצה זו: " + base + " (" + modeHe + ").";
        },
      };
    }
    return {
      sample: "SAMPLE FORMAT — live checkout is waiting on seller payment-account verification. Figures use the same shipped engine as a paid briefing.",
      ratesLine: function (version, asOf, generatedAt) {
        return "Rates version " + version + " as of " + asOf + ". Generated " + generatedAt + ".";
      },
      perMonth: "/ month",
      gross: "Gross",
      oncost: "on-cost",
      load: "load",
      line: "Line",
      total: "Total employer cost",
      annual: "Annual",
      firstYear: "First year versus steady state",
      firstYearBody: function (a, b, c, d, e) {
        return "Year 1 monthly " + a + " (" + b + " annual). Steady monthly " + c + " (" + d + " annual). Convalescence gap " + e + " / month.";
      },
      alt: "Alternate severance setting",
      altBody: function (total, diff) {
        return "The other severance mode totals " + total + " / month (difference " + diff + ").";
      },
      cash: "12-month cash table",
      month: "Month",
      thisMonth: "This month",
      running: "Running",
      sources: "Sources",
      effective: "effective ",
      disclaimerHe: null,
      footerBands: function (reduced, ceiling, base, mode) {
        return "National insurance uses the reduced band up to " + reduced + " and the ceiling " + ceiling + ". Pensionable base in this run: " + base + " (" + mode + ").";
      },
    };
  }

  function sourceList(rates, locale) {
    const labels = copy(locale);
    const items = [
      rates.bituachLeumi,
      rates.pension,
      rates.havraa,
      rates.minimumWage,
    ];
    return items
      .map(function (item) {
        const href = locale === "he" && item.sourceUrlHe ? item.sourceUrlHe : item.sourceUrl;
        const hebrewNames = {
          "National Insurance Institute — rates for salaried workers": "המוסד לביטוח לאומי — שיעורים לשכירים",
          "Kol Zchut — mandatory pension insurance for employees (expansion order)": "כל זכות — חובת ביטוח פנסיוני לעובדים",
          "Kol Zchut — convalescence pay (dmei havra'a)": "כל זכות — דמי הבראה",
          "National Insurance Institute — minimum wage table": "המוסד לביטוח לאומי — טבלת שכר מינימום",
        };
        const name =
          locale === "he"
            ? item.sourceNameHe || hebrewNames[item.sourceName] || item.sourceName
            : item.sourceName;
        return (
          "<li><a href=\"" +
          escapeHtml(href) +
          "\">" +
          escapeHtml(name) +
          "</a> — " +
          labels.effective +
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
    const labels = copy(locale);
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
      "</title><style>body{font-family:\"IBM Plex Sans Hebrew\",\"Segoe UI\",sans-serif;max-width:760px;margin:32px auto;padding:0 16px;color:#16324F}table{width:100%;border-collapse:collapse;margin:16px 0}th,td{border-bottom:1px solid #c5d4c8;padding:8px;text-align:inherit}tfoot td{font-weight:700}small,footer{color:#4d5d68}h1{font-size:1.6rem}.stamp{display:inline-block;border:3px solid #B4232C;color:#B4232C;padding:8px 14px;font-family:\"Segoe UI\",sans-serif;font-size:1.4rem}.banner{background:#F2E27A;padding:8px 12px;margin:12px 0}</style></head><body>" +
      (sample ? "<p class=\"banner\">" + escapeHtml(labels.sample) + "</p>" : "") +
      "<p>CostToHire IL · " +
      escapeHtml(offer.sku) +
      " · " +
      Offer.formatPrice(offer.priceIls, offer.currency) +
      "</p><h1>" +
      escapeHtml(title) +
      "</h1><p>" +
      escapeHtml(labels.ratesLine(rates.version, rates.asOf, generatedAt)) +
      "</p><p class=\"stamp\">" +
      ils(result.totalEmployerCostIls) +
      " " +
      labels.perMonth +
      "</p><p>" +
      labels.gross +
      " " +
      ils(result.grossIls) +
      " · " +
      labels.oncost +
      " " +
      ils(result.oncostIls) +
      " · " +
      labels.load +
      " " +
      pct(result.loadRatio) +
      (result.input.roleLabel ? " · " + escapeHtml(result.input.roleLabel) : "") +
      "</p><table><thead><tr><th>" +
      labels.line +
      "</th><th>₪</th></tr></thead><tbody>" +
      lineRows(result, locale) +
      "</tbody><tfoot><tr><td>" +
      labels.total +
      "</td><td>" +
      ils(result.totalEmployerCostIls) +
      "</td></tr><tr><td>" +
      labels.annual +
      "</td><td>" +
      ils(result.annualEmployerCostIls) +
      "</td></tr></tfoot></table><h2>" +
      labels.firstYear +
      "</h2><p>" +
      labels.firstYearBody(
        ils(compare.firstYearMonthlyIls),
        ils(compare.firstYearAnnualIls),
        ils(compare.steadyMonthlyIls),
        ils(compare.steadyAnnualIls),
        ils(compare.havraaGapMonthlyIls)
      ) +
      "</p><h2>" +
      labels.alt +
      "</h2><p>" +
      labels.altBody(
        ils(alt.totalEmployerCostIls),
        ils(alt.totalEmployerCostIls - result.totalEmployerCostIls)
      ) +
      "</p><h2>" +
      labels.cash +
      "</h2><table><thead><tr><th>" +
      labels.month +
      "</th><th>" +
      labels.thisMonth +
      "</th><th>" +
      labels.running +
      "</th></tr></thead><tbody>" +
      monthRows(months) +
      "</tbody></table><h2>" +
      labels.sources +
      "</h2><ul>" +
      sourceList(rates, locale) +
      "</ul><footer><p>" +
      escapeHtml(labels.disclaimerHe || rates.disclaimer) +
      "</p><p>" +
      labels.footerBands(
        ils(rates.bituachLeumi.reducedLimitIls),
        ils(rates.bituachLeumi.ceilingIls),
        ils(result.pensionBaseIls),
        result.input.pensionBaseMode
      ) +
      "</p></footer></body></html>";

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
