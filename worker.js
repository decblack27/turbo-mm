const MAX_NAME = 20;
const MAX_TITLE = 80;
const MAX_PRICE = 40;
const MAX_DESC = 1000;
const MAX_CONTACT = 60;
const MAX_PHOTO = 3 * 1024 * 1024;
const TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

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
<title>TURBO MM · Marketplace</title>
<style>
  :root {
    --gold: #f5c542; --gold2: #d9a521; --bg: #0e0e13; --panel: #17171f; --card: #1c1c26;
    --line: #2a2a35; --text: #f1f1f4; --muted: #8a8a99; --ok: #7ddc8f; --warn: #f5b342; --danger: #ff5c5c;
  }
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    margin: 0; font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
    background: var(--bg); color: var(--text); display: flex; flex-direction: column; min-height: 100vh;
  }
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
  nav {
    display: flex; gap: 6px; padding: 10px 12px; overflow-x: auto;
    background: var(--panel); border-bottom: 1px solid var(--line);
  }
  nav button {
    flex-shrink: 0; padding: 8px 14px; border-radius: 999px; border: 1px solid var(--line);
    background: var(--card); color: var(--muted); font-size: 14px; cursor: pointer;
  }
  nav button.on {
    background: linear-gradient(135deg, var(--gold), var(--gold2)); color: #111; border-color: transparent; font-weight: 700;
  }
  main { flex: 1; padding: 16px; max-width: 720px; width: 100%; margin: 0 auto; }
  .grid { display: grid; gap: 14px; grid-template-columns: 1fr; }
  @media (min-width: 620px) { .grid { grid-template-columns: 1fr 1fr; } }
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
  .contact {
    display: block; margin-top: 6px; text-align: center; padding: 10px; border-radius: 10px;
    background: linear-gradient(135deg, var(--gold), var(--gold2)); color: #111; font-weight: 700; text-decoration: none;
  }
  .plain { margin-top: 6px; text-align: center; padding: 10px; border-radius: 10px; border: 1px solid var(--line); color: var(--text); font-size: 14px; }
  .tag { display: inline-block; font-size: 12px; padding: 3px 9px; border-radius: 999px; font-weight: 700; align-self: flex-start; }
  .tag.pending { background: rgba(245, 179, 66, 0.15); color: var(--warn); }
  .tag.approved { background: rgba(125, 220, 143, 0.15); color: var(--ok); }
  .tag.rejected { background: rgba(255, 92, 92, 0.15); color: var(--danger); }
  .btn {
    padding: 10px 14px; border-radius: 10px; background: var(--card); color: var(--text);
    border: 1px solid var(--line); cursor: pointer; font-size: 14px;
  }
  .btn.gold { background: linear-gradient(135deg, var(--gold), var(--gold2)); color: #111; font-weight: 700; border: 0; }
  .btn.red { color: var(--danger); border-color: rgba(255, 92, 92, 0.4); }
  .btn.green { color: var(--ok); border-color: rgba(125, 220, 143, 0.4); }
  .btn:disabled { opacity: 0.5; }
  .row-btns { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px; }
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
  .hint { font-size: 12.5px; color: var(--muted); line-height: 1.5; text-align: center; }
  .adminbox {
    background: var(--card); border: 1px solid var(--line); border-radius: 16px;
    padding: 14px; margin-bottom: 14px; display: flex; gap: 8px; flex-wrap: wrap;
  }
  .adminbox input { flex: 1; min-width: 180px; }
  .hidden { display: none !important; }
  #modal {
    display: none; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75);
    align-items: center; justify-content: center; padding: 20px; z-index: 20;
  }
  #modal .box {
    width: 100%; max-width: 340px; background: var(--panel); border: 1px solid var(--line);
    border-radius: 18px; padding: 24px 20px; text-align: center; display: flex; flex-direction: column; gap: 10px;
  }
  #modal h2 { margin: 0; color: var(--gold); letter-spacing: 3px; }
  #modal p { color: var(--muted); font-size: 13px; margin: 0; line-height: 1.5; }
  footer {
    text-align: center; padding: 12px; font-size: 12px; color: var(--muted);
    border-top: 1px solid var(--line); background: var(--panel);
    padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  }
  footer a { color: var(--gold); text-decoration: none; }
