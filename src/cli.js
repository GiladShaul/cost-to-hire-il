#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const EmployerCost = require("./employerCost");
const Briefing = require("./briefing");
const Offer = require("./offer");

function loadRates() {
  const file = path.join(__dirname, "rates.json");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token.startsWith("--")) {
      const key = token.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) {
        args[key] = true;
      } else {
        args[key] = next;
        i += 1;
      }
    } else {
      args._.push(token);
    }
  }
  return args;
}

function inputFromArgs(args) {
  return {
    grossIls: args.gross,
    seniorityYears: args.seniority == null ? 0 : args.seniority,
    travelIls: args.travel == null ? 0 : args.travel,
    includeHishtalmut: Boolean(args.hishtalmut),
    includeHavraa: args["no-havraa"] ? false : true,
    severanceMode: args.severance === "mandatory" ? "mandatory" : "section14",
    pensionBaseMode: args.cap === "average" ? "average-wage-cap" : "gross",
    roleLabel: args.role || "",
    locale: args.locale === "he" ? "he" : "en",
  };
}

function printHelp() {
  const offer = Offer.getOffer();
  const text = [
    "CostToHire IL — " + offer.nameEn + " (" + Offer.formatPrice(offer.priceIls, offer.currency) + ")",
    "",
    "Usage:",
    "  node src/cli.js calculate --gross 12000 [--seniority 2] [--travel 200] [--hishtalmut] [--severance section14|mandatory] [--cap gross|average] [--role \"Engineer\"]",
    "  node src/cli.js briefing  --gross 12000 [--out file.html] [--sample]",
    "  node src/cli.js offer",
    "",
    "Delivery: " + offer.delivery,
  ].join("\n");
  process.stdout.write(text + "\n");
}

function main(argv) {
  const args = parseArgs(argv);
  const command = args._[0] || "help";
  if (command === "help" || args.help) {
    printHelp();
    return 0;
  }
  if (command === "offer") {
    process.stdout.write(JSON.stringify(Offer.describeOffer(args.locale), null, 2) + "\n");
    return 0;
  }
  const rates = loadRates();
  const input = inputFromArgs(args);
  if (command === "calculate") {
    const result = EmployerCost.computeEmployerCost(input, rates);
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
    return 0;
  }
  if (command === "briefing") {
    const pack = Briefing.generateBriefing(input, rates, {
      sample: Boolean(args.sample),
      generatedAt: args["generated-at"],
    });
    if (args.out) {
      const outPath = path.resolve(String(args.out));
      fs.writeFileSync(outPath, pack.html, "utf8");
      process.stdout.write("wrote " + outPath + "\n");
      process.stdout.write("totalEmployerCostIls=" + pack.json.result.totalEmployerCostIls + "\n");
    } else {
      process.stdout.write(pack.html + "\n");
    }
    return 0;
  }
  process.stderr.write("Unknown command: " + command + "\n");
  printHelp();
  return 2;
}

if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (err) {
    process.stderr.write(String(err && err.message ? err.message : err) + "\n");
    process.exitCode = 1;
  }
}

module.exports = { main, parseArgs, inputFromArgs, loadRates };
