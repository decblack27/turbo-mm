const MAX_NAME = 20;
const MAX_TITLE = 80;
const MAX_PRICE = 40;
const MAX_DESC = 1000;
const MAX_CONTACT = 60;
const MAX_CHAT = 500;
const MAX_HISTORY = 100;
const MAX_PHOTO = 3 * 1024 * 1024;
const TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

// ===== စာသားများ (ဒီနေရာမှာ ပြင်ပါ) =====
const SITE = {
  name: "TURBO MM",
  tagline: "ရောင်းဝယ်ရေးနဲ့ အုပ်စုစကားပြောခန်း",
  home: {
    intro: "TURBO MM မှာ ပစ္စည်းရောင်းချချင်သူနဲ့ ဝယ်ချင်သူတွေ လွယ်လွယ်ကူကူ တွေ့ဆုံနိုင်ပါတယ်။ ကြော်ငြာတင်ရင် Admin စစ်ဆေးပြီးမှ ပေါ်ပါမယ်။",
    features: [
      { title: "🛍 ကြော်ငြာများ", text: "အတည်ပြုပြီးသား ပစ္စည်းနဲ့ ဝန်ဆောင်မှု ကြော်ငြာတွေကို ကြည့်ပါ။" },
      { title: "➕ ကြော်ငြာတင်ရန်", text: "ပစ္စည်းပုံ၊ ဈေးနှုန်း၊ ဆက်သွယ်ရန် အချက်အလက် ထည့်ပြီး တင်ပါ။" },
      { title: "💬 Group", text: "အသုံးပြုသူအားလုံး အတူတူ စကားပြောနိုင်ပါတယ်။" }
    ]
  },
  rules: [
    "အတု ပစ္စည်းနဲ့ လိမ်လည်ရောင်းချမှု မပြုလုပ်ရပါ။",
    "ဈေးနှုန်းနဲ့ ပစ္စည်းအခြေအနေကို မှန်ကန်စွာ ဖော်ပြပါ။",
    "ငွေပေးချေမှုကို ဝယ်သူနဲ့ ရောင်းသူ တိုက်ရိုက် ညှိရပါမယ်။ ငွေမပေးမီ ပစ္စည်းကို သေချာစစ်ပါ။",
    "Group မှာ အကြမ်းဖက်စကား၊ စော်ကားစကား မသုံးရပါ။",
    "စည်းကမ်းချိုးဖောက်သူကို Admin က ကြော်ငြာဖျက်ခြင်း၊ Group ကနေ ထုတ်ခြင်း ပြုနိုင်ပါတယ်။"
  ],
  contact: {
    telegramChannel: "https://t.me/arsar2027",
    owner: "@turbomm750",
    ownerLink: "https://t.me/turbomm750",
    note: "မေးခွန်းရှိရင် Owner ကို Telegram မှာ တိုက်ရိုက် ဆက်သွယ်ပါ။"
  }
};

function clean(value, max) {
  return String(value ?? "").trim().slice(0, max);
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=UTF-8" },
  });
}

