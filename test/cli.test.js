"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const EmployerCost = require("../src/employerCost");

const repoRoot = path.join(__dirname, "..");
const cli = path.join(repoRoot, "src", "cli.js");
const rates = JSON.parse(fs.readFileSync(path.join(repoRoot, "src", "rates.json"), "utf8"));

function runCli(args) {
  return spawnSync(process.execPath, [cli].concat(args), {
    encoding: "utf8",
    cwd: repoRoot,
  });
}

describe("cli entry point", function () {
  it("launches calculate twice and prints the same engine total", function () {
    const expected = EmployerCost.computeEmployerCost({ grossIls: 12000 }, rates);
    const first = runCli(["calculate", "--gross", "12000"]);
    const second = runCli(["calculate", "--gross", "12000"]);
    assert.equal(first.status, 0, first.stderr);
    assert.equal(second.status, 0, second.stderr);
    const one = JSON.parse(first.stdout);
    const two = JSON.parse(second.stdout);
    assert.equal(one.totalEmployerCostIls, expected.totalEmployerCostIls);
    assert.equal(two.totalEmployerCostIls, expected.totalEmployerCostIls);
    assert.equal(first.stdout, second.stdout);
  });

  it("writes a briefing file whose stamped total matches calculate", function () {
    const expected = EmployerCost.computeEmployerCost({ grossIls: 12000, seniorityYears: 1 }, rates);
    const out = path.join(os.tmpdir(), "cost-to-hire-il-briefing-test.html");
    const briefing = runCli([
      "briefing",
      "--gross",
      "12000",
      "--seniority",
      "1",
      "--out",
      out,
      "--generated-at",
      "2026-08-13T00:00:00.000Z",
    ]);
    assert.equal(briefing.status, 0, briefing.stderr);
    assert.match(briefing.stdout, /totalEmployerCostIls=14[0-9.]+/);
    const html = fs.readFileSync(out, "utf8");
    assert.match(html, new RegExp(String(expected.totalEmployerCostIls).replace(".", "\\.")));
    assert.match(html, /Israel employer-cost briefing/);
    fs.unlinkSync(out);
  });

  it("prints the priced offer from the shipped catalog", function () {
    const result = runCli(["offer"]);
    assert.equal(result.status, 0, result.stderr);
    const body = JSON.parse(result.stdout);
    assert.equal(body.priceLabel, "₪149");
    assert.equal(body.delivery, "instant-html-briefing");
    assert.ok(body.items.length >= 3);
  });
});
