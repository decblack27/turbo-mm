// TURBO VPN — Banner, Coupon/Referral/Trial, Server Health → Telegram
// room.js ထဲမှာ ChatRoom class ပြီးမှ Object.assign(ChatRoom.prototype, features) ခေါ်ပါ။
import { clean, json } from "./common.js";

const DAY = 86400000;
const CODE_RE = /^[A-Z0-9_-]{3,24}$/;

export const priceNum = (s) => parseInt(String(s || "").replace(/[^0-9]/g, ""), 10) || 0;

export function applyDiscount(c, priceStr) {
  const planPrice = priceNum(priceStr);
  let finalPrice = planPrice;
  if (c.type === "percent") finalPrice = Math.round(planPrice * (100 - c.value) / 100);
  if (c.type === "fixed") finalPrice = Math.max(0, planPrice - c.value);
  return { planPrice, finalPrice };
}

const esc = (s) => String(s).replace(/[&<>]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch]));
const normCode = (c) => clean(c, 24).toUpperCase();

export const features = {
  // ===== Banner (Admin ပြောချင်တာ ပင်မ အပေါ်ဆုံး) =====
  async bannerGet() {
    const b = (await this.state.storage.get("banner")) || null;
    return json({ banner: b && b.text ? b : null });
  },

  async bannerSet(b) {
    const text = clean(b.text, 300);
    if (!text) {
      await this.state.storage.delete("banner");
      return json({ ok: true, banner: null });
    }
    const level = ["info", "warn", "danger"].includes(b.level) ? b.level : "info";
    const banner = { text, level, at: Date.now() };
    await this.state.storage.put("banner", banner);
    return json({ ok: true, banner });
  },

  // ===== Premium သက်တမ်း တိုးခြင်း (Order approve + Trial အတွက် အသုံးပြု) =====
  async extendPremium(uid, days) {
    const u = await this.getUser(uid);
    if (!u || u.role === "admin") return;
    if (u.role === "premium" && !u.premiumUntil) return; // Admin လက်ဖြင့်ပေးထားသော အကန့်အသတ်မရှိ Premium
    const base = u.role === "premium" && u.premiumUntil > Date.now() ? u.premiumUntil : Date.now();
    u.role = "premium";
    u.premiumUntil = base + days * DAY;
    await this.state.storage.put("u:" + uid, u);
  },

  // ===== Coupon / Referral / Trial =====
  // type: percent (% လျှော့) | fixed (ကျပ် လျှော့) | trial (Premium ရက်အစမ်း)
  async couponList() {
    const map = await this.state.storage.list({ prefix: "coupon:", limit: 500 });
    const coupons = [...map.values()]
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((c) => ({
        code: c.code, type: c.type, value: c.value, maxUses: c.maxUses || 0,
        uses: c.uses || 0, expiresAt: c.expiresAt || null, ref: c.ref || "", active: c.active !== false,
      }));
    return json({ coupons });
  },

  async couponCreate(b) {
    const code = normCode(b.code);
    if (!CODE_RE.test(code)) return json({ error: "Code က A-Z, 0-9, - _ (၃ ～ ၂၄ လုံး) ဖြစ်ရပါမည်" }, 400);
    if (await this.state.storage.get("coupon:" + code)) return json({ error: "ဒီ Code ရှိပြီးသားပါ" }, 409);
    const type = ["percent", "fixed", "trial"].includes(b.type) ? b.type : null;
    if (!type) return json({ error: "type မမှန်ပါ" }, 400);
    const value = Math.max(0, parseInt(b.value, 10) || 0);
    if (!value) return json({ error: "တန်ဖိုး ထည့်ပါ" }, 400);
    if (type === "percent" && value > 100) return json({ error: "% က ၁၀၀ ထက် မကြီးရပါ" }, 400);
    const exp = b.expiresAt ? Date.parse(b.expiresAt) : NaN;
    const coupon = {
      code, type, value,
      maxUses: Math.max(0, parseInt(b.maxUses, 10) || 0),
      uses: 0, usedBy: {},
      expiresAt: isNaN(exp) ? null : exp + DAY - 1, // ရက်ပြည့်အထိ
      ref: clean(b.ref, 60), active: true, createdAt: Date.now(),
    };
    await this.state.storage.put("coupon:" + code, coupon);
    return json({ ok: true, code });
  },

  async couponDelete(b) {
    await this.state.storage.delete("coupon:" + normCode(b.code));
    return json({ ok: true });
  },

  // purpose: "order" (လျှော့ဈေး) | "trial" (Premium အစမ်း)
  async couponValidate(code, uid, purpose) {
    const c = code ? await this.state.storage.get("coupon:" + normCode(code)) : null;
    if (!c || !c.active) return { error: "Code မမှန်ပါ" };
    if (c.expiresAt && c.expiresAt < Date.now()) return { error: "Code သက်တမ်းကုန်သွားပါပြီ" };
    if (c.maxUses > 0 && (c.uses || 0) >= c.maxUses) return { error: "Code အသုံးပြုခွင့် ပြည့်သွားပါပြီ" };
    if (c.usedBy && c.usedBy[uid]) return { error: "ဒီ Code ကို သင် အသုံးပြုပြီးပါပြီ" };
    if (purpose === "order" && c.type === "trial") return { error: "ဒီ Code ကို Trial အတွက်သာ သုံးနိုင်ပါသည်" };
    if (purpose === "trial" && c.type !== "trial") return { error: "ဒီ Code က Order တွင်သာ သုံးနိုင်ပါသည်" };
    return { coupon: c };
  },

  async couponCheck(b) {
    const v = await this.couponValidate(b.code, b.uid, "order");
    if (v.error) return json({ error: v.error }, 400);
    const plan = await this.state.storage.get("plan:" + b.planId);
    if (!plan) return json({ error: "Plan မတွေ့ပါ" }, 400);
    const { planPrice, finalPrice } = applyDiscount(v.coupon, plan.price);
    return json({ ok: true, code: v.coupon.code, planPrice, finalPrice });
  },

  async couponRedeem(b) {
    const uid = clean(b.uid, 60);
    const u = await this.getUser(uid);
    if (!u) return json({ error: "Login လိုအပ်ပါတယ်" }, 401);
    if (u.trialUsed) return json({ error: "Trial ကို အသုံးပြုသူတစ်ယောက်လျှင် တစ်ကြိမ်သာ ယူနိုင်ပါသည်" }, 409);
    const v = await this.couponValidate(b.code, uid, "trial");
    if (v.error) return json({ error: v.error }, 400);
    const c = v.coupon;

    c.uses = (c.uses || 0) + 1;
    c.usedBy = c.usedBy || {};
    c.usedBy[uid] = Date.now();
    await this.state.storage.put("coupon:" + c.code, c);

    u.trialUsed = true;
    await this.state.storage.put("u:" + uid, u);
    await this.extendPremium(uid, c.value);
    return json({ ok: true, days: c.value });
  },

  // ===== Server Health → Telegram (Cloudflare Cron ၅ မိနစ်တစ်ခါ ခေါ်) =====
  async healthCheck() {
    this.pcache = null; // cache မသုံးဘဲ အသစ်စစ်
    const live = await this.panelStatus();
    const prev = (await this.state.storage.get("srvstate")) || {};
    const next = {};
    const lines = [];

    for (const s of live.servers) {
      if (!s.host) continue;
      const now = !s.up ? "offline" : !s.xray ? "xray_down" : "online";
      next[s.host] = now;
      const before = prev[s.host] || "online";
      if (now === before) continue;
      if (now === "online") lines.push("✅ <b>" + esc(s.host) + "</b> ပြန် Online ဖြစ်ပါပြီ");
      else if (now === "offline") lines.push("🔴 <b>" + esc(s.host) + "</b> OFFLINE ဖြစ်နေပါပြီ");
      else lines.push("🟠 <b>" + esc(s.host) + "</b> — Xray ရပ်နေပါတယ် (VPN မရနိုင်)");
    }

    if (lines.length) {
      const time = new Date().toLocaleString("my-MM", { timeZone: "Asia/Yangon" });
      await this.tgSend("⚠️ <b>TURBO VPN Server အခြေအနေ</b>\n" + lines.join("\n") + "\n\n🕒 " + time);
    }
    await this.state.storage.put("srvstate", next);
    return json({ ok: true, servers: live.servers.length, changes: lines.length });
  },

  async tgSend(text) {
    const token = this.env.TG_BOT_TOKEN, chat = this.env.TG_CHAT_ID;
    if (!token || !chat) return;
    try {
      await fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chat, text, parse_mode: "HTML", disable_web_page_preview: true }),
      });
    } catch (e) {}
  },
};
