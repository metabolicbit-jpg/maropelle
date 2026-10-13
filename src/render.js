mp-render

[Custom]

/* ===== Maropelle · src/render.js — صحنه، تخته، تخت جمشید، تاس، دوربین ===== */
var scene=new THREE.Scene();scene.background=new THREE.Color(0x0a1024);scene.fog=new THREE.Fog(0x0a1024,62,132);
var camera=new THREE.PerspectiveCamera(52,innerWidth/innerHeight,.1,500);
var renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
document.getElementById("app").appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xbfd4ff,0x2a2418,.85));
var sun=new THREE.DirectionalLight(0xfff3d6,1.05);sun.position.set(-18,34,20);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-30;sun.shadow.camera.right=30;sun.shadow.camera.top=32;sun.shadow.camera.bottom=-26;sun.shadow.camera.far=130;sun.shadow.bias=-.0004;scene.add(sun);
var rim=new THREE.DirectionalLight(0x6a86ff,.42);rim.position.set(16,14,-18);scene.add(rim);
var ground=new THREE.Mesh(new THREE.CircleGeometry(95,64),new THREE.MeshStandardMaterial({color:0x111a33,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-1.4;ground.receiveShadow=true;scene.add(ground);
(function(){var g=new THREE.BufferGeometry(),n=700,p=new Float32Array(n*3);for(var i=0;i<n;i++){var r=72+Math.random()*82,a=Math.random()*Math.PI*2,e=Math.random()*.9;p[i*3]=Math.cos(a)*r;p[i*3+1]=10+e*70;p[i*3+2]=Math.sin(a)*r;}g.setAttribute("position",new THREE.BufferAttribute(p,3));scene.add(new THREE.Points(g,new THREE.PointsMaterial({color:0x9db7ff,size:.7,transparent:true,opacity:.7})));})();
var boardGroup=new THREE.Group();scene.add(boardGroup);
var specialsGroup=new THREE.Group();scene.add(specialsGroup);

/* ---- هندسهٔ تخته ---- */
var T=2,HALF=10,tileTop=-.15;
var BOARD_HX=HALF*T/2+.6,TRAY_D=4.6,TRAY_Z0=10.9,TRAY_ZC=TRAY_Z0+TRAY_D/2,CONTENT_ZC=2.5,CONTENT_HZ=(TRAY_Z0+TRAY_D+BOARD_HX)/2;
function sq(n){if(n<=0){var b=sq(1);return new THREE.Vector3(b.x,0,b.z+T*1.35);}var i=n-1,r=Math.floor(i/10),c=i%10,col=(r%2===0)?c:(9-c);return new THREE.Vector3((col-(HALF/2-.5))*T,0,((HALF/2-.5)-r)*T);}
function numTex(n){var cv=document.createElement("canvas");cv.width=cv.height=128;var x=cv.getContext("2d");x.clearRect(0,0,128,128);x.font="900 62px 'Vazirmatn',Tahoma";x.textAlign="center";x.textBaseline="middle";x.fillStyle="rgba(45,35,15,.78)";x.fillText(fa(n),64,70);var t=new THREE.CanvasTexture(cv);t.anisotropy=4;return t;}
function buildBoard(){
 var base=new THREE.Mesh(new THREE.BoxGeometry(HALF*T+1.2,.9,HALF*T+1.2),new THREE.MeshStandardMaterial({color:0x2a1f14,roughness:.85}));base.position.y=-.75;base.receiveShadow=true;base.castShadow=true;boardGroup.add(base);
 var fm=new THREE.MeshStandardMaterial({color:0x6b4a24,roughness:.7,metalness:.15}),fw=.5,len=HALF*T+1.2;
 [[0,len/2+fw/2],[0,-(len/2+fw/2)]].forEach(function(p){var m=new THREE.Mesh(new THREE.BoxGeometry(len+fw,fw,fw),fm);m.position.set(p[0],.1,p[1]);m.castShadow=true;boardGroup.add(m);});
 [[len/2+fw/2,0],[-(len/2+fw/2),0]].forEach(function(p){var m=new THREE.Mesh(new THREE.BoxGeometry(fw,fw,len+fw),fm);m.position.set(p[0],.1,p[1]);m.castShadow=true;boardGroup.add(m);});
 for(var n=1;n<=100;n++){var pos=sq(n),i=n-1,r=Math.floor(i/10),c=i%10,col=((r+c)%2===0)?0xf3e9d2:0xe2cfa0;
  var tl=new THREE.Mesh(new THREE.BoxGeometry(T*.97,.3,T*.97),new THREE.MeshStandardMaterial({color:col,roughness:.75}));tl.position.set(pos.x,tileTop,pos.z);tl.receiveShadow=true;boardGroup.add(tl);
  var lb=new THREE.Mesh(new THREE.PlaneGeometry(T*.8,T*.8),new THREE.MeshBasicMaterial({map:numTex(n),transparent:true}));lb.rotation.x=-Math.PI/2;lb.position.set(pos.x,tileTop+.16,pos.z);boardGroup.add(lb);}
 var sp=sq(0),pad=new THREE.Mesh(new THREE.BoxGeometry(T*2,.3,T*1.2),new THREE.MeshStandardMaterial({color:0x3b4a86,roughness:.6,emissive:0x101a3a}));pad.position.set(sp.x,tileTop,sp.z);boardGroup.add(pad);
 var cv=document.createElement("canvas");cv.width=256;cv.height=128;var cx=cv.getContext("2d");cx.font="900 54px 'Vazirmatn',Tahoma";cx.fillStyle="#ffe08a";cx.textAlign="center";cx.textBaseline="middle";cx.fillText("شروع",128,66);
 var stt=new THREE.Mesh(new THREE.PlaneGeometry(T*1.8,T*.9),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),transparent:true}));stt.rotation.x=-Math.PI/2;stt.position.set(sp.x,tileTop+.17,sp.z);boardGroup.add(stt);
}

