/* jawrab player — JP
   مشغل كامل: تحكم مخصص، جودات، ترجمة، إعلانات VAST، شاشة عائمة، قفل، تحميل... */
(function(){
if(window.JP) return;

var CORS_PROXY='https://calm-frost-26fb.jawrab.workers.dev/?url=';
var REPORT_URL='https://formspree.io/f/maqkwjqv';

/* ───────────── CSS ───────────── */
var CSS=`
#jp{position:fixed;inset:0;z-index:300;background:#0d0f1f;display:none;color:#fff;direction:rtl;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}
#jp.on{display:block}
#jp *{-webkit-tap-highlight-color:transparent}
#jp button{font-family:inherit;color:inherit;border:none;background:none;cursor:pointer}
.jp-main{position:absolute;inset:0;overflow-y:auto;-webkit-overflow-scrolling:touch}
.jp-wrap{position:relative;width:100%;background:#000;aspect-ratio:16/9;max-height:70vh;overflow:hidden;direction:ltr;touch-action:manipulation;user-select:none;-webkit-user-select:none}
.jp-wrap video{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000}
.jp-wrap.fs{position:fixed;inset:0;width:100vw;height:100vh;max-height:none;aspect-ratio:auto!important;z-index:2147483000}
.jp-wrap.stretch video{object-fit:fill}

/* top bar */
.jp-top{position:absolute;top:0;left:0;right:0;display:flex;align-items:center;gap:8px;padding:8px 10px;background:linear-gradient(rgba(0,0,0,.75),transparent);z-index:20;transition:opacity .3s;direction:ltr}
.jp-tt{flex:1;font-size:.85em;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;direction:rtl;text-align:right}
.jp-ib{width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;font-size:.9em;flex-shrink:0}
.jp-ib:active{background:rgba(255,255,255,.25)}
.jp-wrap.fs .jp-top{display:none}

/* controls */
.jp-ctrl{position:absolute;left:0;right:0;bottom:0;padding:0 12px 18px;background:linear-gradient(to top,rgba(0,0,0,.75),transparent);z-index:20;transition:opacity .3s;padding-top:28px}
.jp-row{display:flex;align-items:center;justify-content:space-between}
.jp-time{font-size:.98em;font-weight:600;background:rgba(0,0,0,.4);padding:5px 12px;border-radius:14px;text-shadow:0 1px 2px #000}
.jp-btns{display:flex;gap:10px;align-items:center}
.jp-cb{width:46px;height:46px;border-radius:50%;background:rgba(255,255,255,.16);display:flex;align-items:center;justify-content:center;font-size:1.2em;font-weight:700}
.jp-cb:active{background:rgba(255,255,255,.32);transform:scale(.92)}
.jp-cb span{font-size:.62em}
.jp-wrap.hide .jp-ctrl,.jp-wrap.hide .jp-top,.jp-wrap.hide .jp-fsbar{opacity:0;pointer-events:none}
.jp-wrap.fs .jp-ctrl{padding-bottom:calc(20px + env(safe-area-inset-bottom))}

/* progress */
.jp-prog{position:absolute;left:0;right:0;bottom:0;height:9px;background:rgba(255,255,255,.2);z-index:21;transition:height .35s cubic-bezier(.4,0,.2,1)}
.jp-wrap.hide .jp-prog{height:3px}
.jp-wrap .jp-prog.act{height:13px;transition-duration:.15s}
.jp-bar{height:100%;width:0;background:#ff375f;position:relative}
.jp-bar::after{content:"";position:absolute;right:-6px;top:50%;width:13px;height:13px;border-radius:50%;background:#ff375f;transform:translateY(-50%) scale(0);transition:transform .15s}
.jp-prog.act .jp-bar::after{transform:translateY(-50%) scale(1)}
.jp-touch{position:absolute;left:0;right:0;bottom:0;height:30px;z-index:22;touch-action:none}
.jp-tp{position:absolute;bottom:calc(100% + 12px);transform:translateX(-50%);background:rgba(0,0,0,.75);padding:4px 10px;border-radius:12px;font-size:.8em;opacity:0;pointer-events:none;white-space:nowrap}
.jp-pl{position:absolute;bottom:100%;width:2px;height:16px;background:#fff;transform:translateX(-50%);opacity:0}
.jp-prog.act .jp-tp,.jp-prog.act .jp-pl{opacity:1}

/* indicators */
.jp-pulse{position:absolute;top:50%;left:50%;width:80px;height:80px;margin:-40px 0 0 -40px;border-radius:50%;background:rgba(255,255,255,.28);pointer-events:none;display:none;z-index:15}
.jp-pulse.go{display:block;animation:jpP .6s ease-out forwards}
@keyframes jpP{from{transform:scale(.7);opacity:.9}to{transform:scale(1.6);opacity:0}}
.jp-jump{position:absolute;top:50%;margin-top:-18px;background:rgba(0,0,0,.65);padding:7px 14px;border-radius:20px;font-weight:700;font-size:.85em;opacity:0;pointer-events:none;z-index:15}
.jp-jf{right:18px}.jp-jb{left:18px}
.jp-jump.go{animation:jpJ .8s}
@keyframes jpJ{0%,100%{opacity:0;transform:scale(.85)}40%,60%{opacity:.95;transform:scale(1.05)}}
.jp-badge{position:absolute;top:18%;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.65);border:1px solid rgba(255,255,255,.2);padding:7px 18px;border-radius:24px;font-weight:800;display:none;z-index:15}
.jp-badge i{color:#ff375f;margin-left:6px}
.jp-err{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,.78);padding:16px 24px;border-radius:12px;text-align:center;display:none;z-index:30;direction:rtl}
.jp-err i{font-size:2em;color:#ffeb3b;margin-bottom:8px;display:block}
.jp-spin{position:absolute;top:50%;left:50%;width:42px;height:42px;margin:-21px 0 0 -21px;border:4px solid rgba(255,255,255,.25);border-top-color:#ff375f;border-radius:50%;animation:jpS 1s linear infinite;display:none;z-index:14;pointer-events:none}
@keyframes jpS{to{transform:rotate(360deg)}}

/* subtitles */
.jp-sub{position:absolute;left:5%;right:5%;bottom:14%;text-align:center;pointer-events:none;z-index:12;display:none;direction:rtl}
.jp-sub span{display:inline-block;color:var(--sc,#fff);font-family:var(--sf,system-ui,sans-serif);font-size:var(--ss,16px);font-weight:700;line-height:1.5;text-shadow:var(--sh,0 2px 8px #000);padding:3px 10px;white-space:pre-line;max-width:100%}
.jp-wrap.fs .jp-sub{font-size:1.6em;bottom:16%}
.jp-wrap.fs .jp-sub span{font-size:calc(var(--ss,16px)*1.5)}

/* fullscreen extras bar */
.jp-fsbar{display:none;position:absolute;top:0;left:0;right:0;z-index:25;padding:calc(env(safe-area-inset-top) + 8px) 10px 6px;align-items:flex-start;gap:6px;transition:opacity .3s}
.jp-wrap.fs .jp-fsbar{display:flex}
.jp-fsx{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;flex:1}
.jp-fsx::-webkit-scrollbar{display:none}
.jp-pill{flex-shrink:0;background:rgba(255,255,255,.14);padding:7px 13px;border-radius:20px;font-size:.78em;font-weight:600;text-shadow:0 1px 3px #000;white-space:nowrap;display:inline-flex;gap:5px;align-items:center;transition:opacity .2s,transform .2s,max-width .2s,padding .2s}
.jp-pill:active{background:rgba(255,255,255,.3)}
.jp-pill.on{background:rgba(255,55,95,.4)}
.jp-fsx .jp-pill{max-width:0;padding-left:0;padding-right:0;opacity:0;transform:scale(.7);overflow:hidden;pointer-events:none}
.jp-fsx.open .jp-pill{max-width:160px;padding-left:13px;padding-right:13px;opacity:1;transform:none;pointer-events:auto}
#fsMore{font-size:1.1em;padding:8px 12px}

/* ads */
.jp-ad{position:absolute;inset:0;background:#000;z-index:40;display:none;align-items:center;justify-content:center;cursor:pointer}
.jp-ad.on{display:flex}
.jp-ad video{width:100%;height:100%;object-fit:contain;pointer-events:none}
.jp-adl{position:absolute;top:10px;right:10px;background:rgba(0,0,0,.6);color:#bbb;padding:4px 10px;border-radius:6px;font-size:.7em}
.jp-adc{position:absolute;bottom:16px;left:14px;background:rgba(0,0,0,.7);color:#ccc;padding:7px 14px;border-radius:8px;font-size:.78em;direction:rtl}
.jp-ads{position:absolute;bottom:16px;left:14px;background:rgba(0,0,0,.75);border:1px solid rgba(255,255,255,.4)!important;padding:8px 16px;border-radius:8px;font-size:.82em;display:none}
.jp-ads.on{display:block}

/* lock */
.jp-lock{position:absolute;inset:0;z-index:60;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.01);touch-action:none}
.jp-lock.on{display:flex}
.jp-lh{position:absolute;top:30%;background:rgba(0,0,0,.75);padding:9px 18px;border-radius:20px;font-size:.82em;opacity:0;transition:opacity .3s;pointer-events:none;direction:rtl}
.jp-lh.on{opacity:1}
.jp-unl{background:rgba(255,55,95,.94)!important;padding:13px 26px;border-radius:30px;font-weight:700;display:none;box-shadow:0 4px 20px rgba(0,0,0,.5)}
.jp-unl.on{display:block}

/* autoplay next */
.jp-next{position:absolute;inset:0;background:rgba(0,0,0,.78);z-index:50;display:none;flex-direction:column;align-items:center;justify-content:center;gap:12px;direction:rtl}
.jp-next.on{display:flex}
.jp-ring{position:relative;width:72px;height:72px;display:flex;align-items:center;justify-content:center}
.jp-ring svg{position:absolute;inset:0;transform:rotate(-90deg)}
.jp-ring .t{fill:none;stroke:rgba(255,255,255,.18);stroke-width:5}
.jp-ring .r{fill:none;stroke:#ff375f;stroke-width:5;stroke-dasharray:201;stroke-dashoffset:0;transition:stroke-dashoffset 1s linear;stroke-linecap:round}
.jp-ring span{font-size:1.6em;font-weight:800;position:relative}
.jp-nb{display:flex;gap:10px}
.jp-nb button{padding:9px 20px;border-radius:12px;background:rgba(255,255,255,.14);font-size:.88em}
.jp-nb button.p{background:rgba(255,55,95,.25);border:1px solid #ff375f!important;color:#ff375f;font-weight:700}
#jpNL{font-size:.88em;color:#ddd;text-align:center;padding:0 16px}

/* below the wrap */
.jp-wrap{z-index:2}
.jp-pbg{position:absolute;top:0;left:0;right:0;height:620px;background-size:cover;background-position:center top;opacity:.6;filter:blur(4px);-webkit-mask-image:linear-gradient(#000 0%,#000 30%,transparent 100%);mask-image:linear-gradient(#000 0%,#000 30%,transparent 100%);pointer-events:none;z-index:0}
.jp-bar2,.jp-slot{position:relative;z-index:1}
.jp-bar2{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;padding:14px 14px 6px;max-width:900px;margin:auto}
.jp-bar2::-webkit-scrollbar{display:none}
.jp-bar2 .jp-pill{flex-direction:column;justify-content:center;gap:6px;padding:11px 2px 9px;border-radius:14px;font-size:.72em;font-weight:600;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.09);color:#dce3f0;text-shadow:none;min-width:0}
.jp-bar2 .jp-pill i{font-size:1.45em;line-height:1}
.jp-bar2 .jp-pill:active{background:rgba(255,255,255,.18)}
.jp-bar2 .jp-pill.on{background:rgba(255,55,95,.22);border-color:rgba(255,55,95,.5);color:#ff7a93}
.jp-slot{padding:6px 14px 40px;max-width:900px;margin:auto}

/* embed */
#jp.embed #jpClose,#jp.embed #jpMin,#jp.embed .jp-bar2,#jp.embed .jp-slot,#jp.embed .jp-pbg{display:none!important}
#jp.embed .jp-wrap{position:fixed;inset:0;width:100%;height:100%;max-height:none;aspect-ratio:auto}
/* mini */
#jp.mini{inset:auto;top:0;left:0;width:0;height:0;overflow:visible;background:transparent}
#jp.mini .jp-main{position:static;overflow:visible}
#jp.mini .jp-pbg,#jp.mini .jp-bar2,#jp.mini .jp-slot,#jp.mini .jp-top,#jp.mini .jp-ctrl,#jp.mini .jp-fsbar,#jp.mini .jp-sub,#jp.mini .jp-jump{display:none!important}
#jp.mini .jp-wrap{position:fixed;left:12px;top:calc(100vh - 230px);width:240px;height:135px;max-height:none;aspect-ratio:auto;border-radius:14px;z-index:2147483000;box-shadow:0 12px 40px rgba(0,0,0,.85),0 0 0 1px rgba(255,255,255,.12);cursor:grab;touch-action:none}
#jp.mini .jp-prog{height:3px}
.jp-mb{display:none;position:absolute;inset:0;z-index:30;background:rgba(0,0,0,.4);align-items:center;justify-content:space-around;opacity:0;transition:opacity .2s}
#jp.mini .jp-mb{display:flex}
#jp.mini .jp-mb.show{opacity:1}
.jp-mb button{width:38px;height:38px;border-radius:50%;background:rgba(0,0,0,.6);font-size:.9em;pointer-events:none}
#jp.mini .jp-mb.show button{pointer-events:auto}
.jp-mb #mbC{background:rgba(180,20,20,.8)}

/* glass modal */
.jp-modal{position:fixed;inset:0;z-index:2147483600;background:rgba(0,0,0,.5);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:14px;direction:rtl;animation:jpF .2s}
@keyframes jpF{from{opacity:0}to{opacity:1}}
.jp-box{background:rgba(10,14,34,.9);backdrop-filter:blur(30px) saturate(1.8);border:1px solid rgba(255,255,255,.13);border-radius:20px;width:100%;max-width:380px;max-height:84vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.7);overflow:hidden}
.jp-bh{display:flex;align-items:center;justify-content:space-between;padding:13px 16px;border-bottom:1px solid rgba(255,255,255,.08);font-weight:700;font-size:.92em}
.jp-bh i{color:#ff4757;margin-left:6px}
.jp-x{width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.09)}
.jp-bb{padding:12px 14px 16px;overflow-y:auto;display:flex;flex-direction:column;gap:8px}
.jp-opt{display:flex;align-items:center;gap:10px;width:100%;text-align:right;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08)!important;padding:12px 14px;border-radius:12px;font-size:.88em;font-weight:600}
.jp-opt:active{background:rgba(255,255,255,.14)}
.jp-opt.on{background:rgba(255,55,95,.2);border-color:rgba(255,55,95,.5)!important;color:#ff375f}
.jp-opt .v{margin-right:auto;font-size:.8em;color:#aaa;font-weight:500}
.jp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.jp-grid .jp-opt{justify-content:center;padding:12px 4px}
.jp-line{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:.85em}
.jp-line .ct{display:flex;align-items:center;gap:8px}
.jp-line .ct button{width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.12);font-size:1.1em}
.jp-line .ct b{min-width:44px;text-align:center}
.jp-sel{background:rgba(255,255,255,.1);color:#fff;border:none;border-radius:8px;padding:6px 8px;font-size:.82em;max-width:170px;outline:none}
.jp-sel option{background:#1a1a2e}
.jp-cols{display:flex;gap:8px}
.jp-cols i{width:26px;height:26px;border-radius:50%;border:2px solid rgba(255,255,255,.25);cursor:pointer;display:block}
.jp-cols i.on{border-color:#fff;transform:scale(1.2)}
.jp-pg{height:8px;background:rgba(255,255,255,.1);border-radius:6px;overflow:hidden}
.jp-pg div{height:100%;width:0;background:linear-gradient(90deg,#ff4757,#ff375f);transition:width .3s}
.jp-st{font-size:.8em;color:#ccc;text-align:center;min-height:1.2em}
.jp-dlc{position:fixed;top:90px;left:14px;width:60px;height:60px;border-radius:50%;background:conic-gradient(#ff4757 var(--p,0%),rgba(255,255,255,.14) 0);z-index:2147483640;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(0,0,0,.6);cursor:grab;touch-action:none;user-select:none}
.jp-dlc:before{content:"";position:absolute;inset:4px;border-radius:50%;background:#1a1a2e}
.jp-dlc .n{position:relative;font-weight:800;font-size:.72em;color:#fff}
.jp-dlt{position:fixed;left:50%;bottom:34px;width:64px;height:64px;margin-left:-32px;border-radius:50%;background:rgba(30,30,45,.92);border:2px solid rgba(255,255,255,.25);color:#fff;display:grid;place-items:center;font-size:1.3em;z-index:2147483639;opacity:0;transform:translateY(30px) scale(.8);transition:all .2s;pointer-events:none}
.jp-dlt.on{opacity:1;transform:none}.jp-dlt.hot{transform:scale(1.25);background:#ff4757;border-color:#ff4757}
#jpToast{position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:rgba(14,18,38,.97);padding:9px 20px;border-radius:22px;font-size:.82em;z-index:2147483647;border:1px solid rgba(255,255,255,.1);opacity:0;transition:opacity .25s;pointer-events:none;direction:rtl;white-space:nowrap;color:#fff;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}
#jpToast.on{opacity:1}
.jp-yt{position:absolute;inset:0;overflow:hidden;background:#000;display:none;pointer-events:none}
.jp-yt iframe{position:absolute;left:0;top:-60px;width:100%;height:calc(100% + 120px);border:0;pointer-events:none}
.jp-wrap.yt .jp-yt{display:block}.jp-wrap.yt #jpVid{visibility:hidden}
`;

/* ───────────── DOM ───────────── */
var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);

var root=document.createElement('div');root.id='jp';
root.innerHTML=`
<div class="jp-main" id="jpMain">
 <div class="jp-wrap" id="jpWrap">
  <video id="jpVid" playsinline webkit-playsinline></video>
  <div class="jp-yt" id="jpYT"></div>
  <div class="jp-spin" id="jpSpin"></div>
  <div class="jp-sub" id="jpSub"><span id="jpSubT"></span></div>
  <div class="jp-pulse" id="jpPulse"></div>
  <div class="jp-jump jp-jf" id="jpJF">+10s</div>
  <div class="jp-jump jp-jb" id="jpJB">-10s</div>
  <div class="jp-badge" id="jpBadge"><i class="fas fa-forward"></i>2×</div>
  <div class="jp-top" id="jpTop">
    <button class="jp-ib" id="jpClose" title="إغلاق"><i class="fas fa-times"></i></button>
    <div class="jp-tt" id="jpTT"></div>
    <button class="jp-ib" id="jpMin" title="تصغير"><i class="fas fa-chevron-down"></i></button>
  </div>
  <div class="jp-fsbar" id="jpFsBar">
    <button class="jp-pill" id="fsMore"><i class="fas fa-ellipsis-vertical"></i></button>
    <div class="jp-fsx" id="fsX">
      <button class="jp-pill" data-a="heart"><i class="far fa-heart"></i><span>أضف</span></button>
      <button class="jp-pill" data-a="lock"><i class="fas fa-lock"></i>قفل</button>
      <button class="jp-pill" data-a="loop"><i class="fas fa-redo"></i><span>تكرار</span></button>
      <button class="jp-pill" data-a="speed"><i class="fas fa-gauge-high"></i><span id="fsSp">السرعة</span></button>
      <button class="jp-pill" data-a="qual" id="fsQ" style="display:none"><i class="fas fa-layer-group"></i>الجودة</button>
      <button class="jp-pill" data-a="sub" id="fsS" style="display:none"><i class="fas fa-closed-captioning"></i>ترجمة</button>
      <button class="jp-pill" data-a="dl"><i class="fas fa-download"></i>تحميل</button>
   <button class="jp-pill" data-a="share"><i class="fas fa-share-nodes"></i>مشاركة</button>
      <button class="jp-pill" data-a="report"><i class="fas fa-flag"></i>إبلاغ</button>
    </div>
  </div>
  <div class="jp-ctrl" id="jpCtrl"><div class="jp-row">
    <span class="jp-time" id="jpTime">00:00 / 00:00</span>
    <div class="jp-btns">
      <button class="jp-cb" id="jpMute"><i class="fas fa-volume-up"></i></button>
      <button class="jp-cb" id="jpQ" style="display:none"><span id="jpQL">HD</span></button>
      <button class="jp-cb" id="jpCC" style="display:none"><i class="fas fa-closed-captioning"></i></button>
      <button class="jp-cb" id="jpStr" style="display:none"><i class="fas fa-expand-alt"></i></button>
      <button class="jp-cb" id="jpFs"><i class="fas fa-expand"></i></button>
    </div></div></div>
  <div class="jp-prog" id="jpProg"><div class="jp-bar" id="jpBar"></div><div class="jp-tp" id="jpTP">00:00</div><div class="jp-pl" id="jpPL"></div></div>
  <div class="jp-touch" id="jpTouch"></div>
  <div class="jp-err" id="jpErr"><i class="fas fa-triangle-exclamation"></i><div>تعذر تشغيل الفيديو</div></div>
  <div class="jp-ad" id="jpAd"><video id="jpAdV" playsinline webkit-playsinline></video><div class="jp-adl">إعلان</div><div class="jp-adc" id="jpAdC"></div><button class="jp-ads" id="jpAdS"><i class="fas fa-forward"></i> تخطي الإعلان</button></div>
  <div class="jp-lock" id="jpLock"><div class="jp-lh" id="jpLH">الشاشة مقفلة — انقر لإظهار زر الفتح</div><button class="jp-unl" id="jpUnl"><i class="fas fa-lock-open"></i> فتح الشاشة</button></div>
  <div class="jp-next" id="jpNext"><div class="jp-ring"><svg viewBox="0 0 72 72"><circle class="t" cx="36" cy="36" r="32"/><circle class="r" id="jpRing" cx="36" cy="36" r="32"/></svg><span id="jpNum">5</span></div><div id="jpNL"></div><div class="jp-nb"><button id="jpNC">إلغاء</button><button class="p" id="jpNP">تشغيل الآن</button></div></div>
  <div class="jp-mb" id="jpMB"><button id="mbX"><i class="fas fa-expand-alt"></i></button><button id="mbP"><i class="fas fa-pause"></i></button><button id="mbC"><i class="fas fa-times"></i></button></div>
 </div>
 <div class="jp-pbg" id="jpIBG"></div>
 <div class="jp-bar2">
   <button class="jp-pill" data-a="heart"><i class="far fa-heart"></i><span>المفضلة</span></button>
   <button class="jp-pill" data-a="dl"><i class="fas fa-download"></i>تحميل</button>
   <button class="jp-pill" data-a="share"><i class="fas fa-share-nodes"></i>مشاركة</button>
   <button class="jp-pill" data-a="report"><i class="fas fa-flag"></i>إبلاغ</button>
   <button class="jp-pill" data-a="more"><i class="fas fa-bars"></i>المزيد</button>
 </div>
 <div class="jp-slot" id="jpSlot"></div>
</div>`;
document.body.appendChild(root);
var toastEl=document.createElement('div');toastEl.id='jpToast';document.body.appendChild(toastEl);

/* ───────────── helpers ───────────── */
var $=function(s,r){return (r||document).querySelector(s)};
var wrap=$('#jpWrap'),vid=$('#jpVid'),adV=$('#jpAdV');
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var fmt=function(s){if(!isFinite(s)||s<0)return'00:00';var h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=Math.floor(s%60),p=function(n){return String(n).padStart(2,'0')};return(h?h+':':'')+p(m)+':'+p(x)};
var LS={get:function(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
var tT;function toast(m){toastEl.textContent=m;toastEl.classList.add('on');clearTimeout(tT);tT=setTimeout(function(){toastEl.classList.remove('on')},2400)}
function loadScript(src){return new Promise(function(res,rej){var s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s)})}

/* ───────────── state ───────────── */
var S={open:false,mini:false,opts:null,quals:[],qi:0,hls:null,curUrl:'',cues:[],subText:'',subOn:true,subOff:0,subRaf:0,locked:false,
  ad:{cfg:null,busy:false,fired:{},count:0},pT:0,ctrlT:0,modal:null,speed:1,fsOpen:false,nextT:0};
var subStyle=LS.get('jp_substyle',{size:16,font:'system',shadow:'black',color:'white'});

/* ───────────── YouTube (IFrame API) — يُحاكي عنصر video لتعمل كل الأزرار ───────────── */
var Y={p:null,ready:false,st:-1,dur:0,iv:0,on:false};
var YTP=['paused','duration','currentTime','playbackRate','muted','volume','videoWidth','play','pause'];
function ytApi(){
  if(window.YT&&window.YT.Player)return Promise.resolve();
  return new Promise(function(res,rej){
    var prev=window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady=function(){try{prev&&prev()}catch(e){}res()};
    if(!document.querySelector('script[src*="youtube.com/iframe_api"]'))loadScript('https://www.youtube.com/iframe_api').catch(rej);
    setTimeout(function(){window.YT&&window.YT.Player?res():rej()},10000);
  });
}
function ytShim(){
  var d=function(n,o){o.configurable=true;Object.defineProperty(vid,n,o)};
  d('paused',{get:function(){return Y.st!==1}});
  d('duration',{get:function(){return Y.dur||NaN}});
  d('videoWidth',{get:function(){return 0}});
  d('currentTime',{get:function(){try{return Y.ready?Y.p.getCurrentTime()||0:0}catch(e){return 0}},set:function(v){try{Y.p.seekTo(v,true)}catch(e){}}});
  d('playbackRate',{get:function(){try{return Y.p.getPlaybackRate()||1}catch(e){return 1}},set:function(v){try{Y.p.setPlaybackRate(v)}catch(e){}}});
  d('muted',{get:function(){try{return Y.p.isMuted()}catch(e){return false}},set:function(v){try{v?Y.p.mute():Y.p.unMute()}catch(e){}setTimeout(function(){vid.dispatchEvent(new Event('volumechange'))},50)}});
  d('volume',{get:function(){try{return Y.p.getVolume()/100}catch(e){return 1}},set:function(v){try{Y.p.setVolume(v*100)}catch(e){}setTimeout(function(){vid.dispatchEvent(new Event('volumechange'))},50)}});
  d('play',{value:function(){try{Y.p.playVideo()}catch(e){}return Promise.resolve()}});
  d('pause',{value:function(){try{Y.p.pauseVideo()}catch(e){}}});
}
function ytAudioAr(p){
  var n=0;(function t(){
    if(n++>8)return;
    try{
      var tr=p.getAvailableAudioTracks&&p.getAvailableAudioTracks();
      if(!tr||!tr.length){setTimeout(t,800);return}
      var ar=tr.find(function(x){return (x.languageCode&&x.languageCode.indexOf('ar')===0)||x.id==='ar'||(x.displayName&&/arab|عرب/i.test(x.displayName))});
      if(ar&&p.setAudioTrack)p.setAudioTrack(ar.id);
    }catch(e){setTimeout(t,800)}
  })();
}
function ytStart(id,t0){
  ytStop(true);
  Y.on=true;wrap.classList.add('yt');ytShim();
  $('#jpSpin').style.display='block';$('#jpErr').style.display='none';
  var box=$('#jpYT');box.innerHTML='<div id="jpYTp"></div>';
  ytApi().then(function(){
    if(!Y.on)return;
    Y.p=new YT.Player('jpYTp',{videoId:id,playerVars:{autoplay:1,controls:0,modestbranding:1,rel:0,playsinline:1,hl:'ar',cc_load_policy:0,cc_lang_pref:'ar',iv_load_policy:3,disablekb:1,fs:0,start:t0||0,origin:location.origin||location.href.split('/').slice(0,3).join('/')},events:{
      onReady:function(e){Y.ready=true;Y.dur=e.target.getDuration()||0;try{e.target.playVideo()}catch(x){}ytAudioAr(e.target)},
      onError:function(){showErr()},
      onStateChange:function(e){
        var c=e.data;Y.st=c;
        if(c===1){Y.dur=e.target.getDuration()||Y.dur;$('#jpSpin').style.display='none';vid.dispatchEvent(new Event('play'));vid.dispatchEvent(new Event('playing'));ytAudioAr(e.target)}
        else if(c===2)vid.dispatchEvent(new Event('pause'));
        else if(c===3)$('#jpSpin').style.display='block';
        else if(c===0){
          if(vid.loop){try{e.target.seekTo(0,true);e.target.playVideo()}catch(x){}}
          else vid.dispatchEvent(new Event('ended'));
        }
      }}});
    Y.iv=setInterval(function(){if(Y.ready&&Y.st===1){Y.dur=(Y.p.getDuration&&Y.p.getDuration())||Y.dur;vid.dispatchEvent(new Event('timeupdate'))}},250);
  }).catch(function(){showErr()});
}
function ytStop(keep){
  clearInterval(Y.iv);
  if(Y.p){try{Y.p.destroy()}catch(e){}}
  Y.p=null;Y.ready=false;Y.st=-1;Y.dur=0;
  if(!Y.on&&!keep)return;
  Y.on=false;wrap.classList.remove('yt');
  YTP.forEach(function(n){try{delete vid[n]}catch(e){}});
  $('#jpYT').innerHTML='';
}

/* ───────────── تبديل التريلر مكان الفيلم ───────────── */
var TRS=null;
function trailerOn(key){
  if(!S.open||(S.opts&&S.opts.yt)||TRS)return false;
  TRS={t:vid.currentTime||0,was:!vid.paused,qi:S.qi,url:S.curUrl};
  try{vid.pause()}catch(e){}
  destroyHls();ytStart(key,0);return true;
}
function trailerOff(){
  if(!TRS)return;var s=TRS;TRS=null;
  ytStop();var q=S.quals[s.qi]||S.quals[0];
  if(q)loadSource(q,s.t,s.was);
}
/* ───────────── open / close ───────────── */
function configure(o){if(o&&o.vast)S.ad.cfg=o.vast}

function open(o){
  S.opts=o;TRS=null;
  ytStop();
  if(!S.open){
    S.open=true;root.classList.add('on');document.body.classList.add('lock');
    if(!o.embed)try{history.pushState({jp:1},'')}catch(e){}
  }
  if(S.mini)exitMini();
  cancelNext();closeModal();
  S.ad.fired={};S.ad.count=0;S.subOff=0;S.pT=Date.now();
  $('#jpTT').textContent=o.title||'';
  root.classList.toggle('embed',!!o.embed);
  var bg=o.backdrop||o.poster||'';
  $('#jpIBG').style.backgroundImage=bg?'url("'+bg+'")':'none';
  vid.poster=o.backdrop||o.poster||'';
  var slot=$('#jpSlot');slot.innerHTML='';if(o.slot)slot.appendChild(o.slot);
  $('#jpMain').scrollTop=0;
  $('#jpErr').style.display='none';
  S.quals=(o.quals||[]).slice();
  S.qi=autoQuality(S.quals);
  setSubs(o.subtitle||'');
  syncHeart();syncQualUI();syncLoop();
  vid.loop=false;vid.playbackRate=1;S.speed=1;updSpeedLbl();
  applySubStyle();
  var cfg=S.ad.cfg;
  var first=function(){startMain()};
  var go=function(){if(!o.yt&&adAllowed()&&cfg.preroll!==false){showAd(first)}else first()};
  if(o.resolve){
    $('#jpSpin').style.display='block';
    Promise.resolve(o.resolve()).then(function(r){
      if(S.opts!==o||!S.open)return;
      if(!r||!r.quals||!r.quals.length){showErr();return}
      o.quals=r.quals;if(r.refresh)o.refresh=r.refresh;
      S.quals=r.quals.slice();S.qi=autoQuality(S.quals);syncQualUI();go();
    }).catch(function(){if(S.opts===o&&S.open)showErr()});
    return;
  }
  go();
}
function startMain(){
  if(S.opts&&S.opts.yt){ytStart(S.opts.yt,0);return}
  var q=S.quals[S.qi];if(!q){showErr();return}
  loadSource(q,(S.opts&&S.opts.startAt)||0,true);
}
function close(){
  var oc=S.opts&&S.opts.onClose;
  try{if(S.opts&&S.opts.onProgress&&vid.duration&&vid.currentTime>1&&!S.ad.busy)S.opts.onProgress(vid.currentTime,vid.duration)}catch(e){}
  cancelNext();closeModal();stopAd();TRS=null;
  try{vid.pause()}catch(e){}
  ytStop();
  destroyHls();vid.removeAttribute('src');vid.load();
  cancelAnimationFrame(S.subRaf);S.cues=[];
  if(isFs())exitFs();
  unlock();
  root.classList.remove('on','mini','embed');S.open=false;S.mini=false;
  if(DLS.length)showDlCircle();
  window.dispatchEvent(new Event('jp-close'));
  document.body.classList.remove('lock');
  wrap.removeAttribute('style');
  if(oc)try{oc()}catch(e){}
}

/* ───────────── source / hls / quality ───────────── */
function isHls(u){return /\.m3u8(\?|$)/i.test(u)||/m3u8/i.test(u)}
function destroyHls(){if(S.hls){try{S.hls.destroy()}catch(e){}S.hls=null}}
async function loadSource(q,t0,ap){
  destroyHls();$('#jpErr').style.display='none';$('#jpSpin').style.display='block';
  var url=q.url;
  if(url)S.curUrl=url;
  if(url&&isHls(url)&&!vid.canPlayType('application/vnd.apple.mpegurl')){
    try{if(!window.Hls)await loadScript('https://cdn.jsdelivr.net/npm/hls.js@1')}catch(e){}
    if(window.Hls&&window.Hls.isSupported()){
      var h=S.hls=new window.Hls();
      h.loadSource(url);h.attachMedia(vid);
      h.on(window.Hls.Events.MANIFEST_PARSED,function(){buildLevels(h)});
      h.on(window.Hls.Events.ERROR,function(e,d){if(d&&d.fatal)showErr()});
    }else vid.src=url;
  }else vid.src=url;
  if(t0)vid.addEventListener('loadedmetadata',function(){vid.currentTime=t0},{once:true});
  if(ap)vid.play().catch(function(){vid.muted=true;vid.play().catch(function(){})});
}
function buildLevels(h){
  if(S.quals.length>1||!h.levels||h.levels.length<2)return;
  var lv=h.levels.map(function(l,i){return {label:l.height?l.height+'p':'جودة '+(i+1),level:i,h:l.height||0}}).sort(function(a,b){return b.h-a.h});
  S.quals=[{label:'تلقائي',level:-1}].concat(lv);S.qi=0;h.currentLevel=-1;syncQualUI();
}
function autoQuality(qs){
  if(qs.length<2)return 0;
  var order=[1080,720,480,360,240],target=720,c=navigator.connection;
  if(c){var mb=c.downlink,t=c.effectiveType;target=(t==='slow-2g'||mb<.5)?240:(t==='2g'||mb<1)?360:(t==='3g'||mb<3)?480:mb<6?720:1080}
  var best=-1,bd=1e9;
  qs.forEach(function(q,i){var n=parseInt(q.label)||0;if(!n)return;var d=Math.abs(n-target);if(n<=target+1&&d<bd){bd=d;best=i}});
  return best>=0?best:0;
}
function switchQuality(i){
  var q=S.quals[i];if(!q)return;S.qi=i;
  if(q.level!==undefined&&S.hls){S.hls.currentLevel=q.level}
  else{var t=vid.currentTime,p=!vid.paused;loadSource(q,t,p)}
  syncQualUI();
}
function syncQualUI(){
  var multi=S.quals.length>1;
  $('#jpQ').style.display=multi?'flex':'none';
  $('#fsQ').style.display=multi?'inline-flex':'none';
  var q=S.quals[S.qi];$('#jpQL').textContent=q?(q.label==='تلقائي'?'AUTO':q.label):'HD';
}
function showErr(){$('#jpSpin').style.display='none';$('#jpErr').style.display='block'}

/* ───────────── subtitles ───────────── */
function parseSubs(raw){
  if(!raw||raw.trim().length<5)return[];
  var text=raw.replace(/\r\n/g,'\n').replace(/\r/g,'\n').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/<br\s*\/?>/gi,'\n');
  var rx=/(\d{1,2}:\d{2}:\d{2}[,.]\d{3}|\d{1,2}:\d{2}[,.]\d{3})\s*-->\s*(\d{1,2}:\d{2}:\d{2}[,.]\d{3}|\d{1,2}:\d{2}[,.]\d{3})/;
  var pt=function(t){var p=t.replace(',','.').split(':');return p.length===3?+p[0]*3600+ +p[1]*60+parseFloat(p[2]):+p[0]*60+parseFloat(p[1])};
  var L=text.split('\n'),cues=[],i=0;
  while(i<L.length){
    var line=L[i].trim(),m=line.match(rx);
    if(m){
      var a=pt(m[1]),b=pt(m[2]),tx=[];i++;
      while(i<L.length){var l=L[i].trim();if(!l||rx.test(l))break;if(/^\d+$/.test(l)&&rx.test((L[i+1]||'').trim()))break;tx.push(l.replace(/<[^>]+>/g,''));i++}
      var s=tx.join('\n').trim();if(s)cues.push({a:a,b:b,t:s});
    }else i++;
  }
  return cues;
}
function setSubs(raw){
  cancelAnimationFrame(S.subRaf);S.subText=raw||'';S.cues=parseSubs(raw);S.subOn=true;
  $('#jpSub').style.display='none';
  var has=S.cues.length>0;
  $('#jpCC').style.display=has?'flex':'none';$('#fsS').style.display=has?'inline-flex':'none';
  syncCC();
  if(has)subLoop();
}
function subLoop(){
  var sub=$('#jpSub'),tx=$('#jpSubT');
  var t=vid.currentTime+S.subOff,c=null;
  if(S.subOn&&!S.ad.busy)for(var i=0;i<S.cues.length;i++){if(t>=S.cues[i].a&&t<=S.cues[i].b){c=S.cues[i];break}}
  if(c){if(tx.dataset.k!==String(c.a)){tx.innerHTML=esc(c.t).replace(/\n/g,'<br>');tx.dataset.k=String(c.a)}sub.style.display='block'}
  else{sub.style.display='none';tx.dataset.k=''}
  S.subRaf=requestAnimationFrame(subLoop);
}
function syncCC(){$('#jpCC').style.color=S.subOn?'#ff375f':'#fff'}
var FONTLIST=[['system','تلقائي (خط النظام)',null,"system-ui,-apple-system,'Segoe UI',sans-serif"],
['tajawal','Tajawal','Tajawal','sans-serif'],['cairo','Cairo','Cairo','sans-serif'],['almarai','Almarai','Almarai','sans-serif'],
['mada','Mada','Mada','sans-serif'],['ibm','IBM Plex Sans Arabic','IBM Plex Sans Arabic','sans-serif'],['kufi','Noto Kufi Arabic','Noto Kufi Arabic','sans-serif'],
['naskh','Noto Naskh Arabic','Noto Naskh Arabic','serif'],['amiri','Amiri','Amiri','serif'],['scheherazade','Scheherazade New','Scheherazade New','serif'],
['lateef','Lateef','Lateef','serif'],['markazi','Markazi Text','Markazi Text','serif'],['harmattan','Harmattan','Harmattan','sans-serif'],
['elmessiri','El Messiri','El Messiri','sans-serif'],['changa','Changa','Changa','sans-serif'],['reem','Reem Kufi','Reem Kufi','sans-serif'],
['baloo','Baloo Bhaijaan 2','Baloo Bhaijaan 2','sans-serif'],['lemonada','Lemonada','Lemonada','cursive'],['rubik','Rubik','Rubik','sans-serif'],['arial','Arial','Arial','sans-serif']];
var FONTS={},FONTLOADED={};
FONTLIST.forEach(function(f){FONTS[f[0]]=f[2]?"'"+f[2]+"',"+f[3]:f[3]});
function loadFont(k){
  var f=FONTLIST.filter(function(x){return x[0]===k})[0];
  if(!f||!f[2]||FONTLOADED[k])return;FONTLOADED[k]=1;
  var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family='+f[2].replace(/ /g,'+')+':wght@700&display=swap';document.head.appendChild(l);
}
function fontOpts(){return FONTLIST.map(function(f){return '<option value="'+f[0]+'">'+f[1]+'</option>'}).join('')}
function applySubStyle(){
  loadFont(subStyle.font);
  var s=subStyle,sh=s.shadow==='none'?'none':'0.5px 0.5px 0 '+s.shadow+',-0.5px 0.5px 0 '+s.shadow+',0.5px -0.5px 0 '+s.shadow+',-0.5px -0.5px 0 '+s.shadow+',0 2px 8px '+s.shadow;
  root.style.setProperty('--ss',s.size+'px');root.style.setProperty('--sf',FONTS[s.font]||FONTS.system);
  root.style.setProperty('--sh',sh);root.style.setProperty('--sc',s.color);LS.set('jp_substyle',s);
}

/* ───────────── fullscreen / lock ───────────── */
function isFs(){return !!(document.fullscreenElement||document.webkitFullscreenElement)||wrap.classList.contains('fake')}
function setFsClass(){
  var f=isFs();wrap.classList.toggle('fs',f);
  $('#jpFs').innerHTML='<i class="fas fa-'+(f?'compress':'expand')+'"></i>';
  $('#jpStr').style.display=f?'flex':'none';
  if(!f){wrap.classList.remove('stretch','fake');S.fsOpen=false;$('#fsX').classList.remove('open');try{screen.orientation&&screen.orientation.unlock&&screen.orientation.unlock()}catch(e){}}
  showCtrls();
}
async function enterFs(){
  try{
    if(wrap.requestFullscreen)await wrap.requestFullscreen();
    else if(wrap.webkitRequestFullscreen)await wrap.webkitRequestFullscreen();
    else wrap.classList.add('fake');
  }catch(e){wrap.classList.add('fake')}
  try{if(screen.orientation&&screen.orientation.lock)await screen.orientation.lock('landscape')}catch(e){}
  setFsClass();
}
function exitFs(){
  wrap.classList.remove('fake');
  try{
    if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(function(){});
    else if(document.webkitFullscreenElement&&document.webkitExitFullscreen)document.webkitExitFullscreen();
  }catch(e){}
  setFsClass();
}
document.addEventListener('fullscreenchange',setFsClass);
document.addEventListener('webkitfullscreenchange',setFsClass);
$('#jpFs').onclick=function(){isFs()?exitFs():enterFs()};
$('#jpStr').onclick=function(){var s=wrap.classList.toggle('stretch');$('#jpStr').innerHTML='<i class="fas fa-'+(s?'compress-alt':'expand-alt')+'"></i>'};

var unlT;
async function lock(){
  if(!isFs())await enterFs();
  S.locked=true;$('#jpLock').classList.add('on');$('#jpUnl').classList.remove('on');
  var h=$('#jpLH');h.classList.add('on');setTimeout(function(){h.classList.remove('on')},2400);
  syncPills();
}
function unlock(){S.locked=false;$('#jpLock').classList.remove('on');$('#jpUnl').classList.remove('on');syncPills()}
$('#jpLock').addEventListener('pointerup',function(e){
  if(!S.locked||e.target.closest('#jpUnl'))return;
  $('#jpUnl').classList.add('on');clearTimeout(unlT);unlT=setTimeout(function(){$('#jpUnl').classList.remove('on')},3000);
});
$('#jpUnl').onclick=function(e){e.stopPropagation();unlock();toast('تم فك القفل')};

/* ───────────── controls visibility ───────────── */
function showCtrls(){
  wrap.classList.remove('hide');clearTimeout(S.ctrlT);
  if(!vid.paused&&!S.ad.busy)S.ctrlT=setTimeout(function(){wrap.classList.add('hide')},3000);
}
wrap.addEventListener('mousemove',showCtrls);
vid.addEventListener('play',showCtrls);vid.addEventListener('pause',function(){showCtrls();syncMini()});
vid.addEventListener('play',syncMini);

/* ───────────── playback events ───────────── */
vid.addEventListener('timeupdate',function(){
  var d=vid.duration;
  $('#jpBar').style.width=(d?vid.currentTime/d*100:0)+'%';
  $('#jpTime').textContent=fmt(vid.currentTime)+' / '+fmt(d);
  checkAds();
  var o=S.opts;
  if(o&&o.onProgress&&!S.ad.busy&&d&&Date.now()-S.pT>15000){S.pT=Date.now();try{o.onProgress(vid.currentTime,d)}catch(e){}}
});
vid.addEventListener('loadedmetadata',function(){
  $('#jpSpin').style.display='none';
  var w=vid.videoWidth,h=vid.videoHeight;
  if(w&&h){var r=w/h;wrap.style.aspectRatio=Math.abs(r-16/9)>.06?String(Math.min(Math.max(r,1),2.5)):''}
});
vid.addEventListener('waiting',function(){$('#jpSpin').style.display='block'});
['playing','canplay','seeked'].forEach(function(ev){vid.addEventListener(ev,function(){$('#jpSpin').style.display='none'})});
var rfTry=0,rfAt=0;
vid.addEventListener('error',function(){
  var o=S.opts,q=S.quals&&S.quals[S.qi];
  if(Y.on||!o||!o.refresh||!q||!q.vid||isHls(S.curUrl||'')||rfTry>=4){showErr();return}
  if(Date.now()-rfAt>60000)rfTry=0;
  rfTry++;rfAt=Date.now();
  var t=vid.currentTime||0,was=!vid.paused;
  $('#jpSpin').style.display='block';
  Promise.resolve(o.refresh(q)).then(function(u){
    if(!u){showErr();return}
    S.curUrl=u;vid.src=u;
    vid.addEventListener('loadedmetadata',function(){vid.currentTime=t;if(was||true)vid.play().catch(function(){})},{once:true});
  }).catch(showErr);
});
vid.addEventListener('volumechange',function(){$('#jpMute').innerHTML='<i class="fas fa-volume-'+(vid.muted||vid.volume===0?'mute':'up')+'"></i>'});
$('#jpMute').onclick=function(){if(vid.muted||vid.volume===0){vid.muted=false;vid.volume=1}else vid.muted=true};
vid.addEventListener('ended',function(){
  if(vid.loop)return;
  var n=S.opts&&S.opts.next&&S.opts.next();
  if(n)startNext(n);
});
function togglePlay(){vid.paused?vid.play().catch(function(){}):vid.pause()}
function pulse(){var p=$('#jpPulse');p.classList.remove('go');void p.offsetWidth;p.classList.add('go')}
function jump(el){el.classList.remove('go');void el.offsetWidth;el.classList.add('go')}

/* ───────────── taps / double tap / long press ───────────── */
var tap=null,lastTap=0,singleT=0,lpT=0,lpOn=false,lpPrev=1;
function lpStart(){lpOn=true;lpPrev=vid.playbackRate;vid.playbackRate=2;$('#jpBadge').style.display='block'}
function lpStop(){if(!lpOn)return;lpOn=false;vid.playbackRate=lpPrev;$('#jpBadge').style.display='none'}
wrap.addEventListener('pointerdown',function(e){
  if(S.mini||S.locked||S.ad.busy)return;
  if(e.target.closest('.jp-ctrl,.jp-touch,.jp-top,.jp-fsbar,.jp-lock,.jp-next,.jp-modal,.jp-err,button'))return;
  tap={x:e.clientX,y:e.clientY,ok:true};
  var r=wrap.getBoundingClientRect(),rel=(e.clientX-r.left)/r.width;
  clearTimeout(lpT);
  if(rel<.4||rel>.6)lpT=setTimeout(function(){if(tap&&tap.ok)lpStart()},450);
});
wrap.addEventListener('pointermove',function(e){
  if(tap&&(Math.abs(e.clientX-tap.x)>10||Math.abs(e.clientY-tap.y)>10)){tap.ok=false;clearTimeout(lpT)}
});
['pointerup','pointercancel'].forEach(function(ev){wrap.addEventListener(ev,function(e){
  clearTimeout(lpT);
  if(lpOn){lpStop();tap=null;return}
  if(!tap||!tap.ok||ev==='pointercancel'){tap=null;return}
  tap=null;
  var now=Date.now(),r=wrap.getBoundingClientRect(),rel=(e.clientX-r.left)/r.width;
  if(now-lastTap<300){
    clearTimeout(singleT);lastTap=0;
    if(rel<.4){vid.currentTime=Math.max(0,vid.currentTime-10);jump($('#jpJB'))}
    else if(rel>.6){vid.currentTime=Math.min(vid.duration||1e9,vid.currentTime+10);jump($('#jpJF'))}
    else toggleFsDbl();
  }else{
    lastTap=now;
    singleT=setTimeout(function(){togglePlay();pulse();showCtrls()},280);
  }
})});
function toggleFsDbl(){isFs()?exitFs():enterFs()}

/* ───────────── progress seeking ───────────── */
var seeking=false;
function seekPos(e){
  var r=$('#jpProg').getBoundingClientRect(),p=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));
  var d=vid.duration||0;
  $('#jpTP').textContent=fmt(p*d);$('#jpTP').style.left=(p*100)+'%';$('#jpPL').style.left=(p*100)+'%';
  $('#jpBar').style.width=(p*100)+'%';return p*d;
}
$('#jpTouch').addEventListener('pointerdown',function(e){
  if(!vid.duration||S.ad.busy)return;seeking=true;this.setPointerCapture(e.pointerId);$('#jpProg').classList.add('act');seekPos(e);showCtrls();clearTimeout(S.ctrlT);
});
$('#jpTouch').addEventListener('pointermove',function(e){if(seeking)seekPos(e)});
$('#jpTouch').addEventListener('pointerup',function(e){
  if(!seeking)return;seeking=false;vid.currentTime=seekPos(e);$('#jpProg').classList.remove('act');showCtrls();
});
$('#jpTouch').addEventListener('pointercancel',function(){seeking=false;$('#jpProg').classList.remove('act')});

