mp-creatures

[Custom]

/* ===== Maropelle · src/creatures.js — ضحّاک ماردوش + سیمرغ + انیمیشن رخداد ===== */
var ZAHAK_INFO={},SIMS={};

/* ---- ابزار مشترک ---- */
function clearG(g){while(g.children.length){var c=g.children[g.children.length-1];g.remove(c);if(c.traverse)c.traverse(function(o){if(o.geometry)o.geometry.dispose();var m=o.material;if(Array.isArray(m))m.forEach(function(x){x.dispose();});else if(m)m.dispose();});}}
function marker(cell,rc,gc){var pos=sq(cell);
 var r=new THREE.Mesh(new THREE.TorusGeometry(T*.3,.055,8,24),new THREE.MeshBasicMaterial({color:rc}));r.rotation.x=-Math.PI/2;r.position.set(pos.x,tileTop+.18,pos.z);specialsGroup.add(r);
 var gl2=new THREE.Mesh(new THREE.CircleGeometry(T*.28,22),new THREE.MeshBasicMaterial({color:gc,transparent:true,opacity:.42}));gl2.rotation.x=-Math.PI/2;gl2.position.set(pos.x,tileTop+.17,pos.z);specialsGroup.add(gl2);
}
function buildSpecials(){
 clearG(specialsGroup);
 for(var k in SIMS)delete SIMS[k];
 for(var z in ZAHAK_INFO)delete ZAHAK_INFO[z];
 Object.keys(LAYOUT.ladders).forEach(function(k){var c=+k;marker(c,0xffc24a,0xffe9b0);buildSimorgh(c);});
 Object.keys(LAYOUT.snakes).forEach(function(k){var c=+k;marker(c,0x7a2fd0,0x8e1f2f);buildZahhak(c);});
}

