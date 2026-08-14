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
    assert.match(html, /Pay and download the briefing/);
    assert.match(html, /cdn\.paddle\.com\/paddle\/v2\/paddle\.js/);
    assert.match(html, /src\/paddleConfig\.js/);
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

  it("ships Hebrew RTL copy for every customer field", function () {
    const html = read("index.html");
    const hebrew = /[\u0590-\u05FF]/;
    ["severance", "pension-base"].forEach(function (id) {
      const block = html.match(new RegExp('id="' + id + '"[\\s\\S]*?<\\/select>'));
      assert.ok(block, id + " select missing");
      const options = block[0].match(/<option[^>]*>/g) || [];
      assert.ok(options.length >= 2, id + " needs options");
      options.forEach(function (tag) {
        assert.match(tag, /data-he="/);
        assert.match(tag, hebrew);
      });
    });
    assert.match(html, /id="role"[^>]*data-he-value="העובד הישראלי הראשון"/);
    assert.match(html, /data-he="שכר ברוטו חודשי/);
    assert.match(html, /data-he="הגדרת פיצויים"/);
    assert.match(html, /data-he="שכר קובע לפנסיה"/);
    assert.match(html, /data-he="8\.33% \/ סעיף 14"/);
    assert.match(html, /data-he="לפי מלוא הברוטו"/);
  });

  it("shows the ready Paddle checkout label on the customer page", function () {
    const status = Offer.checkoutStatus(true);
    assert.equal(status.state, "ready");
    const html = read("index.html");
    assert.match(html, new RegExp(status.labelEn.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(html, /charged in USD/);
  });
});
