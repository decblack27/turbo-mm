import { MAX_CHAT, MAX_HISTORY, MAX_DM_HISTORY, clean, json, UUID_RE } from "./common.js";
import { features, priceNum, applyDiscount } from "./features.js";

export class ChatRoom {
  constructor(state, env) { this.state = state; this.env = env; }

  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/ws") return this.upgrade(request);

    const body = await request.json().catch(() => ({}));
    if (path === "/session-create") return this.sessionCreate(body);
    if (path === "/session-get") return this.sessionGet(body);
    if (path === "/user-get") return this.userGet(body);
    
    if (path === "/plans") return this.getPlans();
    if (path === "/keys") return this.keysForUser(body);
    if (path === "/key-copy") return this.keyCopy(body);
    if (path === "/payment-get") return this.paymentGet();
    if (path === "/panel-test") return this.panelTest();
    if (path === "/payment-set") return this.paymentSet(body);
    if (path === "/admin-contact") return this.adminContact();
    if (path === "/order") return this.createOrder(body);
    if (path === "/my-orders") return this.myOrders(body);

    if (path === "/banner-get") return this.bannerGet();
    if (path === "/banner-set") return this.bannerSet(body);
    if (path === "/coupon-list") return this.couponList();
    if (path === "/coupon-create") return this.couponCreate(body);
    if (path === "/coupon-delete") return this.couponDelete(body);
    if (path === "/coupon-check") return this.couponCheck(body);
    if (path === "/coupon-redeem") return this.couponRedeem(body);
    if (path === "/health-check") return this.healthCheck();

    if (path === "/dm-list") return this.dmList(body);
    if (path === "/dm-history") return this.dmHistory(body);
    
    // Admin routes
    if (path === "/admin-orders") return this.adminOrders();
    if (path === "/order-approve") return this.orderApprove(body);
    if (path === "/order-reject") return this.orderReject(body);
    if (path === "/admin-keys") return this.adminKeys();
    if (path === "/key-create") return this.keyCreate(body);
    if (path === "/key-update") return this.keyUpdate(body);
    if (path === "/key-delete") return this.keyDelete(body);
    if (path === "/admin-plans") return this.adminPlans();
    if (path === "/create-plan") return this.createPlan(body);
    if (path === "/delete-plan") return this.deletePlan(body);
    if (path === "/admin-users") return this.adminUsers();
    if (path === "/set-role") return this.setRole(body);
    if (path === "/admin-reports") return this.adminReports();
    if (path === "/report-resolve") return this.reportResolve(body);