/* ───────────── pills / bar actions ───────────── */
function copyText(t,msg){
  var done=function(){toast(msg||'تم النسخ')};
  var fb=function(){var i=document.createElement('textarea');i.value=t;i.style.cssText='position:fixed;opacity:0';document.body.appendChild(i);i.select();try{document.execCommand('copy');done()}catch(e){prompt('انسخ:',t)}i.remove()};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(done,fb);else fb();
}
function openEmbed(){
  var u=S.opts&&S.opts.embedUrl;if(!u)return;
  var code='<div style="position:relative;padding-top:56.25%"><iframe src="'+u+'" style="position:absolute;inset:0;width:100%;height:100%;border:0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>';
  modal('رابط التضمين','fa-code',function(b){
    var ta=document.createElement('textarea');ta.readOnly=true;ta.value=code;ta.dir='ltr';
    ta.style.cssText='width:100%;height:120px;background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px;font-size:12px;font-family:monospace;resize:none;box-sizing:border-box';
    ta.onclick=function(){ta.select()};b.appendChild(ta);
    var o1=document.createElement('button');o1.className='jp-opt';o1.innerHTML='<i class="fas fa-copy" style="color:#ff4757;width:18px"></i>نسخ كود iframe';o1.onclick=function(){copyText(code,'تم نسخ كود التضمين')};b.appendChild(o1);
    var o2=document.createElement('button');o2.className='jp-opt';o2.innerHTML='<i class="fas fa-link" style="color:#ff4757;width:18px"></i>نسخ رابط التضمين فقط';o2.onclick=function(){copyText(u,'تم نسخ الرابط')};b.appendChild(o2);
  });
}
function share(){
  var o=S.opts||{},u=o.shareUrl||location.href,t=o.title||document.title;
  if(navigator.share){navigator.share({title:t,text:t,url:u}).catch(function(){});return}
  var done=function(){toast('تم نسخ الرابط')};
  var fb=function(){var i=document.createElement('input');i.value=u;i.style.cssText='position:fixed;opacity:0';document.body.appendChild(i);i.select();try{document.execCommand('copy');done()}catch(e){prompt('انسخ الرابط',u)}i.remove()};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(u).then(done,fb);else fb();
}
function act(a){
  switch(a){
    case 'heart':heart();break;
    case 'dl':openDownload();break;
    case 'share':share();break;
    case 'copylink':copyText((S.opts&&S.opts.shareUrl)||location.href,'تم نسخ الرابط');break;
    case 'embed':openEmbed();break;
    case 'list':if(isFs())exitFs();try{S.opts.onList()}catch(e){}break;
    case 'report':openReport();break;
    case 'more':openMore();break;
    case 'lock':lock();break;
    case 'loop':toggleLoop();break;
    case 'speed':openSpeed();break;
    case 'qual':openQuality();break;
    case 'sub':openSubModal();break;
  }
}
root.addEventListener('click',function(e){var b=e.target.closest('.jp-pill[data-a]');if(b)act(b.dataset.a)});
$('#fsMore').onclick=function(){S.fsOpen=!S.fsOpen;$('#fsX').classList.toggle('open',S.fsOpen);showCtrls()};
$('#jpQ').onclick=openQuality;
$('#jpCC').onclick=function(){S.subOn=!S.subOn;syncCC();if(!S.subOn)$('#jpSub').style.display='none';toast(S.subOn?'الترجمة مفعّلة':'الترجمة متوقفة')};
$('#jpClose').onclick=close;
$('#jpMin').onclick=enterMini;