/* ================= ضحّاک ماردوش ================= */
function buildZahhak(from){
 var g=new THREE.Group();
 var dark=new THREE.MeshStandardMaterial({color:0x2a1440,roughness:.7}),dkr=new THREE.MeshStandardMaterial({color:0x120820,roughness:.85}),arm=new THREE.MeshStandardMaterial({color:0x1b1b26,roughness:.45,metalness:.55}),gold=new THREE.MeshStandardMaterial({color:0xd4af37,roughness:.32,metalness:.75}),skn=new THREE.MeshStandardMaterial({color:0x9fae92,roughness:.6}),sM=new THREE.MeshStandardMaterial({color:0x2f9e44,roughness:.4,metalness:.12,emissive:0x06190a,emissiveIntensity:.5}),sD=new THREE.MeshStandardMaterial({color:0x1d6b2e,roughness:.4}),eye=new THREE.MeshBasicMaterial({color:0xff2a2a}),tng=new THREE.MeshBasicMaterial({color:0xff3050});
 var ped=new THREE.Mesh(new THREE.CylinderGeometry(.62,.72,.16,20),dkr);ped.position.y=.08;ped.castShadow=true;g.add(ped);
 var pr=new THREE.Mesh(new THREE.TorusGeometry(.62,.055,8,26),new THREE.MeshStandardMaterial({color:0x5a1420,emissive:0x3a0008,emissiveIntensity:.8}));pr.rotation.x=-Math.PI/2;pr.position.y=.17;g.add(pr);
 [-1,1].forEach(function(s){var l=new THREE.Mesh(new THREE.CylinderGeometry(.1,.12,.5,8),dkr);l.position.set(s*.16,.4,0);g.add(l);var b=new THREE.Mesh(new THREE.BoxGeometry(.24,.12,.38),dkr);b.position.set(s*.16,.18,.06);g.add(b);});
 var robe=new THREE.Mesh(new THREE.ConeGeometry(.5,1.15,20),dark);robe.position.y=.95;robe.castShadow=true;g.add(robe);
 var belt=new THREE.Mesh(new THREE.CylinderGeometry(.4,.44,.14,20),gold);belt.position.y=1.2;g.add(belt);
 var torso=new THREE.Mesh(new THREE.SphereGeometry(.36,18,14),arm);torso.position.y=1.55;torso.scale.set(1,.9,.8);torso.castShadow=true;g.add(torso);
 var sig=new THREE.Mesh(new THREE.CircleGeometry(.11,16),new THREE.MeshStandardMaterial({color:0xff3b2f,emissive:0x66110a,emissiveIntensity:.9}));sig.position.set(0,1.6,.29);g.add(sig);
 [-1,1].forEach(function(s){var sh=new THREE.Mesh(new THREE.SphereGeometry(.19,12,10),arm);sh.position.set(s*.34,1.73,0);g.add(sh);});
 [-1,1].forEach(function(s){var a=new THREE.Mesh(new THREE.CylinderGeometry(.08,.07,.55,8),dark);a.position.set(s*.43,1.44,.06);a.rotation.z=s*.26;g.add(a);var h=new THREE.Mesh(new THREE.SphereGeometry(.1,10,10),skn);h.position.set(s*.52,1.18,.12);g.add(h);});
 var neck=new THREE.Mesh(new THREE.CylinderGeometry(.1,.11,.12,8),skn);neck.position.y=1.86;g.add(neck);
 var head=new THREE.Mesh(new THREE.SphereGeometry(.24,18,16),skn);head.position.y=2.05;g.add(head);
 [-1,1].forEach(function(s){var e=new THREE.Mesh(new THREE.SphereGeometry(.047,10,10),eye);e.position.set(s*.09,2.08,.2);g.add(e);});
 var br=new THREE.Mesh(new THREE.BoxGeometry(.34,.05,.07),dkr);br.position.set(0,2.155,.2);g.add(br);
 var bd=new THREE.Mesh(new THREE.ConeGeometry(.16,.32,10),dkr);bd.position.set(0,1.89,.13);bd.rotation.x=.12;g.add(bd);
 var cr=new THREE.Mesh(new THREE.CylinderGeometry(.265,.265,.13,18,1,true),gold);cr.position.y=2.23;g.add(cr);
 for(var i=0;i<6;i++){var a2=i/6*Math.PI*2,sp=new THREE.Mesh(new THREE.ConeGeometry(.045,.22,6),gold);sp.position.set(Math.sin(a2)*.24,2.4,Math.cos(a2)*.24);g.add(sp);}
 var gem=new THREE.Mesh(new THREE.OctahedronGeometry(.07),new THREE.MeshStandardMaterial({color:0xff2a2a,emissive:0x881111,emissiveIntensity:1}));gem.position.set(0,2.27,.25);g.add(gem);
 /* اژدهایان شانه — با سر جدا و طول پایه برای کشش */
 function snake(side){
  var S=new THREE.Group(),pts=[new THREE.Vector3(0,0,0),new THREE.Vector3(side*.16,.34,.06),new THREE.Vector3(side*.04,.64,-.06),new THREE.Vector3(side*.22,.98,.08),new THREE.Vector3(side*.1,1.26,0)];
  var c=new THREE.CatmullRomCurve3(pts);
  var body=new THREE.Mesh(new THREE.TubeGeometry(c,30,.075,8,false),sM);body.castShadow=true;S.add(body);
  var hg=new THREE.Group();hg.position.copy(pts[4]);
  var hd=new THREE.Mesh(new THREE.SphereGeometry(.13,12,10),sD);hd.castShadow=true;hg.add(hd);
  [-1,1].forEach(function(k){var e=new THREE.Mesh(new THREE.SphereGeometry(.035,8,8),eye);e.position.set(k*.06,.04,.1);hg.add(e);});
  var tg=new THREE.Mesh(new THREE.ConeGeometry(.02,.18,5),tng);tg.position.set(0,-.03,.22);tg.rotation.x=Math.PI/2;hg.add(tg);
  S.add(hg);
  S.position.set(side*.26,1.8,0);
  return {g:S,headG:hg,base:1.26};
 }
 var s1=snake(1),s2=snake(-1);g.add(s1.g);g.add(s2.g);
 var pos=sq(from);g.position.set(pos.x,0,pos.z-.15);specialsGroup.add(g);
 ZAHAK_INFO[from]={group:g,snakes:[s1,s2],phase:Math.random()*6.28,busy:false};
}
/* کشش/نشانه‌گیریِ اژدها به سمت هدف (بدون ساخت هندسهٔ موقت) */
var _UP=new THREE.Vector3(0,1,0),_v1=new THREE.Vector3(),_v2=new THREE.Vector3(),_q1=new THREE.Quaternion();
function aimSnake(z,S,target){
 z.group.updateMatrixWorld(true);
 S.g.getWorldPosition(_v1);
 _v2.copy(target).sub(_v1);
 var dist=_v2.length();
 _q1.copy(z.group.quaternion).invert();
 _v2.applyQuaternion(_q1);
 if(_v2.lengthSq()<1e-6)_v2.set(0,1,0);
 _v2.normalize();
 S.g.quaternion.setFromUnitVectors(_UP,_v2);
 var sy=Math.max(1,dist/S.base);
 S.g.scale.set(1,sy,1);
 S.headG.scale.set(1,1/sy,1);
}
function relaxSnake(S){S.g.quaternion.setFromEuler(new THREE.Euler(0,0,0));S.g.scale.set(1,1,1);S.headG.scale.set(1,1,1);}

