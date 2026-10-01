(function () {
  "use strict";

  function $(id) {
    return document.getElementById(id);
  }

  function loadRates() {
    const node = $("rates-data");
    if (!node) {
      throw new Error("Missing rates table");
    }
    return JSON.parse(node.textContent);
  }

  function currentInput() {
    return {
      grossIls: $("gross").value,
      seniorityYears: $("seniority").value,
      travelIls: $("travel").value || 0,
      includeHishtalmut: $("hishtalmut").checked,
      includeHavraa: $("havraa").checked,
      severanceMode: $("severance").value,
      pensionBaseMode: $("pension-base").value,
      roleLabel: $("role").value,
      locale: document.documentElement.lang === "he" ? "he" : "en",
    };
  }

  function ils(amount) {
    return "₪" + Number(amount).toFixed(2);
  }

  function localizeError(message) {
    const he = document.documentElement.lang === "he";
    if (!he) return message;
    if (/greater than 0/.test(message)) return "יש להזין שכר ברוטו גדול מאפס";
    if (/seniorityYears/.test(message)) return "יש להזין ותק של אפס שנים או יותר";
    if (/travelIls/.test(message)) return "יש להזין סכום נסיעות של אפס או יותר";
    if (/Rates table/.test(message)) return "טבלת השיעורים חסרה";
    return "לא ניתן לחשב את העלות. בדקו את הנתונים.";
  }

  function setText(id, value) {
    const node = $(id);
    if (node) node.textContent = value;
  }

  function renderError(message) {
    const err = $("calc-error");
    if (err) {
      err.hidden = !message;
      err.textContent = message || "";
    }
    if (message) {
      setText("total-stamp", "—");
      if ($("result-lines")) $("result-lines").innerHTML = "";
    }
  }

  function render(result, rates) {
    renderError("");
    setText("total-stamp", ils(result.totalEmployerCostIls));
    setText("result-gross", ils(result.grossIls));
    setText("result-oncost", ils(result.oncostIls));
    setText("result-annual", ils(result.annualEmployerCostIls));
    setText("result-load", (result.loadRatio * 100).toFixed(1) + "%");
    setText("rates-as-of", rates.asOf);
    if ($("result-lines")) {
      $("result-lines").innerHTML = result.lines
        .map(function (line) {
          const label = document.documentElement.lang === "he" ? line.labelHe : line.labelEn;
          return "<div class=\"stub-line\"><span>" + escapeHtml(label) + "</span><span>" + ils(line.amountIls) + "</span></div>";
        })
        .join("");
    }
    if ($("min-wage-note")) $("min-wage-note").hidden = !result.belowMinimumWage;
    if ($("download-briefing")) $("download-briefing").disabled = false;
    if ($("stub")) $("stub").classList.add("is-printed");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function calculate() {
    const rates = loadRates();
    try {
      const result = EmployerCost.computeEmployerCost(currentInput(), rates);
      render(result, rates);
      return result;
    } catch (err) {
      renderError(localizeError(err.message));
      return null;
    }
  }

  function hasPaid() {
    try {
      return sessionStorage.getItem("costtohire-paid") === "1";
    } catch (err) {
      return false;
    }
  }

  function markPaid() {
    try {
      sessionStorage.setItem("costtohire-paid", "1");
    } catch (err) {
      /* ignore */
    }
  }

  function downloadBriefing(sample) {
    const rates = loadRates();
    const paid = sample === false || hasPaid();
    const pack = Briefing.generateBriefing(currentInput(), rates, { sample: !paid });
    const blob = new Blob([pack.html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = pack.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function setCheckoutNote(en, he) {
    const note = $("owner-checkout");
    if (!note) return;
    note.setAttribute("data-en", en);
    note.setAttribute("data-he", he);
    note.textContent = document.documentElement.lang === "he" ? he : en;
  }

  function chargeCopy(onSale) {
    if (onSale) {
      return {
        en: "Card checkout is handled by Paddle, the merchant of record. Price ₪149. After payment the unwatermarked briefing downloads automatically.",
        he: "הסליקה באמצעות Paddle, סוחר הרשומה. מחיר ₪149. אחרי התשלום התדריך יורד אוטומטית.",
      };
    }
    return {
      en: "Card checkout is handled by Paddle, the merchant of record. You are charged in Israeli shekels (₪149). After payment the unwatermarked briefing downloads automatically.",
      he: "הסליקה באמצעות Paddle, סוחר הרשומה. החיוב בשקלים חדשים (₪149). אחרי התשלום התדריך יורד אוטומטית.",
    };
  }

  let paddleNoteLocked = false;

  function renderOfferPrice() {
    if (typeof Offer === "undefined") return;
    const onSale = Offer.isOnSale();
    const current = Offer.formatPrice(Offer.currentPriceIls(), "ILS");
    const regular = Offer.formatPrice(Offer.getOffer().regularPriceIls, "ILS");
    if ($("sale-price")) $("sale-price").textContent = current;
    if ($("list-price")) {
      $("list-price").hidden = !onSale;
      $("list-price").textContent = regular;
    }
    if ($("sale-line")) $("sale-line").hidden = !onSale;
    if ($("sale-countdown")) {
      $("sale-countdown").textContent = onSale ? Offer.formatCountdown() : "";
    }
    if (!paddleNoteLocked) {
      const copy = chargeCopy(onSale);
      setCheckoutNote(copy.en, copy.he);
    }
  }

  let saleTimer = null;
  function startSaleClock() {
    renderOfferPrice();
    if (saleTimer) {
      clearInterval(saleTimer);
      saleTimer = null;
    }
    if (typeof Offer === "undefined" || !Offer.isOnSale()) return;
    saleTimer = setInterval(function () {
      renderOfferPrice();
      if (!Offer.isOnSale() && saleTimer) {
        clearInterval(saleTimer);
        saleTimer = null;
      }
    }, 1000);
  }

  function openPaddleCheckout() {
    if (typeof Paddle === "undefined" || !PaddleConfig.isReady()) {
      setCheckoutNote(
        "Paddle.js did not load. Check the connection and try again.",
        "Paddle לא נטען. בדקו את החיבור ונסו שוב."
      );
      return;
    }
    if (!calculate()) return;
    const cfg = PaddleConfig.getConfig();
    cfg.onSale = typeof Offer !== "undefined" && Offer.isOnSale();
    Paddle.Checkout.open({
      items: PaddleConfig.checkoutItems(cfg),
    });
  }

  function describePaddleEvent(event) {
    if (!event) return "Paddle returned an empty error.";
    const data = event.data || event.detail || event;
    const bits = [];
    if (event.name) bits.push(event.name);
    if (data && data.code) bits.push(String(data.code));
    if (data && data.detail) bits.push(String(data.detail));
    if (data && data.message) bits.push(String(data.message));
    if (data && data.error) bits.push(typeof data.error === "string" ? data.error : JSON.stringify(data.error));
    if (bits.length <= 1) {
      try {
        bits.push(JSON.stringify(data));
      } catch (err) {
        bits.push(String(event.name || "checkout.error"));
      }
    }
    return bits.join(" — ");
  }

  function initPaddle() {
    const buy = $("buy");
    if (!buy || typeof PaddleConfig === "undefined" || !PaddleConfig.isReady()) return;
    const ready = Offer.checkoutStatus(true);
    buy.classList.remove("blocked");
    buy.setAttribute("data-en", ready.labelEn);
    buy.setAttribute("data-he", ready.labelHe);
    buy.textContent = document.documentElement.lang === "he" ? ready.labelHe : ready.labelEn;
    buy.setAttribute("href", "#buy");
    renderOfferPrice();
    if (typeof Paddle === "undefined") {
      paddleNoteLocked = true;
      setCheckoutNote(
        "Paddle.js did not load. Checkout cannot open on this page load.",
        "Paddle לא נטען. לא ניתן לפתוח תשלום בטעינה זו."
      );
      return;
    }
    Paddle.Initialize({
      token: PaddleConfig.getConfig().token,
      eventCallback: function (event) {
        if (!event || !event.name) return;
        if (event.name === "checkout.completed") {
          markPaid();
          downloadBriefing(false);
        }
        if (event.name === "checkout.error" || event.name === "checkout.warning") {
          const detail = describePaddleEvent(event);
          const status = $("paddle-status");
          if (status) {
            status.hidden = false;
            status.textContent = detail;
          }
          setCheckoutNote(
            "Paddle blocked the overlay. In live Paddle submit cost.vinesautomation.com under Checkout → Website approval (the subdomain must be approved on its own) and set Default payment link to https://cost.vinesautomation.com. Then retry. Detail: " + detail,
            "Paddle חסם את התשלום. בחשבון החי שלחו לאישור את cost.vinesautomation.com תחת Checkout → Website approval, והגדירו Default payment link ל־https://cost.vinesautomation.com. פרט: " + detail
          );
        }
      },
    });
    buy.addEventListener("click", function (event) {
      event.preventDefault();
      openPaddleCheckout();
    });
  }

  function syncDefaultField(node, he) {
    if (!node) return;
    const en = node.getAttribute("data-en-value");
    const heb = node.getAttribute("data-he-value");
    if (!en || !heb) return;
    if (node.value === en || node.value === heb || node.value.trim() === "") {
      node.value = he ? heb : en;
    }
  }

  function setLang(lang) {
    const he = lang === "he";
    document.documentElement.lang = he ? "he" : "en";
    document.documentElement.dir = he ? "rtl" : "ltr";
    document.querySelectorAll("[data-en]").forEach(function (node) {
      const text = he ? node.getAttribute("data-he") : node.getAttribute("data-en");
      if (node.tagName === "META") {
        node.setAttribute("content", text);
      } else {
        node.textContent = text;
      }
    });
    document.querySelectorAll("[data-en-href]").forEach(function (node) {
      node.setAttribute("href", he ? node.getAttribute("data-he-href") : node.getAttribute("data-en-href"));
    });
    syncDefaultField($("role"), he);
    $("lang-en").setAttribute("aria-pressed", he ? "false" : "true");
    $("lang-he").setAttribute("aria-pressed", he ? "true" : "false");
    renderOfferPrice();
    calculate();
  }

  function init() {
    if (location.protocol === "file:") {
      $("file-note").hidden = false;
    }
    ["gross", "seniority", "travel", "role", "severance", "pension-base", "hishtalmut", "havraa"].forEach(function (id) {
      const node = $(id);
      if (!node) return;
      node.addEventListener("input", calculate);
      node.addEventListener("change", calculate);
    });
    if ($("download-briefing")) {
      $("download-briefing").addEventListener("click", function (event) {
        event.preventDefault();
        if (calculate()) {
          downloadBriefing(true);
        }
      });
    }
    if ($("lang-en")) $("lang-en").addEventListener("click", function () { setLang("en"); });
    if ($("lang-he")) $("lang-he").addEventListener("click", function () { setLang("he"); });
    const params = new URLSearchParams(location.search);
    if (params.get("gross")) $("gross").value = params.get("gross");
    if (params.get("role")) $("role").value = params.get("role");
    if (params.get("paid") === "1") {
      markPaid();
    }
    initPaddle();
    startSaleClock();
    if (params.get("lang") === "en") {
      setLang("en");
    } else {
      setLang("he");
    }
    if (hasPaid() && calculate()) {
      downloadBriefing(false);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
