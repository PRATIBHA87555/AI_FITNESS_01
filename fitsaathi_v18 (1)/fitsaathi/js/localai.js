/* FitSaathi free AI: runs a small open LLM inside the user's browser (WebLLM + WebGPU).
   No API key, no server, no cost. Model downloads once (~1 GB) and is cached by the browser. */
(()=>{
const MODEL="Qwen2.5-1.5B-Instruct-q4f16_1-MLC"; // alternatives: "Llama-3.2-1B-Instruct-q4f16_1-MLC", "Qwen2.5-3B-Instruct-q4f16_1-MLC"
const SYS=`You are FitSaathi's AI fitness coach for people in India. Reply in the language the user writes (English, Hinglish in Roman script, or Hindi). Be warm, practical and short (under 100 words). Use Indian foods and home-friendly exercises. Use the user data to personalise answers.
Safety: you are not a doctor. Never diagnose, never give medicine or supplement doses, never suggest extreme diets (under 1200 kcal/day) or training through sharp pain. For chest pain, fainting, breathlessness, severe pain, pregnancy, heart condition or recent surgery, tell them to stop exercising and see a doctor. Stay on fitness, food, posture and recovery; politely decline other topics.`;
let engine=null,loading=null;
const supported=()=>!!navigator.gpu;
const wanted=()=>{try{return localStorage.getItem("fs_localai")==="1"&&supported()}catch(e){return false}};
function load(onP){
  if(engine)return Promise.resolve(engine);
  if(loading)return loading;
  loading=(async()=>{
    const w=await import("https://esm.run/@mlc-ai/web-llm");
    engine=await w.CreateMLCEngine(MODEL,{initProgressCallback:r=>onP&&onP(r.progress||0)});
    try{localStorage.setItem("fs_localai","1")}catch(e){}
    return engine;
  })();
  loading.catch(()=>{loading=null});
  return loading;
}
async function chat(q,hist,profile){
  const p=Object.assign({},profile);if(p.plan)p.plan={kcal:p.plan.kcal,protein:p.plan.protein}; // keep prompt small
  const sys=SYS+"\nUser data: "+JSON.stringify(p).slice(0,1200);
  const out=await engine.chat.completions.create({messages:[{role:"system",content:sys},...hist,{role:"user",content:q}],max_tokens:300,temperature:0.6});
  return (out.choices[0].message.content||"").trim();
}
window.FSLocalAI={supported,wanted,ready:()=>!!engine,load,chat};
})();