/* ---- انیمیشن: گرفتن و حمل مهره توسط ضحّاک ---- */
function zahhakDrag(pi,a,b){
 var z=ZAHAK_INFO[a],p=players[pi];
 if(!z){var t0=twp(pi,b);p.mesh.position.set(t0.x,0,t0.z);p.square=b;return Promise.resolve();}
 z.busy=true;
 var grab=twp(pi,a);
 hintEl.textContent="ضحّاکِ مارْدوش! اژدهایانش او را به دندان گرفتند";SFX.roar();
 return anim(.5,function(t){
   var e=eio(t);z.group.rotation.x=-.3*e;
   z.snakes.forEach(function(S){S.g.scale.set(1,.7+.6*e,1);S.headG.scale.set(1,1/(.7+.6*e),1);});
   aimSnake(z,z.snakes[0],grab);aimSnake(z,z.snakes[1],grab);
   p.mesh.position.set(grab.x,grab.y+.12*Math.sin(t*Math.PI),grab.z);
   p.mesh.rotation.z=Math.sin(t*Math.PI*6)*.08;
 }).then(function(){
   SFX.grab();flash(.85);shk(1.4);spark(grab.clone().add(new THREE.Vector3(0,.7,0)),0x9a30e0,50);
   return anim(.25,function(t){p.mesh.scale.setScalar(1+.15*Math.sin(t*Math.PI));p.mesh.rotation.z=Math.sin(t*Math.PI*9)*.28;});
 }).then(function(){
   p.mesh.scale.setScalar(1);p.mesh.rotation.set(0,0,0);
   var s0=sq(a),tp=twp(pi,b);
   var start=new THREE.Vector3(s0.x,.9,s0.z),end=new THREE.Vector3(tp.x,.2,tp.z);
   var up=new THREE.Vector3().lerpVectors(start,end,.3);up.y=3.2;
   var dip=new THREE.Vector3().lerpVectors(start,end,.75);dip.y=-.95;
   var dd=new THREE.Vector3().subVectors(end,start),phr=new THREE.Vector3(-dd.z,0,dd.x).normalize().multiplyScalar(1.3);
   up.add(phr);dip.addScaledVector(phr,-.5);
   var curve=new THREE.CatmullRomCurve3([start,up,dip,end]);
   SFX.carry();
   return anim(1.9,function(t){
     var u=sm(cl((t-.1)/.9,0,1)),pt=curve.getPoint(u);
     p.mesh.position.copy(pt);
     p.mesh.rotation.z=u*10;p.mesh.rotation.x=Math.sin(u*Math.PI*5)*.5;
     p.mesh.scale.setScalar(1-.12*Math.sin(u*Math.PI));
     aimSnake(z,z.snakes[0],pt);aimSnake(z,z.snakes[1],pt);
     if(t*9%1<.25)spark(pt.clone(),0x7a2fd0,3);
   });
 }).then(function(){
   var te=twp(pi,b);p.mesh.position.set(te.x,0,te.z);p.mesh.rotation.set(0,0,0);p.mesh.scale.setScalar(1);
   spark(te,0xa060ff,26);SFX.thud();shk(.5);
   return anim(.45,function(t){var e=eio(t);z.group.rotation.x=-.3*(1-e);
     z.snakes.forEach(function(S){var k=.7+.3*(1-e);S.g.scale.set(1,k,1);S.headG.scale.set(1,1/k,1);});
     var back=grab.clone().lerp(new THREE.Vector3(s0.x,1.8,s0.z),t);
     aimSnake(z,z.snakes[0],back);aimSnake(z,z.snakes[1],back);});
 }).then(function(){
   z.snakes.forEach(relaxSnake);z.group.rotation.x=0;z.busy=false;return wait(120);
 });
}

