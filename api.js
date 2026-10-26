import { MAX_PHOTO, TYPES, clean, json, getCookie } from "./common.js";

export function getRoom(env) { return env.CHAT_ROOM.get(env.CHAT_ROOM.idFromName("main")); }

export function forward(env, path, body) {
  return getRoom(env).fetch("https://room" + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });
}

export async function requireSession(request, env) {
  const sid = getCookie(request, "session");
  if (!sid) return null;
  const res = await forward(env, "/session-get", { sessionId: sid });
  if (!res.ok) return null;
  const s = await res.json();
  return s.uid ? s : null;
}

export function isAdmin(request, env) {
  const key = request.headers.get("X-Admin-Key") || "";
  return !!env.ADMIN_KEY && key === env.ADMIN_KEY;
}

export async function handleAuth(request, env, url) {
  const secure = url.protocol === "https:" ? "; Secure" : "";

  if (url.pathname === "/auth/google") {
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
      return Response.redirect(url.origin + "/?login=error", 302);
    }
    const state = crypto.randomUUID();
    const p = new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      redirect_uri: url.origin + "/auth/google/callback",
      response_type: "code",
      scope: "openid email profile",
      state,
      access_type: "offline",
      prompt: "select_account",
    });
    return new Response(null, {
      status: 302,
      headers: {
        Location: "https://accounts.google.com/o/oauth2/v2/auth?" + p.toString(),
        "Set-Cookie": `oauth_state=${state}; HttpOnly; Path=/; Max-Age=600; SameSite=Lax${secure}`,
      },
    });
  }

  if (url.pathname === "/auth/google/callback") {
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const cookieState = getCookie(request, "oauth_state");
    const fail = () => Response.redirect(url.origin + "/?login=error", 302);
    if (!code || !state || state !== cookieState) return fail();

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: url.origin + "/auth/google/callback",
        grant_type: "authorization_code",
      }),
    });
    if (!tokenRes.ok) return fail();
    const tokens = await tokenRes.json();

    const infoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: "Bearer " + tokens.access_token },
    });
    if (!infoRes.ok) return fail();
    const info = await infoRes.json();
    if (!info.email) return fail();

    const sessRes = await forward(env, "/session-create", {
      email: info.email,
      name: info.name || info.email.split("@")[0],
      picture: info.picture || "",
    });
    if (!sessRes.ok) return fail();
    const sess = await sessRes.json();

    return new Response(null, {
      status: 302,
      headers: {
        Location: url.origin + "/",
        "Set-Cookie": `session=${sess.sessionId}; HttpOnly; Path=/; Max-Age=2592000; SameSite=Lax${secure}`,
      },
    });
  }

  if (url.pathname === "/auth/logout") {
    return new Response(null, {
      status: 302,
      headers: { Location: url.origin + "/", "Set-Cookie": `session=; HttpOnly; Path=/; Max-Age=0${secure}` },
    });
  }

  return null;
}

export async function uploadChatPhoto(request, env) {
  const form = await request.formData();
  const photo = form.get("photo");
  if (!photo || typeof photo === "string") return json({ error: "ပုံမပါ" }, 400);
  const ext = TYPES[photo.type];
  if (!ext) return json({ error: "ပုံအမျိုးအစား မမှန်ပါ" }, 400);
  if (photo.size > MAX_PHOTO) return json({ error: "3MB ထက် ကြီးနေပါတယ်" }, 400);
  const key = crypto.randomUUID() + "." + ext;
  await env.IMAGES.put(key, await photo.arrayBuffer(), { httpMetadata: { contentType: photo.type } });
  return json({ photoKey: key });
}