</style>
</head>
<body>
<header>
  <div class="brand">TURBO MM<small>Marketplace</small></div>
  <span id="me" class="pill">—</span>
</header>

<nav>
  <button data-tab="shop" class="on">🛍 ကြော်ငြာများ</button>
  <button data-tab="sell">➕ ကြော်ငြာတင်မည်</button>
  <button data-tab="mine">📦 ကျွန်ုပ်၏ ကြော်ငြာ</button>
  <button data-tab="admin" id="adminTabBtn" class="hidden">🛡 Admin</button>
</nav>

<main>
  <section id="tab-shop">
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

  <section id="tab-admin" class="hidden">
    <div class="adminbox" id="adminLogin">
      <input id="adminKeyInput" type="password" placeholder="Admin key" autocomplete="off">
      <button class="btn gold" id="adminLoginBtn">ဝင်မည်</button>
      <div class="msg err" id="adminMsg" style="width:100%"></div>
    </div>
    <div id="adminPanel" class="hidden">
      <div class="row-btns" style="margin-bottom:12px">
        <button class="btn" id="adminRefresh">🔄 ပြန်လတ်</button>
        <button class="btn" id="adminLogout">ထွက်မည်</button>
      </div>
      <div class="grid" id="adminGrid"></div>
      <div id="adminEmpty" class="empty hidden">ကြော်ငြာ မရှိသေးပါ</div>
    </div>
  </section>
</main>

<footer>
  <a href="https://t.me/arsar2027" target="_blank" rel="noopener">Telegram Channel</a> ·
  <a href="https://t.me/turbomm750" target="_blank" rel="noopener">Owner @turbomm750</a>
</footer>

<div id="modal">
  <div class="box">
    <h2>TURBO MM</h2>
    <p>နာမည်ကို တစ်ခါ သတ်မှတ်ပြီးရင် ပြောင်းလို့မရတော့ပါဘူး</p>
    <input id="nameInput" maxlength="20" placeholder="နာမည်" autocomplete="off">
    <button class="btn gold" id="nameBtn">ဝင်မည်</button>
    <div class="msg err" id="nameMsg"></div>
  </div>
</div>

<script>
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
    b.onclick = fn;
    return b;
  }

  function contactEl(text) {
    var t = String(text || "").trim();
    if (/^@[A-Za-z0-9_]{3,}$/.test(t)) {
      var a = document.createElement("a");
      a.className = "contact";
      a.href = "https://t.me/" + t.slice(1);
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = "Telegram " + t + " ကို စာပို့မည်";
      return a;
    }
    if (/^\+?[0-9 ]{6,}$/.test(t)) {
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

  function setAdminStatus(id, status) {
    api("/api/admin/status", { method: "POST", json: { id: id, status: status } }).then(loadAdmin);
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
        row.appendChild(btn("✅ အတည်ပြု", "btn green", function () { setAdminStatus(l.id, "approved"); }));
        row.appendChild(btn("❌ ပယ်ချ", "btn", function () { setAdminStatus(l.id, "rejected"); }));
        row.appendChild(btn("🗑 ဖျက်", "btn red", function () {
          if (!confirm("အပြီးဖျက်မလား?")) return;
          api("/api/admin/delete", { method: "POST", json: { id: l.id } }).then(loadAdmin);
        }));
        c.querySelector(".body").appendChild(row);
        g.appendChild(c);
      });
    });
  }

  function setMe() {
    $("me").textContent = "👤 " + (myName || "—") + (IS_ADMIN_PAGE ? " 🛡" : "");
  }

  function showNameModal() {
    $("modal").style.display = "flex";
    $("nameInput").focus();
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
      } else {
        $("nameMsg").textContent = d.error || "မအောင်မြင်ပါ";
      }
    });
  };

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

  $("adminLoginBtn").onclick = function () {
    var k = $("adminKeyInput").value.trim();
    if (!k) return;
    adminKey = k;
    sessionStorage.setItem("tmm_akey", k);
    $("adminMsg").textContent = "";
    loadAdmin();
  };
  $("adminRefresh").onclick = loadAdmin;
  $("adminLogout").onclick = function () {
    adminKey = "";
    sessionStorage.removeItem("tmm_akey");
    loadAdmin();
  };

  document.querySelectorAll("nav button").forEach(function (b) {
    b.onclick = function () { showTab(b.getAttribute("data-tab")); };
  });

  if (IS_ADMIN_PAGE) {
    $("adminTabBtn").classList.remove("hidden");
    document.title = "TURBO MM · Admin";
  }

  setMe();
  if (myName) {
    api("/api/register", { method: "POST", json: { uid: uid, name: myName } }).then(function (d) {
      if (d._ok) {
        myName = d.name;
        localStorage.setItem("tmm_name", myName);
        setMe();
      } else {
        myName = "";
        localStorage.removeItem("tmm_name");
        setMe();
        showNameModal();
        $("nameMsg").textContent = d.error || "";
      }
    });
  } else {
    showNameModal();
  }

  showTab(IS_ADMIN_PAGE ? "admin" : "shop");
