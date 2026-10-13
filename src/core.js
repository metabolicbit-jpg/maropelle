mp-core

[Custom]

/* ===== Maropelle · src/core.js — حالت، چینش، نوبت‌ها، تاس، ویژگی‌ها، حلقهٔ اصلی ===== */
var players=[],totalPlayers=0,cur=0,busy=false,gameOver=false,started=false,humanIdx=0,modeCount=1,humanHero="rostam",perfTime=0;
var LAYOUT={ladders:{},snakes:{}};
var anims=[];

/* --- سیستم انیمیشن (محافظت‌شده ضد خطا) --- */
function anim(d,fn){return new Promise(function(res){anims.push({e:0,dur:Math.max(.001,d),fn:fn,done:res});});}
function updA(dt){
 for(var i=anims.length-1;i>=0;i--){
  var a=anims[i];a.e+=dt;var t=Math.min(1,a.e/a.dur);
  try{a.fn(t);}catch(e){if(window.console)console.warn("anim",e);}
  if(t>=1){anims.splice(i,1);try{a.done();}catch(e){}}
 }
}
function twp(pi,ss){var b=sq(ss),ox=0,oz=0;if(totalPlayers>1){var a=(pi/totalPlayers)*Math.PI*2;ox=Math.cos(a)*.5;oz=Math.sin(a)*.5;}return new THREE.Vector3(b.x+ox,0,b.z+oz);}

