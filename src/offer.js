(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.Offer = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const OFFER = {
    brand: "CostToHire IL",
    sku: "il-employer-cost-briefing-v1",
    nameEn: "Israel employer-cost briefing",
    nameHe: "תדריך עלות מעסיק בישראל",
    priceIls: 149,
    currency: "ILS",
    billing: "one_time",
    delivery: "instant-html-briefing",
    subscriptionSku: "il-employer-cost-pro-v1",
    subscriptionPriceIls: 99,
    agencyPriceIls: 390,
    firmPriceIls: 1500,
    whatYouBuyEn: [
      "A dated, source-cited HTML briefing you can print to PDF",
      "Line-item employer cost using 2026 published rates",
      "12-month cash table and first-year versus steady-state view",
      "Side-by-side Section 14 versus expansion-order minimum",
    ],
    whatYouBuyHe: [
      "תדריך HTML מתוארך עם מקורות, מוכן להדפסה ל-PDF",
      "פירוט עלות מעסיק לפי שיעורים מפורסמים ל-2026",
      "טבלת 12 חודשים והשוואת שנה ראשונה מול מצב יציב",
      "השוואה בין סעיף 14 לבין מינימום צו ההרחבה",
    ],
  };

  function getOffer() {
    return {
      brand: OFFER.brand,
      sku: OFFER.sku,
      nameEn: OFFER.nameEn,
      nameHe: OFFER.nameHe,
      priceIls: OFFER.priceIls,
      currency: OFFER.currency,
      billing: OFFER.billing,
      delivery: OFFER.delivery,
      subscriptionSku: OFFER.subscriptionSku,
      subscriptionPriceIls: OFFER.subscriptionPriceIls,
      agencyPriceIls: OFFER.agencyPriceIls,
      firmPriceIls: OFFER.firmPriceIls,
      whatYouBuyEn: OFFER.whatYouBuyEn.slice(),
      whatYouBuyHe: OFFER.whatYouBuyHe.slice(),
    };
  }

  function formatPrice(amount, currency) {
    const cur = currency || "ILS";
    const n = Number(amount);
    if (!Number.isFinite(n)) {
      throw new Error("Price must be a finite number");
    }
    if (cur === "ILS") {
      return "₪" + n.toFixed(0);
    }
    return cur + " " + n.toFixed(2);
  }

  function describeOffer(locale) {
    const offer = getOffer();
    const he = locale === "he";
    return {
      headline: he
        ? offer.nameHe + " — " + formatPrice(offer.priceIls, offer.currency)
        : offer.nameEn + " — " + formatPrice(offer.priceIls, offer.currency),
      priceLabel: formatPrice(offer.priceIls, offer.currency),
      delivery: offer.delivery,
      items: he ? offer.whatYouBuyHe.slice() : offer.whatYouBuyEn.slice(),
    };
  }

  function checkoutStatus(ownerPaymentReady) {
    if (ownerPaymentReady) {
      return {
        state: "ready",
        labelEn: "Pay ₪149 and download the briefing",
        labelHe: "שלמו ₪149 והורידו את התדריך",
      };
    }
    return {
      state: "owner-kyc-blocked",
      labelEn: "Checkout opens after the seller payment account is verified",
      labelHe: "התשלום ייפתח אחרי אימות חשבון הסליקה של המוכר",
    };
  }

  return {
    getOffer: getOffer,
    formatPrice: formatPrice,
    describeOffer: describeOffer,
    checkoutStatus: checkoutStatus,
  };
});