function syncPills(){
  root.querySelectorAll('.jp-pill[data-a="lock"]').forEach(function(b){b.classList.toggle('on',S.locked)});
}
function syncLoop(){root.querySelectorAll('.jp-pill[data-a="loop"]').forEach(function(b){b.classList.toggle('on',vid.loop);b.querySelector('span').textContent=vid.loop?'يتكرر':'تكرار'})}
function toggleLoop(){vid.loop=!vid.loop;syncLoop();toast(vid.loop?'التكرار مفعّل':'التكرار متوقف')}
function updSpeedLbl(){$('#fsSp').textContent=S.speed===1?'السرعة':S.speed+'×'}
function setSpeed(v){S.speed=v;vid.playbackRate=v;updSpeedLbl()}
function syncHeart(){
  var f=S.opts&&S.opts.fav&&S.opts.fav.is();
  root.querySelectorAll('.jp-pill[data-a="heart"]').forEach(function(b){
    b.classList.toggle('on',!!f);b.querySelector('i').className=(f?'fas':'far')+' fa-heart';
    b.querySelector('span').textContent=f?'محفوظة':'المفضلة';
  });
}
async function heart(){
  if(!S.opts||!S.opts.fav)return;
  if(isFs()&&!S.opts.fav.is())exitFs();
  var r=await S.opts.fav.toggle();if(r===null)return;
  syncHeart();toast(r?'أُضيف إلى المفضلة':'أُزيل من المفضلة');
}

