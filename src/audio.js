mp-audio

[Custom]

/* ===== Maropelle · src/audio.js — WebAudio + نریشن رایگان مرورگر ===== */
var actx=null;
function initAudio(){if(!actx){try{actx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){actx=null;}}if(actx&&actx.state==="suspended")actx.resume();}
function tone(f,d,tp,v,w){if(!actx)return;var t0=actx.currentTime+(w||0),o=actx.createOscillator(),g=actx.createGain();o.type=tp||"sine";o.frequency.setValueAtTime(f,t0);g.gain.setValueAtTime(1e-4,t0);g.gain.linearRampToValueAtTime(v||.18,t0+.012);g.gain.exponentialRampToValueAtTime(1e-4,t0+d);o.connect(g);g.connect(actx.destination);o.start(t0);o.stop(t0+d+.06);}
function gl(f1,f2,d,tp,v,w){if(!actx)return;var t0=actx.currentTime+(w||0),o=actx.createOscillator(),g=actx.createGain();o.type=tp||"sine";o.frequency.setValueAtTime(f1,t0);o.frequency.exponentialRampToValueAtTime(Math.max(20,f2),t0+d);g.gain.setValueAtTime(1e-4,t0);g.gain.linearRampToValueAtTime(v||.16,t0+.02);g.gain.exponentialRampToValueAtTime(1e-4,t0+d);o.connect(g);g.connect(actx.destination);o.start(t0);o.stop(t0+d+.06);}
function boom(f0,f1,d,v,w){if(!actx)return;var t0=actx.currentTime+(w||0),o=actx.createOscillator(),g=actx.createGain();o.type="sine";o.frequency.setValueAtTime(f0,t0);o.frequency.exponentialRampToValueAtTime(Math.max(18,f1),t0+d);g.gain.setValueAtTime(1e-4,t0);g.gain.linearRampToValueAtTime(v,t0+.01);g.gain.exponentialRampToValueAtTime(1e-4,t0+d);o.connect(g);g.connect(actx.destination);o.start(t0);o.stop(t0+d+.06);}
function nb(d,e){var n=Math.floor(actx.sampleRate*d),b=actx.createBuffer(1,n,actx.sampleRate),a=b.getChannelData(0);for(var i=0;i<n;i++){var x=e?e(i/n):(1-i/n);a[i]=(Math.random()*2-1)*x;}var s=actx.createBufferSource();s.buffer=b;return s;}
function hiss(d,f0,f1,v,q){if(!actx)return;var t0=actx.currentTime,s=nb(d,function(u){return Math.sin(u*Math.PI);}),bp=actx.createBiquadFilter();bp.type="bandpass";bp.Q.value=q||2.4;bp.frequency.setValueAtTime(f0,t0);bp.frequency.linearRampToValueAtTime(f1,t0+d);var g=actx.createGain();g.gain.value=v||.16;s.connect(bp);bp.connect(g);g.connect(actx.destination);s.start(t0);}
function clack(v,w){if(!actx)return;var t0=actx.currentTime+(w||0),s=nb(.05),bp=actx.createBiquadFilter();bp.type="bandpass";bp.frequency.value=850+Math.random()*600;bp.Q.value=1.3;var g=actx.createGain();g.gain.setValueAtTime(v||.28,t0);g.gain.exponentialRampToValueAtTime(1e-4,t0+.06);s.connect(bp);bp.connect(g);g.connect(actx.destination);s.start(t0);var o=actx.createOscillator(),og=actx.createGain();o.type="triangle";o.frequency.setValueAtTime(170+Math.random()*130,t0);o.frequency.exponentialRampToValueAtTime(85,t0+.09);og.gain.setValueAtTime(1e-4,t0);og.gain.linearRampToValueAtTime((v||.28)*.7,t0+.005);og.gain.exponentialRampToValueAtTime(1e-4,t0+.13);o.connect(og);og.connect(actx.destination);o.start(t0);o.stop(t0+.16);}

var SFX={
 click:function(){tone(620,.07,"square",.1);},
 dice:function(){var t=0,gp=.11,v=.34;for(var i=0;i<18;i++){clack(v,t);t+=gp;gp*=.94;if(gp<.028)gp=.028;v*=.945;}},
 step:function(){tone(520+Math.random()*170,.07,"triangle",.1);},
 simorgh:function(){if(!actx)return;hiss(.6,340,1500,.18,1.4);[784,988,1319,1568].forEach(function(f,i){tone(f,.42,"sine",.11,i*.11);});gl(1250,860,.5,"sine",.12);gl(1500,1000,.4,"sine",.08,.16);},
 roar:function(){if(!actx)return;boom(120,62,1.2,.22);gl(140,70,1.3,"sawtooth",.14);tone(55,1.7,"triangle",.14);tone(82,1.7,"sine",.09);tone(174,1.5,"sine",.06);tone(185,1.5,"sine",.055);hiss(1.1,600,3000,.12,2.6);},
 grab:function(){if(!actx)return;boom(185,28,1.9,.42);boom(95,45,1.2,.3,.02);gl(520,88,.9,"sawtooth",.2);gl(1900,300,.7,"sawtooth",.16);gl(2600,600,.55,"square",.06);[1245,1660,2080].forEach(function(f,i){tone(f,.5,"triangle",.07,i*.03);});for(var i=0;i<3;i++)clack(.4-i*.09,i*.05);hiss(.6,2800,700,.18,3);},
 carry:function(){if(!actx)return;var t0=actx.currentTime,o=actx.createOscillator(),g=actx.createGain();o.type="sawtooth";o.frequency.value=46;g.gain.setValueAtTime(1e-4,t0);g.gain.linearRampToValueAtTime(.13,t0+.15);g.gain.setValueAtTime(.13,t0+1.6);g.gain.exponentialRampToValueAtTime(1e-4,t0+1.95);o.connect(g);g.connect(actx.destination);o.start(t0);o.stop(t0+2);tone(63,1.9,"triangle",.09);gl(720,320,1.9,"sine",.07);hiss(1.9,900,500,.06,2);},
 thud:function(){if(!actx)return;boom(140,38,.7,.26);clack(.3,0);hiss(.3,1200,400,.1,2.5);},
 inv:function(){tone(180,.18,"square",.13);},
 win:function(){[523,659,784,1047,1319].forEach(function(f,i){tone(f,.5,"triangle",.16,i*.11);tone(f*2,.4,"sine",.07,i*.11);});}
};

/* ---- نریشن فارسی با موتور صدای مرورگر (رایگان، بدون مصرف اعتبار) ---- */
var ttsOn=true,faV=null;
function pv(){try{var vs=speechSynthesis.getVoices()||[];faV=vs.filter(function(v){return /^fa/i.test(v.lang);})[0]||null;}catch(e){}}
function say(t){if(!ttsOn||!("speechSynthesis" in window))return;try{speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(t);u.lang="fa-IR";if(faV)u.voice=faV;u.rate=1;speechSynthesis.speak(u);}catch(e){}}
if("speechSynthesis" in window){pv();speechSynthesis.onvoiceschanged=pv;}
function toggleTTS(){ttsOn=!ttsOn;var b=document.getElementById("ttsBtn");if(b){b.style.borderColor=ttsOn?"rgba(255,215,106,.4)":"rgba(255,255,255,.15)";b.style.opacity=ttsOn?"1":".4";}if(ttsOn){pv();say("نریشن روشن شد");}}

---
Powered by Paean