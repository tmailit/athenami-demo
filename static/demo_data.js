// athenami_demo/static/demo_data.js
// Central demo dataset for Actions (org-aware). Keep this reusable later for predictive/clusters/simulation.
//
// IMPORTANT (global doctrine for this demo build):
// - band tokens are intentionally kept as: green | yellow | gray
//   because multiple pages already map these exact strings to colors.
// - Conceptually, interpret these as:
//     green  = Decision-Ready (decision-grade)
//     yellow = Emerging Signal (business-friendly "Amber")
//     gray   = Learning / Insufficient (business-friendly "Red")
//
// This file is the single source of truth ("bible") for org-level demo facts.
// Renderers (actions/dashboard/predictive/etc.) should *read* from here, not recompute truth.

window.DEMO_ACTIONS_DATA = {
  democo: {
    org_label: "DemoCo",
    decision: { status: "Decision-Ready", band: "green", n: 2680, alpha: 0.78 },
    drivers: [
      { name: "Trust", r2: 0.31, n: 1640, reliable: true },
      { name: "Clarity", r2: 0.22, n: 1510, reliable: true },
      { name: "ROI Intent", r2: 0.17, n: 1320, reliable: true }
    ],
    psychographics: {
      profile_name: "Motivated Value Seekers",
      profile_description: "They respond strongly when the value is clear. Concrete benefits move them quickly.",
      constructs: [
        { label: "Trust", mean: 6.1 },
        { label: "Clarity", mean: 5.8 },
        { label: "Motivation", mean: 5.9 },
        { label: "ROI Intent", mean: 5.7 }
      ],
      segments: [
        { label: "Motivated Value Seekers", share: 0.62, note: "Strong intent when benefits are explicit." },
        { label: "Analytical Skeptics", share: 0.38, note: "Wants proof + clarity near CTA." }
      ]
    },
    recs: [
      {
        title: "Lead with outcomes (make the value explicit)",
        body: "Your strongest driver is ROI / intent. Make the outcome unmistakably clear in the subject line + first paragraph. Add one concrete before/after example."
      },
      {
        title: "Add proof near the CTA (reduce perceived risk)",
        body: "Trust is a top driver. Add a trust strip (logos/testimonial/guarantee) immediately above the primary CTA."
      },
      {
        title: "Simplify the offer structure",
        body: "Clarity is predictive. Use 3 bullets: what you get, how it works, what happens next. Remove secondary CTAs."
      },
      {
        title: "Segment the follow-up by psychographic pattern",
        body: "Send a proof-heavy variant to Analytical Skeptics and a value-heavy variant to Motivated Value Seekers."
      }
    ],
    expected_impact: { kpi: "click rate", conservative: 0.08, likely: 0.14, stretch: 0.22 }
  },

  hubspot: {
    org_label: "HubSpot",
    // Emerging (Amber concept): useful guidance + experiment steering, but not decision-grade
    decision: { status: "Emerging Signal", band: "yellow", n: 420, alpha: 0.66 },
    drivers: [
      { name: "Clarity", r2: 0.18, n: 410, reliable: false },
      { name: "Trust", r2: 0.13, n: 380, reliable: false },
      { name: "Motivation", r2: 0.10, n: 320, reliable: false }
    ],
    psychographics: {
      profile_name: "Confused but Curious",
      profile_description: "They trust the sender but don’t fully understand the offer. Clarity unlocks response.",
      constructs: [
        { label: "Trust", mean: 5.6 },
        { label: "Clarity", mean: 4.1 },
        { label: "Motivation", mean: 5.2 },
        { label: "ROI Intent", mean: 4.8 }
      ],
      segments: [
        { label: "Confused but Curious", share: 0.58, note: "Needs simplification + one clear ask." },
        { label: "Early-But-Skeptical", share: 0.42, note: "Understands value but wants proof." }
      ]
    },
    recs: [
      { title: "Tighten the message to one promise + one ask", body: "Clarity is the lever. Reduce copy. Use one core CTA, bold it, remove competing links." },
      { title: "Add a 2-step “how it works”", body: "Readers want to understand what happens next. Add: Step 1, Step 2, and the timeline." },
      { title: "Introduce a proof strip near CTA", body: "Trust is still emerging; add customer logos or a short testimonial above the CTA." }
    ],
    expected_impact: { kpi: "click rate", conservative: 0.03, likely: 0.06, stretch: 0.10 }
  },

  salesforce: {
    org_label: "Salesforce",
    // Learning (Red concept): clearly not decision-grade; show *some* guidance but emphasize collection
    decision: { status: "Learning Signal", band: "gray", n: 95, alpha: 0.52 },
    drivers: [
      { name: "Trust", r2: 0.09, n: 95, reliable: false },
      { name: "ROI Intent", r2: 0.06, n: 80, reliable: false },
      { name: "Clarity", r2: 0.05, n: 72, reliable: false }
    ],
    psychographics: {
      profile_name: "Early-But-Skeptical Adopters",
      profile_description: "They see the value but hesitate due to trust + uncertainty.",
      constructs: [
        { label: "Trust", mean: 4.6 },
        { label: "Clarity", mean: 5.2 },
        { label: "Motivation", mean: 4.4 },
        { label: "ROI Intent", mean: 4.7 }
      ],
      segments: [
        { label: "Early-But-Skeptical", share: 0.64, note: "Needs reassurance + what happens next." },
        { label: "Mixed Signal", share: 0.36, note: "Inconsistent patterns; keep collecting." }
      ]
    },
    recs: [
      { title: "Don’t over-optimize yet—collect more Tier-3", body: "Decision Readiness is not green. Use Tier-1/2 touches to drive more Tier-3 responses." },
      { title: "Add explicit reassurance + next steps", body: "Trust is weak. Add guarantee language and a 1-sentence ‘what happens next’ near CTA." }
    ],
    expected_impact: { kpi: "click rate", conservative: 0.01, likely: 0.03, stretch: 0.05 }
  },

  all: {
    org_label: "All orgs (pooled)",
    // Pooled view = aggregate of the three orgs. Higher n, but α still not decision-grade -> Emerging.
    decision: { status: "Pooled Signal", band: "yellow", n: 3195, alpha: 0.69 },
    drivers: [
      { name: "Trust", r2: 0.21, n: 2115, reliable: false },
      { name: "Clarity", r2: 0.19, n: 1990, reliable: false },
      { name: "ROI Intent", r2: 0.14, n: 1800, reliable: false }
    ],
    psychographics: {
      profile_name: "Blended Audience",
      profile_description: "A mixed pool; segmenting follow-ups will outperform blasting a single message.",
      constructs: [
        { label: "Trust", mean: 5.5 },
        { label: "Clarity", mean: 5.1 },
        { label: "Motivation", mean: 5.0 },
        { label: "ROI Intent", mean: 5.0 }
      ],
      segments: [
        { label: "Value Seekers", share: 0.52, note: "Responds to benefits and urgency." },
        { label: "Skeptics", share: 0.48, note: "Responds to proof and reassurance." }
      ]
    },
    recs: [
      { title: "Run 2-variant follow-ups by segment", body: "Value-heavy vs proof-heavy variants. This is the fastest way to lift performance across a blended audience." },
      { title: "Standardize the clarity checklist", body: "One promise, one CTA, 3 bullets explaining ‘how it works’." }
    ],
    expected_impact: { kpi: "click rate", conservative: 0.05, likely: 0.09, stretch: 0.14 }
  }
};