/* ───────────── glass modals ───────────── */
function closeModal(){if(S.modal){S.modal.remove();S.modal=null}}
function modal(title,icon,build){
  closeModal();
  var m=document.createElement('div');m.className='jp-modal';
  m.innerHTML='<div class="jp-box"><div class="jp-bh"><span><i class="fas '+icon+'"></i>'+title+'</span><button class="jp-x"><i class="fas fa-times"></i></button></div><div class="jp-bb"></div></div>';
  build($('.jp-bb',m),m);
  m.addEventListener('click',function(e){if(e.target===m)closeModal()});
  $('.jp-x',m).onclick=closeModal;
  (isFs()?wrap:root).appendChild(m);S.modal=m;return m;
}
function openQuality(){
  modal('جودة الفيديو','fa-layer-group',function(b){
    S.quals.forEach(function(q,i){
      var o=document.createElement('button');o.className='jp-opt'+(i===S.qi?' on':'');o.textContent=q.label;o.style.justifyContent='center';
      o.onclick=function(){switchQuality(i);closeModal()};b.appendChild(o);
    });
  });
}
function openSpeed(){
  modal('سرعة التشغيل','fa-gauge-high',function(b){
    var g=document.createElement('div');g.className='jp-grid';
    [0.5,0.75,1,1.25,1.5,2].forEach(function(v){
      var o=document.createElement('button');o.className='jp-opt'+(S.speed===v?' on':'');o.textContent=v===1?'عادي':v+'×';
      o.onclick=function(){setSpeed(v);closeModal()};g.appendChild(o);
    });b.appendChild(g);
  });
}
function openMore(){
  modal('الإعدادات','fa-sliders',function(b){
    var rows=[
      ['speed','fa-gauge-high','سرعة التشغيل',S.speed===1?'عادي':S.speed+'×'],
      S.quals.length>1?['qual','fa-layer-group','جودة الفيديو',(S.quals[S.qi]||{}).label]:null,
      ['loop','fa-redo','تكرار الفيديو',vid.loop?'يعمل':'متوقف'],
      ['lock','fa-lock','قفل الشاشة',''],
      ['copylink','fa-link','نسخ رابط المشاهدة',''],
      (S.opts&&S.opts.embedUrl)?['embed','fa-code','رابط التضمين (iframe)','']:null,
      (S.opts&&S.opts.onList)?['list','fa-bookmark','إضافة إلى قائمة','']:null,
      S.cues.length?['sub','fa-closed-captioning','إعدادات الترجمة','']:null
    ].filter(Boolean);
    rows.forEach(function(r){
      var o=document.createElement('button');o.className='jp-opt';
      o.innerHTML='<i class="fas '+r[1]+'" style="color:#ff4757;width:18px"></i>'+r[2]+'<span class="v">'+esc(r[3])+'</span>';
      o.onclick=function(){closeModal();act(r[0])};b.appendChild(o);
    });
  });
}
function openSubModal(){
  modal('إعدادات الترجمة','fa-closed-captioning',function(b){
    b.innerHTML=`
    <div class="jp-line"><span>إظهار الترجمة</span><button class="jp-opt" id="sm_t" style="width:auto;padding:6px 16px"></button></div>
    <div class="jp-line"><span>التزامن (ث)</span><div class="ct"><button id="sm_o1">−</button><b id="sm_ov"></b><button id="sm_o2">+</button></div></div>
    <div class="jp-line"><span>حجم الخط</span><div class="ct"><button id="sm_s1">−</button><b id="sm_sv"></b><button id="sm_s2">+</button></div></div>
    <div class="jp-line"><span>نوع الخط</span><select class="jp-sel" id="sm_f">${fontOpts()}</select></div>
    <div class="jp-line"><span>لون النص</span><div class="jp-cols" id="sm_c"></div></div>
    <div class="jp-line"><span>لون الظل</span><div class="jp-cols" id="sm_h"></div></div>`;
    var up=function(){
      $('#sm_t',b).textContent=S.subOn?'إخفاء':'إظهار';$('#sm_ov',b).textContent=S.subOff.toFixed(1);$('#sm_sv',b).textContent=subStyle.size;
      b.querySelectorAll('#sm_c i').forEach(function(i){i.classList.toggle('on',i.dataset.v===subStyle.color)});
      b.querySelectorAll('#sm_h i').forEach(function(i){i.classList.toggle('on',i.dataset.v===subStyle.shadow)});
    };
    $('#sm_f',b).value=subStyle.font;
    [['white','#fff'],['#ffff00','#ffff00'],['#00ffcc','#00ffcc'],['#ffaa00','#ffaa00'],['#ff6b6b','#ff6b6b'],['#a8ff78','#a8ff78']].forEach(function(c){
      var i=document.createElement('i');i.style.background=c[1];i.dataset.v=c[0];i.onclick=function(){subStyle.color=c[0];applySubStyle();up()};$('#sm_c',b).appendChild(i)});
    [['black','#000'],['#222244','#222244'],['#550000','#550000'],['#1a3a1a','#1a3a1a'],['none','linear-gradient(45deg,#aaa,#eee)']].forEach(function(c){
      var i=document.createElement('i');i.style.background=c[1];i.dataset.v=c[0];i.onclick=function(){subStyle.shadow=c[0];applySubStyle();up()};$('#sm_h',b).appendChild(i)});
    $('#sm_t',b).onclick=function(){S.subOn=!S.subOn;syncCC();up()};
    $('#sm_o1',b).onclick=function(){S.subOff=Math.round((S.subOff-.5)*10)/10;up()};
    $('#sm_o2',b).onclick=function(){S.subOff=Math.round((S.subOff+.5)*10)/10;up()};
    $('#sm_s1',b).onclick=function(){subStyle.size=Math.max(10,subStyle.size-2);applySubStyle();up()};
    $('#sm_s2',b).onclick=function(){subStyle.size=Math.min(48,subStyle.size+2);applySubStyle();up()};
    $('#sm_f',b).onchange=function(){subStyle.font=this.value;applySubStyle()};
    up();
  });
}
function openReport(){
  modal('الإبلاغ عن محتوى','fa-flag',function(b,m){
    ['الفيديو لا يشتغل','الصوت غير متزامن','مشكلة في الترجمة','جودة سيئة','محتوى غير لائق','أخرى'].forEach(function(r){
      var o=document.createElement('button');o.className='jp-opt';o.textContent=r;o.onclick=function(){sendReport(r)};b.appendChild(o);
    });
  });
}
function sendReport(reason){
  closeModal();
  try{S.opts&&S.opts.onReport&&S.opts.onReport(reason)}catch(e){}
  var f=new FormData();f.append('email','send@jawrab.txt');f.append('name',(S.opts&&S.opts.title)||'');f.append('message',reason);
  fetch(REPORT_URL,{method:'POST',body:f,headers:{Accept:'application/json'}}).then(function(r){toast(r.ok?'تم إرسال الإبلاغ':'فشل الإرسال')}).catch(function(){toast('تعذر الاتصال')});
}

