# CostToHire IL

Standalone Israel employer-cost calculator and ₪149 dated briefing.

This is an information product operated from Israel. It is not accounting, legal, payroll, or tax advice.

## Customer

Public path: https://cost.vinesautomation.com/

Open that URL or local `index.html`. Enter a monthly gross salary. The stub prints the employer cost. “Preview the briefing format” downloads the delivery HTML. Live card checkout waits on the owner KYC tasks in `Owner_Task.md`.

## Agent / CLI

```
node src/cli.js calculate --gross 18000
node src/cli.js briefing --gross 18000 --out briefing.html
node src/cli.js offer
npm test
```

## Capital and owner work

See `DESIGN.md` and `Owner_Task.md`. Live card checkout waits on owner KYC. The public calculator does not.