/* ---- تخت جمشید (خانهٔ ۱۰۰) ---- */
var gFlame=null,gCrown=null,gFlag=null,gStar=null,gLight=null;
function buildGoal(){
 var g=new THREE.Group(),stone=new THREE.MeshStandardMaterial({color:0xdccfae,roughness:.8}),stone2=new THREE.MeshStandardMaterial({color:0xc9b98f,roughness:.85}),gold=new THREE.MeshStandardMaterial({color:0xe8b923,roughness:.3,metalness:.8,emissive:0x3a2600,emissiveIntensity:.4}),dkm=new THREE.MeshStandardMaterial({color:0x3a2c18,roughness:.7}),pos=sq(100);
 var b1=new THREE.Mesh(new THREE.BoxGeometry(3.2,.35,3),stone);b1.position.set(0,.17,0);b1.castShadow=true;b1.receiveShadow=true;g.add(b1);
 var b2=new THREE.Mesh(new THREE.BoxGeometry(2.6,.35,2.4),stone2);b2.position.set(0,.5,0);g.add(b2);
 for(var i=0;i<3;i++){var st=new THREE.Mesh(new THREE.BoxGeometry(1.4-i*.3,.16,.4),stone);st.position.set(0,.08+i*.16,1.5-i*.28);g.add(st);}
 var cH=1.7,cR=.09;[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]].forEach(function(p){var x=p[0],z=p[1];
  var c=new THREE.Mesh(new THREE.CylinderGeometry(cR,cR*1.15,cH,10),stone);c.position.set(x,.68+cH/2,z);c.castShadow=true;g.add(c);
  var r=new THREE.Mesh(new THREE.TorusGeometry(cR*1.12,.015,6,12),stone2);r.rotation.x=Math.PI/2;r.position.set(x,.68+cH*.72,z);g.add(r);
  var cp=new THREE.Mesh(new THREE.BoxGeometry(.3,.14,.3),stone);cp.position.set(x,.68+cH+.07,z);g.add(cp);
  var cp2=new THREE.Mesh(new THREE.BoxGeometry(.42,.1,.22),stone2);cp2.position.set(x,.68+cH+.19,z);g.add(cp2);});
 var tb=new THREE.Mesh(new THREE.BoxGeometry(.72,.5,.62),gold);tb.position.set(0,.93,0);tb.castShadow=true;g.add(tb);
 var bk=new THREE.Mesh(new THREE.BoxGeometry(.72,.72,.12),gold);bk.position.set(0,1.4,-.24);g.add(bk);
 gCrown=new THREE.Mesh(new THREE.OctahedronGeometry(.16),new THREE.MeshStandardMaterial({color:0xffe066,emissive:0xffaa00,emissiveIntensity:1}));gCrown.position.set(0,2,0);g.add(gCrown);
 var al=new THREE.Mesh(new THREE.CylinderGeometry(.22,.3,.5,12),stone2);al.position.set(0,.93,.72);g.add(al);
 gFlame=new THREE.Mesh(new THREE.ConeGeometry(.16,.52,10),new THREE.MeshStandardMaterial({color:0xff9a2e,emissive:0xff6a00,emissiveIntensity:1.5,transparent:true,opacity:.92}));gFlame.position.set(0,1.4,.72);g.add(gFlame);
 var pl=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,3.2,8),dkm);pl.position.set(1.35,1.2,-1.05);g.add(pl);
 gFlag=new THREE.Mesh(new THREE.PlaneGeometry(.9,.6),new THREE.MeshStandardMaterial({color:0x7a1020,roughness:.7,side:THREE.DoubleSide,emissive:0x2a0008,emissiveIntensity:.5}));gFlag.position.set(1.8,2.4,-1.05);g.add(gFlag);
 gStar=new THREE.Mesh(new THREE.OctahedronGeometry(.12),new THREE.MeshStandardMaterial({color:0xffd54a,emissive:0xcc8800,emissiveIntensity:1.1}));gStar.position.set(1.8,2.4,-1.03);g.add(gStar);
 var rg=new THREE.Mesh(new THREE.TorusGeometry(1.95,.06,8,44),new THREE.MeshBasicMaterial({color:0xffd76a}));rg.rotation.x=-Math.PI/2;rg.position.y=.36;g.add(rg);
 gLight=new THREE.PointLight(0xffaa44,.9,11);gLight.position.set(0,1.7,.72);g.add(gLight);
 g.position.set(pos.x,0,pos.z);g.scale.setScalar(.9);g.traverse(function(o){if(o.isMesh)o.castShadow=true;});scene.add(g);
}
function goalTick(dt,t){if(gFlame){var f=1+Math.sin(t*11)*.16+Math.sin(t*23)*.06;gFlame.scale.set(1,f,1);gFlame.material.opacity=.85+Math.sin(t*17)*.12;}if(gCrown){gCrown.rotation.y+=dt*1.4;gCrown.position.y=2+Math.sin(t*1.8)*.05;}if(gStar)gStar.rotation.y-=dt*1.6;if(gFlag){gFlag.rotation.y=Math.sin(t*1.6)*.28;gFlag.rotation.z=Math.sin(t*2.3)*.05;}if(gLight)gLight.intensity=.8+Math.sin(t*13)*.25;}

