mp-heroes

[Custom]

/* ===== Maropelle · src/heroes.js — ساخت مهرهٔ پهلوانان ===== */
function lbl(text,hex){
 var cv=document.createElement("canvas");cv.width=360;cv.height=90;var x=cv.getContext("2d");
 x.fillStyle="rgba(10,14,30,.78)";if(x.roundRect){x.beginPath();x.roundRect(8,14,344,62,18);x.fill();}else{x.fillRect(8,14,344,62);}
 x.strokeStyle="rgba(255,255,255,.38)";x.lineWidth=3;x.stroke();
 x.font="800 40px 'Vazirmatn',Tahoma";x.fillStyle="#fff";x.textAlign="center";x.textBaseline="middle";x.fillText(text,180,46);
 var t=new THREE.CanvasTexture(cv),sp=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false}));sp.scale.set(2.15,.54,1);return sp;
}
function heroMesh(h){
 var g=new THREE.Group();
 var main=new THREE.MeshStandardMaterial({color:h.color,roughness:.55,metalness:.18}),robM=new THREE.MeshStandardMaterial({color:h.robe,roughness:.7}),dark=new THREE.MeshStandardMaterial({color:h.accent,roughness:.6}),skn=new THREE.MeshStandardMaterial({color:0xe8c9a0,roughness:.7}),stl=new THREE.MeshStandardMaterial({color:0xc9d2dc,roughness:.3,metalness:.8}),lth=new THREE.MeshStandardMaterial({color:0x5a3a1a,roughness:.8}),hairM=new THREE.MeshStandardMaterial({color:h.hair!=null?h.hair:(h.beard===2?0xe8e8e8:0x2b2018),roughness:.9});
 [-1,1].forEach(function(s){var l=new THREE.Mesh(new THREE.CylinderGeometry(.09,.1,.42,8),lth);l.position.set(s*.15,.21,0);g.add(l);var b=new THREE.Mesh(new THREE.BoxGeometry(.22,.12,.32),dark);b.position.set(s*.15,.06,.04);g.add(b);});
 var robe=new THREE.Mesh(new THREE.ConeGeometry(.4,.95,16),robM);robe.position.y=.62;robe.castShadow=true;g.add(robe);
 var belt=new THREE.Mesh(new THREE.CylinderGeometry(.3,.34,.13,16),dark);belt.position.y=.78;g.add(belt);
 var torso=new THREE.Mesh(new THREE.SphereGeometry(.31,16,14),h.apron?skn:main);torso.position.y=1.18;torso.scale.set(1,.85,.85);g.add(torso);
 if(h.apron){var ap=new THREE.Mesh(new THREE.BoxGeometry(.5,.95,.06),new THREE.MeshStandardMaterial({color:0x6b4525,roughness:.85}));ap.position.set(0,1.02,.28);g.add(ap);var stp=new THREE.Mesh(new THREE.BoxGeometry(.5,.06,.05),new THREE.MeshStandardMaterial({color:0x4a2f18,roughness:.85}));stp.position.set(0,1.45,.27);g.add(stp);}
 [-1,1].forEach(function(s){var p=new THREE.Mesh(new THREE.SphereGeometry(.17,12,10),stl);p.position.set(s*.3,1.3,0);p.scale.set(1,.7,1);g.add(p);});
 [-1,1].forEach(function(s){var r=h.apron?.095:.075;var a=new THREE.Mesh(new THREE.CylinderGeometry(r,r,.42,8),h.apron?skn:main);a.position.set(s*.34,1.1,.02);a.rotation.z=s*.18;g.add(a);var hn=new THREE.Mesh(new THREE.SphereGeometry(.085,10,10),skn);hn.position.set(s*.4,.9,.06);g.add(hn);});
 if(!h.banner){var cp=new THREE.Mesh(new THREE.PlaneGeometry(.7,1),new THREE.MeshStandardMaterial({color:h.accent,roughness:.85,side:THREE.DoubleSide}));cp.position.set(0,1,-.28);cp.rotation.x=.12;g.add(cp);}
 var neck=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,.12,8),skn);neck.position.y=1.44;g.add(neck);
 var head=new THREE.Mesh(new THREE.SphereGeometry(.25,18,16),skn);head.position.y=1.62;g.add(head);
 var eyem=new THREE.MeshBasicMaterial({color:0x241a12});[-1,1].forEach(function(s){var e=new THREE.Mesh(new THREE.SphereGeometry(.035,8,8),eyem);e.position.set(s*.09,1.66,.22);g.add(e);});
 if(h.beard){var bd2=new THREE.Mesh(new THREE.BoxGeometry(.27,.17,.15),hairM);bd2.position.set(0,1.5,.15);g.add(bd2);}
 if(h.hair){var hr=new THREE.Mesh(new THREE.SphereGeometry(.27,14,12,0,Math.PI*2,0,Math.PI*.55),hairM);hr.position.y=1.6;g.add(hr);}
 if(h.head==="helm"||h.head==="helmhorn"){
  var hm=new THREE.Mesh(new THREE.SphereGeometry(.27,16,14,0,Math.PI*2,0,Math.PI/2),main);hm.position.y=1.72;g.add(hm);
  var spk=new THREE.Mesh(new THREE.ConeGeometry(.09,.26,10),stl);spk.position.y=1.95;g.add(spk);
  var plm=new THREE.Mesh(new THREE.SphereGeometry(.1,10,10),new THREE.MeshStandardMaterial({color:0xffe08a,emissive:0x664400,emissiveIntensity:.6}));plm.position.y=2.1;g.add(plm);
  if(h.head==="helmhorn"){[-1,1].forEach(function(s){var hrn=new THREE.Mesh(new THREE.ConeGeometry(.06,.3,8),new THREE.MeshStandardMaterial({color:0xffd54a,metalness:.6,roughness:.35}));hrn.position.set(s*.24,1.82,0);hrn.rotation.z=s*.7;g.add(hrn);});}
 }else if(h.head==="helmfeather"){
  var hm2=new THREE.Mesh(new THREE.SphereGeometry(.27,16,14,0,Math.PI*2,0,Math.PI/2),main);hm2.position.y=1.72;g.add(hm2);
  var ft=new THREE.Mesh(new THREE.ConeGeometry(.07,.75,8),new THREE.MeshStandardMaterial({color:0x9fe6d8,emissive:0x2a5a52,emissiveIntensity:.5}));ft.position.set(0,1.95,-.22);ft.rotation.x=-1.1;g.add(ft);
 }else{var band=new THREE.Mesh(new THREE.TorusGeometry(.26,.035,8,20),dark);band.rotation.x=Math.PI/2.2;band.position.y=1.74;g.add(band);}
 var wx=.44,wy=.9,wz=.12;
 if(h.weapon==="mace"){var m1=new THREE.Mesh(new THREE.CylinderGeometry(.045,.05,.95,8),lth);m1.position.set(wx,wy+.2,wz);g.add(m1);var m2=new THREE.Mesh(new THREE.SphereGeometry(.19,14,12),stl);m2.position.set(wx,wy+.72,wz);g.add(m2);}
 else if(h.weapon==="spear"){var p1=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,2.3,8),lth);p1.position.set(wx,wy+.45,wz);g.add(p1);var p2=new THREE.Mesh(new THREE.ConeGeometry(.1,.42,10),stl);p2.position.set(wx,wy+1.75,wz);g.add(p2);}
 else if(h.weapon==="bow"){var bw=new THREE.Mesh(new THREE.TorusGeometry(.62,.035,8,26,Math.PI*1.25),new THREE.MeshStandardMaterial({color:0x8a5a2b,roughness:.7}));bw.position.set(wx,wy+.3,wz);bw.rotation.z=-Math.PI*.62;g.add(bw);var strs=new THREE.Mesh(new THREE.CylinderGeometry(.008,.008,1.18,4),new THREE.MeshBasicMaterial({color:0xdddddd}));strs.position.set(wx,wy+.3,wz+.02);g.add(strs);}
 else if(h.weapon==="hammer"){var h1=new THREE.Mesh(new THREE.CylinderGeometry(.045,.05,.9,8),new THREE.MeshStandardMaterial({color:0x6b4525,roughness:.8}));h1.position.set(wx,wy+.2,wz);g.add(h1);var hk=new THREE.Mesh(new THREE.BoxGeometry(.36,.24,.24),new THREE.MeshStandardMaterial({color:0x8a8f98,roughness:.45,metalness:.75}));hk.position.set(wx,wy+.72,wz);g.add(hk);}
 else{var s1=new THREE.Mesh(new THREE.BoxGeometry(.06,.95,.02),stl);s1.position.set(wx,wy+.6,wz);g.add(s1);var s2=new THREE.Mesh(new THREE.BoxGeometry(.3,.06,.06),new THREE.MeshStandardMaterial({color:0xffd54a,metalness:.6,roughness:.4}));s2.position.set(wx,wy+.15,wz);g.add(s2);var s3=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,.24,8),lth);s3.position.set(wx,wy-.05,wz);g.add(s3);var s4=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,.07,18),new THREE.MeshStandardMaterial({color:0xd4af37,metalness:.5,roughness:.4}));s4.rotation.z=Math.PI/2;s4.position.set(-.44,1.05,.1);g.add(s4);}
 if(h.banner){var bp=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,2,6),new THREE.MeshStandardMaterial({color:0x3a2c18,roughness:.8}));bp.position.set(-.3,1.25,-.3);bp.rotation.z=.16;g.add(bp);var bf=new THREE.Mesh(new THREE.PlaneGeometry(.62,.44),new THREE.MeshStandardMaterial({color:0x7a1020,roughness:.75,side:THREE.DoubleSide,emissive:0x2a0008,emissiveIntensity:.5}));bf.position.set(.02,1.95,-.3);bf.rotation.z=.16;g.add(bf);var bs=new THREE.Mesh(new THREE.OctahedronGeometry(.08),new THREE.MeshStandardMaterial({color:0xffd54a,emissive:0xcc8800,emissiveIntensity:1}));bs.position.set(.02,1.95,-.28);g.add(bs);}
 var lb2=lbl(h.name,h.color);lb2.position.y=2.5;g.add(lb2);g.userData.label=lb2;return g;
}

---
Powered by Paean