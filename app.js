/* Markhor — demo application layer.
   Accounts, investing, card checkout and a portfolio. 100% client-side (localStorage).
   This is a product DEMO: no real money moves, no real KYC, no real custody. */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const PKR = n => "PKR " + Math.round(n).toLocaleString("en-US");

  // ---- catalogue (shared with the markets cards via data-id) ----
  const MARKETS = {
    phf:     { name: "Hockey Supporter Token", cat: "Federation",       unit: "tokens", est: "Dashboard + fee model", min: 1000 },
    javelin: { name: "Javelin Career Share",   cat: "Athlete share",    unit: "shares", est: "Share of future earnings", min: 1000 },
    drama:   { name: "Drama Royalty",          cat: "Cultural royalty", unit: "units",  est: "12.4% royalty, monthly", min: 1000 },
    ticket:  { name: "Hockey vs India ticket", cat: "Ticketing",        unit: "tickets",est: "Programmable, resaleable", min: 3500 },
    music:   { name: "Single Royalty",         cat: "Music royalty",    unit: "units",  est: "8% revenue share", min: 1000 },
  };

  // ---- state ----
  const S = {
    get user() { try { return JSON.parse(localStorage.getItem("mk_user")); } catch (e) { return null; } },
    set user(v) { v ? localStorage.setItem("mk_user", JSON.stringify(v)) : localStorage.removeItem("mk_user"); },
    get holdings() { try { return JSON.parse(localStorage.getItem("mk_holdings")) || []; } catch (e) { return []; } },
    set holdings(v) { localStorage.setItem("mk_holdings", JSON.stringify(v)); },
  };

  // ---- styles (self-contained) ----
  const css = `
  .mk-ov{position:fixed;inset:0;z-index:1000;background:rgba(7,38,25,.55);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .25s}
  .mk-ov.in{opacity:1}
  .mk-sheet{background:var(--paper,#FBF7EE);color:var(--ink,#23211c);width:100%;max-width:440px;border-radius:18px;box-shadow:0 40px 90px -30px rgba(0,0,0,.6);overflow:hidden;transform:translateY(16px) scale(.98);transition:transform .28s cubic-bezier(.2,.8,.2,1);max-height:94vh;display:flex;flex-direction:column}
  .mk-ov.in .mk-sheet{transform:none}
  .mk-sheet.wide{max-width:560px}
  .mk-top{position:relative;padding:24px 26px 0}
  .mk-x{position:absolute;top:16px;right:16px;width:34px;height:34px;border:none;border-radius:50%;background:rgba(35,33,28,.06);color:var(--ink,#23211c);font-size:18px;cursor:pointer;line-height:1;transition:.2s}
  .mk-x:hover{background:rgba(35,33,28,.12)}
  .mk-ey{font:600 11px/1 'Hanken Grotesk',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--brass,#B8924D)}
  .mk-h{font-family:'Bodoni Moda',Georgia,serif;font-weight:600;font-size:26px;color:var(--emerald,#0E4D34);margin:10px 0 4px;line-height:1.12}
  .mk-sub{font-size:14px;color:var(--ink-soft,#56524a);margin-bottom:4px}
  .mk-body{padding:18px 26px 26px;overflow:auto}
  .mk-lbl{display:block;font:600 12px 'Hanken Grotesk',sans-serif;color:var(--ink-soft,#56524a);margin:14px 0 6px}
  .mk-in{width:100%;font:400 15px 'Hanken Grotesk',sans-serif;color:var(--ink,#23211c);background:#fff;border:1px solid rgba(35,33,28,.16);border-radius:9px;padding:13px 14px;outline:none;transition:border-color .2s}
  .mk-in:focus{border-color:var(--brass,#B8924D)}
  .mk-in.bad{border-color:#c0533b}
  .mk-row{display:flex;gap:10px}.mk-row>*{flex:1}
  .mk-btn{width:100%;font:600 15px 'Hanken Grotesk',sans-serif;border:none;border-radius:9px;padding:14px;cursor:pointer;transition:.2s;margin-top:18px;display:flex;align-items:center;justify-content:center;gap:9px}
  .mk-btn.pri{background:var(--brass,#B8924D);color:#072619}
  .mk-btn.pri:hover{background:var(--brass-2,#caa463)}
  .mk-btn.pri:disabled{opacity:.6;cursor:default}
  .mk-btn.gho{background:transparent;border:1px solid rgba(35,33,28,.16);color:var(--emerald,#0E4D34);margin-top:10px}
  .mk-tabs{display:flex;gap:6px;background:rgba(35,33,28,.05);border-radius:10px;padding:4px;margin-top:14px}
  .mk-tabs button{flex:1;border:none;background:none;font:600 13px 'Hanken Grotesk',sans-serif;color:var(--ink-soft,#56524a);padding:9px;border-radius:7px;cursor:pointer}
  .mk-tabs button.on{background:#fff;color:var(--emerald,#0E4D34);box-shadow:0 1px 4px rgba(0,0,0,.08)}
  .mk-chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
  .mk-chip{border:1px solid rgba(35,33,28,.16);background:#fff;border-radius:30px;padding:9px 15px;font:600 13px 'Hanken Grotesk',sans-serif;cursor:pointer;color:var(--ink,#23211c);font-variant-numeric:tabular-nums}
  .mk-chip.on{background:var(--emerald,#0E4D34);color:#fff;border-color:var(--emerald,#0E4D34)}
  .mk-card-vis{background:linear-gradient(135deg,#0e4d34,#072619);border-radius:13px;padding:18px;color:#F4EEE2;margin:6px 0 4px;position:relative;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(216,181,115,.2)}
  .mk-card-vis .brand{display:flex;justify-content:space-between;align-items:center;font:700 14px 'Bodoni Moda',serif;letter-spacing:.12em}
  .mk-card-vis .no{font-family:'JetBrains Mono',monospace;font-size:16px;letter-spacing:.08em;margin-top:22px;color:#e9e1cf}
  .mk-card-vis .ft{display:flex;justify-content:space-between;font:500 10px 'Hanken Grotesk',sans-serif;letter-spacing:.06em;text-transform:uppercase;color:rgba(244,238,226,.65);margin-top:14px}
  .mk-line{display:flex;justify-content:space-between;font-size:14px;padding:9px 0;border-bottom:1px solid rgba(35,33,28,.08);color:var(--ink-soft,#56524a)}
  .mk-line b{color:var(--ink,#23211c);font-weight:600;font-variant-numeric:tabular-nums}
  .mk-tot{display:flex;justify-content:space-between;align-items:baseline;padding:14px 0 2px}
  .mk-tot .v{font-family:'Bodoni Moda',serif;font-weight:600;font-size:26px;color:var(--emerald,#0E4D34)}
  .mk-note{font-size:12px;color:var(--ink-soft,#56524a);opacity:.85;margin-top:10px;line-height:1.5}
  .mk-secure{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--ink-soft,#56524a);margin-top:14px;justify-content:center}
  .mk-secure svg{width:14px;height:14px}
  .mk-spin{width:18px;height:18px;border:2px solid rgba(7,38,25,.3);border-top-color:#072619;border-radius:50%;animation:mkspin .7s linear infinite}
  @keyframes mkspin{to{transform:rotate(360deg)}}
  .mk-ok{text-align:center;padding:14px 0}
  .mk-ok .tick{width:64px;height:64px;border-radius:50%;background:var(--emerald,#0E4D34);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;animation:mkpop .4s cubic-bezier(.2,1.4,.4,1)}
  .mk-ok .tick svg{width:30px;height:30px;color:#fff}
  @keyframes mkpop{from{transform:scale(.5);opacity:0}}
  .mk-hold{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid rgba(35,33,28,.08)}
  .mk-hold .ic{width:38px;height:38px;border-radius:10px;background:rgba(14,77,52,.1);color:var(--emerald,#0E4D34);display:flex;align-items:center;justify-content:center;font:700 13px 'Bodoni Moda',serif;flex:none}
  .mk-hold .nm{flex:1;min-width:0}.mk-hold .nm b{display:block;font-size:13.5px;color:var(--ink,#23211c)}
  .mk-hold .nm span{font-size:11.5px;color:var(--ink-soft,#56524a)}
  .mk-hold .vl{text-align:right;font-variant-numeric:tabular-nums}.mk-hold .vl b{font-size:13.5px}.mk-hold .vl span{font-size:11.5px;color:#5aa97e;display:block}
  .mk-empty{text-align:center;color:var(--ink-soft,#56524a);padding:24px 0;font-size:14px}
  .mk-toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%) translateY(20px);z-index:1100;background:var(--ink,#23211c);color:#F4EEE2;font:500 13.5px 'Hanken Grotesk',sans-serif;padding:13px 20px;border-radius:30px;box-shadow:0 14px 40px rgba(0,0,0,.4);opacity:0;transition:.3s;display:flex;align-items:center;gap:9px;max-width:90vw}
  .mk-toast.in{opacity:1;transform:translateX(-50%)}
  .mk-toast .d{width:7px;height:7px;border-radius:50%;background:#d8b573}
  .mk-acct{display:flex;align-items:center;gap:9px}
  .mk-av{width:30px;height:30px;border-radius:50%;background:var(--brass,#B8924D);color:#072619;display:flex;align-items:center;justify-content:center;font:700 13px 'Bodoni Moda',serif}
  @media(max-width:480px){
    .mk-ov{align-items:flex-end;padding:0}
    .mk-sheet{max-width:none;border-radius:18px 18px 0 0;max-height:92vh}
    .mk-ov.in .mk-sheet{transform:none}
    .mk-sheet{transform:translateY(40px)}
  }`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  // ---- modal infra ----
  let ov = null;
  function close() { if (!ov) return; ov.classList.remove("in"); const o = ov; ov = null; setTimeout(() => o.remove(), 280); }
  function open(html, wide) {
    close();
    ov = document.createElement("div"); ov.className = "mk-ov";
    ov.innerHTML = `<div class="mk-sheet${wide ? " wide" : ""}" role="dialog" aria-modal="true">${html}</div>`;
    ov.addEventListener("click", e => { if (e.target === ov) close(); });
    document.body.appendChild(ov);
    requestAnimationFrame(() => ov.classList.add("in"));
    const x = $(".mk-x", ov); if (x) x.onclick = close;
    return ov;
  }
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  const ico = { lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7a4 4 0 018 0v3.5"/></svg>', check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 12 10 18 20 6"/></svg>' };

  function toast(msg) {
    const t = document.createElement("div"); t.className = "mk-toast"; t.innerHTML = `<span class="d"></span>${msg}`;
    document.body.appendChild(t); requestAnimationFrame(() => t.classList.add("in"));
    setTimeout(() => { t.classList.remove("in"); setTimeout(() => t.remove(), 350); }, 2600);
  }

  // ---- auth ----
  function auth(tab, then) {
    tab = tab || "signup";
    open(`
      <div class="mk-top"><button class="mk-x" aria-label="Close">×</button>
        <div class="mk-ey">Markhor account</div>
        <h2 class="mk-h" id="authH">Create your account</h2>
        <div class="mk-sub" id="authSub">A few details to get you on the rails. Demo only — use anything.</div>
        <div class="mk-tabs"><button data-t="signup">Create account</button><button data-t="signin">Sign in</button></div>
      </div>
      <div class="mk-body">
        <div id="nameW"><label class="mk-lbl">Full name</label><input class="mk-in" id="aName" placeholder="Your name"></div>
        <label class="mk-lbl">Email</label><input class="mk-in" id="aEmail" type="email" placeholder="you@email.com">
        <label class="mk-lbl">Password</label><input class="mk-in" id="aPass" type="password" placeholder="••••••••">
        <button class="mk-btn pri" id="aGo">Create account</button>
        <button class="mk-btn gho" id="aGuest">Skip — explore everything as a guest</button>
        <div class="mk-secure">${ico.lock} No email needed to try · bank-grade KYC at launch</div>
      </div>`);
    const setTab = t => {
      $$(".mk-tabs button").forEach(b => b.classList.toggle("on", b.dataset.t === t));
      $("#authH").textContent = t === "signup" ? "Create your account" : "Welcome back";
      $("#nameW").style.display = t === "signup" ? "" : "none";
      $("#aGo").textContent = t === "signup" ? "Create account" : "Sign in";
    };
    function $$(s) { return Array.from(document.querySelectorAll(s)); }
    $$(".mk-tabs button").forEach(b => b.onclick = () => setTab(b.dataset.t));
    setTab(tab);
    $("#aGo").onclick = () => {
      const email = $("#aEmail").value.trim(), name = ($("#aName").value.trim() || email.split("@")[0] || "Member");
      if (!email || !/.+@.+\..+/.test(email)) { $("#aEmail").classList.add("bad"); return; }
      S.user = { name, email };
      updateNav(); close(); toast("Welcome to Markhor, " + name.split(" ")[0]);
      if (then) setTimeout(then, 300);
    };
    $("#aGuest").onclick = () => startGuest(then);
  }

  // ---- guest mode: full experience, no email ----
  function startGuest(then) {
    S.user = { name: "Guest", email: "guest", guest: true };
    updateNav(); close(); toast("You're in — exploring as a guest");
    if (then) setTimeout(then, 300);
    else { const m = document.getElementById("markets"); if (m) m.scrollIntoView({ behavior: "smooth" }); }
  }

  // ---- buy / amount ----
  function buy(id) {
    const m = MARKETS[id]; if (!m) return;
    if (!S.user) { auth("signup", () => buy(id)); return; }
    let amt = Math.max(m.min, 5000);
    open(`
      <div class="mk-top"><button class="mk-x">×</button>
        <div class="mk-ey">${m.cat}</div><h2 class="mk-h">${m.name}</h2>
        <div class="mk-sub">${m.est} · capped, disclosed, escrowed.</div>
      </div>
      <div class="mk-body">
        <label class="mk-lbl">How much do you want to put in?</label>
        <input class="mk-in" id="amt" inputmode="numeric" value="${amt.toLocaleString("en-US")}" style="font-family:'JetBrains Mono',monospace;font-size:20px">
        <div class="mk-chips" id="chips">
          ${[1000, 5000, 25000, 100000].map(v => `<button class="mk-chip${v === amt ? " on" : ""}" data-v="${v}">${PKR(v).replace("PKR ", "₨")}</button>`).join("")}
        </div>
        <button class="mk-btn pri" id="cont">Continue to payment</button>
        <div class="mk-note">Illustrative demo. In the live product this would be a regulated issuance under the joint PVARA–SECP sandbox, with cooling-off and escrow. Not investment advice.</div>
      </div>`);
    const inEl = $("#amt");
    const read = () => parseInt(inEl.value.replace(/[^0-9]/g, ""), 10) || 0;
    const sync = () => { const v = read(); $$(".mk-chip").forEach(c => c.classList.toggle("on", +c.dataset.v === v)); };
    function $$(s) { return Array.from(document.querySelectorAll(s)); }
    inEl.oninput = () => { const v = read(); inEl.value = v ? v.toLocaleString("en-US") : ""; sync(); };
    $$(".mk-chip").forEach(c => c.onclick = () => { inEl.value = (+c.dataset.v).toLocaleString("en-US"); sync(); });
    $("#cont").onclick = () => { const v = read(); if (v < m.min) { inEl.classList.add("bad"); toast("Minimum is " + PKR(m.min)); return; } checkout(id, v); };
  }

  // ---- checkout (mock card) ----
  function checkout(id, amount) {
    const m = MARKETS[id];
    open(`
      <div class="mk-top"><button class="mk-x">×</button>
        <div class="mk-ey">Secure checkout</div><h2 class="mk-h">Pay ${PKR(amount)}</h2>
        <div class="mk-sub">${m.name} · ${m.cat}</div>
      </div>
      <div class="mk-body">
        <div class="mk-card-vis"><div class="brand"><span>MARKHOR</span><span style="font-family:'JetBrains Mono'">VISA</span></div>
          <div class="no" id="cnoDisp">•••• •••• •••• ••••</div>
          <div class="ft"><span id="cnameDisp">CARDHOLDER</span><span id="cexpDisp">MM/YY</span></div></div>
        <label class="mk-lbl">Card number</label>
        <input class="mk-in" id="cno" inputmode="numeric" autocomplete="cc-number" placeholder="4242 4242 4242 4242" maxlength="19">
        <div class="mk-row">
          <div><label class="mk-lbl">Expiry</label><input class="mk-in" id="cexp" placeholder="MM/YY" maxlength="5"></div>
          <div><label class="mk-lbl">CVC</label><input class="mk-in" id="ccvc" inputmode="numeric" placeholder="123" maxlength="4"></div>
        </div>
        <label class="mk-lbl">Name on card</label><input class="mk-in" id="cname" placeholder="${(S.user && S.user.name) || "Your name"}" value="${(S.user && S.user.name) || ""}">
        <button class="mk-btn pri" id="pay">Pay ${PKR(amount)}</button>
        <div class="mk-secure">${ico.lock} Demo checkout — no real card is charged. Try 4242 4242 4242 4242</div>
      </div>`);
    const no = $("#cno"), exp = $("#cexp"), cvc = $("#ccvc"), nm = $("#cname");
    no.oninput = () => { let v = no.value.replace(/\D/g, "").slice(0, 16); no.value = v.replace(/(.{4})/g, "$1 ").trim(); $("#cnoDisp").textContent = (no.value || "•••• •••• •••• ••••").padEnd(19, "•").replace(/(.{4})/g, "$1 ").trim().slice(0, 19) === "" ? "" : (v.padEnd(16, "•").replace(/(.{4})/g, "$1 ").trim()); };
    exp.oninput = () => { let v = exp.value.replace(/\D/g, "").slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2); exp.value = v; $("#cexpDisp").textContent = v || "MM/YY"; };
    cvc.oninput = () => { cvc.value = cvc.value.replace(/\D/g, "").slice(0, 4); };
    nm.oninput = () => { $("#cnameDisp").textContent = (nm.value || "CARDHOLDER").toUpperCase(); };
    $("#pay").onclick = () => {
      const digits = no.value.replace(/\D/g, "");
      if (digits.length < 15) { no.classList.add("bad"); toast("Enter a card number"); return; }
      if (!/^\d\d\/\d\d$/.test(exp.value)) { exp.classList.add("bad"); toast("Enter expiry MM/YY"); return; }
      if (cvc.value.length < 3) { cvc.classList.add("bad"); toast("Enter the CVC"); return; }
      const btn = $("#pay"); btn.disabled = true; btn.innerHTML = `<span class="mk-spin"></span> Processing…`;
      setTimeout(() => {
        const h = S.holdings; h.push({ id, name: m.name, cat: m.cat, amount, ts: Date.now() }); S.holdings = h;
        success(m, amount); updateNav();
      }, 1600);
    };
  }

  function success(m, amount) {
    open(`
      <div class="mk-top"><button class="mk-x">×</button></div>
      <div class="mk-body">
        <div class="mk-ok"><div class="tick">${ico.check}</div>
          <h2 class="mk-h" style="margin-top:0">You own a piece of it.</h2>
          <div class="mk-sub">${PKR(amount)} into <b>${m.name}</b> is now in your portfolio.</div>
        </div>
        <button class="mk-btn pri" id="goPort">View my portfolio</button>
        <button class="mk-btn gho" id="keep">Keep exploring</button>
      </div>`);
    $("#goPort").onclick = portfolio; $("#keep").onclick = close;
    toast("Added to your portfolio");
  }

  // ---- portfolio ----
  function portfolio() {
    if (!S.user) { auth("signin", portfolio); return; }
    const h = S.holdings, invested = h.reduce((a, x) => a + x.amount, 0);
    const value = h.reduce((a, x) => a + x.amount * (1 + (((x.ts % 9) + 2) / 100)), 0); // demo gain 2–10%
    const gain = invested ? ((value - invested) / invested) * 100 : 0;
    open(`
      <div class="mk-top"><button class="mk-x">×</button>
        <div class="mk-ey">${S.user.name}</div><h2 class="mk-h">Your portfolio</h2>
      </div>
      <div class="mk-body">
        <div class="mk-card-vis"><div class="brand"><span>MARKHOR</span><span style="font:500 10px 'Hanken Grotesk';letter-spacing:.12em">DIASPORA WALLET</span></div>
          <div class="no" style="font-size:24px;margin-top:14px">${PKR(value)}</div>
          <div class="ft"><span>Total value</span><span style="color:#84d6ac">${gain >= 0 ? "▲" : "▼"} ${Math.abs(gain).toFixed(1)}% · invested ${PKR(invested)}</span></div></div>
        ${h.length ? h.map(x => {
          const v = x.amount * (1 + (((x.ts % 9) + 2) / 100));
          return `<div class="mk-hold"><div class="ic">${x.cat[0]}</div><div class="nm"><b>${x.name}</b><span>${x.cat}</span></div><div class="vl"><b>${PKR(v)}</b><span>+${((v / x.amount - 1) * 100).toFixed(1)}%</span></div></div>`;
        }).join("") : `<div class="mk-empty">Nothing here yet. Back a federation, an athlete or a royalty to get started.</div>`}
        ${S.user.guest ? `<div class="mk-note" style="background:rgba(184,146,77,.12);border-radius:9px;padding:11px 13px;color:var(--ink);margin:2px 0 10px">You're exploring as a <b>guest</b>. <a href="javascript:void 0" data-action="signup" style="color:var(--brass);font-weight:600">Create an account</a> to keep your portfolio.</div>` : ``}
        <button class="mk-btn pri" id="explore">Explore markets</button>
        <button class="mk-btn gho" id="out">${S.user.guest ? "End guest session" : "Sign out"}</button>
        <div class="mk-note">Demo values are illustrative. No real money or instruments are involved.</div>
      </div>`);
    $("#explore").onclick = () => { close(); document.getElementById("markets").scrollIntoView({ behavior: "smooth" }); };
    $("#out").onclick = () => { S.user = null; S.holdings = []; updateNav(); close(); toast("Signed out"); };
  }

  // ---- nav wiring ----
  function updateNav() {
    const u = S.user;
    document.querySelectorAll("[data-authnav]").forEach(box => {
      if (u) {
        box.innerHTML = `<button class="btn btn-ghost-l" data-action="portfolio" style="padding:9px 16px">Portfolio</button>
          <button class="mk-acct" data-action="portfolio" aria-label="Account" style="background:none;border:none;cursor:pointer"><span class="mk-av">${(u.name[0] || "M").toUpperCase()}</span></button>`;
      } else {
        box.innerHTML = box.dataset.authnav === "mobile"
          ? `<a href="javascript:void 0" data-action="signin">Sign in</a><a href="javascript:void 0" class="btn btn-primary" data-action="signup">Create account</a>`
          : `<a class="signin" href="javascript:void 0" data-action="signin">Sign in</a><a class="btn btn-primary cta-create" href="javascript:void 0" data-action="signup">Create account</a>`;
      }
    });
  }

  // ---- global click routing ----
  document.addEventListener("click", e => {
    const t = e.target.closest("[data-action]"); if (!t) return;
    const a = t.dataset.action;
    if (["signup", "signin", "buy", "portfolio", "guest"].includes(a)) e.preventDefault();
    if (a === "signup") auth("signup");
    else if (a === "signin") auth("signin");
    else if (a === "guest") startGuest();
    else if (a === "portfolio") portfolio();
    else if (a === "buy") buy(t.dataset.id || (t.closest("[data-id]") || {}).dataset?.id);
  });

  window.Markhor = { buy, auth, portfolio };
  updateNav();
})();