/* ---- ذرات جرقّه ---- */
var bursts=[];
function spark(pos,color,count){var geo=new THREE.BufferGeometry(),p=new Float32Array(count*3),v=[];for(var i=0;i<count;i++){p[i*3]=pos.x;p[i*3+1]=pos.y;p[i*3+2]=pos.z;v.push(new THREE.Vector3((Math.random()-.5)*4,1.5+Math.random()*4,(Math.random()-.5)*4));}geo.setAttribute("position",new THREE.BufferAttribute(p,3));var pts=new THREE.Points(geo,new THREE.PointsMaterial({color:color,size:.3,transparent:true,opacity:1}));scene.add(pts);bursts.push({pts:pts,vel:v,life:0,max:1.1});}
function updB(dt){for(var i=bursts.length-1;i>=0;i--){var b=bursts[i];b.life+=dt;var arr=b.pts.geometry.attributes.position.array;for(var j=0;j<b.vel.length;j++){b.vel[j].y-=6*dt;arr[j*3]+=b.vel[j].x*dt;arr[j*3+1]+=b.vel[j].y*dt;arr[j*3+2]+=b.vel[j].z*dt;}b.pts.geometry.attributes.position.needsUpdate=true;b.pts.material.opacity=Math.max(0,1-b.life/b.max);if(b.life>=b.max){scene.remove(b.pts);b.pts.geometry.dispose();b.pts.material.dispose();bursts.splice(i,1);}}}
var flashEl=document.getElementById("flash");
function flash(s){flashEl.style.opacity=String(s);setTimeout(function(){flashEl.style.opacity="0";},140);}
var shakeAmt=0;function shk(a){shakeAmt=Math.max(shakeAmt,a);}

