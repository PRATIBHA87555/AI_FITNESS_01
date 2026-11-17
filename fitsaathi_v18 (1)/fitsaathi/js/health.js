/* FitSaathi Health Guard: checks symptoms and your profile, then suggests the right DOCTOR and TRAINER. Not a diagnosis. Runs in the browser before any AI call. */
(()=>{
const M=q=>"https://www.google.com/maps/search/"+encodeURIComponent(q+" near me");
const DOC={ortho:"Orthopedic doctor",physio:"Physiotherapist",card:"Cardiologist",gp:"General physician",diab:"Diabetologist",thy:"Endocrinologist",pulm:"Chest specialist",neuro:"Neurologist",gyn:"Gynecologist",diet:"Clinical dietitian",psy:"Psychiatrist"};
const N={urgent:2,consult:1};
const R=[
[/chest (pain|tight|pressure)|seene (me|mein)|dil (me|mein) dard|pain.*(left arm|jaw)|dard.*(baanh|jabda)/i,"urgent",["card"],1],
[/can'?t breathe|cannot breathe|struggling to breathe|saans (nahi|nhi|phool)|breathless/i,"urgent",["card","pulm"],1],
[/faint|passed out|behosh|unconscious|slurred|face droop|munh tedha|lakwa|sudden weakness|vomit\w* blood|coughing blood|khoon ki ulti|heavy bleeding/i,"urgent",["gp","neuro"],1],
[/dizz|chakkar|palpitat|dhadkan|heart racing|ghabrahat|lightheaded/i,"urgent",["gp","card"]],
[/numb|tingling|sunn|jhanjhan|pins and needles/i,"urgent",["neuro","ortho"]],
[/swell|swollen|sujan|can'?t (walk|put weight)|chal nahi/i,"urgent",["ortho","physio"]],
[/fever|bukhar|sharp pain|tez dard|severe pain|bahut dard|hurts a lot|night pain|pain.*(since|for).*(week|days|hafte|din)/i,"urgent",["gp","ortho"]],
[/(blood )?sugar.*(high|low|\d{3})|hypo|shaky|bahut pyaas|frequent urination/i,"urgent",["diab"]],
[/(bp|blood pressure).*(high|\d{3})|high (bp|blood pressure)|severe headache|sir dard (tez|bahut)/i,"urgent",["gp","card"]],
[/knee|ghutn|back pain|kamar|spine|disc|shoulder|kandha|neck pain|gardan/i,"consult",["ortho","physio"]],
[/thyroid/i,"consult",["thy"]],[/asthma|dama/i,"consult",["pulm"]],[/pregnan|garbh|surgery|operation/i,"consult",["gyn","gp"]],
[/diabet|madhumeh|blood sugar/i,"consult",["diab","diet"]],[/\bbp\b|blood pressure|hypertension/i,"consult",["gp","card"]],[/obes|overweight|underweight|mota|patla/i,"consult",["gp","diet"]]];
const MIND=/suicid|end my life|kill myself|jeena nahi|marna chahta|marna chahti|self.?harm/i;
const CM={knee:["ortho","physio"],back:["ortho","physio"],shoulder:["ortho","physio"],bp:["gp","card"],diabetes:["diab","diet"],thyroid:["thy"],asthma:["pulm"],dr:["gp","card"]};
function triage(q){
  if(MIND.test(q))return{lv:"urgent",mind:1,doc:["psy"]};
  let lv=0,now=0,doc=[];for(const[r,l,d,n]of R)if(r.test(q)){lv=Math.max(lv,N[l]);doc.push(...d);if(n)now=1}
  if(!lv)return null;const t={lv:Object.keys(N).find(k=>N[k]==lv),doc:[...new Set(doc)],now};
  if(lv>1)try{localStorage.setItem("fs_health",JSON.stringify({lv:t.lv,doc:t.doc,t:Date.now()}))}catch(e){}
  return t}
function profile(A,cat){
  const c=(A&&A.cond||[]).filter(x=>CM[x]);let doc=c.flatMap(x=>CM[x]);
  if(cat=="Underweight"||cat=="Obese")doc.push("gp","diet");if(+(A&&A.age)>=45)doc.push("gp");
  return doc.length?{lv:"consult",doc:[...new Set(doc)]}:null}
function flag(){try{const f=JSON.parse(localStorage.getItem("fs_health")||"null");return f&&Date.now()-f.t<6048e5?{level:f.lv,doctors:f.doc.map(k=>DOC[k])}:null}catch(e){return null}}
const T={
 en:{now:["See a doctor right away","Stop exercising and get checked by a doctor today. Please do not wait."],
  mind:["You are not alone","Please talk to a trusted person and to a doctor or counsellor today. Tele-MANAS 14416 is a free 24x7 helpline."],
  urgent:["See a doctor soon","Pause workouts until a doctor has checked you, ideally within 1 to 2 days. This is not a diagnosis.","Trainer: after the doctor says OK, start with FitSaathi's AI trainer (light plan). For an injury, work with a physiotherapist."],
  consult:["Check with a doctor first","A doctor can tell you which exercises are safe for you. Until then, keep sessions light and low-impact.","Trainer: use FitSaathi's AI trainer for a safe plan. For injury, BP, diabetes or heart issues, a physiotherapist or a certified trainer experienced with medical conditions is best, once your doctor agrees."]},
 hi:{now:["Abhi doctor ko dikhayein","Exercise rok dein aur aaj hi doctor se check karayein. Intezaar na karein."],
  mind:["Aap akele nahi hain","Kripya kisi bharose ke insaan se aur aaj hi doctor ya counsellor se baat karein. Tele-MANAS 14416 free 24x7 helpline hai."],
  urgent:["Jaldi doctor ko dikhayein","Doctor ke check karne tak workout rok dein, behtar hai 1 se 2 din mein. Ye diagnosis nahi hai.","Trainer: doctor ke OK ke baad FitSaathi ke AI trainer ka halka plan shuru karein. Chot ho to physiotherapist ke saath kaam karein."],
  consult:["Pehle doctor se poochhein","Doctor batayenge kaun si exercise aapke liye safe hai. Tab tak halke, low-impact session karein.","Trainer: safe plan ke liye FitSaathi ka AI trainer use karein. Chot, BP, sugar ya dil ki dikkat mein physiotherapist ya medical conditions jaanne wale certified trainer behtar hain, doctor ki ijazat ke baad."]}};
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>"&#"+c.charCodeAt(0)+";");
const TY=k=>({ortho:"rehab",physio:"rehab",diet:"weight"}[k]||(["card","gp","diab","thy","pulm","neuro","gyn"].includes(k)?"medical":"general"));
function ec(e,role){
 if(e.demo)return`<div class="ex2"><b>${esc(e.n)}</b> <i class="dtag">Demo only</i><small>${esc(role)}${e.lang?" · "+esc(e.lang):""}${e.fee?" · "+esc(e.fee):""}</small><div class="hbs"><span class="hb off">📞 +91 98XXX XXXXX</span><span class="hb off">💬 WhatsApp</span><span class="hb off">🎥 Video call</span></div><small>Demo listing: number hidden, buttons are off. Real doctors and trainers will be added in js/experts.js.</small></div>`;
 const d=String(e.phone||"").replace(/\D/g,""),p=d.length==10?"91"+d:d,u=/^https:\/\//.test(e.video||"")?e.video:"";
 return`<div class="ex2"><b>${esc(e.n)}</b>${e.demo?' <i class="dtag">Demo listing</i>':""}<small>${esc(role)}${e.lang?" · "+esc(e.lang):""}${e.fee?" · "+esc(e.fee):""}${e.time?" · "+esc(e.time):""}</small><div class="hbs">${p?`<a class="hb" href="tel:+${p}">📞 +${p}</a><a class="hb" target="_blank" rel="noopener" href="https://wa.me/${p}?text=${encodeURIComponent("Hi, I found you on FitSaathi. I would like an online consultation.")}">💬 WhatsApp</a>`:""}${u?`<a class="hb" target="_blank" rel="noopener" href="${esc(u)}">🎥 Video call</a>`:""}${!p&&!u?"<small>Add phone and video link in js/experts.js</small>":""}</div></div>`}
function exp(t){const X=window.FS_EXPERTS||{},dk=t.doc,tk=new Set([...dk.map(TY),"general"]),
 D=(X.doctors||[]).filter(d=>d.sp.some(s=>dk.includes(s))).slice(0,2),Tr=(X.trainers||[]).filter(r=>r.sp.some(s=>tk.has(s))).slice(0,2);
 return`<h4>Online doctors</h4>${D.map(d=>ec(d,d.sp.map(s=>DOC[s]).filter(Boolean).slice(0,2).join(", "))).join("")||"<small>No listed doctor yet.</small>"}<div class="hbs"><a class="hb" target="_blank" rel="noopener" href="https://esanjeevani.mohfw.gov.in">Free govt online doctor (eSanjeevani)</a></div><h4>Online trainers</h4>${Tr.map(r=>ec(r,"Online trainer")).join("")||"<small>No listed trainer yet.</small>"}`}
function card(t,hi){
  const x=T[hi?"hi":"en"][t.mind?"mind":t.now?"now":t.lv],B=[];
  t.doc.slice(0,3).forEach(k=>B.push(`<a class="hb" target="_blank" rel="noopener" href="${M(DOC[k])}">Find ${DOC[k]} near me</a>`));
  if(!t.now&&!t.mind)B.push(`<a class="hb" target="_blank" rel="noopener" href="${M(t.doc.includes("physio")?"physiotherapist":"certified fitness trainer")}">Find a trainer near me</a>`,`<button type="button" class="hb" data-ask="Give me a safe, light workout for today for my condition">AI trainer: safe plan</button>`);
  return`<div class="hcard ${t.lv}"><b>${x[0]}</b><p>${x[1]}</p>${x[2]?`<p>${x[2]}</p>`:""}${exp(t)}<div class="hbs">${B.join("")}</div><div class="hbs"><a class="hb" href="experts.html">See all doctors and trainers</a></div><small class="dis">Experts are independent professionals. FitSaathi gives guidance, not medical treatment.</small></div>`}
const cardFor=(A,cat)=>{const t=profile(A,cat);return t?`<div class="hwrap"><h3>Doctor and trainer advice</h3>${card(t,0)}</div>`:""};
window.FSHealth={triage,profile,card,cardFor,flag,ec,DOC};
})();
