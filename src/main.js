mp-main

[Custom]

/* ===== Maropelle · src/main.js — راه‌انداز ===== */
function boot(){
 buildBoard();
 buildGoal();
 buildDice();
 bindControls();
 bindUI();
 genLayout();
 buildSpecials();
 fitView();
 loop();
}
if(document.fonts&&document.fonts.load){
 Promise.race([
  Promise.all([document.fonts.load("900 62px 'Vazirmatn'"),document.fonts.load("800 40px 'Vazirmatn'"),document.fonts.ready]),
  new Promise(function(r){setTimeout(r,1800);})
 ]).then(boot).catch(boot);
}else{boot();}

---
Powered by Paean