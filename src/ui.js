/* ===== Maropelle · src/ui.js — صفحه‌ها، HUD، دکمهٔ ویژگی، لوگوی تصویری، حباب گفت‌وگو ===== */
var rollBtn=document.getElementById("rollBtn"),turnTxt=document.getElementById("turnTxt"),turnDot=document.querySelector("#turn .dot"),playersEl=document.getElementById("players"),hintEl=document.getElementById("hint"),lastRollEl=document.getElementById("lastRoll"),bubEl=document.getElementById("bubbles"),repEl=document.getElementById("replyBar"),ttsBtn=document.getElementById("ttsBtn"),homeBtn=document.getElementById("homeBtn"),powBtn=document.getElementById("powBtn"),powTxt=document.getElementById("powTxt");
var DSVG='<svg viewBox="0 0 24 24" fill="none" stroke="#ffd76a" stroke-width="1.6" stroke-linejoin="round" style="width:16px;height:16px"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><circle cx="8.5" cy="8.5" r="1.4" fill="#ffd76a" stroke="none"/><circle cx="15.5" cy="15.5" r="1.4" fill="#ffd76a" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="#ffd76a" stroke="none"/></svg>';
var SCR=["menu","select","hud","win"];
function show(id){SCR.forEach(function(x){document.getElementById(x).classList.toggle("hidden",x!==id);});}

