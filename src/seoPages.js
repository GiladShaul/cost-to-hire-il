"use strict";

const PAGES = [
  {
    slug: "hire-in-israel-2026",
    lang: "en",
    title: "Cost to hire an employee in Israel (2026) — free calculator",
    description: "See the 2026 employer load on an Israeli salary: Bituach Leumi, pension, and severance. Free calculator, dated briefing from ₪149.",
    h1: "What does it cost to hire an employee in Israel in 2026?",
    grossIls: 18000,
    role: "First Israeli hire",
    lede: "Foreign companies and first-time Israeli employers usually budget the gross salary and miss the load. This page runs the same 2026 published-rate engine as CostToHire IL.",
    sections: [
      {
        heading: "What sits on top of gross",
        body: "For a salaried employee living in Israel the employer typically pays national insurance on two bands (reduced up to ₪7,703, full up to ₪51,910), at least 6.5% pension tagmulim, and either the 6% expansion-order severance minimum or an 8.33% Section 14 reserve. Travel and convalescence are planning lines, not always a monthly payroll statute.",
      },
      {
        heading: "This is not payroll software",
        body: "The numbers are an informational estimate from published National Insurance and expansion-order rates. They are not accounting, legal, or tax advice. Verify with a licensed accountant or payroll bureau before you make an offer.",
      },
    ],
  },
  {
    slug: "employer-cost-software-engineer-israel",
    lang: "en",
    title: "Employer cost for a software engineer in Israel (2026)",
    description: "Fully loaded 2026 employer cost for an Israeli software engineer at ₪28,000 gross. Free calculator and dated briefing.",
    h1: "Employer cost: software engineer in Israel at ₪28,000",
    grossIls: 28000,
    role: "Software engineer",
    lede: "A mid-level Israeli software-engineer offer is often quoted as gross. Finance will ask for the fully loaded shekel cost. This page prefills ₪28,000 and the 2026 statutory lines.",
    sections: [
      {
        heading: "Why ₪28,000",
        body: "It is a common planning band for a mid-level individual-contributor engineer in Israel in 2026. Change the salary on the calculator if your band is different. Pension and severance in this run use the full gross, not the average-wage cap.",
      },
      {
        heading: "What to send finance",
        body: "Use the free stub for a first look. The ₪149 briefing adds a 12-month cash table, first-year versus steady-state (convalescence), and a Section 14 versus 6% comparison with source links.",
      },
    ],
  },
  {
    slug: "employer-cost-first-hire-israel",
    lang: "en",
    title: "Cost of your first Israeli hire (2026 employer load)",
    description: "Budget the first employee in Israel: 2026 Bituach Leumi, pension, and severance on a ₪18,000 gross salary.",
    h1: "The real cost of a first Israeli hire",
    grossIls: 18000,
    role: "First Israeli hire",
    lede: "The first local hire is where foreign founders discover the load. This page prefills a ₪18,000 planning salary — above the April 2026 adult minimum wage of ₪6,443.85.",
    sections: [
      {
        heading: "First year versus year two",
        body: "Convalescence pay is not due in month one. After a completed year the private-sector day rate (₪418 on the cited Kol Zchut page) is amortized here as a planning figure. The briefing shows both years.",
      },
      {
        heading: "Section 14",
        body: "Many startups deposit 8.33% monthly instead of holding severance until the end. That is a commercial setting, not the expansion-order 6% minimum. Toggle it on the calculator.",
      },
    ],
  },
  {
    slug: "alut-maasik-2026",
    lang: "he",
    title: "עלות מעסיק 2026 — מחשבון חינם ותדריך מתוארך",
    description: "חישוב עלות מעסיק בישראל לפי שיעורי 2026: ביטוח לאומי, פנסיה ופיצויים. מחשבון חינם ותדריך ב־₪149.",
    h1: "כמה באמת עולה להעסיק עובד ב־2026?",
    grossIls: 18000,
    role: "העובד הישראלי הראשון",
    lede: "המחשבון מריץ את אותם שיעורים מפורסמים כמו CostToHire IL: ביטוח לאומי לשכירים, פנסיה חובה ופיצויים.",
    sections: [
      {
        heading: "מה נכלל",
        body: "ביטוח לאומי מעסיק בשתי מדרגות (עד ₪7,703 ובמדרגה המלאה עד ₪51,910), תגמולי מעסיק 6.5%, ופיצויים 6% או 8.33% לפי סעיף 14. דמי הבראה ונסיעות הם שורות תכנון.",
      },
      {
        heading: "זה אינו ייעוץ",
        body: "הסכומים הם הערכה מידעית. זה אינו ייעוץ חשבונאי, משפטי או שכר. יש לאמת מול רואה חשבון או משרד שכר לפני הצעת עבודה.",
      },
    ],
  },
];

function getSeoPages() {
  return PAGES.map(function (page) {
    return {
      slug: page.slug,
      lang: page.lang,
      title: page.title,
      description: page.description,
      h1: page.h1,
      grossIls: page.grossIls,
      role: page.role,
      lede: page.lede,
      sections: page.sections.map(function (section) {
        return { heading: section.heading, body: section.body };
      }),
    };
  });
}

function pageBySlug(slug) {
  const pages = getSeoPages();
  for (let i = 0; i < pages.length; i += 1) {
    if (pages[i].slug === slug) return pages[i];
  }
  return null;
}

module.exports = {
  getSeoPages: getSeoPages,
  pageBySlug: pageBySlug,
};
