# CostToHire IL

Standalone Israel employer-cost calculator and ₪149 dated briefing.

This is an information product operated from Israel. It is not accounting, legal, payroll, or tax advice.

## Customer

Public path: https://cost.vinesautomation.com/

Guides: [hire in Israel 2026](https://cost.vinesautomation.com/hire-in-israel-2026.html), [software engineer](https://cost.vinesautomation.com/employer-cost-software-engineer-israel.html), [first hire](https://cost.vinesautomation.com/employer-cost-first-hire-israel.html), [עלות מעסיק](https://cost.vinesautomation.com/alut-maasik-2026.html).

Embed: `<script src="https://cost.vinesautomation.com/embed.js" data-gross="18000"></script>`

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