/* ───────────── autoplay next ───────────── */
function startNext(n){
  var el=$('#jpNext'),ring=$('#jpRing'),num=$('#jpNum'),c=5;
  $('#jpNL').textContent='التالي: '+(n.title||'');
  el.classList.add('on');num.textContent=c;ring.style.strokeDashoffset='0';
  clearInterval(S.nextT);
  S.nextT=setInterval(function(){
    c--;num.textContent=c;ring.style.strokeDashoffset=String((5-c)/5*201);
    if(c<=0){cancelNext();n.play()}
  },1000);
  $('#jpNC').onclick=cancelNext;
  $('#jpNP').onclick=function(){cancelNext();n.play()};
}
function cancelNext(){clearInterval(S.nextT);$('#jpNext').classList.remove('on')}

/* ───────────── VAST ads ───────────── */
function adAllowed(){
  var c=S.ad.cfg,o=S.opts;
  if(!c||!c.enabled||!c.url||!o)return false;
  if(o.kind==='movie'&&c.movies===false)return false;
  if(o.kind==='episode'&&c.episodes===false)return false;
  return S.ad.count<(c.maxPerVideo||10);
}
async function fetchVast(url,depth){
  var ctl=new AbortController(),t=setTimeout(function(){ctl.abort()},7000);
  var txt;try{txt=await (await fetch(url,{signal:ctl.signal})).text()}finally{clearTimeout(t)}
  var doc=new DOMParser().parseFromString(txt,'text/xml');
  var imps=[].map.call(doc.querySelectorAll('Impression'),function(x){return x.textContent.trim()}).filter(Boolean);
  var w=doc.querySelector('VASTAdTagURI');
  if(w&&(depth||0)<3){var inner=await fetchVast(w.textContent.trim(),(depth||0)+1);inner.imps=inner.imps.concat(imps);return inner}
  var best=null,bh=0;
  doc.querySelectorAll('MediaFile').forEach(function(mf){
    var ty=mf.getAttribute('type')||'',h=+mf.getAttribute('height')||0;
    if(/mp4|video/.test(ty)){if(!best||(h<=720&&h>=bh)||(bh>720&&h<bh)){best=mf.textContent.trim();bh=h}}
  });
  var ct=doc.querySelector('ClickThrough');
  return {url:best,click:ct?ct.textContent.trim():'',imps:imps};
}
function showAd(done){
  var cfg=S.ad.cfg,fin=false;
  var end=function(){if(fin)return;fin=true;done()};
  S.ad.busy=true;S.ad.count++;
  fetchVast(cfg.url,0).then(function(ad){
    if(!ad.url){S.ad.busy=false;return end()}
    var box=$('#jpAd'),sk=$('#jpAdS'),cd=$('#jpAdC'),left=cfg.skipAfter==null?5:+cfg.skipAfter,skippable=cfg.skippable!==false,iv=0;
    try{vid.pause()}catch(e){}
    $('#jpSub').style.display='none';
    var cleanup=function(){clearInterval(iv);adV.pause();adV.removeAttribute('src');adV.load();box.classList.remove('on');sk.classList.remove('on');cd.textContent='';S.ad.busy=false;S.ad.stop=null;showCtrls();end()};
    S.ad.stop=function(){fin=true;clearInterval(iv);adV.pause();adV.removeAttribute('src');box.classList.remove('on');S.ad.busy=false;S.ad.stop=null};
    box.onclick=function(e){if(e.target.closest('#jpAdS'))return;window.open(ad.click||ad.url,'_blank')};
    sk.onclick=function(e){e.stopPropagation();cleanup()};
    adV.onended=cleanup;adV.onerror=cleanup;
    adV.src=ad.url;box.classList.add('on');
    ad.imps.forEach(function(u){try{(new Image()).src=u}catch(e){}});
    var tick=function(){
      if(!skippable){cd.textContent='الإعلان يعمل...';return}
      if(left>0){cd.textContent='يمكن التخطي بعد '+left+' ث'}
      else{cd.textContent='';sk.classList.add('on')}
    };
    tick();
    iv=setInterval(function(){if(left>0){left--;tick()}},1000);
    adV.muted=false;adV.volume=1;
    adV.play().catch(function(){adV.muted=true;adV.play().catch(cleanup)});
  }).catch(function(){S.ad.busy=false;end()});
}
function stopAd(){if(S.ad.stop)S.ad.stop();$('#jpAd').classList.remove('on');S.ad.busy=false}
function checkAds(){
  if(Y.on)return;
  if(S.ad.busy||!adAllowed())return;
  var c=S.ad.cfg,d=vid.duration;
  if(!d||!isFinite(d)||vid.paused&&vid.currentTime===0)return;
  if(c.minDurationMin&&d/60<c.minDurationMin)return;
  var due=false,t=vid.currentTime;
  (c.atMinutes||[]).forEach(function(m){var k='m'+m;if(!S.ad.fired[k]&&t>=m*60){S.ad.fired[k]=1;due=true}});
  (c.atPercents||[]).forEach(function(p){var k='p'+p;if(!S.ad.fired[k]&&t>=d*p/100){S.ad.fired[k]=1;due=true}});
  if(due)showAd(function(){vid.play().catch(function(){})});
}

