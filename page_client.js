export const CLIENT = `var SITE = __SITE__;
var $ = function(id){return document.getElementById(id);};
var IS_ADMIN_PAGE = document.body.getAttribute("data-admin")==="1";
var STATUS_TEXT = { pending:"⏳ စောင့်ဆဲ", approved:"✅ အတည်ပြုပြီး", rejected:"❌ ပယ်ချခံရ" };

var myUid = null, myName = "", myEmail = "", myPicture = "", myRole = "free";
var adminKey = sessionStorage.getItem("tmm_akey") || "";
var chatAdmin = false, chatLocked = false, chatJoined = false, chatBanned = false;
var chatWs = null;
var currentDm = null;

var PAGE_TITLES = {
  home: "ပင်မ", store: "V2Ray Store", mykeys: "Key များ",
  messages: "စာများ", group: "Group Chat", profile: "Profile",
  rules: "စည်းကမ်းချက်များ", admin: "Admin Panel"
};

function div(cls, text){var d=document.createElement("div");d.className=cls;if(text!==undefined)d.textContent=text;return d;}
function btn(text, cls, fn){var b=document.createElement("button");b.className=cls;b.textContent=text;b.type="button";b.onclick=fn;return b;}
function mkInput(ph, type){var i=document.createElement("input");i.placeholder=ph;if(type)i.type=type;return i;}

function openDlg(content){ var b=$("dlgBox"); b.innerHTML=""; b.appendChild(content); $("dlg").classList.remove("hidden"); }
function closeDlg(){ $("dlg").classList.add("hidden"); }

function fallbackCopy(t){
  var ta=document.createElement("textarea"); ta.value=t; ta.style.position="fixed"; ta.style.opacity="0";
  document.body.appendChild(ta); ta.select(); try{document.execCommand("copy");}catch(e){} document.body.removeChild(ta);
}
function copyText(t){
  try{
    if(navigator.clipboard && window.isSecureContext){ navigator.clipboard.writeText(t).catch(function(){ fallbackCopy(t); }); return; }
  }catch(e){}
  fallbackCopy(t);
}

function liveEl(k){
  if(!k.live) return null;
  var l = k.live, t, col;
  if(l.server === "down"){ t = "🔴 Server Offline"; col = "var(--danger)"; }
  else if(l.server === "xray_down"){ t = "🟠 Server ရပ်ထားပါတယ် (VPN ပိတ်ထား)"; col = "var(--warn)"; }
  else { t = "🟢 Server Online" + (l.ms != null ? " · " + l.ms + "ms" : ""); col = "var(--ok)"; }
  if(l.active === false){ t += " · ⛔ သက်တမ်း/Data ကုန်"; col = "var(--danger)"; }
  else if(l.daysLeft != null){ t += " · 📶 ကျန် " + l.leftGb + " GB · ⏳ " + l.daysLeft + " ရက်"; }
  var d = div("cap-text", t); d.style.fontWeight = "700"; d.style.color = col;
  return d;
}

function capEl(k){
  var w = div("cap", ""); var max = k.maxUsers || 0;
  var lv = liveEl(k); if(lv) w.appendChild(lv);
  w.appendChild(div("cap-text", "👥 " + k.used + (max ? " / " + max : "") + " ယောက် ယူပြီး · 📋 Copy " + k.copies + " ကြိမ်" + (max ? "" : " · လူဦးရေ အကန့်အသတ်မရှိ")));
  if(max){
    var bar = div("cap-bar" + (k.used >= max ? " full" : ""), ""); var f = document.createElement("i");
    f.style.width = Math.min(100, Math.round(k.used * 100 / max)) + "%"; bar.appendChild(f); w.appendChild(bar);
  }
  return w;
}

function contactAdminDm(){
  api("/api/admin-contact").then(function(d){
    if(d.uid && d.uid !== myUid) openDM(d.uid, d.name || "Admin");
    else { alert("Admin DM မရသေးပါ။ Group Chat မှာ မေးနိုင်ပါတယ်။"); showTab("group"); }
  });
}

function contactBox(){
  var c = SITE.contact || {};
  var box = div("contact-box", "");
  box.appendChild(div("contact-title", "👑 Premium ဝင်ရန် Admin ကို ဆက်သွယ်ပါ"));
  box.appendChild(div("contact-note", c.note || ""));
  var row = div("row-btns", "");
  row.appendChild(btn("💌 Admin Chat", "btn primary", function(){ closeDlg(); contactAdminDm(); }));
  row.appendChild(btn("👥 Group Chat", "btn", function(){ closeDlg(); showTab("group"); }));
  if(c.ownerLink){
    var a = document.createElement("a"); a.className = "btn"; a.href = c.ownerLink; a.target = "_blank"; a.rel = "noopener";
    a.textContent = "✈️ Telegram " + (c.owner || ""); row.appendChild(a);
  }
  if(c.telegramChannel){
    var b = document.createElement("a"); b.className = "btn"; b.href = c.telegramChannel; b.target = "_blank"; b.rel = "noopener";
    b.textContent = "📢 Channel"; row.appendChild(b);
  }
  box.appendChild(row);
  return box;
}

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

  var ex = $("homeExtra"); ex.innerHTML = "";
  function infoCard(title){ var c = div("info-card", ""); c.appendChild(div("info-title", title)); return c; }
  if(SITE.about){
    var a = infoCard(SITE.about.title);
    SITE.about.text.forEach(function(t){ a.appendChild(div("info-p", t)); });
    ex.appendChild(a);
  }
  if(SITE.guide){
    var gd = infoCard(SITE.guide.title); var st = div("steps", "");
    SITE.guide.steps.forEach(function(t, i){
      var r = div("step", ""); r.appendChild(div("step-no", String(i + 1))); r.appendChild(div("step-tx", t)); st.appendChild(r);
    });
    gd.appendChild(st);
    if(SITE.guide.tip) gd.appendChild(div("tip", SITE.guide.tip));
    ex.appendChild(gd);
  }
  if(SITE.downloads){
    var dl = infoCard(SITE.downloads.title); var dg = div("dl-grid", "");
    SITE.downloads.items.forEach(function(it){
      var l = document.createElement("a"); l.className = "btn"; l.href = it.url; l.target = "_blank"; l.rel = "noopener";
      l.textContent = it.icon + " " + it.name; dg.appendChild(l);
    });
    dl.appendChild(dg);
    if(SITE.downloads.note) dl.appendChild(div("info-p", SITE.downloads.note));
    ex.appendChild(dl);
  }
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

function renderBanner(b){
  var box = $("bannerBox"); if(!box) return;
  if(!b || !b.text){ box.className = "hidden"; box.textContent = ""; return; }
  box.className = b.level || "info"; box.textContent = b.text;
}

var FLAG_RULES = [
  ["🇸🇬", /(^|[^A-Za-z])(SG|Singapore)([^A-Za-z]|$)/i],
  ["🇺🇸", /(^|[^A-Za-z])(US|USA|America)([^A-Za-z]|$)/i],
  ["🇯🇵", /(^|[^A-Za-z])(JP|Japan)([^A-Za-z]|$)/i],
  ["🇭🇰", /(^|[^A-Za-z])(HK|Hong ?Kong)([^A-Za-z]|$)/i],
  ["🇬🇧", /(^|[^A-Za-z])(UK|London|England)([^A-Za-z]|$)/i],
  ["🇩🇪", /(^|[^A-Za-z])(DE|Germany)([^A-Za-z]|$)/i],
  ["🇹🇭", /(^|[^A-Za-z])(TH|Thailand)([^A-Za-z]|$)/i]
];

function withFlag(t){
  var s = String(t || "");
  for(var i = 0; i < FLAG_RULES.length; i++){ if(s.indexOf(FLAG_RULES[i][0]) >= 0) return s; }
  for(var j = 0; j < FLAG_RULES.length; j++){ if(FLAG_RULES[j][1].test(s)) return s + " " + FLAG_RULES[j][0]; }
  return s;
}

var FLAG_SVG_SRC = {
  "🇸🇬": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="1" fill="#ED2939"/><rect y="1" width="3" height="1" fill="#fff"/><circle cx="0.75" cy="0.5" r="0.32" fill="#fff"/><circle cx="0.85" cy="0.5" r="0.28" fill="#ED2939"/></svg>',
  "🇯🇵": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#fff"/><circle cx="1.5" cy="1" r="0.6" fill="#BC002D"/></svg>'
};

function flagSvgFor(code){
  if(!code) return "";
  if(code === "🇺🇸"){
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 10"><rect width="19" height="10" fill="#fff"/>';
    for(var i = 0; i < 13; i += 2){ s += '<rect y="' + (i * 10 / 13) + '" width="19" height="' + (10 / 13) + '" fill="#B22234"/>'; }
    s += '<rect width="8" height="' + (70 / 13) + '" fill="#3C3B6E"/></svg>';
    return s;
  }
  return FLAG_SVG_SRC[code] || "";
}

function applyFlagCard(card, title){
  var s = String(title || ""), code = null, i;
  for(i = 0; i < FLAG_RULES.length; i++){ if(s.indexOf(FLAG_RULES[i][0]) >= 0){ code = FLAG_RULES[i][0]; break; } }
  if(!code){ for(i = 0; i < FLAG_RULES.length; i++){ if(FLAG_RULES[i][1].test(s)){ code = FLAG_RULES[i][0]; break; } } }
  var svg = flagSvgFor(code);
  if(!svg) return;
  card.className = card.className + " flag-card";
  card.style.backgroundImage = "linear-gradient(rgba(8,12,24,.72),rgba(8,12,24,.9)), url('data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg) + "')";
  card.style.backgroundSize = "cover";
  card.style.backgroundPosition = "center";
}

function qrEl(text){
  try{
    if(typeof qrcode !== "function") return null;
    var q = qrcode(0, "L"); q.addData(text); q.make();
    var d = div("qr-box", ""); d.innerHTML = q.createSvgTag(4, 2);
    return d;
  }catch(e){ return null; }
}

function loadAdminBanner(){
  api("/api/me").then(function(d){
    var b = d.banner;
    $("bannerText").value = (b && b.text) || "";
    $("bannerLevel").value = (b && b.level) || "info";
  });
}

function saveBanner(clear){
  var msg = $("bannerMsg"); msg.className = "msg err";
  api("/api/admin/banner-set", { method:"POST", json:{ text: clear ? "" : $("bannerText").value.trim(), level: $("bannerLevel").value } })
    .then(function(r){
      if(!r._ok){ msg.textContent = r.error || "မအောင်မြင်ပါ"; return; }
      msg.className = "msg ok";
      msg.textContent = clear ? "ဖျက်ပြီးပါပြီ" : "သိမ်းပြီးပါပြီ";
      if(clear) $("bannerText").value = "";
    });
}

function loadAdminCoupons(){
  api("/api/admin/coupons").then(function(d){
    var g = $("adminCouponsGrid"); g.innerHTML = "";
    (d.coupons || []).forEach(function(c){
      var card = div("card", ""); var body = div("body", "");
      body.appendChild(div("title", c.code));
      var t = c.type === "trial" ? c.value + " ရက် Premium Trial"
            : c.type === "percent" ? c.value + "% လျှော့ဈေး" : c.value + " Ks လျှော့ဈေး";
      body.appendChild(div("desc", t));
      var info = "အသုံးပြုမှု: " + c.uses + (c.maxUses ? " / " + c.maxUses : " (အကန့်အသတ်မရှိ)");
      if(c.ref) info += " · Ref: " + c.ref;
      if(c.expiresAt) info += " · သက်တမ်း: " + new Date(c.expiresAt).toLocaleDateString("my-MM");
      body.appendChild(div("seller", info));
      var row = div("row-btns", "");
      row.appendChild(btn("🗑 ဖျက်", "btn red", function(){
        if(confirm("ဖျက်မလား?")) api("/api/admin/coupon-delete", { method:"POST", json:{ code:c.code } }).then(loadAdminCoupons);
      }));
      body.appendChild(row); card.appendChild(body); g.appendChild(card);
    });
  });
}

function addAdminCoupon(){
  var msg = $("couponMsg"); msg.className = "msg err";
  api("/api/admin/coupon-create", { method:"POST", json:{
    code: $("couponCode").value.trim(), type: $("couponType").value, value: $("couponValue").value,
    maxUses: $("couponMax").value, expiresAt: $("couponExp").value, ref: $("couponRef").value.trim()
  } }).then(function(r){
    if(!r._ok){ msg.textContent = r.error || "မအောင်မြင်ပါ"; return; }
    msg.className = "msg ok"; msg.textContent = "ထည့်ပြီးပါပြီ";
    ["couponCode","couponValue","couponMax","couponExp","couponRef"].forEach(function(id){ $(id).value = ""; });
    loadAdminCoupons();
  });
}

// ==== STORE & KEYS ====
function shrinkImage(file){
  return new Promise(function(resolve){
    if(file.type.indexOf("image/") !== 0 || file.size < 900 * 1024){ resolve(file); return; }
    var img = new Image(), u = URL.createObjectURL(file);
    img.onload = function(){
      var sc = Math.min(1, 1400 / Math.max(img.width, img.height));
      var c = document.createElement("canvas"); c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      c.toBlob(function(b){ URL.revokeObjectURL(u); resolve(b || file); }, "image/jpeg", 0.85);
    };
    img.onerror = function(){ URL.revokeObjectURL(u); resolve(file); };
    img.src = u;
  });
}

function openOrder(p){
  var box = document.createElement("div"); box.style.cssText = "display:flex;flex-direction:column;gap:14px";
  box.appendChild(div("dlg-title", "🛒 Order တင်မည်"));
  var sum = div("dlg-sum", "");
  sum.appendChild(div("title", p.title)); sum.appendChild(div("price", p.price + " Ks"));
  sum.appendChild(div("seller", "⏳ သက်တမ်း: " + p.duration + " ရက်"));
  box.appendChild(sum);

  var accBox = div("", ""); accBox.style.cssText = "display:flex;flex-direction:column;gap:8px";
  box.appendChild(accBox);
  api("/api/payment").then(function(d){
    var accs = d.accounts || [];
    if(!accs.length){ accBox.appendChild(div("seller", "💳 ငွေလွှဲရန် အကောင့်ကို အောက်က Admin ကို ဆက်သွယ်ပြီး မေးပါ။")); return; }
    accBox.appendChild(div("seller", "💳 " + p.price + " Ks ကို အောက်ပါ အကောင့်သို့ ငွေလွှဲပါ:"));
    accs.forEach(function(a){
      var r = div("dlg-acc", ""); r.style.cursor = "pointer";
      r.appendChild(div("seller", a.name + (a.holder ? " · " + a.holder : "")));
      var num = div("title", a.number); num.style.fontSize = "20px"; r.appendChild(num);
      r.appendChild(div("seller", "📋 နှိပ်ပြီး နံပါတ် Copy ယူပါ"));
      r.onclick = function(){ copyText(a.number); alert("✅ နံပါတ် Copy ကူးပြီးပါပြီ"); };
      accBox.appendChild(r);
    });
  });

  var rl = document.createElement("label"); rl.textContent = "🧾 ငွေလွှဲပြေစာ ပုံ (Screenshot)";
  var file = document.createElement("input"); file.type = "file"; file.accept = "image/*";
  var prev = document.createElement("img"); prev.style.cssText = "display:none;max-width:100%;max-height:220px;border-radius:12px;margin-top:8px;object-fit:contain";
  file.onchange = function(){
    var f = file.files[0];
    if(f){ prev.src = URL.createObjectURL(f); prev.style.display = "block"; } else prev.style.display = "none";
  };
  rl.appendChild(file); rl.appendChild(prev); box.appendChild(rl);

  var lb = document.createElement("label"); lb.textContent = "မှတ်ချက် (မလိုရင် ချန်ထားပါ)";
  var note = document.createElement("textarea"); note.maxLength = 500;
  note.placeholder = "ဥပမာ - ငွေလွှဲသူနာမည်၊ ငွေလွှဲချိန်...";
  lb.appendChild(note); box.appendChild(lb);

  var cwrap = div("", ""); cwrap.style.cssText = "display:flex;gap:8px;align-items:stretch";
  var cIn = document.createElement("input"); cIn.placeholder = "Coupon / Referral Code (မရှိရင် ချန်ထား)"; cIn.maxLength = 24;
  cIn.style.cssText = "flex:1;text-transform:uppercase";
  var cMsg = div("seller", "");
  var cBtn = btn("စစ်မည်", "btn", function(){
    var code = cIn.value.trim();
    if(!code){ cMsg.textContent = ""; return; }
    api("/api/coupon/check", { method:"POST", json:{ planId:p.id, code:code } }).then(function(r){
      if(!r._ok){ cMsg.style.color = "var(--danger)"; cMsg.textContent = "❌ " + (r.error || "မမှန်ပါ"); return; }
      cMsg.style.color = "var(--ok)";
      cMsg.textContent = "✅ လျှော့ပြီး: " + r.finalPrice + " Ks (မူလ " + r.planPrice + " Ks)";
    });
  });
  cwrap.appendChild(cIn); cwrap.appendChild(cBtn);
  box.appendChild(cwrap); box.appendChild(cMsg);
  box.appendChild(contactBox());
  var msg = div("msg", ""); box.appendChild(msg);

  var row = div("row-btns", ""); row.style.marginTop = "0";
  row.appendChild(btn("မလုပ်တော့ပါ", "btn", closeDlg));
  var ok = btn("✅ Order တင်မည်", "btn primary", function(){
    var f = file.files[0];
    if(!f){ msg.className = "msg err"; msg.textContent = "ငွေလွှဲပြေစာ ပုံတင်ပါ"; return; }
    ok.disabled = true; msg.className = "msg"; msg.textContent = "တင်နေပါတယ်...";
    shrinkImage(f).then(function(blob){
      var fd = new FormData(); fd.append("photo", blob, "receipt.jpg");
      return fetch("/api/receipt-upload", { method:"POST", body:fd, credentials:"same-origin" });
    }).then(function(r){ return r.json(); }).then(function(d){
      if(!d.receipt) throw new Error(d.error || "ပုံတင် မအောင်မြင်ပါ");
      return api("/api/order", { method:"POST", json:{ planId:p.id, note:note.value.trim(), receipt:d.receipt, coupon:cIn.value.trim() } });
    }).then(function(r){
      if(!r._ok) throw new Error(r.error || "မအောင်မြင်ပါ");
      msg.className = "msg ok"; msg.textContent = "တင်သွင်းပြီးပါပြီ။ Admin အတည်ပြုရန် စောင့်ပါ။";
      setTimeout(function(){ closeDlg(); showTab("mykeys"); }, 1200);
    }).catch(function(e){
      ok.disabled = false; msg.className = "msg err"; msg.textContent = e.message || "Upload error";
    });
  });
  row.appendChild(ok); box.appendChild(row);
  openDlg(box);
}

function loadStore(){
  var sc = $("storeContact"); sc.innerHTML = ""; sc.appendChild(contactBox());
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
      row.appendChild(btn("🛒 Order တင်မည်", "btn primary", function(){ openOrder(p); }));
      body.appendChild(row);
      card.appendChild(body);
      g.appendChild(card);
    });
  });
}

function takeKey(k, b){
  if(b) b.disabled = true;
  api("/api/key-copy", { method:"POST", json:{ id:k.id } }).then(function(r){
    if(!r._ok){ alert(r.error || "မအောင်မြင်ပါ"); loadMyKeys(); return; }
    copyText(r.key);
    alert("✅ Key Copy ကူးပြီးပါပြီ");
    loadMyKeys();
  });
}

function loadMyKeys(){
  api("/api/me").then(function(me){
    if(me.uid){ myRole = me.role || "free"; setUserUI(); }
    return api("/api/keys");
  }).then(function(d){
    var isPrem = (myRole === "premium" || myRole === "admin");
    var n = $("keysNotice"); n.innerHTML = "";
    if(!isPrem){
      var info = div("empty", "🔒 Free Key များကိုသာ မြင်ရပါသည်။ Premium Key များကြည့်ရန် Store မှ Order တင်ပါ။ Admin Approve လုပ်ပြီးတာနဲ့ Premium ချက်ချင်းဖြစ်ပါမည်။");
      info.style.marginBottom = "16px"; info.style.padding = "20px";
      var go = btn("🛒 Store သို့သွားမည်", "btn primary", function(){ showTab("store"); });
      go.style.marginTop = "12px";
      info.appendChild(document.createElement("br")); info.appendChild(go);
      n.appendChild(info);
      n.appendChild(contactBox());
    } else if(myRole === "premium"){
      var pb = div("empty", ""); pb.style.cssText = "margin-bottom:16px;padding:16px;border-color:rgba(251,191,36,.35)";
      var txt = "👑 Premium အသုံးပြုနေပါသည်။ Premium Key များကိုသာ ပြထားပါသည်။";
      if(d.premiumUntil){
        var left = Math.max(0, Math.ceil((d.premiumUntil - Date.now()) / 86400000));
        txt += " ⏳ သက်တမ်းကျန် " + left + " ရက် (" + new Date(d.premiumUntil).toLocaleDateString("my-MM") + " အထိ)";
      }
      pb.textContent = txt; n.appendChild(pb);
    }
    var g = $("myKeysGrid"); g.innerHTML = "";
    var list = d.keys || [];
    $("myKeysEmpty").classList.toggle("hidden", list.length > 0);
    list.forEach(function(k){
      var card = div("card", "");
      var head = div("card-header", "");
      head.appendChild(div("title", withFlag(k.title)));
      head.appendChild(div("tag " + (k.access === "premium" ? "premium" : "free"), k.access === "premium" ? "👑 Premium" : "🆓 Free"));
      card.appendChild(head);
      applyFlagCard(card, k.title);
      var body = div("body", "");
      body.appendChild(capEl(k));
      if(k.claimed){
        if(k.panel){
          body.appendChild(div("seller", "🖥 Panel:"));
          var pb = div("key-box", k.panel); body.appendChild(pb);
        }
        body.appendChild(div("seller", "🔑 သင့် Key:"));
        var off = !!k.live && k.live.server !== "up";
        var kb = div("key-box", k.key); kb.title = off ? "Server ချိတ်ဆက်မရပါ" : "နှိပ်ပြီး Copy ယူပါ";
        kb.onclick = function(){ if(off){ alert("🔴 Server ချိတ်ဆက်မရပါ။ ခဏနေမှ ပြန်ကြိုးစားပါ။"); return; } takeKey(k, null); };
        body.appendChild(kb);
        var qrWrap = div("qr-toggle-wrap", ""); qrWrap.style.display = "none";
        var qrBtn = btn("📱 QR Code ပြမည်", "btn", function(){
          if(qrWrap.childNodes.length === 0){ var qe = qrEl(k.key); if(qe) qrWrap.appendChild(qe); }
          var show = qrWrap.style.display === "none";
          qrWrap.style.display = show ? "block" : "none";
          qrBtn.textContent = show ? "📱 QR ဖျောက်မည်" : "📱 QR Code ပြမည်";
        });
        var r1 = div("row-btns", "");
        var cb = btn(off ? "🔴 Server Offline — Copy ပိတ်ထား" : "📋 Copy", "btn primary", function(){ takeKey(k, cb); });
        cb.disabled = off;
        r1.appendChild(cb); r1.appendChild(qrBtn); body.appendChild(r1);
        body.appendChild(qrWrap);
      } else if(k.full || k.dead){
        var r2 = div("row-btns", ""); var fb = btn(k.dead ? "⛔ ကုန်ဆုံးသွားပါပြီ" : "🔒 လူပြည့်သွားပါပြီ", "btn", function(){});
        fb.disabled = true; r2.appendChild(fb); body.appendChild(r2);
      } else {
        var r3 = div("row-btns", ""); var tb = btn("🔑 Key ယူမည် (Copy)", "btn primary", function(){ takeKey(k, tb); });
        r3.appendChild(tb); body.appendChild(r3);
      }
      card.appendChild(body);
      g.appendChild(card);
    });
    return api("/api/my-orders");
  }).then(function(d){
    var g = $("myOrdersGrid"); g.innerHTML = "";
    var list = d.orders || [];
    $("myOrdersEmpty").classList.toggle("hidden", list.length > 0);
    list.forEach(function(o){
      var card = div("card", "");
      var head = div("card-header", "");
      head.appendChild(div("title", o.planTitle));
      head.appendChild(div("tag " + o.status, STATUS_TEXT[o.status] || o.status));
      card.appendChild(head);
      var body = div("body", "");
      body.appendChild(div("seller", "Order တင်သည့်ရက်စွဲ: " + new Date(o.createdAt).toLocaleDateString("my-MM")));
      if(o.status === "approved") body.appendChild(div("seller", "👑 Premium ဖြစ်ပါပြီ")).style.color = "var(--ok)";
      else if(o.status === "rejected") body.appendChild(div("seller", "❌ ငွေလွှဲမှု မမှန်ကန်ပါ။ Admin ကို ဆက်သွယ်ပါ။")).style.color = "var(--danger)";
      else body.appendChild(div("seller", "⏳ Admin အတည်ပြုရန် စောင့်ဆဲ...")).style.color = "var(--warn)";
      card.appendChild(body);
      g.appendChild(card);
    });
  });
}

// ==== ADMIN LOGIC ====
function switchAdminTab(tabName) {
  document.querySelectorAll('.admin-tabs button').forEach(b => b.classList.remove('on'));
  event.target.classList.add('on');
  ['orders', 'keys', 'pay', 'plans', 'users', 'reports', 'banner', 'coupons'].forEach(t => {
    $('adminTab-' + t).classList.toggle('hidden', t !== tabName);
  });
  if(tabName === 'orders') loadAdminOrders();
  if(tabName === 'keys') loadAdminKeys();
  if(tabName === 'pay') loadAdminPay();
  if(tabName === 'plans') loadAdminPlans();
  if(tabName === 'users') loadAdminUsers();
  if(tabName === 'reports') loadAdminReports();
  if(tabName === 'banner') loadAdminBanner();
  if(tabName === 'coupons') loadAdminCoupons();
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

function adminReceiptImg(key){
  var im = document.createElement("img"); im.className = "chat-img";
  if(key.indexOf("rcp-") !== 0){
    im.src = "/img/" + key; im.onclick = function(){ window.open("/img/" + key, "_blank"); };
    return im;
  }
  fetch("/api/admin/receipt?key=" + encodeURIComponent(key), { headers: { "X-Admin-Key": adminKey }, credentials: "same-origin" })
    .then(function(r){ if(!r.ok) throw new Error("x"); return r.blob(); })
    .then(function(b){ var u = URL.createObjectURL(b); im.src = u; im.onclick = function(){ window.open(u, "_blank"); }; })
    .catch(function(){ im.alt = "ပုံမပေါ်ပါ"; });
  return im;
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
      body.appendChild(div("desc", "Note: " + (o.note || "-")));
      if(o.receipt){
        body.appendChild(div("seller", "🧾 ငွေလွှဲပြေစာ:")); body.appendChild(adminReceiptImg(o.receipt));
      }

      var row = div("row-btns", "");
      row.appendChild(btn("✅ Approve (Premium ပေးမည်)", "btn green", function(){
        api("/api/admin/order-approve", { method:"POST", json:{ id:o.id } }).then(loadAdminOrders);
      }));
      row.appendChild(btn("❌ ပယ်ချ", "btn red", function(){
        api("/api/admin/order-reject", { method:"POST", json:{ id:o.id } }).then(loadAdminOrders);
      }));

      body.appendChild(row);
      card.appendChild(body);
      g.appendChild(card);
    });
  });
}

function loadAdminKeys(){
  api("/api/admin/keys").then(function(d){
    var g=$("adminKeysGrid"); g.innerHTML="";
    var list=d.keys||[];
    $("adminKeysEmpty").classList.toggle("hidden", list.length>0);
    list.forEach(function(k){
      var card = div("card", "");
      var head = div("card-header", "");
      head.appendChild(div("title", withFlag(k.title)));
      head.appendChild(div("tag " + (k.access === "premium" ? "premium" : "free"), k.access === "premium" ? "👑 Premium" : "🆓 Free"));
      card.appendChild(head);
      applyFlagCard(card, k.title);
      var body = div("body", "");
      if(k.panel) body.appendChild(div("desc", "Panel: " + k.panel));
      body.appendChild(div("key-box", k.key));
      body.appendChild(capEl(k));
      var maxIn = mkInput("လူဦးရေ (0 = အကန့်အသတ်မရှိ)", "number"); maxIn.min = "0"; maxIn.value = k.maxUsers || 0;
      body.appendChild(maxIn);
      var row = div("row-btns", "");
      row.appendChild(btn("💾 လူဦးရေ သိမ်း", "btn green", function(){
        api("/api/admin/key-update", { method:"POST", json:{ id:k.id, maxUsers:maxIn.value } }).then(loadAdminKeys);
      }));
      var toAccess = k.access === "premium" ? "free" : "premium";
      row.appendChild(btn(toAccess === "premium" ? "👑 Premium ပြောင်း" : "🆓 Free ပြောင်း", "btn", function(){
        api("/api/admin/key-update", { method:"POST", json:{ id:k.id, access:toAccess } }).then(loadAdminKeys);
      }));
      row.appendChild(btn("♻ Reset", "btn", function(){
        if(confirm("ယူထားသူစာရင်း (Copy count) ကို 0 ပြန်လုပ်မလား?")) api("/api/admin/key-update", { method:"POST", json:{ id:k.id, reset:true } }).then(loadAdminKeys);
      }));
      row.appendChild(btn("🗑 ဖျက်", "btn red", function(){
        if(confirm("ဖျက်မလား?")) api("/api/admin/key-delete", { method:"POST", json:{ id:k.id } }).then(loadAdminKeys);
      }));
      body.appendChild(row);
      card.appendChild(body);
      g.appendChild(card);
    });
  });
}

function addAdminKey(){
  var title = $("keyTitle").value.trim(), key = $("keyValue").value.trim();
  var msg = $("keyMsg"); msg.className = "msg err";
  if(!title || !key){ msg.textContent = "အမည်နဲ့ Key ထည့်ပါ"; return; }
  api("/api/admin/key-create", { method:"POST", json:{
    title:title, panel:$("keyPanel").value.trim(), key:key, access:$("keyAccess").value, maxUsers:$("keyMax").value
  } }).then(function(r){
    if(!r._ok){ msg.textContent = r.error || "မအောင်မြင်ပါ"; return; }
    msg.className = "msg ok"; msg.textContent = "ထည့်ပြီးပါပြီ";
    $("keyTitle").value = ""; $("keyPanel").value = ""; $("keyValue").value = ""; $("keyMax").value = "";
    loadAdminKeys();
  });
}

var payAccounts = [];

function savePay(){
  return api("/api/admin/payment-set", { method:"POST", json:{ accounts: payAccounts } });
}

function loadAdminPay(){
  api("/api/admin/payment").then(function(d){
    payAccounts = d.accounts || [];
    var g = $("adminPayGrid"); g.innerHTML = "";
    $("adminPayEmpty").classList.toggle("hidden", payAccounts.length > 0);
    payAccounts.forEach(function(a, i){
      var card = div("card", ""); var body = div("body", "");
      body.appendChild(div("title", a.name));
      var num = div("price", a.number); num.style.fontSize = "22px"; body.appendChild(num);
      if(a.holder) body.appendChild(div("seller", "👤 " + a.holder));
      var row = div("row-btns", "");
      row.appendChild(btn("🗑 ဖျက်", "btn red", function(){
        if(!confirm("ဖျက်မလား?")) return;
        payAccounts.splice(i, 1); savePay().then(loadAdminPay);
      }));
      body.appendChild(row); card.appendChild(body); g.appendChild(card);
    });
  });
}

function addAdminPay(){
  var name = $("payName").value.trim(), number = $("payNumber").value.trim();
  var msg = $("payMsg"); msg.className = "msg err";
  if(!name || !number){ msg.textContent = "ဘဏ်/Wallet နာမည်နဲ့ နံပါတ် ထည့်ပါ"; return; }
  if(payAccounts.length >= 10){ msg.textContent = "အကောင့် ၁၀ ခုအထိပဲ ထည့်လို့ရပါတယ်"; return; }
  payAccounts.push({ name:name, number:number, holder:$("payHolder").value.trim() });
  savePay().then(function(r){
    if(!r._ok){ payAccounts.pop(); msg.textContent = r.error || "မအောင်မြင်ပါ"; return; }
    msg.className = "msg ok"; msg.textContent = "ထည့်ပြီးပါပြီ";
    $("payName").value = ""; $("payNumber").value = ""; $("payHolder").value = "";
    loadAdminPay();
  });
}

function showCreatePlan(){
  var box = document.createElement("div"); box.style.cssText = "display:flex;flex-direction:column;gap:14px";
  box.appendChild(div("dlg-title", "➕ Plan အသစ်ထည့်မည်"));
  function field(label, el){ var l = document.createElement("label"); l.textContent = label; l.appendChild(el); box.appendChild(l); return el; }
  var t = field("Plan အမည်", mkInput("ဥပမာ - 1 Month Unlimited"));
  var pr = field("ဈေးနှုန်း (ကျပ်)", mkInput("ဥပမာ - 5000", "number"));
  var du = field("သက်တမ်း (ရက်)", mkInput("ဥပမာ - 30", "number"));
  var de = field("အကြောင်းအရာ", document.createElement("textarea")); de.placeholder = "ဥပမာ - 10Mbps, Unlimited Data"; de.maxLength = 200;
  var msg = div("msg err", ""); box.appendChild(msg);
  var row = div("row-btns", ""); row.style.marginTop = "0";
  row.appendChild(btn("မလုပ်တော့ပါ", "btn", closeDlg));
  row.appendChild(btn("✅ ထည့်မည်", "btn primary", function(){
    if(!t.value.trim() || !pr.value.trim() || !du.value.trim()){ msg.textContent = "အမည်၊ ဈေးနှုန်း၊ သက်တမ်း ဖြည့်ပါ"; return; }
    api("/api/admin/create-plan", { method:"POST", json:{ title:t.value.trim(), price:pr.value.trim(), duration:du.value.trim(), description:de.value.trim() } })
      .then(function(){ closeDlg(); loadAdminPlans(); });
  }));
  box.appendChild(row);
  openDlg(box);
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
      if(u.role === "premium") roleTxt += u.premiumUntil ? " (" + new Date(u.premiumUntil).toLocaleDateString("my-MM") + " အထိ)" : " (သက်တမ်းမကန့်သတ်)";
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
  renderBanner(d.banner);
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

$("profSaveBtn").onclick = function(){
  var m = $("profMsg"); m.className = "msg err"; m.textContent = "";
  var name = $("profNameIn").value.trim();
  var f = $("profPhotoIn").files && $("profPhotoIn").files[0];
  var save = function(photoKey){
    api("/api/profile-update", { method:"POST", json:{ name:name, photoKey:photoKey || "" } }).then(function(r){
      if(!r._ok){ m.textContent = r.error || "မအောင်မြင်ပါ"; return; }
      myName = r.name || myName; myPicture = r.picture || myPicture; setUserUI();
      m.className = "msg ok"; m.textContent = "သိမ်းပြီးပါပြီ";
      $("profNameIn").value = ""; $("profPhotoIn").value = "";
    });
  };
  if(!name && !f){ m.textContent = "နာမည် သို့မဟုတ် ပုံ ရွေးပါ"; return; }
  if(!f){ save(""); return; }
  var fd = new FormData(); fd.append("photo", f);
  fetch("/api/chat-photo", { method:"POST", body:fd, credentials:"same-origin" })
    .then(function(r){ return r.json(); })
    .then(function(d){ if(d.photoKey) save(d.photoKey); else { m.textContent = d.error || "ပုံတင်မရပါ"; } })
    .catch(function(){ m.textContent = "ပုံတင်မရပါ"; });
};
$("trialBtn").onclick = function(){
  var code = $("trialCode").value.trim(); var m = $("trialMsg");
  if(!code){ m.className = "msg err"; m.textContent = "Code ထည့်ပါ"; return; }
  api("/api/coupon/redeem", { method:"POST", json:{ code:code } }).then(function(r){
    if(!r._ok){ m.className = "msg err"; m.textContent = r.error || "မအောင်မြင်ပါ"; return; }
    m.className = "msg ok"; m.textContent = "🎉 Premium " + r.days + " ရက် အစမ်းရပါပြီ";
    $("trialCode").value = "";
    api("/api/me").then(function(me){ myRole = me.role || "free"; setUserUI(); });
  });
};
$("bannerSaveBtn").onclick = function(){ saveBanner(false); };
$("bannerClearBtn").onclick = function(){ if(confirm("Banner ဖျက်မလား?")) saveBanner(true); };
$("couponAddBtn").onclick = addAdminCoupon;
$("keyAddBtn").onclick = addAdminKey;
$("payAddBtn").onclick = addAdminPay;
$("panelTestBtn").onclick = function(){
  api("/api/admin/panel-test").then(function(d){
    if(d.note){ alert(d.note); return; }
    alert((d.results || []).map(function(r){ return (r.ok ? "✅ " : "❌ ") + r.url + " — " + r.msg; }).join(String.fromCharCode(10)));
  });
};
$("dlg").onclick = function(e){ if(e.target === this) closeDlg(); };

$("adminLoginBtn").onclick = function(){
  var k = $("adminKeyInput").value.trim(); if(!k) return;
  adminKey = k; sessionStorage.setItem("tmm_akey", k);
  $("adminMsg").textContent = ""; loadAdmin(); chatConnect();
};
$("adminLogout").onclick = function(){
  adminKey = ""; sessionStorage.removeItem("tmm_akey");
  loadAdmin(); chatConnect();
};
`;
