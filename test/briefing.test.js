"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const fs = require("fs");
const EmployerCost = require("../src/employerCost");
const Briefing = require("../src/briefing");
const Offer = require("../src/offer");

const rates = JSON.parse(fs.readFileSync(path.join(__dirname, "../src/rates.json"), "utf8"));

describe("generateBriefing", function () {
  it("delivers a dated HTML pack whose stamped total matches the shipped engine", function () {
    const input = { grossIls: 18000, seniorityYears: 2, roleLabel: "Product designer", locale: "en" };
    const expected = EmployerCost.computeEmployerCost(input, rates);
    const pack = Briefing.generateBriefing(input, rates, {
      generatedAt: "2026-08-13T00:00:00.000Z",
      sample: false,
    });
    const offer = Offer.getOffer();
    assert.equal(pack.json.sku, offer.sku);
    assert.equal(pack.json.priceIls, 149);
    assert.equal(pack.json.result.totalEmployerCostIls, expected.totalEmployerCostIls);
    assert.match(pack.html, /Israel employer-cost briefing/);
    assert.match(pack.html, new RegExp(String(expected.totalEmployerCostIls).replace(".", "\\.")));
    assert.match(pack.html, /12-month cash table/);
    assert.match(pack.html, /First year versus steady state/);
    assert.match(pack.html, /btl\.gov\.il/);
    assert.match(pack.html, /Not accounting, legal, payroll, or tax advice/);
    assert.match(pack.html, /Rates version 2026\.1/);
    assert.equal(pack.json.months.length, 12);
    assert.equal(pack.json.months[11].runningTotalIls, expected.annualEmployerCostIls);
    assert.equal(pack.filename, "cost-to-hire-il-18000-briefing.html");
  });

  it("writes a fully Hebrew RTL briefing when locale is he", function () {
    const pack = Briefing.generateBriefing(
      { grossIls: 18000, locale: "he", roleLabel: "העובד הישראלי הראשון" },
      rates,
      { generatedAt: "2026-08-13T00:00:00.000Z", sample: true }
    );
    assert.match(pack.html, /lang="he"/);
    assert.match(pack.html, /dir="rtl"/);
    assert.match(pack.html, /תדריך עלות מעסיק בישראל/);
    assert.match(pack.html, /טבלת מזומנים ל־12 חודשים/);
    assert.match(pack.html, /העובד הישראלי הראשון/);
    assert.doesNotMatch(pack.html, /12-month cash table/);
    assert.doesNotMatch(pack.html, /First year versus steady state/);
  });

  it("marks a sample briefing without changing the calculated total", function () {
    const input = { grossIls: 9000 };
    const live = Briefing.generateBriefing(input, rates, { sample: false, generatedAt: "2026-08-13T00:00:00.000Z" });
    const sample = Briefing.generateBriefing(input, rates, { sample: true, generatedAt: "2026-08-13T00:00:00.000Z" });
    assert.equal(sample.json.result.totalEmployerCostIls, live.json.result.totalEmployerCostIls);
    assert.match(sample.html, /SAMPLE FORMAT/);
    assert.doesNotMatch(live.html, /SAMPLE FORMAT/);
  });
});
