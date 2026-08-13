(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.EmployerCost = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function roundAgorot(value) {
    if (!Number.isFinite(value)) {
      throw new Error("Cannot round a non-finite amount");
    }
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  function assertRates(rates) {
    if (!rates || !rates.bituachLeumi || !rates.pension || !rates.havraa) {
      throw new Error("Rates table is missing required sections");
    }
    const needed = [
      rates.bituachLeumi.reducedLimitIls,
      rates.bituachLeumi.ceilingIls,
      rates.bituachLeumi.employerReducedRate,
      rates.bituachLeumi.employerFullRate,
      rates.pension.employerTagmulimRate,
      rates.pension.employerSeveranceSection14Rate,
      rates.pension.employerSeveranceMandatoryRate,
      rates.pension.averageWageCapIls,
      rates.havraa.privateSectorDayRateIls,
    ];
    if (needed.some(function (n) { return !Number.isFinite(n); })) {
      throw new Error("Rates table contains a non-numeric statutory figure");
    }
  }

  function normalizeInput(input) {
    const raw = input || {};
    const gross = Number(raw.grossIls);
    if (!Number.isFinite(gross) || gross <= 0) {
      throw new Error("grossIls must be a number greater than 0");
    }
    const seniorityYears = raw.seniorityYears == null ? 0 : Number(raw.seniorityYears);
    if (!Number.isFinite(seniorityYears) || seniorityYears < 0) {
      throw new Error("seniorityYears must be a number of 0 or more");
    }
    const travel = raw.travelIls == null ? 0 : Number(raw.travelIls);
    if (!Number.isFinite(travel) || travel < 0) {
      throw new Error("travelIls must be a number of 0 or more");
    }
    const severanceMode = raw.severanceMode === "mandatory" ? "mandatory" : "section14";
    const pensionBaseMode = raw.pensionBaseMode === "average-wage-cap" ? "average-wage-cap" : "gross";
    return {
      grossIls: gross,
      seniorityYears: seniorityYears,
      travelIls: travel,
      includeHishtalmut: Boolean(raw.includeHishtalmut),
      includeHavraa: raw.includeHavraa !== false,
      severanceMode: severanceMode,
      pensionBaseMode: pensionBaseMode,
      roleLabel: raw.roleLabel ? String(raw.roleLabel) : "",
      locale: raw.locale === "he" ? "he" : "en",
    };
  }

  function employerBituachLeumi(grossIls, rates) {
    const reducedLimit = rates.bituachLeumi.reducedLimitIls;
    const ceiling = rates.bituachLeumi.ceilingIls;
    const reducedBase = Math.max(0, Math.min(grossIls, reducedLimit));
    const fullBase = Math.max(0, Math.min(grossIls, ceiling) - reducedLimit);
    const reducedAmount = roundAgorot(reducedBase * rates.bituachLeumi.employerReducedRate);
    const fullAmount = roundAgorot(fullBase * rates.bituachLeumi.employerFullRate);
    return {
      reducedBaseIls: roundAgorot(reducedBase),
      fullBaseIls: roundAgorot(fullBase),
      uncappedIls: roundAgorot(Math.max(0, grossIls - ceiling)),
      reducedAmountIls: reducedAmount,
      fullAmountIls: fullAmount,
      totalIls: roundAgorot(reducedAmount + fullAmount),
    };
  }

  function pensionableBase(grossIls, rates, mode) {
    if (mode === "average-wage-cap") {
      return Math.min(grossIls, rates.pension.averageWageCapIls);
    }
    return grossIls;
  }

  function havraaDays(seniorityYears, rates) {
    const completed = Math.floor(seniorityYears);
    const rows = rates.havraa.daysByCompletedYears || [];
    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];
      if (completed >= row.minYears && completed <= row.maxYears) {
        return row.days;
      }
    }
    return 0;
  }

  function monthlyHavraa(seniorityYears, rates, include) {
    if (!include) {
      return { days: 0, annualIls: 0, monthlyIls: 0 };
    }
    const days = havraaDays(seniorityYears, rates);
    const annual = roundAgorot(days * rates.havraa.privateSectorDayRateIls);
    return {
      days: days,
      annualIls: annual,
      monthlyIls: roundAgorot(annual / 12),
    };
  }

  function computeEmployerCost(input, rates) {
    assertRates(rates);
    const spec = normalizeInput(input);
    const ni = employerBituachLeumi(spec.grossIls, rates);
    const pensionBase = pensionableBase(spec.grossIls, rates, spec.pensionBaseMode);
    const severanceRate =
      spec.severanceMode === "mandatory"
        ? rates.pension.employerSeveranceMandatoryRate
        : rates.pension.employerSeveranceSection14Rate;
    const pensionIls = roundAgorot(pensionBase * rates.pension.employerTagmulimRate);
    const severanceIls = roundAgorot(pensionBase * severanceRate);
    const hishtalmutIls = spec.includeHishtalmut
      ? roundAgorot(pensionBase * rates.hishtalmut.employerRate)
      : 0;
    const havraa = monthlyHavraa(spec.seniorityYears, rates, spec.includeHavraa);
    const travelIls = roundAgorot(spec.travelIls);

    const lines = [
      { id: "bituachLeumi", labelEn: "Employer national insurance", labelHe: "ביטוח לאומי מעסיק", amountIls: ni.totalIls, kind: "statutory" },
      { id: "pension", labelEn: "Employer pension (tagmulim)", labelHe: "פנסיה מעסיק (תגמולים)", amountIls: pensionIls, kind: "statutory" },
      { id: "severance", labelEn: spec.severanceMode === "mandatory" ? "Employer severance (order minimum 6%)" : "Employer severance (8.33% / Section 14)", labelHe: spec.severanceMode === "mandatory" ? "פיצויים מעסיק (6% צו)" : "פיצויים מעסיק (8.33% / סעיף 14)", amountIls: severanceIls, kind: "statutory" },
    ];
    if (spec.includeHishtalmut) {
      lines.push({ id: "hishtalmut", labelEn: "Study fund (optional)", labelHe: "קרן השתלמות (רשות)", amountIls: hishtalmutIls, kind: "optional" });
    }
    if (havraa.monthlyIls > 0) {
      lines.push({ id: "havraa", labelEn: "Convalescence pay amortized", labelHe: "דמי הבראה (פריסה חודשית)", amountIls: havraa.monthlyIls, kind: "planning" });
    }
    if (travelIls > 0) {
      lines.push({ id: "travel", labelEn: "Travel allowance", labelHe: "נסיעות", amountIls: travelIls, kind: "input" });
    }

    const oncostIls = roundAgorot(lines.reduce(function (sum, line) {
      return sum + line.amountIls;
    }, 0));
    const totalEmployerCostIls = roundAgorot(spec.grossIls + oncostIls);
    const loadRatio = spec.grossIls === 0 ? 0 : oncostIls / spec.grossIls;

    return {
      input: spec,
      ratesVersion: rates.version,
      ratesAsOf: rates.asOf,
      pensionBaseIls: roundAgorot(pensionBase),
      bituachLeumi: ni,
      havraa: havraa,
      lines: lines,
      grossIls: roundAgorot(spec.grossIls),
      oncostIls: oncostIls,
      totalEmployerCostIls: totalEmployerCostIls,
      annualEmployerCostIls: roundAgorot(totalEmployerCostIls * 12),
      loadRatio: loadRatio,
      belowMinimumWage: spec.grossIls < rates.minimumWage.monthlyIls,
      disclaimer: rates.disclaimer,
    };
  }

  function firstYearVersusSteady(input, rates) {
    const first = computeEmployerCost(Object.assign({}, input, { seniorityYears: 0, includeHavraa: true }), rates);
    const steadySeniority = Math.max(1, Number(input && input.seniorityYears) || 1);
    const steady = computeEmployerCost(Object.assign({}, input, { seniorityYears: steadySeniority, includeHavraa: true }), rates);
    return {
      firstYearMonthlyIls: first.totalEmployerCostIls,
      firstYearAnnualIls: first.annualEmployerCostIls,
      steadyMonthlyIls: steady.totalEmployerCostIls,
      steadyAnnualIls: steady.annualEmployerCostIls,
      havraaGapMonthlyIls: roundAgorot(steady.totalEmployerCostIls - first.totalEmployerCostIls),
    };
  }

  function twelveMonthCash(result) {
    const months = [];
    for (let i = 1; i <= 12; i += 1) {
      months.push({
        month: i,
        employerCostIls: result.totalEmployerCostIls,
        runningTotalIls: roundAgorot(result.totalEmployerCostIls * i),
      });
    }
    return months;
  }

  return {
    roundAgorot: roundAgorot,
    normalizeInput: normalizeInput,
    computeEmployerCost: computeEmployerCost,
    firstYearVersusSteady: firstYearVersusSteady,
    twelveMonthCash: twelveMonthCash,
    employerBituachLeumi: employerBituachLeumi,
    pensionableBase: pensionableBase,
    havraaDays: havraaDays,
  };
});
