mp-lang

[Custom]

/* ===== Maropelle · src/lang.js — ابزارها، دادهٔ پهلوانان، دیالوگ‌ها، ویژگی‌ها ===== */
var FA="۰۱۲۳۴۵۶۷۸۹";
function fa(n){return String(n).replace(/[0-9]/g,function(d){return FA[+d];});}
function sm(t){return t*t*t*(t*(t*6-15)+10);}
function L(a,b,t){return a+(b-a)*t;}
function cl(v,a,b){return Math.max(a,Math.min(b,v));}
function la(a,b,t){var d=b-a;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;return a+d*t;}
function wait(ms){return new Promise(function(r){setTimeout(r,ms);});}
function eio(t){return t<.5?2*t*t:-1+(4-2*t)*t;}
function eoc(t){return 1-Math.pow(1-t,3);}

/* ---- پهلوانان ---- */
var HEROES={
 rostam:{name:"رستم",w:"گرز",color:0xd64545,accent:0x7a5a18,robe:0xb23b3b,weapon:"mace",head:"helm",beard:1,hair:null,apron:false,banner:false,css:"#d64545"},
 sohrab:{name:"سهراب",w:"نیزه",color:0xf0a028,accent:0x8a5a10,robe:0xd98c1f,weapon:"spear",head:"helm",beard:0,hair:0x2b2018,apron:false,banner:false,css:"#f0a028"},
 arash:{name:"آرش کمانگیر",w:"کمان",color:0x4caf50,accent:0x256b2a,robe:0x3f9c48,weapon:"bow",head:"band",beard:0,hair:0x2b2018,apron:false,banner:false,css:"#4caf50"},
 esfandiar:{name:"اسفندیار",w:"شمشیر",color:0x9c27b0,accent:0x4b1560,robe:0x8e24aa,weapon:"sword",head:"helmhorn",beard:1,hair:null,apron:false,banner:false,css:"#9c27b0"},
 kaveh:{name:"کاوه آهنگر",w:"پتک و درفش",color:0xc98a3a,accent:0x5a3416,robe:0x8d5a2b,weapon:"hammer",head:"band",beard:1,hair:0x2b2018,apron:true,banner:true,css:"#e0a34a"},
 zal:{name:"زال",w:"شمشیر سپید",color:0xcfd8dc,accent:0x607d8b,robe:0xeceff1,weapon:"sword",head:"helmfeather",beard:2,hair:0xe8e8e8,apron:false,banner:false,css:"#cfd8dc"}
};
var HKEYS=Object.keys(HEROES);

/* ---- ویژگی ویژهٔ هر پهلوان (هر بازی یک‌بار) ---- */
var POWERS={
 rostam:{name:"زورِ گُرز",desc:"یک‌بار تاس را دوباره می‌اندازی و مجموعِ دو تاس را می‌روی."},
 sohrab:{name:"تازه‌دست",desc:"هر بار ۱ بیاوری، یک تاسِ اضافه هم می‌اندازی."},
 arash:{name:"تیرِ آرش",desc:"یک‌بار به‌جای تاس، ۵ خانه جلو می‌روی و از تله‌ها می‌گذری."},
 esfandiar:{name:"رویین‌تن",desc:"یک‌بار از یک حملهٔ ضحّاک جان سالم به در می‌بری."},
 kaveh:{name:"درفشِ کاویانی",desc:"یک‌بار درفش را می‌افرازی: تو و رقیبان ۲ خانه جلو می‌روید."},
 zal:{name:"پرِ سیمرغ",desc:"یک‌بار پرِ سیمرغ را می‌سوزانی و او تو را ۶ خانه جلو می‌برد."}
};

/* ---- گفت‌وگوی حریفان ---- */
var BOT={
 taunt:["تاس من همیشه شش می‌آید، ای بی‌دست‌وپا!","برو کنار، این میدان جای پهلوانان است.","تو را چه به هماوردی با من؟","سیمرغ هم اگر بیاید، تو را نمی‌برد!"],
 grumble:["این تاس تقلبی است، به جانِ خودم!","چرا همیشه من؟ نکند نفرین شده‌ام.","اه! زمین زیر پایم سست شد.","دیوانه شدم از این بختِ کج."],
 hail:["هماوردت را صدا کن، ای نام‌آور!","کجایی ای گردن‌فراز؟ میدان خالی است."],
 six:["شش آمد! راهِ من روشن است.","تاس با من یار است، آماده شو!"],
 simorgh:["سیمرغ مرا بر آسمان برد، تو جا بمان!","پرِ سیمرغ و بختِ من — تو چه داری؟"],
 bitten:["آه! ضحّاکِ مارْدوش! رهایم کن!","اژدها! به دادم برسید!"],
 pass_:["نوبتِ من گذشت، اما هنوز پیشت هستم."],
 win:["تخت جمشید از آنِ من است! سرت را پایین بیاور.","دیدم که گفتم؛ پهلوانی به تاس است نه به لاف!"],
 power:["ویژگیِ من را ببین و بترس!","وقتش رسید؛ زورِ افسانه‌ای‌ام را نشان می‌دهم!"]
};
var HREP=[
 "دمت گرم پهلوان، اما آخرین خنده از آنِ من است.",
 "ببینیم تاسِ تو چند می‌آید!",
 "از من دور شو، ای خودستا!",
 "بر تخت جمشید فقط یک جا هست، و آن هم مالِ من است.",
 "پهلوانی به گفتار نیست، به کردار است.",
 "این لاف‌ها را بس کن و تاس بینداز!",
 "سیمرغ هم اگر بیاید، مرا می‌برد نه تو را!",
 "من از نسلِ رستمم؛ با بادِ دهانت نمی‌لرزم."
];
var WICON={
 mace:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="6" r="3.4"/><path d="M12 9.5V21"/></svg>',
 spear:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 20L17 6"/><path d="M17 6l3-2-1 3.4-3.4 1z" fill="#fff" stroke="none"/></svg>',
 bow:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round"><path d="M18 4a12 12 0 010 16"/><path d="M18 4L6 12l12 8"/></svg>',
 sword:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v13"/><path d="M8 17h8"/><path d="M12 17v4"/></svg>',
 hammer:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="11" height="6" rx="1.4"/><path d="M11.5 10v11"/></svg>'
};

---
Powered by Paean