/* ================= سیمرغ ================= */
function fGeo(l,w){var s=new THREE.Shape();s.moveTo(0,-w/2);s.quadraticCurveTo(l*.5,-w*.78,l,0);s.quadraticCurveTo(l*.5,w*.78,0,w/2);s.quadraticCurveTo(-w*.5,0,0,-w/2);return new THREE.ShapeGeometry(s);}
function wGeo(){var s=new THREE.Shape();s.moveTo(0,.03);s.quadraticCurveTo(.5,.3,1.05,.25);s.quadraticCurveTo(1.45,.16,1.62,0);s.quadraticCurveTo(1.3,-.26,.85,-.31);s.quadraticCurveTo(.42,-.28,0,-.13);s.lineTo(0,.03);return new THREE.ShapeGeometry(s);}
function wingInner(){var inner=new THREE.Group(),bm=new THREE.MeshStandardMaterial({color:0xf2a63c,roughness:.5,metalness:.25,side:THREE.DoubleSide,emissive:0x3a1e00,emissiveIntensity:.35});inner.add(new THREE.Mesh(wGeo(),bm));
 var f1=new THREE.MeshStandardMaterial({color:0xffc267,roughness:.5,side:THREE.DoubleSide,emissive:0x5a2600,emissiveIntensity:.3}),f2=new THREE.MeshStandardMaterial({color:0xe07a2a,roughness:.5,side:THREE.DoubleSide,emissive:0x4a1a00,emissiveIntensity:.3});
 for(var i=0;i<6;i++){var f=new THREE.Mesh(fGeo(.86+.02*i,.22),i%2?f1:f2);f.position.set(.78+i*.15,-.03-i*.03,.0015*i);f.rotation.z=-(.12+i*.05);inner.add(f);}
 var e=new THREE.Mesh(new THREE.CylinderGeometry(.028,.028,1.55,6),new THREE.MeshStandardMaterial({color:0xffe0a0,metalness:.6,roughness:.3}));e.rotation.z=Math.PI/2;e.position.set(.8,.185,0);inner.add(e);return inner;}
