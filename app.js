(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var ic=function(n,c){return '<svg class="ic '+(c||'')+'" aria-hidden="true"><use href="#i-'+n+'"/></svg>'};
var view=$('#view'),app=$('#app');
var tt;function toast(m){var t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('on')},2800)}
function demo(m){return function(){toast(m||'Demo — this action is not connected to a backend')}}

/* ---------- charts ---------- */
function smooth(p){var d='M'+p[0][0]+' '+p[0][1];for(var i=0;i<p.length-1;i++){var p0=p[i-1]||p[i],p1=p[i],p2=p[i+1],p3=p[i+2]||p2;
  d+=' C'+(p1[0]+(p2[0]-p0[0])/6).toFixed(1)+' '+(p1[1]+(p2[1]-p0[1])/6).toFixed(1)+','+(p2[0]-(p3[0]-p1[0])/6).toFixed(1)+' '+(p2[1]-(p3[1]-p1[1])/6).toFixed(1)+','+p2[0].toFixed(1)+' '+p2[1].toFixed(1)}return d}
var uid=0;
function lineChart(el,o){
  var W=720,H=o.h||290,L=52,R=14,T=14,B=38,iw=W-L-R,ih=H-T-B,id='g'+(++uid),n=o.series[0].data.length,s='';
  s+='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+o.label+'"><defs>';
  o.series.forEach(function(se,i){s+='<linearGradient id="'+id+i+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+se.color+'" stop-opacity=".32"/><stop offset="1" stop-color="'+se.color+'" stop-opacity="0"/></linearGradient>'});
  s+='</defs>';
  o.yt.forEach(function(v){var y=T+ih-v/o.ymax*ih;s+='<line class="gl" x1="'+L+'" x2="'+(W-R)+'" y1="'+y+'" y2="'+y+'"/><text class="ax" x="'+(L-12)+'" y="'+(y+4)+'" text-anchor="end">'+o.fmt(v)+'</text>'});
  o.labels.forEach(function(l,i){var x=L+iw*i/(o.labels.length-1);s+='<line class="gl" x1="'+x+'" x2="'+x+'" y1="'+T+'" y2="'+(T+ih)+'"/><text class="ax" x="'+x+'" y="'+(H-8)+'" text-anchor="'+(i===0?'start':i===o.labels.length-1?'end':'middle')+'">'+l+'</text>'});
  var all=[];
  o.series.forEach(function(se,i){var pts=se.data.map(function(v,k){return [L+iw*k/(n-1),T+ih-v/o.ymax*ih]});all.push(pts);var d=smooth(pts);
    s+='<path d="'+d+' L'+pts[n-1][0]+' '+(T+ih)+' L'+pts[0][0]+' '+(T+ih)+'Z" fill="url(#'+id+i+')"/><path d="'+d+'" fill="none" stroke="'+se.color+'" stroke-width="3" stroke-linecap="round" style="filter:drop-shadow(0 0 6px '+se.color+')"/>';
    pts.forEach(function(p,k){if(k%2===0||k===n-1)s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="4.500" fill="#fff" stroke="'+se.color+'" stroke-width="2.500"/>'})});
  s+='<line id="'+id+'v" class="gl" y1="'+T+'" y2="'+(T+ih)+'" stroke="#8fb4ff" style="opacity:0"/></svg><div class="tip"></div>';
  el.innerHTML=s;
  var svg=$('svg',el),tip=$('.tip',el),vl=$('#'+id+'v',el);
  function mv(e){var r=svg.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*W,k=Math.round((x-L)/iw*(n-1));k=Math.max(0,Math.min(n-1,k));var px=L+iw*k/(n-1);
    vl.setAttribute('x1',px);vl.setAttribute('x2',px);vl.style.opacity=1;
    tip.style.left=(px/W*r.width)+'px';tip.style.top=(Math.min.apply(null,all.map(function(p){return p[k][1]}))/H*r.height)+'px';tip.style.opacity=1;
    tip.innerHTML='<b>'+(o.tipl?o.tipl(k):'Point '+(k+1))+'</b>'+o.series.map(function(se){return '<span><i style="background:'+se.color+'"></i>'+se.name+': '+o.fmt(se.data[k],1)+'</span>'}).join('')}
  svg.addEventListener('pointermove',mv);svg.addEventListener('pointerleave',function(){tip.style.opacity=0;vl.style.opacity=0});
}
function donut(segs,r,sw,total){var C=2*Math.PI*r,off=0,s='<svg viewBox="0 0 '+(2*(r+sw))+' '+(2*(r+sw))+'" aria-hidden="true">';
  segs.forEach(function(g){var l=C*g.v/total;s+='<circle cx="'+(r+sw)+'" cy="'+(r+sw)+'" r="'+r+'" fill="none" stroke="'+g.c+'" stroke-width="'+sw+'" stroke-dasharray="'+(l-3)+' '+(C-l+3)+'" stroke-dashoffset="'+(-off)+'" stroke-linecap="round"/>';off+=l});return s+'</svg>'}

/* ---------- data ---------- */
var TR={
 '7D':{labels:['Mon','Wed','Fri','Sun'],v:[7.2,8.1,9.6,10.4,9.8,11.2,12.1],l:[2.4,3.5,3.9,4.8,4.6,5.9,6.2],d:[.9,1.4,1.5,2.1,2.0,2.6,3.1],tl:['Mon','Tue','Wed','Thu','Fri','Sat','Sun']},
 '30D':{labels:['Oct 1','Oct 8','Oct 15','Oct 22','Oct 30'],v:[5.7,7.6,10,10.4,8.1,7.9,9.8,10.9,10.1,12.5,13.4,13.6],l:[3.4,5.3,6.2,6.2,4.7,4.8,6.4,7.0,5.8,8.2,8.4,10.3],d:[1.1,2.4,3.3,3.2,1.7,1.9,3,3.5,2.4,4.4,5.1,6.5],
   tl:['Oct 1','Oct 4','Oct 8','Oct 11','Oct 14','Oct 16','Oct 19','Oct 22','Oct 24','Oct 27','Oct 29','Oct 30']},
 '90D':{labels:['Aug','Sep','Oct','Nov'],v:[4.2,5.1,6.8,6.1,8.4,9.2,8.8,10.6,11.9,12.8,13.0,14.1],l:[2.1,2.6,3.9,3.6,4.9,5.6,5.2,7,7.8,8.7,9,10.2],d:[.7,1,1.6,1.4,2.1,2.5,2.4,3.4,4.1,4.8,5.3,6.4],tl:['Aug 1','Aug 15','Sep 1','Sep 15','Oct 1','Oct 10','Oct 20','Oct 30','Nov 3','Nov 6','Nov 8','Nov 10']}};
var CARS=[
 {id:1,n:'Nissan Altima 2024',p:1350000,v:124,l:12,img:'car-altima',s:'Active',f:1},
 {id:2,n:'Toyota Corolla 2024',p:950000,v:98,l:8,img:'car-corolla',s:'Active'},
 {id:3,n:'BMW 320i 2023',p:1750000,v:210,l:20,img:'car-bmw',s:'Active'},
 {id:4,n:'Nissan Sunny 2027',p:620000,v:320,l:52,img:'car-nissan',s:'Active'},
 {id:5,n:'Hyundai Elantra 2023',p:890000,v:76,l:6,img:'car-blue',s:'Pending'},
 {id:6,n:'Kia Cerato 2022',p:780000,v:41,l:3,img:'car-red',s:'Expired'}];
var egp=function(n){return 'EGP '+n.toLocaleString('en-US')};

/* ---------- pages ---------- */
var P={};
P.dashboard=function(){
 return '<section class="welcome"><h1>Welcome Back,<br>Auto World Motors! <span aria-hidden="true">👋</span></h1><p>Here’s your performance overview for today</p></section>'+
 '<div class="row r-kpi">'+
 kpi('b','car','124','+18%','Active Listings')+kpi('p','eye','428K','+22%','Total Views')+kpi('g','chat','1,856','+35%','Leads Received')+kpi('o','hand','312','+28%','Successful Deals')+
 '<div class="card perf">'+ic('trend')+'<div><h4>Your Performance<br>is 35% Higher!</h4><p>Compared to last month</p></div><div class="mini" aria-hidden="true"><i style="height:22px;opacity:.6"></i><i style="height:32px;opacity:.75"></i><i style="height:44px;opacity:.9"></i><i style="height:56px"></i></div></div></div>'+
 '<div class="row r-2">'+
  '<section class="card c-red" aria-labelledby="pt"><div class="head"><h3 id="pt">'+ic('bars')+'Performance Trends</h3><div class="pill-g" id="rng"><button aria-pressed="false">7D</button><button aria-pressed="true">30D</button><button aria-pressed="false">90D</button></div></div><div class="legend"><span><i style="background:#1e9bff"></i>Views</span><span><i style="background:#ff2a4a"></i>Leads</span><span><i style="background:#9a4dff"></i>Deals</span></div><div class="chart" id="trend"></div></section>'+
  '<section class="card" aria-labelledby="ta"><div class="head"><h3 id="ta">'+ic('trophy')+'<span style="color:#ffc533;display:contents"></span>Top Performing Ads</h3><a class="link" href="#/inventory">View All '+ic('arrow')+'</a></div>'+
   '<div class="ad"><div class="ad-main"><img src="assets/car-nissan.webp" alt="Nissan Sunny 2027"><div class="txt"><b>Nissan Sunny 2027</b><span><em>EGP</em>620,000</span></div></div><div class="ad-side"><img src="assets/car-blue.webp" alt=""><img src="assets/car-red.webp" alt=""></div></div>'+
   '<div class="stats3"><div class="v">'+ic('eye')+'<b>45K</b><small>Views</small><u>↑ 12%</u></div><div class="l">'+ic('chat')+'<b>520</b><small>Leads</small><u>↑ 8%</u></div><div class="d">'+ic('hand')+'<b>98</b><small>Deals</small><u>↑ 15%</u></div></div></section>'+
  '<section class="card c-purple ai" aria-labelledby="ai1"><h3 id="ai1">'+ic('spark')+'AI Insights<span class="beta">Beta</span></h3><div class="big"><div><b>'+ic('up')+'+40%</b><p>Increase in leads<br>for Toyota models</p></div>'+'<svg class="bulbs" viewBox="0 0 64 64" aria-hidden="true"><g stroke="#7fb0ff" stroke-width="2.500" stroke-linecap="round"><path d="M32 3v6M10 12l4 4M54 12l-4 4M3 32h6M55 32h6"/></g><path d="M32 14a14 14 0 0 0-8 25.500V45h16v-5.500A14 14 0 0 0 32 14z" fill="#ffd166"/><path d="M25 48h14v3a3 3 0 0 1-3 3h-8a3 3 0 0 1-3-3z" fill="#7fb0ff"/></svg>'+'</div>'+
   '<ul><li><span class="ck">'+ic('check')+'</span>Boost your SUVs with premium positioning.</li><li><span class="ck">'+ic('check')+'</span>Consider adding more offers on financing plans.</li></ul><a class="btn-blue" href="#/insights">See Full Insights '+ic('arrow')+'</a></section>'+
 '</div>'+
 '<div class="row r-3">'+
  '<section class="card" aria-labelledby="is"><div class="head"><h3 id="is">'+ic('car')+'Inventory Status</h3><a class="link" href="#/inventory">View All '+ic('arrow')+'</a></div><div class="inv"><div class="donut">'+donut([{v:112,c:'#19d38a'},{v:7,c:'#ffd23f'},{v:5,c:'#8e9bb8'}],56,13,124)+'<div><b>124</b><small>Total Ads</small></div></div><ul><li><i style="background:#19d38a"></i>Active<b>112 (90%)</b></li><li><i style="background:#ff8a1f"></i>Pending<b>7 (6%)</b></li><li><i style="background:#9aa6c4"></i>Expired<b>5 (4%)</b></li></ul></div></section>'+
  '<section class="card" aria-labelledby="fp"><div class="head"><h3 id="fp">'+ic('wallet')+'Financing Performance</h3><a class="link" href="#/financing">View Details '+ic('arrow')+'</a></div><div class="fin"><div class="pct"><b>28%</b><p>of buyers<br>chose financing</p></div><div class="bars" aria-hidden="true">'+[28,26,34,40,34,44,50,60,52,70,64,84,92,98,90].map(function(h){return '<i style="height:'+h+'%"></i>'}).join('')+'</div></div></section>'+
  '<section class="card" aria-labelledby="qa"><h3 id="qa"><span style="color:#ffc533;display:inline-flex">'+ic('bolt')+'</span>Quick Actions</h3><div class="q"><button data-act="new">'+ic('car')+'Post<br>New Ad</button><button data-act="fin">'+ic('calc')+'Apply for<br>Financing</button><button data-act="sup">'+ic('head')+'Contact<br>Support</button></div></section>'+
  '<section class="card promo"><div><div><h4>Drive More Sales<br>with Dubizzle &amp; Hatla2ee</h4><p>Unlock more features with our premium solutions.</p></div><a class="btn-red" href="#/premium">Learn More '+ic('arrow')+'</a></div><img src="assets/key.webp" alt=""></section>'+
 '</div>';
};
function kpi(c,i,n,d,l){return '<div class="card kpi '+c+'"><div class="tile '+c+'">'+ic(i)+'</div><div><div class="n"><b>'+n+'</b><span>'+ic('up')+d+'</span></div><small>'+l+'</small></div></div>'}
P.dashboard.after=function(){
 function draw(k){var t=TR[k];lineChart($('#trend'),{label:'Views, leads and deals over '+k,labels:t.labels,ymax:15,yt:[0,5,10,15],fmt:function(v,d){return d?(v.toFixed(1)+'K'):(v?v+'K':'0')},tipl:function(i){return t.tl[Math.min(i,t.tl.length-1)]},series:[{name:'Views',color:'#1e9bff',data:t.v},{name:'Leads',color:'#ff2a4a',data:t.l},{name:'Deals',color:'#9a4dff',data:t.d}]})}
 draw('30D');$$('#rng button').forEach(function(b){b.addEventListener('click',function(){$$('#rng button').forEach(function(x){x.setAttribute('aria-pressed','false')});b.setAttribute('aria-pressed','true');draw(b.textContent)})});
 $$('.q button').forEach(function(b){b.addEventListener('click',function(){var a=b.dataset.act;if(a==='new'){location.hash='#/inventory';setTimeout(function(){var x=$('#addcar');x&&x.click()},60)}else if(a==='fin')location.hash='#/financing';else toast('Support request opened — a specialist will contact you (demo)')})});
};

P.inventory=function(){return '<div class="ph"><h1>My Inventory</h1><p>Manage your stock — '+CARS.length+' sample ads shown of 124.</p></div>'+
 '<div class="bar"><button class="btn-add" id="addcar">'+ic('plus')+'Add Car</button><label class="search" style="margin:0;flex:1;min-width:200px"><svg class="ic"><use href="#i-search"/></svg><input id="isearch" type="search" placeholder="Search by make, model..." aria-label="Search inventory"></label><select class="fi" id="ifilter" aria-label="Filter by status"><option value="">All statuses</option><option>Active</option><option>Pending</option><option>Expired</option></select></div><div class="cars" id="cars"></div>'};
P.inventory.after=function(){
 function draw(){var q=($('#isearch').value||'').toLowerCase(),f=$('#ifilter').value;var l=CARS.filter(function(c){return (!q||c.n.toLowerCase().indexOf(q)>-1)&&(!f||c.s===f)});
  $('#cars').innerHTML=l.length?l.map(function(c){return '<article class="car"><div class="ph2"><img src="assets/'+c.img+'.webp" alt="'+c.n+'">'+(c.f?'':'')+'<button class="heart" aria-label="Save '+c.n+'">'+ic('heart')+'</button></div><div class="bd"><h4>'+c.n+'</h4><div class="pr">'+egp(c.p)+'</div><div class="mt">'+c.v+' views · '+c.l+' leads</div><div class="ft"><span class="st '+c.s.toLowerCase()+'">'+c.s+'</span><span class="mt">'+c.s+'</span><button aria-label="More actions">'+ic('dots')+'</button></div></div></article>'}).join(''):'<p class="empty">No cars match your search.</p>';
  $$('.heart').forEach(function(h){h.addEventListener('click',function(){h.classList.toggle('on')})});$$('.ft button').forEach(function(b){b.addEventListener('click',demo('Edit / boost / pause options (demo)'))})}
 $('#isearch').addEventListener('input',draw);$('#ifilter').addEventListener('change',draw);draw();
 $('#addcar').addEventListener('click',demo('Add Car form opens here (demo)'));
};

P.performance=function(){return '<div class="ph"><h1>Performance — Track Your Growth</h1><p>Overview of listings, leads and sales.</p></div><div class="bar"><div class="tabs" role="tablist" id="ptabs"><button role="tab" aria-selected="true">Overview</button><button role="tab" aria-selected="false">Listings</button><button role="tab" aria-selected="false">Leads</button><button role="tab" aria-selected="false">Sales</button></div><select class="fi" style="margin-left:auto" id="pr" aria-label="Period"><option>Last 3 Months</option><option>Last 30 Days</option><option>Last 12 Months</option></select></div>'+
 '<div class="g2"><div style="display:grid;gap:18px;align-content:start"><div class="hl"><b>+40%</b><p>Increase in Leads</p></div><div class="hl bl"><b>+28%</b><p>More Sales</p></div><section class="card"><h3>Top Performing Cars</h3><ul class="rank"><li><img src="assets/car-nissan.webp" alt=""><b>Nissan Sunny 2024</b><span>320 views</span></li><li><img src="assets/car-corolla.webp" alt=""><b>Toyota Corolla 2024</b><span>278 views</span></li><li><img src="assets/car-bmw.webp" alt=""><b>BMW 320i 2023</b><span>240 views</span></li></ul></section></div>'+
 '<section class="card"><div class="head"><h3>Growth Trend</h3></div><div class="legend"><span><i style="background:#1e9bff"></i>Leads</span><span><i style="background:#ff2a4a"></i>Sales</span></div><div class="chart" id="gt"></div></section></div>'};
P.performance.after=function(){
 var D={ 'Last 3 Months':{lb:['Jul','Aug','Sep'],l:[500,780,1000,880,800,620,820,1000,1100,1300,1380,1500],s:[300,420,520,540,420,330,430,520,640,780,900,1010]},
  'Last 30 Days':{lb:['W1','W2','W3','W4'],l:[300,420,380,560,640,720,700,820,900,1010,1100,1180],s:[120,180,170,260,300,360,340,420,480,540,610,680]},
  'Last 12 Months':{lb:['Dec','Mar','Jun','Sep'],l:[400,520,610,700,780,860,990,1080,1180,1290,1400,1500],s:[200,260,330,390,430,500,580,640,720,820,910,1010]}};
 function draw(){var d=D[$('#pr').value];lineChart($('#gt'),{label:'Growth trend',labels:d.lb,ymax:1500,yt:[0,500,1000,1500],fmt:function(v){return v>=1000?(v/1000).toFixed(v%1000?1:0)+'K':String(Math.round(v))},series:[{name:'Leads',color:'#1e9bff',data:d.l},{name:'Sales',color:'#ff2a4a',data:d.s}]})}
 $('#pr').addEventListener('change',draw);draw();
 $$('#ptabs button').forEach(function(b){b.addEventListener('click',function(){$$('#ptabs button').forEach(function(x){x.setAttribute('aria-selected','false')});b.setAttribute('aria-selected','true')})});
};

var THREADS=[
 {n:'Ahmed Khaled',m:'Is the car still available?',t:'2m ago',u:2,av:'ahmed',chat:[['in','Is the car still available?','2:36 PM'],['out','Yes, it’s available. Would you like to book a test drive?','2:38 PM']]},
 {n:'Sara Mohamed',m:'Can you share more photos?',t:'5m ago',av:'sara',chat:[['in','Can you share more photos?','2:33 PM']]},
 {n:'Omar Hassan',m:'What’s the final price?',t:'10m ago',av:'omar',chat:[['in','What’s the final price?','2:28 PM']]},
 {n:'Layla Ahmed',m:'I’m interested. Can I visit?',t:'12m ago',av:null,chat:[['in','I’m interested. Can I visit?','2:26 PM']]}];
P.leads=function(){return '<div class="ph"><h1>Leads &amp; Messages — Never Miss a Buyer</h1><p>Reply to buyers in real time.</p></div><div class="bar"><div class="tabs" role="tablist" id="ltabs"><button role="tab" aria-selected="true">All (124)</button><button role="tab" aria-selected="false">New (42)</button><button role="tab" aria-selected="false">Interested (50)</button><button role="tab" aria-selected="false">Converted (32)</button></div></div>'+
 '<div class="msgs"><section class="card" aria-label="Conversations"><ul class="thread" id="thr"></ul></section><section class="card chat" aria-label="Conversation"><div class="chat-h" id="ch"></div><div class="log" id="log" aria-live="polite"></div><form class="compose" id="cf"><input id="ci" placeholder="Type a message..." aria-label="Type a message" autocomplete="off"><button aria-label="Send">'+ic('send')+'</button></form></section></div>'};
function av(t,cls){return t.av?'<img class="av" src="assets/av-'+t.av+'.webp" alt="">':'<span class="av">'+t.n[0]+'</span>'}
P.leads.after=function(){
 var cur=0;
 function list(){$('#thr').innerHTML=THREADS.map(function(t,i){return '<li><button data-i="'+i+'" '+(i===cur?'aria-current="true"':'')+'>'+av(t)+'<div class="tx"><b>'+t.n+'</b><span>'+t.m+'</span></div><div style="text-align:right"><time>'+t.t+'</time>'+(t.u?'<div class="un">'+t.u+'</div>':'')+'</div></button></li>'}).join('');
  $$('#thr button').forEach(function(b){b.addEventListener('click',function(){cur=+b.dataset.i;THREADS[cur].u=0;list();chat()})})}
 function chat(){var t=THREADS[cur];$('#ch').innerHTML=av(t)+'<div><b>'+t.n+'</b><small>● Online</small></div><div class="ac"><button aria-label="Call">'+ic('phone')+'</button><button aria-label="Video call">'+ic('video')+'</button></div>';
  $$('#ch .ac button').forEach(function(b){b.addEventListener('click',demo('Calling '+t.n+' (demo)'))});
  $('#log').innerHTML=t.chat.map(function(m){return '<div class="m '+(m[0]==='out'?'me':'')+'">'+m[1]+'<small>'+m[2]+'</small></div>'}).join('');$('#log').scrollTop=1e5}
 $('#cf').addEventListener('submit',function(e){e.preventDefault();var v=$('#ci').value.trim();if(!v)return;var t=THREADS[cur];t.chat.push(['out',v,new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})]);t.m='You: '+v;$('#ci').value='';list();chat()});
 $$('#ltabs button').forEach(function(b){b.addEventListener('click',function(){$$('#ltabs button').forEach(function(x){x.setAttribute('aria-selected','false')});b.setAttribute('aria-selected','true')})});
 list();chat();
};

P.financing=function(){return '<div class="ph"><h1>Financing — Grow with Flexible Options</h1><p>Simplify the finance process for your buyers.</p></div>'+
 '<div class="g3"><div style="display:grid;gap:18px;align-content:start"><div class="card kpi g"><div class="tile g">'+ic('check')+'</div><div><small style="margin:0">Financing Requests</small><div class="n"><b>124</b><span>+32%</span></div></div></div><div class="card kpi p"><div class="tile p">'+ic('hand')+'</div><div><small style="margin:0">Approved Deals</small><div class="n"><b>98</b><span>+28%</span></div></div></div></div>'+
 '<section class="card"><div class="head"><h3>Recent Requests</h3><a class="link" href="#/financing" id="va">View All '+ic('arrow')+'</a></div><ul class="reqs">'+
 [['ahmed','Ahmed Khaled','Approved','ap','EGP 45,000/m'],['sara','Sara Mohamed','Pending','pe','EGP 38,000/m'],['omar','Omar Hassan','Approved','ap','EGP 52,000/m']].map(function(r){return '<li><img class="av" src="assets/av-'+r[0]+'.webp" alt=""><b>'+r[1]+'</b><span class="chip '+r[3]+'">'+r[2]+'</span><em>'+r[4]+'</em></li>'}).join('')+'</ul></section>'+
 '<section class="banks"><h4>Partner Banks</h4><div class="bk a">Partner Bank A</div><div class="bk b">Partner Bank B</div><div class="bk c">Partner Bank C</div><button id="mp">Manage Partners →</button></section></div>'};
P.financing.after=function(){$('#mp').addEventListener('click',demo('Manage finance partners (demo)'))};

P.analytics=function(){return '<div class="ph"><h1>Analytics — Deep Insights for Smarter Decisions</h1><p>Understand what sells and where demand is.</p></div><div class="bar"><div class="tabs" role="tablist" id="atabs"><button role="tab" aria-selected="true">Sales Analytics</button><button role="tab" aria-selected="false">Audience</button><button role="tab" aria-selected="false">Inventory</button></div><select class="fi" style="margin-left:auto" aria-label="Period"><option>Last 6 Months</option><option>Last 3 Months</option></select></div>'+
 '<div class="g2"><section class="card" style="text-align:center"><div class="donut donut-lg">'+donut([{v:70,c:'#2f8cff'},{v:30,c:'#19d38a'}],78,18,100)+'<div><b>70%</b><small>Sales via<br>Online</small></div></div></section>'+
 '<section class="card"><h3>Top Models</h3>'+[['Nissan Sunny',40,''],['Toyota Corolla',32,''],['Hyundai Elantra',28,'pu']].map(function(m){return '<div class="bar-row"><span>'+m[0]+'</span><div class="tr"><i class="'+m[2]+'" style="width:'+m[1]*2+'%"></i></div><b>'+m[1]+'%</b></div>'}).join('')+'</section></div>'+
 '<div class="g2" style="grid-template-columns:1.1fr 1fr"><section class="card"><h3>Customer Location</h3><p style="color:var(--mut)">Cairo 46% · Giza 24% · Alexandria 14% · Other 16%</p><div class="bar-row"><span>Cairo</span><div class="tr"><i style="width:92%"></i></div><b>46%</b></div><div class="bar-row"><span>Giza</span><div class="tr"><i style="width:48%"></i></div><b>24%</b></div><div class="bar-row"><span>Alexandria</span><div class="tr"><i style="width:28%"></i></div><b>14%</b></div></section>'+
 '<section class="card c-purple"><div class="head"><h3>'+ic('bulb')+'AI Insight</h3></div><p style="font-size:17px">Demand for Nissan Sunny is 40% higher this month.</p><div style="margin-top:16px"><a class="btn-blue" href="#/insights" style="max-width:220px">View Details '+ic('arrow')+'</a></div></section></div>'};
P.analytics.after=function(){$$('#atabs button').forEach(function(b){b.addEventListener('click',function(){$$('#atabs button').forEach(function(x){x.setAttribute('aria-selected','false')});b.setAttribute('aria-selected','true')})})};

P.insights=function(){return '<div class="ph"><h1>AI Insights — Smart Recommendations</h1><p>Actions suggested from your demand and inventory data.</p></div><section class="card c-purple" style="margin-top:22px;position:relative;z-index:3"><div class="ai-big"><div class="ai-chip" aria-hidden="true">AI</div><div><h3 style="margin-bottom:10px">Recommended Actions:</h3><ul class="ai" style="list-style:none;padding:0;display:grid;gap:12px;margin:0 0 18px"><li style="display:flex;gap:12px;align-items:center"><span class="ck">'+ic('check')+'</span>Increase ads for Toyota Corolla (<b style="color:#27e58f">+45%</b> potential)</li><li style="display:flex;gap:12px;align-items:center"><span class="ck">'+ic('check')+'</span>Offer special financing on BMW 320i.</li><li style="display:flex;gap:12px;align-items:center"><span class="ck">'+ic('check')+'</span>Target customers in Giza and 6th of October.</li></ul><button class="btn-red" id="as">Apply Suggestions '+ic('arrow')+'</button></div></div></section>'};
P.insights.after=function(){$('#as').addEventListener('click',demo('Suggestions applied to your campaigns (demo)'))};

P.premium=function(){return '<div class="ph"><h1>Premium Dealer — Unlock More Growth</h1><p>Get more visibility and more leads.</p></div><div class="prem">'+[['star','Highlighted Listings','Stand out in search results'],['gem','Advanced Analytics','Deeper demand insights'],['head','Priority Support','Dedicated account manager'],['gift','Exclusive Offers','Partner perks &amp; finance deals']].map(function(p){return '<div class="card">'+ic(p[0])+'<b>'+p[1]+'</b><p>'+p[2]+'</p></div>'}).join('')+'</div><div style="text-align:center;margin-top:30px;position:relative;z-index:3"><button class="gold" id="up">'+ic('crown')+'Upgrade Now</button></div>'};
P.premium.after=function(){$('#up').addEventListener('click',demo('Upgrade flow starts here (demo)'))};

P.settings=function(){return '<div class="ph"><h1>Settings</h1><p>Showroom profile and notifications.</p></div><div class="card set" style="margin-top:22px;position:relative;z-index:3"><label>Showroom name<input class="fi" value="Auto World Motors"></label><label>Phone<input class="fi" value="01012345678" inputmode="tel"></label><label>City<select class="fi"><option>Cairo</option><option>Giza</option><option>Alexandria</option></select></label><div class="sw"><span>Daily alerts (ad renewal, bundle usage)</span><input type="checkbox" checked aria-label="Daily alerts"></div><div class="sw"><span>New lead notifications</span><input type="checkbox" checked aria-label="New lead notifications"></div><button class="btn-add" id="sv" style="width:fit-content">Save changes</button></div>'};
P.settings.after=function(){$('#sv').addEventListener('click',demo('Settings saved (demo)'))};
P.support=function(){return '<div class="ph"><h1>Support</h1><p>We’re here to help your showroom grow.</p></div><div class="card set" style="margin-top:22px;position:relative;z-index:3"><label>Topic<select class="fi"><option>Ads &amp; inventory</option><option>Financing</option><option>Billing</option></select></label><label>Message<input class="fi" placeholder="How can we help?"></label><button class="btn-add" id="ss" style="width:fit-content">Send request</button></div>'};
P.support.after=function(){$('#ss').addEventListener('click',demo('Request sent (demo)'))};

/* ---------- router ---------- */
function route(){var r=(location.hash.replace('#/','')||'dashboard').split('?')[0];if(!P[r])r='dashboard';
 view.innerHTML=P[r]();app.classList.toggle('dash',r==='dashboard');
 $$('.side nav a').forEach(function(a){var on=a.dataset.r===r;a.classList.toggle('on',on);on?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current')});
 P[r].after&&P[r].after();document.title=(r==='dashboard'?'Dealer Dashboard':r[0].toUpperCase()+r.slice(1))+' — Dubizzle × Hatla2ee';
 closeNav();window.scrollTo(0,0)}
function closeNav(){$('#side').classList.remove('open');$('#scrim').classList.remove('on')}
$('#burger').addEventListener('click',function(){$('#side').classList.add('open');$('#scrim').classList.add('on')});$('#scrim').addEventListener('click',closeNav);
$('#bell').addEventListener('click',demo('3 new notifications: 2 new leads, 1 ad expiring soon (demo)'));
$('#me').addEventListener('click',demo('Account menu (demo)'));
$('#gsearch').addEventListener('keydown',function(e){if(e.key==='Enter'){location.hash='#/inventory';setTimeout(function(){var s=$('#isearch');if(s){s.value=$('#gsearch').value;s.dispatchEvent(new Event('input'))}},40)}});
document.addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#gsearch').focus()}});
window.addEventListener('hashchange',route);route();
})();
