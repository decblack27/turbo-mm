const MAX_TITLE = 80;
const MAX_PRICE = 40;
const MAX_DESC = 1000;
const MAX_CONTACT = 60;
const MAX_CHAT = 500;
const MAX_HISTORY = 100;
const MAX_DM_HISTORY = 200;
const MAX_PHOTO = 3 * 1024 * 1024;
const MAX_REPORT_REASON = 500;
const TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

const SITE = {
  name: "TURBO MM",
  tagline: "ရောင်းဝယ်ရေးနဲ့ အုပ်စုစကားပြောခန်း",
  home: {
    intro: "TURBO MM မှာ ပစ္စည်းရောင်းချချင်သူနဲ့ ဝယ်ချင်သူတွေ လွယ်လွယ်ကူကူ တွေ့ဆုံနိုင်ပါတယ်။ Google အကောင့်နဲ့ ဝင်ပြီး အရောင်းအဝယ် ပြုလုပ်နိုင်ပါတယ်။",
    features: [
      { title: "🛍 ကြော်ငြာများ", text: "User အားလုံးရဲ့ ရောင်းချထားတဲ့ ပစ္စည်းတွေကို ကြည့်ပါ။" },
      { title: "➕ ကြော်ငြာတင်ရန်", text: "ပစ္စည်းပုံ၊ ဈေးနှုန်း၊ ဆက်သွယ်ရန် အချက်အလက် ထည့်ပြီး တင်ပါ။" },
      { title: "💬 Group & DM", text: "Group ထဲ စကားပြောနိုင်၊ တခြားသူကို တိုက်ရိုက် DM ပို့နိုင်ပါတယ်။" }
    ]
  },
  rules: [
    "အတု ပစ္စည်းနဲ့ လိမ်လည်ရောင်းချမှု မပြုလုပ်ရပါ။",
    "ဈေးနှုန်းနဲ့ ပစ္စည်းအခြေအနေကို မှန်ကန်စွာ ဖော်ပြပါ။",
    "ငွေပေးချေမှုကို ဝယ်သူနဲ့ ရောင်းသူ တိုက်ရိုက် ညှိရပါမယ်။",
    "Group မှာ အကြမ်းဖက်စကား၊ စော်ကားစကား မသုံးရပါ။",
    "ပြဿနာတွေ့ရင် ⚠ Report ကို နှိပ်ပြီး Admin ကို အကြောင်းကြားပါ။"
  ],
  contact: {
    telegramChannel: "https://t.me/arsar2027",
    owner: "@turbomm750",
    ownerLink: "https://t.me/turbomm750",
    note: "မေးခွန်းရှိရင် Owner ကို Telegram မှာ တိုက်ရိုက် ဆက်သွယ်ပါ။"
  }
};

