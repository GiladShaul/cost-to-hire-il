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
    regularPriceIls: 149,
    salePriceIls: 49,
    saleEndsAt: "2026-09-17T23:59:59+03:00",
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

  function at(now) {
    if (now === undefined || now === null) return Date.now();
    const t = new Date(now).getTime();
    if (!Number.isFinite(t)) {
      throw new Error("now must be a valid date");
    }
    return t;
  }

  function saleEndMs() {
    return Date.parse(OFFER.saleEndsAt);
  }

  function isOnSale(now) {
    return at(now) < saleEndMs();
  }

  function currentPriceIls(now) {
    return isOnSale(now) ? OFFER.salePriceIls : OFFER.regularPriceIls;
  }

  function remainingMs(now) {
    return Math.max(0, saleEndMs() - at(now));
  }

  function formatCountdown(now) {
    const totalSec = Math.floor(remainingMs(now) / 1000);
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    function pad(n) {
      return String(n).padStart(2, "0");
    }
    return days + "d " + pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
  }

  function getOffer(now) {
    return {
      brand: OFFER.brand,
      sku: OFFER.sku,
      nameEn: OFFER.nameEn,
      nameHe: OFFER.nameHe,
      regularPriceIls: OFFER.regularPriceIls,
      salePriceIls: OFFER.salePriceIls,
      saleEndsAt: OFFER.saleEndsAt,
      onSale: isOnSale(now),
      priceIls: currentPriceIls(now),
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

  function describeOffer(locale, now) {
    const offer = getOffer(now);
    const he = locale === "he";
    return {
      headline: he
        ? offer.nameHe + " — " + formatPrice(offer.priceIls, offer.currency)
        : offer.nameEn + " — " + formatPrice(offer.priceIls, offer.currency),
      priceLabel: formatPrice(offer.priceIls, offer.currency),
      regularPriceIls: offer.regularPriceIls,
      salePriceIls: offer.salePriceIls,
      saleEndsAt: offer.saleEndsAt,
      onSale: offer.onSale,
      delivery: offer.delivery,
      items: he ? offer.whatYouBuyHe.slice() : offer.whatYouBuyEn.slice(),
    };
  }

  function checkoutStatus(ownerPaymentReady) {
    if (ownerPaymentReady) {
      return {
        state: "ready",
        labelEn: "Pay and download the briefing",
        labelHe: "רכישה והורדת התדריך",
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
    isOnSale: isOnSale,
    currentPriceIls: currentPriceIls,
    formatCountdown: formatCountdown,
  };
});
