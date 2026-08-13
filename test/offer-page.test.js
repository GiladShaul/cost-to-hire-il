"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const Offer = require("../src/offer");

const root = path.join(__dirname, "..");

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

describe("sellable offer surface", function () {
  it("publishes the live price and delivery method on the customer page", function () {
    const html = read("index.html");
    const offer = Offer.getOffer();
    assert.match(html, /CostToHire IL/);
    assert.match(html, /₪149/);
    assert.match(html, /Israel employer-cost briefing/);
    assert.match(html, /id="gross"/);
    assert.match(html, /id="total-stamp"/);
    assert.match(html, /id="buy"/);
    assert.match(html, /Checkout opens after the seller payment account is verified/);
    assert.match(html, /Not accounting, legal, payroll, or tax advice/);
    assert.doesNotMatch(html, /password|secret|api[_-]?key/i);
    assert.equal(offer.priceIls, 149);
    assert.equal(offer.delivery, "instant-html-briefing");
  });

  it("embeds the same rates table the engine ships", function () {
    const html = read("index.html");
    const rates = JSON.parse(read("src/rates.json"));
    const match = html.match(/id="rates-data"[^>]*>([\s\S]*?)<\/script>/);
    assert.ok(match, "index.html must embed #rates-data");
    const embedded = JSON.parse(match[1]);
    assert.deepEqual(embedded, rates);
    assert.equal(embedded.bituachLeumi.reducedLimitIls, 7703);
    assert.equal(embedded.bituachLeumi.ceilingIls, 51910);
    assert.match(embedded.bituachLeumi.sourceUrl, /^https:\/\//);
  });

  it("keeps checkout blocked until owner KYC is done", function () {
    const status = Offer.checkoutStatus(false);
    assert.equal(status.state, "owner-kyc-blocked");
    const html = read("index.html");
    assert.match(html, new RegExp(status.labelEn.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
});
