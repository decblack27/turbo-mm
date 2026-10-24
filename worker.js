const MAX_TITLE = 80;
const MAX_PRICE = 40;
const MAX_DESC = 1000;
const MAX_CHAT = 500;
const MAX_HISTORY = 100;
const MAX_DM_HISTORY = 200;
const MAX_PHOTO = 3 * 1024 * 1024;
const MAX_REPORT_REASON = 500;
const TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

const SITE = {
  name: "TURBO VPN",
  tagline: "Premium V2Ray Keys Store",
  home: {
    intro: "အရည်အသွေးမြင့် V2Ray (Vmess/Vless) Key များကို ဈေးနှုန်းချိုသာစွာဖြင့် ဝယ်ယူနိုင်ပါသည်။ Admin မှ အတည်ပြုပြီးပါက Key များကို ချက်ချင်းရရှိမည်ဖြစ်ပါသည်။",
    features: [
      { title: "🛡 Premium Keys", text: "မြန်နှုန်းမြင့် ဆာဗာများ၏ Key များကို ဝယ်ယူအသုံးပြုနိုင်ပါသည်။" },
      { title: "⚡ Instant Delivery", text: "ငွေလွှဲပြီး Admin Approve လုပ်ပြီးတာနဲ့ Key ကို ချက်ချင်းရပါမည်။" },
      { title: "💬 24/7 Support", text: "Group Chat သို့မဟုတ် DM မှတဆင့် Admin ကို ဆက်သွယ်မေးမြန်းနိုင်ပါသည်။" }
    ]
  },
  rules: [
    "V2Ray Key များကို အခြားသူများထံ ပြန်လည်ရောင်းချခြင်း မပြုလုပ်ရပါ။",
    "Key များကို သတ်မှတ်ထားသော ကာလအတွင်းသာ အသုံးပြုနိုင်ပါသည်။",
    "ငွေလွှဲပြီးပါက ငွေလွှဲပြေစာ (Screenshot) ကို Admin ထံ ပို့ပေးရပါမည်။",
    "Group တွင် အကြမ်းဖက်စကား၊ စော်ကားစကား မသုံးရပါ။",
    "စည်းကမ်းချိုးဖောက်ပါက Key များကို ဖျက်ပစ်မည်ဖြစ်ပါသည်။"
  ],
  contact: {
    telegramChannel: "https://t.me/arsar2027",
    owner: "@turbomm750",
    ownerLink: "https://t.me/turbomm750",
    note: "အကူအညီလိုပါက Owner ကို Telegram မှ ဆက်သွယ်ပါ။"
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
<title>TURBO VPN</title>
<style>
:root{--primary:#00f2fe;--primary2:#4facfe;--bg:#0b0f19;--panel:#131b2f;--card:#1a243b;--line:#2a3752;--text:#e2e8f0;--muted:#94a3b8;--them:#1e293b;--ok:#10b981;--warn:#f59e0b;--danger:#ef4444;--premium:#fbbf24}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:"Segoe UI",system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;display:flex;flex-direction:column;overflow-x:hidden}
.hidden{display:none!important}
a{color:var(--primary);text-decoration:none}
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
.brand{padding:0 20px 20px;font-weight:800;letter-spacing:2px;color:var(--primary);font-size:20px;border-bottom:1px solid var(--line);margin-bottom:15px;display:flex;align-items:center;gap:10px}
.brand small{display:block;font-size:11px;color:var(--muted);letter-spacing:1px;margin-top:4px}
.nav-links{display:flex;flex-direction:column;gap:4px;padding:0 10px}
.nav-links button{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:10px;border:none;background:transparent;color:var(--muted);font-size:15px;font-weight:500;cursor:pointer;text-align:left;transition:0.2s}
.nav-links button:hover{background:rgba(255,255,255,0.05);color:var(--text)}
.nav-links button.on{background:rgba(0,242,254,0.1);color:var(--primary);font-weight:700}
.sidebar-footer{margin-top:auto;padding:20px;border-top:1px solid var(--line);font-size:12px;color:var(--muted);text-align:center}

/* Header */
header{position:sticky;top:0;z-index:5;display:flex;align-items:center;justify-content:space-between;padding:14px 20px;background:rgba(19,27,47,0.85);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.header-title{font-size:18px;font-weight:700}
.user-badge{display:flex;align-items:center;gap:10px;background:var(--card);padding:4px 12px 4px 4px;border-radius:30px;border:1px solid var(--line);cursor:pointer;transition:0.2s}
.user-badge:hover{border-color:var(--primary)}
.avatar{width:32px;height:32px;border-radius:50%;object-fit:cover;background:var(--them)}
.avatar-text{width:32px;height:32px;border-radius:50%;background:var(--primary);color:#000;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px}
.user-name{font-size:14px;font-weight:600;max-width:100px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

/* Mobile Bottom Nav */
.bottom-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:var(--panel);border-top:1px solid var(--line);z-index:50;padding:5px 0;padding-bottom:env(safe-area-inset-bottom,5px);justify-content:space-around;overflow-x:auto}
@media(max-width:768px){ .bottom-nav{display:flex} }
.bottom-nav button{display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;color:var(--muted);font-size:11px;padding:8px 10px;min-width:60px;cursor:pointer}
.bottom-nav button.on{color:var(--primary)}

/* Main Content Area */
main{flex:1;padding:24px;max-width:900px;margin:0 auto;width:100%}
.section-title{font-size:22px;font-weight:800;margin-bottom:20px;color:var(--text);display:flex;align-items:center;gap:10px}
.grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fill,minmax(280px,1fr))}

/* Cards & UI */
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden;display:flex;flex-direction:column;transition:transform 0.2s,box-shadow 0.2s}
.card:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,0.3);border-color:var(--primary)}
.card-header{padding:16px;background:rgba(0,242,254,0.05);border-bottom:1px solid var(--line);text-align:center}
.price{color:var(--primary);font-weight:800;font-size:24px;margin-top:8px}
.body{padding:16px;display:flex;flex-direction:column;gap:8px;flex:1}
.title{font-weight:700;font-size:18px;line-height:1.4}
.desc{color:var(--muted);font-size:14px;line-height:1.5}
.tag{display:inline-block;font-size:12px;padding:4px 10px;border-radius:999px;font-weight:700;align-self:flex-start}
.tag.pending{background:rgba(245,158,11,0.15);color:var(--warn)}
.tag.approved{background:rgba(16,185,129,0.15);color:var(--ok)}
.tag.rejected{background:rgba(239,68,68,0.15);color:var(--danger)}

