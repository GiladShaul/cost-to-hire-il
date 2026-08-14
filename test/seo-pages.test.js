"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const EmployerCost = require("../src/employerCost");
const { getSeoPages } = require("../src/seoPages");

const root = path.join(__dirname, "..");
const rates = JSON.parse(fs.readFileSync(path.join(root, "src", "rates.json"), "utf8"));

describe("acquisition SEO pages", function () {
  it("ships a page per catalog entry whose stamped total comes from the engine", function () {
    const pages = getSeoPages();
    assert.ok(pages.length >= 4);
    pages.forEach(function (page) {
      const file = path.join(root, page.slug + ".html");
      assert.equal(fs.existsSync(file), true, "missing " + page.slug);
      const html = fs.readFileSync(file, "utf8");
      const result = EmployerCost.computeEmployerCost(
        {
          grossIls: page.grossIls,
          roleLabel: page.role,
          locale: page.lang,
          seniorityYears: 0,
          severanceMode: "section14",
          pensionBaseMode: "gross",
        },
        rates
      );
      assert.match(html, new RegExp(page.h1.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
      assert.match(html, new RegExp(String(result.totalEmployerCostIls).replace(".", "\\.")));
      assert.match(html, /index\.html\?gross=/);
      assert.match(html, /Not accounting|אינו ייעוץ/);
    });
  });

  it("lists those pages in the sitemap and allows crawlers", function () {
    const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
    const robots = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
    getSeoPages().forEach(function (page) {
      assert.match(sitemap, new RegExp(page.slug + "\\.html"));
    });
    assert.match(robots, /Sitemap: https:\/\/cost\.vinesautomation\.com\/sitemap\.xml/);
  });

  it("publishes an embeddable calculator and partner snippet", function () {
    const embed = fs.readFileSync(path.join(root, "embed.html"), "utf8");
    const snippet = fs.readFileSync(path.join(root, "embed.js"), "utf8");
    assert.match(embed, /id="gross"/);
    assert.match(embed, /id="rates-data"/);
    assert.match(embed, /7703/);
    assert.match(snippet, /cost\.vinesautomation\.com/);
    assert.match(snippet, /embed\.html/);
  });

  it("has paste-ready community drafts that point at the live host", function () {
    const posts = fs.readFileSync(path.join(root, "docs/acquisition/community-posts.md"), "utf8");
    assert.match(posts, /https:\/\/cost\.vinesautomation\.com\/hire-in-israel-2026\.html/);
    assert.match(posts, /alut-maasik-2026/);
    assert.match(posts, /embed\.js/);
    assert.match(posts, /Not a substitute for an accountant|לא ייעוץ/);
  });
});
