/* Markhor — demo application layer (client-side SPA, localStorage).
   A product DEMO: no real money, no real custody, no real KYC. */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const PKR = n => "PKR " + Math.round(n).toLocaleString("en-US");
  const RS = n => "₨" + Math.round(n).toLocaleString("en-US");
  let FX = 279; const FXR = { USD: 279, GBP: 354, AED: 76, EUR: 302 };

  // ---------- catalogue ----------
  const MARKETS = {
    phf: {
      name: "Hockey Supporter Token", cat: "Federation", icon: "i-fed", img: "assets/img/c-hockey.jpg", video: "D7fUmNojOLg",
      tag: "Back the national side's return to the World Cup.", min: 1000, funded: 62, holders: 8420, change: 4.1,
      headline: "62%", headlbl: "of a PKR 100M cap raised",
      overview: "A capped, disclosed supporter token issued by the federation, timed to the August World Cup. Proceeds are ring-fenced to a published slate and tracked, line by line, on a public dashboard.",
      terms: [["Instrument", "Supporter token"], ["Issuance cap", "PKR 100,000,000"], ["Raised so far", "PKR 62,000,000"], ["Min. investment", "PKR 1,000"], ["Lock-up", "None"], ["Escrow", "Released on milestones"], ["Earns via", "Issuance fee + dashboard"]],
      slate: [["World Cup preparation", 45], ["Two junior academies", 30], ["Women's hockey", 25]],
      proof: ["Capped & disclosed under SECP rules", "Proceeds ring-fenced to a published slate", "7-day cooling-off period", "On-chain audit log, filed quarterly"],
    },
    javelin: {
      name: "Javelin Career Share", cat: "Athlete share", icon: "i-ath", img: "assets/img/c-javelin.jpg", video: "Ft5of0G-OHo",
      tag: "A regulated share in an emerging athlete's future.", min: 1000, funded: 78, holders: 1240, change: 9.0,
      headline: "78%", headlbl: "funded · +9.0%",
      overview: "A small, regulated share in a young track athlete's future earnings, structured under SECP equity-crowdfunding rules. Funds are escrowed and released against training milestones.",
      terms: [["Instrument", "Career-share"], ["Round size", "PKR 4,000,000"], ["Funded", "78%"], ["Min. investment", "PKR 1,000"], ["Vesting", "Multi-year"], ["Escrow", "Milestone-based"], ["Earns via", "Performance carry"]],
      slate: [["Coaching & training", 50], ["Equipment & travel", 30], ["Education fund", 20]],
      proof: ["SECP investor-protection rules apply", "Backers' rights survive disengagement", "Escrow against milestone delivery", "Independent valuation on issuance"],
    },
    drama: {
      name: "Drama Royalty", cat: "Cultural royalty", icon: "i-film", img: "assets/img/c-drama.jpg", video: "X20tWrpYAA4",
      tag: "Own a slice of a serial's royalties.", min: 1000, funded: 0, holders: 3110, change: 6.2,
      headline: "12.4%", headlbl: "royalty share · monthly",
      overview: "Hold a share of a flagship drama's royalties. Splits run on-chain across writer, cast and backers, and pay you each month as it streams worldwide — with the IP domiciled in Pakistan.",
      terms: [["Instrument", "Royalty right (NFT)"], ["Royalty share", "12.4%"], ["Payouts", "Monthly, on-chain"], ["Min. investment", "PKR 1,000"], ["IP domicile", "Pakistan"], ["Term", "Rolling"], ["Earns via", "Streaming revenue"]],
      slate: [["Writer & story", 35], ["Cast", 35], ["Production house", 30]],
      proof: ["Pakistan-domiciled IP rail", "Splits enforced on-chain, not on paper", "Compatible with global streaming reporting", "Transparent monthly statements"],
    },
    ticket: {
      name: "Hockey vs India · group stage", cat: "Ticketing", icon: "i-ticket", img: "assets/img/c-ticket.jpg", video: "D7fUmNojOLg",
      tag: "A programmable ticket with real provenance.", min: 3500, funded: 0, holders: 0, change: 0,
      headline: "₨3,500", headlbl: "from · August fixture",
      overview: "A programmable ticket with verifiable provenance. Resale rules and an anti-scalping cap are written into the contract itself, and settlement clears to the federation in real time.",
      terms: [["Instrument", "Programmable ticket"], ["From", "PKR 3,500"], ["Fixture", "August, group stage"], ["Resale", "Capped, on-chain"], ["Provenance", "Verifiable"], ["Settlement", "Real-time"], ["Earns via", "Per-ticket fee"]],
      slate: [["Federation", 88], ["Operator fee", 7], ["Insurance pool", 5]],
      proof: ["Anti-scalping cap in the contract", "Verifiable ownership history", "Instant settlement to the federation", "No paper, no touts"],
    },
    music: {
      name: "Single Royalty", cat: "Music royalty", icon: "i-music", img: "assets/img/c-music.jpg", video: "5Eqb_-j3FDA",
      tag: "A share of a new release's streaming revenue.", min: 1000, funded: 0, holders: 2050, change: 6.8,
      headline: "8.0%", headlbl: "revenue share",
      overview: "Own a share of a new single's streaming revenue. The split between artist, label and backers is enforced on-chain, paid as it streams, and routed through Pakistani rails.",
      terms: [["Instrument", "Royalty right (NFT)"], ["Revenue share", "8.0%"], ["Payouts", "Monthly"], ["Min. investment", "PKR 1,000"], ["Reach", "Global streaming"], ["Term", "Rolling"], ["Earns via", "Streaming revenue"]],
      slate: [["Artist", 55], ["Label", 25], ["Backers", 20]],
      proof: ["Artist-friendly splits", "On-chain enforcement", "Pakistan-domiciled royalty rail", "Monthly streaming statements"],
    },
  };
  const ORDER = ["phf", "javelin", "drama", "ticket", "music"];
  const CATCOL = { Federation: "#0E4D34", "Athlete share": "#B8924D", "Cultural royalty": "#3f8a63", Ticketing: "#7a5cc0", "Music royalty": "#caa463" };

  // ---------- live market engine ----------
  const LIVE = {};
  ORDER.forEach((id, i) => { const c = MARKETS[id].change || 0; LIVE[id] = { mult: 1 + c / 100, day: c, price: 80 + (i * 37 % 90) }; });
  function tick() {
    ORDER.forEach(id => { const L = LIVE[id]; const n = (Math.random() - 0.5) * 0.0045; L.mult = Math.min(3, Math.max(0.4, L.mult * (1 + n))); L.day = Math.max(-12, Math.min(22, L.day * 0.985 + n * 220)); L.price = Math.max(1, L.price * (1 + n)); });
    paintLive();
  }
  function paintLive() {
    document.querySelectorAll("[data-live-change]").forEach(el => { const d = LIVE[el.dataset.liveChange].day, up = d >= 0, s = (up ? "+" : "") + d.toFixed(2) + "%"; if (el.textContent !== s) { el.textContent = s; el.style.color = up ? "#3f8a63" : "#c0533b"; el.animate && el.animate([{ opacity: .35 }, { opacity: 1 }], 350); } });
    document.querySelectorAll("[data-live-price]").forEach(el => { el.textContent = "₨" + Math.round(LIVE[el.dataset.livePrice].price * 100).toLocaleString("en-US"); });
    document.querySelectorAll("[data-obook]").forEach(el => el.innerHTML = orderBookHTML(el.dataset.obook));
    if (appEl) {
      const inv = S.holdings.reduce((a, x) => a + x.amount * LIVE[x.id].mult, 0), cost = S.holdings.reduce((a, x) => a + x.amount, 0);
      const total = inv + S.balance, ret = inv - cost, gp = cost ? ret / cost * 100 : 0;
      document.querySelectorAll('[data-live="total"]').forEach(el => el.textContent = PKR(total));
      document.querySelectorAll('[data-live="ret"]').forEach(el => el.textContent = PKR(ret));
      document.querySelectorAll('[data-live="retd"]').forEach(el => { el.textContent = (ret >= 0 ? "+" : "−") + RS(Math.abs(ret)); el.className = "dd " + (ret >= 0 ? "mk-up" : "mk-dn"); });
      document.querySelectorAll('[data-live="gp"]').forEach(el => { el.textContent = (gp >= 0 ? "▲" : "▼") + " " + Math.abs(gp).toFixed(2) + "% all-time"; el.className = "dd " + (gp >= 0 ? "mk-up" : "mk-dn"); });
      document.querySelectorAll("[data-hv]").forEach(el => el.textContent = PKR((+el.dataset.amt) * LIVE[el.dataset.hv].mult));
    }
  }
  function orderBookHTML(id) {
    const p = LIVE[id].price * 100, rows = [], t = Date.now() / 2600;
    for (let i = 5; i >= 1; i--) rows.push(["ask", p * (1 + i * 0.0045), Math.round(70 + (i * 53 % 260) + Math.sin(t + i) * 45)]);
    rows.push(["mid", p, null]);
    for (let i = 1; i <= 5; i++) rows.push(["bid", p * (1 - i * 0.0045), Math.round(70 + (i * 67 % 260) + Math.cos(t + i) * 45)]);
    const mx = Math.max.apply(null, rows.filter(r => r[2]).map(r => r[2]));
    return rows.map(r => r[0] === "mid"
      ? `<div style="display:flex;justify-content:space-between;padding:8px 6px;border-top:1px solid rgba(35,33,28,.12);border-bottom:1px solid rgba(35,33,28,.12);font:700 13px 'JetBrains Mono';color:var(--emerald)"><span>Mid</span><span>₨${Math.round(r[1]).toLocaleString("en-US")}</span></div>`
      : `<div style="position:relative;display:flex;justify-content:space-between;padding:4px 6px;font:500 12px 'JetBrains Mono'"><span style="position:absolute;${r[0] === "ask" ? "right" : "left"}:0;top:1px;bottom:1px;width:${(r[2] / mx * 62).toFixed(0)}%;background:${r[0] === "ask" ? "rgba(192,83,59,.1)" : "rgba(63,138,99,.1)"};border-radius:3px"></span><span style="position:relative;color:${r[0] === "ask" ? "#c0533b" : "#3f8a63"}">₨${Math.round(r[1]).toLocaleString("en-US")}</span><span style="position:relative;color:var(--ink-soft)">${r[2]}</span></div>`).join("");
  }
  // interactive chart scrub
  function wireChart(box, pts, lo, hi) {
    const cv = $(".mk-chart", box); if (!cv) return;
    const tip = document.createElement("div"); tip.style.cssText = "position:absolute;pointer-events:none;background:var(--emerald);color:#F4EEE2;font:600 11px 'JetBrains Mono';padding:4px 8px;border-radius:6px;transform:translate(-50%,-130%);opacity:0;white-space:nowrap;z-index:6";
    const ln = document.createElement("div"); ln.style.cssText = "position:absolute;top:0;bottom:18px;width:1px;background:rgba(35,33,28,.25);opacity:0;pointer-events:none";
    cv.appendChild(tip); cv.appendChild(ln);
    const move = e => { const r = cv.getBoundingClientRect(); const x = ((e.touches ? e.touches[0].clientX : e.clientX) - r.left) / r.width; const i = Math.max(0, Math.min(pts.length - 1, Math.round(x * (pts.length - 1)))); const px = i / (pts.length - 1) * 100, py = (1 - (pts[i] - lo) / (hi - lo)) * (1 - 18 / r.height) * 100; tip.style.left = px + "%"; tip.style.top = py + "%"; tip.textContent = RS(pts[i]); ln.style.left = px + "%"; tip.style.opacity = ln.style.opacity = 1; };
    const out = () => { tip.style.opacity = ln.style.opacity = 0; };
    cv.addEventListener("mousemove", move); cv.addEventListener("mouseleave", out); cv.addEventListener("touchmove", move, { passive: true }); cv.addEventListener("touchend", out);
  }
  // ambient community feed + notifications
  const NAMES = ["Ayesha in Dubai", "Rehan in London", "Sana in Toronto", "Bilal in Karachi", "Maryam in Doha", "Faisal in Manchester", "Imran in New York", "Zara in Riyadh", "Hamza in Sydney"];
  function randEvent() { const n = NAMES[Math.floor(Math.random() * NAMES.length)], m = MARKETS[ORDER[Math.floor(Math.random() * ORDER.length)]], A = [["backed", m.name], ["bought", m.name], ["topped up their wallet", ""], ["claimed a royalty payout", ""], ["set a price alert on", m.name]], a = A[Math.floor(Math.random() * A.length)]; return { name: n, act: a[0], obj: a[1] }; }
  function pushComm() { const f = appEl && $("#commFeed", appEl); if (!f) return; const e = randEvent(), row = document.createElement("div"); row.className = "mk-feed"; row.style.opacity = 0; row.innerHTML = `<div class="av">${e.name[0]}</div><div class="tx"><b>${e.name}</b> ${e.act}${e.obj ? ` <b>${e.obj}</b>` : ""}.</div><div class="tm">now</div>`; f.insertBefore(row, f.firstChild); requestAnimationFrame(() => { row.style.transition = "opacity .5s"; row.style.opacity = 1; }); while (f.children.length > 9) f.lastChild.remove(); }
  const ALERTS = [() => ({ t: "Price alert", b: MARKETS.music.name + " is " + (LIVE.music.day >= 0 ? "up " : "down ") + Math.abs(LIVE.music.day).toFixed(1) + "% today." }), () => ({ t: "Royalty incoming", b: "A payout from " + MARKETS.drama.name + " is being prepared." }), () => ({ t: "New listing soon", b: "A squash career-share opens next week." }), () => ({ t: "Market moved", b: MARKETS.phf.name + " just crossed a new high." })];
  let _amb = 0;
  function ambient() { if (!appEl) return; if (appView === "activity") pushComm(); _amb++; if (_amb % 2 === 0 && Math.random() < 0.75) { const a = ALERTS[Math.floor(Math.random() * ALERTS.length)](); notify(a.t, a.b); if (appView !== "activity" && Math.random() < 0.45) toast(a.t); } }
  setInterval(tick, 2500); setInterval(ambient, 8000);

  // ---------- state ----------
  const J = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const S = {
    get user() { return J("mk_user", null); }, set user(v) { v ? localStorage.setItem("mk_user", JSON.stringify(v)) : localStorage.removeItem("mk_user"); },
    get holdings() { return J("mk_holdings", []); }, set holdings(v) { localStorage.setItem("mk_holdings", JSON.stringify(v)); },
    get balance() { return J("mk_balance", 0); }, set balance(v) { localStorage.setItem("mk_balance", JSON.stringify(Math.round(v))); },
    get watch() { return J("mk_watch", []); }, set watch(v) { localStorage.setItem("mk_watch", JSON.stringify(v)); },
    get txns() { return J("mk_txns", []); }, set txns(v) { localStorage.setItem("mk_txns", JSON.stringify(v)); },
    get alerts() { return J("mk_alerts", []); }, set alerts(v) { localStorage.setItem("mk_alerts", JSON.stringify(v)); },
    get recurring() { return J("mk_recurring", []); }, set recurring(v) { localStorage.setItem("mk_recurring", JSON.stringify(v)); },
    get votes() { return J("mk_votes", {}); }, set votes(v) { localStorage.setItem("mk_votes", JSON.stringify(v)); },
    get notifs() { return J("mk_notifs", []); }, set notifs(v) { localStorage.setItem("mk_notifs", JSON.stringify(v)); },
  };
  const enrich = x => { const m = (LIVE[x.id] || { mult: 1.03 }).mult; return Object.assign({}, x, { gain: (m - 1) * 100, value: x.amount * m }); };
  const addTxn = (type, label, amount) => { const t = S.txns; t.unshift({ type, label, amount, ts: Date.now() }); S.txns = t.slice(0, 50); };
  const relTime = ts => { const s = (Date.now() - ts) / 1000; if (s < 60) return "just now"; if (s < 3600) return Math.floor(s / 60) + "m ago"; if (s < 86400) return Math.floor(s / 3600) + "h ago"; return Math.floor(s / 86400) + "d ago"; };

  const ICO = {
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7a4 4 0 018 0v3.5"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 12 10 18 20 6"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><polygon points="12 3 14.5 8.5 20.5 9.3 16 13.5 17.2 19.5 12 16.5 6.8 19.5 8 13.5 3.5 9.3 9.5 8.5"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11l8-6 8 6v8a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1z"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/></svg>',
    wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 012-2h13a2 2 0 012 2M3 7v10a2 2 0 002 2h14a2 2 0 002-2v-6a2 2 0 00-2-2H6"/><circle cx="17" cy="13" r="1.3"/></svg>',
    act: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l3 8 4-16 3 8h4"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.6"/><path d="M5 20a7 7 0 0114 0"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 2.5v5.6c0 4.3-3 7.2-7 8.9-4-1.7-7-4.6-7-8.9V5.5z"/><polyline points="9 12 11 14 15 9.5"/></svg>',
  };

  // ---------- styles ----------
  const st = document.createElement("style"); st.textContent = `
  .mk-ov{position:fixed;inset:0;z-index:1000;background:rgba(7,38,25,.55);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .22s}
  .mk-ov.in{opacity:1}
  .mk-sheet{background:var(--paper,#FBF7EE);color:var(--ink,#23211c);width:100%;max-width:440px;border-radius:18px;box-shadow:0 40px 90px -30px rgba(0,0,0,.6);overflow:hidden;transform:translateY(14px) scale(.99);transition:transform .26s cubic-bezier(.2,.8,.2,1);max-height:94vh;display:flex;flex-direction:column}
  .mk-ov.in .mk-sheet{transform:none}
  .mk-top{position:relative;padding:24px 26px 0}
  .mk-x{position:absolute;top:15px;right:15px;width:34px;height:34px;border:none;border-radius:50%;background:rgba(35,33,28,.06);color:var(--ink);font-size:18px;cursor:pointer;line-height:1}
  .mk-x:hover{background:rgba(35,33,28,.12)}
  .mk-ey{font:600 11px 'Hanken Grotesk',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--brass,#B8924D)}
  .mk-h{font-family:'Bodoni Moda',Georgia,serif;font-weight:600;font-size:25px;color:var(--emerald,#0E4D34);margin:9px 0 4px;line-height:1.12}
  .mk-sub{font-size:14px;color:var(--ink-soft,#56524a)}
  .mk-body{padding:18px 26px 26px;overflow:auto}
  .mk-lbl{display:block;font:600 12px 'Hanken Grotesk',sans-serif;color:var(--ink-soft);margin:14px 0 6px}
  .mk-in{width:100%;font:400 15px 'Hanken Grotesk',sans-serif;color:var(--ink);background:#fff;border:1px solid rgba(35,33,28,.16);border-radius:9px;padding:13px 14px;outline:none;transition:border-color .2s}
  .mk-in:focus{border-color:var(--brass)} .mk-in.bad{border-color:#c0533b}
  .mk-row{display:flex;gap:10px}.mk-row>*{flex:1}
  .mk-btn{width:100%;font:600 15px 'Hanken Grotesk',sans-serif;border:none;border-radius:9px;padding:14px;cursor:pointer;transition:.18s;margin-top:16px;display:flex;align-items:center;justify-content:center;gap:9px}
  .mk-btn.pri{background:var(--brass);color:#072619}.mk-btn.pri:hover{background:var(--brass-2,#caa463)}.mk-btn.pri:disabled{opacity:.6}
  .mk-btn.gho{background:transparent;border:1px solid rgba(35,33,28,.16);color:var(--emerald);margin-top:9px}
  .mk-btn.gho:hover{border-color:var(--emerald)}
  .mk-tabs{display:flex;gap:6px;background:rgba(35,33,28,.05);border-radius:10px;padding:4px;margin-top:14px}
  .mk-tabs button{flex:1;border:none;background:none;font:600 13px 'Hanken Grotesk',sans-serif;color:var(--ink-soft);padding:9px;border-radius:7px;cursor:pointer}
  .mk-tabs button.on{background:#fff;color:var(--emerald);box-shadow:0 1px 4px rgba(0,0,0,.08)}
  .mk-chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
  .mk-chip{border:1px solid rgba(35,33,28,.16);background:#fff;border-radius:30px;padding:9px 15px;font:600 13px 'Hanken Grotesk',sans-serif;cursor:pointer;color:var(--ink);font-variant-numeric:tabular-nums}
  .mk-chip.on{background:var(--emerald);color:#fff;border-color:var(--emerald)}
  .mk-cv{background:linear-gradient(135deg,#0e4d34,#072619);border-radius:13px;padding:18px;color:#F4EEE2;margin:6px 0 4px;box-shadow:inset 0 0 0 1px rgba(216,181,115,.2)}
  .mk-cv .brand{display:flex;justify-content:space-between;align-items:center;font:700 14px 'Bodoni Moda',serif;letter-spacing:.12em}
  .mk-cv .no{font-family:'JetBrains Mono',monospace;font-size:16px;letter-spacing:.06em;margin-top:20px;color:#e9e1cf}
  .mk-cv .ft{display:flex;justify-content:space-between;font:500 10px 'Hanken Grotesk',sans-serif;letter-spacing:.06em;text-transform:uppercase;color:rgba(244,238,226,.65);margin-top:13px}
  .mk-secure{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--ink-soft);margin-top:14px;justify-content:center}.mk-secure svg{width:14px;height:14px}
  .mk-spin{width:18px;height:18px;border:2px solid rgba(7,38,25,.3);border-top-color:#072619;border-radius:50%;animation:mkspin .7s linear infinite}@keyframes mkspin{to{transform:rotate(360deg)}}
  .mk-ok .tick{width:64px;height:64px;border-radius:50%;background:var(--emerald);display:flex;align-items:center;justify-content:center;margin:6px auto 16px;animation:mkpop .4s cubic-bezier(.2,1.4,.4,1)}.mk-ok .tick svg{width:30px;height:30px;color:#fff}@keyframes mkpop{from{transform:scale(.5);opacity:0}}
  .mk-note{font-size:12px;color:var(--ink-soft);opacity:.9;margin-top:10px;line-height:1.5}
  .mk-toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%) translateY(20px);z-index:1200;background:var(--ink,#23211c);color:#F4EEE2;font:500 13.5px 'Hanken Grotesk',sans-serif;padding:13px 20px;border-radius:30px;box-shadow:0 14px 40px rgba(0,0,0,.4);opacity:0;transition:.3s;display:flex;align-items:center;gap:9px;max-width:90vw}
  .mk-toast.in{opacity:1;transform:translateX(-50%)}.mk-toast .d{width:7px;height:7px;border-radius:50%;background:#d8b573}
  .mk-av{width:30px;height:30px;border-radius:50%;background:var(--brass);color:#072619;display:flex;align-items:center;justify-content:center;font:700 13px 'Bodoni Moda',serif}
  /* app shell */
  html.mk-locked,html.mk-locked body{overflow:hidden!important;touch-action:none}
  .mk-app{position:fixed;inset:0;z-index:1000;background:var(--bone,#F4EEE2);display:flex;opacity:0;transition:opacity .25s}
  .mk-app.in{opacity:1}
  .mk-side{width:230px;flex:none;background:var(--emerald-deep,#0a3a27);color:var(--bone-dim,#cfd8d2);display:flex;flex-direction:column;padding:18px 14px}
  .mk-side .sb{display:flex;align-items:center;gap:9px;padding:6px 8px 18px}
  .mk-side .sb img{height:26px}.mk-side .sb b{font-family:'Bodoni Moda',serif;font-weight:700;font-size:17px;letter-spacing:.1em;color:#F4EEE2}
  .mk-nav{display:flex;flex-direction:column;gap:3px}
  .mk-nav a{display:flex;align-items:center;gap:11px;padding:11px 12px;border-radius:9px;font:600 14px 'Hanken Grotesk',sans-serif;color:rgba(244,238,226,.66);cursor:pointer;text-decoration:none;transition:.15s}
  .mk-nav a svg{width:18px;height:18px}
  .mk-nav a:hover{color:#F4EEE2;background:rgba(244,238,226,.06)}
  .mk-nav a.on{color:#072619;background:var(--brass,#B8924D)}
  .mk-side .sf{margin-top:auto;padding:10px 8px}
  .mk-side .sf .who{display:flex;align-items:center;gap:9px;font-size:13px;color:rgba(244,238,226,.8)}
  .mk-side .sf button{margin-top:10px;width:100%;background:rgba(244,238,226,.06);border:1px solid rgba(244,238,226,.14);color:rgba(244,238,226,.8);border-radius:8px;padding:9px;font:600 12.5px 'Hanken Grotesk';cursor:pointer}
  .mk-main{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch}
  .mk-tbar{position:sticky;top:0;z-index:5;background:rgba(244,238,226,.92);backdrop-filter:blur(12px);border-bottom:1px solid rgba(35,33,28,.08);display:flex;align-items:center;gap:12px;padding:13px 24px}
  .mk-tbar h3{font-family:'Bodoni Moda',serif;font-weight:600;font-size:19px;color:var(--emerald)}
  .mk-tbar .sp{margin-left:auto;display:flex;gap:9px;align-items:center}
  .mk-tbar .bal{font:600 13px 'JetBrains Mono',monospace;color:var(--ink);background:rgba(14,77,52,.07);padding:8px 12px;border-radius:8px}
  .mk-dx{background:rgba(35,33,28,.06);border:none;width:36px;height:36px;border-radius:50%;font-size:19px;cursor:pointer;color:var(--ink);line-height:1}
  .mk-view{max-width:980px;margin:0 auto;padding:24px 24px 80px}
  .mk-hi{font-family:'Bodoni Moda',serif;font-size:clamp(22px,3vw,30px);color:var(--emerald);font-weight:600}
  .mk-hi span{color:var(--ink-soft);font-size:14px;font-family:'Hanken Grotesk';font-weight:400;display:block;margin-top:4px}
  .mk-s4{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin:20px 0}
  .mk-sc{background:#fff;border:1px solid rgba(35,33,28,.08);border-radius:14px;padding:16px}
  .mk-sc .l{font:600 11px 'Hanken Grotesk';letter-spacing:.05em;text-transform:uppercase;color:var(--ink-soft)}
  .mk-sc .v{font-family:'JetBrains Mono',monospace;font-weight:600;font-size:21px;color:var(--ink);margin-top:9px;letter-spacing:-.02em}
  .mk-sc .dd{font:500 12.5px 'JetBrains Mono';margin-top:5px} .mk-up{color:#3f8a63}.mk-dn{color:#c0533b}
  .mk-pan{background:#fff;border:1px solid rgba(35,33,28,.08);border-radius:16px;padding:20px;margin-bottom:15px}
  .mk-pan .ph{display:flex;align-items:center;gap:10px}
  .mk-pan h4{font-family:'Bodoni Moda',serif;font-size:17px;color:var(--emerald);font-weight:600}
  .mk-pan .psub{font-size:12px;color:var(--ink-soft);margin:3px 0 14px}
  .mk-range{margin-left:auto;display:flex;gap:5px}
  .mk-range button{border:1px solid rgba(35,33,28,.14);background:#fff;border-radius:18px;padding:4px 11px;font:600 11.5px 'Hanken Grotesk';color:var(--ink-soft);cursor:pointer}
  .mk-range button.on{background:var(--emerald);color:#fff;border-color:var(--emerald)}
  .mk-2{display:grid;grid-template-columns:1fr 1fr;gap:15px}
  .mk-ar{display:flex;align-items:center;gap:12px;margin:12px 0}
  .mk-ar .nm{font-size:13px;color:var(--ink);min-width:118px;display:flex;align-items:center;gap:8px}.mk-ar .dot{width:9px;height:9px;border-radius:3px;flex:none}
  .mk-baro{flex:1;height:8px;background:rgba(14,77,52,.08);border-radius:6px;overflow:hidden}.mk-baro i{display:block;height:100%;border-radius:6px}
  .mk-ar .pc{font:500 12.5px 'JetBrains Mono';color:var(--ink-soft);min-width:44px;text-align:right}
  .mk-hr{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid rgba(35,33,28,.07)}.mk-hr:last-child{border:none}
  .mk-hr .ic{width:36px;height:36px;border-radius:9px;background:rgba(14,77,52,.1);color:var(--emerald);display:flex;align-items:center;justify-content:center;font:700 13px 'Bodoni Moda';flex:none;background-size:cover;background-position:center}
  .mk-hr .nm{flex:1;min-width:0}.mk-hr .nm b{display:block;font-size:13px;color:var(--ink)}.mk-hr .nm span{font-size:11.5px;color:var(--ink-soft)}
  .mk-hr .vl{text-align:right}.mk-hr .vl b{font:600 13px 'JetBrains Mono';color:var(--ink)}.mk-hr .vl span{font:500 11.5px 'JetBrains Mono';display:block}
  .mk-empty{text-align:center;padding:46px 20px;color:var(--ink-soft)}.mk-empty .big{font-family:'Bodoni Moda',serif;font-size:23px;color:var(--emerald);margin-bottom:8px}
  /* chart */
  .mk-chart{position:relative;height:230px;margin-top:6px}
  .mk-chart .gl{position:absolute;left:0;right:0;border-top:1px dashed rgba(35,33,28,.1)}
  .mk-chart .gl span{position:absolute;right:0;top:-8px;font:500 10px 'JetBrains Mono';color:var(--ink-soft);background:#fff;padding:0 4px}
  .mk-chart svg{position:absolute;inset:0;width:100%;height:100%}
  .mk-chart .end{position:absolute;width:11px;height:11px;border-radius:50%;background:var(--emerald);box-shadow:0 0 0 3px rgba(184,146,77,.5);transform:translate(-50%,-50%)}
  .mk-xax{display:flex;justify-content:space-between;margin-top:8px;font:500 10.5px 'JetBrains Mono';color:var(--ink-soft)}
  /* markets grid in app */
  .mk-mtoolbar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:18px}
  .mk-search{flex:1;min-width:180px;position:relative}
  .mk-search input{width:100%;border:1px solid rgba(35,33,28,.14);border-radius:9px;padding:11px 13px;font:400 14px 'Hanken Grotesk';outline:none}
  .mk-fil{display:flex;gap:6px;flex-wrap:wrap}
  .mk-fil button{border:1px solid rgba(35,33,28,.14);background:#fff;border-radius:20px;padding:7px 13px;font:600 12.5px 'Hanken Grotesk';color:var(--ink-soft);cursor:pointer}
  .mk-fil button.on{background:var(--emerald);color:#fff;border-color:var(--emerald)}
  .mk-mg{display:grid;grid-template-columns:repeat(3,1fr);gap:15px}
  .mk-mcard{background:#fff;border:1px solid rgba(35,33,28,.08);border-radius:14px;overflow:hidden;cursor:pointer;transition:.2s;display:flex;flex-direction:column}
  .mk-mcard:hover{transform:translateY(-3px);box-shadow:0 14px 34px -20px rgba(7,38,25,.3)}
  .mk-mcard .im{height:120px;background-size:cover;background-position:center;position:relative}
  .mk-mcard .im::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(7,38,25,.4))}
  .mk-mcard .star{position:absolute;top:9px;right:9px;z-index:2;width:30px;height:30px;border-radius:50%;background:rgba(7,38,25,.5);backdrop-filter:blur(4px);border:none;color:#F4EEE2;cursor:pointer;display:flex;align-items:center;justify-content:center}
  .mk-mcard .star svg{width:15px;height:15px}.mk-mcard .star.on{color:#f2c14e}.mk-mcard .star.on svg{fill:#f2c14e}
  .mk-mcard .ct{position:absolute;bottom:9px;left:11px;z-index:2;font:600 10px 'Hanken Grotesk';letter-spacing:.08em;text-transform:uppercase;color:#F4EEE2}
  .mk-mcard .bd{padding:14px;flex:1;display:flex;flex-direction:column}
  .mk-mcard h4{font-family:'Bodoni Moda',serif;font-size:17px;color:var(--emerald);font-weight:600;margin-bottom:6px}
  .mk-mcard p{font-size:12.5px;color:var(--ink-soft);flex:1}
  .mk-mcard .mm{display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding-top:11px;border-top:1px solid rgba(35,33,28,.07);font:600 13px 'JetBrains Mono';color:var(--ink)}
  .mk-mcard .mm small{font:500 11px 'Hanken Grotesk';color:var(--ink-soft)}
  /* instrument detail */
  .mk-hero-d{height:240px;border-radius:16px;background-size:cover;background-position:center;position:relative;overflow:hidden;margin-bottom:8px}
  .mk-hero-d::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,38,25,.15),rgba(7,38,25,.7))}
  .mk-hero-d .play{position:absolute;inset:0;z-index:3;display:flex;align-items:center;justify-content:center;cursor:pointer}
  .mk-hero-d .play span{width:60px;height:60px;border-radius:50%;background:rgba(184,146,77,.92);display:flex;align-items:center;justify-content:center}
  .mk-hero-d .play span svg{width:22px;height:22px;color:#072619;margin-left:3px}
  .mk-hero-d .meta{position:absolute;left:18px;bottom:16px;z-index:2;color:#F4EEE2}
  .mk-hero-d .meta .ct{font:600 11px 'Hanken Grotesk';letter-spacing:.1em;text-transform:uppercase;color:var(--brass-soft,#d8b573)}
  .mk-hero-d .meta h2{font-family:'Bodoni Moda',serif;font-size:clamp(22px,3vw,30px);font-weight:600;margin-top:4px}
  .mk-hero-d iframe{position:absolute;inset:0;width:100%;height:100%;border:0;z-index:5}
  .mk-tt{width:100%;border-collapse:collapse}.mk-tt td{padding:10px 0;border-bottom:1px solid rgba(35,33,28,.07);font-size:13.5px}.mk-tt td:first-child{color:var(--ink-soft)}.mk-tt td:last-child{text-align:right;font-weight:600;color:var(--ink);font-family:'JetBrains Mono';font-size:12.5px}
  .mk-proof{display:grid;gap:9px}.mk-proof div{display:flex;gap:9px;font-size:13px;color:var(--ink-soft);align-items:flex-start}.mk-proof svg{width:17px;height:17px;color:var(--emerald);flex:none;margin-top:1px}
  .mk-stick{position:sticky;bottom:0;background:linear-gradient(transparent,var(--bone) 30%);padding:14px 0 4px;display:flex;gap:10px}
  .mk-back{display:inline-flex;align-items:center;gap:7px;font:600 13px 'Hanken Grotesk';color:var(--ink-soft);cursor:pointer;margin-bottom:14px;background:none;border:none}.mk-back svg{width:16px;height:16px}
  .mk-feed{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid rgba(35,33,28,.07)}.mk-feed:last-child{border:none}
  .mk-feed .av{width:34px;height:34px;border-radius:50%;background:rgba(14,77,52,.1);color:var(--emerald);display:flex;align-items:center;justify-content:center;font:700 12px 'Bodoni Moda';flex:none}
  .mk-feed .tx{flex:1;font-size:13px;color:var(--ink)}.mk-feed .tx b{font-weight:600}.mk-feed .tm{font:500 11px 'JetBrains Mono';color:var(--ink-soft)}
  .mk-kyc{display:flex;align-items:center;gap:10px;background:rgba(63,138,99,.1);border:1px solid rgba(63,138,99,.25);border-radius:10px;padding:12px 14px;font-size:13px;color:var(--ink)}
  .mk-kyc svg{width:18px;height:18px;color:#3f8a63}
  .mk-set{display:flex;align-items:center;justify-content:space-between;padding:13px 0;border-bottom:1px solid rgba(35,33,28,.07)}.mk-set:last-child{border:none}
  .mk-set .t b{display:block;font-size:14px;color:var(--ink)}.mk-set .t span{font-size:12px;color:var(--ink-soft)}
  .mk-tog{width:44px;height:25px;border-radius:30px;background:rgba(35,33,28,.18);position:relative;cursor:pointer;flex:none;transition:.2s;border:none}
  .mk-tog::after{content:"";position:absolute;top:2.5px;left:2.5px;width:20px;height:20px;border-radius:50%;background:#fff;transition:.2s}
  .mk-tog.on{background:var(--emerald)}.mk-tog.on::after{transform:translateX(19px)}
  @media(max-width:820px){.mk-side{display:none}.mk-2{grid-template-columns:1fr}.mk-s4{grid-template-columns:1fr 1fr}.mk-mg{grid-template-columns:1fr 1fr}
    .mk-botnav{display:flex}}
  @media(max-width:540px){.mk-mg{grid-template-columns:1fr}.mk-view{padding:18px 16px 90px}
    .mk-ov{align-items:flex-end;padding:0}.mk-sheet{max-width:none;border-radius:18px 18px 0 0}}
  /* mobile bottom nav */
  .mk-botnav{display:none;position:fixed;bottom:0;left:0;right:0;z-index:1001;background:rgba(10,58,39,.97);backdrop-filter:blur(12px);padding:9px 6px calc(9px + env(safe-area-inset-bottom));justify-content:space-around;border-top:1px solid rgba(244,238,226,.12)}
  .mk-botnav a{display:flex;flex-direction:column;align-items:center;gap:3px;font:600 9.5px 'Hanken Grotesk';color:rgba(244,238,226,.6);cursor:pointer;flex:1;text-decoration:none}
  .mk-botnav a svg{width:20px;height:20px}.mk-botnav a.on{color:var(--brass-soft,#d8b573)}
  `;
  document.head.appendChild(st);
  const st2 = document.createElement("style"); st2.textContent = `.mk-doc{font-size:13.5px;color:var(--ink-soft);line-height:1.66}.mk-doc h3{font-family:'Bodoni Moda',serif;font-size:16px;color:var(--emerald);margin:16px 0 7px;font-weight:600}.mk-doc p{margin-bottom:10px}.mk-doc ul{margin:0 0 10px 18px}.mk-doc li{margin-bottom:5px}.mk-doc table{width:100%;border-collapse:collapse;margin:6px 0}.mk-doc td{padding:7px 0;border-bottom:1px solid rgba(35,33,28,.08);font-size:13px;vertical-align:top}.mk-doc td:last-child{text-align:right;font-weight:600;color:var(--ink);font-family:'JetBrains Mono';font-size:12px}.mk-doc .dmeta{font:500 11px 'JetBrains Mono';color:var(--ink-soft);border-top:1px solid rgba(35,33,28,.12);padding-top:10px;margin-top:16px}
.iss-hero{height:210px;border-radius:16px;position:relative;display:flex;align-items:flex-end;overflow:hidden;box-shadow:0 14px 40px -22px rgba(7,38,25,.6)}
.iss-hero .ehl{padding:22px 24px;color:var(--bone)}
.iss-hero .ehl .cat{display:inline-flex;align-items:center;gap:6px;font:600 11px 'Hanken Grotesk';letter-spacing:.05em;padding:5px 11px;border-radius:20px;margin-bottom:10px}
.iss-hero .ehl h2{font-family:'Bodoni Moda',serif;font-size:clamp(22px,3.2vw,30px);font-weight:600;line-height:1.08;margin:0}
.iss-hero .ehl p{font-size:13.5px;opacity:.9;margin:6px 0 0;max-width:48ch}
@media(max-width:560px){.iss-hero{height:170px}}`; document.head.appendChild(st2);

  // ---------- modal infra ----------
  // ---------- overlay / scroll-lock manager ----------
  // Background scroll is locked whenever any overlay (modal, app shell, or issuer
  // console) is open, so closing always returns cleanly instead of stranding the
  // page mid-scroll. Only one full-screen overlay (app/iss) is ever open at once.
  let ov = null, _lockY = 0; const _ovStack = new Set();
  function pushLock(id) { if (_ovStack.size === 0) { _lockY = window.scrollY || 0; document.documentElement.classList.add("mk-locked"); } _ovStack.add(id); }
  function popLock(id, toTop) { _ovStack.delete(id); if (_ovStack.size === 0) { document.documentElement.classList.remove("mk-locked"); window.scrollTo(0, toTop ? 0 : _lockY); } }
  function close() { if (!ov) return; ov.classList.remove("in"); const o = ov; ov = null; popLock("ov", false); setTimeout(() => o.remove(), 260); }
  function sheet(html, opts) {
    close();
    ov = document.createElement("div"); ov.className = "mk-ov";
    ov.innerHTML = `<div class="mk-sheet" role="dialog" aria-modal="true">${html}</div>`;
    ov.addEventListener("click", e => { if (e.target === ov) close(); });
    document.body.appendChild(ov); pushLock("ov"); requestAnimationFrame(() => ov.classList.add("in"));
    const x = $(".mk-x", ov); if (x) x.onclick = close;
    return ov;
  }
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  function toast(m) { const t = document.createElement("div"); t.className = "mk-toast"; t.innerHTML = `<span class="d"></span>${m}`; document.body.appendChild(t); requestAnimationFrame(() => t.classList.add("in")); setTimeout(() => { t.classList.remove("in"); setTimeout(() => t.remove(), 350); }, 2600); }

  // ---------- auth + guest ----------
  function auth(tab, then) {
    tab = tab || "signup";
    sheet(`
      <div class="mk-top"><button class="mk-x">×</button>
        <div class="mk-ey">Markhor account</div><h2 class="mk-h" id="aH">Create your account</h2>
        <div class="mk-sub">A few details to get on the rails. Demo only.</div>
        <div class="mk-tabs"><button data-t="signup">Create account</button><button data-t="signin">Sign in</button></div></div>
      <div class="mk-body">
        <div id="nW"><label class="mk-lbl">Full name</label><input class="mk-in" id="aName" placeholder="Your name"></div>
        <label class="mk-lbl">Email</label><input class="mk-in" id="aEmail" type="email" placeholder="you@email.com">
        <label class="mk-lbl">Password</label><input class="mk-in" id="aPass" type="password" placeholder="••••••••">
        <button class="mk-btn pri" id="aGo">Create account</button>
        <button class="mk-btn gho" id="aGuest">Skip — explore everything as a guest</button>
        <div class="mk-secure">${ICO.lock} No email needed to try · bank-grade KYC at launch</div></div>`);
    const set = t => { $$(".mk-tabs button").forEach(b => b.classList.toggle("on", b.dataset.t === t)); $("#aH").textContent = t === "signup" ? "Create your account" : "Welcome back"; $("#nW").style.display = t === "signup" ? "" : "none"; $("#aGo").textContent = t === "signup" ? "Create account" : "Sign in"; };
    $$(".mk-tabs button").forEach(b => b.onclick = () => set(b.dataset.t)); set(tab);
    $("#aGo").onclick = () => {
      const email = $("#aEmail").value.trim(), name = ($("#aName").value.trim() || email.split("@")[0] || "Member");
      if (!email || !/.+@.+\..+/.test(email)) { $("#aEmail").classList.add("bad"); return; }
      const isNew = !S.user; S.user = { name, email, kyc: "verified" }; updateNav(); close(); toast("Welcome to Markhor, " + name.split(" ")[0]);
      if (then) setTimeout(then, 280);
    };
    $("#aGuest").onclick = () => startGuest(then);
  }
  function startGuest(then) { S.user = { name: "Guest", email: "guest", guest: true, kyc: "guest" }; updateNav(); close(); toast("You're in — exploring as a guest"); if (then) setTimeout(then, 280); else app("markets"); }

  // ---------- invest / checkout / funds ----------
  function buy(id) {
    const m = MARKETS[id]; if (!m) return;
    if (!S.user) { auth("signup", () => buy(id)); return; }
    let amt = Math.max(m.min, 5000);
    sheet(`
      <div class="mk-top"><button class="mk-x">×</button><div class="mk-ey">${m.cat}</div><h2 class="mk-h">${m.name}</h2><div class="mk-sub">${m.tag}</div></div>
      <div class="mk-body">
        <label class="mk-lbl">How much do you want to put in?</label>
        <input class="mk-in" id="amt" inputmode="numeric" value="${amt.toLocaleString("en-US")}" style="font-family:'JetBrains Mono';font-size:20px">
        <div class="mk-chips" id="chips">${[1000, 5000, 25000, 100000].map(v => `<button class="mk-chip${v === amt ? " on" : ""}" data-v="${v}">${RS(v)}</button>`).join("")}</div>
        ${S.balance > 0 ? `<div class="mk-note">Wallet balance: <b>${PKR(S.balance)}</b> — we'll use it first.</div>` : ``}
        <button class="mk-btn pri" id="cont">Continue</button>
        <div class="mk-note">Illustrative demo. Live, this is a regulated issuance under the joint PVARA–SECP sandbox, with cooling-off and escrow. Not investment advice.</div></div>`);
    const el = $("#amt"), read = () => parseInt(el.value.replace(/[^0-9]/g, ""), 10) || 0;
    const sync = () => { const v = read(); $$(".mk-chip").forEach(c => c.classList.toggle("on", +c.dataset.v === v)); };
    el.oninput = () => { const v = read(); el.value = v ? v.toLocaleString("en-US") : ""; sync(); };
    $$(".mk-chip").forEach(c => c.onclick = () => { el.value = (+c.dataset.v).toLocaleString("en-US"); sync(); });
    $("#cont").onclick = () => { const v = read(); if (v < m.min) { el.classList.add("bad"); toast("Minimum is " + PKR(m.min)); return; } if (S.balance >= v) confirmFromBalance(id, v); else checkout(id, v); };
  }
  function confirmFromBalance(id, amount) {
    const m = MARKETS[id];
    sheet(`<div class="mk-top"><button class="mk-x">×</button><div class="mk-ey">Confirm</div><h2 class="mk-h">Invest ${PKR(amount)}</h2><div class="mk-sub">${m.name}</div></div>
      <div class="mk-body"><table class="mk-tt"><tr><td>From wallet balance</td><td>${PKR(amount)}</td></tr><tr><td>Remaining balance</td><td>${PKR(S.balance - amount)}</td></tr></table>
      <button class="mk-btn pri" id="conf">Confirm investment</button><div class="mk-secure">${ICO.lock} Paid from your Markhor wallet</div></div>`);
    $("#conf").onclick = () => { S.balance = S.balance - amount; record(id, amount); success(m, amount); };
  }
  function checkout(id, amount) {
    const m = MARKETS[id];
    cardForm("Pay " + PKR(amount), m.name + " · " + m.cat, amount, () => { record(id, amount); success(m, amount); });
  }
  function record(id, amount) { const m = MARKETS[id]; const h = S.holdings; h.push({ id, name: m.name, cat: m.cat, amount, ts: Date.now() }); S.holdings = h; addTxn("buy", m.name, -amount); updateNav(); }
  function addFunds() {
    if (!S.user) { auth("signup", addFunds); return; }
    let amt = 25000;
    sheet(`<div class="mk-top"><button class="mk-x">×</button><div class="mk-ey">Wallet</div><h2 class="mk-h">Add funds</h2><div class="mk-sub">Top up your Markhor wallet.</div></div>
      <div class="mk-body"><label class="mk-lbl">Amount</label><input class="mk-in" id="amt" inputmode="numeric" value="25,000" style="font-family:'JetBrains Mono';font-size:20px">
      <div class="mk-chips">${[5000, 25000, 50000, 100000].map(v => `<button class="mk-chip${v === amt ? " on" : ""}" data-v="${v}">${RS(v)}</button>`).join("")}</div>
      <button class="mk-btn pri" id="cont">Continue to payment</button></div>`);
    const el = $("#amt"), read = () => parseInt(el.value.replace(/[^0-9]/g, ""), 10) || 0;
    el.oninput = () => { const v = read(); el.value = v ? v.toLocaleString("en-US") : ""; $$(".mk-chip").forEach(c => c.classList.toggle("on", +c.dataset.v === v)); };
    $$(".mk-chip").forEach(c => c.onclick = () => { el.value = (+c.dataset.v).toLocaleString("en-US"); $$(".mk-chip").forEach(x => x.classList.toggle("on", x === c)); });
    $("#cont").onclick = () => { const v = read(); if (v < 1000) { el.classList.add("bad"); return; } cardForm("Add " + PKR(v), "To your Markhor wallet", v, () => { S.balance = S.balance + v; addTxn("deposit", "Added funds", v); toast("Added " + PKR(v) + " to your wallet"); if (appEl) go(appView); else close(); }); };
  }
  function cardForm(title, subtitle, amount, onPaid) {
    sheet(`<div class="mk-top"><button class="mk-x">×</button><div class="mk-ey">Secure checkout</div><h2 class="mk-h">${title}</h2><div class="mk-sub">${subtitle}</div></div>
      <div class="mk-body">
        <div class="mk-cv"><div class="brand"><span>MARKHOR</span><span style="font-family:'JetBrains Mono'">VISA</span></div><div class="no" id="cD">•••• •••• •••• ••••</div><div class="ft"><span id="nmD">CARDHOLDER</span><span id="eD">MM/YY</span></div></div>
        <label class="mk-lbl">Card number</label><input class="mk-in" id="cno" inputmode="numeric" placeholder="4242 4242 4242 4242" maxlength="19">
        <div class="mk-row"><div><label class="mk-lbl">Expiry</label><input class="mk-in" id="cexp" placeholder="MM/YY" maxlength="5"></div><div><label class="mk-lbl">CVC</label><input class="mk-in" id="ccvc" inputmode="numeric" placeholder="123" maxlength="4"></div></div>
        <label class="mk-lbl">Name on card</label><input class="mk-in" id="cnm" value="${(S.user && !S.user.guest && S.user.name) || ""}" placeholder="Your name">
        <button class="mk-btn pri" id="pay">${title}</button>
        <div class="mk-secure">${ICO.lock} Demo — no real card is charged. Try 4242 4242 4242 4242</div></div>`);
    const no = $("#cno"), exp = $("#cexp"), cvc = $("#ccvc"), nm = $("#cnm");
    no.oninput = () => { let v = no.value.replace(/\D/g, "").slice(0, 16); no.value = v.replace(/(.{4})/g, "$1 ").trim(); $("#cD").textContent = (v.padEnd(16, "•").replace(/(.{4})/g, "$1 ").trim()); };
    exp.oninput = () => { let v = exp.value.replace(/\D/g, "").slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2); exp.value = v; $("#eD").textContent = v || "MM/YY"; };
    cvc.oninput = () => cvc.value = cvc.value.replace(/\D/g, "").slice(0, 4);
    nm.oninput = () => $("#nmD").textContent = (nm.value || "CARDHOLDER").toUpperCase();
    $("#pay").onclick = () => {
      if (no.value.replace(/\D/g, "").length < 15) { no.classList.add("bad"); toast("Enter a card number"); return; }
      if (!/^\d\d\/\d\d$/.test(exp.value)) { exp.classList.add("bad"); return; }
      if (cvc.value.length < 3) { cvc.classList.add("bad"); return; }
      const b = $("#pay"); b.disabled = true; b.innerHTML = `<span class="mk-spin"></span> Processing…`;
      setTimeout(onPaid, 1500);
    };
  }
  function success(m, amount) {
    sheet(`<div class="mk-top"><button class="mk-x">×</button></div><div class="mk-body"><div class="mk-ok"><div class="tick">${ICO.check}</div>
      <h2 class="mk-h" style="margin-top:0">You own a piece of it.</h2><div class="mk-sub">${PKR(amount)} into <b>${m.name}</b> is now in your portfolio.</div></div>
      <button class="mk-btn pri" id="gp">Go to dashboard</button><button class="mk-btn gho" id="ke">Keep exploring</button></div>`);
    $("#gp").onclick = () => app("dashboard"); $("#ke").onclick = () => { if (appEl) go("markets"); else close(); }; toast("Added to your portfolio");
  }

  // ---------- chart ----------
  let lastChart = null;
  function series(value, range) {
    const C = { "1M": [22, .9, 1], "6M": [40, .68, 1], "1Y": [60, .48, 1.1], "All": [80, .32, 1.25] }[range] || [40, .68, 1];
    const N = C[0], startF = C[1], vol = C[2]; let seed = (Math.floor(value) % 99991) + N * 7 + range.length * 131;
    const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    let v = value * startF; const drift = (value - v) / (N - 1); const a = [];
    for (let i = 0; i < N; i++) { if (i) { v = Math.max(value * 0.12, v + drift + (rnd() - 0.46) * value * 0.04 * vol); } a.push(v); } a[N - 1] = value; return a;
  }
  function chartHTML(value, range) {
    if (!value) return `<div class="mk-empty"><div class="big">No holdings yet</div>Invest and your performance shows up here.</div>`;
    const pts = series(value, range), N = pts.length;
    const mx = Math.max.apply(null, pts), mn = Math.min.apply(null, pts), pad = (mx - mn) * 0.12 || mx * 0.1;
    const lo = mn - pad, hi = mx + pad; lastChart = { pts, lo, hi };
    const X = i => (i / (N - 1) * 100), Y = v => (100 - (v - lo) / (hi - lo) * 100);
    let d = "M0," + Y(pts[0]).toFixed(1); for (let i = 1; i < N; i++) d += " L" + X(i).toFixed(1) + "," + Y(pts[i]).toFixed(1);
    const ex = X(N - 1), ey = Y(pts[N - 1]);
    const lv = [hi - pad * .5, (hi + lo) / 2, lo + pad * .5];
    const months = { "1M": ["4w", "3w", "2w", "1w", "now"], "6M": ["Jan", "Feb", "Mar", "Apr", "May", "now"], "1Y": ["Q1", "Q2", "Q3", "Q4", "now"], "All": ["'24", "'25", "'26", "now"] }[range] || ["", "now"];
    return `<div class="mk-chart">
      ${lv.map(l => `<div class="gl" style="top:${Y(l).toFixed(1)}%"><span>${RS(l)}</span></div>`).join("")}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="mkg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E4D34" stop-opacity=".22"/><stop offset="1" stop-color="#0E4D34" stop-opacity="0"/></linearGradient></defs>
        <path d="${d} L100,100 L0,100 Z" fill="url(#mkg)"/><path d="${d}" fill="none" stroke="#B8924D" stroke-width="1.4" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>
      <div class="end" style="left:${ex}%;top:${ey}%"></div></div>
      <div class="mk-xax">${months.map(m => `<span>${m}</span>`).join("")}</div>`;
  }

  // ---------- app shell ----------
  let appEl = null, appView = "dashboard", chartRange = "6M", mFilter = "All", mQuery = "";
  const NAVS = [["dashboard", "Dashboard", ICO.home], ["markets", "Markets", ICO.grid], ["wallet", "Wallet", ICO.wallet], ["activity", "Activity", ICO.act], ["account", "Account", ICO.user]];
  function app(view) {
    appView = view || "dashboard";
    if (issEl) { const e = issEl; issEl = null; e.remove(); popLock("iss"); }   // never coexist with the issuer console
    if (!appEl) {
      appEl = document.createElement("div"); appEl.className = "mk-app";
      appEl.innerHTML = `
        <aside class="mk-side"><div class="sb"><img src="assets/img/markhor-head.png" alt=""><b>MARKHOR</b></div>
          <nav class="mk-nav">${NAVS.map(n => `<a data-go="${n[0]}">${n[2]}${n[1]}</a>`).join("")}</nav>
          <div class="sf"><div class="who"><span class="mk-av" id="avA">M</span><span id="whoA">Guest</span></div><button data-go="out">Sign out</button></div></aside>
        <main class="mk-main"><div class="mk-tbar"><h3 id="tTitle">Dashboard</h3><div class="sp"><span class="bal" id="tBal"></span><button class="mk-dx" data-feat="notifications" aria-label="Notifications" style="position:relative;font-size:15px">🔔<span id="bellDot" style="position:absolute;top:6px;right:6px;width:8px;height:8px;border-radius:50%;background:#c0533b;display:none"></span></button><button class="mk-dx" data-go="close" aria-label="Close">×</button></div></div>
          <div id="mkContent"></div></main>`;
      document.body.appendChild(appEl);
      const bn = document.createElement("nav"); bn.className = "mk-botnav show";
      bn.innerHTML = NAVS.map(n => `<a data-go="${n[0]}">${n[2]}<span>${n[1]}</span></a>`).join("");
      document.body.appendChild(bn); appEl._bn = bn;
      appEl.addEventListener("click", e => { const g = e.target.closest("[data-go]"); if (g) routeApp(g.dataset.go); });
      bn.addEventListener("click", e => { const g = e.target.closest("[data-go]"); if (g) routeApp(g.dataset.go); });
      pushLock("app"); requestAnimationFrame(() => appEl.classList.add("in"));
    }
    go(appView); updateBell();
    const mn = appEl.querySelector(".mk-main"); if (mn) mn.scrollTo(0, 0);
  }
  function closeApp() { if (!appEl) return; appEl.classList.remove("in"); const e = appEl, b = appEl._bn; appEl = null; popLock("app", true); setTimeout(() => { e.remove(); if (b) b.remove(); }, 280); }
  function routeApp(g) {
    if (g === "close") return closeApp();
    if (g === "out") { S.user = null; S.holdings = []; S.balance = 0; S.txns = []; updateNav(); closeApp(); toast("Signed out"); return; }
    go(g);
  }
  function go(view) {
    appView = view;
    const titles = { dashboard: "Dashboard", markets: "Markets", wallet: "Wallet", activity: "Activity", account: "Account", instrument: "Markets" };
    $("#tTitle", appEl).textContent = titles[view.split(":")[0]] || "Markhor";
    $$("#mkContent", appEl); $$(".mk-nav a", appEl).forEach(a => a.classList.toggle("on", a.dataset.go === view.split(":")[0]));
    $$(".mk-botnav a").forEach(a => a.classList.toggle("on", a.dataset.go === view.split(":")[0]));
    const u = S.user; if (u) { $("#avA", appEl).textContent = (u.name[0] || "M").toUpperCase(); $("#whoA", appEl).textContent = u.guest ? "Guest" : u.name; }
    $("#tBal", appEl).textContent = u ? PKR(S.balance) + " wallet" : "";
    const c = $("#mkContent", appEl);
    if (view.startsWith("instrument:")) return vInstrument(view.split(":")[1], c);
    ({ dashboard: vDashboard, markets: vMarkets, wallet: vWallet, activity: vActivity, account: vAccount }[view] || vDashboard)(c);
    c.parentElement.scrollTop = 0;
  }
  function gate(c, msg) { c.innerHTML = `<div class="mk-view"><div class="mk-empty"><div class="big">Sign in to continue</div>${msg}<div style="margin-top:18px"><button class="mk-btn pri" data-act2="signup" style="width:auto;display:inline-flex;padding:12px 22px">Create account or continue as guest</button></div></div></div>`; $("[data-act2=signup]", c).onclick = () => auth("signup", () => go(appView)); }

  function vDashboard(c) {
    if (!S.user) return gate(c, "Create an account or continue as a guest to see your portfolio dashboard.");
    const items = S.holdings.map(enrich), invested = items.reduce((a, x) => a + x.amount, 0), value = items.reduce((a, x) => a + x.value, 0) + S.balance;
    const inv = items.reduce((a, x) => a + x.value, 0), ret = inv - invested, gp = invested ? ret / invested * 100 : 0;
    const income = items.reduce((a, x) => a + x.value * (/royalty/i.test(x.cat) ? .01 : /Federation/.test(x.cat) ? .004 : .002), 0);
    const alloc = {}; items.forEach(x => alloc[x.cat] = (alloc[x.cat] || 0) + x.value); const aa = Object.entries(alloc).sort((a, b) => b[1] - a[1]);
    c.innerHTML = `<div class="mk-view">
      <div class="mk-hi">${S.user.guest ? "Guest portfolio" : S.user.name.split(" ")[0] + "’s portfolio"}<span>Your stake in Pakistani sport, story and song.</span></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px"><button class="mk-btn pri" data-feat="addfunds" style="margin:0;width:auto;padding:9px 16px">Add funds</button><button class="mk-btn gho" data-go="markets" style="margin:0;width:auto;padding:9px 16px">Invest</button><button class="mk-btn gho" data-feat="referral" style="margin:0;width:auto;padding:9px 16px">Invite &amp; earn</button></div>
      <div class="mk-s4">
        <div class="mk-sc"><div class="l">Total value · <span style="color:#3f8a63">● live</span></div><div class="v" data-live="total">${PKR(value)}</div><div class="dd ${gp >= 0 ? "mk-up" : "mk-dn"}" data-live="gp">${gp >= 0 ? "▲" : "▼"} ${Math.abs(gp).toFixed(2)}% all-time</div></div>
        <div class="mk-sc"><div class="l">Invested</div><div class="v">${PKR(invested)}</div><div class="dd" style="color:var(--ink-soft)">${items.length} position${items.length === 1 ? "" : "s"}</div></div>
        <div class="mk-sc"><div class="l">Returns</div><div class="v" data-live="ret">${PKR(ret)}</div><div class="dd ${ret >= 0 ? "mk-up" : "mk-dn"}" data-live="retd">${ret >= 0 ? "+" : "−"}${RS(Math.abs(ret))}</div></div>
        <div class="mk-sc"><div class="l">Est. monthly income</div><div class="v">${PKR(income)}</div><div class="dd" style="color:var(--ink-soft)">royalties + fees</div></div></div>
      <div class="mk-pan"><div class="ph"><h4>Performance</h4><div class="mk-range" id="rng">${["1M", "6M", "1Y", "All"].map(r => `<button class="${r === chartRange ? "on" : ""}" data-r="${r}">${r}</button>`).join("")}</div></div>
        <div class="psub">Total portfolio value over time · illustrative</div><div id="chartBox">${chartHTML(inv || value, chartRange)}</div></div>
      <div class="mk-2">
        <div class="mk-pan"><div class="ph"><h4>Allocation</h4></div><div class="psub">Where your money sits</div>
          ${aa.length ? aa.map(([k, v]) => `<div class="mk-ar"><div class="nm"><span class="dot" style="background:${CATCOL[k] || "#B8924D"}"></span>${k}</div><div class="mk-baro"><i style="width:${(v / inv * 100).toFixed(0)}%;background:${CATCOL[k] || "#B8924D"}"></i></div><div class="pc">${(v / inv * 100).toFixed(0)}%</div></div>`).join("") : `<div style="color:var(--ink-soft);font-size:13px">Nothing yet — back something from <a data-go="markets" style="color:var(--brass);cursor:pointer">Markets</a>.</div>`}</div>
        <div class="mk-pan"><div class="ph"><h4>Holdings</h4></div><div class="psub">${items.length} position${items.length === 1 ? "" : "s"}</div>
          ${items.length ? items.map(x => `<div class="mk-hr" data-go="instrument:${x.id}" style="cursor:pointer"><div class="ic" style="background-image:url('${(MARKETS[x.id] || {}).img || ""}')"></div><div class="nm"><b>${x.name}</b><span>${x.cat}</span></div><div class="vl"><b data-hv="${x.id}" data-amt="${x.amount}">${PKR(x.value)}</b><span data-live-change="${x.id}" style="color:#3f8a63">+${x.gain.toFixed(2)}%</span></div></div>`).join("") : `<div style="color:var(--ink-soft);font-size:13px">No holdings yet.</div>`}</div></div>
      ${S.user.guest ? `<div class="mk-pan" style="background:rgba(184,146,77,.08);border-color:rgba(184,146,77,.3)">You’re exploring as a <b>guest</b> — <span data-act2="su" style="color:var(--brass);font-weight:600;cursor:pointer">create an account</span> to keep this.</div>` : ``}
      <div style="font-size:11.5px;color:var(--ink-soft);opacity:.85;margin-top:6px">Demo dashboard — values and chart are illustrative. No real money or instruments are involved.</div></div>`;
    const wireC = () => { if (lastChart) wireChart($("#chartBox", c), lastChart.pts, lastChart.lo, lastChart.hi); }; wireC();
    const rng = $("#rng", c); if (rng) rng.onclick = e => { const b = e.target.closest("[data-r]"); if (!b) return; chartRange = b.dataset.r; $$("#rng button", c).forEach(x => x.classList.toggle("on", x === b)); $("#chartBox", c).innerHTML = chartHTML(inv || value, chartRange); wireC(); };
    const su = $("[data-act2=su]", c); if (su) su.onclick = () => auth("signup", () => go("dashboard"));
  }
  function vMarkets(c) {
    const cats = ["All", "Federation", "Athlete share", "Cultural royalty", "Ticketing", "Music royalty"];
    const list = ORDER.map(id => Object.assign({ id }, MARKETS[id])).filter(m => (mFilter === "All" || m.cat === mFilter) && (m.name + m.cat + m.tag).toLowerCase().includes(mQuery.toLowerCase()));
    c.innerHTML = `<div class="mk-view">
      <div class="mk-hi">Markets<span>Regulated ways to own Pakistani sport, story and song.</span></div>
      <div class="mk-mtoolbar" style="margin-top:18px"><div class="mk-search"><input id="mq" placeholder="Search markets…" value="${mQuery}"></div></div>
      <div class="mk-fil" style="margin-bottom:18px">${cats.map(k => `<button class="${k === mFilter ? "on" : ""}" data-f="${k}">${k}</button>`).join("")}</div>
      <div class="mk-mg">${list.map(m => `
        <div class="mk-mcard" data-go="instrument:${m.id}">
          <div class="im" style="background-image:url('${m.img}')"><button class="star ${S.watch.includes(m.id) ? "on" : ""}" data-watch="${m.id}">${ICO.star}</button><span class="ct">${m.cat}</span></div>
          <div class="bd"><h4>${m.name}</h4><p>${m.tag}</p><div class="mm"><span>${m.headline} <small>${m.headlbl.split("·")[0].trim()}</small></span><span data-live-change="${m.id}" style="font:600 13px 'JetBrains Mono'">${(m.change >= 0 ? "+" : "") + m.change.toFixed(2)}%</span></div></div></div>`).join("") || `<div style="color:var(--ink-soft)">No markets match.</div>`}</div>
      <p style="font-size:11.5px;color:var(--ink-soft);margin-top:20px;opacity:.85">Illustrative listings — every real issuance is capped, disclosed and escrowed under SECP rules.</p></div>`;
    $("#mq", c).oninput = e => { mQuery = e.target.value; vMarkets(c); $("#mq", c).focus(); };
    $$(".mk-fil button", c).forEach(b => b.onclick = () => { mFilter = b.dataset.f; vMarkets(c); });
    $$("[data-watch]", c).forEach(b => b.onclick = e => { e.stopPropagation(); const id = b.dataset.watch; const w = S.watch; const i = w.indexOf(id); if (i < 0) { w.push(id); toast("Added to watchlist"); } else w.splice(i, 1); S.watch = w; b.classList.toggle("on"); });
  }
  function vInstrument(id, c) {
    const m = MARKETS[id]; if (!m) return vMarkets(c);
    const held = S.holdings.filter(h => h.id === id), heldVal = held.map(enrich).reduce((a, x) => a + x.value, 0);
    c.innerHTML = `<div class="mk-view">
      <button class="mk-back" data-go="markets">${ICO.back} All markets</button>
      <div class="mk-hero-d" style="background-image:url('${m.img}')" id="hD"><div class="meta"><div class="ct">${m.cat}</div><h2>${m.name}</h2><div style="margin-top:6px;font:600 13px 'JetBrains Mono'"><span data-live-change="${id}" style="color:#84d6ac">${(m.change >= 0 ? "+" : "") + m.change.toFixed(2)}%</span> <span style="color:rgba(244,238,226,.72);font-weight:400">today</span></div></div><div class="play" id="playD"><span><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span></div></div>
      <div class="mk-s4" style="grid-template-columns:repeat(3,1fr)"><div class="mk-sc"><div class="l">${m.headlbl.split("·")[0].trim()}</div><div class="v">${m.headline}</div></div>
        <div class="mk-sc"><div class="l">Holders</div><div class="v">${m.holders ? m.holders.toLocaleString("en-US") : "—"}</div></div>
        <div class="mk-sc"><div class="l">You hold</div><div class="v">${heldVal ? PKR(heldVal) : "—"}</div></div></div>
      <div class="mk-2"><div>
        <div class="mk-pan"><h4>Overview</h4><p style="font-size:14px;color:var(--ink-soft);line-height:1.6;margin-top:8px">${m.overview}</p></div>
        <div class="mk-pan"><h4>Where the money goes</h4><div class="psub">Proceeds allocation</div>${m.slate.map(([k, v]) => `<div class="mk-ar"><div class="nm">${k}</div><div class="mk-baro"><i style="width:${v}%;background:linear-gradient(90deg,var(--brass),var(--emerald))"></i></div><div class="pc">${v}%</div></div>`).join("")}</div></div>
        <div><div class="mk-pan"><h4>Terms</h4><table class="mk-tt">${m.terms.map(t => `<tr><td>${t[0]}</td><td>${t[1]}</td></tr>`).join("")}</table></div>
        <div class="mk-pan"><h4>Protections</h4><div class="mk-proof" style="margin-top:8px">${m.proof.map(p => `<div>${ICO.check}${p}</div>`).join("")}</div></div></div></div>
      <div class="mk-pan"><div class="ph"><h4>Order book</h4><span style="margin-left:auto;font:600 11px 'Hanken Grotesk';color:#3f8a63">● Live</span></div><div class="psub">Bids and asks on the secondary market</div><div data-obook="${id}">${orderBookHTML(id)}</div></div>
      <div class="mk-pan"><h4>Do more</h4><div class="psub">Everything you can do with this instrument</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="mk-btn gho" data-feat="alert:${id}" style="margin:0;width:auto;padding:10px 15px">Price alert</button>
          <button class="mk-btn gho" data-feat="recurring:${id}" style="margin:0;width:auto;padding:10px 15px">Auto-invest</button>
          <button class="mk-btn gho" data-feat="docs:${id}" style="margin:0;width:auto;padding:10px 15px">Documents</button>
          <button class="mk-btn gho" data-feat="onchain:${id}" style="margin:0;width:auto;padding:10px 15px">On-chain proof</button>
          ${/Federation/.test(m.cat) ? `<button class="mk-btn gho" data-feat="vote:${id}" style="margin:0;width:auto;padding:10px 15px">Fan vote</button>` : ``}
          ${held.length ? `<button class="mk-btn gho" data-feat="sell:${id}" style="margin:0;width:auto;padding:10px 15px">Sell position</button>` : ``}
          ${(/royalty/i.test(m.cat) && held.length) ? `<button class="mk-btn gho" data-feat="claim:${id}" style="margin:0;width:auto;padding:10px 15px">Claim payout</button>` : ``}
        </div></div>
      <div class="mk-stick"><button class="mk-btn pri" data-buy="${id}" style="margin-top:0">Invest in ${m.name.split(" ")[0]}</button><button class="mk-btn gho" data-watch2="${id}" style="margin-top:0;flex:none;width:auto;padding:14px 18px">${S.watch.includes(id) ? "★ Watching" : "☆ Watch"}</button></div>
      <p style="font-size:11.5px;color:var(--ink-soft);margin-top:14px;opacity:.85">Illustrative. Not an offer or investment advice. Live issuance runs under the joint PVARA–SECP sandbox.</p></div>`;
    const pd = $("#playD", c); if (pd) pd.onclick = () => { const f = document.createElement("iframe"); f.src = "https://www.youtube-nocookie.com/embed/" + m.video + "?autoplay=1&rel=0&modestbranding=1"; f.allow = "autoplay; encrypted-media; fullscreen"; f.setAttribute("allowfullscreen", ""); $("#hD", c).appendChild(f); pd.style.display = "none"; };
    $("[data-buy]", c).onclick = () => buy(id);
    $("[data-watch2]", c).onclick = e => { const w = S.watch, i = w.indexOf(id); if (i < 0) { w.push(id); toast("Added to watchlist"); } else w.splice(i, 1); S.watch = w; vInstrument(id, c); };
  }
  function vWallet(c) {
    if (!S.user) return gate(c, "Sign in to open your diaspora wallet.");
    const items = S.holdings.map(enrich), holdVal = items.reduce((a, x) => a + x.value, 0);
    c.innerHTML = `<div class="mk-view">
      <div class="mk-hi">Wallet<span>One regulated home for everything you own.</span></div>
      <div class="mk-2" style="margin-top:20px"><div class="mk-pan" style="background:linear-gradient(150deg,#0e4d34,#072619);color:#F4EEE2;border:none">
        <div style="display:flex;justify-content:space-between;align-items:center"><span style="font:700 14px 'Bodoni Moda';letter-spacing:.12em">MARKHOR</span><span style="font:500 10px 'Hanken Grotesk';letter-spacing:.12em">DIASPORA WALLET</span></div>
        <div style="font-family:'JetBrains Mono';font-size:30px;margin-top:18px">${PKR(S.balance)}</div>
        <div style="font:500 12px 'JetBrains Mono';color:rgba(244,238,226,.7);margin-top:6px">≈ $${(S.balance / FX).toFixed(0)} · cash balance</div>
        <div style="display:flex;gap:9px;margin-top:18px"><button class="mk-btn pri" data-feat="addfunds" style="margin:0;flex:1">Add funds</button><button class="mk-btn" data-feat="withdraw" style="margin:0;flex:1;background:rgba(244,238,226,.12);color:#F4EEE2">Withdraw</button></div></div>
        <div class="mk-pan"><h4>Balances</h4><div class="psub">Across the platform</div>
          <table class="mk-tt"><tr><td>Cash balance</td><td>${PKR(S.balance)}</td></tr><tr><td>Invested holdings</td><td>${PKR(holdVal)}</td></tr><tr><td>Total</td><td>${PKR(S.balance + holdVal)}</td></tr><tr><td>≈ USD</td><td>$${((S.balance + holdVal) / FXR.USD).toFixed(0)}</td></tr><tr><td>≈ GBP</td><td>£${((S.balance + holdVal) / FXR.GBP).toFixed(0)}</td></tr><tr><td>≈ AED</td><td>د.إ ${((S.balance + holdVal) / FXR.AED).toFixed(0)}</td></tr></table><div class="psub" style="margin:8px 0 0">Live mid-market rates · one wallet, every currency</div>
          <div class="mk-kyc" style="margin-top:14px">${ICO.shield} Identity ${S.user.guest ? "demo (guest)" : "verified"} · compliant in UK, UAE, US, Canada</div></div></div>
      <div class="mk-pan"><div class="ph"><h4>Automations &amp; tools</h4></div><div class="psub">${S.recurring.length} auto-invest${S.recurring.length === 1 ? "" : "s"} · ${S.alerts.length} alert${S.alerts.length === 1 ? "" : "s"}</div>
        ${S.recurring.length ? S.recurring.map(r => `<div class="mk-hr"><div class="ic">↻</div><div class="nm"><b>${(MARKETS[r.id] || {}).name || r.id}</b><span>${PKR(r.amount)} · ${r.freq}</span></div><div class="vl"><span style="color:#3f8a63">Active</span></div></div>`).join("") : ``}
        ${S.alerts.length ? S.alerts.map(al => `<div class="mk-hr"><div class="ic">🔔</div><div class="nm"><b>${(MARKETS[al.id] || {}).name || al.id}</b><span>Alert at ${al.target}</span></div><div class="vl"><span style="color:var(--ink-soft)">Set</span></div></div>`).join("") : ``}
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="mk-btn gho" data-feat="referral" style="margin:0;width:auto;padding:10px 15px">Invite &amp; earn</button><button class="mk-btn gho" data-feat="statement" style="margin:0;width:auto;padding:10px 15px">Download statement</button></div></div>
      <div class="mk-pan"><h4>Recent wallet activity</h4><div class="psub">Deposits and investments</div>
        ${S.txns.length ? S.txns.slice(0, 8).map(t => `<div class="mk-hr"><div class="ic">${t.type === "deposit" ? "+" : t.type === "buy" ? "↑" : "•"}</div><div class="nm"><b>${t.label}</b><span>${t.type === "deposit" ? "Added funds" : "Investment"} · ${relTime(t.ts)}</span></div><div class="vl"><b style="color:${t.amount >= 0 ? "#3f8a63" : "var(--ink)"}">${t.amount >= 0 ? "+" : "−"}${RS(Math.abs(t.amount))}</b></div></div>`).join("") : `<div style="color:var(--ink-soft);font-size:13px">No activity yet. Add funds to get started.</div>`}</div></div>`;
    const a = $("[data-act2=add]", c); if (a) a.onclick = addFunds;
  }
  function vActivity(c) {
    if (!S.user) return gate(c, "Sign in to see your activity.");
    const feed = [["A", "Ayesha in Dubai", "backed", "Hockey Supporter Token", "2m"], ["R", "Rehan in London", "bought", "Drama Royalty", "9m"], ["S", "Sana in Toronto", "topped up her wallet", "", "21m"], ["B", "Bilal in Karachi", "backed", "Javelin Career Share", "44m"], ["M", "Maryam in Dubai", "bought", "Single Royalty", "1h"], ["F", "Faisal in Manchester", "claimed a royalty payout", "", "2h"]];
    c.innerHTML = `<div class="mk-view"><div class="mk-hi">Activity<span>Your history, and what the community is doing.</span></div>
      <div class="mk-2" style="margin-top:20px"><div class="mk-pan"><div class="ph"><h4>Your transactions</h4><button class="mk-btn gho" data-feat="statement" style="margin:0;margin-left:auto;width:auto;padding:7px 13px;font-size:12.5px">Export CSV</button></div><div class="psub">${S.txns.length} event${S.txns.length === 1 ? "" : "s"}</div>
        ${S.txns.length ? S.txns.map(t => `<div class="mk-hr"><div class="ic">${t.type === "deposit" ? "+" : "↑"}</div><div class="nm"><b>${t.type === "deposit" ? "Added funds" : "Invested · " + t.label}</b><span>${relTime(t.ts)}</span></div><div class="vl"><b style="color:${t.amount >= 0 ? "#3f8a63" : "var(--ink)"}">${t.amount >= 0 ? "+" : "−"}${RS(Math.abs(t.amount))}</b></div></div>`).join("") : `<div style="color:var(--ink-soft);font-size:13px">Nothing yet.</div>`}</div>
        <div class="mk-pan"><div class="ph"><h4>Community</h4><span style="margin-left:auto;font:600 11px 'Hanken Grotesk';color:#3f8a63">● Live</span></div><div class="psub">Live across Pakistan and the diaspora</div>
          <div id="commFeed">${feed.map(f => `<div class="mk-feed"><div class="av">${f[0]}</div><div class="tx"><b>${f[1]}</b> ${f[2]}${f[3] ? ` <b>${f[3]}</b>` : ""}.</div><div class="tm">${f[4]}</div></div>`).join("")}</div></div></div></div>`;
  }
  function vAccount(c) {
    if (!S.user) return gate(c, "Sign in to manage your account.");
    const u = S.user;
    c.innerHTML = `<div class="mk-view"><div class="mk-hi">Account<span>Profile, verification and security.</span></div>
      <div class="mk-2" style="margin-top:20px"><div class="mk-pan"><h4>Profile</h4>
        <div style="display:flex;align-items:center;gap:14px;margin-top:12px"><span class="mk-av" style="width:52px;height:52px;font-size:22px">${(u.name[0] || "M").toUpperCase()}</span><div><div style="font:600 16px 'Hanken Grotesk';color:var(--ink)">${u.guest ? "Guest" : u.name}</div><div style="font-size:13px;color:var(--ink-soft)">${u.guest ? "Exploring without an account" : u.email}</div></div></div>
        ${u.guest ? `<button class="mk-btn pri" data-act2="su">Create a real account</button>` : `<div class="mk-kyc" style="margin-top:16px">${ICO.shield} Identity verified · KYC complete (demo)</div>`}</div>
        <div class="mk-pan"><h4>Verification &amp; compliance</h4><div class="psub">Under destination-country rules</div>
          <table class="mk-tt"><tr><td>Identity (KYC)</td><td>${u.guest ? "Demo" : "Verified"}</td></tr><tr><td>Jurisdiction</td><td>Pakistan / diaspora</td></tr><tr><td>Supervision</td><td>PVARA–SECP sandbox</td></tr><tr><td>Investor protection</td><td>Active</td></tr></table></div></div>
      <div class="mk-pan"><h4>Settings</h4>
        <div class="mk-set"><div class="t"><b>Two-factor authentication</b><span>Extra security on sign-in</span></div><button class="mk-tog" data-tog></button></div>
        <div class="mk-set"><div class="t"><b>Payout notifications</b><span>Email me when a royalty pays out</span></div><button class="mk-tog on" data-tog></button></div>
        <div class="mk-set"><div class="t"><b>New listing alerts</b><span>Tell me when a new market opens</span></div><button class="mk-tog on" data-tog></button></div>
        <div class="mk-set"><div class="t"><b>Currency</b><span>Display in PKR</span></div><span style="font:600 13px 'JetBrains Mono';color:var(--ink-soft)">PKR · USD</span></div></div>
      <div class="mk-pan"><div class="ph"><h4>Verification &amp; tools</h4></div><div class="psub">Run the flows the live platform would use</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="mk-btn gho" data-feat="kyc" style="margin:0;width:auto;padding:10px 15px">Run identity verification</button>
          <button class="mk-btn gho" data-feat="referral" style="margin:0;width:auto;padding:10px 15px">Invite &amp; earn</button>
          <button class="mk-btn gho" data-feat="statement" style="margin:0;width:auto;padding:10px 15px">Download statement</button>
          <button class="mk-btn gho" data-feat="notifications" style="margin:0;width:auto;padding:10px 15px">Notifications</button>
        </div></div>
      <button class="mk-btn gho" data-go="out" style="max-width:200px">Sign out</button></div>`;
    $$("[data-tog]", c).forEach(t => t.onclick = () => t.classList.toggle("on"));
    const su = $("[data-act2=su]", c); if (su) su.onclick = () => auth("signup", () => go("account"));
  }

  // ---------- feature in-builds (mock prototypes) ----------
  function notify(title, body) { const n = S.notifs; n.unshift({ title, body, ts: Date.now(), read: false }); S.notifs = n.slice(0, 30); updateBell(); }
  function updateBell() { const b = appEl && $("#bellDot", appEl); if (b) b.style.display = S.notifs.some(n => !n.read) ? "block" : "none"; }
  const refresh = () => { if (appEl) go(appView); else close(); };

  function withdraw() {
    if (!S.user) { auth("signin", withdraw); return; }
    if (S.balance <= 0) { toast("No cash balance to withdraw"); return; }
    sheet(`<div class="mk-top"><button class="mk-x">×</button><div class="mk-ey">Wallet</div><h2 class="mk-h">Withdraw funds</h2><div class="mk-sub">To your linked bank · 1–2 business days.</div></div>
      <div class="mk-body"><label class="mk-lbl">Amount · max ${PKR(S.balance)}</label><input class="mk-in" id="amt" inputmode="numeric" value="${S.balance.toLocaleString("en-US")}" style="font-family:'JetBrains Mono';font-size:20px">
      <table class="mk-tt"><tr><td>To account</td><td>HBL •••• 4821</td></tr><tr><td>Fee</td><td>PKR 0</td></tr></table>
      <button class="mk-btn pri" id="go">Withdraw</button><div class="mk-secure">${ICO.lock} Demo — no real money moves</div></div>`);
    const el = $("#amt"); el.oninput = () => { const v = parseInt(el.value.replace(/[^0-9]/g, ""), 10) || 0; el.value = v ? v.toLocaleString("en-US") : ""; };
    $("#go").onclick = () => { const v = parseInt(el.value.replace(/[^0-9]/g, ""), 10) || 0; if (v <= 0 || v > S.balance) { el.classList.add("bad"); return; } const b = $("#go"); b.disabled = true; b.innerHTML = `<span class="mk-spin"></span> Processing…`; setTimeout(() => { S.balance -= v; addTxn("withdraw", "Withdrawal to bank", -v); notify("Withdrawal initiated", PKR(v) + " is on its way to HBL •••• 4821."); updateNav(); close(); toast("Withdrawal of " + PKR(v) + " started"); refresh(); }, 1400); };
  }
  function sell(id) {
    const held = S.holdings.map(enrich).filter(h => h.id === id); if (!held.length) { toast("You don't hold this"); return; }
    const m = MARKETS[id], val = held.reduce((a, x) => a + x.value, 0), proceeds = Math.round(val * 0.99);
    sheet(`<div class="mk-top"><button class="mk-x">×</button><div class="mk-ey">Sell · ${m.cat}</div><h2 class="mk-h">${m.name}</h2><div class="mk-sub">Exit on the secondary market.</div></div>
      <div class="mk-body"><table class="mk-tt"><tr><td>Your position</td><td>${PKR(val)}</td></tr><tr><td>Est. sale value</td><td>${PKR(val)}</td></tr><tr><td>Platform fee (1%)</td><td>${PKR(val * 0.01)}</td></tr><tr><td>You receive</td><td>${PKR(proceeds)}</td></tr></table>
      <button class="mk-btn pri" id="go">Sell entire position</button><div class="mk-note">Demo secondary-market sale. Live, this clears against on-platform bids with a cooling-off window.</div></div>`);
    $("#go").onclick = () => { const b = $("#go"); b.disabled = true; b.innerHTML = `<span class="mk-spin"></span> Selling…`; setTimeout(() => { S.holdings = S.holdings.filter(h => h.id !== id); S.balance += proceeds; addTxn("sell", "Sold " + m.name, proceeds); notify("Position sold", "You sold " + m.name + " for " + PKR(proceeds) + " — added to your wallet."); updateNav(); close(); toast("Sold for " + PKR(proceeds)); appEl ? go("dashboard") : 0; }, 1400); };
  }
  function claim(id) {
    const m = MARKETS[id], held = S.holdings.map(enrich).filter(h => h.id === id), val = held.reduce((a, x) => a + x.value, 0);
    const payout = Math.round(val * (/royalty/i.test(m.cat) ? .012 : .005)); if (payout <= 0) { toast("Nothing to claim yet"); return; }
    sheet(`<div class="mk-top"><button class="mk-x">×</button><div class="mk-ey">Royalty payout</div><h2 class="mk-h">Claim ${PKR(payout)}</h2><div class="mk-sub">${m.name} · this month's earnings</div></div>
      <div class="mk-body"><div class="mk-cv"><div class="brand"><span>MARKHOR</span><span style="font-family:'JetBrains Mono';font-size:11px">PAYOUT</span></div><div class="no">${PKR(payout)}</div><div class="ft"><span>${m.name}</span><span>On-chain split</span></div></div>
      <button class="mk-btn pri" id="go">Claim to wallet</button><div class="mk-secure">${ICO.check} Auto-split across rights holders</div></div>`);
    $("#go").onclick = () => { S.balance += payout; addTxn("payout", "Royalty · " + m.name, payout); notify("Royalty paid", PKR(payout) + " from " + m.name + " landed in your wallet."); updateNav(); close(); toast("Claimed " + PKR(payout)); refresh(); };
  }
  function priceAlert(id) {
    const m = MARKETS[id];
    sheet(`<div class="mk-top"><button class="mk-x">×</button><div class="mk-ey">Price alert</div><h2 class="mk-h">${m.name}</h2><div class="mk-sub">We'll notify you when it moves.</div></div>
      <div class="mk-body"><label class="mk-lbl">Alert me when it changes by</label><div class="mk-chips">${["+5%", "+10%", "−5%", "52-wk high"].map(v => `<button class="mk-chip" data-v="${v}">${v}</button>`).join("")}</div>
      <button class="mk-btn pri" id="go" disabled>Set alert</button></div>`);
    let pick = null; $$(".mk-chip").forEach(c => c.onclick = () => { pick = c.dataset.v; $$(".mk-chip").forEach(x => x.classList.toggle("on", x === c)); $("#go").disabled = false; });
    $("#go").onclick = () => { const a = S.alerts; a.push({ id, target: pick, ts: Date.now() }); S.alerts = a; notify("Alert set", "We'll tell you when " + m.name + " hits " + pick + "."); close(); toast("Alert set"); };
  }
  function recurring(id) {
    const m = MARKETS[id]; let freq = "Monthly";
    sheet(`<div class="mk-top"><button class="mk-x">×</button><div class="mk-ey">Auto-invest</div><h2 class="mk-h">${m.name}</h2><div class="mk-sub">Invest automatically, hands-free.</div></div>
      <div class="mk-body"><label class="mk-lbl">Amount each time</label><input class="mk-in" id="amt" value="5,000" style="font-family:'JetBrains Mono'">
      <label class="mk-lbl">Frequency</label><div class="mk-chips" id="fq">${["Weekly", "Monthly", "Quarterly"].map(f => `<button class="mk-chip${f === "Monthly" ? " on" : ""}" data-f="${f}">${f}</button>`).join("")}</div>
      <button class="mk-btn pri" id="go">Start auto-invest</button><div class="mk-note">Demo. Live, this runs from your wallet balance — skip or cancel anytime.</div></div>`);
    const el = $("#amt"); el.oninput = () => { const v = parseInt(el.value.replace(/[^0-9]/g, ""), 10) || 0; el.value = v ? v.toLocaleString("en-US") : ""; };
    $$("#fq .mk-chip").forEach(c => c.onclick = () => { freq = c.dataset.f; $$("#fq .mk-chip").forEach(x => x.classList.toggle("on", x === c)); });
    $("#go").onclick = () => { const v = parseInt(el.value.replace(/[^0-9]/g, ""), 10) || 0; const r = S.recurring; r.push({ id, amount: v, freq, ts: Date.now() }); S.recurring = r; notify("Auto-invest on", PKR(v) + " into " + m.name + " " + freq.toLowerCase() + "."); close(); toast("Auto-invest set up"); };
  }
  const POLLS = { phf: { q: "Where should the federation spend the first PKR 10M raised?", opts: ["Junior academies", "Women's hockey", "World Cup prep"] } };
  function vote(id) {
    const p = POLLS[id]; if (!p) { toast("No open vote for this market"); return; }
    const render = () => {
      const prev = S.votes[id], base = [44, 33, 23], total = 100 + (prev ? 1 : 0);
      sheet(`<div class="mk-top"><button class="mk-x">×</button><div class="mk-ey">Fan governance · ${MARKETS[id].name}</div><h2 class="mk-h">Have your say</h2><div class="mk-sub">${p.q}</div></div>
        <div class="mk-body">${p.opts.map((o, i) => `<button class="mk-btn ${prev === o ? "pri" : "gho"}" data-o="${o}" style="justify-content:space-between;margin-top:9px"><span>${o}</span>${prev ? `<span style="font-family:'JetBrains Mono'">${Math.round((base[i] + (prev === o ? 1 : 0)) / total * 100)}%</span>` : ""}</button>`).join("")}
        <div class="mk-note">${prev ? "Thanks — your vote is recorded on-chain. Token-holders decide." : "One vote per token-holder. Demo."}</div></div>`);
      if (!S.votes[id]) $$("[data-o]").forEach(b => b.onclick = () => { const v = S.votes; v[id] = b.dataset.o; S.votes = v; notify("Vote counted", "You voted “" + b.dataset.o + "”."); render(); toast("Vote counted"); });
    }; render();
  }
  function notifications() {
    const ns = S.notifs; S.notifs = ns.map(n => Object.assign({}, n, { read: true })); updateBell();
    sheet(`<div class="mk-top"><button class="mk-x">×</button><div class="mk-ey">Notifications</div><h2 class="mk-h">Recent</h2></div>
      <div class="mk-body">${ns.length ? ns.map(n => `<div class="mk-hr"><div class="ic">•</div><div class="nm"><b>${n.title}</b><span>${n.body}</span></div><div class="vl"><span style="color:var(--ink-soft)">${relTime(n.ts)}</span></div></div>`).join("") : `<div class="mk-empty"><div class="big">All caught up</div>Order, payout and security alerts show up here.</div>`}</div>`);
  }
  function statement() {
    if (!S.txns.length) { toast("No transactions to export yet"); return; }
    const rows = [["Date", "Type", "Description", "Amount_PKR"]].concat(S.txns.map(t => [new Date(t.ts).toISOString().slice(0, 10), t.type, '"' + t.label + '"', t.amount]));
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" }), url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "markhor-statement.csv"; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); toast("Statement downloaded");
  }
  function kyc(then) {
    let step = 0; const steps = [
      { t: "Personal details", f: `<label class="mk-lbl">Legal name</label><input class="mk-in" value="${(S.user && !S.user.guest && S.user.name) || ""}"><label class="mk-lbl">Date of birth</label><input class="mk-in" placeholder="DD / MM / YYYY"><label class="mk-lbl">Country of residence</label><input class="mk-in" value="Pakistan">` },
      { t: "Identity document", f: `<div style="border:1.5px dashed rgba(35,33,28,.22);border-radius:12px;padding:28px;text-align:center;color:var(--ink-soft);font-size:13.5px">Tap to scan your CNIC or passport<br><span style="font-size:12px;opacity:.8">Demo — nothing is uploaded</span></div><label class="mk-lbl">Document number</label><input class="mk-in" placeholder="CNIC / passport no.">` },
      { t: "A few questions", f: `<label class="mk-lbl">Source of funds</label><input class="mk-in" value="Salary"><label class="mk-lbl">Investment experience</label><input class="mk-in" value="Some"><label class="mk-lbl">Tax residency</label><input class="mk-in" value="Pakistan">` },
    ];
    const render = () => {
      if (step >= steps.length) { const u = S.user || {}; u.kyc = "verified"; u.guest = false; S.user = u; updateNav(); sheet(`<div class="mk-top"><button class="mk-x">×</button></div><div class="mk-body"><div class="mk-ok"><div class="tick">${ICO.check}</div><h2 class="mk-h" style="margin-top:0">You're verified.</h2><div class="mk-sub">Identity confirmed under destination-country rules. Full access unlocked.</div></div><button class="mk-btn pri" id="d">Done</button></div>`); $("#d").onclick = () => { close(); if (then) then(); else refresh(); }; return; }
      const s = steps[step];
      sheet(`<div class="mk-top"><button class="mk-x">×</button><div class="mk-ey">Verification · step ${step + 1} of ${steps.length}</div><h2 class="mk-h">${s.t}</h2><div class="mk-sub">Required by law to verify your identity.</div>
        <div style="height:4px;background:rgba(35,33,28,.1);border-radius:4px;margin-top:14px;overflow:hidden"><i style="display:block;height:100%;width:${step / steps.length * 100}%;background:var(--brass)"></i></div></div>
        <div class="mk-body">${s.f}<button class="mk-btn pri" id="next">${step === steps.length - 1 ? "Submit for verification" : "Continue"}</button><div class="mk-secure">${ICO.lock} Bank-grade encryption · demo</div></div>`);
      $("#next").onclick = () => { step++; render(); };
    }; render();
  }
  function onchain(id) {
    const m = MARKETS[id];
    sheet(`<div class="mk-top"><button class="mk-x">×</button><div class="mk-ey">On-chain proof</div><h2 class="mk-h">${m.name}</h2><div class="mk-sub">Verifiable on the public ledger.</div></div>
      <div class="mk-body"><table class="mk-tt"><tr><td>Contract</td><td>0x9f4…${id}A4</td></tr><tr><td>Token standard</td><td>Asset-referenced</td></tr><tr><td>Backing</td><td>Fully escrowed</td></tr><tr><td>Supervisor</td><td>PVARA–SECP</td></tr><tr><td>Audit log</td><td>Filed quarterly</td></tr></table>
      <button class="mk-btn gho" id="ex">Open in explorer ↗</button><div class="mk-note">Demo. Live, every issuance, transfer and payout is anchored on-chain and externally verifiable.</div></div>`);
    $("#ex").onclick = () => toast("Demo — block explorer would open here");
  }
  function docs(id) {
    const m = MARKETS[id], list = [["terms", "Offering terms", "Form-C equivalent"], ["risk", "Risk disclosure", "Capital at risk"], ["custody", "Custody & escrow statement", "Where your money sits"], ["issuer", "Issuer agreement", "Rights & obligations"]];
    sheet(`<div class="mk-top"><button class="mk-x">×</button><div class="mk-ey">Documents</div><h2 class="mk-h">${m.name}</h2><div class="mk-sub">Disclosures for this offering. Tap to read.</div></div>
      <div class="mk-body">${list.map(d => `<div class="mk-hr" data-doc="${d[0]}" style="cursor:pointer"><div class="ic">▤</div><div class="nm"><b>${d[1]}</b><span>${d[2]}</span></div><div class="vl"><span style="color:var(--brass)">Read →</span></div></div>`).join("")}</div>`);
    $$("[data-doc]").forEach(b => b.onclick = () => docView(id, b.dataset.doc));
  }
  function docView(id, type) {
    const m = MARKETS[id], ref = "MK-" + id.toUpperCase() + "-2026";
    const C = {
      terms: { t: "Offering terms", b: `<h3>1. The offering</h3><p><b>${m.name}</b> is a ${m.cat.toLowerCase()} issued by the relevant Pakistani entity and operated by Markhor (The National Operator) under the joint PVARA–SECP regulatory sandbox.</p>
        <h3>2. Key terms</h3><table>${m.terms.map(t => `<tr><td>${t[0]}</td><td>${t[1]}</td></tr>`).join("")}</table>
        <h3>3. Use of proceeds</h3><p>Net proceeds are ring-fenced to the published slate below and released from escrow against independently verified milestones. No funds are released to the issuer outside this schedule.</p>
        <table>${m.slate.map(s => `<tr><td>${s[0]}</td><td>${s[1]}%</td></tr>`).join("")}</table>
        <h3>4. Investor protections</h3><ul>${m.proof.map(p => `<li>${p}</li>`).join("")}</ul>
        <h3>5. Cooling-off</h3><p>A 7-day cooling-off period applies from the date of subscription, during which you may cancel for a full refund. Secondary-market sales are subject to a short settlement window.</p>
        <div class="dmeta">Ref ${ref} · v1.0 · Demo document — not a real offer of securities.</div>` },
      risk: { t: "Risk disclosure", b: `<h3>Capital is at risk</h3><p>The value of <b>${m.name}</b> can fall as well as rise. You may get back less than you invest, or nothing. Never commit money you cannot afford to lose.</p>
        <h3>Illustrative figures</h3><p>All percentages, prices, funding levels and charts shown in the app are illustrative and are not forecasts, guarantees or indications of future return.</p>
        <h3>Liquidity</h3><p>This instrument may have lock-ups, vesting or a limited secondary market. You may not be able to sell when you want, or at the price you expect.</p>
        <h3>Regulatory status</h3><p>Markhor operates within the joint PVARA–SECP sandbox. Sandbox supervision reduces, but does not eliminate, risk and does not guarantee any outcome.</p>
        <h3>Not advice</h3><p>Nothing here is financial, investment, legal or tax advice. Seek independent advice if you need it.</p>
        <div class="dmeta">Ref ${ref} · Demo document.</div>` },
      custody: { t: "Custody & escrow statement", b: `<h3>Where your money sits</h3><p>Subscription proceeds for <b>${m.name}</b> are held in a segregated escrow account, separate from the issuer's and Markhor's own funds, with a PVARA-licensed custodian.</p>
        <h3>Release schedule</h3><p>Funds leave escrow only against the verified milestones in the offering terms. Each release is recorded on-chain and published to the federation's transparency ledger.</p>
        <h3>On-chain backing</h3><table><tr><td>Token standard</td><td>Asset-referenced</td></tr><tr><td>Backing</td><td>Fully escrowed</td></tr><tr><td>Custodian</td><td>PVARA-licensed</td></tr><tr><td>Audit</td><td>Filed quarterly</td></tr></table>
        <div class="dmeta">Ref ${ref} · Demo document.</div>` },
      issuer: { t: "Issuer agreement", b: `<h3>Parties</h3><p>This agreement is between the issuer of <b>${m.name}</b> and Markhor (The National Operator), governing issuance, custody, clearing and reporting.</p>
        <h3>Obligations of the issuer</h3><ul><li>Apply proceeds only to the published slate.</li><li>Publish expenditure to the transparency ledger.</li><li>Deliver against milestones held in escrow.</li><li>Meet all PVARA–SECP disclosure and reporting requirements.</li></ul>
        <h3>Obligations of the operator</h3><ul><li>Issue, custody and clear the instrument under one rulebook.</li><li>Maintain on-chain audit logs and file quarterly.</li><li>Enforce investor-protection rules (caps, cooling-off, escrow).</li></ul>
        <h3>Governing law</h3><p>This agreement is governed by the laws of the Islamic Republic of Pakistan.</p>
        <div class="dmeta">Ref ${ref} · Demo document.</div>` },
    }[type];
    sheet(`<div class="mk-top"><button class="mk-x">×</button><div class="mk-ey">Document · ${m.name}</div><h2 class="mk-h">${C.t}</h2></div>
      <div class="mk-body" style="max-height:72vh"><div class="mk-doc">${C.b}</div><button class="mk-btn gho" id="back">← All documents</button></div>`);
    $("#back").onclick = () => docs(id);
  }
  function referral() {
    const code = "MARKHOR-" + ((S.user && S.user.email && !S.user.guest) ? S.user.email.slice(0, 3).toUpperCase() : "PK") + "42";
    sheet(`<div class="mk-top"><button class="mk-x">×</button><div class="mk-ey">Invite &amp; earn</div><h2 class="mk-h">Bring the diaspora in</h2><div class="mk-sub">You and a friend each get PKR 500 in credit.</div></div>
      <div class="mk-body"><label class="mk-lbl">Your invite code</label><div style="display:flex;gap:8px"><input class="mk-in" id="rc" value="${code}" readonly><button class="mk-btn pri" id="cp" style="margin:0;width:auto;padding:0 18px">Copy</button></div>
      <button class="mk-btn gho" id="sh">Share invite</button></div>`);
    $("#cp").onclick = () => { try { navigator.clipboard.writeText(code); } catch (e) { } toast("Code copied"); };
    $("#sh").onclick = () => { if (navigator.share) navigator.share({ title: "Markhor", text: "Own a share of Pakistani sport, story and song. Use my code " + code, url: location.href }).catch(() => { }); else toast("Code: " + code); };
  }
  // ---------- issuer console (federation OR creator/athlete) ----------
  let issEl = null, issMode = "fed";
  const ISS = {
    fed: {
      org: "Pakistan Hockey Federation", who: "federation", title: "Issuer console", img: "assets/img/c-hockey.jpg",
      sub: "Your supporter token, raise and public ledger — live.", supporters: "supporters", holderWord: "holders",
      raised: 62000000, cap: 100000000, holders: 8420, weekly: "+312 this week", diaspora: 61, dlabel: "UK · UAE · US · Canada",
      slate: [["World Cup preparation", 45], ["Two junior academies", 30], ["Women's hockey programme", 25]],
      regions: [["Karachi", 19], ["Lahore", 15], ["Dubai", 21], ["London", 16], ["Toronto", 11], ["Other", 18]],
      settleWord: "federation", acct: "NBP •••• 7741", col: "Federation",
      types: ["Supporter token", "Athlete share", "Ticket"], expHint: "e.g. Goalkeeper coaching clinic", issHint: "e.g. Asian Games supporter token",
      lkey: "mk_iss_ledger", ukey: "mk_iss_updates",
      defLedger: [["World Cup training camp", 8200000, 11], ["Junior academy — Lahore", 5400000, 23], ["Women's hockey kit &amp; travel", 3100000, 31], ["Coaching staff (Q1)", 4800000, 44]],
      defUpd: [["First academy intake confirmed", "32 players selected for the Lahore junior academy, funded entirely by supporter-token proceeds."], ["Women's squad travel booked", "The women's development squad's tour is fully covered. Receipts published to the ledger."]]
    },
    creator: {
      org: "Arshad Nadeem — career raise", who: "athlete", title: "Creator console", img: "assets/img/c-javelin.jpg",
      sub: "Your fan token, career share and royalties — live.", supporters: "backers", holderWord: "backers",
      raised: 18400000, cap: 30000000, holders: 2140, weekly: "+86 this week", diaspora: 54, dlabel: "UK · UAE · US · KSA",
      slate: [["Training & coaching", 40], ["Equipment & travel", 35], ["Family & reinvestment", 25]],
      regions: [["Mian Channu", 14], ["Lahore", 17], ["Dubai", 23], ["London", 18], ["Jeddah", 13], ["Other", 15]],
      settleWord: "you", acct: "Meezan •••• 3092", col: "Athlete share",
      types: ["Fan token", "Career share", "Royalty"], expHint: "e.g. Europe training camp", issHint: "e.g. 2027 season career share",
      lkey: "mk_iss_ledger_c", ukey: "mk_iss_updates_c",
      defLedger: [["Physio &amp; rehab block", 1600000, 9], ["Europe training camp", 2400000, 20], ["Competition travel", 900000, 28]],
      defUpd: [["Diamond League entry confirmed", "Backers funded the entry and travel for the next Diamond League leg. Receipts on the ledger."], ["Full-time throws coach retained", "A season-long coaching setup is now funded entirely by the raise."]]
    }
  };
  function iget(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } }
  const issLedger = C => iget(C.lkey, C.defLedger.map(x => ({ item: x[0], amount: x[1], ts: Date.now() - x[2] * 86400000 })));
  const issUpd = C => iget(C.ukey, C.defUpd.map((x, i) => ({ title: x[0], body: x[1], ts: Date.now() - (i + 1) * 4 * 86400000 })));
  function issuer(mode) {
    issMode = (mode === "creator") ? "creator" : "fed";
    if (appEl) { const e = appEl, b = appEl._bn; appEl = null; e.remove(); if (b) b.remove(); popLock("app"); }   // never coexist with the investor app shell
    if (!issEl) {
      issEl = document.createElement("div"); issEl.className = "mk-app"; issEl.style.cssText = "display:block;overflow:auto;background:var(--bone)";
      document.body.appendChild(issEl); pushLock("iss"); requestAnimationFrame(() => issEl.classList.add("in"));
      issEl.addEventListener("click", e => { const g = e.target.closest("[data-iss]"); if (g) issAction(g.dataset.iss); });
    }
    renderIss(); issEl.scrollTo(0, 0);
  }
  function closeIss() { if (!issEl) return; issEl.classList.remove("in"); const e = issEl; issEl = null; popLock("iss", true); setTimeout(() => e.remove(), 280); }
  function issAction(a) { ({ close: closeIss, expend: issExpend, update: issUpdate, issue: issIssue, settle: issSettle, switchp: issSwitch, mode: issToggle }[a] || (() => { }))(); }
  function issToggle() { issuer(issMode === "fed" ? "creator" : "fed"); }
  function renderIss() {
    if (!issEl) return;
    const C = ISS[issMode], RAISED = C.raised, CAP = C.cap, HOLDERS = C.holders;
    const ledger = issLedger(C), updates = issUpd(C);
    const spent = ledger.reduce((a, x) => a + x.amount, 0);
    issEl.innerHTML = `
      <div class="mk-tbar" style="position:sticky;top:0;z-index:5"><span class="bm" style="display:flex;align-items:center;gap:9px"><img src="assets/img/markhor-head.png" alt="" style="height:26px"><b style="font-family:'Bodoni Moda';font-size:17px;letter-spacing:.1em;color:var(--emerald)">MARKHOR</b></span>
        <span style="margin-left:14px;font:600 12px 'Hanken Grotesk';letter-spacing:.06em;color:var(--brass);border:1px solid rgba(184,146,77,.4);padding:5px 11px;border-radius:20px">${C.title}</span>
        <div class="sp" style="margin-left:auto;display:flex;gap:9px;align-items:center"><button class="mk-btn gho" data-iss="mode" style="margin:0;width:auto;padding:8px 14px;font-size:13px">${issMode === "fed" ? "View as athlete" : "View as federation"}</button><button class="mk-btn gho" data-iss="switchp" style="margin:0;width:auto;padding:8px 14px;font-size:13px">Investor view</button><button class="mk-dx" data-iss="close">×</button></div></div>
      <div class="mk-view" style="max-width:1040px">
        <div class="iss-hero" style="background:linear-gradient(180deg,rgba(7,38,25,.18),rgba(7,38,25,.72)),url('${C.img}') center/cover">
          <div class="ehl"><span class="cat" style="background:rgba(7,38,25,.55);backdrop-filter:blur(5px);color:var(--bone);border:1px solid rgba(244,238,226,.22)">${C.title}</span><h2>${C.org}</h2><p>${C.sub}</p></div></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px">
          <button class="mk-btn pri" data-iss="issue" style="margin:0;width:auto;padding:9px 16px">Issue new instrument</button>
          <button class="mk-btn gho" data-iss="update" style="margin:0;width:auto;padding:9px 16px">Post update</button>
          <button class="mk-btn gho" data-iss="expend" style="margin:0;width:auto;padding:9px 16px">Publish expenditure</button>
          <button class="mk-btn gho" data-iss="settle" style="margin:0;width:auto;padding:9px 16px">Settle to ${C.settleWord}</button></div>
        <div class="mk-s4">
          <div class="mk-sc"><div class="l">Raised</div><div class="v">${PKR(RAISED)}</div><div class="dd mk-up">${Math.round(RAISED / CAP * 100)}% of ${PKR(CAP)} cap</div></div>
          <div class="mk-sc"><div class="l">${C.holderWord[0].toUpperCase() + C.holderWord.slice(1)}</div><div class="v">${HOLDERS.toLocaleString("en-US")}</div><div class="dd" style="color:var(--ink-soft)">${C.weekly}</div></div>
          <div class="mk-sc"><div class="l">Diaspora share</div><div class="v">${C.diaspora}%</div><div class="dd" style="color:var(--ink-soft)">${C.dlabel}</div></div>
          <div class="mk-sc"><div class="l">Available to spend</div><div class="v">${PKR(RAISED - spent)}</div><div class="dd" style="color:var(--ink-soft)">${PKR(spent)} deployed</div></div></div>
        <div class="mk-pan"><div class="ph"><h4>Raise progress</h4><span style="margin-left:auto;font:600 13px 'JetBrains Mono';color:var(--emerald)">${PKR(RAISED)} / ${PKR(CAP)}</span></div>
          <div class="prog" style="height:10px;margin-top:6px"><i style="width:${RAISED / CAP * 100}%;background:linear-gradient(90deg,var(--brass),var(--emerald))"></i></div></div>
        <div class="mk-2">
          <div class="mk-pan"><div class="ph"><h4>Transparency ledger</h4><span style="margin-left:auto;font:600 11px;color:#3f8a63">● Public</span></div><div class="psub">Every rupee, published on-chain</div>
            <div style="font:600 11px 'Hanken Grotesk';letter-spacing:.05em;text-transform:uppercase;color:var(--ink-soft);margin:6px 0 4px">Committed slate</div>
            ${C.slate.map(([k, v]) => `<div class="mk-ar"><div class="nm">${k}</div><div class="mk-baro"><i style="width:${v}%;background:linear-gradient(90deg,var(--brass),var(--emerald))"></i></div><div class="pc">${v}%</div></div>`).join("")}
            <div style="font:600 11px 'Hanken Grotesk';letter-spacing:.05em;text-transform:uppercase;color:var(--ink-soft);margin:16px 0 4px">Expenditure log</div>
            ${ledger.map(l => `<div class="mk-hr"><div class="ic">▤</div><div class="nm"><b>${l.item}</b><span>${relTime(l.ts)} · published</span></div><div class="vl"><b>${PKR(l.amount)}</b></div></div>`).join("")}</div>
          <div>
            <div class="mk-pan"><h4>${C.holderWord[0].toUpperCase() + C.holderWord.slice(1)} by location</h4><div class="psub">Where your ${C.supporters} are</div>
              ${C.regions.map(([k, v]) => `<div class="mk-ar"><div class="nm" style="min-width:90px">${k}</div><div class="mk-baro"><i style="width:${v * 3}%;background:${CATCOL[C.col]}"></i></div><div class="pc">${v}%</div></div>`).join("")}</div>
            <div class="mk-pan"><h4>Settlement</h4><div class="psub">Cleared to ${issMode === "fed" ? "the federation account" : "your account"}</div>
              <table class="mk-tt"><tr><td>Available now</td><td>${PKR(RAISED - spent)}</td></tr><tr><td>Settles to</td><td>${C.acct}</td></tr><tr><td>Next auto-settlement</td><td>Friday</td></tr></table></div></div></div>
        <div class="mk-pan"><h4>Updates to ${C.holderWord}</h4><div class="psub">${updates.length} posted</div>
          ${updates.map(u => `<div class="mk-feed"><div class="av">▸</div><div class="tx"><b>${u.title}</b><br><span style="color:var(--ink-soft)">${u.body}</span></div><div class="tm">${relTime(u.ts)}</div></div>`).join("")}</div>
        <div style="font-size:11.5px;color:var(--ink-soft);opacity:.85">Demo ${C.title.toLowerCase()}. Live, this is the ${C.who}'s regulated view under the joint PVARA–SECP sandbox.</div></div>`;
  }
  function issExpend() {
    const C = ISS[issMode];
    sheet(`<div class="mk-top"><button class="mk-x">×</button><div class="mk-ey">Transparency ledger</div><h2 class="mk-h">Publish an expenditure</h2><div class="mk-sub">It posts to the public ledger immediately.</div></div>
      <div class="mk-body"><label class="mk-lbl">What was it for?</label><input class="mk-in" id="it" placeholder="${C.expHint}">
      <label class="mk-lbl">Amount (PKR)</label><input class="mk-in" id="am" inputmode="numeric" placeholder="0" style="font-family:'JetBrains Mono'">
      <button class="mk-btn pri" id="go">Publish to ledger</button><div class="mk-secure">${ICO.lock} Anchored on-chain · visible to all ${C.holderWord}</div></div>`);
    const am = $("#am"); am.oninput = () => { const v = parseInt(am.value.replace(/[^0-9]/g, ""), 10) || 0; am.value = v ? v.toLocaleString("en-US") : ""; };
    $("#go").onclick = () => { const item = $("#it").value.trim() || "Expenditure", amount = parseInt(am.value.replace(/[^0-9]/g, ""), 10) || 0; if (!amount) { am.classList.add("bad"); return; } const L = issLedger(C); L.unshift({ item, amount, ts: Date.now() }); localStorage.setItem(C.lkey, JSON.stringify(L)); close(); toast("Published to the public ledger"); renderIss(); };
  }
  function issUpdate() {
    const C = ISS[issMode];
    sheet(`<div class="mk-top"><button class="mk-x">×</button><div class="mk-ey">${C.holderWord[0].toUpperCase() + C.holderWord.slice(1)}</div><h2 class="mk-h">Post an update</h2><div class="mk-sub">All ${C.holders.toLocaleString("en-US")} ${C.holderWord} are notified.</div></div>
      <div class="mk-body"><label class="mk-lbl">Headline</label><input class="mk-in" id="ti" placeholder="e.g. Squad named for the World Cup">
      <label class="mk-lbl">Message</label><textarea class="mk-in" id="bo" rows="3" placeholder="Write to your ${C.supporters}…"></textarea>
      <button class="mk-btn pri" id="go">Post to ${C.holderWord}</button></div>`);
    $("#go").onclick = () => { const title = $("#ti").value.trim() || "Update", body = $("#bo").value.trim() || ""; const U = issUpd(C); U.unshift({ title, body, ts: Date.now() }); localStorage.setItem(C.ukey, JSON.stringify(U)); close(); toast(`Update posted to ${C.holders.toLocaleString("en-US")} ${C.holderWord}`); renderIss(); };
  }
  function issIssue() {
    const C = ISS[issMode]; let type = C.types[0];
    sheet(`<div class="mk-top"><button class="mk-x">×</button><div class="mk-ey">New issuance</div><h2 class="mk-h">Issue an instrument</h2><div class="mk-sub">Submitted to the PVARA–SECP sandbox for approval.</div></div>
      <div class="mk-body"><label class="mk-lbl">Instrument type</label><div class="mk-chips" id="ty">${C.types.map((t, i) => `<button class="mk-chip${i === 0 ? " on" : ""}" data-t="${t}">${t}</button>`).join("")}</div>
      <label class="mk-lbl">Name</label><input class="mk-in" id="nm" placeholder="${C.issHint}">
      <label class="mk-lbl">Issuance cap (PKR)</label><input class="mk-in" id="cp" inputmode="numeric" value="50,000,000" style="font-family:'JetBrains Mono'">
      <button class="mk-btn pri" id="go">Submit to sandbox</button><div class="mk-secure">${ICO.shield} Capped, disclosed, escrowed by default</div></div>`);
    $$("#ty .mk-chip").forEach(c => c.onclick = () => { type = c.dataset.t; $$("#ty .mk-chip").forEach(x => x.classList.toggle("on", x === c)); });
    const cp = $("#cp"); cp.oninput = () => { const v = parseInt(cp.value.replace(/[^0-9]/g, ""), 10) || 0; cp.value = v ? v.toLocaleString("en-US") : ""; };
    $("#go").onclick = () => { const b = $("#go"); b.disabled = true; b.innerHTML = `<span class="mk-spin"></span> Submitting…`; setTimeout(() => { sheet(`<div class="mk-top"><button class="mk-x">×</button></div><div class="mk-body"><div class="mk-ok"><div class="tick">${ICO.check}</div><h2 class="mk-h" style="margin-top:0">Submitted for approval.</h2><div class="mk-sub">Your ${type.toLowerCase()} is in the joint PVARA–SECP review queue. You'll be notified on approval.</div></div><button class="mk-btn pri" id="d">Done</button></div>`); $("#d").onclick = close; }, 1400); };
  }
  function issSettle() {
    const C = ISS[issMode], avail = C.raised - issLedger(C).reduce((a, x) => a + x.amount, 0);
    sheet(`<div class="mk-top"><button class="mk-x">×</button><div class="mk-ey">Settlement</div><h2 class="mk-h">Settle to ${C.settleWord}</h2><div class="mk-sub">Clear available proceeds to ${issMode === "fed" ? "the federation bank" : "your bank"}.</div></div>
      <div class="mk-body"><table class="mk-tt"><tr><td>Available</td><td>${PKR(avail)}</td></tr><tr><td>To</td><td>${C.acct}</td></tr><tr><td>Fee</td><td>PKR 0</td></tr></table>
      <button class="mk-btn pri" id="go">Settle now</button></div>`);
    $("#go").onclick = () => { const b = $("#go"); b.disabled = true; b.innerHTML = `<span class="mk-spin"></span> Settling…`; setTimeout(() => { close(); toast(`Settlement initiated to ${C.acct}`); }, 1400); };
  }
  function issSwitch() { if (issEl) { const e = issEl; issEl = null; e.remove(); popLock("iss"); } app("dashboard"); }

  const FEAT = { withdraw, sell, claim, alert: priceAlert, recurring, vote, notifications, statement, kyc, onchain, docs, referral, addfunds: addFunds, issuer };
  document.addEventListener("click", e => { const f = e.target.closest("[data-feat]"); if (!f) return; e.preventDefault(); const [fn, arg] = f.dataset.feat.split(":"); (FEAT[fn] || (() => { }))(arg); });

  // ---------- landing nav ----------
  function updateNav() {
    const u = S.user;
    document.querySelectorAll("[data-authnav]").forEach(box => {
      if (u) box.innerHTML = `<button class="btn btn-ghost-l" data-action="portfolio" style="padding:9px 16px">Portfolio</button><button data-action="portfolio" aria-label="Account" style="background:none;border:none;cursor:pointer"><span class="mk-av">${(u.name[0] || "M").toUpperCase()}</span></button>`;
      else box.innerHTML = box.dataset.authnav === "mobile" ? `<a href="javascript:void 0" data-action="signin">Sign in</a><a href="javascript:void 0" class="btn btn-primary" data-action="signup">Create account</a>` : `<a class="signin" href="javascript:void 0" data-action="signin">Sign in</a><a class="btn btn-primary cta-create" href="javascript:void 0" data-action="signup">Create account</a>`;
    });
  }

  // ---------- live FX ----------
  fetch("https://open.er-api.com/v6/latest/USD").then(r => r.json()).then(d => { const R = d && d.rates; if (R && R.PKR) { FX = R.PKR; FXR.USD = R.PKR; if (R.GBP) FXR.GBP = R.PKR / R.GBP; if (R.AED) FXR.AED = R.PKR / R.AED; if (R.EUR) FXR.EUR = R.PKR / R.EUR; document.querySelectorAll("[data-fx]").forEach(el => el.textContent = Math.round(FX)); } }).catch(() => { });

  // ---------- router ----------
  document.addEventListener("click", e => {
    const t = e.target.closest("[data-action]"); if (!t) return;
    const a = t.dataset.action;
    if (["signup", "signin", "guest", "buy", "view", "portfolio", "markets", "wallet", "open", "issuer", "raise", "invest"].includes(a)) e.preventDefault();
    if (a === "signup") auth("signup");
    else if (a === "signin") auth("signin");
    else if (a === "guest") startGuest();
    else if (a === "portfolio" || a === "open") app("dashboard");
    else if (a === "markets" || a === "invest") app("markets");
    else if (a === "wallet") app("wallet");
    else if (a === "issuer") issuer("fed");
    else if (a === "raise") issuer("creator");
    else if (a === "view") { const id = t.dataset.id || (t.closest("[data-id]") || {}).dataset?.id; app("instrument:" + id); }
    else if (a === "buy") buy(t.dataset.id || (t.closest("[data-id]") || {}).dataset?.id);
  });

  window.Markhor = { app, buy, auth, addFunds, startGuest, go };
  updateNav();
})();