/* --- چینش (هر بازی نو) --- */
function genLayout(){
 var nL=5+Math.floor(Math.random()*3),nS=5+Math.floor(Math.random()*3),used={};
 function sh(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
 function pick(c,lo,hi,sep){var pool=[];for(var x=lo;x<=hi;x++)if(!used[x])pool.push(x);sh(pool);var o=[];for(var k=0;k<pool.length;k++){if(o.length>=c)break;var cc2=pool[k],bad=false;for(var m=0;m<o.length;m++)if(Math.abs(o[m]-cc2)<sep)bad=true;if(!bad)o.push(cc2);}return o;}
 var ls=pick(nL,4,74,7),ss=pick(nS,18,97,7);
 ls.forEach(function(c){used[c]=1;});ss.forEach(function(c){used[c]=1;});
 function tgt(s,dir,strict){for(var a=0;a<60;a++){var step=6+Math.floor(Math.random()*30),t=s+dir*step;if(t<2||t>99||used[t])continue;if(strict){var bad=false;for(var u in used)if(Math.abs(u-t)<2)bad=true;if(bad)continue;}used[t]=1;return t;}return null;}
 var ladders={},snakes={};
 ls.forEach(function(c){var t=tgt(c,1,true);if(t===null)t=tgt(c,1,false);if(t!==null)ladders[c]=t;});
 ss.forEach(function(c){var t=tgt(c,-1,true);if(t===null)t=tgt(c,-1,false);if(t!==null)snakes[c]=t;});
 LAYOUT={ladders:ladders,snakes:snakes};
}

/* --- شروع بازی --- */
function startGame(mode,key){
 initAudio();modeCount=mode;totalPlayers=mode;humanHero=key;humanIdx=0;
 players.forEach(function(p){scene.remove(p.mesh);});
 players=[];
 var others=HKEYS.filter(function(k){return k!==key;}).sort(function(){return Math.random()-.5;});
 for(var i=0;i<mode;i++){
  var kk=i===0?key:others[(i-1)%others.length],h=HEROES[kk],mesh=heroMesh(h);
  scene.add(mesh);players.push({key:kk,h:h,mesh:mesh,square:0,isAI:i!==0,pow:true,shield:false});
 }
 players.forEach(function(p,i){var w=twp(i,0);p.mesh.position.set(w.x,0,w.z);});
 anims.length=0;
 cur=0;busy=false;gameOver=false;started=true;shakeAmt=0;
 bubEl.innerHTML="";repEl.innerHTML="";rollBtn.disabled=false;lastRollEl.innerHTML="";
 dice.quaternion.copy(FU[1]);dice.position.copy(DHOME);
 genLayout();buildSpecials();updTurn();show("hud");
 hintEl.textContent="یک‌انگشتی بچرخان · دو‌انگشتی زوم";
 if(updPowBtn)updPowBtn();
 say("نوبت تو، "+players[0].h.name);
}

/* ================= ویژگی‌های ویژه ================= */
function canUsePower(i){
 var p=players[i];
 return !!p&&p.pow&&!busy&&!gameOver&&started&&cur===i&&!(p.key==="esfandiar"&&p.shield);
}
function usePower(){
 var i=humanIdx;
 if(!canUsePower(i))return;
 var p=players[i];
 p.pow=false;busy=true;rollBtn.disabled=true;if(updPowBtn)updPowBtn();
 var pw=POWERS[p.key];
 hintEl.textContent="✨ "+p.h.name+" ویژگی «"+(pw?pw.name:"")+"» را به کار برد";
 if(p.key==="kaveh"&&p.isAI)botSay("power");
 runPower(i);
}
function runPower(i){
 var p=players[i];
 /* ---- زال: پرِ سیمرغ (+۶) ---- */
 if(p.key==="zal"){
  var to=Math.min(100,p.square+6);
  return powerZalAnim(i,to).then(function(){
   p.square=to;renderP();
   if(to>=100)return win(i);
   endTurn();
  });
 }
 /* ---- کاوه: درفش (+۲ برای همه) ---- */
 if(p.key==="kaveh"){
  return powerKavehAnim(i).then(function(){
   renderP();
   var w=-1;players.forEach(function(pp,idx){if(w<0&&pp.square>=100)w=idx;});
   if(w>=0)return win(w);
   endTurn();
  });
 }
 /* ---- اسفندیار: رویین‌تن (سپر) ---- */
 if(p.key==="esfandiar"){
  return powerEsfandiarAnim(i).then(function(){
   p.shield=true;
   hintEl.textContent="زرهِ رویین‌تن فعال شد؛ نیش ضحّاک بی‌اثر است";
   if(p.isAI){busy=false;if(updPowBtn)updPowBtn();setTimeout(function(){if(!busy&&!gameOver&&started)rollDice();},700);}
   else{busy=false;rollBtn.disabled=false;if(updPowBtn)updPowBtn();}
  });
 }
 /* پیش‌فرض (ویژگی‌های آینده) */
 busy=false;rollBtn.disabled=false;if(updPowBtn)updPowBtn();
 return Promise.resolve();
}
function aiPower(i){
 if(!canUsePower(i))return;
 players[i].pow=false;busy=true;if(updPowBtn)updPowBtn();
 var p=players[i],pw=POWERS[p.key];
 hintEl.textContent="✨ "+p.h.name+" ویژگی «"+(pw?pw.name:"")+"» را به کار برد";
 botSay("power");
 runPower(i);
}

/* --- انداختن تاس --- */
function rollDice(){
 if(busy||gameOver||!started)return Promise.resolve();
 busy=true;rollBtn.disabled=true;
 var r=1+Math.floor(Math.random()*6),p=players[cur];
 SFX.dice();hintEl.textContent=p.h.name+" تاس می‌اندازد…";lastRollEl.innerHTML="";
 return rollAnim(r).then(function(){
  lastRollEl.innerHTML=DSVG+" "+fa(r);shk(.12);
  if(p.isAI&&r===6&&Math.random()<.7)botSay("six");
  return wait(180);
 }).then(function(){return takeTurn(cur,r);});
}

/* --- انجام نوبت --- */
function takeTurn(pi,r){
 var p=players[pi],from=p.square,to=from+r;
 if(to>100){SFX.inv();hintEl.textContent="عدد زیاد آمد؛ باید دقیقاً روی ۱۰۰ بنشینی.";return wait(650).then(endTurn);}
 var chain=Promise.resolve();
 var step=function(s){
  chain=chain.then(function(){
   var a=p.mesh.position.clone(),b=twp(pi,s);
   return anim(.18,function(t){p.mesh.position.lerpVectors(a,b,eio(t));p.mesh.position.y=Math.sin(t*Math.PI)*.28;})
    .then(function(){p.mesh.position.copy(b);p.square=s;SFX.step();});
  });
 };
 for(var s=from+1;s<=to;s++)step(s);
 return chain
  .then(function(){p.mesh.position.y=0;return anim(.16,function(t){p.mesh.position.y=Math.sin(t*Math.PI)*.4;});})
  .then(function(){
   p.mesh.position.y=0;renderP();
   if(LAYOUT.ladders[to])return simorghCarry(pi,to,LAYOUT.ladders[to]).then(function(){p.square=LAYOUT.ladders[to];say(p.h.name+" با سیمرغ پرواز کرد");if(p.isAI&&Math.random()<.6)botSay("simorgh");});
   if(LAYOUT.snakes[to])return zahhakDrag(pi,to,LAYOUT.snakes[to]).then(function(moved){
     if(moved===false){say(p.h.name+" با رویین‌تنی جان به در برد");}
     else{p.square=LAYOUT.snakes[to];say(p.h.name+" گرفتار ضحّاک شد");if(p.isAI&&Math.random()<.6)botSay("bitten");}
   });
  })
  .then(function(){renderP();if(p.square===100)return win(pi);endTurn();});
}

/* --- پایان نوبت / هوش مصنوعی --- */
function endTurn(){
 cur=(cur+1)%totalPlayers;updTurn();busy=false;if(updPowBtn)updPowBtn();
 var p=players[cur];
 if(p.isAI){
  rollBtn.disabled=true;hintEl.textContent=p.h.name+" (هوشمند) در حال بازی…";
  var delay=750+Math.random()*850;
  if(p.pow&&Math.random()<.5){
   setTimeout(function(){if(!busy&&!gameOver&&started)aiPower(cur);},delay);
  }else{
   setTimeout(function(){if(!busy&&!gameOver&&started)rollDice();},delay);
  }
  if(Math.random()<.3)setTimeout(function(){if(!gameOver&&started&&players[cur].isAI)botSay(Math.random()<.5?"taunt":"grumble");},400+Math.random()*500);
 }else{
  rollBtn.disabled=false;hintEl.textContent="نوبت تو، "+p.h.name;say("نوبت تو، "+p.h.name);
 }
}

/* --- پیروزی --- */
function win(pi){
 gameOver=true;busy=true;rollBtn.disabled=true;SFX.win();if(updPowBtn)updPowBtn();
 var p=players[pi],hex="#"+p.h.color.toString(16).padStart(6,"0");
 if(p.isAI&&Math.random()<.6)botSay("win");
 document.getElementById("winWho").innerHTML='<span style="color:'+hex+'">'+p.h.name+'</span> بر تخت جمشید نشست!';
 say(p.h.name+" بر تخت جمشید نشست");show("win");
 for(var k=0;k<8;k++)setTimeout(function(){var w=twp(pi,100);spark(w,0xffe08a,40);},k*140);
 confetti();
}

/* --- حلقهٔ اصلی --- */
function loop(){
 requestAnimationFrame(loop);
 var dt=Math.min(.05,clock.getDelta());perfTime+=dt;
 updA(dt);updB(dt);
 creaturesTick(dt,perfTime);
 goalTick(dt,perfTime);
 if(!drag&&started&&!adjusted){tAcc+=.0035;camAz=Math.sin(tAcc*.6)*.14;}
 updCam();
 if(shakeAmt>0){camera.position.x+=(Math.random()-.5)*shakeAmt;camera.position.y+=(Math.random()-.5)*shakeAmt;camera.position.z+=(Math.random()-.5)*shakeAmt;shakeAmt*=.9;if(shakeAmt<.01)shakeAmt=0;}
 if(started&&!busy&&!gameOver)players.forEach(function(p,i){p.mesh.position.y=Math.sin(perfTime*3+i*1.3)*.05;p.mesh.rotation.y=Math.sin(perfTime*1.2+i)*.12;});
 players.forEach(function(p){var l=p.mesh.userData.label;if(l)l.quaternion.copy(camera.quaternion);});
 renderer.render(scene,camera);
}
var clock=new THREE.Clock();

---
Powered by Paean