const HTML = `<!DOCTYPE html>
<html lang="my">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>TURBO MM</title>
<style>
  :root {
    --gold: #f5c542; --gold2: #d9a521; --bg: #0e0e13; --panel: #17171f; --card: #1c1c26;
    --line: #2a2a35; --text: #f1f1f4; --muted: #8a8a99; --them: #22222d;
    --ok: #7ddc8f; --warn: #f5b342; --danger: #ff5c5c;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
    background: var(--bg); color: var(--text); min-height: 100vh; display: flex; flex-direction: column;
  }
  .hidden { display: none !important; }
  header {
    position: sticky; top: 0; z-index: 5; display: flex; align-items: center; justify-content: space-between; gap: 10px;
    padding: 12px 16px; padding-top: calc(12px + env(safe-area-inset-top, 0px));
    background: rgba(23, 23, 31, 0.95); border-bottom: 1px solid var(--line);
  }
  .brand { font-weight: 800; letter-spacing: 3px; color: var(--gold); font-size: 18px; }
  .brand small { display: block; font-size: 11px; letter-spacing: 1px; color: var(--muted); font-weight: 500; margin-top: 2px; }
  .pill {
    font-size: 12px; color: var(--muted); background: var(--card); border: 1px solid var(--line);
    padding: 5px 10px; border-radius: 999px; white-space: nowrap;
  }
  .pill.ok { color: var(--ok); }
  .pill.bad { color: var(--danger); }
  nav {
    position: sticky; top: 58px; z-index: 4; display: flex; gap: 6px; padding: 10px 12px; overflow-x: auto;
    background: var(--panel); border-bottom: 1px solid var(--line); scrollbar-width: none;
  }
  nav::-webkit-scrollbar { display: none; }
  nav button {
    flex-shrink: 0; padding: 8px 14px; border-radius: 999px; border: 1px solid var(--line);
    background: var(--card); color: var(--muted); font-size: 14px; cursor: pointer;
  }
  nav button.on {
    background: linear-gradient(135deg, var(--gold), var(--gold2)); color: #111; border-color: transparent; font-weight: 700;
  }
  main { flex: 1; padding: 16px; width: 100%; max-width: 760px; margin: 0 auto; }
  .grid { display: grid; gap: 14px; grid-template-columns: 1fr; }
  @media (min-width: 620px) { .grid { grid-template-columns: 1fr 1fr; } }

  .hero { text-align: center; padding: 18px 6px 10px; }
  .hero-title { font-size: 30px; font-weight: 800; letter-spacing: 4px; color: var(--gold); }
  .hero-tag { color: var(--muted); font-size: 14px; margin-top: 6px; }
  .hero-intro { color: #c9c9d3; font-size: 14.5px; line-height: 1.7; margin: 16px auto 0; max-width: 560px; }
  .feats { display: grid; gap: 12px; margin-top: 20px; grid-template-columns: 1fr; }
  @media (min-width: 620px) { .feats { grid-template-columns: repeat(3, 1fr); } }
  .feat { background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 16px; text-align: left; }
  .feat-t { font-weight: 700; margin-bottom: 6px; }
  .feat-d { color: var(--muted); font-size: 13.5px; line-height: 1.6; }

  .card {
    background: var(--card); border: 1px solid var(--line); border-radius: 16px;
    overflow: hidden; display: flex; flex-direction: column;
  }
  .card img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; background: #111; display: block; }
  .body { padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
  .title { font-weight: 700; font-size: 16px; line-height: 1.35; word-break: break-word; }
  .price { color: var(--gold); font-weight: 800; font-size: 17px; }
  .desc { color: #c9c9d3; font-size: 13.5px; line-height: 1.5; white-space: pre-wrap; word-break: break-word; }
  .seller { font-size: 12.5px; color: var(--muted); }
  .tag { display: inline-block; font-size: 12px; padding: 3px 9px; border-radius: 999px; font-weight: 700; align-self: flex-start; }
  .tag.pending { background: rgba(245, 179, 66, 0.15); color: var(--warn); }
  .tag.approved { background: rgba(125, 220, 143, 0.15); color: var(--ok); }
  .tag.rejected { background: rgba(255, 92, 92, 0.15); color: var(--danger); }
  .contact {
    display: block; margin-top: 6px; text-align: center; padding: 10px; border-radius: 10px;
    background: linear-gradient(135deg, var(--gold), var(--gold2)); color: #111; font-weight: 700; text-decoration: none;
  }
  .plain { margin-top: 6px; text-align: center; padding: 10px; border-radius: 10px; border: 1px solid var(--line); font-size: 14px; }

  .btn {
    padding: 10px 14px; border-radius: 10px; background: var(--card); color: var(--text);
    border: 1px solid var(--line); cursor: pointer; font-size: 14px; font-family: inherit;
  }
  .btn.gold { background: linear-gradient(135deg, var(--gold), var(--gold2)); color: #111; font-weight: 700; border: 0; }
  .btn.red { color: var(--danger); border-color: rgba(255, 92, 92, 0.4); }
  .btn.green { color: var(--ok); border-color: rgba(125, 220, 143, 0.4); }
  .btn:disabled { opacity: 0.5; }
  .row-btns { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px; }
  .row-btns.center { justify-content: center; margin-top: 22px; }

  form.post {
    display: flex; flex-direction: column; gap: 12px; background: var(--card);
    border: 1px solid var(--line); border-radius: 16px; padding: 16px;
  }
  label { font-size: 13px; color: var(--muted); display: flex; flex-direction: column; gap: 6px; }
  input, textarea {
    width: 100%; padding: 12px 14px; border-radius: 12px; border: 1px solid var(--line);
    background: var(--bg); color: var(--text); font-size: 15px; font-family: inherit; outline: none;
  }
  input[type=file] { padding: 10px; font-size: 14px; }
  textarea { min-height: 90px; resize: vertical; }
  input:focus, textarea:focus { border-color: var(--gold); }
  .msg { font-size: 13.5px; min-height: 18px; text-align: center; }
  .msg.err { color: var(--danger); }
  .msg.ok { color: var(--ok); }
  .empty { text-align: center; color: var(--muted); padding: 40px 10px; font-size: 14px; }
  .hint { font-size: 12.5px; color: var(--muted); line-height: 1.6; text-align: center; }

  .rule { display: flex; gap: 12px; align-items: flex-start; background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 14px; margin-bottom: 10px; }
  .rule-n { flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%; background: var(--gold); color: #111; font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 13px; }
  .rule-t { font-size: 14.5px; line-height: 1.6; }

  .chatbox { display: flex; flex-direction: column; background: var(--panel); border: 1px solid var(--line); border-radius: 16px; overflow: hidden; }
  .chatbar { display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 10px 12px; border-bottom: 1px solid var(--line); flex-wrap: wrap; }
  .chatadmin { display: flex; gap: 6px; flex-wrap: wrap; padding: 8px 12px; background: #1b1a14; border-bottom: 1px solid #3a3320; }
  .chatadmin button { padding: 7px 12px; border-radius: 8px; border: 1px solid #4a4128; background: #2a2618; color: var(--gold); font-size: 13px; cursor: pointer; }
  #chatMsgs {
    height: calc(100vh - 330px); min-height: 280px; overflow-y: auto; padding: 14px 12px;
    display: flex; flex-direction: column; gap: 2px; background: var(--bg);
  }
  .sys { align-self: center; font-size: 12px; color: var(--muted); background: #1a1a22; padding: 4px 12px; border-radius: 999px; margin: 6px 0; text-align: center; }
  .row { display: flex; margin: 3px 0; }
  .row.mine { justify-content: flex-end; }
  .bubble {
    position: relative; max-width: 78%; padding: 7px 12px 6px; border-radius: 16px;
    background: var(--them); border: 1px solid var(--line); box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
  }
  .row.them .bubble { border-bottom-left-radius: 4px; }
  .row.mine .bubble { background: linear-gradient(135deg, var(--gold), var(--gold2)); color: #15120a; border-color: transparent; border-bottom-right-radius: 4px; }
  .who { font-size: 12.5px; font-weight: 700; color: var(--gold); margin-bottom: 2px; }
  .badge { font-size: 10px; background: var(--gold); color: #111; padding: 1px 6px; border-radius: 6px; font-weight: 700; margin-left: 6px; }
  .text { white-space: pre-wrap; word-break: break-word; line-height: 1.45; font-size: 15px; }
  .meta { font-size: 11px; opacity: 0.6; text-align: right; margin-top: 3px; }
  .del {
    position: absolute; top: -8px; right: -8px; width: 22px; height: 22px; border-radius: 50%;
    border: 0; background: var(--danger); color: #fff; font-size: 11px; cursor: pointer; padding: 0;
  }
  .lockmsg { text-align: center; padding: 8px; font-size: 13px; color: #ffb3b3; background: rgba(255, 92, 92, 0.12); }
  form.chatform { display: flex; gap: 8px; align-items: center; padding: 10px 12px; background: var(--panel); border-top: 1px solid var(--line); }
  #chatText { flex: 1; min-width: 0; padding: 11px 16px; border-radius: 22px; }
  #chatSend {
    width: 46px; height: 46px; flex-shrink: 0; border-radius: 50%; border: 0;
    background: linear-gradient(135deg, var(--gold), var(--gold2)); color: #111; font-size: 18px; cursor: pointer;
  }
  #chatText:disabled, #chatSend:disabled { opacity: 0.4; cursor: not-allowed; }

  .adminbox { background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 14px; display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
  .adminbox input { flex: 1; min-width: 180px; }

  footer { text-align: center; padding: 12px; font-size: 12px; color: var(--muted); border-top: 1px solid var(--line); background: var(--panel); padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px)); }
  footer a { color: var(--gold); text-decoration: none; margin: 0 6px; }

  #modal { display: none; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75); align-items: center; justify-content: center; padding: 20px; z-index: 20; }
  #modal .box { width: 100%; max-width: 340px; background: var(--panel); border: 1px solid var(--line); border-radius: 18px; padding: 24px 20px; text-align: center; display: flex; flex-direction: column; gap: 10px; }
  #modal h2 { margin: 0; color: var(--gold); letter-spacing: 3px; }
  #modal p { color: var(--muted); font-size: 13px; margin: 0; line-height: 1.5; }
  .contactcard { display: flex; flex-direction: column; gap: 10px; }
</style>
</head>
<body>
<header>
  <div class="brand">TURBO MM<small>Marketplace & Group</small></div>
  <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
    <span id="me" class="pill">—</span>
  </div>
</header>

<nav>
  <button data-tab="home" class="on">🏠 ပင်မ</button>
  <button data-tab="shop">🛍 ကြော်ငြာများ</button>
  <button data-tab="sell">➕ ကြော်ငြာတင်မည်</button>
  <button data-tab="mine">📦 ကျွန်ုပ်၏ ကြော်ငြာ</button>
  <button data-tab="group">💬 Group</button>
  <button data-tab="rules">📜 စည်းကမ်းချက်</button>
  <button data-tab="contact">📞 ဆက်သွယ်ရန်</button>
  <button data-tab="admin" id="adminTabBtn" class="hidden">🛡 Admin</button>
</nav>

<main>
  <section id="tab-home">
    <div class="hero" id="homeBox"></div>
  </section>

  <section id="tab-shop" class="hidden">
    <div class="grid" id="shopGrid"></div>
    <div id="shopEmpty" class="empty hidden">ကြော်ငြာ မရှိသေးပါ</div>
  </section>

  <section id="tab-sell" class="hidden">
    <form class="post" id="postForm">
      <label>ပစ္စည်း / ဝန်ဆောင်မှု အမည်
        <input name="title" maxlength="80" required>
      </label>
      <label>ဈေးနှုန်း
        <input name="price" maxlength="40" placeholder="ဥပမာ 15,000 ကျပ်" required>
      </label>
      <label>အကြောင်းအရာ
        <textarea name="description" maxlength="1000" placeholder="အခြေအနေ၊ အရွယ်အစား စသည်"></textarea>
      </label>
      <label>ဆက်သွယ်ရန် (Telegram @username သို့ ဖုန်းနံပါတ်)
        <input name="contact" maxlength="60" placeholder="@username သို့ 09xxxxxxxxx" required>
      </label>
      <label>ပစ္စည်းပုံ (JPG / PNG / WEBP, 3MB အများဆုံး)
        <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" required>
      </label>
      <button class="btn gold" type="submit" id="postBtn">တင်မည်</button>
      <div class="msg" id="postMsg"></div>
      <div class="hint">တင်ပြီးရင် Admin အတည်ပြုမှ ကြော်ငြာစာရင်းမှာ ပေါ်ပါမယ်။</div>
    </form>
  </section>

  <section id="tab-mine" class="hidden">
    <div class="grid" id="mineGrid"></div>
    <div id="mineEmpty" class="empty hidden">သင့်ကြော်ငြာ မရှိသေးပါ</div>
  </section>

  <section id="tab-group" class="hidden">
    <div class="chatbox">
      <div class="chatbar">
        <span id="chatStatus" class="pill">⏳ ချိတ်ဆက်နေသည်...</span>
        <span id="chatOnline" class="pill">Online: 0</span>
      </div>
      <div class="chatadmin hidden" id="chatAdminRow">
        <button id="cLock" type="button">🔒 ပိတ်</button>
        <button id="cClear" type="button">🧹 ရှင်း</button>
        <button id="cKick" type="button">🚫 ထုတ်</button>
        <button id="cUnban" type="button">♻ ပြန်ခွင့်</button>
      </div>
      <div id="chatMsgs"></div>
      <div id="chatLockMsg" class="lockmsg hidden">🔒 Admin က chat ကို ယာယီပိတ်ထားပါတယ်</div>
      <form class="chatform" id="chatForm">
        <input id="chatText" maxlength="500" placeholder="စာရိုက်ပါ..." autocomplete="off" disabled>
        <button id="chatSend" type="submit" disabled>➤</button>
      </form>
    </div>
  </section>

  <section id="tab-rules" class="hidden">
    <div id="rulesBox"></div>
  </section>

  <section id="tab-contact" class="hidden">
    <div class="contactcard" id="contactBox"></div>
  </section>

  <section id="tab-admin" class="hidden">
    <div class="adminbox" id="adminLogin">
      <input id="adminKeyInput" type="password" placeholder="Admin key" autocomplete="off">
      <button class="btn gold" id="adminLoginBtn" type="button">ဝင်မည်</button>
      <div class="msg err" id="adminMsg" style="width:100%"></div>
    </div>
    <div id="adminPanel" class="hidden">
      <div class="row-btns" style="margin-bottom:12px">
        <button class="btn" id="adminRefresh" type="button">🔄 ပြန်လတ်</button>
        <button class="btn" id="adminLogout" type="button">ထွက်မည်</button>
      </div>
      <div class="grid" id="adminGrid"></div>
      <div id="adminEmpty" class="empty hidden">ကြော်ငြာ မရှိသေးပါ</div>
    </div>
  </section>
</main>

<footer>
  <a id="footTg" href="#" target="_blank" rel="noopener">Telegram Channel</a> ·
  <a id="footOwner" href="#" target="_blank" rel="noopener">Owner</a>
</footer>

<div id="modal">
  <div class="box">
    <h2>TURBO MM</h2>
    <p>နာမည်ကို တစ်ခါ သတ်မှတ်ပြီးရင် ပြောင်းလို့မရတော့ပါဘူး</p>
    <input id="nameInput" maxlength="20" placeholder="နာမည်" autocomplete="off">
    <button class="btn gold" id="nameBtn" type="button">ဝင်မည်</button>
    <div class="msg err" id="nameMsg"></div>
  </div>
</div>

<script>
  var SITE = __SITE__;
  var $ = function (id) { return document.getElementById(id); };
  var IS_ADMIN_PAGE = document.body.getAttribute("data-admin") === "1";
  var STATUS_TEXT = { pending: "⏳ စောင့်ဆဲ", approved: "✅ ပြသနေသည်", rejected: "❌ ပယ်ချခံရ" };

  var uid = localStorage.getItem("tmm_uid");
  if (!uid) {
    uid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("tmm_uid", uid);
  }
  var myName = localStorage.getItem("tmm_name") || "";
  var adminKey = sessionStorage.getItem("tmm_akey") || "";
  var chatAdmin = false, chatLocked = false, chatJoined = false, chatBanned = false;
  var chatWs = null;

  function div(cls, text) {
    var d = document.createElement("div");
    d.className = cls;
    d.textContent = text;
    return d;
  }

  function btn(text, cls, fn) {
    var b = document.createElement("button");
    b.className = cls;
    b.textContent = text;
    b.type = "button";
    b.onclick = fn;
    return b;
  }

  function linkBtn(text, href) {
    var a = document.createElement("a");
    a.className = "contact";
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = text;
    return a;
  }

  function api(path, opts) {
    opts = opts || {};
    var headers = {};
    if (adminKey && path.indexOf("/api/admin/") === 0) headers["X-Admin-Key"] = adminKey;
    var init = { method: opts.method || "GET", headers: headers };
    if (opts.json) {
      headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(opts.json);
    }
    if (opts.form) init.body = opts.form;
    return fetch(path, init).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (data) {
        data._ok = r.ok;
        data._status = r.status;
        return data;
      });
    });
  }

  function timeStr(t) {
    return new Date(t).toLocaleTimeString("my-MM", { hour: "2-digit", minute: "2-digit" });
  }

  function setMe() {
    $("me").textContent = "👤 " + (myName || "—") + (IS_ADMIN_PAGE && adminKey ? " 🛡" : "");
  }

  function showTab(name) {
    document.querySelectorAll("nav button").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-tab") === name);
    });
    document.querySelectorAll("main > section").forEach(function (s) {
      s.classList.toggle("hidden", s.id !== "tab-" + name);
    });
    if (name === "shop") loadShop();
    if (name === "mine") loadMine();
    if (name === "admin") loadAdmin();
    if (name === "group") chatScroll();
    window.scrollTo(0, 0);
  }

  // ===== ပင်မ / စည်းကမ်း / ဆက်သွယ်ရန် =====
  function renderHome() {
    var box = $("homeBox");
    box.innerHTML = "";
    box.appendChild(div("hero-title", SITE.name));
    box.appendChild(div("hero-tag", SITE.tagline));
    box.appendChild(div("hero-intro", SITE.home.intro));
    var feats = document.createElement("div");
    feats.className = "feats";
    SITE.home.features.forEach(function (f) {
      var c = document.createElement("div");
      c.className = "feat";
      c.appendChild(div("feat-t", f.title));
      c.appendChild(div("feat-d", f.text));
      feats.appendChild(c);
    });
    box.appendChild(feats);
    var go = document.createElement("div");
    go.className = "row-btns center";
    go.appendChild(btn("🛍 ကြော်ငြာများ", "btn gold", function () { showTab("shop"); }));
    go.appendChild(btn("💬 Group ဝင်မည်", "btn", function () { showTab("group"); }));
    box.appendChild(go);
  }

  function renderRules() {
    var box = $("rulesBox");
    box.innerHTML = "";
    SITE.rules.forEach(function (r, i) {
      var row = document.createElement("div");
      row.className = "rule";
      row.appendChild(div("rule-n", String(i + 1)));
      row.appendChild(div("rule-t", r));
      box.appendChild(row);
    });
  }

  function renderContact() {
    var box = $("contactBox");
    box.innerHTML = "";
    box.appendChild(linkBtn("📢 Telegram Channel", SITE.contact.telegramChannel));
    box.appendChild(linkBtn("👤 Owner " + SITE.contact.owner, SITE.contact.ownerLink));
    box.appendChild(div("hint", SITE.contact.note));
  }

  // ===== ကြော်ငြာ =====
  function contactEl(text) {
    var t = String(text || "").trim();
    if (/^@[A-Za-z0-9_]{3,}$/.test(t)) {
      return linkBtn("Telegram " + t + " ကို စာပို့မည်", "https://t.me/" + t.slice(1));
    }
    if (/^[+]?[0-9 ]{6,}$/.test(t)) {
      var p = document.createElement("a");
      p.className = "contact";
      p.href = "tel:" + t.replace(/ /g, "");
      p.textContent = "📞 " + t + " ကို ဖုန်းခေါ်မည်";
      return p;
    }
    return div("plain", "ဆက်သွယ်ရန်: " + t);
  }

  function cardEl(l, opt) {
    opt = opt || {};
    var card = document.createElement("div");
    card.className = "card";
    var img = document.createElement("img");
    img.loading = "lazy";
    img.alt = l.title;
    img.src = "/img/" + l.photoKey;
    card.appendChild(img);

    var body = document.createElement("div");
    body.className = "body";
    if (opt.status) body.appendChild(div("tag " + l.status, STATUS_TEXT[l.status] || l.status));
    body.appendChild(div("title", l.title));
    body.appendChild(div("price", l.price));
    if (l.description) body.appendChild(div("desc", l.description));
    body.appendChild(div("seller", "ရောင်းသူ: " + l.ownerName + " · " + new Date(l.createdAt).toLocaleDateString("my-MM")));
    if (opt.contact) body.appendChild(contactEl(l.contact));
    card.appendChild(body);
    return card;
  }

  function loadShop() {
    api("/api/listings").then(function (d) {
      var g = $("shopGrid");
      g.innerHTML = "";
      var list = d.listings || [];
      $("shopEmpty").classList.toggle("hidden", list.length > 0);
      list.forEach(function (l) { g.appendChild(cardEl(l, { contact: true })); });
    });
  }

  function loadMine() {
    api("/api/mine", { method: "POST", json: { uid: uid } }).then(function (d) {
      var g = $("mineGrid");
      g.innerHTML = "";
      var list = d.listings || [];
      $("mineEmpty").classList.toggle("hidden", list.length > 0);
      list.forEach(function (l) {
        var c = cardEl(l, { status: true });
        var row = document.createElement("div");
        row.className = "row-btns";
        row.appendChild(btn("🗑 ဖျက်မည်", "btn red", function () {
          if (!confirm("ဖျက်မလား?")) return;
          api("/api/listing/delete", { method: "POST", json: { uid: uid, id: l.id } }).then(loadMine);
        }));
        c.querySelector(".body").appendChild(row);
        g.appendChild(c);
      });
    });
  }

  function loadAdmin() {
    if (!adminKey) {
      $("adminLogin").classList.remove("hidden");
      $("adminPanel").classList.add("hidden");
      return;
    }
    api("/api/admin/listings").then(function (d) {
      if (d._status === 401) {
        adminKey = "";
        sessionStorage.removeItem("tmm_akey");
        $("adminMsg").textContent = d.error || "Admin key မှားနေပါတယ်";
        $("adminLogin").classList.remove("hidden");
        $("adminPanel").classList.add("hidden");
        setMe();
        return;
      }
      $("adminLogin").classList.add("hidden");
      $("adminPanel").classList.remove("hidden");
      var g = $("adminGrid");
      g.innerHTML = "";
      var list = d.listings || [];
      $("adminEmpty").classList.toggle("hidden", list.length > 0);
      list.forEach(function (l) {
        var c = cardEl(l, { status: true, contact: true });
        var row = document.createElement("div");
        row.className = "row-btns";
        row.appendChild(btn("✅ အတည်ပြု", "btn green", function () { setStatus(l.id, "approved"); }));
        row.appendChild(btn("❌ ပယ်ချ", "btn", function () { setStatus(l.id, "rejected"); }));
        row.appendChild(btn("🗑 ဖျက်", "btn red", function () {
          if (!confirm("အပြီးဖျက်မလား?")) return;
          api("/api/admin/delete", { method: "POST", json: { id: l.id } }).then(loadAdmin);
        }));
        c.querySelector(".body").appendChild(row);
        g.appendChild(c);
      });
    });
  }

  function setStatus(id, status) {
    api("/api/admin/status", { method: "POST", json: { id: id, status: status } }).then(loadAdmin);
  }

  // ===== Group chat =====
  function setChatStatus(text, cls) {
    var el = $("chatStatus");
    el.textContent = text;
    el.className = "pill " + (cls || "");
  }

  function chatScroll() {
    var c = $("chatMsgs");
    c.scrollTop = c.scrollHeight;
  }

  function sys(text) {
    $("chatMsgs").appendChild(div("sys", text));
    chatScroll();
  }

  function renderChatMsg(m) {
    var mine = m.uid === uid;
    var row = document.createElement("div");
    row.className = "row " + (mine ? "mine" : "them");
    if (m.id) row.setAttribute("data-id", m.id);

    var bubble = document.createElement("div");
    bubble.className = "bubble";

    if (!mine) {
      var who = document.createElement("div");
      who.className = "who";
      who.textContent = m.name;
      if (m.admin) {
        var b = document.createElement("span");
        b.className = "badge";
        b.textContent = "ADMIN";
        who.appendChild(b);
      }
      bubble.appendChild(who);
    }

    bubble.appendChild(div("text", m.text));
    bubble.appendChild(div("meta", timeStr(m.time)));

    if (chatAdmin && m.id) {
      bubble.appendChild(btn("✕", "del", function () {
        if (confirm("ဒီစာကို ဖျက်မလား?")) chatAction("delete", { id: m.id });
      }));
    }

    row.appendChild(bubble);
    return row;
  }

  function updateChatInput() {
    var blocked = chatLocked && !chatAdmin;
    $("chatLockMsg").classList.toggle("hidden", !blocked);
    var off = !chatJoined || blocked;
    $("chatText").disabled = off;
    $("chatSend").disabled = off;
  }

  function chatSend(obj) {
    if (chatWs && chatWs.readyState === 1) chatWs.send(JSON.stringify(obj));
  }

  function chatAction(action, extra) {
    var o = { type: "admin", action: action };
    if (extra) {
      for (var k in extra) o[k] = extra[k];
    }
    chatSend(o);
  }

  function chatConnect() {
    if (chatBanned) return;
    if (chatWs) {
      var old = chatWs;
      chatWs = null;
      try { old.close(); } catch (e) {}
    }
    var proto = location.protocol === "https:" ? "wss://" : "ws://";
    var s = new WebSocket(proto + location.host + "/ws");
    chatWs = s;
    chatJoined = false;
    updateChatInput();
    setChatStatus("⏳ ချိတ်ဆက်နေသည်...", "");

    s.onopen = function () {
      s.send(JSON.stringify({ type: "join", uid: uid, adminKey: adminKey }));
    };

    s.onmessage = function (e) {
      if (s !== chatWs) return;
      chatOnMessage(JSON.parse(e.data));
    };

    s.onclose = function () {
      if (s !== chatWs) return;
      chatJoined = false;
      updateChatInput();
      if (chatBanned) {
        setChatStatus("🔴 ပြတ်သွားပါပြီ", "bad");
        return;
      }
      setChatStatus("🔴 ပြန်ချိတ်နေသည်...", "bad");
      setTimeout(chatConnect, 2000);
    };
  }

  function chatOnMessage(d) {
    var box = $("chatMsgs");

    if (d.type === "joined") {
      chatJoined = true;
      chatAdmin = !!d.admin;
      chatLocked = !!d.locked;
      if (adminKey && !chatAdmin) {
        adminKey = "";
        sessionStorage.removeItem("tmm_akey");
        $("adminMsg").textContent = "Admin key မှားနေပါတယ်";
        sys("Admin key မှားနေပါတယ်");
      }
      setChatStatus("🟢 ချိတ်ဆက်ပြီး", "ok");
      $("chatAdminRow").classList.toggle("hidden", !chatAdmin);
      $("cLock").textContent = chatLocked ? "🔓 ပြန်ဖွင့်" : "🔒 ပိတ်";
      updateChatInput();
      setMe();
    } else if (d.type === "history") {
      box.innerHTML = "";
      d.messages.forEach(function (m) { box.appendChild(renderChatMsg(m)); });
      chatScroll();
    } else if (d.type === "chat") {
      box.appendChild(renderChatMsg(d));
      chatScroll();
    } else if (d.type === "deleted") {
      var el = box.querySelector('[data-id="' + d.id + '"]');
      if (el) el.remove();
    } else if (d.type === "cleared") {
      box.innerHTML = "";
      sys("Chat ကို Admin က ရှင်းလိုက်ပါပြီ");
    } else if (d.type === "locked") {
      chatLocked = !!d.locked;
      $("cLock").textContent = chatLocked ? "🔓 ပြန်ဖွင့်" : "🔒 ပိတ်";
      updateChatInput();
      sys(chatLocked ? "Admin က chat ကို ပိတ်လိုက်ပါပြီ" : "Chat ကို ပြန်ဖွင့်လိုက်ပါပြီ");
    } else if (d.type === "online") {
      $("chatOnline").textContent = "Online: " + d.count;
    } else if (d.type === "notice") {
      sys(d.text);
    } else if (d.type === "error") {
      sys("⚠ " + d.text);
    } else if (d.type === "kicked") {
      chatBanned = true;
      chatJoined = false;
      updateChatInput();
      setChatStatus("🔴 ထုတ်ခံရပါတယ်", "bad");
      sys(d.text);
    }
  }

  // ===== နာမည် / စတင်ခြင်း =====
  function showNameModal(msg) {
    $("nameMsg").textContent = msg || "";
    $("modal").style.display = "flex";
    $("nameInput").focus();
  }

  function startApp() {
    setMe();
    if (!myName) {
      showNameModal();
      return;
    }
    api("/api/register", { method: "POST", json: { uid: uid, name: myName } }).then(function (d) {
      if (d._ok) {
        myName = d.name;
        localStorage.setItem("tmm_name", myName);
        setMe();
        chatConnect();
      } else {
        myName = "";
        localStorage.removeItem("tmm_name");
        setMe();
        showNameModal(d.error);
      }
    }).catch(function () {
      chatConnect();
    });
  }

  $("nameBtn").onclick = function () {
    var n = $("nameInput").value.trim();
    if (!n) return;
    api("/api/register", { method: "POST", json: { uid: uid, name: n } }).then(function (d) {
      if (d._ok) {
        myName = d.name;
        localStorage.setItem("tmm_name", myName);
        $("nameMsg").textContent = "";
        $("modal").style.display = "none";
        setMe();
        chatConnect();
      } else {
        $("nameMsg").textContent = d.error || "မအောင်မြင်ပါ";
      }
    });
  };

  // ===== Forms & buttons =====
  $("postForm").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!myName) { showNameModal(); return; }
    var f = e.target;
    var fd = new FormData(f);
    fd.append("uid", uid);
    fd.append("name", myName);
    $("postBtn").disabled = true;
    $("postMsg").className = "msg";
    $("postMsg").textContent = "တင်နေသည်...";
    api("/api/listings", { method: "POST", form: fd }).then(function (d) {
      $("postBtn").disabled = false;
      if (d._ok) {
        $("postMsg").className = "msg ok";
        $("postMsg").textContent = "တင်ပြီးပါပြီ ✅ Admin အတည်ပြုရန် စောင့်ပါ";
        f.reset();
      } else {
        $("postMsg").className = "msg err";
        $("postMsg").textContent = d.error || "မအောင်မြင်ပါ";
      }
    });
  });

  $("chatForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var text = $("chatText").value.trim();
    if (!text || !chatJoined) return;
    chatSend({ type: "chat", text: text });
    $("chatText").value = "";
    $("chatText").focus();
  });

  $("cLock").onclick = function () {
    chatAction(chatLocked ? "unlock" : "lock");
  };
  $("cClear").onclick = function () {
    if (confirm("Chat အကုန် ရှင်းမလား?")) chatAction("clear");
  };
  $("cKick").onclick = function () {
    var n = prompt("ထုတ်ချင်တဲ့ နာမည်:");
    if (n && n.trim()) chatAction("kick", { name: n.trim() });
  };
  $("cUnban").onclick = function () {
    var n = prompt("ပြန်ခွင့်ပေးမယ့် နာမည်:");
    if (n && n.trim()) chatAction("unban", { name: n.trim() });
  };

  $("adminLoginBtn").onclick = function () {
    var k = $("adminKeyInput").value.trim();
    if (!k) return;
    adminKey = k;
    sessionStorage.setItem("tmm_akey", k);
    $("adminMsg").textContent = "";
    setMe();
    loadAdmin();
    chatConnect();
  };
  $("adminRefresh").onclick = loadAdmin;
  $("adminLogout").onclick = function () {
    adminKey = "";
    sessionStorage.removeItem("tmm_akey");
    setMe();
    loadAdmin();
    chatConnect();
  };

  document.querySelectorAll("nav button").forEach(function (b) {
    b.onclick = function () { showTab(b.getAttribute("data-tab")); };
  });

  // ===== Init =====
  $("footTg").href = SITE.contact.telegramChannel;
  $("footTg").textContent = "Telegram Channel";
  $("footOwner").href = SITE.contact.ownerLink;
  $("footOwner").textContent = "Owner " + SITE.contact.owner;

  renderHome();
  renderRules();
  renderContact();

  if (IS_ADMIN_PAGE) {
    $("adminTabBtn").classList.remove("hidden");
    document.title = "TURBO MM · Admin";
  }

  startApp();
  showTab(IS_ADMIN_PAGE ? "admin" : "home");
</script>
</body>
</html>`;