/* ---- تاس سه‌بعدی + سینی ---- */
var DS=1.5,RESTY=.78,DDUR=1.35,DHOME=new THREE.Vector3(0,RESTY,TRAY_ZC),dice=null,FU={};
function pipT(v){var cv=document.createElement("canvas");cv.width=cv.height=256;var x=cv.getContext("2d");x.fillStyle="#f7f3e6";x.fillRect(0,0,256,256);x.strokeStyle="#d9d0b8";x.lineWidth=10;x.strokeRect(8,8,240,240);x.fillStyle="#241c12";var P={TL:[70,70],TR:[186,70],C:[128,128],BL:[70,186],BR:[186,186],L1:[70,60],L2:[70,128],L3:[70,196],R1:[186,60],R2:[186,128],R3:[186,196]},M={1:["C"],2:["TL","BR"],3:["TL","C","BR"],4:["TL","TR","BL","BR"],5:["TL","TR","C","BL","BR"],6:["L1","L2","L3","R1","R2","R3"]};M[v].forEach(function(k){x.beginPath();x.arc(P[k][0],P[k][1],24,0,Math.PI*2);x.fill();});var t=new THREE.CanvasTexture(cv);t.anisotropy=4;return t;}
function buildDice(){
 var tw=HALF*T+1.2;
 var tray=new THREE.Mesh(new THREE.BoxGeometry(tw,.5,TRAY_D),new THREE.MeshStandardMaterial({color:0x5a3d22,roughness:.8}));tray.position.set(0,-.25,TRAY_ZC);tray.receiveShadow=true;tray.castShadow=true;scene.add(tray);
 var matM=new THREE.Mesh(new THREE.BoxGeometry(tw-.5,.06,TRAY_D-.5),new THREE.MeshStandardMaterial({color:0x6b4a28,roughness:.7}));matM.position.set(0,.005,TRAY_ZC);scene.add(matM);
 var rim1=new THREE.MeshStandardMaterial({color:0xa9773f,roughness:.6,metalness:.2});
 var fr=new THREE.Mesh(new THREE.BoxGeometry(tw,.16,.24),rim1);fr.position.set(0,.08,TRAY_Z0+TRAY_D);scene.add(fr);
 [-1,1].forEach(function(s){var sd=new THREE.Mesh(new THREE.BoxGeometry(.24,.16,TRAY_D),rim1);sd.position.set(s*tw/2,.08,TRAY_ZC);scene.add(sd);});
 var mats=[3,4,1,6,2,5].map(function(v){return new THREE.MeshStandardMaterial({map:pipT(v),roughness:.35,metalness:.05});});
 dice=new THREE.Mesh(new THREE.BoxGeometry(DS,DS,DS),mats);dice.castShadow=true;dice.position.copy(DHOME);scene.add(dice);
 FU[1]=new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,0));FU[2]=new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2,0,0));FU[3]=new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,Math.PI/2));FU[4]=new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,-Math.PI/2));FU[5]=new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/2,0,0));FU[6]=new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,Math.PI));
}
function rollAnim(res){
 var qs=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),Math.random()*Math.PI*2),qf=qs.clone().multiply(FU[res]);
 var q0=new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.random()*6.28,Math.random()*6.28,Math.random()*6.28));
 var ax=new THREE.Vector3(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize();
 var sp=DHOME.clone().add(new THREE.Vector3((Math.random()-.5)*4,DHOME.y+6.5,-2));
 dice.position.copy(sp);dice.quaternion.copy(q0);
 return anim(DDUR,function(t){dice.position.x=THREE.MathUtils.lerp(sp.x,DHOME.x,Math.min(1,t*1.7));dice.position.z=THREE.MathUtils.lerp(sp.z,DHOME.z,Math.min(1,t*1.7));dice.position.y=RESTY+(sp.y-RESTY)*Math.abs(Math.cos(t*Math.PI*2.7))*(1-t)*(1-t);var sl=q0.clone().slerp(qf,eoc(t)),qsp=new THREE.Quaternion().setFromAxisAngle(ax,(1-t)*(1-t)*Math.PI*8);dice.quaternion.copy(qsp.multiply(sl));}).then(function(){dice.quaternion.copy(qf);dice.position.copy(DHOME);});
}

