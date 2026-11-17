/* Video library page: search and category filter over the demo cards made by exdemo.js */
(()=>{
const $=s=>document.querySelector(s),C=[["All",null],["Legs and glutes",/squat|lunge|bridge|step-up|leg press|hamstring|deadlift/i],["Upper body",/push-up|dips|chest|raise|press|row|pulldown|fly|superman/i],["Core",/plank|dead bug|bird dog|mountain/i],["Posture",/wall angel|chin/i],["Warm-up and cardio",/warm|cool|brisk/i]];
const cat=n=>{const i=C.findIndex((c,j)=>j&&c[1].test(n));return i<0?0:i};
let ci=0;const cards=[...document.querySelectorAll("#demos .demo")];
$("#cats").innerHTML=C.map((c,i)=>`<button class="chip" type="button" data-i="${i}" aria-pressed="${i==0}">${c[0]}</button>`).join("");
function f(){const t=$("#q").value.trim().toLowerCase();let n=0;
  cards.forEach(b=>{const nm=b.dataset.n,ok=(!ci||cat(nm)==ci)&&nm.toLowerCase().includes(t);b.style.display=ok?"":"none";n+=ok});
  $("#cnt").textContent=n?n+" exercise"+(n>1?"s":""):"No exercise found. Try another word.";
  document.querySelectorAll("#cats .chip").forEach(b=>b.setAttribute("aria-pressed",+b.dataset.i==ci))}
$("#q").oninput=f;$("#cats").onclick=e=>{const b=e.target.closest(".chip");if(b){ci=+b.dataset.i;f()}};f();
})();