const PAGE = HTML.replace("__SITE__", () => JSON.stringify(SITE));
const ADMIN_PAGE = PAGE.replace("<body>", '<body data-admin="1">');

function getRoom(env) {
  return env.CHAT_ROOM.get(env.CHAT_ROOM.idFromName("main"));
}

function forward(env, path, body) {
  return getRoom(env).fetch("https://room" + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function isAdmin(request, env) {
  const key = request.headers.get("X-Admin-Key") || "";
  return !!env.ADMIN_KEY && key === env.ADMIN_KEY;
}

async function removeListing(env, body) {
  const res = await forward(env, "/remove", body);
  if (!res.ok) return res;
  const data = await res.json();
  if (data.photoKey) await env.IMAGES.delete(data.photoKey);
  return json({ ok: true });
}

async function createListing(request, env) {
  const form = await request.formData();
  const uid = clean(form.get("uid"), 60);
  const title = clean(form.get("title"), MAX_TITLE);
  const price = clean(form.get("price"), MAX_PRICE);
  const description = clean(form.get("description"), MAX_DESC);
  const contact = clean(form.get("contact"), MAX_CONTACT);
  const photo = form.get("photo");

  if (!uid || !title || !price || !contact) {
    return json({ error: "အချက်အလက် ပြည့်စုံအောင် ဖြည့်ပါ" }, 400);
  }
  if (!photo || typeof photo === "string") {
    return json({ error: "ပစ္စည်းပုံ ထည့်ပါ" }, 400);
  }
  const ext = TYPES[photo.type];
  if (!ext) return json({ error: "ပုံ JPG, PNG, WEBP ပဲ ခွင့်ပြုပါတယ်" }, 400);
  if (photo.size > MAX_PHOTO) return json({ error: "ပုံ 3MB ထက် မကြီးရပါ" }, 400);

  const photoKey = crypto.randomUUID() + "." + ext;
  await env.IMAGES.put(photoKey, await photo.arrayBuffer(), {
    httpMetadata: { contentType: photo.type },
  });

  const res = await forward(env, "/create", { uid, title, price, description, contact, photoKey });
  if (!res.ok) await env.IMAGES.delete(photoKey);
  return res;
}

async function serveImage(key, env) {
  if (!/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(key)) {
    return new Response("Not found", { status: 404 });
  }
  const obj = await env.IMAGES.get(key);
  if (!obj) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=86400");
  return new Response(obj.body, { headers });
}

async function api(request, env, url) {
  const path = url.pathname;
  const method = request.method;

  if (path === "/api/register" && method === "POST") {
    const b = await request.json();
    return forward(env, "/register", { uid: clean(b.uid, 60), name: clean(b.name, MAX_NAME) });
  }

  if (path === "/api/listings" && method === "GET") {
    return forward(env, "/list", {});
  }

  if (path === "/api/listings" && method === "POST") {
    return createListing(request, env);
  }

  if (path === "/api/mine" && method === "POST") {
    const b = await request.json();
    return forward(env, "/mine", { uid: clean(b.uid, 60) });
  }

  if (path === "/api/listing/delete" && method === "POST") {
    const b = await request.json();
    return removeListing(env, { admin: false, uid: clean(b.uid, 60), id: clean(b.id, 60) });
  }

  if (path.startsWith("/api/admin/")) {
    if (!isAdmin(request, env)) {
      return json({ error: "Admin key မှားနေပါတယ်" }, 401);
    }
    if (path === "/api/admin/listings" && method === "GET") {
      return forward(env, "/admin-list", {});
    }
    if (path === "/api/admin/status" && method === "POST") {
      const b = await request.json();
      return forward(env, "/status", { id: clean(b.id, 60), status: b.status });
    }
    if (path === "/api/admin/delete" && method === "POST") {
      const b = await request.json();
      return removeListing(env, { admin: true, id: clean(b.id, 60) });
    }
  }

  return json({ error: "Not found" }, 404);
}

function publicView(l) {
  return {
    id: l.id,
    ownerUid: l.ownerUid,
    ownerName: l.ownerName,
    title: l.title,
    price: l.price,
    description: l.description,
    contact: l.contact,
    photoKey: l.photoKey,
    status: l.status,
    createdAt: l.createdAt,
  };
}

export class ChatRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  // ---------- HTTP routes (marketplace) ----------
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/ws") return this.upgrade(request);

    const body = await request.json().catch(() => ({}));

    if (path === "/register") return this.register(body);
    if (path === "/create") return this.create(body);
    if (path === "/list") return this.list();
    if (path === "/mine") return this.mine(body);
    if (path === "/status") return this.setStatus(body);
    if (path === "/remove") return this.remove(body);
    if (path === "/admin-list") return this.adminList();
    return json({ error: "Not found" }, 404);
  }

  async allListings() {
    const map = await this.state.storage.list({ prefix: "l:", limit: 1000 });
    return [...map.values()].sort((a, b) => b.createdAt - a.createdAt);
  }

  async findUidByName(name) {
    const users = await this.state.storage.list({ prefix: "u:", limit: 10000 });
    for (const [key, value] of users) {
      if (String(value).toLowerCase() === name.toLowerCase()) return key.slice(2);
    }
    return null;
  }

  async register(b) {
    const uid = clean(b.uid, 60);
    if (!uid) return json({ error: "uid မရှိပါ" }, 400);

    const existing = await this.state.storage.get("u:" + uid);
    if (existing) return json({ name: existing });

    const name = clean(b.name, MAX_NAME);
    if (!name) return json({ error: "နာမည် ထည့်ပါ" }, 400);

    const taken = await this.findUidByName(name);
    if (taken) return json({ error: "ဒီနာမည်ကို တခြားသူ သုံးနေပါတယ်" }, 409);

    await this.state.storage.put("u:" + uid, name);
    return json({ name });
  }

  async create(b) {
    const uid = clean(b.uid, 60);
    const ownerName = await this.state.storage.get("u:" + uid);
    if (!ownerName) return json({ error: "အရင်ဆုံး နာမည် သတ်မှတ်ပါ" }, 403);

    const id = crypto.randomUUID();
    const listing = {
      id,
      ownerUid: uid,
      ownerName,
      title: clean(b.title, MAX_TITLE),
      price: clean(b.price, MAX_PRICE),
      description: clean(b.description, MAX_DESC),
      contact: clean(b.contact, MAX_CONTACT),
      photoKey: clean(b.photoKey, 80),
      status: "pending",
      createdAt: Date.now(),
    };
    await this.state.storage.put("l:" + id, listing);
    return json({ ok: true, id });
  }

  async list() {
    const items = (await this.allListings())
      .filter((l) => l.status === "approved")
      .map(publicView);
    return json({ listings: items });
  }

  async mine(b) {
    const uid = clean(b.uid, 60);
    const items = (await this.allListings())
      .filter((l) => l.ownerUid === uid)
      .map(publicView);
    return json({ listings: items });
  }

  async adminList() {
    const items = (await this.allListings()).map(publicView);
    items.sort((a, b) => (a.status === "pending" ? 0 : 1) - (b.status === "pending" ? 0 : 1));
    return json({ listings: items });
  }

  async setStatus(b) {
    const id = clean(b.id, 60);
    const l = await this.state.storage.get("l:" + id);
    if (!l) return json({ error: "မတွေ့ပါ" }, 404);
    if (!["pending", "approved", "rejected"].includes(b.status)) {
      return json({ error: "Status မှားနေပါတယ်" }, 400);
    }
    l.status = b.status;
    await this.state.storage.put("l:" + id, l);
    return json({ ok: true });
  }

  async remove(b) {
    const id = clean(b.id, 60);
    const l = await this.state.storage.get("l:" + id);
    if (!l) return json({ error: "မတွေ့ပါ" }, 404);
    if (!b.admin && l.ownerUid !== clean(b.uid, 60)) {
      return json({ error: "ဖျက်ခွင့် မရှိပါ" }, 403);
    }
    await this.state.storage.delete("l:" + id);
    return json({ ok: true, photoKey: l.photoKey });
  }

  // ---------- WebSocket (Group chat) ----------
  upgrade(request) {
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected WebSocket", { status: 426 });
    }
    const pair = new WebSocketPair();
    this.state.acceptWebSocket(pair[1]);
    pair[1].serializeAttachment({ joined: false });
    return new Response(null, { status: 101, webSocket: pair[0] });
  }

  meta(ws) {
    try {
      return ws.deserializeAttachment() || {};
    } catch {
      return {};
    }
  }

  sendTo(ws, obj) {
    try { ws.send(JSON.stringify(obj)); } catch {}
  }

  broadcast(obj, except) {
    const out = JSON.stringify(obj);
    for (const c of this.state.getWebSockets()) {
      if (c === except) continue;
      if (!this.meta(c).joined) continue;
      try { c.send(out); } catch {}
    }
  }

  broadcastOnline(leaving) {
    const count = this.state.getWebSockets()
      .filter((c) => c !== leaving && this.meta(c).joined).length;
    this.broadcast({ type: "online", count }, leaving);
  }

  async webSocketMessage(ws, message) {
    let data;
    try {
      data = JSON.parse(message);
    } catch {
      return;
    }

    if (data.type === "join") return this.join(ws, data);

    const me = this.meta(ws);
    if (!me.joined) {
      return this.sendTo(ws, { type: "error", text: "အရင်ဆုံး ချိတ်ဆက်ပါ" });
    }

    if (data.type === "chat") return this.chat(ws, me, data);
    if (data.type === "admin") return this.chatAdmin(ws, me, data);
  }

  async join(ws, data) {
    const uid = clean(data.uid, 60);
    const name = uid ? await this.state.storage.get("u:" + uid) : null;
    if (!name) {
      return this.sendTo(ws, { type: "error", text: "အရင်ဆုံး နာမည် သတ်မှတ်ပါ" });
    }

    const isAdmin = !!this.env.ADMIN_KEY && data.adminKey === this.env.ADMIN_KEY;
    const banned = (await this.state.storage.get("banned")) || [];

    if (banned.includes(uid) && !isAdmin) {
      this.sendTo(ws, { type: "kicked", text: "Admin က ထုတ်ထားပါတယ်" });
      try { ws.close(4003, "banned"); } catch {}
      return;
    }

    ws.serializeAttachment({ joined: true, uid, name, admin: isAdmin });
    const locked = !!(await this.state.storage.get("chat:locked"));
    this.sendTo(ws, { type: "joined", name, admin: isAdmin, locked });

    const history = (await this.state.storage.get("chat:history")) || [];
    this.sendTo(ws, { type: "history", messages: history });
    this.broadcastOnline();
  }

  async chat(ws, me, data) {
    const locked = await this.state.storage.get("chat:locked");
    if (locked && !me.admin) {
      return this.sendTo(ws, { type: "error", text: "Admin က chat ကို ယာယီပိတ်ထားပါတယ်" });
    }

    const text = clean(data.text, MAX_CHAT);
    if (!text) return;

    const msg = {
      type: "chat",
      id: crypto.randomUUID(),
      uid: me.uid,
      name: me.name,
      admin: !!me.admin,
      text,
      time: Date.now(),
    };

    let history = (await this.state.storage.get("chat:history")) || [];
    history.push(msg);
    if (history.length > MAX_HISTORY) history = history.slice(-MAX_HISTORY);
    await this.state.storage.put("chat:history", history);

    this.broadcast(msg);
  }

  async chatAdmin(ws, me, data) {
    if (!me.admin) {
      return this.sendTo(ws, { type: "error", text: "Admin မဟုတ်ပါ" });
    }

    switch (data.action) {
      case "lock":
      case "unlock": {
        const locked = data.action === "lock";
        await this.state.storage.put("chat:locked", locked);
        return this.broadcast({ type: "locked", locked });
      }

      case "clear": {
        await this.state.storage.put("chat:history", []);
        return this.broadcast({ type: "cleared" });
      }

      case "delete": {
        let history = (await this.state.storage.get("chat:history")) || [];
        history = history.filter((m) => m.id !== data.id);
        await this.state.storage.put("chat:history", history);
        return this.broadcast({ type: "deleted", id: clean(data.id, 60) });
      }

      case "kick":
      case "unban": {
        const shownName = clean(data.name, MAX_NAME);
        const target = await this.findUidByName(shownName);
        if (!target) {
          return this.sendTo(ws, { type: "error", text: "ဒီနာမည် မတွေ့ပါ" });
        }

        let banned = (await this.state.storage.get("banned")) || [];

        if (data.action === "kick") {
          if (!banned.includes(target)) banned.push(target);
          await this.state.storage.put("banned", banned);

          for (const s of this.state.getWebSockets()) {
            const m = this.meta(s);
            if (m.joined && m.uid === target && !m.admin) {
              this.sendTo(s, { type: "kicked", text: "Admin က ထုတ်လိုက်ပါပြီ" });
              try { s.close(4003, "kicked"); } catch {}
            }
          }
          this.broadcastOnline();
          return this.sendTo(ws, { type: "notice", text: shownName + " ကို ထုတ်ပြီး ပိတ်ထားပါပြီ" });
        }

        banned = banned.filter((u) => u !== target);
        await this.state.storage.put("banned", banned);
        return this.sendTo(ws, { type: "notice", text: shownName + " ကို ပြန်ခွင့်ပေးပြီးပါပြီ" });
      }
    }
  }

  webSocketClose(ws) {
    try { ws.close(); } catch {}
    this.broadcastOnline(ws);
  }

  webSocketError(ws) {
    try { ws.close(); } catch {}
    this.broadcastOnline(ws);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/ws") {
      if (request.headers.get("Upgrade") !== "websocket") {
        return new Response("Expected WebSocket", { status: 426 });
      }
      return getRoom(env).fetch(request);
    }

    if (path.startsWith("/img/")) return serveImage(path.slice(5), env);

    if (path.startsWith("/api/")) {
      try {
        return await api(request, env, url);
      } catch (err) {
        return json({ error: "Server error" }, 500);
      }
    }

    const page = path === "/admin" ? ADMIN_PAGE : PAGE;
    return new Response(page, {
      headers: { "Content-Type": "text/html; charset=UTF-8" },
    });
  },
};
