const MAX_HISTORY = 100;
const MAX_NAME = 20;
const MAX_TEXT = 500;

function clean(value, max) {
  return String(value || "").trim().slice(0, max);
}

const HTML = `<!DOCTYPE html>
<html lang="my">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>TURBO MM</title>
<style>
  :root {
    --gold: #f5c542; --gold2: #d9a521; --bg: #0e0e13; --panel: #17171f;
    --line: #26262f; --text: #f1f1f4; --muted: #8a8a99; --them: #20202b; --danger: #ff5c5c;
  }
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    margin: 0; font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
    background: var(--bg); color: var(--text);
    display: flex; flex-direction: column; overflow: hidden;
  }
  header {
    display: flex; align-items: center; justify-content: space-between; gap: 10px;
    padding: 12px 16px; padding-top: calc(12px + env(safe-area-inset-top, 0px));
    background: rgba(23, 23, 31, 0.92); border-bottom: 1px solid var(--line);
    flex-wrap: wrap; z-index: 2;
  }
  .brand { font-weight: 800; letter-spacing: 3px; color: var(--gold); font-size: 18px; }
  .brand small { display: block; font-size: 11px; letter-spacing: 1px; color: var(--muted); font-weight: 500; margin-top: 2px; }
  .right { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .pill {
    font-size: 12px; color: var(--muted); background: #1c1c26; border: 1px solid var(--line);
    padding: 4px 10px; border-radius: 999px; white-space: nowrap;
  }
  #status.ok { color: #7ddc8f; }
  #status.bad { color: var(--danger); }

  #adminbar {
    display: none; gap: 6px; padding: 8px 12px; flex-wrap: wrap;
    background: #1b1a14; border-bottom: 1px solid #3a3320;
  }
  #adminbar button {
    padding: 7px 12px; border-radius: 8px; border: 1px solid #4a4128;
    background: #2a2618; color: var(--gold); font-size: 13px; cursor: pointer;
  }

  #messages {
    flex: 1; min-height: 0; overflow-y: auto; padding: 14px 12px;
    display: flex; flex-direction: column; gap: 2px;
    background:
      radial-gradient(circle at 15% 10%, rgba(245, 197, 66, 0.05), transparent 45%),
      var(--bg);
  }
  .sys {
    align-self: center; font-size: 12px; color: var(--muted);
    background: #1a1a22; padding: 4px 12px; border-radius: 999px; margin: 6px 0;
  }
  .row { display: flex; margin: 3px 0; }
  .row.mine { justify-content: flex-end; }
  .bubble {
    position: relative; max-width: 78%; padding: 7px 12px 6px; border-radius: 16px;
    background: var(--them); border: 1px solid var(--line); box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
  }
  .row.them .bubble { border-bottom-left-radius: 4px; }
  .row.mine .bubble {
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    color: #15120a; border-color: transparent; border-bottom-right-radius: 4px;
  }
  .who {
    font-size: 12.5px; font-weight: 700; color: var(--gold); margin-bottom: 2px;
    display: flex; align-items: center; gap: 6px;
  }
  .badge { font-size: 10px; background: var(--gold); color: #111; padding: 1px 6px; border-radius: 6px; font-weight: 700; }
  .text { white-space: pre-wrap; word-break: break-word; line-height: 1.45; font-size: 15px; }
  .meta { font-size: 11px; opacity: 0.6; text-align: right; margin-top: 3px; }
  .del {
    position: absolute; top: -8px; right: -8px; width: 22px; height: 22px; border-radius: 50%;
    border: 0; background: var(--danger); color: #fff; font-size: 11px; cursor: pointer; line-height: 22px; padding: 0;
  }

  #lockbar {
    display: none; text-align: center; padding: 8px; font-size: 13px; color: #ffb3b3;
    background: rgba(255, 92, 92, 0.12); border-top: 1px solid rgba(255, 92, 92, 0.3);
  }

  form#form {
    display: flex; gap: 8px; align-items: center; padding: 10px 12px;
    padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
    background: var(--panel); border-top: 1px solid var(--line);
  }
  #text {
    flex: 1; min-width: 0; padding: 11px 16px; border-radius: 22px;
    border: 1px solid var(--line); background: var(--bg); color: var(--text);
    font-size: 15px; outline: none;
  }
  #text:focus { border-color: var(--gold); }
  #send {
    width: 46px; height: 46px; flex-shrink: 0; border-radius: 50%; border: 0;
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    color: #111; font-size: 18px; cursor: pointer;
  }
  #text:disabled, #send:disabled { opacity: 0.4; cursor: not-allowed; }

  footer {
    text-align: center; padding: 6px; font-size: 12px; color: var(--muted);
    background: var(--panel); padding-bottom: calc(6px + env(safe-area-inset-bottom, 0px));
  }
  footer a { color: var(--gold); text-decoration: none; }

  #login {
    display: none; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75);
    align-items: center; justify-content: center; padding: 20px; z-index: 10;
  }
  #login .card {
    width: 100%; max-width: 340px; background: var(--panel); border: 1px solid var(--line);
    border-radius: 18px; padding: 26px 22px; text-align: center;
  }
  #login h2 { margin: 0 0 6px; color: var(--gold); letter-spacing: 3px; }
  #login p { color: var(--muted); font-size: 13px; margin: 0 0 16px; }
  #login input {
    width: 100%; padding: 12px 14px; margin-bottom: 10px; border-radius: 12px;
    border: 1px solid var(--line); background: var(--bg); color: var(--text); font-size: 15px; outline: none;
  }
  #login input:focus { border-color: var(--gold); }
  #login .primary {
    width: 100%; padding: 12px; border: 0; border-radius: 12px; cursor: pointer;
    background: linear-gradient(135deg, var(--gold), var(--gold2)); color: #111; font-weight: 700; font-size: 15px;
  }
  #login .ghost {
    background: none; border: 0; color: var(--muted); font-size: 13px; cursor: pointer; margin-bottom: 10px;
  }
  #login .err { color: var(--danger); font-size: 13px; min-height: 18px; margin-top: 10px; }
</style>
</head>
<body>
<header>
  <div class="brand">TURBO MM<small>Community Chat</small></div>
  <div class="right">
    <span id="status" class="pill">⏳ ချိတ်ဆက်နေသည်...</span>
    <span id="online" class="pill">Online: 0</span>
    <span id="me" class="pill">—</span>
  </div>
</header>

<div id="adminbar">
  <button id="lockBtn" type="button">🔒 ပိတ်</button>
  <button id="clearBtn" type="button">🧹 ရှင်း</button>
  <button id="kickBtn" type="button">🚫 ထုတ်</button>
  <button id="unbanBtn" type="button">♻ ပြန်ခွင့်</button>
</div>

<div id="messages"></div>

<div id="lockbar">🔒 Admin က chat ကို ယာယီပိတ်ထားပါတယ်</div>

<form id="form">
  <input id="text" placeholder="စာရိုက်ပါ..." maxlength="500" autocomplete="off" disabled>
  <button id="send" type="submit" disabled>➤</button>
</form>

<footer>
  <a href="https://t.me/arsar2027" target="_blank" rel="noopener">Telegram Channel</a> ·
  <a href="https://t.me/turbomm750" target="_blank" rel="noopener">Owner @turbomm750</a>
</footer>

<div id="login">
  <form class="card" id="loginForm">
    <h2>TURBO MM</h2>
    <p>နာမည်ကို တစ်ခါ သတ်မှတ်ပြီးရင် ပြောင်းလို့မရတော့ပါဘူး</p>
    <input id="loginName" placeholder="နာမည်" maxlength="20" autocomplete="off">
    <button type="button" id="adminToggle" class="ghost">👑 Admin ဝင်ရန်</button>
    <input id="loginKey" type="password" placeholder="Admin key" style="display:none" autocomplete="off">
    <button type="submit" class="primary">ဝင်မည်</button>
    <div id="loginErr" class="err"></div>
  </form>
</div>

<script>
  var $ = function (id) { return document.getElementById(id); };
  var list = $("messages"), form = $("form"), input = $("text"), sendBtn = $("send");
  var statusEl = $("status"), onlineEl = $("online"), meEl = $("me");
  var login = $("login"), loginForm = $("loginForm"), loginName = $("loginName");
  var loginKey = $("loginKey"), loginErr = $("loginErr");
  var adminBar = $("adminbar"), lockBar = $("lockbar"), lockBtn = $("lockBtn");

  var uid = localStorage.getItem("tmm_uid");
  if (!uid) {
    uid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("tmm_uid", uid);
  }

  var myName = localStorage.getItem("tmm_name") || "";
  var adminKey = sessionStorage.getItem("tmm_key") || "";
  var isAdmin = false, locked = false, joined = false, banned = false;
  var ws = null;

  function send(obj) {
    if (ws && ws.readyState === 1) ws.send(JSON.stringify(obj));
  }

  function setStatus(text, cls) {
    statusEl.textContent = text;
    statusEl.className = "pill " + (cls || "");
  }

  function scrollBottom() {
    list.scrollTop = list.scrollHeight;
  }

  function timeStr(t) {
    return new Date(t).toLocaleTimeString("my-MM", { hour: "2-digit", minute: "2-digit" });
  }

  function addSys(text) {
    var d = document.createElement("div");
    d.className = "sys";
    d.textContent = text;
    list.appendChild(d);
    scrollBottom();
  }

  function renderMsg(m) {
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

    var text = document.createElement("div");
    text.className = "text";
    text.textContent = m.text;

    var meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = timeStr(m.time);

    bubble.appendChild(text);
    bubble.appendChild(meta);

    if (isAdmin && m.id) {
      var del = document.createElement("button");
      del.className = "del";
      del.textContent = "✕";
      del.title = "ဖျက်ရန်";
      del.onclick = function () {
        if (confirm("ဒီစာကို ဖျက်မလား?")) send({ type: "admin", action: "delete", id: m.id });
      };
      bubble.appendChild(del);
    }

    row.appendChild(bubble);
    return row;
  }

  function updateLock() {
    var blocked = locked && !isAdmin;
    lockBar.style.display = blocked ? "block" : "none";
    input.disabled = !joined || blocked;
    sendBtn.disabled = input.disabled;
    lockBtn.textContent = locked ? "🔓 ပြန်ဖွင့်" : "🔒 ပိတ်";
  }

  function showLogin() {
    login.style.display = "flex";
    loginName.focus();
  }

  function hideLogin() {
    login.style.display = "none";
  }

  function onMessage(e) {
    var d = JSON.parse(e.data);

    if (d.type === "history") {
      list.innerHTML = "";
      locked = !!d.locked;
      d.messages.forEach(function (m) { list.appendChild(renderMsg(m)); });
      updateLock();
      scrollBottom();
    } else if (d.type === "joined") {
      joined = true;
      myName = d.name;
      isAdmin = !!d.admin;
      localStorage.setItem("tmm_name", d.name);
      if (!isAdmin && adminKey) {
        adminKey = "";
        sessionStorage.removeItem("tmm_key");
        addSys("Admin key မှားနေပါတယ်");
      }
      loginErr.textContent = "";
      hideLogin();
      meEl.textContent = "👤 " + myName + (isAdmin ? " 👑" : "");
      adminBar.style.display = isAdmin ? "flex" : "none";
      setStatus("🟢 ချိတ်ဆက်ပြီး", "ok");
      updateLock();
      input.focus();
    } else if (d.type === "chat") {
      list.appendChild(renderMsg(d));
      scrollBottom();
    } else if (d.type === "deleted") {
      var el = list.querySelector('[data-id="' + d.id + '"]');
      if (el) el.remove();
    } else if (d.type === "cleared") {
      list.innerHTML = "";
      addSys("Chat ကို Admin က ရှင်းလိုက်ပါပြီ");
    } else if (d.type === "locked") {
      locked = !!d.locked;
      updateLock();
      addSys(locked ? "Admin က chat ကို ပိတ်လိုက်ပါပြီ" : "Chat ကို ပြန်ဖွင့်လိုက်ပါပြီ");
    } else if (d.type === "online") {
      onlineEl.textContent = "Online: " + d.count;
    } else if (d.type === "notice") {
      addSys(d.text);
    } else if (d.type === "error") {
      if (login.style.display === "flex") loginErr.textContent = d.text;
      else addSys("⚠ " + d.text);
    } else if (d.type === "kicked") {
      banned = true;
      joined = false;
      myName = "";
      localStorage.removeItem("tmm_name");
      updateLock();
      loginErr.textContent = d.text;
      addSys(d.text);
      setStatus("🔴 ထုတ်ခံရပါတယ်", "bad");
    }
  }

  function connect() {
    if (banned) return;
    var proto = location.protocol === "https:" ? "wss://" : "ws://";
    ws = new WebSocket(proto + location.host + "/ws");
    setStatus("⏳ ချိတ်ဆက်နေသည်...", "");

    ws.onopen = function () {
      if (myName) {
        send({ type: "join", name: myName, uid: uid, adminKey: adminKey });
      } else {
        showLogin();
      }
    };

    ws.onmessage = onMessage;

    ws.onclose = function () {
      joined = false;
      updateLock();
      if (banned) {
        setStatus("🔴 ပြတ်သွားပါပြီ", "bad");
        return;
      }
      setStatus("🔴 ပြန်ချိတ်နေသည်...", "bad");
      setTimeout(connect, 2000);
    };
  }

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = loginName.value.trim();
    if (!name) {
      loginErr.textContent = "နာမည် ထည့်ပါ";
      return;
    }
    loginErr.textContent = "";
    adminKey = loginKey.value.trim();
    if (adminKey) sessionStorage.setItem("tmm_key", adminKey);
    else sessionStorage.removeItem("tmm_key");
    myName = name;
    send({ type: "join", name: name, uid: uid, adminKey: adminKey });
  });

  $("adminToggle").onclick = function () {
    loginKey.style.display = loginKey.style.display === "block" ? "none" : "block";
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text || !joined || (locked && !isAdmin)) return;
    send({ type: "chat", text: text });
    input.value = "";
    input.focus();
  });

  lockBtn.onclick = function () {
    send({ type: "admin", action: locked ? "unlock" : "lock" });
  };
  $("clearBtn").onclick = function () {
    if (confirm("Chat အကုန် ရှင်းမလား?")) send({ type: "admin", action: "clear" });
  };
  $("kickBtn").onclick = function () {
    var n = prompt("ထုတ်ချင်တဲ့ နာမည်:");
    if (n && n.trim()) send({ type: "admin", action: "kick", name: n.trim() });
  };
  $("unbanBtn").onclick = function () {
    var n = prompt("ပြန်ခွင့်ပေးမယ့် နာမည်:");
    if (n && n.trim()) send({ type: "admin", action: "unban", name: n.trim() });
  };

  connect();
</script>
</body>
</html>`;