function clean(v, max) { return String(v ?? "").trim().slice(0, max); }
function json(o, s = 200) { return new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json; charset=UTF-8" } }); }
function parseCookies(h) { const o = {}; if (!h) return o; h.split(";").forEach(c => { const i = c.indexOf("="); if (i < 0) return; o[c.slice(0, i).trim()] = c.slice(i + 1).trim(); }); return o; }
function getCookie(req, name) { return parseCookies(req.headers.get("Cookie"))[name]; }

const HTML = `<!DOCTYPE html>
<html lang="my">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>TURBO MM</title>
<style>
:root{--gold:#f5c542;--gold2:#d9a521;--bg:#0f0f13;--panel:#16161c;--card:#1e1e26;--line:#2e2e3a;--text:#eaeaf0;--muted:#8b8b9a;--them:#252530;--ok:#4ade80;--warn:#fbbf24;--danger:#f87171;--blue:#60a5fa}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:"Segoe UI",system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;display:flex;flex-direction:column;overflow-x:hidden}
.hidden{display:none!important}
a{color:var(--blue);text-decoration:none}
button{font-family:inherit}

/* Layout */
.app-container{display:flex;flex:1;height:100vh;overflow:hidden}
.sidebar{width:240px;background:var(--panel);border-right:1px solid var(--line);display:flex;flex-direction:column;padding:20px 0;flex-shrink:0;z-index:10}
.main-content{flex:1;display:flex;flex-direction:column;overflow-y:auto;position:relative}

/* Desktop Sidebar */
@media(max-width:768px){
  .app-container{flex-direction:column;height:auto;padding-bottom:70px}
  .sidebar{display:none}
}
.brand{padding:0 20px 20px;font-weight:800;letter-spacing:2px;color:var(--gold);font-size:20px;border-bottom:1px solid var(--line);margin-bottom:15px}
.brand small{display:block;font-size:11px;color:var(--muted);letter-spacing:1px;margin-top:4px}
.nav-links{display:flex;flex-direction:column;gap:4px;padding:0 10px}
.nav-links button{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:10px;border:none;background:transparent;color:var(--muted);font-size:15px;font-weight:500;cursor:pointer;text-align:left;transition:0.2s}
.nav-links button:hover{background:rgba(255,255,255,0.05);color:var(--text)}
.nav-links button.on{background:rgba(245,197,66,0.1);color:var(--gold);font-weight:700}
.sidebar-footer{margin-top:auto;padding:20px;border-top:1px solid var(--line);font-size:12px;color:var(--muted);text-align:center}

/* Header */
header{position:sticky;top:0;z-index:5;display:flex;align-items:center;justify-content:space-between;padding:14px 20px;background:rgba(22,22,28,0.85);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.header-title{font-size:18px;font-weight:700}
.user-badge{display:flex;align-items:center;gap:10px;background:var(--card);padding:4px 12px 4px 4px;border-radius:30px;border:1px solid var(--line);cursor:pointer;transition:0.2s}
.user-badge:hover{border-color:var(--gold)}
.avatar{width:32px;height:32px;border-radius:50%;object-fit:cover;background:var(--them)}
.avatar-text{width:32px;height:32px;border-radius:50%;background:var(--gold);color:#000;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px}
.user-name{font-size:14px;font-weight:600;max-width:100px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

/* Mobile Bottom Nav */
.bottom-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:var(--panel);border-top:1px solid var(--line);z-index:50;padding:5px 0;padding-bottom:env(safe-area-inset-bottom,5px);justify-content:space-around;overflow-x:auto}
@media(max-width:768px){
  .bottom-nav{display:flex}
}
.bottom-nav button{display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;color:var(--muted);font-size:11px;padding:8px 12px;min-width:65px;cursor:pointer}
.bottom-nav button.on{color:var(--gold)}
.bottom-nav button svg{width:22px;height:22px;fill:currentColor}

/* Main Content Area */
main{flex:1;padding:24px;max-width:900px;margin:0 auto;width:100%}
.section-title{font-size:22px;font-weight:800;margin-bottom:20px;color:var(--gold);display:flex;align-items:center;gap:10px}
.grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fill,minmax(280px,1fr))}

/* Cards & UI */
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden;display:flex;flex-direction:column;transition:transform 0.2s,box-shadow 0.2s}
.card:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,0.3);border-color:var(--line)}
.card img{width:100%;aspect-ratio:4/3;object-fit:cover;background:#111}
.body{padding:16px;display:flex;flex-direction:column;gap:8px;flex:1}
.title{font-weight:700;font-size:16px;line-height:1.4}
.price{color:var(--gold);font-weight:800;font-size:18px}
.desc{color:var(--muted);font-size:13.5px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.seller{font-size:12.5px;color:var(--muted);display:flex;align-items:center;gap:6px}
.tag{display:inline-block;font-size:12px;padding:4px 10px;border-radius:999px;font-weight:700;align-self:flex-start}
.tag.pending{background:rgba(251,191,36,0.15);color:var(--warn)}
.tag.approved{background:rgba(74,222,128,0.15);color:var(--ok)}
.tag.rejected{background:rgba(248,113,113,0.15);color:var(--danger)}
.tag.sold{background:rgba(139,139,154,0.2);color:#ccc}
.btn{padding:10px 16px;border-radius:10px;background:var(--them);color:var(--text);border:1px solid var(--line);cursor:pointer;font-size:14px;font-weight:600;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:0.2s}
.btn:hover{background:var(--line)}
.btn.gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#000;border:none}
.btn.red{color:var(--danger);border-color:rgba(248,113,113,0.3)}
.btn.green{color:var(--ok);border-color:rgba(74,222,128,0.3)}
.btn:disabled{opacity:0.5;cursor:not-allowed}
.row-btns{display:flex;gap:8px;flex-wrap:wrap;margin-top:auto;padding-top:10px}
.contact{display:block;text-align:center;padding:12px;border-radius:10px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#000;font-weight:700;margin-top:10px}

/* Forms */
form.post{display:flex;flex-direction:column;gap:16px;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:24px}
label{font-size:14px;color:var(--muted);display:flex;flex-direction:column;gap:8px;font-weight:600}
input,textarea{width:100%;padding:14px 16px;border-radius:12px;border:1px solid var(--line);background:var(--bg);color:var(--text);font-size:15px;font-family:inherit;outline:none;transition:0.2s}
input[type=file]{padding:12px}
textarea{min-height:100px;resize:vertical}
input:focus,textarea:focus{border-color:var(--gold);box-shadow:0 0 0 2px rgba(245,197,66,0.2)}
.msg{font-size:14px;text-align:center;font-weight:600}
.msg.err{color:var(--danger)}
.msg.ok{color:var(--ok)}
.empty{text-align:center;color:var(--muted);padding:60px 20px;font-size:15px;background:var(--panel);border-radius:16px;border:1px dashed var(--line)}

/* Profile */
.profile-card{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:30px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:15px;margin-bottom:24px}
.profile-avatar{width:100px;height:100px;border-radius:50%;object-fit:cover;border:4px solid var(--panel);box-shadow:0 4px 15px rgba(0,0,0,0.5)}
.profile-name{font-size:24px;font-weight:800}
.profile-email{color:var(--muted);font-size:15px}
.stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:15px;width:100%;max-width:400px;margin-top:20px}
.stat-box{background:var(--panel);padding:15px;border-radius:12px;border:1px solid var(--line)}
.stat-val{font-size:24px;font-weight:800;color:var(--gold)}
.stat-lbl{font-size:13px;color:var(--muted);margin-top:4px}

/* Chat */
.chatbox{display:flex;flex-direction:column;background:var(--panel);border:1px solid var(--line);border-radius:16px;overflow:hidden;height:calc(100vh - 180px);min-height:400px}
@media(max-width:768px){.chatbox{height:calc(100vh - 200px)}}
.chatbar{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid var(--line);background:var(--card)}
.chatadmin{display:flex;gap:8px;flex-wrap:wrap;padding:10px 16px;background:rgba(245,197,66,0.1);border-bottom:1px solid rgba(245,197,66,0.2)}
.chatadmin button{padding:6px 12px;border-radius:6px;border:1px solid rgba(245,197,66,0.3);background:transparent;color:var(--gold);font-size:13px;cursor:pointer}
#chatMsgs,#dmMsgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:4px;background:var(--bg)}
.row{display:flex;margin:4px 0}
.row.mine{justify-content:flex-end}
.bubble{position:relative;max-width:80%;padding:10px 14px;border-radius:16px;background:var(--them);border:1px solid var(--line);box-shadow:0 1px 2px rgba(0,0,0,0.1)}
.row.them .bubble{border-bottom-left-radius:4px}
.row.mine .bubble{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#000;border:none;border-bottom-right-radius:4px}
.who{font-size:12px;font-weight:700;color:var(--gold);margin-bottom:4px}
.badge{font-size:10px;background:var(--gold);color:#000;padding:1px 6px;border-radius:4px;margin-left:6px}
.text{white-space:pre-wrap;word-break:break-word;line-height:1.5;font-size:15px}
.meta{font-size:10px;opacity:0.6;text-align:right;margin-top:4px}
.del{position:absolute;top:-8px;right:-8px;width:24px;height:24px;border-radius:50%;border:none;background:var(--danger);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center}
.chat-img{max-width:100%;border-radius:10px;display:block;margin:6px 0;cursor:pointer}
form.chatform{display:flex;gap:8px;align-items:center;padding:12px;background:var(--card);border-top:1px solid var(--line)}
.icon-btn{display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;background:var(--panel);border:1px solid var(--line);cursor:pointer;font-size:20px}
#chatText,#dmText{flex:1;padding:12px 16px;border-radius:22px}
#chatSend,#dmSend{width:44px;height:44px;border-radius:50%;border:none;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#000;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center}

/* Conv List */
.conv-item{display:flex;gap:12px;padding:16px;background:var(--card);border:1px solid var(--line);border-radius:14px;margin-bottom:10px;cursor:pointer;align-items:center;transition:0.2s}
.conv-item:hover{background:var(--panel);border-color:var(--gold)}
.conv-info{flex:1;min-width:0}
.conv-name{font-weight:700;font-size:15px}
.conv-last{color:var(--muted);font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:4px}

/* Modal */
#modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.8);backdrop-filter:blur(5px);align-items:center;justify-content:center;padding:20px;z-index:100}
#modal .box{width:100%;max-width:380px;background:var(--card);border:1px solid var(--line);border-radius:20px;padding:30px;text-align:center;display:flex;flex-direction:column;gap:16px}
#modal h2{margin:0;color:var(--gold);letter-spacing:2px}
#modal p{color:var(--muted);font-size:14px;line-height:1.6}
.gbtn{text-decoration:none;padding:14px;border-radius:12px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#000;font-weight:700;display:flex;align-items:center;justify-content:center;gap:10px;font-size:16px}

/* Admin */
.report-item{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px;margin-bottom:10px}
</style>
</head>
<body>

<div class="app-container">
  <!-- Desktop Sidebar -->
  <aside class="sidebar">
    <div class="brand">TURBO MM<small>Marketplace</small></div>
    <div class="nav-links">
      <button data-tab="home" class="on">🏠 ပင်မ</button>
      <button data-tab="shop">🛍 ကြော်ငြာများ</button>
      <button data-tab="sell">➕ ကြော်ငြာတင်မည်</button>
      <button data-tab="mine">📦 ကျွန်ုပ်၏ ကြော်ငြာ</button>
      <button data-tab="messages">💌 Messages</button>
      <button data-tab="group">💬 Group Chat</button>
      <button data-tab="profile">👤 Profile</button>
      <button data-tab="rules">📜 စည်းကမ်း</button>
      <button data-tab="admin" id="adminTabBtn" class="hidden">🛡 Admin</button>
    </div>
    <div class="sidebar-footer">
      <div><a href="/auth/logout" style="color:var(--danger)">Logout</a></div>
    </div>
  </aside>

  <!-- Main Content -->
  <div class="main-content">
    <header>
      <div class="header-title" id="pageTitle">ပင်မ</div>
      <div class="user-badge" onclick="showTab('profile')">
        <div id="headerAvatar"></div>
        <div class="user-name" id="headerName">Loading...</div>
      </div>
    </header>

    <main>
      <section id="tab-home">
        <div style="text-align:center;padding:40px 20px;">
          <h1 style="font-size:36px;color:var(--gold);margin-bottom:10px;">TURBO MM</h1>
          <p style="color:var(--muted);font-size:16px;max-width:500px;margin:0 auto 30px;line-height:1.6;" id="homeIntro"></p>
          <div class="grid" id="homeFeatures" style="max-width:800px;margin:0 auto;"></div>
        </div>
      </section>

      <section id="tab-shop" class="hidden">
        <div class="section-title">🛍 ကြော်ငြာများ</div>
        <div class="grid" id="shopGrid"></div>
        <div id="shopEmpty" class="empty hidden">ကြော်ငြာ မရှိသေးပါ</div>
      </section>

      <section id="tab-sell" class="hidden">
        <div class="section-title">➕ ကြော်ငြာအသစ်တင်ရန်</div>
        <form class="post" id="postForm">
          <label>ပစ္စည်း / ဝန်ဆောင်မှု အမည်<input name="title" maxlength="80" required></label>
          <label>ဈေးနှုန်း<input name="price" maxlength="40" placeholder="ဥပမာ 15,000 ကျပ်" required></label>
          <label>အကြောင်းအရာ<textarea name="description" maxlength="1000" placeholder="အခြေအနေ၊ အရွယ်အစား စသည်"></textarea></label>
          <label>ဆက်သွယ်ရန်<input name="contact" maxlength="60" placeholder="@username သို့ 09xxxxxxxxx" required></label>
          <label>ပစ္စည်းပုံ (JPG / PNG / WEBP, 3MB အများဆုံး)
            <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" required>
          </label>
          <button class="btn gold" type="submit" id="postBtn" style="padding:16px;font-size:16px;">တင်မည်</button>
          <div class="msg" id="postMsg"></div>
        </form>
      </section>

      <section id="tab-mine" class="hidden">
        <div class="section-title">📦 ကျွန်ုပ်၏ ကြော်ငြာများ</div>
        <div class="grid" id="mineGrid"></div>
        <div id="mineEmpty" class="empty hidden">သင့်ကြော်ငြာ မရှိသေးပါ</div>
      </section>

      <section id="tab-messages" class="hidden">
        <div class="section-title">💌 Messages</div>
        <div id="convListBox"></div>
        <div id="dmView" class="hidden">
          <div class="chatbox">
            <div class="chatbar">
              <button class="btn" id="dmBack" type="button" style="padding:6px 12px;">← နောက်သို့</button>
              <span id="dmWith" class="pill" style="font-weight:700;"></span>
            </div>
            <div id="dmMsgs"></div>
            <form class="chatform" id="dmForm">
              <label class="icon-btn" for="dmPhoto">📎</label>
              <input type="file" id="dmPhoto" accept="image/*" style="display:none">
              <input id="dmText" maxlength="500" placeholder="စာရိုက်ပါ..." autocomplete="off">
              <button id="dmSend" type="submit">➤</button>
            </form>
          </div>
        </div>
      </section>

      <section id="tab-group" class="hidden">
        <div class="section-title">💬 Group Chat</div>
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
          <div id="chatLockMsg" class="msg err hidden" style="padding:10px;background:rgba(248,113,113,0.1);">🔒 Admin က chat ကို ယာယီပိတ်ထားပါတယ်</div>
          <form class="chatform" id="chatForm">
            <label class="icon-btn" for="chatPhoto">📎</label>
            <input type="file" id="chatPhoto" accept="image/*" style="display:none">
            <input id="chatText" maxlength="500" placeholder="စာရိုက်ပါ..." autocomplete="off" disabled>
            <button id="chatSend" type="submit" disabled>➤</button>
          </form>
        </div>
      </section>

      <section id="tab-profile" class="hidden">
        <div class="profile-card">
          <div id="profileAvatarBox"></div>
          <div>
            <div class="profile-name" id="profileName">Loading...</div>
            <div class="profile-email" id="profileEmail"></div>
          </div>
          <div class="stats-grid">
            <div class="stat-box">
              <div class="stat-val" id="statListings">0</div>
              <div class="stat-lbl">ကြော်ငြာများ</div>
            </div>
            <div class="stat-box">
              <div class="stat-val" id="statStatus" style="color:var(--ok)">Active</div>
              <div class="stat-lbl">အကောင့်အခြေအနေ</div>
            </div>
          </div>
          <a href="/auth/logout" class="btn red" style="width:100%;margin-top:10px;">Logout ထွက်မည်</a>
        </div>
      </section>

      <section id="tab-rules" class="hidden">
        <div class="section-title">📜 စည်းကမ်းချက်များ</div>
        <div id="rulesBox"></div>
      </section>

      <section id="tab-admin" class="hidden">
        <div class="section-title">🛡 Admin Panel</div>
        <div class="adminbox" id="adminLogin" style="background:var(--card);padding:20px;border-radius:16px;margin-bottom:20px;">
          <label>Admin Key
            <input id="adminKeyInput" type="password" placeholder="Enter Admin key" autocomplete="off">
          </label>
          <button class="btn gold" id="adminLoginBtn" type="button" style="margin-top:10px;width:100%;">ဝင်မည်</button>
          <div class="msg err" id="adminMsg" style="margin-top:10px;"></div>
        </div>
        <div id="adminPanel" class="hidden">
          <div class="row-btns" style="margin-bottom:20px">
            <button class="btn" id="adminRefresh" type="button">🔄 Refresh</button>
            <button class="btn red" id="adminLogout" type="button">Logout</button>
          </div>
          
          <h3 style="margin-bottom:15px;color:var(--gold);">Listings</h3>
          <div class="grid" id="adminGrid"></div>
          <div id="adminEmpty" class="empty hidden">ကြော်ငြာ မရှိသေးပါ</div>
          
          <h3 style="margin:30px 0 15px;color:var(--danger);">Reports</h3>
          <div id="adminReportsList"></div>
          <div id="adminReportsEmpty" class="empty hidden">Report မရှိပါ</div>
        </div>
      </section>
    </main>
  </div>
</div>

<!-- Mobile Bottom Nav -->
<nav class="bottom-nav">
  <button data-tab="home" class="on">🏠<span>ပင်မ</span></button>
  <button data-tab="shop">🛍<span>ဈေးကွက်</span></button>
  <button data-tab="sell">➕<span>ရောင်းမည်</span></button>
  <button data-tab="messages">💌<span>Messages</span></button>
  <button data-tab="profile">👤<span>Profile</span></button>
</nav>

<div id="modal">
  <div class="box">
    <h2>TURBO MM</h2>
    <p>ဆက်လုပ်ဆောင်ရန် Google အကောင့်နဲ့ ဝင်ပါ</p>
    <a class="gbtn" href="/auth/google">
      <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
      Google အကောင့်နဲ့ ဝင်မည်
    </a>
    <div class="msg err" id="loginMsg"></div>
  </div>
</div>

<script>
var SITE = __SITE__;
var $ = function(id){return document.getElementById(id);};
var STATUS_TEXT = { pending:"⏳ စောင့်ဆဲ", approved:"✅ ပြသနေသည်", rejected:"❌ ပယ်ချခံရ", sold:"🛒 ရောင်းပြီး" };

var myUid = null, myName = "", myEmail = "", myPicture = "";
var adminKey = sessionStorage.getItem("tmm_akey") || "";
var chatAdmin = false, chatLocked = false, chatJoined = false, chatBanned = false;
var chatWs = null;
var currentDm = null;

var PAGE_TITLES = {
  home: "ပင်မ", shop: "ဈေးကွက်", sell: "ရောင်းချမည်", mine: "ကျွန်ုပ်၏ ကြော်ငြာ",
  messages: "စာများ", group: "Group Chat", profile: "ကိုယ်ရေးအချက်အလက်",
  rules: "စည်းကမ်းချက်များ", admin: "Admin Panel"
};

function div(cls, text){var d=document.createElement("div");d.className=cls;if(text!==undefined)d.textContent=text;return d;}
function btn(text, cls, fn){var b=document.createElement("button");b.className=cls;b.textContent=text;b.type="button";b.onclick=fn;return b;}
function linkBtn(text, href){var a=document.createElement("a");a.className="contact";a.href=href;a.target="_blank";a.rel="noopener";a.textContent=text;return a;}

function api(path, opts){
  opts = opts || {};
  var init = { method: opts.method || "GET", headers: {}, credentials: "same-origin" };
  if(adminKey && path.indexOf("/api/admin/")===0) init.headers["X-Admin-Key"] = adminKey;
  if(opts.json){ init.headers["Content-Type"]="application/json"; init.body=JSON.stringify(opts.json); }
  if(opts.form) init.body = opts.form;
  return fetch(path, init).then(function(r){
    return r.json().catch(function(){return {};}).then(function(d){ d._ok=r.ok; d._status=r.status; return d; });
  });
}

function timeStr(t){ return new Date(t).toLocaleTimeString("my-MM",{hour:"2-digit",minute:"2-digit"}); }

function setUserUI(){
  if(myPicture) {
    $("headerAvatar").innerHTML = '<img src="'+myPicture+'" class="avatar" alt="me">';
    $("profileAvatarBox").innerHTML = '<img src="'+myPicture+'" class="profile-avatar" alt="me">';
  } else {
    var init = (myName||"U").charAt(0).toUpperCase();
    $("headerAvatar").innerHTML = '<div class="avatar-text">'+init+'</div>';
    $("profileAvatarBox").innerHTML = '<div class="avatar-text" style="width:100px;height:100px;font-size:40px;">'+init+'</div>';
  }
  $("headerName").textContent = myName || "User";
  $("profileName").textContent = myName || "User";
  $("profileEmail").textContent = myEmail || "";
}

function showTab(name){
  document.querySelectorAll('.nav-links button, .bottom-nav button').forEach(function(b){ 
    b.classList.toggle("on", b.getAttribute("data-tab")===name); 
  });
  document.querySelectorAll("main > section").forEach(function(s){ 
    s.classList.toggle("hidden", s.id!=="tab-"+name); 
  });
  $("pageTitle").textContent = PAGE_TITLES[name] || "TURBO MM";
  
  if(name==="shop") loadShop();
  if(name==="mine") { loadMine(); }
  if(name==="admin") loadAdmin();
  if(name==="group") chatScroll();
  if(name==="messages") { if(currentDm) showDmView(); else loadConversations(); }
  if(name==="profile") loadProfileStats();
  window.scrollTo(0,0);
}

function renderHome(){
  $("homeIntro").textContent = SITE.home.intro;
  var feats = $("homeFeatures"); feats.innerHTML = "";
  SITE.home.features.forEach(function(f){
    var c = document.createElement("div"); c.className = "card";
    var b = document.createElement("div"); b.className = "body"; b.style.textAlign = "center";
    b.appendChild(div("title", f.title)); 
    b.appendChild(div("desc", f.text));
    c.appendChild(b); feats.appendChild(c);
  });
}

function loadProfileStats(){
  api("/api/mine").then(function(d){
    if(d.listings) $("statListings").textContent = d.listings.length;
  });
}

function renderRules(){
  var box = $("rulesBox"); box.innerHTML="";
  SITE.rules.forEach(function(r,i){
    var row = document.createElement("div"); row.className="rule";
    row.style.display="flex"; row.style.gap="15px"; row.style.background="var(--card)"; row.style.padding="20px"; row.style.borderRadius="12px"; row.style.marginBottom="12px"; row.style.border="1px solid var(--line)";
    var num = div("tag", String(i+1)); num.style.background="var(--gold)"; num.style.color="#000"; num.style.width="28px"; num.style.height="28px"; num.style.display="flex"; num.style.alignItems="center"; num.style.justifyContent="center"; num.style.borderRadius="50%";
    row.appendChild(num);
    var txt = div("text", r); txt.style.color="var(--text)"; txt.style.fontSize="15px";
    row.appendChild(txt);
    box.appendChild(row);
  });
}

function contactEl(text){
  var t = String(text||"").trim();
  if(/^@[A-Za-z0-9_]{3,}$/.test(t)) return linkBtn("Telegram "+t+" ကို စာပို့မည်", "https://t.me/"+t.slice(1));
  if(/^[+]?[0-9 ]{6,}$/.test(t)){ 
    var p=document.createElement("a"); p.className="contact"; p.href="tel:"+t.replace(/ /g,""); p.textContent="📞 "+t+" ကို ဖုန်းခေါ်မည်"; return p; 
  }
  var p = div("contact", "ဆက်သွယ်ရန်: "+t);
  p.style.background = "var(--them)";
  p.style.color = "var(--text)";
  return p;
}

function cardEl(l, opt){
  opt = opt || {};
  var card = document.createElement("div"); card.className = "card";
  var img = document.createElement("img");
  img.loading = "lazy"; img.alt = l.title; img.src = "/img/" + l.photoKey;
  card.appendChild(img);
  var body = document.createElement("div"); body.className = "body";
  
  if(opt.status) body.appendChild(div("tag " + l.status, STATUS_TEXT[l.status] || l.status));
  body.appendChild(div("title", l.title));
  body.appendChild(div("price", l.price));
  if(l.description) body.appendChild(div("desc", l.description));
  
  var seller = div("seller", "👤 " + l.ownerName + " · " + new Date(l.createdAt).toLocaleDateString("my-MM"));
  body.appendChild(seller);

  if(l.buyerName) {
    var buyer = div("seller", "🛒 ဝယ်သူ: " + l.buyerName);
    buyer.style.color = "var(--ok)";
    body.appendChild(buyer);
  }
  
  if(opt.contact) body.appendChild(contactEl(l.contact));
  card.appendChild(body);
  return card;
}

function loadShop(){
  api("/api/listings").then(function(d){
    var g=$("shopGrid"); g.innerHTML="";
    var list = d.listings || [];
    $("shopEmpty").classList.toggle("hidden", list.length>0);
    list.forEach(function(l){
      var c = cardEl(l, { contact: true });
      var row = document.createElement("div"); row.className = "row-btns";
      if(l.status === "approved" && l.ownerUid !== myUid){
        row.appendChild(btn("🛒 ဝယ်မည်","btn gold",function(){buyListing(l);}));
        row.appendChild(btn("💌 စာပို့","btn",function(){openDM(l.ownerUid, l.ownerName);}));
      }
      if(l.ownerUid !== myUid){
        row.appendChild(btn("⚠ Report","btn red",function(){reportItem("listing", l.id, l.title);}));
      }
      c.querySelector(".body").appendChild(row);
      g.appendChild(c);
    });
  });
}

function loadMine(){
  api("/api/mine").then(function(d){
    var g=$("mineGrid"); g.innerHTML="";
    var list=d.listings||[];
    $("mineEmpty").classList.toggle("hidden", list.length>0);
    list.forEach(function(l){
      var c = cardEl(l, { status:true });
      var row = document.createElement("div"); row.className="row-btns";
      if(l.status === "sold") row.appendChild(btn("↩ ပြန်ဖွင့်","btn",function(){returnSale(l.id);}));
      row.appendChild(btn("🗑 ဖျက်မည်","btn red",function(){
        if(!confirm("ဖျက်မလား?")) return;
        api("/api/listing/delete", { method:"POST", json:{ id:l.id } }).then(loadMine);
      }));
      c.querySelector(".body").appendChild(row);
      g.appendChild(c);
    });
  });
}

function buyListing(l){
  if(!confirm("「"+l.title+"」 ကို ဝယ်မှာ သေချာပါသလား?")) return;
  api("/api/listing/buy", { method:"POST", json:{ id:l.id } }).then(function(d){
    if(d._ok){ alert("ဝယ်ယူပြီးပါပြီ။ ရောင်းသူနဲ့ ဆက်သွယ်ပါ။"); loadShop(); }
    else alert(d.error || "မအောင်မြင်ပါ");
  });
}

function returnSale(id){
  if(!confirm("ပြန်ဖွင့်မလား?")) return;
  api("/api/listing/return", { method:"POST", json:{ id:id } }).then(loadMine);
}

function reportItem(targetType, targetId, label){
  var reason = prompt("Report အကြောင်းအရာ ("+label+"):");
  if(!reason || !reason.trim()) return;
  api("/api/report", { method:"POST", json:{ targetType:targetType, targetId:targetId, reason:reason.trim() } }).then(function(d){
    alert(d._ok ? "Report ပို့ပြီးပါပြီ" : (d.error || "မအောင်မြင်ပါ"));
  });
}

// Admin
function loadAdmin(){
  if(!adminKey){ $("adminLogin").classList.remove("hidden"); $("adminPanel").classList.add("hidden"); return; }
  api("/api/admin/listings").then(function(d){
    if(d._status === 401){
      adminKey = ""; sessionStorage.removeItem("tmm_akey");
      $("adminMsg").textContent = d.error || "Admin key မှားနေပါတယ်";
      $("adminLogin").classList.remove("hidden"); $("adminPanel").classList.add("hidden"); return;
    }
    $("adminLogin").classList.add("hidden"); $("adminPanel").classList.remove("hidden");
    var g=$("adminGrid"); g.innerHTML="";
    var list=d.listings||[];
    $("adminEmpty").classList.toggle("hidden", list.length>0);
    list.forEach(function(l){
      var c = cardEl(l, { status:true, contact:true });
      var row = document.createElement("div"); row.className="row-btns";
      row.appendChild(btn("✅ အတည်ပြု","btn green",function(){ setStatus(l.id,"approved"); }));
      row.appendChild(btn("❌ ပယ်ချ","btn",function(){ setStatus(l.id,"rejected"); }));
      row.appendChild(btn("🗑 ဖျက်","btn red",function(){
        if(!confirm("အပြီးဖျက်မလား?")) return;
        api("/api/admin/delete", { method:"POST", json:{ id:l.id } }).then(loadAdmin);
      }));
      c.querySelector(".body").appendChild(row);
      g.appendChild(c);
    });
  });
  loadReports();
}

function setStatus(id, status){
  api("/api/admin/status", { method:"POST", json:{ id:id, status:status } }).then(loadAdmin);
}

function loadReports(){
  api("/api/admin/reports").then(function(d){
    if(!d._ok) return;
    var box=$("adminReportsList"); box.innerHTML="";
    var list=d.reports||[];
    $("adminReportsEmpty").classList.toggle("hidden", list.length>0);
    list.forEach(function(r){
      var el=document.createElement("div"); el.className="report-item";
      el.appendChild(div("seller", r.targetType + " · " + r.targetId));
      el.appendChild(div("text", r.reason));
      el.appendChild(div("seller", "by " + (r.byName || r.byUid) + " · " + new Date(r.time).toLocaleString("my-MM") + (r.resolved ? " · ✅ resolved" : "")));
      if(!r.resolved){
        var row=document.createElement("div"); row.className="row-btns";
        row.appendChild(btn("✅ Resolve","btn green",function(){
          api("/api/admin/report-resolve",{method:"POST",json:{id:r.id}}).then(loadReports);
        }));
        el.appendChild(row);
      }
      box.appendChild(el);
    });
  });
}

// Chat WS
function setChatStatus(text, cls){ var el=$("chatStatus"); el.textContent=text; el.className="pill "+(cls||""); }
function chatScroll(){ var c=$("chatMsgs"); if(c) c.scrollTop=c.scrollHeight; }

function renderChatMsg(m){
  var mine = m.uid === myUid;
  var row = document.createElement("div");
  row.className = "row " + (mine ? "mine" : "them");
  if(m.id) row.setAttribute("data-id", m.id);
  var bubble = document.createElement("div"); bubble.className = "bubble";
  if(!mine){
    var who = document.createElement("div"); who.className = "who"; who.textContent = m.name;
    if(m.admin){ var b=document.createElement("span"); b.className="badge"; b.textContent="ADMIN"; who.appendChild(b); }
    bubble.appendChild(who);
  }
  if(m.photoKey){
    var img = document.createElement("img"); img.src = "/img/" + m.photoKey; img.className="chat-img";
    img.onclick = function(){ window.open("/img/" + m.photoKey, "_blank"); };
    bubble.appendChild(img);
  }
  if(m.text) bubble.appendChild(div("text", m.text));
  bubble.appendChild(div("meta", timeStr(m.time)));
  if(chatAdmin && m.id){
    bubble.appendChild(btn("✕","del",function(){
      if(confirm("ဒီစာကို ဖျက်မလား?")) chatAction("delete",{id:m.id});
    }));
  }
  row.appendChild(bubble);
  return row;
}

function renderDmMsg(m){
  var mine = m.from === myUid;
  var row = document.createElement("div"); row.className = "row " + (mine?"mine":"them");
  var bubble = document.createElement("div"); bubble.className = "bubble";
  if(!mine){ bubble.appendChild(div("who", m.fromName)); }
  if(m.photoKey){
    var img = document.createElement("img"); img.src = "/img/" + m.photoKey; img.className="chat-img";
    img.onclick = function(){ window.open("/img/" + m.photoKey, "_blank"); };
    bubble.appendChild(img);
  }
  if(m.text) bubble.appendChild(div("text", m.text));
  bubble.appendChild(div("meta", timeStr(m.time)));
  row.appendChild(bubble);
  return row;
}

function updateChatInput(){
  var blocked = chatLocked && !chatAdmin;
  $("chatLockMsg").classList.toggle("hidden", !blocked);
  var off = !chatJoined || blocked;
  $("chatText").disabled = off; $("chatSend").disabled = off;
}

function chatSend(obj){ if(chatWs && chatWs.readyState === 1) chatWs.send(JSON.stringify(obj)); }
function chatAction(action, extra){ var o={type:"admin", action:action}; if(extra) for(var k in extra) o[k]=extra[k]; chatSend(o); }

function chatConnect(){
  if(chatBanned) return;
  if(chatWs){ var old=chatWs; chatWs=null; try{old.close();}catch(e){} }
  var proto = location.protocol === "https:" ? "wss://" : "ws://";
  var s = new WebSocket(proto + location.host + "/ws");
  chatWs = s; chatJoined = false; updateChatInput();
  setChatStatus("⏳ ချိတ်ဆက်နေသည်...", "");
  s.onopen = function(){ s.send(JSON.stringify({ type:"join", adminKey:adminKey })); };
  s.onmessage = function(e){ if(s !== chatWs) return; chatOnMessage(JSON.parse(e.data)); };
  s.onclose = function(){
    if(s !== chatWs) return;
    chatJoined = false; updateChatInput();
    if(chatBanned){ setChatStatus("🔴 ပြတ်သွားပါပြီ","bad"); return; }
    setChatStatus("🔴 ပြန်ချိတ်နေသည်...","bad");
    setTimeout(chatConnect, 2000);
  };
}

function chatOnMessage(d){
  var box = $("chatMsgs");
  if(!box) return;
  
  if(d.type === "joined"){
    chatJoined = true; chatAdmin = !!d.admin; chatLocked = !!d.locked;
    if(adminKey && !chatAdmin){
      adminKey = ""; sessionStorage.removeItem("tmm_akey");
      $("adminMsg").textContent = "Admin key မှားနေပါတယ်";
    }
    setChatStatus("🟢 ချိတ်ဆက်ပြီး","ok");
    $("chatAdminRow").classList.toggle("hidden", !chatAdmin);
    $("cLock").textContent = chatLocked ? "🔓 ပြန်ဖွင့်" : "🔒 ပိတ်";
    updateChatInput();
  } else if(d.type === "history"){
    box.innerHTML = "";
    d.messages.forEach(function(m){ box.appendChild(renderChatMsg(m)); });
    chatScroll();
  } else if(d.type === "chat"){
    box.appendChild(renderChatMsg(d)); chatScroll();
  } else if(d.type === "dm"){
    if(currentDm && (currentDm.uid === d.from || currentDm.uid === d.to)){
      if(!$("dmView").classList.contains("hidden")){
        $("dmMsgs").appendChild(renderDmMsg(d));
        $("dmMsgs").scrollTop = $("dmMsgs").scrollHeight;
      }
    }
  } else if(d.type === "deleted"){
    var el = box.querySelector('[data-id="'+d.id+'"]'); if(el) el.remove();
  } else if(d.type === "cleared"){
    box.innerHTML = ""; 
  } else if(d.type === "locked"){
    chatLocked = !!d.locked;
    $("cLock").textContent = chatLocked ? "🔓 ပြန်ဖွင့်" : "🔒 ပိတ်";
    updateChatInput();
  } else if(d.type === "online"){
    $("chatOnline").textContent = "Online: " + d.count;
  } else if(d.type === "notice"){
    box.appendChild(div("sys", d.text)); chatScroll();
  } else if(d.type === "error"){
    box.appendChild(div("sys err", "⚠ " + d.text)); chatScroll();
  } else if(d.type === "kicked"){
    chatBanned = true; chatJoined = false; updateChatInput();
    setChatStatus("🔴 ထုတ်ခံရပါတယ်","bad");
    box.appendChild(div("sys err", d.text)); chatScroll();
  }
}

// DM
function loadConversations(){
  $("convListBox").classList.remove("hidden");
  $("dmView").classList.add("hidden");
  $("convListBox").innerHTML = "<div class='empty'>Loading...</div>";
  api("/api/dm/conversations").then(function(d){
    var box = $("convListBox"); box.innerHTML = "";
    var list = d.conversations || [];
    if(!list.length){ box.innerHTML = "<div class='empty'>Conversation မရှိသေးပါ။ Listing တစ်ခုကနေ 💌 စာပို့ ကို နှိပ်ပါ။</div>"; return; }
    list.forEach(function(c){
      var el = document.createElement("div"); el.className = "conv-item";
      var av = document.createElement("div"); av.className = "avatar-text"; av.style.width="48px"; av.style.height="48px"; av.style.fontSize="20px"; av.textContent = (c.name||"?")[0].toUpperCase();
      var info = document.createElement("div"); info.className = "conv-info";
      info.appendChild(div("conv-name", c.name));
      info.appendChild(div("conv-last", c.lastText || "[ပုံ]"));
      el.appendChild(av); el.appendChild(info);
      el.onclick = function(){ openDM(c.uid, c.name); };
      box.appendChild(el);
    });
  });
}

function openDM(uid, name){
  currentDm = { uid: uid, name: name };
  showTab("messages");
  showDmView();
}

function showDmView(){
  if(!currentDm) return;
  $("convListBox").classList.add("hidden");
  $("dmView").classList.remove("hidden");
  $("dmWith").textContent = "💌 " + currentDm.name;
  $("dmMsgs").innerHTML = "";
  api("/api/dm/history", { method:"POST", json:{ with:currentDm.uid } }).then(function(d){
    (d.messages || []).forEach(function(m){ $("dmMsgs").appendChild(renderDmMsg(m)); });
    $("dmMsgs").scrollTop = $("dmMsgs").scrollHeight;
  });
}

function sendDm(text, photoKey){
  if(!currentDm) return;
  chatSend({ type:"dm", to:currentDm.uid, text:text || "", photoKey:photoKey || null });
}

// Init & Login
function showLogin(msg){
  $("loginMsg").textContent = msg || "";
  $("modal").style.display = "flex";
}

api("/api/me").then(function(d){
  var params = new URLSearchParams(location.search);
  if(params.get("login") === "error") showLogin("Login မအောင်မြင်ပါ။ ထပ်စမ်းပါ။");
  if(!d.uid){
    if(!params.get("login")) showLogin();
    return;
  }
  myUid = d.uid; myName = d.name || d.email.split("@")[0]; myEmail = d.email; myPicture = d.picture || "";
  $("modal").style.display = "none";
  
  setUserUI();
  renderHome();
  renderRules();
  chatConnect();
  showTab("home");
}).catch(function(){ showLogin("Server error"); });

// Handlers
document.querySelectorAll('.nav-links button, .bottom-nav button').forEach(function(b){
  b.onclick = function(){ showTab(b.getAttribute("data-tab")); };
});

$("dmBack").onclick = function(){ currentDm = null; loadConversations(); };

$("postForm").addEventListener("submit", function(e){
  e.preventDefault();
  if(!myUid){ showLogin(); return; }
  var f = e.target;
  var fd = new FormData(f);
  $("postBtn").disabled = true;
  $("postMsg").className = "msg"; $("postMsg").textContent = "တင်နေသည်...";
  api("/api/listings", { method:"POST", form:fd }).then(function(d){
    $("postBtn").disabled = false;
    if(d._ok){ $("postMsg").className="msg ok"; $("postMsg").textContent="တင်ပြီးပါပြီ ✅ Admin အတည်ပြုရန် စောင့်ပါ"; f.reset(); }
    else { $("postMsg").className="msg err"; $("postMsg").textContent = d.error || "မအောင်မြင်ပါ"; }
  });
});

$("chatForm").addEventListener("submit", function(e){
  e.preventDefault();
  var text = $("chatText").value.trim();
  if(!text || !chatJoined) return;
  chatSend({ type:"chat", text:text });
  $("chatText").value = "";
});

$("chatPhoto").onchange = function(e){
  var file = e.target.files[0]; if(!file) return;
  var fd = new FormData(); fd.append("photo", file);
  var text = $("chatText").value.trim();
  fetch("/api/chat-photo", { method:"POST", body:fd, credentials:"same-origin" })
    .then(function(r){ return r.json(); })
    .then(function(d){
      if(d.photoKey){ chatSend({ type:"chat-photo", photoKey:d.photoKey, text:text }); $("chatText").value = ""; }
      else alert(d.error || "ပုံတင် မအောင်မြင်ပါ");
    }).catch(function(){ alert("Upload error"); });
  e.target.value = "";
};

$("dmForm").addEventListener("submit", function(e){
  e.preventDefault();
  var text = $("dmText").value.trim();
  if(!text || !chatJoined || !currentDm) return;
  sendDm(text, null);
  $("dmText").value = "";
});

$("dmPhoto").onchange = function(e){
  var file = e.target.files[0]; if(!file) return;
  var fd = new FormData(); fd.append("photo", file);
  var text = $("dmText").value.trim();
  fetch("/api/chat-photo", { method:"POST", body:fd, credentials:"same-origin" })
    .then(function(r){ return r.json(); })
    .then(function(d){
      if(d.photoKey){ sendDm(text, d.photoKey); $("dmText").value = ""; }
      else alert(d.error || "ပုံတင် မအောင်မြင်ပါ");
    }).catch(function(){ alert("Upload error"); });
  e.target.value = "";
};

$("cLock").onclick = function(){ chatAction(chatLocked ? "unlock" : "lock"); };
$("cClear").onclick = function(){ if(confirm("Chat အကုန် ရှင်းမလား?")) chatAction("clear"); };
$("cKick").onclick = function(){ var n=prompt("ထုတ်ချင်တဲ့ နာမည်:"); if(n && n.trim()) chatAction("kick",{name:n.trim()}); };
$("cUnban").onclick = function(){ var n=prompt("ပြန်ခွင့်ပေးမယ့် နာမည်:"); if(n && n.trim()) chatAction("unban",{name:n.trim()}); };

$("adminLoginBtn").onclick = function(){
  var k = $("adminKeyInput").value.trim(); if(!k) return;
  adminKey = k; sessionStorage.setItem("tmm_akey", k);
  $("adminMsg").textContent = ""; loadAdmin(); chatConnect();
};
$("adminRefresh").onclick = loadAdmin;
$("adminLogout").onclick = function(){
  adminKey = ""; sessionStorage.removeItem("tmm_akey");
  loadAdmin(); chatConnect();
};
</script>
</body>
</html>`;

const PAGE = HTML.replace("__SITE__", () => JSON.stringify(SITE));
const ADMIN_PAGE = PAGE.replace('<body>', '<body>').replace('data-tab="home" class="on"', 'data-tab="admin" class="on"').replace('if(params.get("login") === "error")', 'if(params.get("login") === "error")'); // minor tweak to default admin page tab

function getRoom(env) { return env.CHAT_ROOM.get(env.CHAT_ROOM.idFromName("main")); }

function forward(env, path, body) {
  return getRoom(env).fetch("https://room" + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });
}