/* ───────────── mini player ───────────── */
function syncMini(){$('#mbP').innerHTML='<i class="fas fa-'+(vid.paused?'play':'pause')+'"></i>'}
function enterMini(){
  if(S.mini||!S.open)return;
  closeModal();if(isFs())exitFs();
  S.mini=true;root.classList.add('mini');document.body.classList.remove('lock');
  wrap.removeAttribute('style');wrap.style.left='12px';wrap.style.top=(window.innerHeight-230)+'px';
  syncMini();
}
function exitMini(){
  S.mini=false;root.classList.remove('mini');document.body.classList.add('lock');wrap.removeAttribute('style');$('#jpMB').classList.remove('show');
}
$('#mbX').onclick=function(e){e.stopPropagation();exitMini()};
$('#mbP').onclick=function(e){e.stopPropagation();togglePlay()};
$('#mbC').onclick=function(e){e.stopPropagation();close()};
var mdrag=null,mbT;
wrap.addEventListener('pointerdown',function(e){
  if(!S.mini||e.target.closest('button'))return;
  var r=wrap.getBoundingClientRect();mdrag={sx:e.clientX,sy:e.clientY,l:r.left,t:r.top,moved:false};wrap.setPointerCapture(e.pointerId);
});
wrap.addEventListener('pointermove',function(e){
  if(!mdrag||!S.mini)return;
  var dx=e.clientX-mdrag.sx,dy=e.clientY-mdrag.sy;if(Math.abs(dx)>5||Math.abs(dy)>5)mdrag.moved=true;
  if(!mdrag.moved)return;
  var W=window.innerWidth,H=window.innerHeight,w=wrap.offsetWidth,h=wrap.offsetHeight;
  wrap.style.transition='none';
  wrap.style.left=Math.max(6,Math.min(W-w-6,mdrag.l+dx))+'px';
  wrap.style.top=Math.max(6,Math.min(H-h-70,mdrag.t+dy))+'px';
});
wrap.addEventListener('pointerup',function(){
  if(!mdrag||!S.mini){mdrag=null;return}
  var d=mdrag;mdrag=null;
  if(!d.moved){var mb=$('#jpMB');mb.classList.add('show');clearTimeout(mbT);mbT=setTimeout(function(){mb.classList.remove('show')},2500);return}
  var W=window.innerWidth,w=wrap.offsetWidth,left=parseFloat(wrap.style.left);
  wrap.style.transition='left .25s cubic-bezier(.16,1,.3,1)';
  wrap.style.left=((left+w/2<W/2)?8:W-w-8)+'px';
});