export class ChatRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  meta(ws) {
    try {
      return ws.deserializeAttachment() || {};
    } catch {
      return {};
    }
  }

  send(ws, obj) {
    try { ws.send(JSON.stringify(obj)); } catch {}
  }

  broadcast(obj, except) {
    const out = JSON.stringify(obj);
    for (const c of this.state.getWebSockets()) {
      if (c === except) continue;
      try { c.send(out); } catch {}
    }
  }

  broadcastOnline(leaving) {
    const count = this.state.getWebSockets()
      .filter((c) => c !== leaving && this.meta(c).joined).length;
    this.broadcast({ type: "online", count }, leaving);
  }

  async fetch(request) {
    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];

    this.state.acceptWebSocket(server);

    const history = (await this.state.storage.get("history")) || [];
    const locked = (await this.state.storage.get("locked")) || false;
    server.send(JSON.stringify({ type: "history", messages: history, locked }));
    this.broadcastOnline();

    return new Response(null, { status: 101, webSocket: client });
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
      return this.send(ws, { type: "error", text: "အရင်ဆုံး နာမည်ထည့်ပါ" });
    }

    if (data.type === "chat") return this.chat(ws, me, data);
    if (data.type === "admin") return this.admin(ws, me, data);
  }

  async join(ws, data) {
    if (this.meta(ws).joined) {
      return this.send(ws, { type: "error", text: "နာမည်ကို ပြောင်းလို့ မရပါ" });
    }

    const name = clean(data.name, MAX_NAME);
    if (!name) {
      return this.send(ws, { type: "error", text: "နာမည် ထည့်ပါ" });
    }

    const admin = !!this.env.ADMIN_KEY && data.adminKey === this.env.ADMIN_KEY;
    const banned = (await this.state.storage.get("banned")) || [];

    if (!admin && banned.includes(name.toLowerCase())) {
      this.send(ws, { type: "kicked", text: "ဒီနာမည်ကို Admin က ပိတ်ထားပါတယ်။ စာမျက်နှာကို refresh လုပ်ပြီး အခြားနာမည်နဲ့ ဝင်ပါ" });
      try { ws.close(4003, "banned"); } catch {}
      return;
    }

    const uid = clean(data.uid, 40) || crypto.randomUUID();
    ws.serializeAttachment({ joined: true, name, admin, uid });
    this.send(ws, { type: "joined", name, admin });
    this.broadcastOnline();
  }

  async chat(ws, me, data) {
    const locked = await this.state.storage.get("locked");
    if (locked && !me.admin) {
      return this.send(ws, { type: "error", text: "Admin က chat ကို ယာယီပိတ်ထားပါတယ်" });
    }

    const text = clean(data.text, MAX_TEXT);
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

    let history = (await this.state.storage.get("history")) || [];
    history.push(msg);
    if (history.length > MAX_HISTORY) history = history.slice(-MAX_HISTORY);
    await this.state.storage.put("history", history);

    this.broadcast(msg);
  }

  async admin(ws, me, data) {
    if (!me.admin) {
      return this.send(ws, { type: "error", text: "Admin မဟုတ်ပါ" });
    }

    switch (data.action) {
      case "lock":
      case "unlock": {
        const locked = data.action === "lock";
        await this.state.storage.put("locked", locked);
        return this.broadcast({ type: "locked", locked });
      }

      case "clear": {
        await this.state.storage.put("history", []);
        return this.broadcast({ type: "cleared" });
      }

      case "delete": {
        let history = (await this.state.storage.get("history")) || [];
        history = history.filter((m) => m.id !== data.id);
        await this.state.storage.put("history", history);
        return this.broadcast({ type: "deleted", id: data.id });
      }

      case "kick": {
        const target = clean(data.name, MAX_NAME).toLowerCase();
        if (!target) return;

        const banned = (await this.state.storage.get("banned")) || [];
        if (!banned.includes(target)) {
          banned.push(target);
          await this.state.storage.put("banned", banned);
        }

        for (const s of this.state.getWebSockets()) {
          const m = this.meta(s);
          if (m.joined && !m.admin && m.name.toLowerCase() === target) {
            this.send(s, { type: "kicked", text: "Admin က ထုတ်လိုက်ပါပြီ" });
            try { s.close(4003, "kicked"); } catch {}
          }
        }
        this.broadcastOnline();
        return this.send(ws, { type: "notice", text: target + " ကို ထုတ်ပြီး ပိတ်ထားပါပြီ" });
      }

      case "unban": {
        const target = clean(data.name, MAX_NAME).toLowerCase();
        const banned = (await this.state.storage.get("banned")) || [];
        const next = banned.filter((n) => n !== target);
        await this.state.storage.put("banned", next);
        return this.send(ws, { type: "notice", text: target + " ကို ပြန်ခွင့်ပေးပြီးပါပြီ" });
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

    if (url.pathname === "/ws") {
      if (request.headers.get("Upgrade") !== "websocket") {
        return new Response("Expected WebSocket", { status: 426 });
      }
      const id = env.CHAT_ROOM.idFromName("main");
      return env.CHAT_ROOM.get(id).fetch(request);
    }

    return new Response(HTML, {
      headers: { "Content-Type": "text/html; charset=UTF-8" },
    });
  },
};
