"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const Offer = require("../src/offer");

const DURING_SALE = "2026-09-10T12:00:00+03:00";
const AFTER_SALE = "2026-09-18T00:00:00+03:00";

describe("launch sale window", function () {
  it("charges ₪49 before the 17 Sep 2026 deadline and ₪149 after", function () {
    const offer = Offer.getOffer(DURING_SALE);
    assert.equal(offer.regularPriceIls, 149);
    assert.equal(offer.salePriceIls, 49);
    assert.equal(offer.saleEndsAt, "2026-09-17T23:59:59+03:00");
    assert.equal(Offer.isOnSale(DURING_SALE), true);
    assert.equal(Offer.currentPriceIls(DURING_SALE), 49);
    assert.equal(Offer.isOnSale(AFTER_SALE), false);
    assert.equal(Offer.currentPriceIls(AFTER_SALE), 149);
    assert.equal(Offer.getOffer(AFTER_SALE).priceIls, 149);
    assert.equal(Offer.getOffer(DURING_SALE).priceIls, 49);
  });

  it("formats a remaining countdown and a closed sale", function () {
    const mid = Offer.formatCountdown("2026-09-16T23:59:59+03:00");
    assert.match(mid, /^1d 00:00:00$/);
    assert.equal(Offer.formatCountdown(AFTER_SALE), "0d 00:00:00");
  });
});
