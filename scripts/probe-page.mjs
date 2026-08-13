import { chromium } from "playwright";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PROBE_PORT || 4173);
const screenshotPath = process.env.SCREENSHOT || path.join(root, "offer-page.png");
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

const server = http.createServer(function (req, res) {
  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  const rel = urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, "");
  const file = path.normalize(path.join(root, rel));
  if (!file.startsWith(root)) {
    res.writeHead(403);
    res.end("forbidden");
    return;
  }
  fs.readFile(file, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end("not found");
      return;
    }
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
});

await new Promise(function (resolve) {
  server.listen(port, "127.0.0.1", resolve);
});

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on("pageerror", function (err) {
    errors.push(String(err));
  });
  await page.goto("http://127.0.0.1:" + port + "/", { waitUntil: "networkidle" });
  const stamp = page.locator("#total-stamp");
  await stamp.waitFor();
  const before = (await stamp.textContent()).trim();
  if (!before || before === "—") {
    throw new Error("calculator did not print an initial total");
  }
  await page.fill("#gross", "10000");
  await page.waitForFunction(function () {
    return document.getElementById("total-stamp").textContent.indexOf("12004.98") !== -1;
  });
  const after = (await stamp.textContent()).trim();
  const box = await page.locator(".wrap").boundingBox();
  const stub = await page.locator("#stub").boundingBox();
  if (!box || box.width < 800 || box.height < 400) {
    throw new Error("page surface is not substantially filled: " + JSON.stringify(box));
  }
  if (!stub || stub.width < 200 || stub.height < 200) {
    throw new Error("stub is not drawn at the intended size");
  }
  await page.click("#lang-he");
  const dir = await page.evaluate(function () {
    return document.documentElement.dir;
  });
  const lang = await page.evaluate(function () {
    return document.documentElement.lang;
  });
  const heFields = await page.evaluate(function () {
    return {
      role: document.getElementById("role").value,
      severance: Array.from(document.querySelectorAll("#severance option")).map(function (o) { return o.textContent; }),
      pension: Array.from(document.querySelectorAll("#pension-base option")).map(function (o) { return o.textContent; }),
      grossLabel: document.getElementById("gross").closest("label").querySelector("span").textContent,
      formDir: getComputedStyle(document.getElementById("calc-form")).direction,
    };
  });
  if (dir !== "rtl" || lang !== "he") {
    throw new Error("Hebrew toggle did not switch the document to he/rtl");
  }
  if (heFields.role.indexOf("העובד") === -1) {
    throw new Error("role field stayed English: " + heFields.role);
  }
  if (heFields.severance.join(" ").indexOf("סעיף") === -1) {
    throw new Error("severance options stayed English: " + heFields.severance.join(" | "));
  }
  if (heFields.pension.join(" ").indexOf("ברוטו") === -1) {
    throw new Error("pension options stayed English: " + heFields.pension.join(" | "));
  }
  if (heFields.grossLabel.indexOf("ברוטו") === -1) {
    throw new Error("gross label stayed English: " + heFields.grossLabel);
  }
  if (heFields.formDir !== "rtl") {
    throw new Error("form is not RTL: " + heFields.formDir);
  }
  await page.screenshot({ path: screenshotPath, fullPage: true });
  if (errors.length) {
    throw new Error("page errors: " + errors.join(" | "));
  }
  console.log("probe_ok before=" + before + " after=" + after + " wrap=" + Math.round(box.width) + "x" + Math.round(box.height) + " he_rtl=1");
} finally {
  await browser.close();
  server.close();
}