// ငွေလွှဲပြေစာ - လူတိုင်းမမြင်ရအောင် သီးသန့်သိမ်း (Admin သာ ကြည့်နိုင်)
export async function uploadReceipt(request, env) {
  const form = await request.formData();
  const photo = form.get("photo");
  if (!photo || typeof photo === "string") return json({ error: "ပုံမပါ" }, 400);
  const ext = TYPES[photo.type];
  if (!ext) return json({ error: "ပုံအမျိုးအစား မမှန်ပါ" }, 400);
  if (photo.size > MAX_PHOTO) return json({ error: "3MB ထက် ကြီးနေပါတယ်" }, 400);
  const key = "rcp-" + crypto.randomUUID() + "." + ext;
  await env.IMAGES.put(key, await photo.arrayBuffer(), { httpMetadata: { contentType: photo.type } });
  return json({ receipt: key });
}

export async function adminReceipt(key, env) {
  if (!/^rcp-[a-f0-9-]{36}\.(jpg|png|webp)$/.test(key)) return new Response("Not found", { status: 404 });
  const obj = await env.IMAGES.get(key);
  if (!obj) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("Cache-Control", "private, no-store");
  return new Response(obj.body, { headers });
}

export async function serveImage(key, env) {
  if (!/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(key)) return new Response("Not found", { status: 404 });
  const obj = await env.IMAGES.get(key);
  if (!obj) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=86400");
  return new Response(obj.body, { headers });
}

