/* Doctors and Trainers page: filters FS_EXPERTS (js/experts.js) by concern and shows cards from health.js */
(()=>{
const $=s=>document.querySelector(s),H=window.FSHealth,M=q=>"https://www.google.com/maps/search/"+encodeURIComponent(q+" near me");
let A={},P=null;try{A=JSON.parse(localStorage.getItem("fs")||"{}");P=JSON.parse(localStorage.getItem("fs_plan")||"null")}catch(e){}
const G=[["All",null,null],["Knee, back or shoulder pain",["ortho","physio"],["rehab"]],["Heart or BP",["card","gp"],["medical"]],["Diabetes or thyroid",["diab","thy","diet"],["medical"]],["Breathing or asthma",["pulm"],["medical"]],["Weight or diet",["diet","gp"],["weight"]],["Pregnancy or surgery",["gyn","gp"],["medical","general"]],["General fitness",["gp"],["general"]]];
const CL={knee:"knee pain",back:"back pain",shoulder:"shoulder injury",bp:"high BP",diabetes:"diabetes",thyroid:"thyroid",asthma:"asthma",dr:"heart condition, pregnancy or surgery"};
let tab="d",gi=0;
const pr=H.profile(A,P&&P.ws&&P.ws.cat),cs=(A.cond||[]).filter(c=>CL[c]);
if(pr){const i=G.findIndex((g,j)=>j&&g[1]&&g[1].some(s=>pr.doc.includes(s)));if(i>0)gi=i}
$("#forYou").innerHTML=pr?`<b>Suggested for you</b><p>${cs.length?"Based on your profile ("+cs.map(c=>CL[c]).join(", ")+"), ":"Based on your profile, "}we picked the matching filter below. Please check with a doctor before intense exercise. This is not a diagnosis.</p>`:`<b>Choose your concern</b><p>Build your plan first for personal suggestions, or pick a concern below. This is not a diagnosis.</p>`;
$("#gr").innerHTML=G.map((g,i)=>`<button class="chip" type="button" data-i="${i}" aria-pressed="${i==gi}">${g[0]}</button>`).join("");
function draw(){
  const g=G[gi],X=window.FS_EXPERTS||{},d=tab=="d";
  const L=d?(X.doctors||[]).filter(e=>!g[1]||e.sp.some(s=>g[1].includes(s))):(X.trainers||[]).filter(e=>!g[2]||e.sp.some(s=>g[2].includes(s)||s=="general"));
  $("#list").innerHTML=L.map(e=>H.ec(e,d?e.sp.map(s=>H.DOC[s]).filter(Boolean).slice(0,2).join(", "):"Online trainer")).join("")||"<p>No listed experts for this concern yet.</p>";
  $("#near").innerHTML=d?(g[1]||["gp"]).slice(0,3).map(k=>`<a class="hb" target="_blank" rel="noopener" href="${M(H.DOC[k])}">Find ${H.DOC[k]} near me</a>`).join(""):`<a class="hb" target="_blank" rel="noopener" href="${M(g[2]&&g[2][0]=="rehab"?"physiotherapist":"certified fitness trainer")}">Find a trainer near me</a>`;
  $("#tD").setAttribute("aria-pressed",d);$("#tT").setAttribute("aria-pressed",!d);
  document.querySelectorAll("#gr .chip").forEach(b=>b.setAttribute("aria-pressed",+b.dataset.i==gi));
}
$("#tD").onclick=()=>{tab="d";draw()};$("#tT").onclick=()=>{tab="t";draw()};
$("#gr").onclick=e=>{const b=e.target.closest(".chip");if(b){gi=+b.dataset.i;draw()}};
$("#askAi").onclick=()=>$("#aiB").click();
draw();
})();
