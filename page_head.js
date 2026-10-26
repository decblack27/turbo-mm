export const HEAD = `<!DOCTYPE html>
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
.tag.free{background:rgba(148,163,184,0.2);color:var(--muted)}
.tag.premium{background:rgba(251,191,36,0.15);color:var(--premium)}

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

/* ===== Beautify ===== */
:root{--glow:rgba(0,242,254,.18);--radius:18px}
body{background:radial-gradient(1100px 560px at 8% -10%,rgba(79,172,254,.15),transparent 60%),radial-gradient(900px 480px at 100% 0,rgba(0,242,254,.10),transparent 55%),var(--bg);background-attachment:fixed}
::-webkit-scrollbar{width:8px;height:8px}
::-webkit-scrollbar-thumb{background:var(--line);border-radius:8px}
.sidebar{background:linear-gradient(180deg,rgba(19,27,47,.97),rgba(11,15,25,.97))}
.brand{background:linear-gradient(135deg,var(--primary),var(--primary2));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.brand small{-webkit-text-fill-color:var(--muted)}
.nav-links button.on{background:linear-gradient(90deg,rgba(0,242,254,.16),rgba(79,172,254,.03));box-shadow:inset 3px 0 0 var(--primary)}
header{background:rgba(11,15,25,.72)}
.section-title{font-size:22px;letter-spacing:.3px}
.card{background:linear-gradient(180deg,rgba(26,36,59,.96),rgba(19,27,47,.96));border-radius:var(--radius);animation:rise .35s ease both}
.card:hover{box-shadow:0 12px 30px rgba(0,0,0,.4),0 0 0 1px var(--glow)}
@keyframes rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.price{background:linear-gradient(135deg,var(--primary),var(--primary2));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.btn{border-radius:12px}
.btn.primary{box-shadow:0 6px 18px rgba(0,242,254,.25)}
.btn.primary:hover{filter:brightness(1.08);transform:translateY(-1px)}
.btn.green:hover{background:rgba(16,185,129,.12)}
.btn.red:hover{background:rgba(239,68,68,.12)}
a.btn{text-decoration:none}
.empty{border-radius:var(--radius)}
.tag.free{background:rgba(148,163,184,.2);color:var(--muted)}
.tag.premium{background:rgba(251,191,36,.15);color:var(--premium)}
.key-box{border-radius:12px;background:rgba(0,0,0,.35);user-select:all}
.chatbox{border-radius:20px}
.bottom-nav{background:rgba(19,27,47,.94);backdrop-filter:blur(12px)}
.bottom-nav button.on span{font-weight:700}
.hero{text-align:center;padding:46px 20px 38px;margin-bottom:24px;border-radius:24px;border:1px solid var(--line);background:linear-gradient(160deg,rgba(0,242,254,.10),rgba(79,172,254,.04) 45%,rgba(19,27,47,.6))}
.hero-badge{display:inline-block;padding:6px 14px;border-radius:999px;font-size:12px;font-weight:700;color:var(--premium);background:rgba(251,191,36,.12);border:1px solid rgba(251,191,36,.35);margin-bottom:16px}
.hero-title{font-size:clamp(34px,7vw,52px);font-weight:900;letter-spacing:3px;background:linear-gradient(135deg,var(--primary),var(--primary2));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.hero-intro{color:var(--muted);font-size:15px;max-width:560px;margin:14px auto 24px;line-height:1.8}
.hero-cta{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.cap{display:flex;flex-direction:column;gap:6px}
.cap-text{font-size:13px;color:var(--muted)}
.cap-bar{height:6px;border-radius:99px;background:var(--bg);overflow:hidden}
.cap-bar i{display:block;height:100%;background:linear-gradient(90deg,var(--ok),var(--primary));border-radius:99px}
.cap-bar.full i{background:linear-gradient(90deg,var(--warn),var(--danger))}
.contact-box{background:linear-gradient(160deg,rgba(251,191,36,.08),rgba(0,242,254,.05));border:1px solid rgba(251,191,36,.3);border-radius:16px;padding:16px;margin-bottom:18px;display:flex;flex-direction:column;gap:8px}
.contact-title{font-weight:800;font-size:16px;color:var(--premium)}
.contact-note{color:var(--muted);font-size:13px;line-height:1.6}
.contact-box .row-btns{margin-top:4px;padding-top:4px}
.dlg{position:fixed;inset:0;z-index:120;display:flex;align-items:flex-end;justify-content:center;padding:16px;background:rgba(0,0,0,.65);backdrop-filter:blur(6px)}
@media(min-width:600px){.dlg{align-items:center}}
.dlg-box{width:100%;max-width:460px;max-height:92vh;overflow-y:auto;background:var(--card);border:1px solid var(--line);border-radius:22px;padding:22px;display:flex;flex-direction:column;gap:14px;animation:rise .25s ease both;box-shadow:0 20px 60px rgba(0,0,0,.6)}
.dlg-title{font-size:20px;font-weight:800}
.dlg-sum{background:var(--bg);border:1px solid var(--line);border-radius:14px;padding:14px;text-align:center}
.dlg-acc{background:var(--bg);border:1px dashed var(--primary);border-radius:12px;padding:10px 12px;font-size:14px}
.info-card{background:linear-gradient(180deg,rgba(26,36,59,.96),rgba(19,27,47,.96));border:1px solid var(--line);border-radius:var(--radius);padding:20px}
.info-title{font-size:18px;font-weight:800;margin-bottom:12px}
.info-p{color:var(--muted);font-size:14px;line-height:1.9;margin-bottom:8px}
.steps{display:flex;flex-direction:column;gap:12px}
.step{display:flex;gap:12px;align-items:flex-start}
.step-no{flex:none;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;background:linear-gradient(135deg,var(--primary),var(--primary2));color:#001018}
.step-tx{font-size:14px;line-height:1.8}
.tip{margin-top:14px;padding:12px;border-radius:12px;background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.3);color:var(--premium);font-size:13px;line-height:1.7}
.dl-grid{display:flex;flex-direction:column;gap:10px;margin-bottom:10px}
.dl-grid a.btn{justify-content:flex-start;text-align:left;padding:12px 14px}
#bannerBox{padding:14px 16px;border-radius:14px;margin:0 auto 16px;max-width:800px;font-weight:700;font-size:14px;line-height:1.6;border:1px solid;white-space:pre-wrap}
#bannerBox.info{background:rgba(0,242,254,.08);border-color:rgba(0,242,254,.35);color:var(--primary)}
#bannerBox.warn{background:rgba(245,158,11,.1);border-color:rgba(245,158,11,.4);color:var(--warn)}
#bannerBox.danger{background:rgba(239,68,68,.1);border-color:rgba(239,68,68,.4);color:var(--danger)}
.qr-box{background:#fff;padding:10px;border-radius:12px;width:fit-content;margin:8px auto}
.qr-box svg{width:180px;height:180px;display:block}
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
      <button data-tab="mykeys">🔑 Key များ</button>
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
        <div id="bannerBox" class="hidden"></div>
        <div class="hero">
          <div class="hero-badge">⚡ Premium V2Ray Keys Store</div>
          <h1 class="hero-title">TURBO VPN</h1>
          <p class="hero-intro" id="homeIntro"></p>
          <div class="hero-cta">
            <button class="btn primary" type="button" onclick="showTab('store')">👑 Premium ဝင်မည်</button>
            <button class="btn" type="button" onclick="showTab('mykeys')">🔑 Free Key ယူမည်</button>
          </div>
        </div>
        <div class="grid" id="homeFeatures" style="max-width:800px;margin:0 auto;"></div>
        <div id="homeExtra" style="max-width:800px;margin:18px auto 0;display:flex;flex-direction:column;gap:18px"></div>
      </section>

      <section id="tab-store" class="hidden">
        <div class="section-title">🛒 V2Ray Plan များ</div>
        <div id="storeContact"></div>
        <div class="grid" id="storeGrid"></div>
        <div id="storeEmpty" class="empty hidden">လောလောဆယ် Plan များ မရှိသေးပါ။</div>
      </section>

      <section id="tab-mykeys" class="hidden">
        <div class="section-title">🔑 Key များ</div>
        <div id="keysNotice"></div>
        <div class="grid" id="myKeysGrid"></div>
        <div id="myKeysEmpty" class="empty hidden">လောလောဆယ် Key မရှိသေးပါ။</div>
        <div class="section-title" style="margin-top:30px;font-size:18px">🧾 ကျွန်ုပ်၏ Order များ</div>
        <div class="grid" id="myOrdersGrid"></div>
        <div id="myOrdersEmpty" class="empty hidden">Order မရှိသေးပါ။</div>
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
        <div class="empty" style="padding:18px;text-align:left;margin-top:20px">
          <div style="font-weight:700;margin-bottom:10px">🎁 Trial / Referral Code</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <input id="trialCode" placeholder="Code ထည့်ပါ" maxlength="24" style="flex:1;min-width:160px;text-transform:uppercase">
            <button class="btn primary" id="trialBtn" type="button">ယူမည်</button>
          </div>
          <div class="msg" id="trialMsg" style="margin-top:10px"></div>
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
            <button onclick="switchAdminTab('keys')">Keys</button>
            <button onclick="switchAdminTab('pay')">Payment</button>
            <button onclick="switchAdminTab('plans')">Plans</button>
            <button onclick="switchAdminTab('users')">Users</button>
            <button onclick="switchAdminTab('reports')">Reports</button>
            <button onclick="switchAdminTab('banner')">Banner</button>
            <button onclick="switchAdminTab('coupons')">Coupons</button>
          </div>
          
          <div id="adminTab-orders">
            <h3 style="margin-bottom:15px;color:var(--primary);">Pending Orders</h3>
            <div class="grid" id="adminOrdersGrid"></div>
            <div id="adminOrdersEmpty" class="empty hidden">Order မရှိပါ</div>
          </div>

          <div id="adminTab-keys" class="hidden">
            <h3 style="margin-bottom:15px;color:var(--primary);">Panel &amp; Keys</h3>
            <button class="btn" id="panelTestBtn" type="button" style="margin-bottom:14px">🔌 Server Panel ချိတ်ဆက်မှု စစ်မည်</button>
            <div style="background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px;margin-bottom:16px;display:flex;flex-direction:column;gap:10px;">
              <input id="keyTitle" placeholder="အမည် (ဥပမာ - SG Server 1)" maxlength="80">
              <input id="keyPanel" placeholder="Panel link / Login (မလိုရင် ချန်ထားပါ)" maxlength="300">
              <textarea id="keyValue" placeholder="Key (vmess://... / vless://...)" maxlength="2000"></textarea>
              <input id="keyMax" type="number" min="0" placeholder="လူဦးရေ သတ်မှတ်ရန် (0 = အကန့်အသတ်မရှိ)">
              <select id="keyAccess">
                <option value="free">🆓 Free (လူတိုင်းမြင်ရမယ်)</option>
                <option value="premium">👑 Premium (Premium User သာမြင်ရမယ်)</option>
              </select>
              <button class="btn primary" id="keyAddBtn" type="button">➕ ထည့်မည်</button>
              <div class="msg" id="keyMsg"></div>
            </div>
            <div class="grid" id="adminKeysGrid"></div>
            <div id="adminKeysEmpty" class="empty hidden">Key မရှိသေးပါ</div>
          </div>

          <div id="adminTab-pay" class="hidden">
            <h3 style="margin-bottom:15px;color:var(--primary);">💳 ငွေလွှဲလက်ခံမည့် အကောင့်များ</h3>
            <div style="background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px;margin-bottom:16px;display:flex;flex-direction:column;gap:10px;">
              <input id="payName" placeholder="ဘဏ် / Wallet (ဥပမာ - KBZ Pay)" maxlength="40">
              <input id="payNumber" placeholder="ဖုန်းနံပါတ် / Account (ဥပမာ - 09xxxxxxxxx)" maxlength="40">
              <input id="payHolder" placeholder="အကောင့်နာမည် (မလိုရင် ချန်ထားပါ)" maxlength="60">
              <button class="btn primary" id="payAddBtn" type="button">➕ ထည့်မည်</button>
              <div class="msg" id="payMsg"></div>
            </div>
            <div class="grid" id="adminPayGrid"></div>
            <div id="adminPayEmpty" class="empty hidden">အကောင့် မထည့်ရသေးပါ</div>
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

          <div id="adminTab-banner" class="hidden">
            <h3 style="margin-bottom:15px;color:var(--primary);">📢 Banner</h3>
            <div style="background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:10px;">
              <textarea id="bannerText" maxlength="300" placeholder="ဥပမာ - Server ပြုပြင်နေပါတယ်၊ ခဏစောင့်ပေးပါ"></textarea>
              <select id="bannerLevel">
                <option value="info">ℹ️ အချက်အလက်</option>
                <option value="warn">⚠️ သတိပေး</option>
                <option value="danger">🚨 အရေးကြီး</option>
              </select>
              <button class="btn primary" id="bannerSaveBtn" type="button">💾 သိမ်းမည်</button>
              <button class="btn red" id="bannerClearBtn" type="button">🗑 ဖျက်မည်</button>
              <div class="msg" id="bannerMsg"></div>
            </div>
          </div>

          <div id="adminTab-coupons" class="hidden">
            <h3 style="margin-bottom:15px;color:var(--primary);">🎟 Coupon / Referral / Trial</h3>
            <div style="background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px;margin-bottom:16px;display:flex;flex-direction:column;gap:10px;">
              <input id="couponCode" placeholder="Code (ဥပမာ - FRIEND10)" maxlength="24">
              <select id="couponType">
                <option value="percent">% လျှော့ဈေး</option>
                <option value="fixed">ကျပ် လျှော့ဈေး</option>
                <option value="trial">Premium Trial (ရက်)</option>
              </select>
              <input id="couponValue" type="number" min="1" placeholder="တန်ဖိုး (% / ကျပ် / ရက်)">
              <input id="couponMax" type="number" min="0" placeholder="အသုံးပြုခွင့် (0 = အကန့်အသတ်မရှိ)">
              <input id="couponExp" type="date" title="သက်တမ်းကုန်ရက် (မလိုရင် ချန်ထားပါ)">
              <input id="couponRef" placeholder="Referral ပိုင်ရှင်အမည် (မလိုရင် ချန်ထားပါ)" maxlength="60">
              <button class="btn primary" id="couponAddBtn" type="button">➕ ထည့်မည်</button>
              <div class="msg" id="couponMsg"></div>
            </div>
            <div class="grid" id="adminCouponsGrid"></div>
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

<div id="dlg" class="dlg hidden"><div class="dlg-box" id="dlgBox"></div></div>

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

<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"></script>
<script>
`;
