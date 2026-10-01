"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const PaddleConfig = require("../src/paddleConfig");
const Offer = require("../src/offer");

describe("Paddle checkout config", function () {
  it("exposes a live client token and a price ID the overlay can open", function () {
    const cfg = PaddleConfig.getConfig();
    assert.equal(cfg.provider, "paddle");
    assert.equal(cfg.environment, "live");
    assert.match(cfg.token, /^live_/);
    assert.match(cfg.regularPriceId, /^pri_/);
    assert.match(cfg.salePriceId, /^pri_/);
    assert.equal(cfg.chargeCurrency, "ILS");
    assert.equal(PaddleConfig.isReady(cfg), true);
    assert.deepEqual(
      PaddleConfig.checkoutItems({
        token: cfg.token,
        regularPriceId: cfg.regularPriceId,
        salePriceId: "pri_sale_test_id",
        onSale: true,
      }),
      [{ priceId: "pri_sale_test_id", quantity: 1 }]
    );
    assert.deepEqual(
      PaddleConfig.checkoutItems({
        token: cfg.token,
        regularPriceId: "pri_regular_test_id",
        salePriceId: cfg.salePriceId,
        onSale: false,
      }),
      [{ priceId: "pri_regular_test_id", quantity: 1 }]
    );
  });

  it("marks the sellable offer ready when that config is present", function () {
    const status = Offer.checkoutStatus(PaddleConfig.isReady());
    assert.equal(status.state, "ready");
    assert.match(status.labelEn, /Pay and download/);
  });

  it("refuses to open checkout without a price ID", function () {
    assert.throws(function () {
      PaddleConfig.checkoutItems({ token: "live_x", regularPriceId: "pro_not_a_price", onSale: false });
    }, /not configured/);
  });
});