export async function api(request, env, url) {
  const path = url.pathname;
  const method = request.method;

  if (path === "/api/me" && method === "GET") {
    const bRes = await forward(env, "/banner-get", {});
    const banner = (await bRes.json()).banner || null;
    const s = await requireSession(request, env);
    if (!s) return json({ uid: null, banner });
    const uRes = await forward(env, "/user-get", { uid: s.uid });
    const u = uRes.ok ? await uRes.json() : {};
    return json({ uid: s.uid, email: s.email, name: u.name || "", picture: u.picture || "", role: u.role || "free", premiumUntil: u.premiumUntil || null, banner });
  }

  const session = await requireSession(request, env);
  if (!session) return json({ error: "Login လိုအပ်ပါတယ်" }, 401);
  const uid = session.uid;

  if (path === "/api/plans" && method === "GET") return forward(env, "/plans", {});
  if (path === "/api/keys" && method === "GET") return forward(env, "/keys", { uid });
  if (path === "/api/payment" && method === "GET") return forward(env, "/payment-get", {});
  if (path === "/api/key-copy" && method === "POST") {
    const b = await request.json();
    return forward(env, "/key-copy", { uid, id: clean(b.id, 60) });
  }
  if (path === "/api/admin-contact" && method === "GET") return forward(env, "/admin-contact", {});
  if (path === "/api/order" && method === "POST") {
    const b = await request.json();
    return forward(env, "/order", { uid, planId: clean(b.planId, 60), note: clean(b.note, 500), receipt: clean(b.receipt, 60), coupon: clean(b.coupon || "", 24) });
  }
  if (path === "/api/my-orders" && method === "GET") return forward(env, "/my-orders", { uid });
  if (path === "/api/coupon/check" && method === "POST") {
    const b = await request.json();
    return forward(env, "/coupon-check", { uid, planId: clean(b.planId, 60), code: clean(b.code || "", 24) });
  }
  if (path === "/api/coupon/redeem" && method === "POST") {
    const b = await request.json();
    return forward(env, "/coupon-redeem", { uid, code: clean(b.code || "", 24) });
  }

  if (path === "/api/dm/conversations" && method === "GET") return forward(env, "/dm-list", { uid });
  if (path === "/api/dm/history" && method === "POST") {
    const b = await request.json();
    return forward(env, "/dm-history", { uid, with: clean(b.with, 60) });
  }
  if (path === "/api/chat-photo" && method === "POST") return uploadChatPhoto(request, env);
  if (path === "/api/receipt-upload" && method === "POST") return uploadReceipt(request, env);

  if (path.startsWith("/api/admin/")) {
    if (!isAdmin(request, env)) return json({ error: "Admin key မှားနေပါတယ်" }, 401);
    if (path === "/api/admin/orders" && method === "GET") return forward(env, "/admin-orders", {});
    if (path === "/api/admin/order-approve" && method === "POST") {
      const b = await request.json();
      return forward(env, "/order-approve", { id: clean(b.id, 60), key: clean(b.key, 1000) });
    }
    if (path === "/api/admin/order-reject" && method === "POST") {
      const b = await request.json();
      return forward(env, "/order-reject", { id: clean(b.id, 60) });
    }
    if (path === "/api/admin/panel-test" && method === "GET") return forward(env, "/panel-test", {});
    if (path === "/api/admin/receipt" && method === "GET") return adminReceipt(url.searchParams.get("key") || "", env);
    if (path === "/api/admin/payment" && method === "GET") return forward(env, "/payment-get", {});
    if (path === "/api/admin/payment-set" && method === "POST") {
      const b = await request.json();
      return forward(env, "/payment-set", { accounts: Array.isArray(b.accounts) ? b.accounts.slice(0, 10) : [] });
    }
    if (path === "/api/admin/keys" && method === "GET") return forward(env, "/admin-keys", {});
    if (path === "/api/admin/key-create" && method === "POST") {
      const b = await request.json();
      return forward(env, "/key-create", { title: clean(b.title, 80), panel: clean(b.panel, 300), key: clean(b.key, 2000), access: b.access === "premium" ? "premium" : "free", maxUsers: b.maxUsers });
    }
    if (path === "/api/admin/key-update" && method === "POST") {
      const b = await request.json();
      return forward(env, "/key-update", {
        id: clean(b.id, 60),
        access: b.access === "premium" ? "premium" : b.access === "free" ? "free" : "",
        maxUsers: b.maxUsers, reset: !!b.reset,
      });
    }
    if (path === "/api/admin/key-delete" && method === "POST") {
      const b = await request.json();
      return forward(env, "/key-delete", { id: clean(b.id, 60) });
    }
    if (path === "/api/admin/plans" && method === "GET") return forward(env, "/admin-plans", {});
    if (path === "/api/admin/create-plan" && method === "POST") {
      const b = await request.json();
      return forward(env, "/create-plan", { title: clean(b.title, 60), price: clean(b.price, 40), duration: clean(b.duration, 20), description: clean(b.description, 200) });
    }
    if (path === "/api/admin/delete-plan" && method === "POST") {
      const b = await request.json();
      return forward(env, "/delete-plan", { id: clean(b.id, 60) });
    }
    if (path === "/api/admin/users" && method === "GET") return forward(env, "/admin-users", {});
    if (path === "/api/admin/set-role" && method === "POST") {
      const b = await request.json();
      return forward(env, "/set-role", { uid: clean(b.uid, 60), role: b.role === "premium" ? "premium" : "free" });
    }
    if (path === "/api/admin/reports" && method === "GET") return forward(env, "/admin-reports", {});
    if (path === "/api/admin/banner-set" && method === "POST") {
      const b = await request.json();
      return forward(env, "/banner-set", { text: clean(b.text || "", 300), level: b.level });
    }
    if (path === "/api/admin/coupons" && method === "GET") return forward(env, "/coupon-list", {});
    if (path === "/api/admin/coupon-create" && method === "POST") {
      const b = await request.json();
      return forward(env, "/coupon-create", { code: b.code, type: b.type, value: b.value, maxUses: b.maxUses, expiresAt: clean(b.expiresAt || "", 20), ref: clean(b.ref || "", 60) });
    }
    if (path === "/api/admin/coupon-delete" && method === "POST") {
      const b = await request.json();
      return forward(env, "/coupon-delete", { code: clean(b.code || "", 24) });
    }
    if (path === "/api/admin/health-check" && method === "GET") return forward(env, "/health-check", {});
    if (path === "/api/admin/report-resolve" && method === "POST") {
      const b = await request.json();
      return forward(env, "/report-resolve", { id: clean(b.id, 60) });
    }
  }

  return json({ error: "Not found" }, 404);
}