function wRig(){var fl=new THREE.Group(),sw=new THREE.Group(),ro=new THREE.Group();fl.add(sw);sw.add(ro);ro.add(wingInner());return {flap:fl,sweep:sw,roll:ro};}
function tF(l,w,c){var g=fGeo(l,w);g.rotateX(-Math.PI/2);g.rotateY(Math.PI/2);return new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:c,roughness:.5,metalness:.22,side:THREE.DoubleSide,emissive:0x401200,emissiveIntensity:.4}));}
var FSW=1.8,FRL=-1,SRL=Math.PI/2;
function buildSimorgh(from){
 var g=new THREE.Group();
 var gold=new THREE.MeshStandardMaterial({color:0xffb347,roughness:.45,metalness:.35,emissive:0x3a1c00,emissiveIntensity:.4}),gd=new THREE.MeshStandardMaterial({color:0xe8862b,roughness:.5,metalness:.3}),crm=new THREE.MeshStandardMaterial({color:0xffe6b0,roughness:.55}),bkm=new THREE.MeshStandardMaterial({color:0xffd54a,roughness:.35,metalness:.5}),eye=new THREE.MeshBasicMaterial({color:0xff3b2f}),lgm=new THREE.MeshStandardMaterial({color:0xffcf5a,roughness:.5,metalness:.3});
 var bd=new THREE.Mesh(new THREE.SphereGeometry(.4,20,16),gold);bd.scale.set(1,.92,1.45);bd.castShadow=true;g.add(bd);
 for(var r=0;r<3;r++){var cn=5-r;for(var i=0;i<cn;i++){var f=new THREE.Mesh(new THREE.SphereGeometry(.1,8,6),crm),a=(i-(cn-1)/2)*.5;f.position.set(Math.sin(a)*.26,.05-r*.12,.29+Math.cos(a)*.05);f.scale.set(1,.6,1.25);g.add(f);}}
 var nk=new THREE.Mesh(new THREE.CylinderGeometry(.11,.16,.45,12),gold);nk.position.set(0,.33,.48);nk.rotation.x=-.55;g.add(nk);
 for(var j=0;j<5;j++){var c2=new THREE.Mesh(new THREE.ConeGeometry(.05,.16,6),gd),a2=(j-2)*.5;c2.position.set(Math.sin(a2)*.16,.5,.6);c2.rotation.x=-.4;c2.rotation.z=a2;g.add(c2);}
 var hd=new THREE.Mesh(new THREE.SphereGeometry(.19,16,14),gold);hd.position.set(0,.6,.72);g.add(hd);
 for(var k=0;k<5;k++){var c3=new THREE.Mesh(new THREE.ConeGeometry(.042,.24+.05*Math.abs(2-k),7),new THREE.MeshStandardMaterial({color:k%2?0xff7a1f:0xffcf5a,emissive:0x662200,emissiveIntensity:.6}));c3.position.set((k-2)*.05,.75-Math.abs(2-k)*.008,.64-k*.04);c3.rotation.x=-.7-Math.abs(2-k)*.12;g.add(c3);}
 var bk=new THREE.Mesh(new THREE.ConeGeometry(.07,.3,10),bkm);bk.rotation.x=Math.PI/2+.16;bk.position.set(0,.58,.92);g.add(bk);
 var bk2=new THREE.Mesh(new THREE.ConeGeometry(.048,.17,8),bkm);bk2.rotation.x=Math.PI/2-.12;bk2.position.set(0,.53,.88);g.add(bk2);
 [-1,1].forEach(function(s){var e=new THREE.Mesh(new THREE.SphereGeometry(.045,10,10),eye);e.position.set(s*.1,.63,.83);g.add(e);var r2=new THREE.Mesh(new THREE.TorusGeometry(.062,.011,6,14),new THREE.MeshStandardMaterial({color:0xffe08a,emissive:0x886600,emissiveIntensity:.75}));r2.position.set(s*.1,.63,.83);g.add(r2);});
 for(var m=-3;m<=3;m++){var tf=tF(.9,.19,m%2?0xd9622a:0xffb347);tf.position.set(m*.07,.04,-.52);tf.rotation.y=m*.16;g.add(tf);}
 [-1,1].forEach(function(s){var tf2=tF(1.5,.13,0xff8a2f);tf2.position.set(s*.11,.02,-.55);tf2.rotation.y=s*.28;g.add(tf2);});
 [-1,1].forEach(function(s){var l=new THREE.Mesh(new THREE.CylinderGeometry(.028,.028,.28,6),lgm);l.position.set(s*.11,-.33,.1);g.add(l);});
 var RW=wRig();RW.flap.position.set(.3,.18,.02);g.add(RW.flap);var LW=wRig();LW.flap.position.set(-.3,.18,.02);LW.flap.scale.x=-1;g.add(LW.flap);
 g.scale.setScalar(.8);var pch=sq(from),bY=1.62;g.position.set(pch.x,bY,pch.z);g.traverse(function(o){if(o.isMesh)o.castShadow=true;});specialsGroup.add(g);
 SIMS[from]={group:g,RW:RW,LW:LW,perch:pch.clone(),baseY:bY,phase:Math.random()*6.28,flapSpeed:1.2,flapAmt:.1,busy:false,spread:0,spreadNow:0};
}
function setFlap(s,sp,am){s.flapSpeed=sp;s.flapAmt=am;}
/* ---- انیمیشن: پرواز و حمل مهره ---- */
function flyTo(sim,a,b,dur,arc){
 sim.spread=1;setFlap(sim,5,.5);
 var from=a.clone();
 return anim(dur,function(t){
  var e=sm(t);
  sim.group.position.lerpVectors(from,b,e);
  sim.group.position.y+=Math.sin(t*Math.PI)*arc;
  var ty=Math.atan2(b.x-sim.group.position.x,b.z-sim.group.position.z),ny=la(sim.group.rotation.y,ty,.09);
  sim.group.rotation.y=ny;sim.group.rotation.z=cl(-(ny-sim.group.rotation.y)*6,-.45,.45);
 }).then(function(){sim.group.rotation.z=0;});
}
function simorghCarry(pi,a,b){
 var sim=SIMS[a],p=players[pi];
 if(!sim){var t2=twp(pi,b);p.mesh.position.set(t2.x,0,t2.z);p.square=b;return Promise.resolve();}
 sim.busy=true;sim.spread=1;
 var tS=twp(pi,a),tE=twp(pi,b),perch=sim.perch.clone();
 hintEl.textContent="سیمرغ افسانه‌ای فرود آمد تا "+p.h.name+" را پرواز دهد";SFX.simorgh();
 var above=tS.clone().add(new THREE.Vector3(0,2.2,0));
 return flyTo(sim,sim.group.position.clone(),above,1,1.8).then(function(){
  var start=above.clone(),end=tE.clone().add(new THREE.Vector3(0,1.5,0));setFlap(sim,6,.55);
  return anim(2.3,function(t){
   var e=sm(t);
   sim.group.position.lerpVectors(start,end,e);
   sim.group.position.y+=Math.sin(t*Math.PI)*2.2;
   var ty=Math.atan2(tE.x-sim.group.position.x,tE.z-sim.group.position.z),ny=la(sim.group.rotation.y,ty,.06);
   sim.group.rotation.y=ny;sim.group.rotation.z=cl(-(ny-sim.group.rotation.y)*6,-.4,.4);
   p.mesh.position.set(sim.group.position.x+Math.sin(t*Math.PI*2)*.16,sim.group.position.y-1.5,sim.group.position.z+Math.cos(t*Math.PI*2)*.1);
   p.mesh.rotation.z=Math.sin(t*Math.PI*2)*.13;
   if(t*8%1<.3)spark(p.mesh.position.clone(),0xffe08a,1);
  });
 }).then(function(){
  sim.group.rotation.z=0;var end=tE.clone().add(new THREE.Vector3(0,1.5,0));
  return anim(.6,function(t){sim.group.position.lerpVectors(end,tE.clone().add(new THREE.Vector3(0,1.05,0)),sm(t));});
 }).then(function(){
  p.mesh.position.set(tE.x,0,tE.z);p.mesh.rotation.set(0,0,0);spark(tE,0xffe08a,30);shk(.15);
  hintEl.textContent=p.h.name+" با سیمرغ به خانهٔ "+fa(b)+" رسید";return wait(220);
 }).then(function(){return flyTo(sim,sim.group.position.clone(),perch.clone().add(new THREE.Vector3(0,1.1,0)),1.6,1.5);})
 .then(function(){
  sim.spread=0;var high=perch.clone().add(new THREE.Vector3(0,1.1,0));
  return anim(.6,function(t){var e=sm(t);sim.group.position.lerpVectors(high,perch,e);sim.group.rotation.y=la(sim.group.rotation.y,0,.12);});
 }).then(function(){sim.group.position.copy(perch);sim.group.rotation.set(0,0,0);setFlap(sim,1.2,.1);sim.busy=false;});
}
/* ---- تیک موجودات (از حلقهٔ اصلی) ---- */
function creaturesTick(dt,t){
 Object.keys(SIMS).forEach(function(k){var s=SIMS[k];
  if(!s.busy)s.group.position.y=s.baseY+Math.sin(t*1.1+s.phase)*.1;
  s.spreadNow+=(s.spread-s.spreadNow)*Math.min(1,dt*2);
  var sw=L(FSW,0,s.spreadNow),ro=L(FRL,SRL,s.spreadNow),sc=L(.8,1,s.spreadNow),fl=Math.sin(t*s.flapSpeed+s.phase)*s.flapAmt;
  [s.RW,s.LW].forEach(function(rig,i){var sg=i===0?1:-1;rig.flap.rotation.z=sg*fl;rig.sweep.rotation.y=sg*sw;rig.roll.rotation.x=sg*ro;rig.roll.scale.setScalar(sc);});
 });
 Object.keys(ZAHAK_INFO).forEach(function(k){var z=ZAHAK_INFO[k];if(z.busy)return;
  var s1=Math.sin(t*1.8+z.phase);
  z.snakes[0].g.rotation.set(0,0,-.15+s1*.13);
  z.snakes[1].g.rotation.set(0,0,.15-s1*.13);
  z.group.position.y=Math.sin(t*1.3+z.phase)*.03;
 });
}

---
Powered by Paean