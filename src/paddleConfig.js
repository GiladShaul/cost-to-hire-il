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
    priceId: "pri_01kzzgz4k6v40cseed86rhs3pr",
    chargeCurrency: "USD",
    defaultPaymentLink: "https://cost.vinesautomation.com/",
  };

  function getConfig() {
    return {
      provider: CONFIG.provider,
      environment: CONFIG.environment,
      token: CONFIG.token,
      productId: CONFIG.productId,
      priceId: CONFIG.priceId,
      chargeCurrency: CONFIG.chargeCurrency,
      defaultPaymentLink: CONFIG.defaultPaymentLink,
    };
  }

  function isReady(config) {
    const cfg = config || getConfig();
    return (
      typeof cfg.token === "string" &&
      /^(live|test)_/.test(cfg.token) &&
      typeof cfg.priceId === "string" &&
      /^pri_/.test(cfg.priceId)
    );
  }

  function checkoutItems(config) {
    const cfg = config || getConfig();
    if (!isReady(cfg)) {
      throw new Error("Paddle checkout is not configured");
    }
    return [{ priceId: cfg.priceId, quantity: 1 }];
  }

  return {
    getConfig: getConfig,
    isReady: isReady,
    checkoutItems: checkoutItems,
  };
});
