export const MAX_TITLE = 80;
export const MAX_PRICE = 40;
export const MAX_DESC = 1000;
export const MAX_CHAT = 500;
export const MAX_HISTORY = 100;
export const MAX_DM_HISTORY = 200;
export const MAX_PHOTO = 3 * 1024 * 1024;
export const MAX_REPORT_REASON = 500;
export const TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export function clean(v, max) { return String(v ?? "").trim().slice(0, max); }
export function json(o, s = 200) { return new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json; charset=UTF-8" } }); }
export function parseCookies(h) { const o = {}; if (!h) return o; h.split(";").forEach(c => { const i = c.indexOf("="); if (i < 0) return; o[c.slice(0, i).trim()] = c.slice(i + 1).trim(); }); return o; }
export function getCookie(req, name) { return parseCookies(req.headers.get("Cookie"))[name]; }

export const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