</script>
</body>
</html>`;

const ADMIN_PAGE = HTML.replace("<body>", '<body data-admin="1">');

function isAdmin(request, env) {
  const key = request.headers.get("X-Admin-Key") || "";
  return !!env.ADMIN_KEY && key === env.ADMIN_KEY;
}

function forward(env, path, body) {
  const stub = env.CHAT_ROOM.get(env.CHAT_ROOM.idFromName("main"));
  return stub.fetch("https://room" + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
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
  const name = clean(form.get("name"), MAX_NAME);
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

  const res = await forward(env, "/create", { uid, name, title, price, description, contact, photoKey });
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
    return forward(env, "/register", { uid: b.uid, name: b.name });
  }

  if (path === "/api/listings" && method === "GET") {
    return forward(env, "/list", {});
  }

  if (path === "/api/listings" && method === "POST") {
    return createListing(request, env);
  }

  if (path === "/api/mine" && method === "POST") {
    const b = await request.json();
    return forward(env, "/mine", { uid: b.uid });
  }

  if (path === "/api/listing/delete" && method === "POST") {
    const b = await request.json();
    return removeListing(env, { admin: false, uid: b.uid, id: b.id });
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
      return forward(env, "/status", { id: b.id, status: b.status });
    }
    if (path === "/api/admin/delete" && method === "POST") {
      const b = await request.json();
      return removeListing(env, { admin: true, id: b.id });
    }
  }

  return json({ error: "Not found" }, 404);
}

export class ChatRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const path = new URL(request.url).pathname;
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

  async register(b) {
    const uid = clean(b.uid, 60);
    if (!uid) return json({ error: "uid မရှိပါ" }, 400);

    const existing = await this.state.storage.get("u:" + uid);
    if (existing) return json({ name: existing });

    const name = clean(b.name, MAX_NAME);
    if (!name) return json({ error: "နာမည် ထည့်ပါ" }, 400);

    const users = await this.state.storage.list({ prefix: "u:", limit: 10000 });
    for (const n of users.values()) {
      if (n.toLowerCase() === name.toLowerCase()) {
        return json({ error: "ဒီနာမည်ကို တခြားသူ သုံးနေပါတယ်" }, 409);
      }
    }

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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path.startsWith("/img/")) return serveImage(path.slice(5), env);

    if (path.startsWith("/api/")) {
      try {
        return await api(request, env, url);
      } catch (err) {
        return json({ error: "Server error" }, 500);
      }
    }

    const page = path === "/admin" ? ADMIN_PAGE : HTML;
    return new Response(page, {
      headers: { "Content-Type": "text/html; charset=UTF-8" },
    });
  },
};