/* ================= لوگوی تصویری پهلوانان (شیت ۲ستون×۳ردیف) ================= */
var HERO_TILES={},sheetTried=false;
function sheetLog(msg){try{if(window.__mpErr)window.__mpErr(msg);}catch(e){}}
function sheetUrls(){
 var roots=(typeof SRC!=="undefined"&&SRC&&SRC.length)?SRC.slice():[ASSET_BASE];
 var alt=(typeof HERO_SHEET_ALT!=="undefined"&&HERO_SHEET_ALT)?HERO_SHEET_ALT:[];
 var names=[HERO_SHEET].concat(alt),out=[];
 for(var i=0;i<names.length;i++)for(var j=0;j<roots.length;j++)out.push(roots[j]+names[i]);
 return out;
}
function cornerBg(d,W,H){
 var pts=[0,(W-1),(H-1)*W,(H-1)*W+W-1],r=0,g=0,b=0,c=0;
 for(var i=0;i<pts.length;i++){var p=pts[i]*4;r+=d[p];g+=d[p+1];b+=d[p+2];c++;}
 return {r:r/c,g:g/c,b:b/c};
}
function buildTiles(img){
 var iw=img.naturalWidth||0,ih=img.naturalHeight||0;
 if(!iw||!ih)return 0;
 var W=Math.min(1000,iw),sc=W/iw,H=Math.max(1,Math.round(ih*sc));
 var cv=document.createElement("canvas");cv.width=W;cv.height=H;
 var x=cv.getContext("2d");x.clearRect(0,0,W,H);x.drawImage(img,0,0,W,H);
 var d;try{d=x.getImageData(0,0,W,H).data;}catch(e){sheetLog("⚠ لوگو: تصویر قابل خواندن نبود (CORS)");return 0;}
 /* ---- ماسکِ جوهر: هر پیکسلی که از رنگ چهار گوشه فاصله دارد = جوهر ---- */
 var bg=cornerBg(d,W,H),m=new Uint8Array(W*H),ink=0,T1=24,T2=52,p,i;
 for(i=0,p=0;i<W*H;i++,p+=4){
  if(d[p+3]<24){m[i]=0;continue;}
  var dd=Math.max(Math.abs(d[p]-bg.r),Math.abs(d[p+1]-bg.g),Math.abs(d[p+2]-bg.b));
  var v=dd<T1?0:(dd>=T2?255:Math.round((dd-T1)/(T2-T1)*255));
  m[i]=v;if(v>60)ink++;
 }
 if(ink<W*H*0.006){sheetLog("⚠ لوگو: پس‌زمینه/جوهر تشخیص داده نشد (تصویر یکدست است؟)");return 0;}
 /* ---- لایهٔ برش‌خورده: پس‌زمینه شفاف می‌شود ---- */
 var mk=document.createElement("canvas");mk.width=W;mk.height=H;
 var mx=mk.getContext("2d"),md=mx.createImageData(W,H),p2;
 for(i=0,p2=0;i<W*H;i++,p2+=4){md.data[p2]=d[p2];md.data[p2+1]=d[p2+1];md.data[p2+2]=d[p2+2];md.data[p2+3]=m[i];}
 mx.putImageData(md,0,0);
 /* ---- کادر کل جوهر ---- */
 var minX=W,minY=H,maxX=-1,maxY=-1,y,xx;
 for(y=0;y<H;y++)for(xx=0;xx<W;xx++){if(m[y*W+xx]>60){if(xx<minX)minX=xx;if(xx>maxX)maxX=xx;if(y<minY)minY=y;if(y>maxY)maxY=y;}}
 if(maxX<0)return 0;
 var BW=maxX-minX+1,BH=maxY-minY+1,got=0;
 /* ---- برش مطمئن ۲ستون×۳ردیف + تنگ‌کردن هر خانه ---- */
 for(var r=0;r<3;r++)for(var c=0;c<2;c++){
  var k=SPRITE_ORDER[r*2+c];if(!k)continue;
  var cx0=minX+Math.floor(BW*c/2),cx1=minX+Math.floor(BW*(c+1)/2)-1;
  var cy0=minY+Math.floor(BH*r/3),cy1=minY+Math.floor(BH*(r+1)/3)-1;
  var x0=cx1,x1=cx0,y0=cy1,y1=cy0,yy,x2;
  for(yy=cy0;yy<=cy1;yy++)for(x2=cx0;x2<=cx1;x2++){if(m[yy*W+x2]>60){if(x2<x0)x0=x2;if(x2>x1)x1=x2;if(yy<y0)y0=yy;if(yy>y1)y1=yy;}}
  if(x1<x0||y1<y0){sheetLog("⚠ لوگو: خانهٔ خالی ("+k+")");continue;}
  x0=Math.max(0,x0-2);y0=Math.max(0,y0-2);x1=Math.min(W-1,x1+2);y1=Math.min(H-1,y1+2);
  var w=x1-x0+1,h=y1-y0+1,side=Math.max(w,h),S=256,k2=S/side;
  var t=document.createElement("canvas");t.width=S;t.height=S;
  var tx=t.getContext("2d");try{tx.imageSmoothingQuality="high";}catch(e){}
  tx.drawImage(mk,x0,y0,w,h,(S-w*k2)/2,(S-h*k2)/2,w*k2,h*k2);
  try{HERO_TILES[k]=t.toDataURL("image/png");got++;}catch(e){}
 }
 if(!got)sheetLog("⚠ لوگو: برش تصویر ممکن نشد");
 return got;
}
function refreshSelect(){var s=document.getElementById("select");if(s&&!s.classList.contains("hidden"))openSelect(modeCount);}
function loadHeroSheet(){
 if(sheetTried)return;sheetTried=true;
 if(typeof HERO_SHEET==="undefined")return;
 var urls=sheetUrls(),i=0;
 function next(){
  if(i>=urls.length){sheetLog("⚠ لوگوها بارگذاری نشد. این آدرس را در مرورگر باز کن: "+urls[0]);return;}
  var u=urls[i++],im=new Image();
  im.crossOrigin="anonymous";
  im.onload=function(){
   var n=0;try{n=buildTiles(im);}catch(e){n=0;}
   if(n>0){sheetLog("✔ "+fa(n)+" لوگوی تصویری بارگذاری شد.");refreshSelect();}
   else next();
  };
  im.onerror=function(){next();};
  im.src=u;
 }
 next();
}

function gotoMenu(){
 try{if(window.speechSynthesis)speechSynthesis.cancel();}catch(e){}
 started=false;gameOver=false;busy=false;
 try{resetCam();}catch(e){}
 try{stopConfetti();}catch(e){}
 try{bubEl.innerHTML="";repEl.innerHTML="";}catch(e){}
 try{rollBtn.disabled=false;}catch(e){}
 updPowBtn();
 show("menu");
}

