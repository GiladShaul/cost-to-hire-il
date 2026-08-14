(function () {
  var script = document.currentScript;
  var origin = "https://cost.vinesautomation.com";
  var frame = document.createElement("iframe");
  var gross = (script && script.getAttribute("data-gross")) || "18000";
  frame.src = origin + "/embed.html";
  frame.title = "CostToHire IL calculator";
  frame.style.cssText = "width:100%;min-height:720px;border:0;background:transparent";
  frame.setAttribute("loading", "lazy");
  if (script && script.parentNode) {
    script.parentNode.insertBefore(frame, script);
  }
  frame.addEventListener("load", function () {
    try {
      var doc = frame.contentWindow.document;
      var input = doc.getElementById("gross");
      if (input) {
        input.value = gross;
        input.dispatchEvent(new Event("input"));
      }
    } catch (err) {
      /* cross-origin until both pages are on cost.vinesautomation.com */
    }
  });
})();