async function requireSession(request, env) {
  const sid = getCookie(request, "session");
  if (!sid) return null;
  const res = await forward(env, "/session-get", { sessionId: sid });
  if (!res.ok) return null;
  const s = await res.json();
  return s.uid ? s : null;
}

function isAdmin(request, env) {
  const key = request.headers.get("X-Admin-Key") || "";
  return !!env.ADMIN_KEY && key === env.ADMIN_KEY;
}

async function handleAuth(request, env, url) {
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

async function removeListing(env, body) {
  const res = await forward(env, "/remove", body);
  if (!res.ok) return res;
  const data = await res.json();
  if (data.photoKey) await env.IMAGES.delete(data.photoKey);
  return json({ ok: true });
}

async function createListing(request, env, uid) {
  const form = await request.formData();
  const title = clean(form.get("title"), MAX_TITLE);
  const price = clean(form.get("price"), MAX_PRICE);
  const description = clean(form.get("description"), MAX_DESC);
  const contact = clean(form.get("contact"), MAX_CONTACT);
  const photo = form.get("photo");

  if (!title || !price || !contact) return json({ error: "အချက်အလက် ပြည့်စုံအောင် ဖြည့်ပါ" }, 400);
  if (!photo || typeof photo === "string") return json({ error: "ပစ္စည်းပုံ ထည့်ပါ" }, 400);
  const ext = TYPES[photo.type];
  if (!ext) return json({ error: "ပုံ JPG, PNG, WEBP ပဲ ခွင့်ပြုပါတယ်" }, 400);
  if (photo.size > MAX_PHOTO) return json({ error: "ပုံ 3MB ထက် မကြီးရပါ" }, 400);

  const photoKey = crypto.randomUUID() + "." + ext;
  await env.IMAGES.put(photoKey, await photo.arrayBuffer(), { httpMetadata: { contentType: photo.type } });

  const res = await forward(env, "/create", { uid, title, price, description, contact, photoKey });
  if (!res.ok) await env.IMAGES.delete(photoKey);
  return res;
}

async function uploadChatPhoto(request, env) {
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

async function serveImage(key, env) {
  if (!/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(key)) return new Response("Not found", { status: 404 });
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

  if (path === "/api/me" && method === "GET") {
    const s = await requireSession(request, env);
    if (!s) return json({ uid: null });
    const uRes = await forward(env, "/user-get", { uid: s.uid });
    const u = uRes.ok ? await uRes.json() : {};
    return json({ uid: s.uid, email: s.email, name: u.name || "", picture: u.picture || "" });
  }

  const session = await requireSession(request, env);
  if (!session) return json({ error: "Login လိုအပ်ပါတယ်" }, 401);
  const uid = session.uid;

  if (path === "/api/listings" && method === "GET") return forward(env, "/list", {});
  if (path === "/api/listings" && method === "POST") return createListing(request, env, uid);
  if (path === "/api/mine" && method === "GET") return forward(env, "/mine", { uid });

  if (path === "/api/listing/buy" && method === "POST") {
    const b = await request.json();
    return forward(env, "/buy", { id: clean(b.id, 60), uid });
  }
  if (path === "/api/listing/return" && method === "POST") {
    const b = await request.json();
    return forward(env, "/return", { id: clean(b.id, 60), uid });
  }
  if (path === "/api/listing/delete" && method === "POST") {
    const b = await request.json();
    return removeListing(env, { admin: false, uid, id: clean(b.id, 60) });
  }
  if (path === "/api/report" && method === "POST") {
    const b = await request.json();
    return forward(env, "/report", {
      targetType: clean(b.targetType, 20),
      targetId: clean(b.targetId, 60),
      reason: clean(b.reason, MAX_REPORT_REASON),
      uid,
    });
  }
  if (path === "/api/dm/conversations" && method === "GET") return forward(env, "/dm-list", { uid });
  if (path === "/api/dm/history" && method === "POST") {
    const b = await request.json();
    return forward(env, "/dm-history", { uid, with: clean(b.with, 60) });
  }
  if (path === "/api/chat-photo" && method === "POST") return uploadChatPhoto(request, env);
  if (path === "/api/users/search" && method === "POST") {
    const b = await request.json();
    return forward(env, "/user-search", { q: clean(b.q, 40) });
  }

  if (path.startsWith("/api/admin/")) {
    if (!isAdmin(request, env)) return json({ error: "Admin key မှားနေပါတယ်" }, 401);
    if (path === "/api/admin/listings" && method === "GET") return forward(env, "/admin-list", {});
    if (path === "/api/admin/status" && method === "POST") {
      const b = await request.json();
      return forward(env, "/status", { id: clean(b.id, 60), status: b.status });
    }
    if (path === "/api/admin/delete" && method === "POST") {
      const b = await request.json();
      return removeListing(env, { admin: true, id: clean(b.id, 60) });
    }
    if (path === "/api/admin/reports" && method === "GET") return forward(env, "/admin-reports", {});
    if (path === "/api/admin/report-resolve" && method === "POST") {
      const b = await request.json();
      return forward(env, "/report-resolve", { id: clean(b.id, 60) });
    }
  }

  return json({ error: "Not found" }, 404);
}

function publicView(l) {
  return {
    id: l.id, ownerUid: l.ownerUid, ownerName: l.ownerName,
    title: l.title, price: l.price, description: l.description,
    contact: l.contact, photoKey: l.photoKey, status: l.status,
    buyerName: l.buyerName || null, soldAt: l.soldAt || null,
    createdAt: l.createdAt,
  };
}

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
    if (path === "/user-search") return this.userSearch(body);
    if (path === "/create") return this.create(body);
    if (path === "/list") return this.list();
    if (path === "/mine") return this.mine(body);
    if (path === "/buy") return this.buy(body);
    if (path === "/return") return this.returnSale(body);
    if (path === "/status") return this.setStatus(body);
    if (path === "/remove") return this.remove(body);
    if (path === "/admin-list") return this.adminList();
    if (path === "/dm-list") return this.dmList(body);
    if (path === "/dm-history") return this.dmHistory(body);
    if (path === "/report") return this.report(body);
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
    const u = await this.state.storage.get("u:" + clean(b.uid, 60));
    if (!u) return json({ error: "Not found" }, 404);
    return json({ uid: b.uid, name: u.name, email: u.email, picture: u.picture || "" });
  }

  async userSearch(b) {
    const q = clean(b.q, 40).toLowerCase();
    if (!q) return json({ users: [] });
    const map = await this.state.storage.list({ prefix: "u:", limit: 1000 });
    const users = [];
    for (const [key, val] of map) {
      if (val.name && val.name.toLowerCase().includes(q)) {
        users.push({ uid: key.slice(2), name: val.name });
        if (users.length >= 20) break;
      }
    }
    return json({ users });
  }

  // ===== Listings =====
  async allListings() {
    const map = await this.state.storage.list({ prefix: "l:", limit: 2000 });
    return [...map.values()].sort((a, b) => b.createdAt - a.createdAt);
  }

  async create(b) {
    const uid = clean(b.uid, 60);
    const user = await this.state.storage.get("u:" + uid);
    if (!user || !user.name) return json({ error: "User မတွေ့ပါ" }, 403);
    const id = crypto.randomUUID();
    const listing = {
      id, ownerUid: uid, ownerName: user.name,
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
      .filter((l) => l.status === "approved" || l.status === "sold")
      .map(publicView);
    return json({ listings: items });
  }

  async mine(b) {
    const uid = clean(b.uid, 60);
    const items = (await this.allListings()).filter((l) => l.ownerUid === uid).map(publicView);
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
    if (!["pending", "approved", "rejected"].includes(b.status)) return json({ error: "Status မှားနေပါတယ်" }, 400);
    l.status = b.status;
    await this.state.storage.put("l:" + id, l);
    return json({ ok: true });
  }

  async buy(b) {
    const id = clean(b.id, 60);
    const uid = clean(b.uid, 60);
    const l = await this.state.storage.get("l:" + id);
    if (!l) return json({ error: "မတွေ့ပါ" }, 404);
    if (l.ownerUid === uid) return json({ error: "ကိုယ်တိုင် ဝယ်မရပါ" }, 400);
    if (l.status !== "approved") return json({ error: "ဝယ်လို့မရပါ" }, 400);
    const user = await this.state.storage.get("u:" + uid);
    l.status = "sold";
    l.buyerUid = uid;
    l.buyerName = user?.name || "Unknown";
    l.soldAt = Date.now();
    await this.state.storage.put("l:" + id, l);
    return json({ ok: true });
  }

  async returnSale(b) {
    const id = clean(b.id, 60);
    const uid = clean(b.uid, 60);
    const l = await this.state.storage.get("l:" + id);
    if (!l) return json({ error: "မတွေ့ပါ" }, 404);
    if (l.ownerUid !== uid) return json({ error: "ခွင့်မရှိ" }, 403);
    if (l.status !== "sold") return json({ error: "ရောင်းပြီးမှ ပြန်ဖွင့်လို့ရပါ" }, 400);
    l.status = "approved";
    l.buyerUid = null;
    l.buyerName = null;
    l.soldAt = null;
    await this.state.storage.put("l:" + id, l);
    return json({ ok: true });
  }

  async remove(b) {
    const id = clean(b.id, 60);
    const l = await this.state.storage.get("l:" + id);
    if (!l) return json({ error: "မတွေ့ပါ" }, 404);
    if (!b.admin && l.ownerUid !== clean(b.uid, 60)) return json({ error: "ဖျက်ခွင့် မရှိပါ" }, 403);
    await this.state.storage.delete("l:" + id);
    return json({ ok: true, photoKey: l.photoKey });
  }

  // ===== Reports =====
  async report(b) {
    const uid = clean(b.uid, 60);
    const user = await this.state.storage.get("u:" + uid);
    const rep = {
      id: crypto.randomUUID(),
      targetType: clean(b.targetType, 20),
      targetId: clean(b.targetId, 60),
      reason: clean(b.reason, MAX_REPORT_REASON),
      byUid: uid,
      byName: user?.name || "Unknown",
      time: Date.now(),
      resolved: false,
    };
    let reports = (await this.state.storage.get("reports")) || [];
    reports.push(rep);
    if (reports.length > 500) reports = reports.slice(-500);
    await this.state.storage.put("reports", reports);
    return json({ ok: true });
  }

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
