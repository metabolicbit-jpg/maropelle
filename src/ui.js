mp-ui

[Custom]

/* ===== Maropelle · src/ui.js — صفحه‌ها، HUD، حباب گفت‌وگو، انتخاب پهلوان، کاغذرنگی ===== */
var rollBtn=document.getElementById("rollBtn"),turnTxt=document.getElementById("turnTxt"),turnDot=document.querySelector("#turn .dot"),playersEl=document.getElementById("players"),hintEl=document.getElementById("hint"),lastRollEl=document.getElementById("lastRoll"),bubEl=document.getElementById("bubbles"),repEl=document.getElementById("replyBar"),ttsBtn=document.getElementById("ttsBtn"),homeBtn=document.getElementById("homeBtn");
var DSVG='<svg viewBox="0 0 24 24" fill="none" stroke="#ffd76a" stroke-width="1.6" stroke-linejoin="round" style="width:16px;height:16px"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><circle cx="8.5" cy="8.5" r="1.4" fill="#ffd76a" stroke="none"/><circle cx="15.5" cy="15.5" r="1.4" fill="#ffd76a" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="#ffd76a" stroke="none"/></svg>';
var SCR=["menu","select","hud","win"];
function show(id){SCR.forEach(function(x){document.getElementById(x).classList.toggle("hidden",x!==id);});}

/* ---- بازگشت به داشبورد (از بازی یا از صفحهٔ پیروزی) ---- */
function gotoMenu(){
  try{if(window.speechSynthesis)speechSynthesis.cancel();}catch(e){}
  started=false;gameOver=false;busy=false;
  try{resetCam();}catch(e){}
  try{stopConfetti();}catch(e){}
  try{bubEl.innerHTML="";repEl.innerHTML="";}catch(e){}
  try{rollBtn.disabled=false;}catch(e){}
  show("menu");
}

function renderP(){
 playersEl.innerHTML="";
 players.forEach(function(p,i){
  var d=document.createElement("div");d.className="pcard"+(i===cur?" active":"");
  var hex="#"+p.h.color.toString(16).padStart(6,"0");
  var c=document.createElement("span");c.className="c";c.style.background=hex;
  var n=document.createElement("span");n.textContent=p.h.name;d.append(c,n);
  if(p.isAI){var tg=document.createElement("span");tg.className="tag";tg.textContent="هوشمند";d.append(tg);}
  var pos=document.createElement("span");pos.className="pos";pos.textContent=fa(p.square);d.append(pos);
  playersEl.appendChild(d);
 });
}
function updTurn(){var p=players[cur],hex="#"+p.h.color.toString(16).padStart(6,"0");turnTxt.textContent="نوبت: "+p.h.name;turnDot.style.background=hex;turnDot.style.color=hex;renderP();}

var bubT=null;
function bubble(name,hex,text,self){
 var d=document.createElement("div");d.className="bubble"+(self?" you":"");
 var b=document.createElement("div");b.className="bn";b.style.color=hex;b.textContent=name;
 var tt=document.createElement("div");tt.className="bt";tt.textContent=text;
 d.append(b,tt);bubEl.appendChild(d);
 setTimeout(function(){d.style.transition="opacity .4s,transform .4s";d.style.opacity="0";d.style.transform="translateY(-8px)";setTimeout(function(){d.remove();},420);},3200);
 if(bubEl.children.length>2)bubEl.children[0].remove();
}
function botSay(pool){
 var p=players[cur],arr=BOT[pool]||BOT.taunt;
 bubble(p.h.name,"#"+p.h.color.toString(16).padStart(6,"0"),arr[Math.floor(Math.random()*arr.length)],false);
 showRep();
}
function showRep(){
 repEl.innerHTML="";
 var o=HREP.slice().sort(function(){return Math.random()-.5;}).slice(0,3);
 o.forEach(function(s){
  var b=document.createElement("button");b.className="rbtn";b.textContent=s;
  b.onclick=function(){var hp=players[humanIdx];bubble(hp.h.name,"#"+hp.h.color.toString(16).padStart(6,"0"),s,true);say(s);repEl.innerHTML="";};
  repEl.appendChild(b);
 });
 if(bubT)clearTimeout(bubT);
 bubT=setTimeout(function(){repEl.innerHTML="";},9000);
}

