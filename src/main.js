mp-main

[Custom]

/* ===== Maropelle · src/main.js — راه‌انداز (مقاوم: رابط اول، صحنه بعد) ===== */
function boot(){
 /* ۱) اول رابط کاربری بایند شود تا دکمه‌ها حتی در صورت خطای صحنه کار کنند */
 try{bindControls();}catch(e){err("controls",e);}
 try{bindUI();}catch(e){err("ui",e);}
 try{var l=document.getElementById("load");if(l)l.style.display="none";}catch(e){}
 /* ۲) سپس ساخت صحنه و شروع حلقه */
 try{
  buildBoard();
  buildGoal();
  buildDice();
  genLayout();
  buildSpecials();
  fitView();
  loop();
 }catch(e){err("scene",e);}
}
function err(tag,e){
 var m="⚠ "+tag+": "+((e&&e.message)||e);
 if(window.__mpErr){window.__mpErr(m);}
 else{var el=document.getElementById("err");if(el){el.style.display="block";el.textContent=(el.textContent?el.textContent+"\n":"")+m;}}
 if(window.console&&console.warn)console.warn(m);
}
/* بدون منتظرماندن برای فونت هم اجرا می‌شود (font فقط ظاهری است) */
try{
 if(document.fonts&&document.fonts.load){
  Promise.race([
   Promise.all([document.fonts.load("900 62px 'Vazirmatn'"),document.fonts.load("800 40px 'Vazirmatn'")]),
   new Promise(function(r){setTimeout(r,1500);})
  ]).then(boot).catch(boot);
 }else{boot();}
}catch(e){boot();}

---
Powered by Paean