function updPowBtn(){
 if(!powBtn)return;
 var p=players[humanIdx];
 if(!p||!started||gameOver){powBtn.disabled=true;powBtn.classList.remove("ready");if(powTxt)powTxt.textContent="ویژگی";return;}
 var pw=POWERS[p.key];
 if(powTxt)powTxt.textContent=(pw?pw.name:"ویژگی");
 if(pw)powBtn.title=pw.desc;
 var ready=!!p.pow&&cur===humanIdx&&!busy;
 powBtn.disabled=!ready;
 powBtn.classList.toggle("ready",ready);
}

function renderP(){
 playersEl.innerHTML="";
 players.forEach(function(p,i){
  var d=document.createElement("div");d.className="pcard"+(i===cur?" active":"");
  var hex="#"+p.h.color.toString(16).padStart(6,"0");
  var c=document.createElement("span");c.className="c";c.style.background=hex;
  var n=document.createElement("span");n.textContent=p.h.name;d.append(c,n);
  if(p.isAI){var tg=document.createElement("span");tg.className="tag";tg.textContent="هوشمند";d.append(tg);}
  if(p.shield){var sh=document.createElement("span");sh.className="tag";sh.style.borderColor="#ffd76a";sh.style.color="#ffd76a";sh.textContent="رویین‌تن";d.append(sh);}
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
 loadHeroSheet();
 document.getElementById("selSub").textContent=mode===1?"مهرهٔ تو از میان پهلوانان شاهنامه":("تو + "+fa(mode-1)+" حریف افسانه‌ای — پهلوان خود را برگزین");
 var ro=document.getElementById("roster");ro.innerHTML="";
 HKEYS.forEach(function(k){
  var h=HEROES[k],pw=POWERS[k],b=document.createElement("button");b.className="hero-card";b.dataset.k=k;
  var m=document.createElement("span");m.className="medal";
  if(HERO_TILES[k]){
   m.classList.add("art");
   var im=document.createElement("img");im.src=HERO_TILES[k];im.alt=h.name;m.appendChild(im);
  }else{
   m.style.background="radial-gradient(circle at 40% 30%,"+h.css+",rgba(0,0,0,.55))";
   m.innerHTML=WICON[h.weapon];
  }
  var n=document.createElement("span");n.className="hn";n.textContent=h.name;
  var w=document.createElement("span");w.className="hw";w.textContent=h.w;
  var pwEl=document.createElement("span");pwEl.className="hpow";pwEl.textContent="✨ "+(pw?pw.name:"");
  b.append(m,n,w,pwEl);
  b.onclick=function(){humanHero=k;Array.prototype.forEach.call(ro.children,function(c){c.classList.toggle("sel",c.dataset.k===k);});document.getElementById("playBtn").disabled=false;SFX.click();hintEl.textContent=(POWERS[k]?POWERS[k].desc:"");};
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
 if(powBtn)powBtn.addEventListener("click",function(){initAudio();SFX.click();usePower();});
 document.getElementById("resetBtn").addEventListener("click",function(){SFX.click();resetCam();});
 document.getElementById("backBtn").addEventListener("click",function(){SFX.click();show("menu");});
 document.getElementById("playBtn").addEventListener("click",function(){SFX.click();startGame(modeCount,humanHero);});
 document.getElementById("againBtn").addEventListener("click",function(){SFX.click();startGame(totalPlayers,humanHero);});
 document.getElementById("menuBtn").addEventListener("click",function(){SFX.click();gotoMenu();});
 if(homeBtn)homeBtn.addEventListener("click",function(){SFX.click();gotoMenu();});
 ttsBtn.addEventListener("click",function(){SFX.click();toggleTTS();});
 addEventListener("resize",function(){cc.width=innerWidth;cc.height=innerHeight;});
 addEventListener("keydown",function(e){if(e.code==="Space"){e.preventDefault();if(!rollBtn.disabled){initAudio();SFX.click();rollDice();}}});
 loadHeroSheet();
}