/* Buttons */
.btn{padding:10px 16px;border-radius:10px;background:var(--them);color:var(--text);border:1px solid var(--line);cursor:pointer;font-size:14px;font-weight:600;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:0.2s}
.btn:hover{background:var(--line)}
.btn.primary{background:linear-gradient(135deg,var(--primary),var(--primary2));color:#000;border:none}
.btn.red{color:var(--danger);border-color:rgba(239,68,68,0.3)}
.btn.green{color:var(--ok);border-color:rgba(16,185,129,0.3)}
.btn:disabled{opacity:0.5;cursor:not-allowed}
.row-btns{display:flex;gap:8px;flex-wrap:wrap;margin-top:auto;padding-top:10px}

/* Forms */
form.post{display:flex;flex-direction:column;gap:16px;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:24px}
label{font-size:14px;color:var(--muted);display:flex;flex-direction:column;gap:8px;font-weight:600}
input,textarea,select{width:100%;padding:14px 16px;border-radius:12px;border:1px solid var(--line);background:var(--bg);color:var(--text);font-size:15px;font-family:inherit;outline:none;transition:0.2s}
textarea{min-height:100px;resize:vertical}
input:focus,textarea:focus,select:focus{border-color:var(--primary);box-shadow:0 0 0 2px rgba(0,242,254,0.2)}
.msg{font-size:14px;text-align:center;font-weight:600}
.msg.err{color:var(--danger)}
.msg.ok{color:var(--ok)}
.empty{text-align:center;color:var(--muted);padding:60px 20px;font-size:15px;background:var(--panel);border-radius:16px;border:1px dashed var(--line)}

/* Profile */
.profile-card{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:30px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:15px;margin-bottom:24px}
.profile-avatar{width:100px;height:100px;border-radius:50%;object-fit:cover;border:4px solid var(--panel);box-shadow:0 4px 15px rgba(0,0,0,0.5)}
.profile-name{font-size:24px;font-weight:800}
.profile-email{color:var(--muted);font-size:15px}
.role-badge{padding:6px 16px;border-radius:20px;font-size:14px;font-weight:800;margin-top:10px;display:inline-block}
.role-free{background:rgba(148,163,184,0.2);color:var(--muted);border:1px solid var(--muted)}
.role-premium{background:rgba(251,191,36,0.15);color:var(--premium);border:1px solid var(--premium);box-shadow:0 0 10px rgba(251,191,36,0.2)}
.key-box{background:var(--bg);border:1px dashed var(--primary);border-radius:8px;padding:12px;font-family:monospace;font-size:13px;word-break:break-all;color:var(--primary);margin-top:10px;cursor:pointer;position:relative}

/* Chat */
.chatbox{display:flex;flex-direction:column;background:var(--panel);border:1px solid var(--line);border-radius:16px;overflow:hidden;height:calc(100vh - 180px);min-height:400px}
@media(max-width:768px){.chatbox{height:calc(100vh - 200px)}}
.chatbar{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid var(--line);background:var(--card)}
#chatMsgs,#dmMsgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:4px;background:var(--bg)}
.row{display:flex;margin:4px 0}
.row.mine{justify-content:flex-end}
.bubble{position:relative;max-width:80%;padding:10px 14px;border-radius:16px;background:var(--them);border:1px solid var(--line)}
.row.them .bubble{border-bottom-left-radius:4px}
.row.mine .bubble{background:linear-gradient(135deg,var(--primary),var(--primary2));color:#000;border:none;border-bottom-right-radius:4px}
.who{font-size:12px;font-weight:700;color:var(--primary);margin-bottom:4px}
.text{white-space:pre-wrap;word-break:break-word;line-height:1.5;font-size:15px}
.meta{font-size:10px;opacity:0.6;text-align:right;margin-top:4px}
.chat-img{max-width:100%;border-radius:10px;display:block;margin:6px 0;cursor:pointer}
form.chatform{display:flex;gap:8px;align-items:center;padding:12px;background:var(--card);border-top:1px solid var(--line)}
.icon-btn{display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;background:var(--panel);border:1px solid var(--line);cursor:pointer;font-size:20px}
#chatText,#dmText{flex:1;padding:12px 16px;border-radius:22px}
#chatSend,#dmSend{width:44px;height:44px;border-radius:50%;border:none;background:linear-gradient(135deg,var(--primary),var(--primary2));color:#000;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center}

/* Modal */
#modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.8);backdrop-filter:blur(5px);align-items:center;justify-content:center;padding:20px;z-index:100}
#modal .box{width:100%;max-width:380px;background:var(--card);border:1px solid var(--line);border-radius:20px;padding:30px;text-align:center;display:flex;flex-direction:column;gap:16px}
#modal h2{margin:0;color:var(--primary);letter-spacing:2px}
#modal p{color:var(--muted);font-size:14px;line-height:1.6}
.gbtn{text-decoration:none;padding:14px;border-radius:12px;background:linear-gradient(135deg,var(--primary),var(--primary2));color:#000;font-weight:700;display:flex;align-items:center;justify-content:center;gap:10px;font-size:16px}

/* Admin Tabs */
.admin-tabs{display:flex;gap:8px;margin-bottom:20px;border-bottom:1px solid var(--line);padding-bottom:10px;overflow-x:auto}
.admin-tabs button{padding:8px 16px;border-radius:8px;background:transparent;border:none;color:var(--muted);cursor:pointer;font-weight:600;font-size:14px}
.admin-tabs button.on{background:var(--primary);color:#000}
</style>
</head>
<body>

<div class="app-container">
  <!-- Desktop Sidebar -->
  <aside class="sidebar">
    <div class="brand">TURBO VPN<small>Premium Store</small></div>
    <div class="nav-links">
      <button data-tab="home" class="on">🏠 ပင်မ</button>
      <button data-tab="store">🛒 ဝယ်ယူရန်</button>
      <button data-tab="mykeys">🔑 ကျွန်ုပ်၏ Key များ</button>
      <button data-tab="group">💬 Group Chat</button>
      <button data-tab="messages">💌 Messages</button>
      <button data-tab="profile">👤 Profile</button>
      <button data-tab="rules">📜 စည်းကမ်း</button>
      <button data-tab="admin" id="adminTabBtn" class="hidden">🛡 Admin Panel</button>
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
          <h1 style="font-size:36px;color:var(--primary);margin-bottom:10px;">TURBO VPN</h1>
          <p style="color:var(--muted);font-size:16px;max-width:500px;margin:0 auto 30px;line-height:1.6;" id="homeIntro"></p>
          <div class="grid" id="homeFeatures" style="max-width:800px;margin:0 auto;"></div>
        </div>
      </section>

      <section id="tab-store" class="hidden">
        <div class="section-title">🛒 V2Ray Plan များ</div>
        <div class="grid" id="storeGrid"></div>
        <div id="storeEmpty" class="empty hidden">လောလောဆယ် Plan များ မရှိသေးပါ။</div>
      </section>

      <section id="tab-mykeys" class="hidden">
        <div class="section-title">🔑 ကျွန်ုပ်၏ Key များ</div>
        <div class="grid" id="myKeysGrid"></div>
        <div id="myKeysEmpty" class="empty hidden">သင်ဝယ်ယူထားသော Key မရှိသေးပါ။</div>
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
          <div class="chatadmin hidden" id="chatAdminRow" style="padding:10px;background:rgba(0,242,254,0.1);display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn" id="cLock" type="button" style="padding:4px 8px;font-size:12px;">🔒 ပိတ်</button>
            <button class="btn" id="cClear" type="button" style="padding:4px 8px;font-size:12px;">🧹 ရှင်း</button>
            <button class="btn" id="cKick" type="button" style="padding:4px 8px;font-size:12px;">🚫 ထုတ်</button>
            <button class="btn" id="cUnban" type="button" style="padding:4px 8px;font-size:12px;">♻ ပြန်ခွင့်</button>
          </div>
          <div id="chatMsgs"></div>
          <div id="chatLockMsg" class="msg err hidden" style="padding:10px;background:rgba(239,68,68,0.1);">🔒 Admin က chat ကို ယာယီပိတ်ထားပါတယ်</div>
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
            <div id="profileRole" class="role-badge role-free">Free User</div>
          </div>
          <a href="/auth/logout" class="btn red" style="width:100%;margin-top:20px;">Logout ထွက်မည်</a>
        </div>
      </section>

      <section id="tab-rules" class="hidden">
        <div class="section-title">📜 စည်းကမ်းချက်များ</div>
        <div id="rulesBox"></div>
      </section>

      <section id="tab-admin" class="hidden">
        <div class="section-title">🛡 Admin Dashboard</div>
        
        <div class="adminbox" id="adminLogin" style="background:var(--card);padding:20px;border-radius:16px;margin-bottom:20px;">
          <label>Admin Key
            <input id="adminKeyInput" type="password" placeholder="Enter Admin key" autocomplete="off">
          </label>
          <button class="btn primary" id="adminLoginBtn" type="button" style="margin-top:10px;width:100%;">ဝင်မည်</button>
          <div class="msg err" id="adminMsg" style="margin-top:10px;"></div>
        </div>

        <div id="adminPanel" class="hidden">
          <div class="row-btns" style="margin-bottom:20px">
            <button class="btn red" id="adminLogout" type="button">Logout</button>
          </div>

          <div class="admin-tabs">
            <button class="on" onclick="switchAdminTab('orders')">Orders</button>
            <button onclick="switchAdminTab('plans')">Plans</button>
            <button onclick="switchAdminTab('users')">Users</button>
            <button onclick="switchAdminTab('reports')">Reports</button>
          </div>
          
          <div id="adminTab-orders">
            <h3 style="margin-bottom:15px;color:var(--primary);">Pending Orders</h3>
            <div class="grid" id="adminOrdersGrid"></div>
            <div id="adminOrdersEmpty" class="empty hidden">Order မရှိပါ</div>
          </div>

          <div id="adminTab-plans" class="hidden">
            <h3 style="margin-bottom:15px;color:var(--primary);">VPN Plans</h3>
            <button class="btn primary" onclick="showCreatePlan()" style="margin-bottom:15px;">➕ Plan အသစ်ထည့်မည်</button>
            <div class="grid" id="adminPlansGrid"></div>
            <div id="adminPlansEmpty" class="empty hidden">Plan မရှိပါ</div>
          </div>

          <div id="adminTab-users" class="hidden">
            <h3 style="margin-bottom:15px;color:var(--primary);">User Management</h3>
            <input type="text" id="adminUserSearch" placeholder="Search by name..." style="margin-bottom:15px;">
            <div class="grid" id="adminUsersGrid"></div>
          </div>

          <div id="adminTab-reports" class="hidden">
            <h3 style="margin-bottom:15px;color:var(--danger);">User Reports</h3>
            <div id="adminReportsList"></div>
            <div id="adminReportsEmpty" class="empty hidden">Report မရှိပါ</div>
          </div>
        </div>
      </section>
    </main>
  </div>
</div>

<!-- Mobile Bottom Nav -->
<nav class="bottom-nav">
  <button data-tab="home" class="on">🏠<span>ပင်မ</span></button>
  <button data-tab="store">🛒<span>Store</span></button>
  <button data-tab="mykeys">🔑<span>Keys</span></button>
  <button data-tab="group">💬<span>Group</span></button>
  <button data-tab="messages">💌<span>စာများ</span></button>
  <button data-tab="profile">👤<span>Profile</span></button>
</nav>

<div id="modal">
  <div class="box">
    <h2>TURBO VPN</h2>
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
var IS_ADMIN_PAGE = document.body.getAttribute("data-admin")==="1";
var STATUS_TEXT = { pending:"⏳ စောင့်ဆဲ", approved:"✅ အတည်ပြုပြီး", rejected:"❌ ပယ်ချခံရ" };

var myUid = null, myName = "", myEmail = "", myPicture = "", myRole = "free";
var adminKey = sessionStorage.getItem("tmm_akey") || "";
var chatAdmin = false, chatLocked = false, chatJoined = false, chatBanned = false;
var chatWs = null;
var currentDm = null;

var PAGE_TITLES = {
  home: "ပင်မ", store: "V2Ray Store", mykeys: "ကျွန်ုပ်၏ Key များ",
  messages: "စာများ", group: "Group Chat", profile: "Profile",
  rules: "စည်းကမ်းချက်များ", admin: "Admin Panel"
};

function div(cls, text){var d=document.createElement("div");d.className=cls;if(text!==undefined)d.textContent=text;return d;}
function btn(text, cls, fn){var b=document.createElement("button");b.className=cls;b.textContent=text;b.type="button";b.onclick=fn;return b;}

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
  
  var roleEl = $("profileRole");
  if(myRole === "premium" || myRole === "admin") {
    roleEl.className = "role-badge role-premium";
    roleEl.textContent = "👑 Premium User";
  } else {
    roleEl.className = "role-badge role-free";
    roleEl.textContent = "Free User";
  }
}

function showTab(name){
  document.querySelectorAll('.nav-links button, .bottom-nav button').forEach(function(b){ 
    b.classList.toggle("on", b.getAttribute("data-tab")===name); 
  });
  document.querySelectorAll("main > section").forEach(function(s){ 
    s.classList.toggle("hidden", s.id!=="tab-"+name); 
  });
  $("pageTitle").textContent = PAGE_TITLES[name] || "TURBO VPN";
  
  if(name==="store") loadStore();
  if(name==="mykeys") loadMyKeys();
  if(name==="admin") loadAdmin();
  if(name==="group") chatScroll();
  if(name==="messages") { if(currentDm) showDmView(); else loadConversations(); }
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

function renderRules(){
  var box = $("rulesBox"); box.innerHTML="";
  SITE.rules.forEach(function(r,i){
    var row = document.createElement("div"); row.style.display="flex"; row.style.gap="15px"; row.style.background="var(--card)"; row.style.padding="20px"; row.style.borderRadius="12px"; row.style.marginBottom="12px"; row.style.border="1px solid var(--line)";
    var num = div("tag", String(i+1)); num.style.background="var(--primary)"; num.style.color="#000"; num.style.width="28px"; num.style.height="28px"; num.style.display="flex"; num.style.alignItems="center"; num.style.justifyContent="center"; num.style.borderRadius="50%";
    row.appendChild(num);
    var txt = div("text", r); txt.style.color="var(--text)"; txt.style.fontSize="15px";
    row.appendChild(txt);
    box.appendChild(row);
  });
}

// ==== STORE & KEYS ====
function loadStore(){
  api("/api/plans").then(function(d){
    var g=$("storeGrid"); g.innerHTML="";
    var list = d.plans || [];
    $("storeEmpty").classList.toggle("hidden", list.length>0);
    list.forEach(function(p){
      var card = div("card", "");
      var head = div("card-header", "");
      head.appendChild(div("title", p.title));
      head.appendChild(div("price", p.price + " Ks"));
      card.appendChild(head);
      
      var body = div("body", "");
      body.appendChild(div("desc", p.description));
      body.appendChild(div("seller", "⏳ သက်တမ်း: " + p.duration + " ရက်"));
      
      var row = div("row-btns", "");
      row.appendChild(btn("🛒 ဝယ်ယူမည်", "btn primary", function(){
        var note = prompt("ငွေလွှဲထားသော အချက်အလက် (ဥပမာ - KBZ Pay 09xxxx, နာမည်...) ရိုက်ထည့်ပါ:");
        if(note === null) return;
        api("/api/order", { method:"POST", json:{ planId:p.id, note:note } }).then(function(r){
          if(r._ok) alert("တင်သွင်းပြီးပါပြီ။ Admin အတည်ပြုရန် စောင့်ပါ။");
          else alert(r.error || "မအောင်မြင်ပါ");
        });
      }));
      body.appendChild(row);
      card.appendChild(body);
      g.appendChild(card);
    });
  });
}

function loadMyKeys(){
  api("/api/my-orders").then(function(d){
    var g=$("myKeysGrid"); g.innerHTML="";
    var list = d.orders || [];
    $("myKeysEmpty").classList.toggle("hidden", list.length>0);
    list.forEach(function(o){
      var card = div("card", "");
      var head = div("card-header", "");
      head.appendChild(div("title", o.planTitle));
      head.appendChild(div("tag " + o.status, STATUS_TEXT[o.status] || o.status));
      card.appendChild(head);
      
      var body = div("body", "");
      body.appendChild(div("seller", "ဝယ်ယူသည့်ရက်စွဲ: " + new Date(o.createdAt).toLocaleDateString("my-MM")));
      
      if(o.status === "approved" && o.v2rayKey) {
        var keyBox = div("key-box", o.v2rayKey);
        keyBox.title = "Copy ကူးရန် နှိပ်ပါ";
        keyBox.onclick = function(){ navigator.clipboard.writeText(o.v2rayKey); alert("Key Copy ကူးပြီးပါပြီ"); };
        body.appendChild(div("seller", "🔑 သင့် V2Ray Key (နှိပ်ပြီး Copy ယူပါ):"));
        body.appendChild(keyBox);
      } else if(o.status === "rejected") {
        body.appendChild(div("seller", "❌ ငွေလွှဲမှု မမှန်ကန်ပါ။ Admin ကို ဆက်သွယ်ပါ။")).style.color = "var(--danger)";
      } else {
        body.appendChild(div("seller", "⏳ Admin အတည်ပြုရန် စောင့်ဆဲ...")).style.color = "var(--warn)";
      }
      card.appendChild(body);
      g.appendChild(card);
    });
  });
}

// ==== ADMIN LOGIC ====
function switchAdminTab(tabName) {
  document.querySelectorAll('.admin-tabs button').forEach(b => b.classList.remove('on'));
  event.target.classList.add('on');
  ['orders', 'plans', 'users', 'reports'].forEach(t => {
    $('adminTab-' + t).classList.toggle('hidden', t !== tabName);
  });
  if(tabName === 'orders') loadAdminOrders();
  if(tabName === 'plans') loadAdminPlans();
  if(tabName === 'users') loadAdminUsers();
  if(tabName === 'reports') loadAdminReports();
}

function loadAdmin(){
  if(!adminKey){ $("adminLogin").classList.remove("hidden"); $("adminPanel").classList.add("hidden"); return; }
  api("/api/admin/orders").then(function(d){
    if(d._status === 401){
      adminKey = ""; sessionStorage.removeItem("tmm_akey");
      $("adminMsg").textContent = d.error || "Admin key မှားနေပါတယ်";
      $("adminLogin").classList.remove("hidden"); $("adminPanel").classList.add("hidden"); return;
    }
    $("adminLogin").classList.add("hidden"); $("adminPanel").classList.remove("hidden");
    loadAdminOrders();
  });
}

function loadAdminOrders(){
  api("/api/admin/orders").then(function(d){
    var g=$("adminOrdersGrid"); g.innerHTML="";
    var list=(d.orders||[]).filter(o => o.status === "pending");
    $("adminOrdersEmpty").classList.toggle("hidden", list.length>0);
    list.forEach(function(o){
      var card = div("card", "");
      var body = div("body", "");
      body.appendChild(div("title", o.planTitle + " (" + o.userName + ")"));
      body.appendChild(div("price", o.planPrice + " Ks"));
      body.appendChild(div("desc", "Note: " + o.note));
      
      var keyInput = document.createElement("input");
      keyInput.placeholder = "Paste V2Ray Key here (vmess://...)";
      
      var row = div("row-btns", "");
      row.appendChild(btn("✅ အတည်ပြု (Key ပေး)", "btn green", function(){
        if(!keyInput.value.trim()) { alert("Key ထည့်ပါ"); return; }
        api("/api/admin/order-approve", { method:"POST", json:{ id:o.id, key:keyInput.value.trim() } }).then(loadAdminOrders);
      }));
      row.appendChild(btn("❌ ပယ်ချ", "btn red", function(){
        api("/api/admin/order-reject", { method:"POST", json:{ id:o.id } }).then(loadAdminOrders);
      }));
      
      body.appendChild(keyInput);
      body.appendChild(row);
      card.appendChild(body);
      g.appendChild(card);
    });
  });
}

function showCreatePlan(){
  var title = prompt("Plan အမည် (ဥပမာ - 1 Month Unlimited):");
  if(!title) return;
  var price = prompt("ဈေးနှုန်း (ကျပ်):");
  if(!price) return;
  var duration = prompt("သက်တမ်း (ရက်):");
  if(!duration) return;
  var desc = prompt("အကြောင်းအရာ (ဥပမာ - 10Mbps, Unlimited Data):");
  api("/api/admin/create-plan", { method:"POST", json:{ title, price, duration, description: desc } }).then(loadAdminPlans);
}

function loadAdminPlans(){
  api("/api/admin/plans").then(function(d){
    var g=$("adminPlansGrid"); g.innerHTML="";
    var list=d.plans||[];
    $("adminPlansEmpty").classList.toggle("hidden", list.length>0);
    list.forEach(function(p){
      var card = div("card", "");
      var body = div("body", "");
      body.appendChild(div("title", p.title));
      body.appendChild(div("price", p.price + " Ks"));
      body.appendChild(div("desc", p.description + " | " + p.duration + " ရက်"));
      var row = div("row-btns", "");
      row.appendChild(btn("🗑 ဖျက်", "btn red", function(){
        if(confirm("ဖျက်မလား?")) api("/api/admin/delete-plan", { method:"POST", json:{ id:p.id } }).then(loadAdminPlans);
      }));
      body.appendChild(row);
      card.appendChild(body); g.appendChild(card);
    });
  });
}

function loadAdminUsers(){
  api("/api/admin/users").then(function(d){
    var g=$("adminUsersGrid"); g.innerHTML="";
    var list=d.users||[];
    list.forEach(function(u){
      var card = div("card", "");
      var body = div("body", "");
      body.appendChild(div("title", u.name));
      body.appendChild(div("seller", u.email));
      var roleTxt = u.role === "premium" ? "👑 Premium" : "Free";
      body.appendChild(div("seller", "Status: " + roleTxt));
      
      var row = div("row-btns", "");
      if(u.role !== "premium") row.appendChild(btn("👑 Premium ပေးမည်", "btn primary", function(){
        api("/api/admin/set-role", { method:"POST", json:{ uid: u.uid, role:"premium" } }).then(loadAdminUsers);
      }));
      else row.appendChild(btn("Free ပြန်ထားမည်", "btn", function(){
        api("/api/admin/set-role", { method:"POST", json:{ uid: u.uid, role:"free" } }).then(loadAdminUsers);
      }));
      body.appendChild(row);
      card.appendChild(body); g.appendChild(card);
    });
  });
}

function loadAdminReports(){
  api("/api/admin/reports").then(function(d){
    var box=$("adminReportsList"); box.innerHTML="";
    var list=d.reports||[];
    $("adminReportsEmpty").classList.toggle("hidden", list.length>0);
    list.forEach(function(r){
      var el=div("card", ""); el.style.padding = "16px";
      el.appendChild(div("title", r.targetType + " · " + r.targetId));
      el.appendChild(div("desc", r.reason));
      el.appendChild(div("seller", "by " + (r.byName || r.byUid) + " · " + new Date(r.time).toLocaleString("my-MM")));
      if(!r.resolved){
        var row=div("row-btns", "");
        row.appendChild(btn("✅ Resolve","btn green",function(){
          api("/api/admin/report-resolve",{method:"POST",json:{id:r.id}}).then(loadAdminReports);
        }));
        el.appendChild(row);
      }
      box.appendChild(el);
    });
  });
}

// ==== CHAT & DM ====
function setChatStatus(text, cls){ var el=$("chatStatus"); if(el){el.textContent=text; el.className="pill "+(cls||"");} }
function chatScroll(){ var c=$("chatMsgs"); if(c) c.scrollTop=c.scrollHeight; }

function renderChatMsg(m){
  var mine = m.uid === myUid;
  var row = document.createElement("div");
  row.className = "row " + (mine ? "mine" : "them");
  if(m.id) row.setAttribute("data-id", m.id);
  var bubble = document.createElement("div"); bubble.className = "bubble";
  if(!mine){
    var who = document.createElement("div"); who.className = "who"; who.textContent = m.name;
    if(m.admin){ var b=document.createElement("span"); b.className="badge"; b.style.cssText="font-size:10px;background:var(--primary);color:#000;padding:1px 4px;border-radius:4px;margin-left:4px;"; b.textContent="ADMIN"; who.appendChild(b); }
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
    var del = btn("✕","del",function(){
      if(confirm("ဒီစာကို ဖျက်မလား?")) chatAction("delete",{id:m.id});
    });
    del.style.cssText="position:absolute;top:-8px;right:-8px;width:22px;height:22px;border-radius:50%;border:none;background:var(--danger);color:#fff;font-size:11px;cursor:pointer;padding:0;";
    bubble.appendChild(del);
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
      if($("adminMsg")) $("adminMsg").textContent = "Admin key မှားနေပါတယ်";
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
    box.appendChild(div("meta", d.text)).style.textAlign="center"; chatScroll();
  } else if(d.type === "error"){
    box.appendChild(div("meta", "⚠ " + d.text)).style.cssText="color:var(--danger);text-align:center;"; chatScroll();
  } else if(d.type === "kicked"){
    chatBanned = true; chatJoined = false; updateChatInput();
    setChatStatus("🔴 ထုတ်ခံရပါတယ်","bad");
    box.appendChild(div("meta", d.text)).style.cssText="color:var(--danger);text-align:center;"; chatScroll();
  }
}

function loadConversations(){
  $("convListBox").classList.remove("hidden");
  $("dmView").classList.add("hidden");
  $("convListBox").innerHTML = "<div class='empty'>Loading...</div>";
  api("/api/dm/conversations").then(function(d){
    var box = $("convListBox"); box.innerHTML = "";
    var list = d.conversations || [];
    if(!list.length){ box.innerHTML = "<div class='empty'>Conversation မရှိသေးပါ။</div>"; return; }
    list.forEach(function(c){
      var el = div("conv-item", ""); el.style.cssText = "display:flex;gap:12px;padding:16px;background:var(--card);border:1px solid var(--line);border-radius:14px;margin-bottom:10px;cursor:pointer;align-items:center;";
      var av = div("avatar-text", (c.name||"?")[0].toUpperCase()); av.style.width="48px"; av.style.height="48px"; av.style.fontSize="20px";
      var info = div("conv-info", ""); info.style.flex = "1";
      info.appendChild(div("title", c.name));
      info.appendChild(div("seller", c.lastText || "[ပုံ]"));
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
  myRole = d.role || "free";
  $("modal").style.display = "none";
  
  setUserUI();
  renderHome();
  renderRules();
  chatConnect();

  if (IS_ADMIN_PAGE) {
    $("adminTabBtn").classList.remove("hidden");
    document.title = "TURBO VPN · Admin";
    showTab("admin");
  } else {
    showTab("home");
  }
}).catch(function(){ showLogin("Server error"); });

document.querySelectorAll('.nav-links button, .bottom-nav button').forEach(function(b){
  if(b.id === 'adminTabBtn') return;
  b.onclick = function(){ showTab(b.getAttribute("data-tab")); };
});

$("dmBack").onclick = function(){ currentDm = null; loadConversations(); };

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
$("adminLogout").onclick = function(){
  adminKey = ""; sessionStorage.removeItem("tmm_akey");
  loadAdmin(); chatConnect();
};
</script>
</body>
</html>`;

const PAGE = HTML.replace("__SITE__", () => JSON.stringify(SITE));
const ADMIN_PAGE = PAGE.replace("<body>", '<body data-admin="1">');

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
    return json({ uid: s.uid, email: s.email, name: u.name || "", picture: u.picture || "", role: u.role || "free" });
  }

  const session = await requireSession(request, env);
  if (!session) return json({ error: "Login လိုအပ်ပါတယ်" }, 401);
  const uid = session.uid;

  if (path === "/api/plans" && method === "GET") return forward(env, "/plans", {});
  if (path === "/api/order" && method === "POST") {
    const b = await request.json();
    return forward(env, "/order", { uid, planId: clean(b.planId, 60), note: clean(b.note, 500) });
  }
  if (path === "/api/my-orders" && method === "GET") return forward(env, "/my-orders", { uid });

  if (path === "/api/dm/conversations" && method === "GET") return forward(env, "/dm-list", { uid });
  if (path === "/api/dm/history" && method === "POST") {
    const b = await request.json();
    return forward(env, "/dm-history", { uid, with: clean(b.with, 60) });
  }
  if (path === "/api/chat-photo" && method === "POST") return uploadChatPhoto(request, env);

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
    if (path === "/api/admin/report-resolve" && method === "POST") {
      const b = await request.json();
      return forward(env, "/report-resolve", { id: clean(b.id, 60) });
    }
  }

  return json({ error: "Not found" }, 404);
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
    
    if (path === "/plans") return this.getPlans();
    if (path === "/order") return this.createOrder(body);
    if (path === "/my-orders") return this.myOrders(body);

    if (path === "/dm-list") return this.dmList(body);
    if (path === "/dm-history") return this.dmHistory(body);
    
    // Admin routes
    if (path === "/admin-orders") return this.adminOrders();
    if (path === "/order-approve") return this.orderApprove(body);
    if (path === "/order-reject") return this.orderReject(body);
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
    return json({ uid: b.uid, name: u.name, email: u.email, picture: u.picture || "", role: u.role });
  }

  async adminUsers() {
    const map = await this.state.storage.list({ prefix: "u:", limit: 500 });
    const users = [];
    for (const [key, val] of map) {
      users.push({ uid: key.slice(2), name: val.name, email: val.email, role: val.role || "free" });
    }
    return json({ users });
  }

  async setRole(b) {
    const uid = clean(b.uid, 60);
    const u = await this.state.storage.get("u:" + uid);
    if(u) {
      u.role = b.role;
      await this.state.storage.put("u:" + uid, u);
    }
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
    if(!user || !plan) return json({ error: "အချက်အလက် မမှန်ပါ" }, 400);

    const id = crypto.randomUUID();
    const order = {
      id,
      uid,
      userName: user.name,
      planId: plan.id,
      planTitle: plan.title,
      planPrice: plan.price,
      note: clean(b.note, 500),
      status: "pending",
      v2rayKey: null,
      createdAt: Date.now()
    };
    await this.state.storage.put("order:" + id, order);
    return json({ ok: true, id });
  }

  async myOrders(b) {
    const uid = clean(b.uid, 60);
    const map = await this.state.storage.list({ prefix: "order:", limit: 500 });
    const orders = [...map.values()].filter(o => o.uid === uid).sort((a,b) => b.createdAt - a.createdAt);
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
    if(!order) return json({ error: "Order မတွေ့ပါ" }, 404);
    order.status = "approved";
    order.v2rayKey = clean(b.key, 1000);
    await this.state.storage.put("order:" + id, order);
    return json({ ok: true });
  }

  async orderReject(b) {
    const id = clean(b.id, 60);
    const order = await this.state.storage.get("order:" + id);
    if(!order) return json({ error: "Order မတွေ့ပါ" }, 404);
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