/* ---- دوربین + کنترل لمسی/ماوس ---- */
var DELE=.60,camAz=0,camEle=DELE,camDist=48,homeDist=48,drag=false,lX=0,lY=0,tAcc=0,zoomed=false,adjusted=false,tMode=null,pInit=null;
function updCam(){camEle=Math.max(.2,Math.min(1.15,camEle));var sp=Math.sin(camEle);camera.position.set(Math.sin(camAz)*camDist*sp,Math.cos(camEle)*camDist,Math.cos(camAz)*camDist*sp);camera.lookAt(0,.6,CONTENT_ZC);}
function fitView(){var asp=innerWidth/innerHeight;camera.aspect=asp;camera.updateProjectionMatrix();var vF=camera.fov*Math.PI/180,hF=2*Math.atan(Math.tan(vF/2)*asp),mg=1.22;var dX=(BOARD_HX*mg)/Math.tan(hF/2),dZ=(CONTENT_HZ*Math.cos(DELE)*mg)/Math.tan(vF/2);homeDist=cl(Math.max(dX,dZ),22,120);if(!zoomed)camDist=homeDist;updCam();}
function resetCam(){camAz=0;camEle=DELE;zoomed=false;adjusted=false;tAcc=0;fitView();}
function bindControls(){
 var el3=renderer.domElement;
 el3.addEventListener("mousedown",function(e){drag=true;lX=e.clientX;lY=e.clientY;});
 addEventListener("mousemove",function(e){if(!drag)return;camAz-=(e.clientX-lX)*.006;camEle-=(e.clientY-lY)*.004;lX=e.clientX;lY=e.clientY;adjusted=true;updCam();});
 addEventListener("mouseup",function(){drag=false;});
 el3.addEventListener("wheel",function(e){camDist=cl(camDist+e.deltaY*.03,20,120);zoomed=true;adjusted=true;updCam();},{passive:true});
 el3.addEventListener("touchstart",function(e){if(e.touches.length===1){tMode="r";drag=true;lX=e.touches[0].clientX;lY=e.touches[0].clientY;pInit=null;}else if(e.touches.length>=2){tMode="p";drag=false;var a=e.touches[0],b=e.touches[1];pInit={d:Math.hypot(b.clientX-a.clientX,b.clientY-a.clientY),ang:Math.atan2(b.clientY-a.clientY,b.clientX-a.clientX),cd:camDist,ca:camAz,el:camEle,my:(a.clientY+b.clientY)/2};}},{passive:true});
 el3.addEventListener("touchmove",function(e){if(tMode==="r"&&e.touches.length===1){var t=e.touches[0];camAz-=(t.clientX-lX)*.006;camEle-=(t.clientY-lY)*.004;lX=t.clientX;lY=t.clientY;adjusted=true;updCam();}else if(tMode==="p"&&e.touches.length>=2&&pInit){var a=e.touches[0],b=e.touches[1],d=Math.hypot(b.clientX-a.clientX,b.clientY-a.clientY),an=Math.atan2(b.clientY-a.clientY,b.clientX-a.clientX);camDist=cl(pInit.cd*(pInit.d/Math.max(1,d)),20,120);camAz=pInit.ca+(an-pInit.ang);var my=(a.clientY+b.clientY)/2;camEle=cl(pInit.el+(my-pInit.my)*.004,.2,1.15);zoomed=true;adjusted=true;updCam();}e.preventDefault();},{passive:false});
 el3.addEventListener("touchend",function(e){if(e.touches.length===0){tMode=null;drag=false;pInit=null;}else if(e.touches.length===1){tMode="r";drag=true;lX=e.touches[0].clientX;lY=e.touches[0].clientY;pInit=null;}});
 addEventListener("resize",function(){renderer.setSize(innerWidth,innerHeight);fitView();});
}

---
Powered by Paean