/* swipe down - mini */
var sw=null;
wrap.addEventListener('touchstart',function(e){
  if(S.mini||S.locked||isFs()||S.ad.busy)return;
  if(e.target.closest('.jp-ctrl,.jp-touch,.jp-top,button'))return;
  var t=e.touches[0];sw={x:t.clientX,y:t.clientY,on:false};
},{passive:true});
wrap.addEventListener('touchmove',function(e){
  if(!sw)return;var t=e.touches[0],dy=t.clientY-sw.y,dx=Math.abs(t.clientX-sw.x);
  if(!sw.on){if(dy>12&&dx<dy*.6)sw.on=true;else return}
  if(e.cancelable)e.preventDefault();
  var k=Math.min(1,dy/(window.innerHeight*.4));
  wrap.style.transform='translateY('+dy*.5+'px) scale('+(1-k*.25)+')';wrap.style.opacity=String(1-k*.4);
},{passive:false});
wrap.addEventListener('touchend',function(e){
  if(!sw)return;var was=sw.on,dy=e.changedTouches[0].clientY-sw.y;sw=null;
  if(!was)return;
  wrap.style.transform='';wrap.style.opacity='';
  if(dy>window.innerHeight*.18)enterMini();
},{passive:true});
window.addEventListener('popstate',function(){if(S.open&&!S.mini&&!(S.opts&&S.opts.embed)){if(isFs())exitFs();else enterMini()}});

/* auto PiP */
document.addEventListener('visibilitychange',function(){
  if(document.hidden){
    if(S.open&&!S.mini&&!vid.paused&&!S.ad.busy&&document.pictureInPictureEnabled&&vid.readyState>=2)vid.requestPictureInPicture().catch(function(){});
  }else if(document.pictureInPictureElement){document.exitPictureInPicture().catch(function(){})}
});

/* keyboard */
document.addEventListener('keydown',function(e){
  if(!S.open||S.mini||S.locked||/INPUT|TEXTAREA|SELECT/.test((e.target||{}).tagName||''))return;
  if(e.code==='Space'){e.preventDefault();togglePlay()}
  else if(e.code==='ArrowRight'){vid.currentTime+=10;jump($('#jpJF'))}
  else if(e.code==='ArrowLeft'){vid.currentTime=Math.max(0,vid.currentTime-10);jump($('#jpJB'))}
  else if(e.key==='f'||e.key==='F'){isFs()?exitFs():enterFs()}
  else if(e.key==='m'||e.key==='M'){vid.muted=!vid.muted}
  else if(e.key==='Escape'&&!isFs()){enterMini()}
});

