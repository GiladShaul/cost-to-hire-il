"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const fs = require("fs");
const EmployerCost = require("../src/employerCost");

const rates = JSON.parse(fs.readFileSync(path.join(__dirname, "../src/rates.json"), "utf8"));

describe("computeEmployerCost", function () {
  it("prices a 10,000 ILS hire from the published 2026 bands", function () {
    // Independent arithmetic against the published table, not a copy of the function body:
    // Reduced NI base = min(10000, 7703) = 7703
    // Reduced NI = 7703 * 0.0451 = 347.4053 -> 347.41
    // Full NI base = 10000 - 7703 = 2297
    // Full NI = 2297 * 0.076 = 174.572 -> 174.57
    // Employer NI = 347.41 + 174.57 = 521.98
    // Pension = 10000 * 0.065 = 650.00
    // Section 14 severance = 10000 * 0.0833 = 833.00
    // On-cost = 521.98 + 650.00 + 833.00 = 2004.98
    // Total = 10000 + 2004.98 = 12004.98
    const result = EmployerCost.computeEmployerCost(
      { grossIls: 10000, seniorityYears: 0, severanceMode: "section14", pensionBaseMode: "gross" },
      rates
    );
    assert.equal(result.bituachLeumi.reducedAmountIls, 347.41);
    assert.equal(result.bituachLeumi.fullAmountIls, 174.57);
    assert.equal(result.bituachLeumi.totalIls, 521.98);
    assert.equal(result.lines.find(function (l) { return l.id === "pension"; }).amountIls, 650);
    assert.equal(result.lines.find(function (l) { return l.id === "severance"; }).amountIls, 833);
    assert.equal(result.oncostIls, 2004.98);
    assert.equal(result.totalEmployerCostIls, 12004.98);
    assert.equal(result.annualEmployerCostIls, 144059.76);
    assert.equal(result.belowMinimumWage, false);
  });

  it("applies the 51,910 ILS national-insurance ceiling", function () {
    // Reduced NI = 7703 * 0.0451 = 347.41
    // Full NI base = 51910 - 7703 = 44207
    // Full NI = 44207 * 0.076 = 3359.732 -> 3359.73
    // Employer NI = 347.41 + 3359.73 = 3707.14
    // Pension on full gross 60000 * 0.065 = 3900
    // Severance 60000 * 0.0833 = 4998
    const result = EmployerCost.computeEmployerCost(
      { grossIls: 60000, seniorityYears: 0, pensionBaseMode: "gross" },
      rates
    );
    assert.equal(result.bituachLeumi.uncappedIls, 8090);
    assert.equal(result.bituachLeumi.totalIls, 3707.14);
    assert.equal(result.totalEmployerCostIls, 72605.14);
  });

  it("can cap pension and severance at the published average wage", function () {
    // Cap 13769
    // Pension = 13769 * 0.065 = 894.985 -> 894.99
    // Severance = 13769 * 0.0833 = 1146.9577 -> 1146.96
    const result = EmployerCost.computeEmployerCost(
      { grossIls: 25000, pensionBaseMode: "average-wage-cap", seniorityYears: 0 },
      rates
    );
    assert.equal(result.pensionBaseIls, 13769);
    assert.equal(result.lines.find(function (l) { return l.id === "pension"; }).amountIls, 894.99);
    assert.equal(result.lines.find(function (l) { return l.id === "severance"; }).amountIls, 1146.96);
  });

  it("amortizes convalescence pay only after a completed year", function () {
    // 5 days * 418 = 2090 / 12 = 174.1666... -> 174.17
    const yearZero = EmployerCost.computeEmployerCost({ grossIls: 10000, seniorityYears: 0 }, rates);
    const yearOne = EmployerCost.computeEmployerCost({ grossIls: 10000, seniorityYears: 1 }, rates);
    assert.equal(yearZero.havraa.monthlyIls, 0);
    assert.equal(yearOne.havraa.days, 5);
    assert.equal(yearOne.havraa.monthlyIls, 174.17);
    assert.equal(yearOne.totalEmployerCostIls, 12179.15);
  });

  it("rejects a non-positive salary instead of inventing a cost", function () {
    assert.throws(function () {
      EmployerCost.computeEmployerCost({ grossIls: 0 }, rates);
    }, /greater than 0/);
  });
});