/**
 * Option A (Demo polish):
 * Normalize driver n's so they feel mechanically tied to decision.n (Tier-3 volume).
 * This prevents "random-looking" sample sizes across orgs/pages while staying demo-safe.
 *
 * Rules:
 * - Each org has a base Tier-3 volume: decision.n
 * - Driver n's become a consistent proportion of baseN (primary > secondary > tertiary)
 * - "reliable" is computed consistently from alpha + driver n (demo plausibility)
 *
 * NOTE: This ONLY normalizes counts + reliability flags. It does NOT change r2, means, segments, or recommendations.
 */
(function normalizeDemoActionsData() {
  const ratioDefaults = [0.90, 0.82, 0.72]; // primary/secondary/tertiary proportions of decision.n
  const MIN_DRIVER_N = 30;

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  Object.keys(window.DEMO_ACTIONS_DATA || {}).forEach((key) => {
    const org = window.DEMO_ACTIONS_DATA[key];
    const baseN = org?.decision?.n;
    if (!org || !baseN || !Array.isArray(org.drivers)) return;

    const alpha = typeof org.decision.alpha === "number" ? org.decision.alpha : null;

    org.drivers = org.drivers.map((d, i) => {
      const ratio = ratioDefaults[i] ?? 0.70;
      const target = Math.round(baseN * ratio);

      // If existing n is "plausible" keep it; otherwise normalize it.
      // "Plausible" here means: not larger than baseN and not oddly tiny vs baseN.
      const existing = typeof d.n === "number" ? d.n : null;
      const isPlausible =
        existing != null &&
        existing <= baseN &&
        existing >= Math.round(baseN * 0.45);

      const n = clamp(isPlausible ? existing : target, MIN_DRIVER_N, baseN);

      // Demo reliability: requires adequate n and decent alpha.
      // (This is intentionally simple and consistent.)
      const reliable = (alpha != null && alpha >= 0.70 && n >= 100);

      return { ...d, n, reliable };
    });
  });
})();