/* ───────────── download ───────────── */
var dl={cur:null,circle:null,hidden:false,pct:0};
function triggerSave(blob,name){
  var u=URL.createObjectURL(blob),a=document.createElement('a');a.style.cssText='position:fixed;opacity:0';a.href=u;a.download=name;
  document.body.appendChild(a);setTimeout(function(){a.click();setTimeout(function(){a.remove();URL.revokeObjectURL(u)},1500)},100);
}
async function getRes(url,signal,asText,hdr){
  var tryF=async function(u){var r=await fetch(u,hdr?{signal:signal,headers:hdr}:{signal:signal});if(!r.ok)throw new Error('HTTP '+r.status);return r};
  var r;try{r=await tryF(url)}catch(e){if(e.name==='AbortError')throw e;r=await tryF(CORS_PROXY+encodeURIComponent(url))}
  return r;
}
async function dlFile(url,signal,onP){
  var r=await getRes(url,signal),total=+r.headers.get('content-length')||0,rd=r.body.getReader(),ch=[],l=0;
  for(;;){var x=await rd.read();if(x.done)break;ch.push(x.value);l+=x.value.length;onP(total?l/total:0,l)}
  return new Blob(ch,{type:'video/mp4'});
}
async function dlHls(url,signal,onP){
  var base=url,txt=await (await getRes(url,signal)).text();
  if(txt.indexOf('#EXT-X-STREAM-INF')>-1){
    var L=txt.split('\n').map(function(x){return x.trim()}),best=null,bw=-1;
    for(var i=0;i<L.length;i++){if(L[i].indexOf('#EXT-X-STREAM-INF')===0){var m=L[i].match(/BANDWIDTH=(\d+)/),b=m?+m[1]:0;if(b>bw&&L[i+1]&&L[i+1][0]!=='#'){bw=b;best=L[i+1]}}}
    if(!best)throw new Error('no variant');
    base=new URL(best,url).href;txt=await (await getRes(base,signal)).text();
  }
  var segs=txt.split('\n').map(function(x){return x.trim()}).filter(function(x){return x&&x[0]!=='#'}).map(function(x){return new URL(x,base).href});
  if(!segs.length)throw new Error('no segments');
  var parts=[],tot=0;
  for(var j=0;j<segs.length;j++){
    var buf=new Uint8Array(await (await getRes(segs[j],signal)).arrayBuffer());parts.push(buf);tot+=buf.length;onP((j+1)/segs.length,tot);
  }
  return new Blob(parts,{type:'video/mp2t'});
}
var DLS=[],dlSeq=0,refresher=null,DLQ='sp_dlq',_db=null;
function dlHist(){try{return JSON.parse(localStorage.getItem('sp_dl')||'[]')}catch(e){return[]}}
function dlSaveHist(a){try{localStorage.setItem('sp_dl',JSON.stringify(a.slice(0,60)))}catch(e){}}
function dlEmit(){window.dispatchEvent(new CustomEvent('jp-dl'))}
function dlMeta(){try{localStorage.setItem(DLQ,JSON.stringify(DLS.map(function(e){return{id:e.id,title:e.title,safe:e.safe,hls:e.hls,url:e.url,vid:e.vid,bytes:e.bytes,total:e.total,pct:e.pct,seg:e.seg,nseg:e.nseg,parts:e.parts,ts:e.ts}})))}catch(x){}}
function idb(){return _db||(_db=new Promise(function(res,rej){var r=indexedDB.open('sp_dl',1);r.onupgradeneeded=function(){r.result.createObjectStore('p')};r.onsuccess=function(){res(r.result)};r.onerror=function(){rej(r.error)}}))}
function idbTx(mode,fn){return idb().then(function(d){return new Promise(function(res,rej){var t=d.transaction('p',mode),out=fn(t.objectStore('p'));t.oncomplete=function(){res(out&&out.result)};t.onerror=function(){rej(t.error)}})})}
function pk(e,n){return e.id+':'+('000000'+n).slice(-6)}
function pStore(e,n,blob){return idbTx('readwrite',function(s){return s.put(blob,pk(e,n))}).catch(function(){(e.mem=e.mem||{})[n]=blob})}
function pClear(e){e.mem={};return idbTx('readwrite',function(s){return s.delete(IDBKeyRange.bound(e.id+':',e.id+';'))}).catch(function(){})}
async function pAssemble(e,type){
  var arr=[];
  for(var i=0;i<e.parts;i++){
    var b=e.mem&&e.mem[i];
    if(!b){try{b=await idbTx('readonly',function(s){return s.get(pk(e,i))})}catch(x){}}
    if(!b)throw new Error('missing part');
    arr.push(b);
  }
  return new Blob(arr,{type:type});
}
function dlAvg(){var r=DLS.filter(function(e){return e.status==='active'});if(!r.length)return 0;return Math.round(r.reduce(function(a,e){return a+e.pct},0)/r.length)}
function setDl(){}
function dlFinish(e,status,msg){
  DLS=DLS.filter(function(x){return x!==e});dlMeta();
  if(status!=='canceled'){var h=dlHist();h.unshift({id:e.id,title:e.title,ts:Date.now(),size:e.bytes,status:status,msg:msg||''});dlSaveHist(h)}
  if(!DLS.length)removeDlCircle();else updDlCircle();
  dlEmit();
}
async function freshUrl(e){
  if(e.vid&&refresher){try{var u=await refresher(e.vid);if(u)e.url=u}catch(x){}}
  return e.url;
}
function upd(e){
  e.pct=e.hls?(e.nseg?Math.round(e.seg/e.nseg*100):0):(e.total?Math.min(99,Math.round(e.bytes/e.total*100)):0);
  updDlCircle();dlEmit();
}
async function runMp4(e,sig){
  await freshUrl(e);
  var buf=[],bl=0;
  var flush=async function(){if(!bl)return;var b=new Blob(buf,{type:'video/mp4'});buf=[];bl=0;await pStore(e,e.parts,b);e.parts++;dlMeta()};
  var r=await getRes(e.url,sig,false,e.bytes?{Range:'bytes='+e.bytes+'-'}:null);
  var skip=0;
  if(e.bytes&&r.status!==206){skip=e.bytes}
  var cr=/\/(\d+)/.exec(r.headers.get('content-range')||'');
  if(!e.total)e.total=cr?+cr[1]:(+r.headers.get('content-length')||0);
  var rd=r.body.getReader();
  try{for(;;){var x=await rd.read();if(x.done)break;var v=x.value;
    if(skip>0){if(v.length<=skip){skip-=v.length;continue}v=v.subarray(skip);skip=0}
    buf.push(v);bl+=v.length;e.bytes+=v.length;if(bl>=4194304)await flush();upd(e)}}
  catch(err){await flush();throw err}
  await flush();
  return pAssemble(e,'video/mp4');
}
async function runHls(e,sig){
  await freshUrl(e);
  var base=e.url,txt=await (await getRes(base,sig)).text();
  if(txt.indexOf('#EXT-X-STREAM-INF')>-1){
    var L=txt.split('\n').map(function(x){return x.trim()}),best=null,bw=-1;
    for(var i=0;i<L.length;i++){if(L[i].indexOf('#EXT-X-STREAM-INF')===0){var m=L[i].match(/BANDWIDTH=(\d+)/),b=m?+m[1]:0;if(b>bw&&L[i+1]&&L[i+1][0]!=='#'){bw=b;best=L[i+1]}}}
    if(!best)throw new Error('no variant');
    base=new URL(best,base).href;txt=await (await getRes(base,sig)).text();
  }
  var segs=txt.split('\n').map(function(x){return x.trim()}).filter(function(x){return x&&x[0]!=='#'}).map(function(x){return new URL(x,base).href});
  if(!segs.length)throw new Error('no segments');
  e.nseg=segs.length;
  for(var j=e.seg||0;j<segs.length;j++){
    var ab=await (await getRes(segs[j],sig)).arrayBuffer();
    await pStore(e,j,new Blob([ab],{type:'video/mp2t'}));
    e.parts=j+1;e.seg=j+1;e.bytes+=ab.byteLength;dlMeta();upd(e);
  }
  return pAssemble(e,'video/mp2t');
}
function dlRun(e){
  if(e.running)return;
  e.running=true;e.status='active';e.err='';e.userPaused=false;e.ctl=new AbortController();
  clearTimeout(e.timer);dlEmit();updDlCircle();
  var sig=e.ctl.signal;
  (e.hls?runHls(e,sig):runMp4(e,sig)).then(function(blob){
    e.running=false;e.bytes=blob.size;
    triggerSave(blob,e.safe+(e.hls?'.ts':'.mp4'));toast('اكتمل تحميل: '+e.title);
    pClear(e);dlFinish(e,'done');
  }).catch(function(x){
    e.running=false;
    if(e.cancelled)return;
    dlMeta();
    if(sig.aborted&&e.userPaused){e.status='paused';e.err='';updDlCircle();dlEmit();return}
    e.retries=(e.retries||0)+1;
    e.status='paused';e.err=navigator.onLine===false?'لا يوجد اتصال':'متوقف مؤقتاً';
    if(e.retries<=12){e.timer=setTimeout(function(){if(e.status==='paused'&&!e.userPaused&&!e.running)dlRun(e)},Math.min(30000,3000*e.retries))}
    else e.err='توقف التحميل - اضغط استئناف';
    updDlCircle();dlEmit();
  });
}
function startDl(base,safe,hls){
  var q=S.quals&&S.quals[S.qi];
  var e={id:'d'+Date.now()+'_'+(++dlSeq),title:(S.opts&&S.opts.title)||safe,safe:safe,hls:!!hls,url:base,vid:q&&q.vid||'',bytes:0,total:0,pct:0,seg:0,nseg:0,parts:0,status:'active',ts:Date.now(),mem:{}};
  DLS.push(e);dl.hidden=false;dlMeta();dlRun(e);return e;
}
function dlRestore(){
  var a;try{a=JSON.parse(localStorage.getItem(DLQ)||'[]')}catch(x){a=[]}
  a.forEach(function(m){if(m&&m.id&&m.url){m.status='paused';m.userPaused=true;m.err='متوقف مؤقتاً';m.mem={};m.running=false;DLS.push(m)}});
  if(DLS.length)setTimeout(dlEmit,0);
}
window.addEventListener('online',function(){DLS.forEach(function(e){if(e.status==='paused'&&!e.userPaused&&!e.running)dlRun(e)})});
dlRestore();
function dlPause(id){DLS.forEach(function(e){if(e.id===id){e.userPaused=true;clearTimeout(e.timer);if(e.running)e.ctl.abort();else{e.status='paused';e.err='';dlEmit();updDlCircle()}}})}
function dlResume(id){DLS.forEach(function(e){if(e.id===id){e.retries=0;e.userPaused=false;var go=function(){if(e.running)setTimeout(go,100);else dlRun(e)};go()}})}
function dlCancelId(id){DLS.forEach(function(e){if(e.id===id){e.cancelled=true;clearTimeout(e.timer);try{e.ctl&&e.ctl.abort()}catch(x){}pClear(e);dlFinish(e,'canceled')}})}
/* الدائرة الصغيرة (مثل Messenger): تُسحب، وتُرمى على علامة × بالأسفل لإخفائها */
function showDlCircle(){
  if(!DLS.length||dl.hidden)return;
  if(dl.circle){updDlCircle();return}
  var c=document.createElement('div');c.className='jp-dlc';
  c.innerHTML='<span class="n"></span>';
  var pos;try{pos=JSON.parse(localStorage.getItem('sp_dlpos')||'null')}catch(e){}
  if(pos){c.style.left=Math.max(4,Math.min(pos.l,window.innerWidth-66))+'px';c.style.top=Math.max(4,Math.min(pos.t,window.innerHeight-66))+'px'}
  document.body.appendChild(c);dl.circle=c;updDlCircle();
  var d=null,tg=null;
  var near=function(){var a=c.getBoundingClientRect(),b=tg.getBoundingClientRect();var dx=a.left+a.width/2-b.left-b.width/2,dy=a.top+a.height/2-b.top-b.height/2;return Math.sqrt(dx*dx+dy*dy)<85};
  c.addEventListener('pointerdown',function(e){
    var r=c.getBoundingClientRect();d={sx:e.clientX,sy:e.clientY,l:r.left,t:r.top,m:false};c.setPointerCapture(e.pointerId);
  });
  c.addEventListener('pointermove',function(e){
    if(!d)return;var dx=e.clientX-d.sx,dy=e.clientY-d.sy;
    if(Math.abs(dx)>6||Math.abs(dy)>6)d.m=true;if(!d.m)return;
    if(!tg){tg=document.createElement('div');tg.className='jp-dlt';tg.innerHTML='<i class="fas fa-xmark"></i>';document.body.appendChild(tg);requestAnimationFrame(function(){tg&&tg.classList.add('on')})}
    c.style.right='auto';c.style.left=Math.max(4,Math.min(window.innerWidth-c.offsetWidth-4,d.l+dx))+'px';
    c.style.top=Math.max(4,Math.min(window.innerHeight-c.offsetHeight-4,d.t+dy))+'px';
    tg.classList.toggle('hot',near());
  });
  var end=function(ev){
    if(!d)return;if(ev&&ev.type==='pointercancel'){d.m=true}var m=d.m;d=null;
    if(!m){if(S.open){if(S.mini)exitMini();openDownload(true)}else window.dispatchEvent(new CustomEvent('jp-dl-open'));return}
    var hit=tg&&near(),t=tg;tg=null;
    if(hit){
      var b=t.getBoundingClientRect();
      c.style.transition='all .25s ease';c.style.left=(b.left+b.width/2-30)+'px';c.style.top=(b.top+b.height/2-30)+'px';c.style.transform='scale(.2)';c.style.opacity='0';
      setTimeout(function(){dl.hidden=true;removeDlCircle();t.remove();var a=document.querySelector('[data-dl-target]');if(a){a.classList.add('dl-pulse');setTimeout(function(){a.classList.remove('dl-pulse')},1300)}toast('التحميل مستمر في الخلفية');dlEmit()},260);
      return;
    }
    if(t){t.classList.remove('on');setTimeout(function(){t.remove()},200)}
    try{localStorage.setItem('sp_dlpos',JSON.stringify({l:parseFloat(c.style.left),t:parseFloat(c.style.top)}))}catch(e){}
  };
  c.addEventListener('pointerup',end);c.addEventListener('pointercancel',end);
}
function updDlCircle(){
  if(!dl.circle)return;var n=dl.circle.querySelector('.n'),run=DLS.some(function(e){return e.status==='active'});
  n.innerHTML=run?dlAvg()+'%':'<i class="fas fa-pause"></i>';dl.circle.style.setProperty('--p',dlAvg()+'%');
}
function removeDlCircle(){if(dl.circle){dl.circle.remove();dl.circle=null}}
function hideDlCircle(){dl.hidden=true;removeDlCircle();dlEmit()}
function openDownload(fromCircle){
  if(S.opts&&S.opts.yt){toast('لا يمكن تنزيل الإعلان');return}
  var base=S.curUrl||(S.opts&&S.opts.quals&&S.opts.quals[0]&&S.opts.quals[0].url);
  if(!base){toast('لا يوجد رابط للتحميل');return}
  if(isFs())exitFs();
  var safe=((S.opts&&S.opts.title)||'video').replace(/[\/\\:*?"<>|]/g,'_');
  modal('تحميل','fa-download',function(b){
    var act=document.createElement('div');b.appendChild(act);
    var draw=function(){
      if(S.modal&&!b.isConnected){window.removeEventListener('jp-dl',draw);return}
      act.innerHTML=DLS.map(function(e){return '<div class="jp-opt" style="cursor:default;gap:10px"><i class="fas fa-arrow-down" style="color:#ff4757"></i><span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+(e.title||'')+'</span><span class="v">'+(e.status==='paused'?'متوقف · ':'')+e.pct+'%</span><button data-p="'+e.id+'" style="border:0;background:rgba(255,255,255,.1);color:#fff;border-radius:50%;width:30px;height:30px"><i class="fas fa-'+(e.status==='paused'?'play':'pause')+'"></i></button><button data-c="'+e.id+'" style="border:0;background:rgba(255,255,255,.1);color:#fff;border-radius:50%;width:30px;height:30px"><i class="fas fa-xmark"></i></button></div>'}).join('');
      [].forEach.call(act.querySelectorAll('[data-p]'),function(x){x.onclick=function(){var e=DLS.filter(function(z){return z.id===x.dataset.p})[0];if(e)e.status==='paused'?dlResume(e.id):dlPause(e.id)}});
      [].forEach.call(act.querySelectorAll('[data-c]'),function(x){x.onclick=function(){dlCancelId(x.dataset.c)}});
    };
    draw();window.addEventListener('jp-dl',draw);
    var box=document.createElement('div');b.appendChild(box);
    box.innerHTML='<button class="jp-opt" id="dlV"><i class="fas fa-film" style="color:#ff4757"></i>تحميل الفيديو<span class="v">'+(isHls(base)?'HLS - TS':'MP4')+'</span></button>'
      +(S.subText?'<button class="jp-opt" id="dlSub"><i class="fas fa-closed-captioning" style="color:#5352ed"></i>تحميل الترجمة<span class="v">VTT</span></button>':'');
    var sub=$('#dlSub',box);
    if(sub)sub.onclick=function(){
      var v=S.subText.trim().indexOf('WEBVTT')===0?S.subText:'WEBVTT\n\n'+S.subText.replace(/\r/g,'').replace(/(\d+:\d+:\d+),(\d+)/g,'$1.$2');
      triggerSave(new Blob(['﻿'+v],{type:'text/vtt;charset=utf-8'}),safe+'.vtt');closeModal();toast('تم تحميل الترجمة');
    };
    $('#dlV',box).onclick=function(){
      startDl(base,safe,isHls(base));
      closeModal();showDlCircle();toast('أُضيف إلى التنزيلات الحالية');
    };
  });
}
window.addEventListener('jp-dl-open',function(){});
/* ───────────── bootstrap ───────────── */
window.JP={open:open,close:close,configure:configure,exitFs:function(){if(isFs())exitFs()},isOpen:function(){return S.open},minimize:enterMini,trailer:trailerOn,endTrailer:trailerOff,isTrailer:function(){return !!TRS},dlList:function(){return{active:DLS.map(function(e){return{id:e.id,title:e.title,pct:e.pct,bytes:e.bytes,total:e.total,ts:e.ts,status:e.status,err:e.err||''}}),past:dlHist()}},dlCancel:dlCancelId,dlPause:dlPause,dlResume:dlResume,setRefresher:function(f){refresher=f},dlRemove:function(id){dlSaveHist(dlHist().filter(function(x){return x.id!==id}));dlEmit()},dlClear:function(){dlSaveHist([]);dlEmit()},dlShow:function(){dl.hidden=false;showDlCircle()}};
})();
