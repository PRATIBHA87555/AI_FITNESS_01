/* ONLINE DOCTORS AND TRAINERS DIRECTORY.
   DEMO entries (demo:1) show a masked number and have all buttons switched off, so nobody is ever called.
   Replace the DEMO entries with REAL people who have agreed to be listed (their phone, WhatsApp and video link).
   - phone: 10-digit Indian number (or with country code). Shows Call and WhatsApp buttons.
   - video: a https link to their Google Meet / Zoom / WhatsApp video room. Shows a Video call button.
   - Doctor "sp" keys: ortho, physio, card, gp, diab, thy, pulm, neuro, gyn, diet, psy
   - Trainer "sp" keys: rehab (injury), medical (BP, sugar, thyroid, heart), weight, general
   Check a doctor's NMC / State Medical Council registration and a trainer's certificate before listing. Remove demo:1 for real entries. */
window.FS_EXPERTS={
doctors:[
{n:"Dr. Sample (Orthopedic)",sp:["ortho","physio"],lang:"Hindi, English",fee:"add fee",time:"add timings",phone:"",video:"",demo:1},
{n:"Dr. Sample (General Physician)",sp:["gp","card","diab","thy","pulm","neuro","gyn","psy"],lang:"Hindi, English",fee:"add fee",time:"add timings",phone:"",video:"",demo:1},
{n:"Sample Dietitian",sp:["diet"],lang:"Hindi, English",fee:"add fee",time:"add timings",phone:"",video:"",demo:1}],
trainers:[
{n:"Sample Online Trainer (Injury and rehab)",sp:["rehab"],lang:"Hindi, English",fee:"add fee",time:"add timings",phone:"",video:"",demo:1},
{n:"Sample Online Trainer (General fitness)",sp:["general","weight","medical"],lang:"Hindi, English",fee:"add fee",time:"add timings",phone:"",video:"",demo:1}]};
