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
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TURBO MM - Chat</title>
<style>
  :root { --gold: #f5c542; --bg: #0b0b0f; --card: #15151c; --text: #eee; --muted: #888; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: sans-serif; background: var(--bg); color: var(--text); height: 100vh; display: flex; flex-direction: column; }
  header { padding: 14px 18px; background: var(--card); border-bottom: 2px solid var(--gold); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
  h1 { margin: 0; font-size: 22px; color: var(--gold); letter-spacing: 2px; }
  #status { font-size: 13px; color: var(--muted); }
  #messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
  .msg { background: var(--card); padding: 10px 14px; border-radius: 12px; max-width: 85%; align-self: flex-start; border: 1px solid #222; }
  .who { color: var(--gold); font-weight: bold; font-size: 13px; }
  .text { margin-top: 4px; white-space: pre-wrap; word-break: break-word; }
  .time { color: var(--muted); font-size: 11px; margin-top: 4px; text-align: right; }
  form { display: flex; gap: 8px; padding: 12px; background: var(--card); border-top: 1px solid #222; flex-wrap: wrap; }
  #name { width: 130px; padding: 10px; border-radius: 8px; border: 1px solid #333; background: var(--bg); color: var(--text); }
  #text { flex: 1; min-width: 150px; padding: 10px; border-radius: 8px; border: 1px solid #333; background: var(--bg); color: var(--text); }
  button { padding: 10px 18px; border: none; border-radius: 8px; background: var(--gold); color: #000; font-weight: bold; cursor: pointer; }
  footer { text-align: center; padding: 8px; font-size: 13px; background: var(--card); border-top: 1px solid #222; }
  footer a { color: var(--gold); text-decoration: none; margin: 0 8px; }
</style>
</head>
<body>
<header>
  <h1>TURBO MM</h1>
  <div id="status">ချိတ်ဆက်နေသည်...</div>
  <div id="online">Online: 0</div>
</header>

<div id="messages"></div>

<form id="form">
  <input id="name" placeholder="နာမည် (မဖြည့်လည်းရ)" maxlength="20">
  <input id="text" placeholder="စာရိုက်ပါ..." maxlength="500" autocomplete="off">
  <button type="submit">ပို့မည်</button>
</form>

<footer>
  <a href="https://t.me/arsar2027" target="_blank" rel="noopener">Telegram Channel</a>
  |
  <a href="https://t.me/turbomm750" target="_blank" rel="noopener">Owner: @turbomm750</a>
</footer>

<script>
  var list = document.getElementById("messages");
  var form = document.getElementById("form");
  var input = document.getElementById("text");
  var nameInput = document.getElementById("name");
  var statusEl = document.getElementById("status");
  var onlineEl = document.getElementById("online");
  var ws = null;

  nameInput.value = localStorage.getItem("tmm_name") || "";

  function addMsg(m) {
    var row = document.createElement("div");
    row.className = "msg";

    var who = document.createElement("div");
    who.className = "who";
    who.textContent = m.name;

    var text = document.createElement("div");
    text.className = "text";
    text.textContent = m.text;

    var time = document.createElement("div");
    time.className = "time";
    time.textContent = new Date(m.time).toLocaleTimeString("my-MM", { hour: "2-digit", minute: "2-digit" });

    row.appendChild(who);
    row.appendChild(text);
    row.appendChild(time);
    list.appendChild(row);
    list.scrollTop = list.scrollHeight;
  }

  function connect() {
    var proto = location.protocol === "https:" ? "wss://" : "ws://";
    ws = new WebSocket(proto + location.host + "/ws");

    ws.onopen = function () {
      statusEl.textContent = "🟢 ချိတ်ဆက်ပြီးပါပြီ";
    };

    ws.onclose = function () {
      statusEl.textContent = "🔴 ပြတ်သွားပါပြီ၊ ပြန်ချိတ်နေသည်...";
      setTimeout(connect, 2000);
    };

    ws.onmessage = function (e) {
      var d = JSON.parse(e.data);
      if (d.type === "history") {
        list.innerHTML = "";
        d.messages.forEach(addMsg);
      } else if (d.type === "chat") {
        addMsg(d);
      } else if (d.type === "online") {
        onlineEl.textContent = "Online: " + d.count;
      }
    };
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = input.value.trim();
    var name = nameInput.value.trim() || "Guest";
    if (!text || !ws || ws.readyState !== 1) return;

    localStorage.setItem("tmm_name", name);
    ws.send(JSON.stringify({ type: "chat", name: name, text: text }));
    input.value = "";
    input.focus();
  });

  connect();
</script>
</body>
</html>`;

export class ChatRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];

    this.state.acceptWebSocket(server);

    const history = (await this.state.storage.get("history")) || [];
    server.send(JSON.stringify({ type: "history", messages: history }));
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
    if (data.type !== "chat") return;

    const name = clean(data.name, MAX_NAME) || "Guest";
    const text = clean(data.text, MAX_TEXT);
    if (!text) return;

    const msg = { type: "chat", name, text, time: Date.now() };

    let history = (await this.state.storage.get("history")) || [];
    history.push(msg);
    if (history.length > MAX_HISTORY) history = history.slice(-MAX_HISTORY);
    await this.state.storage.put("history", history);

    const out = JSON.stringify(msg);
    for (const c of this.state.getWebSockets()) {
      c.send(out);
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

  broadcastOnline(leaving) {
    const count = this.state.getWebSockets().filter((c) => c !== leaving).length;
    const out = JSON.stringify({ type: "online", count });
    for (const c of this.state.getWebSockets()) {
      if (c !== leaving) c.send(out);
    }
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
