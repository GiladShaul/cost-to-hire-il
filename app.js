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

  function renderError(message) {
    $("calc-error").hidden = !message;
    $("calc-error").textContent = message || "";
    if (message) {
      $("total-stamp").textContent = "—";
      $("result-lines").innerHTML = "";
    }
  }

  function render(result, rates) {
    renderError("");
    $("total-stamp").textContent = ils(result.totalEmployerCostIls);
    $("result-oncost").textContent = ils(result.oncostIls);
    $("result-annual").textContent = ils(result.annualEmployerCostIls);
    $("result-load").textContent = (result.loadRatio * 100).toFixed(1) + "%";
    $("rates-as-of").textContent = rates.asOf;
    $("result-lines").innerHTML = result.lines
      .map(function (line) {
        const label = document.documentElement.lang === "he" ? line.labelHe : line.labelEn;
        return "<div class=\"stub-line\"><span>" + escapeHtml(label) + "</span><span>" + ils(line.amountIls) + "</span></div>";
      })
      .join("");
    $("min-wage-note").hidden = !result.belowMinimumWage;
    $("download-briefing").disabled = false;
    $("stub").classList.add("is-printed");
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

  function downloadBriefing() {
    const rates = loadRates();
    const pack = Briefing.generateBriefing(currentInput(), rates, { sample: true });
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
    calculate();
  }

  function init() {
    if (location.protocol === "file:") {
      $("file-note").hidden = false;
    }
    ["gross", "seniority", "travel", "role", "severance", "pension-base", "hishtalmut", "havraa"].forEach(function (id) {
      $(id).addEventListener("input", calculate);
      $(id).addEventListener("change", calculate);
    });
    $("download-briefing").addEventListener("click", function (event) {
      event.preventDefault();
      if (calculate()) {
        downloadBriefing();
      }
    });
    $("lang-en").addEventListener("click", function () { setLang("en"); });
    $("lang-he").addEventListener("click", function () { setLang("he"); });
    const params = new URLSearchParams(location.search);
    if (params.get("gross")) $("gross").value = params.get("gross");
    if (params.get("role")) $("role").value = params.get("role");
    if (params.get("lang") === "he") {
      setLang("he");
    } else {
      calculate();
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
