// athenami_demo/static/demo_actions.js
(function () {
  const $ = (id) => document.getElementById(id);

  const orgPills = document.querySelectorAll(".org-pill");
  const tierSelect = $("tierSelect");
  const campaignInput = $("campaignInput");
  const refreshButton = $("refreshButton");
  const downloadReportButton = $("download-report-btn");

  const decisionStatusEl = $("decisionStatus");
  const decisionDetailEl = $("decisionDetail");
  const driverListEl = $("driverList");

  const scopeCampaignEl = $("scopeCampaign");
  const scopeTierEl = $("scopeTier");
  const scopeUpdatedEl = $("scopeUpdated");

  const psychographicProfileNameEl = $("psychographicProfileName");
  const psychographicSummaryEl = $("psychographicSummary");
  const psychographicListEl = $("psychographicList");

  const segmentPrimaryTitleEl = $("segmentPrimaryTitle");
  const segmentPrimaryShareEl = $("segmentPrimaryShare");
  const segmentPrimaryBodyEl = $("segmentPrimaryBody");
  const segmentSecondaryTitleEl = $("segmentSecondaryTitle");
  const segmentSecondaryShareEl = $("segmentSecondaryShare");
  const segmentSecondaryBodyEl = $("segmentSecondaryBody");

  const recommendationsContainer = $("recommendationsContainer");
  const summaryLiftEl = $("summaryLift");

  let activeOrg = "democo";

  function tierLabel(tier) {
    if (tier === 1) return "Basic";
    if (tier === 2) return "Growth";
    return "Enterprise";
  }

  function tierDescription(tier) {
    if (tier === 1) return "Simple reliability check + one main recommendation.";
    if (tier === 2) return "Enhanced insights: multiple drivers, 2–3 recommendations, lift estimates.";
    return "Full executive pack: deep insights, optimization guidance, and ROI estimates.";
  }

  function setActiveOrg(org) {
    activeOrg = org;

    orgPills.forEach((pill) => {
      const isActive = (pill.getAttribute("data-org") || "") === org;
      pill.classList.toggle("org-pill-active", isActive);

      if (isActive) {
        pill.classList.add("bg-emerald-500", "text-slate-950", "shadow-sm", "shadow-emerald-500/40");
      } else {
        pill.classList.remove("bg-emerald-500", "text-slate-950", "shadow-sm", "shadow-emerald-500/40");
      }
    });

    render();
  }

  function formatR2(r2) {
    if (typeof r2 !== "number") return "—";
    return String(r2.toFixed(2)).replace(/^0/, "");
  }

  function safeNumber(n) {
    const x = Number(n);
    return Number.isFinite(x) ? x : 0;
  }

  function setDecisionColor(band) {
    // Green/Amber/Red (demo-friendly)
    decisionStatusEl.classList.remove("text-emerald-300", "text-amber-300", "text-rose-300");
    if (band === "green") decisionStatusEl.classList.add("text-emerald-300");
    else if (band === "yellow") decisionStatusEl.classList.add("text-amber-300");
    else decisionStatusEl.classList.add("text-rose-300");
  }

  function driverStatus(alpha, n, idx) {
    // idx: 0 primary, 1 secondary, 2 tertiary
    // Goal: let Primary become "Emerging" in HubSpot-like cases (alpha ~.66, n 300-400),
    // while keeping others directional unless truly decision-grade.
    const nn = safeNumber(n);

    // Decision-grade: consistent + enough signal
    if (alpha != null && alpha >= 0.70 && nn >= 100) return "Reliable";

    // Emerging: needs decent volume AND at least moderate consistency.
    // Make Primary easier to promote to Emerging than Secondary/Tertiary.
    const minN = idx === 0 ? 250 : 320;
    const minAlpha = 0.62;

    if (alpha != null && alpha >= minAlpha && nn >= minN) return "Emerging";

    return "Directional";
  }

  function statusClass(status) {
    if (status === "Reliable") return "text-emerald-300";
    if (status === "Emerging") return "text-amber-300";
    return "text-slate-400";
  }

  function render() {
    const tier = parseInt(tierSelect.value || "3", 10) || 3;
    const campaign = (campaignInput.value || "").trim() || "All";
    const data =
      (window.DEMO_ACTIONS_DATA && window.DEMO_ACTIONS_DATA[activeOrg]) ||
      (window.DEMO_ACTIONS_DATA && window.DEMO_ACTIONS_DATA.democo);

    if (!data) return;

    // Scope
    scopeCampaignEl.innerHTML = `Campaign: <span class="font-medium text-sky-300">${campaign}</span>`;
    scopeTierEl.innerHTML =
      `Subscription: <span class="font-medium text-sky-300">${tierLabel(tier)}</span> – ` +
      `<span class="text-slate-400">${tierDescription(tier)}</span>`;
    scopeUpdatedEl.textContent = `Last updated: ${new Date().toLocaleString()}`;

    // Decision readiness
    const band = String(data.decision?.band || "gray").toLowerCase();
    setDecisionColor(band);

    decisionStatusEl.textContent = data.decision?.status || "—";
    const n = data.decision?.n ?? "—";
    const alpha = (typeof data.decision?.alpha === "number") ? data.decision.alpha : null;

    let detail = `Tier-3 volume for this org: n = ${Number(n).toLocaleString()}.`;
    if (alpha != null) detail += ` Cronbach’s α ≈ ${alpha.toFixed(2)}.`;
    if (band === "green") detail += " You can safely plan and prioritize using these signals.";
    if (band === "yellow") detail += " Use these insights to steer experiments while collecting more Tier-3.";
    if (band === "gray") detail += " Treat these as directional until Decision Readiness improves.";

    decisionDetailEl.textContent = detail;

    // Drivers
    const drivers = Array.isArray(data.drivers) ? data.drivers : [];
    if (!drivers.length) {
      driverListEl.innerHTML = "<li>No construct-level predictive data available yet.</li>";
    } else {
      driverListEl.innerHTML = drivers.slice(0, 3).map((d, idx) => {
        const rank = idx === 0 ? "Primary" : idx === 1 ? "Secondary" : "Tertiary";
        const r2 = formatR2(d.r2);
        const dn = safeNumber(d.n);

        const status = driverStatus(alpha, dn, idx);
        const relClass = statusClass(status);

        return (
          `<li>` +
            `<span class="font-semibold text-slate-100">${rank}:</span> ${d.name} ` +
            `<span class="text-slate-400">(R² ${r2}, n=${dn.toLocaleString()})</span> ` +
            `<span class="text-[11px] ${relClass}">• ${status}</span>` +
          `</li>`
        );
      }).join("");
    }

    // Psychographics
    const p = data.psychographics || {};
    psychographicProfileNameEl.textContent = `Audience profile: ${p.profile_name || "—"}`;
    psychographicSummaryEl.textContent = p.profile_description || "Loading psychographic profile…";

    const constructs = Array.isArray(p.constructs) ? p.constructs : [];
    psychographicListEl.innerHTML = constructs.map((c) => {
      const mean = typeof c.mean === "number" ? c.mean : null;
      const level = mean == null ? "—" : mean >= 5.5 ? "High" : mean >= 4.0 ? "Medium" : "Low";
      return `<li><span class="font-semibold text-slate-100">${c.label}:</span> ${level}${mean != null ? ` (avg ${mean.toFixed(1)})` : ""}</li>`;
    }).join("");

    const segs = Array.isArray(p.segments) ? p.segments : [];
    if (segs.length) {
      const a = segs[0], b = segs[1] || null;
      segmentPrimaryTitleEl.textContent = `Primary segment: ${a.label}`;
      segmentPrimaryShareEl.textContent = `Share: ${(a.share * 100).toFixed(0)}%`;
      segmentPrimaryBodyEl.textContent = a.note || "";

      if (b) {
        segmentSecondaryTitleEl.textContent = `Secondary segment: ${b.label}`;
        segmentSecondaryShareEl.textContent = `Share: ${(b.share * 100).toFixed(0)}%`;
        segmentSecondaryBodyEl.textContent = b.note || "";
      } else {
        segmentSecondaryTitleEl.textContent = "Secondary segment";
        segmentSecondaryShareEl.textContent = "Share: —";
        segmentSecondaryBodyEl.textContent = "";
      }
    } else {
      segmentPrimaryTitleEl.textContent = "Primary segment";
      segmentPrimaryShareEl.textContent = "Share: —";
      segmentPrimaryBodyEl.textContent = "";
      segmentSecondaryTitleEl.textContent = "Secondary segment";
      segmentSecondaryShareEl.textContent = "Share: —";
      segmentSecondaryBodyEl.textContent = "";
    }

    // Recommendations (tier-limited)
    const recs = Array.isArray(data.recs) ? data.recs : [];
    let maxRecs = tier === 1 ? 1 : tier === 2 ? 3 : 4;
    const show = recs.slice(0, maxRecs);

    recommendationsContainer.innerHTML = show.length
      ? show.map((r) => (
          `<article class="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-1">` +
          `<h3 class="text-sm font-semibold text-slate-100">${r.title}</h3>` +
          `<p class="text-xs text-slate-300">${r.body}</p>` +
          `</article>`
        )).join("")
      : `<div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-300">
           Once VeriTechIQ has more Tier-3 data, it will generate targeted recommendations here.
         </div>`;

    // Expected impact
    const imp = data.expected_impact || null;
    if (imp && typeof imp.conservative === "number" && typeof imp.stretch === "number") {
      const c = Math.round(imp.conservative * 100);
      const s = Math.round(imp.stretch * 100);
      summaryLiftEl.textContent = `Expected impact: ~${c}–${s}% lift in ${imp.kpi || "primary KPI"} when changes are implemented.`;
    } else {
      summaryLiftEl.textContent = "Expected impact: —";
    }
  }

  // Wire org pills
  orgPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const org = pill.getAttribute("data-org") || "democo";
      setActiveOrg(org);
    });
  });

  // Wire controls
  refreshButton.addEventListener("click", render);
  tierSelect.addEventListener("change", render);
  campaignInput.addEventListener("keydown", (e) => { if (e.key === "Enter") render(); });

  if (downloadReportButton) {
    downloadReportButton.addEventListener("click", () => {
      alert("Demo only — PDF report export will be wired after Actions is stable in athenami_demo.");
    });
  }

  // Init
  setActiveOrg(activeOrg);
})();
