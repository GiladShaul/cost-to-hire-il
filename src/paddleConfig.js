(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PaddleConfig = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const CONFIG = {
    provider: "paddle",
    environment: "live",
    token: "live_579a806bcb2f8651264fe92a665",
    productId: "pro_01kzzgrxyxwynpc6xchx8c3nb9",
    regularPriceId: "pri_01kzzgz4k6v40cseed86rhs3pr",
    salePriceId: "pri_01kzzgz4k6v40cseed86rhs3pr",
    chargeCurrency: "ILS",
    defaultPaymentLink: "https://cost.vinesautomation.com/",
  };

  function getConfig() {
    return {
      provider: CONFIG.provider,
      environment: CONFIG.environment,
      token: CONFIG.token,
      productId: CONFIG.productId,
      regularPriceId: CONFIG.regularPriceId,
      salePriceId: CONFIG.salePriceId,
      priceId: CONFIG.regularPriceId,
      chargeCurrency: CONFIG.chargeCurrency,
      defaultPaymentLink: CONFIG.defaultPaymentLink,
    };
  }

  function isPriceId(value) {
    return typeof value === "string" && /^pri_/.test(value);
  }

  function resolveOnSale(cfg) {
    if (cfg && typeof cfg.onSale === "boolean") return cfg.onSale;
    if (typeof Offer !== "undefined" && Offer.isOnSale) return Offer.isOnSale();
    return false;
  }

  function activePriceId(config) {
    const cfg = config || getConfig();
    return resolveOnSale(cfg) ? cfg.salePriceId : cfg.regularPriceId;
  }

  function isReady(config) {
    const cfg = config || getConfig();
    return (
      typeof cfg.token === "string" &&
      /^(live|test)_/.test(cfg.token) &&
      isPriceId(cfg.regularPriceId || cfg.priceId) &&
      isPriceId(cfg.salePriceId || cfg.regularPriceId || cfg.priceId)
    );
  }

  function checkoutItems(config) {
    const cfg = config || getConfig();
    const priceId = activePriceId(cfg);
    if (!isReady(cfg) || !isPriceId(priceId)) {
      throw new Error("Paddle checkout is not configured");
    }
    return [{ priceId: priceId, quantity: 1 }];
  }

  return {
    getConfig: getConfig,
    isReady: isReady,
    checkoutItems: checkoutItems,
  };
});