function openSelect(mode){
 modeCount=mode;humanHero=null;
 document.getElementById("selSub").textContent=mode===1?"مهرهٔ تو از میان پهلوانان شاهنامه":("تو + "+fa(mode-1)+" حریف افسانه‌ای — پهلوان خود را برگزین");
 var ro=document.getElementById("roster");ro.innerHTML="";
 HKEYS.forEach(function(k){
  var h=HEROES[k],b=document.createElement("button");b.className="hero-card";b.dataset.k=k;
  var m=document.createElement("span");m.className="medal";m.style.background="radial-gradient(circle at 40% 30%,"+h.css+",rgba(0,0,0,.55))";m.innerHTML=WICON[h.weapon];
  var n=document.createElement("span");n.className="hn";n.textContent=h.name;
  var w=document.createElement("span");w.className="hw";w.textContent=h.w;
  b.append(m,n,w);
  b.onclick=function(){humanHero=k;Array.prototype.forEach.call(ro.children,function(c){c.classList.toggle("sel",c.dataset.k===k);});document.getElementById("playBtn").disabled=false;SFX.click();};
  ro.appendChild(b);
 });
 document.getElementById("playBtn").disabled=true;
 show("select");
}

/* ---- کاغذرنگی ---- */
var cc=document.getElementById("confetti"),cx2=cc.getContext("2d"),conf=[],confT=null;
function confetti(){
 cc.width=innerWidth;cc.height=innerHeight;conf=[];
 var colors=["#ffd76a","#ff8a3d","#8ff0a4","#6ab0ff","#ff6b9d","#c9a0ff"];
 for(var i=0;i<180;i++)conf.push({x:Math.random()*cc.width,y:-20-Math.random()*cc.height*.5,vy:2+Math.random()*3.5,vx:(Math.random()-.5)*2,s:6+Math.random()*8,r:Math.random()*Math.PI,vr:(Math.random()-.5)*.3,c:colors[(Math.random()*colors.length)|0]});
 if(confT)clearInterval(confT);
 confT=setInterval(function(){
  cx2.clearRect(0,0,cc.width,cc.height);var alive=false;
  for(var i=0;i<conf.length;i++){var p=conf[i];p.y+=p.vy;p.x+=p.vx;p.r+=p.vr;if(p.y<cc.height+30)alive=true;
   cx2.save();cx2.translate(p.x,p.y);cx2.rotate(p.r);cx2.fillStyle=p.c;cx2.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);cx2.restore();}
  if(!alive){clearInterval(confT);confT=null;cx2.clearRect(0,0,cc.width,cc.height);}
 },16);
}
function stopConfetti(){if(confT){clearInterval(confT);confT=null;cx2.clearRect(0,0,cc.width,cc.height);}}

/* ---- بایند رویدادها ---- */
function bindUI(){
 Array.prototype.forEach.call(document.querySelectorAll(".mode-card"),function(b){b.addEventListener("click",function(){SFX.click();openSelect(+b.dataset.mode);});});
 rollBtn.addEventListener("click",function(){initAudio();SFX.click();rollDice();});
 document.getElementById("resetBtn").addEventListener("click",function(){SFX.click();resetCam();});
 document.getElementById("backBtn").addEventListener("click",function(){SFX.click();show("menu");});
 document.getElementById("playBtn").addEventListener("click",function(){SFX.click();startGame(modeCount,humanHero);});
 document.getElementById("againBtn").addEventListener("click",function(){SFX.click();startGame(totalPlayers,humanHero);});
 document.getElementById("menuBtn").addEventListener("click",function(){SFX.click();gotoMenu();});
 if(homeBtn)homeBtn.addEventListener("click",function(){SFX.click();gotoMenu();});
 ttsBtn.addEventListener("click",function(){SFX.click();toggleTTS();});
 addEventListener("resize",function(){cc.width=innerWidth;cc.height=innerHeight;});
 addEventListener("keydown",function(e){if(e.code==="Space"){e.preventDefault();if(!rollBtn.disabled){initAudio();SFX.click();rollDice();}}});
}

---
Powered by Paean