    return json({ error: "Not found" }, 404);
  }

  // ===== Session =====
  async sessionCreate(b) {
    const email = clean(b.email, 200).toLowerCase();
    if (!email) return json({ error: "No email" }, 400);

    let uid = await this.state.storage.get("email:" + email);
    if (!uid) {
      uid = crypto.randomUUID();
      await this.state.storage.put("email:" + email, uid);
    }
    const existing = (await this.state.storage.get("u:" + uid)) || {};
    const user = {
      email,
      name: clean(b.name, 60) || existing.name || email.split("@")[0],
      picture: clean(b.picture || "", 500) || existing.picture || "",
      role: existing.role || "free",
      ...(existing.premiumUntil ? { premiumUntil: existing.premiumUntil } : {}),
    };
    await this.state.storage.put("u:" + uid, user);

    const sessionId = crypto.randomUUID();
    const expires = Date.now() + 30 * 24 * 60 * 60 * 1000;
    await this.state.storage.put("session:" + sessionId, { uid, email, expires });
    return json({ sessionId, uid, email, name: user.name });
  }

  async sessionGet(b) {
    const sid = clean(b.sessionId, 100);
    if (!sid) return json({ error: "No session" }, 401);
    const s = await this.state.storage.get("session:" + sid);
    if (!s || s.expires < Date.now()) return json({ error: "Expired" }, 401);
    return json(s);
  }

  async userGet(b) {
    const u = await this.getUser(clean(b.uid, 60));
    if (!u) return json({ error: "Not found" }, 404);
    return json({ uid: b.uid, name: u.name, email: u.email, picture: u.picture || "", role: u.role, premiumUntil: u.premiumUntil || null });
  }

  async adminUsers() {
    const map = await this.state.storage.list({ prefix: "u:", limit: 500 });
    const users = [];
    for (const [key, val] of map) {
      const expired = val.role === "premium" && val.premiumUntil && val.premiumUntil < Date.now();
      users.push({ uid: key.slice(2), name: val.name, email: val.email, role: expired ? "free" : (val.role || "free"), premiumUntil: expired ? null : (val.premiumUntil || null) });
    }
    return json({ users });
  }

  async setRole(b) {
    const uid = clean(b.uid, 60);
    const u = await this.state.storage.get("u:" + uid);
    if(u) {
      u.role = b.role;
      delete u.premiumUntil; // Admin က လက်ဖြင့်ပေးသော Premium သည် သက်တမ်းမကန့်သတ်
      await this.state.storage.put("u:" + uid, u);
    }
    return json({ ok: true });
  }

  // ===== Panel & Keys (Free / Premium) =====
  async listKeys() {
    const map = await this.state.storage.list({ prefix: "vkey:", limit: 500 });
    return [...map.values()].sort((a, b) => a.createdAt - b.createdAt);
  }

  // ===== Server Panel ချိတ်ဆက်မှု (online / data / သက်တမ်း) =====
  panelList() {
    try { const l = JSON.parse(this.env.PANELS || "[]"); return Array.isArray(l) ? l : []; } catch (e) { return []; }
  }

  async panelStatus() {
    const now = Date.now();
    if (this.pcache && now - this.pcache.at < 20000) return this.pcache.data;
    const users = {}, servers = [];
    await Promise.all(this.panelList().map(async (p) => {
      const base = String(p.url).replace(/\/+$/, "");
      let host = "";
      try { host = new URL(base).hostname.toLowerCase(); } catch (e) {}
      const srv = { host, up: false, xray: false, ms: null };
      servers.push(srv);
      const t0 = Date.now();
      try {
        const r = await fetch(base + "/api/public/status", {
          headers: { "X-Api-Token": String(p.token || "") },
          signal: AbortSignal.timeout(4000),
        });
        srv.ms = Date.now() - t0;
        if (!r.ok) return;
        const d = await r.json();
        srv.up = true;
        srv.xray = d.xray !== false;
        for (const u of d.users || []) users[String(u.uuid).toLowerCase()] = { ...u, host };
      } catch (e) {}
    }));
    const data = { users, servers };
    this.pcache = { at: now, data };
    return data;
  }

  // Key ရဲ့ Server အခြေအနေ (Panel ကို UUID / host / Panel တစ်ခုတည်း နဲ့ ကိုက်ညှိတယ်)
  keyLive(k, data) {
    const m = String(k.key || "").match(UUID_RE) || String(k.panel || "").match(UUID_RE);
    const u = m && data.users[m[0].toLowerCase()];
    let srv = u ? data.servers.find((x) => x.host === u.host) : null;
    if (!srv) {
      const hm = String(k.key || "").match(/@([^:\/?#]+)/);
      const h = hm && hm[1].toLowerCase();
      srv = data.servers.find((x) => x.host === h);
    }
    if (!srv && data.servers.length === 1) srv = data.servers[0];
    if (!srv) return null;
    return {
      server: !srv.up ? "down" : srv.xray ? "up" : "xray_down",
      ms: srv.up ? srv.ms : null,
      active: u ? !!u.active : true,
      leftGb: u ? Math.max(0, Math.round((Number(u.quota_gb) - Number(u.used_gb)) * 100) / 100) : null,
      daysLeft: u ? u.days_left : null,
    };
  }

  async panelTest() {
    const panels = this.panelList();
    if (!panels.length) return json({ results: [], note: "PANELS secret မသတ်မှတ်ရသေးပါ (သို့) JSON မမှန်ပါ" });
    const results = await Promise.all(panels.map(async (p) => {
      try {
        const r = await fetch(String(p.url).replace(/\/+$/, "") + "/api/public/status", {
          headers: { "X-Api-Token": String(p.token || "") },
          signal: AbortSignal.timeout(5000),
        });
        if (!r.ok) return { url: p.url, ok: false, msg: "HTTP " + r.status + (r.status === 401 ? " (token မကိုက်ပါ)" : "") };
        const d = await r.json();
        const us = d.users || [];
        return { url: p.url, ok: true, msg: "Server Online · Key " + us.length + " ခု" + (d.xray === false ? " · ⚠ Xray ရပ်နေပါတယ်" : "") };
      } catch (e) {
        return { url: p.url, ok: false, msg: String((e && e.message) || e) };
      }
    }));
    return json({ results });
  }

  // Premium သက်တမ်းကုန်ရင် Free ပြန်ချ
  async getUser(uid) {
    const u = await this.state.storage.get("u:" + uid);
    if (u && u.role === "premium" && u.premiumUntil && u.premiumUntil < Date.now()) {
      u.role = "free";
      delete u.premiumUntil;
      await this.state.storage.put("u:" + uid, u);
    }
    return u;
  }

  isPremiumUser(u) { return !!u && (u.role === "premium" || u.role === "admin"); }

  keyStats(k) {
    const claims = k.claims || {};
    const ids = Object.keys(claims);
    return { used: ids.length, copies: ids.reduce((n, id) => n + (claims[id] || 0), 0) };
  }

  async keysForUser(b) {
    const uid = clean(b.uid, 60);
    const u = await this.getUser(uid);
    const premium = this.isPremiumUser(u);
    let keys = await this.listKeys();
    // Free → Free Key သာ၊ Premium → Premium Key သာ၊ Admin → အကုန်
    keys = keys.filter((k) => (u && u.role === "admin") ? true : premium ? k.access === "premium" : k.access === "free");
    const liveMap = await this.panelStatus();
    const out = keys.map((k) => {
      const { used, copies } = this.keyStats(k);
      const max = k.maxUsers || 0;
      const claimed = !!(k.claims && k.claims[uid]);
      const lv = this.keyLive(k, liveMap);
      return {
        id: k.id, title: k.title, access: k.access, maxUsers: max, used, copies, claimed,
        live: lv, dead: !!lv && !lv.active,
        full: !claimed && max > 0 && used >= max,
        // Key / Panel ကို ယူပြီးသူသာ မြင်ရမယ် (လူပြည့်ရင် မမြင်ရ)
        panel: claimed ? k.panel : "", key: claimed ? k.key : "",
      };
    });
    return json({ keys: out, premium, premiumUntil: (u && u.premiumUntil) || null });
  }

  async keyCopy(b) {
    const uid = clean(b.uid, 60), id = clean(b.id, 60);
    const u = await this.getUser(uid);
    if (!u) return json({ error: "Login လိုအပ်ပါတယ်" }, 401);
    const k = await this.state.storage.get("vkey:" + id);
    if (!k) return json({ error: "Key မတွေ့ပါ" }, 404);
    if (k.access === "premium" && !this.isPremiumUser(u)) return json({ error: "Premium User များသာ ယူနိုင်ပါသည်" }, 403);
    if (k.access === "free" && u.role === "premium") return json({ error: "Premium User များသည် Premium Key များကိုသာ အသုံးပြုရပါမည်" }, 403);
    const lv = this.keyLive(k, await this.panelStatus());
    if (lv && !lv.active) return json({ error: "ဒီ Key သက်တမ်း/Data ကုန်သွားပါပြီ" }, 409);

    k.claims = k.claims || {};
    const max = k.maxUsers || 0;
    const already = !!k.claims[uid];
    if (!already && max > 0 && Object.keys(k.claims).length >= max) {
      return json({ error: "လူပြည့်သွားပါပြီ၊ ဒီ Key ကို မယူနိုင်တော့ပါ" }, 409);
    }
    k.claims[uid] = (k.claims[uid] || 0) + 1;
    await this.state.storage.put("vkey:" + id, k);
    return json({ ok: true, key: k.key, panel: k.panel, ...this.keyStats(k) });
  }

  async adminKeys() {
    const liveMap = await this.panelStatus();
    const keys = (await this.listKeys()).map((k) => ({
      id: k.id, title: k.title, panel: k.panel, key: k.key, access: k.access,
      maxUsers: k.maxUsers || 0, ...this.keyStats(k), live: this.keyLive(k, liveMap),
    }));
    return json({ keys });
  }

  async paymentGet() {
    const p = await this.state.storage.get("payment");
    return json({ accounts: (p && p.accounts) || [] });
  }

  async paymentSet(b) {
    const accounts = (Array.isArray(b.accounts) ? b.accounts : []).slice(0, 10)
      .map((a) => ({ name: clean(a && a.name, 40), number: clean(a && a.number, 40), holder: clean(a && a.holder, 60) }))
      .filter((a) => a.name && a.number);
    await this.state.storage.put("payment", { accounts });
    return json({ ok: true });
  }

  async adminContact() {
    return json((await this.state.storage.get("adminUid")) || {});
  }

  async keyCreate(b) {
    const title = clean(b.title, 80), key = clean(b.key, 2000);
    if (!title || !key) return json({ error: "အမည်နဲ့ Key ထည့်ပါ" }, 400);
    const id = crypto.randomUUID();
    await this.state.storage.put("vkey:" + id, {
      id, title, panel: clean(b.panel, 300), key,
      access: b.access === "premium" ? "premium" : "free",
      maxUsers: Math.max(0, Math.min(100000, parseInt(b.maxUsers, 10) || 0)),
      claims: {},
      createdAt: Date.now(),
    });
    return json({ ok: true, id });
  }

  async keyUpdate(b) {
    const id = clean(b.id, 60);
    const k = await this.state.storage.get("vkey:" + id);
    if (!k) return json({ error: "Key မတွေ့ပါ" }, 404);
    if (b.access === "premium" || b.access === "free") k.access = b.access;
    if (b.maxUsers !== undefined && b.maxUsers !== null && b.maxUsers !== "") {
      k.maxUsers = Math.max(0, Math.min(100000, parseInt(b.maxUsers, 10) || 0));
    }
    if (b.reset) k.claims = {};
    await this.state.storage.put("vkey:" + id, k);
    return json({ ok: true });
  }

  async keyDelete(b) {
    await this.state.storage.delete("vkey:" + clean(b.id, 60));
    return json({ ok: true });
  }

  // ===== Plans & Orders =====
  async getPlans() {
    const map = await this.state.storage.list({ prefix: "plan:", limit: 100 });
    const plans = [...map.values()].sort((a,b) => a.createdAt - b.createdAt);
    return json({ plans });
  }

  async adminPlans() {
    const map = await this.state.storage.list({ prefix: "plan:", limit: 100 });
    const plans = [...map.values()].sort((a,b) => a.createdAt - b.createdAt);
    return json({ plans });
  }

  async createPlan(b) {
    const id = crypto.randomUUID();
    const plan = {
      id,
      title: clean(b.title, 60),
      price: clean(b.price, 40),
      duration: clean(b.duration, 20),
      description: clean(b.description, 200),
      createdAt: Date.now()
    };
    await this.state.storage.put("plan:" + id, plan);
    return json({ ok: true, id });
  }

  async deletePlan(b) {
    await this.state.storage.delete("plan:" + b.id);
    return json({ ok: true });
  }

  async createOrder(b) {
    const uid = clean(b.uid, 60);
    const user = await this.state.storage.get("u:" + uid);
    const plan = await this.state.storage.get("plan:" + b.planId);
    if (!user || !plan) return json({ error: "အချက်အလက် မမှန်ပါ" }, 400);
    const receipt = clean(b.receipt, 60);
    if (!/^(rcp-)?[a-f0-9-]{36}\.(jpg|png|webp)$/.test(receipt)) return json({ error: "ငွေလွှဲပြေစာ ပုံတင်ပါ" }, 400);

    // Pending Order တစ်ခုရှိပြီးသားဆိုရင် ထပ်မတင်နိုင်
    const all = await this.state.storage.list({ prefix: "order:", limit: 1000 });
    for (const o of all.values()) {
      if (o.uid === uid && o.status === "pending") {
        return json({ error: "Pending Order ရှိနေပါပြီ။ Admin အတည်ပြုသည်အထိ စောင့်ပါ" }, 409);
      }
    }

    let finalPrice = priceNum(plan.price), discount = 0, couponCode = null;
    const cc = clean(b.coupon || "", 24);
    if (cc) {
      const v = await this.couponValidate(cc, uid, "order");
      if (v.error) return json({ error: v.error }, 400);
      const r = applyDiscount(v.coupon, plan.price);
      finalPrice = r.finalPrice;
      discount = r.planPrice - r.finalPrice;
      couponCode = v.coupon.code;
      const c = v.coupon;
      c.uses = (c.uses || 0) + 1;
      c.usedBy = c.usedBy || {};
      c.usedBy[uid] = Date.now();
      await this.state.storage.put("coupon:" + c.code, c);
    }

    const id = crypto.randomUUID();
    await this.state.storage.put("order:" + id, {
      id, uid, userName: user.name,
      planId: plan.id, planTitle: plan.title, planPrice: plan.price,
      planDuration: parseInt(plan.duration, 10) || 30,
      note: clean(b.note, 500), receipt,
      couponCode, discount, finalPrice,
      status: "pending", v2rayKey: null, createdAt: Date.now(),
    });
    return json({ ok: true, id, finalPrice });
  }

  async myOrders(b) {
    const uid = clean(b.uid, 60);
    const map = await this.state.storage.list({ prefix: "order:", limit: 500 });
    const orders = [...map.values()].filter(o => o.uid === uid).sort((a,b) => b.createdAt - a.createdAt)
      .map(({ v2rayKey, ...rest }) => rest);
    return json({ orders });
  }

  async adminOrders() {
    const map = await this.state.storage.list({ prefix: "order:", limit: 1000 });
    const orders = [...map.values()].sort((a,b) => b.createdAt - a.createdAt);
    return json({ orders });
  }

  async orderApprove(b) {
    const id = clean(b.id, 60);
    const order = await this.state.storage.get("order:" + id);
    if (!order) return json({ error: "Order မတွေ့ပါ" }, 404);
    if (order.status === "approved") return json({ ok: true }); // နှစ်ကြိမ်မပေါင်းအောင်
    order.status = "approved";
    order.v2rayKey = null;
    order.approvedAt = Date.now();
    await this.state.storage.put("order:" + id, order);

    let days = parseInt(order.planDuration, 10);
    if (!days) {
      const plan = await this.state.storage.get("plan:" + order.planId);
      days = parseInt(plan && plan.duration, 10) || 30;
    }
    await this.extendPremium(order.uid, days);
    return json({ ok: true });
  }

  async orderReject(b) {
    const id = clean(b.id, 60);
    const order = await this.state.storage.get("order:" + id);
    if (!order) return json({ error: "Order မတွေ့ပါ" }, 404);
    if (order.status === "pending" && order.couponCode) {
      const c = await this.state.storage.get("coupon:" + order.couponCode);
      if (c) {
        c.uses = Math.max(0, (c.uses || 1) - 1);
        if (c.usedBy) delete c.usedBy[order.uid];
        await this.state.storage.put("coupon:" + c.code, c);
      }
    }
    order.status = "rejected";
    await this.state.storage.put("order:" + id, order);
    return json({ ok: true });
  }

  // ===== Reports =====
  async adminReports() {
    const reports = (await this.state.storage.get("reports")) || [];
    return json({ reports: reports.slice().reverse() });
  }

  async reportResolve(b) {
    let reports = (await this.state.storage.get("reports")) || [];
    const r = reports.find((x) => x.id === b.id);
    if (r) r.resolved = true;
    await this.state.storage.put("reports", reports);
    return json({ ok: true });
  }

  // ===== DMs =====
  async dmList(b) {
    const uid = clean(b.uid, 60);
    if (!uid) return json({ conversations: [] });
    const map = await this.state.storage.list({ prefix: "dm:", limit: 2000 });
    const convs = [];
    for (const [key, msgs] of map) {
      if (!msgs || !msgs.length) continue;
      const parts = key.slice(3).split(":");
      if (!parts.includes(uid)) continue;
      const otherUid = parts[0] === uid ? parts[1] : parts[0];
      const otherUser = await this.state.storage.get("u:" + otherUid);
      const last = msgs[msgs.length - 1];
      convs.push({
        uid: otherUid,
        name: otherUser?.name || "Unknown",
        lastText: last.text || (last.photoKey ? "[ပုံ]" : ""),
        lastTime: last.time || 0,
      });
    }
    convs.sort((a, b) => b.lastTime - a.lastTime);
    return json({ conversations: convs });
  }

  async dmHistory(b) {
    const uid = clean(b.uid, 60);
    const withUid = clean(b.with, 60);
    if (!uid || !withUid) return json({ messages: [] });
    const pair = [uid, withUid].sort().join(":");
    const messages = (await this.state.storage.get("dm:" + pair)) || [];
    return json({ messages, with: withUid });
  }

  // ===== WebSocket =====
  async upgrade(request) {
    if (request.headers.get("Upgrade") !== "websocket") return new Response("Expected WebSocket", { status: 426 });
    const sid = request.headers.get("X-Session-Id");
    if (!sid) return new Response("Unauthorized", { status: 401 });
    const sess = await this.state.storage.get("session:" + sid);
    if (!sess || sess.expires < Date.now()) return new Response("Unauthorized", { status: 401 });

    const pair = new WebSocketPair();
    this.state.acceptWebSocket(pair[1]);
    pair[1].serializeAttachment({ joined: false, uid: sess.uid, email: sess.email, name: "" });
    return new Response(null, { status: 101, webSocket: pair[0] });
  }

  meta(ws) {
    try { return ws.deserializeAttachment() || {}; } catch { return {}; }
  }

  sendTo(ws, obj) { try { ws.send(JSON.stringify(obj)); } catch {} }

  broadcast(obj, except) {
    const out = JSON.stringify(obj);
    for (const c of this.state.getWebSockets()) {
      if (c === except) continue;
      if (!this.meta(c).joined) continue;
      try { c.send(out); } catch {}
    }
  }

  broadcastOnline(leaving) {
    const count = this.state.getWebSockets().filter((c) => c !== leaving && this.meta(c).joined).length;
    this.broadcast({ type: "online", count }, leaving);
  }

  async webSocketMessage(ws, message) {
    let data;
    try { data = JSON.parse(message); } catch { return; }
    if (data.type === "join") return this.join(ws, data);

    const me = this.meta(ws);
    if (!me.joined) return this.sendTo(ws, { type: "error", text: "အရင်ဆုံး ချိတ်ဆက်ပါ" });

    if (data.type === "chat") return this.chat(ws, me, data);
    if (data.type === "chat-photo") return this.chatPhoto(ws, me, data);
    if (data.type === "dm") return this.chatDM(ws, me, data);
    if (data.type === "admin") return this.chatAdmin(ws, me, data);
  }

  async join(ws, data) {
    const me = this.meta(ws);
    if (!me.uid) return this.sendTo(ws, { type: "error", text: "Login လိုအပ်ပါတယ်" });
    const user = await this.state.storage.get("u:" + me.uid);
    const name = user?.name || me.uid.slice(0, 8);
    const isAdmin = !!this.env.ADMIN_KEY && data.adminKey === this.env.ADMIN_KEY;

    const banned = (await this.state.storage.get("banned")) || [];
    if (banned.includes(me.uid) && !isAdmin) {
      this.sendTo(ws, { type: "kicked", text: "Admin က ထုတ်ထားပါတယ်" });
      try { ws.close(4003, "banned"); } catch {}
      return;
    }

    ws.serializeAttachment({ joined: true, uid: me.uid, email: me.email, name, admin: isAdmin });
    if (isAdmin) await this.state.storage.put("adminUid", { uid: me.uid, name });
    const locked = !!(await this.state.storage.get("chat:locked"));
    this.sendTo(ws, { type: "joined", name, admin: isAdmin, locked });

    const history = (await this.state.storage.get("chat:history")) || [];
    this.sendTo(ws, { type: "history", messages: history });
    this.broadcastOnline();
  }

  async chat(ws, me, data) {
    const locked = await this.state.storage.get("chat:locked");
    if (locked && !me.admin) return this.sendTo(ws, { type: "error", text: "Admin က chat ကို ယာယီပိတ်ထားပါတယ်" });
    const text = clean(data.text, MAX_CHAT);
    if (!text) return;
    const msg = { type: "chat", id: crypto.randomUUID(), uid: me.uid, name: me.name, admin: !!me.admin, text, time: Date.now() };
    let history = (await this.state.storage.get("chat:history")) || [];
    history.push(msg);
    if (history.length > MAX_HISTORY) history = history.slice(-MAX_HISTORY);
    await this.state.storage.put("chat:history", history);
    this.broadcast(msg);
  }

  async chatPhoto(ws, me, data) {
    const locked = await this.state.storage.get("chat:locked");
    if (locked && !me.admin) return this.sendTo(ws, { type: "error", text: "Chat ပိတ်ထားပါတယ်" });
    const photoKey = clean(data.photoKey, 100);
    if (!photoKey) return;
    const msg = {
      type: "chat", id: crypto.randomUUID(), uid: me.uid, name: me.name, admin: !!me.admin,
      photoKey, text: clean(data.text || "", MAX_CHAT), time: Date.now(),
    };
    let history = (await this.state.storage.get("chat:history")) || [];
    history.push(msg);
    if (history.length > MAX_HISTORY) history = history.slice(-MAX_HISTORY);
    await this.state.storage.put("chat:history", history);
    this.broadcast(msg);
  }

  async chatDM(ws, me, data) {
    const toUid = clean(data.to, 60);
    if (!toUid || toUid === me.uid) return;
    const text = clean(data.text || "", MAX_CHAT);
    const photoKey = clean(data.photoKey || "", 100);
    if (!text && !photoKey) return;

    const pair = [me.uid, toUid].sort().join(":");
    const msg = {
      type: "dm", id: crypto.randomUUID(),
      from: me.uid, fromName: me.name, to: toUid,
      text: text || "", photoKey: photoKey || null, time: Date.now(),
    };
    let history = (await this.state.storage.get("dm:" + pair)) || [];
    history.push(msg);
    if (history.length > MAX_DM_HISTORY) history = history.slice(-MAX_DM_HISTORY);
    await this.state.storage.put("dm:" + pair, history);

    for (const s of this.state.getWebSockets()) {
      const m = this.meta(s);
      if (m.joined && m.uid === toUid && s !== ws) this.sendTo(s, msg);
    }
    this.sendTo(ws, msg);
  }

  async chatAdmin(ws, me, data) {
    if (!me.admin) return this.sendTo(ws, { type: "error", text: "Admin မဟုတ်ပါ" });
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
        const shownName = clean(data.name, 60);
        let target = null;
        const map = await this.state.storage.list({ prefix: "u:", limit: 10000 });
        for (const [key, val] of map) {
          if (String(val.name || "").toLowerCase() === shownName.toLowerCase()) { target = key.slice(2); break; }
        }
        if (!target) return this.sendTo(ws, { type: "error", text: "ဒီနာမည် မတွေ့ပါ" });

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

  webSocketClose(ws) { try { ws.close(); } catch {} this.broadcastOnline(ws); }
  webSocketError(ws) { try { ws.close(); } catch {} this.broadcastOnline(ws); }
}

// Banner / Coupon / Trial / Server Health methods
Object.assign(ChatRoom.prototype, features);
