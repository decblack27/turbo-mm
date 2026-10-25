import { json, getCookie } from "./common.js";
import { getRoom, handleAuth, serveImage, api } from "./api.js";
import { PAGE, ADMIN_PAGE } from "./page.js";

export { ChatRoom } from "./room.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path.startsWith("/auth/")) {
      const r = await handleAuth(request, env, url);
      if (r) return r;
    }

    if (path === "/ws") {
      if (request.headers.get("Upgrade") !== "websocket") return new Response("Expected WebSocket", { status: 426 });
      const sid = getCookie(request, "session");
      if (!sid) return new Response("Unauthorized", { status: 401 });
      const newReq = new Request("https://room/ws", request);
      newReq.headers.set("X-Session-Id", sid);
      return getRoom(env).fetch(newReq);
    }

    if (path.startsWith("/img/")) return serveImage(path.slice(5), env);

    if (path.startsWith("/api/")) {
      try { return await api(request, env, url); } catch (err) { return json({ error: "Server error" }, 500); }
    }

    const page = path === "/admin" ? ADMIN_PAGE : PAGE;
    return new Response(page, { headers: { "Content-Type": "text/html; charset=UTF-8" } });
  },
};