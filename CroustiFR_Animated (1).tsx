
import { useState, useEffect, useRef } from "react";
import { useFile } from "@dust/react-hooks";

/* ─────────────────────────────── PALETTE ─────────────────────────────────── */
const C = {
  noir:"#09070A", rose:"#FF4FA3", cerise:"#E51D4E",
  jaune:"#FFD84D", bleu:"#1E7BFF", violet:"#8B3DFF", creme:"#FFF1D6",
};
const ink = (bg:string) => (bg===C.jaune||bg===C.creme) ? C.noir : C.creme;

/* ─────────────────────────── GLOBAL KEYFRAMES ───────────────────────────── */
const KEYFRAMES = `
  @keyframes ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes badgeSpin {
    0%,100% { transform: rotate(-12deg) scale(1); }
    25%      { transform: rotate(-8deg)  scale(1.06); }
    75%      { transform: rotate(-16deg) scale(0.96); }
  }
  @keyframes badgeSpin2 {
    0%,100% { transform: rotate(8deg) scale(1); }
    50%      { transform: rotate(12deg) scale(1.05); }
  }
  @keyframes pulseGlow {
    0%,100% { box-shadow: 4px 4px 0 #000, 0 0 0 0 rgba(255,79,163,0); }
    50%      { box-shadow: 4px 4px 0 #000, 0 0 24px 6px rgba(255,79,163,0.5); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(40px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes popIn {
    0%   { opacity:0; transform:scale(0.75) rotate(-2deg); }
    70%  { opacity:1; transform:scale(1.06) rotate(0.5deg); }
    100% { opacity:1; transform:scale(1) rotate(0deg); }
  }
  @keyframes slideLeft {
    from { opacity:0; transform:translateX(-60px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes slideRight {
    from { opacity:0; transform:translateX(60px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes wordIn {
    from { opacity:0; transform:translateY(60px) skewY(4deg); }
    to   { opacity:1; transform:translateY(0) skewY(0deg); }
  }
  @keyframes floatBob {
    0%,100% { transform:translateY(0) rotate(-0.5deg); }
    50%      { transform:translateY(-8px) rotate(0.5deg); }
  }
  @keyframes cardFloat {
    0%,100% { transform:translateY(0); }
    50%      { transform:translateY(-5px); }
  }
  @keyframes shimmer {
    0%   { background-position:-200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes borderDance {
    0%,100% { border-color: var(--seg-color); }
    50%      { border-color: transparent; }
  }
  .reveal-up { opacity:0; transform:translateY(50px); transition:opacity 0.65s cubic-bezier(.22,1,.36,1), transform 0.65s cubic-bezier(.22,1,.36,1); }
  .reveal-up.visible { opacity:1; transform:translateY(0); }
  .reveal-left { opacity:0; transform:translateX(-55px); transition:opacity 0.6s cubic-bezier(.22,1,.36,1), transform 0.6s cubic-bezier(.22,1,.36,1); }
  .reveal-left.visible { opacity:1; transform:translateX(0); }
  .reveal-right { opacity:0; transform:translateX(55px); transition:opacity 0.6s cubic-bezier(.22,1,.36,1), transform 0.6s cubic-bezier(.22,1,.36,1); }
  .reveal-right.visible { opacity:1; transform:translateX(0); }
  .reveal-pop { opacity:0; transform:scale(0.8); transition:opacity 0.5s cubic-bezier(.34,1.56,.64,1), transform 0.5s cubic-bezier(.34,1.56,.64,1); }
  .reveal-pop.visible { opacity:1; transform:scale(1); }
`;

/* ─────────────────────── INTERSECTION OBSERVER HOOK ────────────────────── */
function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), delay);
          obs.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

/* ─────────────────────── DONNÉES ─────────────────────────────────────────── */
const SEGMENTS = [
  { emoji:"🍭", label:"La Pop\nCurieuse",      age:"18 – 30 ans",         bg:C.rose,
    hook:"Tu joues déjà.\nOn veut\nta légèreté.",
    traits:["À l'aise en lingerie","Mise en scène instinctive","Look soigné naturellement","Aime jouer avec la caméra"],
    formats:["Drôle d'Envie","Le Menu Crousti","Crousti Talons"],
    pitch:"Tu n'as pas besoin qu'on t'explique comment poser — tu le fais déjà. Shooting en lingerie colorée, mises en scène pop, jeu avec le regard : c'est toi le cœur de Crousti FR. On cherche ta légèreté, pas ta perfection.",
    not:"Pas pour les profils dark, dramatiques ou qui posent en mode catalogue sans vie." },
  { emoji:"💋", label:"L'Attitude\nAssumée",   age:"25 ans et +",         bg:C.violet,
    hook:"Ton corps.\nTon territoire.\nTu sais.",
    traits:["Porte des talons naturellement","Pose sans directive","Regard caméra ancré","Corps habité pas subi"],
    formats:["Crousti Talons","Clac Club","After Crousti"],
    pitch:"On cherche cette façon d'être dans le cadre sans l'expliquer — le talon posé comme une signature, le regard qui ne demande rien. À 35, 40 ou 45 ans cette présence est souvent plus forte qu'à 20. Pas malgré l'âge. Grâce à lui.",
    not:"Pas pour les postures 'domination froide' ou glacée. Ce profil joue l'assurance incarnée, pas la provocation calculée." },
  { emoji:"🌺", label:"La Complicité\nOuverte", age:"18+ · tous âges",    bg:C.bleu,
    hook:"Ce que tu es.\nPas ce que\ntu crois devoir être.",
    traits:["Naturelle sans effort","Morphologie assumée","Chaleur qui passe à l'image","Fait vivre le cadre"],
    formats:["Pop Room","Le Menu Crousti","Curiosités FR"],
    pitch:"Ce n'est pas une case diversité — c'est un profil à part entière. Shooting nu ou en lingerie, toutes morphologies, tous âges. Ce qu'on capture ici c'est la chaleur vraie, la connivence spontanée avec l'objectif. Ça ne se simule pas.",
    not:"Ce profil n'est pas une tolérance. C'est une force distincte. Pas pour celles qui posent en s'excusant." },
  { emoji:"🦋", label:"L'Originale\nDécalée",  age:"18+ · profil atypique",bg:C.cerise,
    hook:"Ton style\nte précède.\nOn veut le reste.",
    traits:["Tatouages ou piercings assumés","Univers visuel propre","Déteste le générique","Style avant le corps"],
    formats:["Crousti Lab","Curiosités FR","Bonbon Noir"],
    pitch:"Tatouages couvrants, style ultra-personnel, esthétique qui ne ressemble à rien d'autre — c'est exactement ce qu'on cherche. On ne normalise pas ce que tu es. On en fait des shootings photo et vidéo qui sortent du lot.",
    not:"Pas pour les profils qui veulent 'être originaux' sans maîtrise esthétique réelle. L'univers doit être là avant le shooting." },
  { emoji:"🍒", label:"L'Énergique\nPop",       age:"18+ · tempérament",  bg:C.jaune,
    hook:"L'ambiance\ntu la mets.\nOn la capte.",
    traits:["Visage qui s'anime seul","Rit pour de vrai","Bouge avant qu'on le demande","Fait monter le plateau"],
    formats:["Pop Room","Drôle d'Envie","Clac Club"],
    pitch:"Visage expressif, rire communicatif, corps en mouvement naturel. En shooting photo ou vidéo érotique, l'énergie de plateau ça change tout. Si tu entres dans une pièce et que l'ambiance monte — c'est toi qu'on cherche.",
    not:"Pas pour les profils posés ou trop dans leur tête. L'énergie doit être là d'entrée, pas jouée." },
];

const STEPS = [
  {num:"01",color:C.rose,   icon:"✉️",t:"Postule en 2 min",        d:"Prénom ou pseudo, âge, zone géo. Aucune photo à ce stade."},
  {num:"02",color:C.violet, icon:"💬",t:"On se parle",              d:"Message ou visio, à ton choix. Contrat, conditions, questions."},
  {num:"03",color:C.bleu,   icon:"🎭",t:"On construit ton univers", d:"Quel profil, quels formats, quelles limites. Tu valides tout."},
  {num:"04",color:C.jaune,  icon:"📸",t:"Le tournage",              d:"Ambiance pro et détendue. Tu stoppes quand tu veux."},
  {num:"05",color:C.cerise, icon:"✅",t:"Tu valides tout",          d:"Chaque image te passe par les mains avant publication."},
  {num:"06",color:C.rose,   icon:"💸",t:"Payée sous 48h",           d:"Tarif fixé à l'avance. Rien ne bouge sans accord écrit."},
];

const GARANTIES = [
  {icon:"📄",col:C.rose,   t:"Contrat avant tout",  d:"Droits à l'image, durée, usages : tout écrit avant de commencer."},
  {icon:"🔒",col:C.violet, t:"Anonymat garanti",     d:"Pseudo, angles validés, visage masquable, données jamais publiées. Aucune traçabilité vers ton identité réelle, ton réseau professionnel ou ton entourage personnel."},
  {icon:"🛑",col:C.bleu,   t:"Droit de retrait",     d:"Tu retires n'importe quel contenu à tout moment. Traitement 24h."},
  {icon:"💸",col:C.cerise, t:"Rémunération fixe",    d:"Tarif par session défini avant, bonus sur performance."},
  {icon:"✅",col:C.noir,   t:"Tu valides tout",      d:"Chaque image te passe par les mains avant publication."},
  {icon:"🤝",col:C.rose,   t:"Relation long terme",  d:"On cherche des collaboratrices régulières, pas des one-shot."},
];

const FAQ = [
  {q:"Je dois avoir de l'expérience ?",          r:"Non. L'attitude prime sur le CV. On t'accompagne si tu démarres."},
  {q:"Puis-je faire masquer mon visage ?",        r:"Oui, totalement. On définit ensemble les angles avant le tournage."},
  {q:"Comment est fixée la rémunération ?",       r:"Tarif par session défini avant, par écrit. Bonus transparents sur perf."},
  {q:"Et si je veux arrêter en cours ?",          r:"Tu stoppes, on s'arrête. Aucun contenu non validé ne sera publié."},
  {q:"Mon entourage peut-il tomber dessus ?",     r:"Pseudo, géo cachée, pas de référencement nominatif. On en parle ensemble."},
  {q:"Je ne rentre dans aucun profil ?",                  r:"Oui. Le tableau est un guide. Postule, on voit ensemble."},
  {q:"À 40 ans, est-ce que j'ai vraiment ma place ici ?", r:"Oui — et pas par tolérance. L'assurance, la façon d'habiter son corps, la présence dans le cadre : tout ça s'acquiert avec le temps. Ce que tu apportes à 40 ans, une 22 ans ne peut pas le simuler. C'est une valeur réelle, pas un quota."},
  {q:"J'ai un réseau pro établi. Comment vous gérez la discrétion ?", r:"On en parle précisément à l'étape 2, avant tout engagement. Pseudo, géo masquée, absence de référencement nominatif, paramétrage des accès : chaque mesure est discutée avec toi et documentée dans le contrat. Rien n'est publié sans que tu aies validé chaque détail."},
  {q:"Mon corps n'est pas celui des magazines. Vous cherchez vraiment ça ?", r:"On cherche une façon d'être dans le cadre, pas une silhouette. Le physique 'standard' n'est pas notre territoire — la curiosité, l'authenticité et la présence le sont. Si tu doutes, postule quand même. On te dira honnêtement ce qu'on voit."},
];

/* ─────────────────────── COMPOSANT TICKER ───────────────────────────────── */
function Ticker({ items, bg, fg }: { items:string[], bg:string, fg:string }) {
  const repeated = [...items, ...items];
  return (
    <div style={{ background:bg, padding:"11px 0", overflow:"hidden", whiteSpace:"nowrap",
      borderTop:`3px solid ${C.noir}`, borderBottom:`3px solid ${C.noir}` }}>
      <div style={{ display:"inline-flex", animation:"ticker 18s linear infinite" }}>
        {repeated.map((t,i) => (
          <span key={i} style={{ fontWeight:900, fontSize:"0.8rem", color:fg,
            marginRight:"3rem", letterSpacing:"2px", textTransform:"uppercase",
            flexShrink:0 }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────── COMPOSANT CARTE GARANTIE ─────────────────────── */
function GarCard({ g, i }: { g:typeof GARANTIES[0], i:number }) {
  const [hov, setHov] = useState(false);
  const ref = useReveal(i * 80);
  const bgs = [C.rose,C.violet,C.bleu,C.cerise,C.noir,C.rose];
  const bg  = bgs[i];
  return (
    <div ref={ref} className="reveal-pop"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background:bg, border:`2px solid ${C.noir}`, borderRadius:"16px", padding:"1.8rem",
        boxShadow: hov ? `6px 6px 0 ${C.noir}` : `3px 3px 0 ${C.noir}`,
        transform: hov ? "translateY(-6px) rotate(0.5deg)" : "none",
        transition:"all 0.25s cubic-bezier(.34,1.56,.64,1)", cursor:"default" }}>
      <div style={{ fontSize:"1.8rem", marginBottom:"0.7rem",
        display:"inline-block",
        animation: hov ? "floatBob 1.2s ease-in-out infinite" : "none" }}>{g.icon}</div>
      <div style={{ fontWeight:900, fontSize:"0.95rem", color:ink(bg), marginBottom:"0.5rem" }}>{g.t}</div>
      <p style={{ fontSize:"0.83rem", color:`${ink(bg)}cc`, lineHeight:1.65, margin:0 }}>{g.d}</p>
    </div>
  );
}

/* ─────────────────────────── COMPOSANT PRINCIPAL ───────────────────────── */
export default function CroustiFRAnimated() {
  const [activeSeg, setActiveSeg] = useState<number|null>(null);
  const [openFAQ,   setOpenFAQ]   = useState<number|null>(null);
  const [formSent,  setFormSent]  = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const heroImgFile = useFile("fil_W10jrt3I6DaOaG");
  const [heroImgUrl, setHeroImgUrl] = useState<string | null>(null);
  useEffect(() => {
    if (heroImgFile) {
      const url = URL.createObjectURL(heroImgFile);
      setHeroImgUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [heroImgFile]);

  /* hero entrance après mount */
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  /* refs pour les sections scroll */
  const refManifeste   = useReveal(0);
  const refProcessTitle= useReveal(0);
  const refFaqTitle    = useReveal(0);
  const refFormTitle   = useReveal(0);

  const seg = activeSeg !== null ? SEGMENTS[activeSeg] : null;

  const sLabel = (color:string): React.CSSProperties => ({
    fontSize:"0.65rem", fontWeight:900, letterSpacing:"3px",
    textTransform:"uppercase", color, marginBottom:"0.6rem", display:"block",
  });

  return (
    <div style={{ fontFamily:"'Segoe UI', system-ui, sans-serif", background:C.noir,
      color:C.creme, minHeight:"100vh", overflowX:"hidden" }}>

      {/* ── INJECT KEYFRAMES ── */}
      <style>{KEYFRAMES}</style>

      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <header style={{ padding:"0 2rem", display:"flex", alignItems:"center",
        justifyContent:"space-between", height:"60px", position:"sticky", top:0,
        zIndex:200, background:C.noir, borderBottom:`3px solid ${C.rose}`,
        animation:"fadeUp 0.5s ease both" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.3rem" }}>
          <span style={{ fontWeight:900, fontSize:"1.35rem", letterSpacing:"-1px", color:C.rose }}>CROUSTI</span>
          <span style={{ fontWeight:900, fontSize:"1.35rem", letterSpacing:"-1px" }}>FR</span>
          <span style={{ animation:"floatBob 3s ease-in-out infinite", display:"inline-block" }}>👠</span>
        </div>
        <div style={{ display:"flex", gap:"0.7rem" }}>
          {(["Mon profil","Garanties","Postuler"] as const).map((l,i) => (
            <button key={l}
              onClick={() => document.getElementById(l==="Mon profil"?"profils":l==="Garanties"?"garanties":"postuler")?.scrollIntoView({behavior:"smooth"})}
              style={{ background:l==="Postuler"?C.rose:"transparent",
                color:l==="Postuler"?C.noir:`${C.creme}99`,
                border:l==="Postuler"?"none":`2px solid ${C.creme}33`,
                padding:"6px 14px", borderRadius:"50px", fontSize:"0.75rem",
                fontWeight:800, cursor:"pointer",
                animation:`fadeUp 0.5s ${0.1+i*0.08}s ease both`,
                ...(l==="Postuler" ? { animation:`fadeUp 0.5s 0.3s ease both, pulseGlow 3s 1s ease-in-out infinite` } : {}),
              }}>
              {l}
            </button>
          ))}
        </div>
      </header>

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section style={{ minHeight:"92vh", display:"flex", flexDirection:"column",
        justifyContent:"center", padding:"4rem 2rem 3rem", position:"relative", overflow:"hidden" }}>

        {/* Blocs déco animés */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>

          {/* ── Image modèle hero ── rendu avant les triangles = derrière eux */}
          {heroImgUrl && (
            <div style={{
              position:"absolute", top:0, left:0, width:"52%", height:"100%",
              opacity: heroReady ? 1 : 0,
              transition:"opacity 1.1s 0.15s ease",
            }}>
              <img src={heroImgUrl} alt="Crousti FR modèle"
                style={{ width:"100%", height:"100%", objectFit:"cover",
                  objectPosition:"center top", display:"block" }} />
              {/* Fondu droit : se dissout vers le fond noir du côté du texte */}
              <div style={{ position:"absolute", inset:0,
                background:`linear-gradient(to left, ${C.noir} 0%, ${C.noir}bb 12%, ${C.noir}66 30%, transparent 58%)` }} />
              {/* Voile sombre léger pour l'harmonie avec l'esthétique du site */}
              <div style={{ position:"absolute", inset:0, background:`${C.noir}22` }} />
            </div>
          )}

          <div style={{ position:"absolute", top:0, right:0, width:"38%", height:"100%",
            background:C.rose, clipPath:"polygon(20% 0,100% 0,100% 100%,0 100%)",
            opacity: heroReady ? 1 : 0,
            transform: heroReady ? "translateX(0)" : "translateX(100%)",
            transition:"all 0.9s cubic-bezier(.22,1,.36,1)" }} />
          <div style={{ position:"absolute", top:0, right:0, width:"28%", height:"100%",
            background:C.violet, clipPath:"polygon(28% 0,100% 0,100% 100%,8% 100%)",
            opacity: heroReady ? 1 : 0,
            transform: heroReady ? "translateX(0)" : "translateX(100%)",
            transition:"all 0.9s 0.1s cubic-bezier(.22,1,.36,1)" }} />
          <div style={{ position:"absolute", top:0, right:0, width:"18%", height:"100%",
            background:C.jaune, clipPath:"polygon(20% 0,100% 0,100% 100%,0 100%)",
            opacity: heroReady ? 1 : 0,
            transform: heroReady ? "translateX(0)" : "translateX(100%)",
            transition:"all 0.9s 0.2s cubic-bezier(.22,1,.36,1)" }} />

          {/* Formes flottantes déco */}
          <div style={{ position:"absolute", bottom:"15%", left:"3%", width:"60px", height:"60px",
            background:C.rose, borderRadius:"12px", border:`2px solid ${C.noir}`,
            animation:"floatBob 4s ease-in-out infinite", opacity:0.6 }} />
          <div style={{ position:"absolute", top:"20%", left:"8%", width:"36px", height:"36px",
            background:C.jaune, borderRadius:"50%", border:`2px solid ${C.noir}`,
            animation:"floatBob 3s 1s ease-in-out infinite", opacity:0.5 }} />
          <div style={{ position:"absolute", bottom:"30%", left:"18%", width:"28px", height:"28px",
            background:C.violet, borderRadius:"6px", border:`2px solid ${C.noir}`,
            animation:"floatBob 5s 0.5s ease-in-out infinite", opacity:0.5 }} />
        </div>

        {/* Badge rotatif animé */}
        <div style={{ position:"absolute", top:"8%", right:"4%", zIndex:10,
          background:C.jaune, borderRadius:"50%", width:"100px", height:"100px",
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:`4px 4px 0 ${C.noir}`,
          animation:"badgeSpin 4s ease-in-out infinite" }}>
          <div style={{ textAlign:"center", lineHeight:1.2 }}>
            <div style={{ fontWeight:900, fontSize:"0.58rem", letterSpacing:"1.5px", textTransform:"uppercase", color:C.noir }}>Recrutement</div>
            <div style={{ fontWeight:900, fontSize:"0.95rem", color:C.noir }}>OUVERT</div>
            <div style={{ fontSize:"1rem" }}>👠</div>
          </div>
        </div>

        {/* Contenu héro */}
        <div style={{ position:"relative", zIndex:5, maxWidth:"760px" }}>
          {/* Overline */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:"0.6rem", marginBottom:"1.5rem",
            opacity: heroReady ? 1 : 0,
            transform: heroReady ? "none" : "translateX(-30px)",
            transition:"all 0.6s 0.3s cubic-bezier(.22,1,.36,1)" }}>
            <div style={{ width:"36px", height:"4px", background:C.rose, borderRadius:"2px" }} />
            <span style={{ fontSize:"0.72rem", fontWeight:800, letterSpacing:"3px", textTransform:"uppercase", color:C.rose }}>
              Crousti FR · Espace créatrices · 18+
            </span>
          </div>

          {/* Titre mot par mot */}
          <h1 style={{ fontSize:"clamp(3rem, 9vw, 7.5rem)", fontWeight:900, letterSpacing:"-4px",
            lineHeight:0.92, marginBottom:"2rem", textTransform:"uppercase", overflow:"hidden" }}>
            {["L'ATTITUDE","PRIME","SUR TOUT."].map((word, wi) => (
              <span key={word} style={{ display:"block", overflow:"hidden" }}>
                <span style={{
                  display:"block",
                  color: wi===1 ? C.rose : C.creme,
                  animation: heroReady ? `wordIn 0.7s ${0.4+wi*0.15}s cubic-bezier(.22,1,.36,1) both` : "none",
                  opacity: heroReady ? 1 : 0,
                }}>
                  {word}
                </span>
              </span>
            ))}
          </h1>

          <p style={{ fontSize:"clamp(0.95rem, 2vw, 1.15rem)", color:`${C.creme}bb`,
            maxWidth:"480px", lineHeight:1.75, marginBottom:"2.5rem",
            opacity: heroReady ? 1 : 0,
            transform: heroReady ? "none" : "translateY(20px)",
            transition:"all 0.6s 0.85s cubic-bezier(.22,1,.36,1)" }}>
            Crousti FR ne cherche pas un type de corps. On cherche une énergie, une curiosité, une façon d'être dans le cadre. Pop, coloré, décomplexé.
          </p>

          {/* CTAs */}
          <div style={{ display:"flex", gap:"0.8rem", flexWrap:"wrap", marginBottom:"3rem",
            opacity: heroReady ? 1 : 0,
            transform: heroReady ? "none" : "translateY(20px)",
            transition:"all 0.6s 1s cubic-bezier(.22,1,.36,1)" }}>
            <button
              onClick={() => document.getElementById("profils")?.scrollIntoView({behavior:"smooth"})}
              style={{ background:C.rose, color:C.noir, border:"none", padding:"15px 32px",
                borderRadius:"50px", fontSize:"0.92rem", fontWeight:900, letterSpacing:"1px",
                textTransform:"uppercase", cursor:"pointer",
                animation:"pulseGlow 3s 2s ease-in-out infinite",
                transition:"transform 0.2s cubic-bezier(.34,1.56,.64,1)" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform="scale(1.07)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform="scale(1)")}>
              Trouver mon profil 👠
            </button>
            <button
              onClick={() => document.getElementById("postuler")?.scrollIntoView({behavior:"smooth"})}
              style={{ background:"transparent", color:C.creme, border:`2px solid ${C.creme}`,
                padding:"15px 32px", borderRadius:"50px", fontSize:"0.88rem", fontWeight:700,
                cursor:"pointer", transition:"all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background=C.creme; e.currentTarget.style.color=C.noir; }}
              onMouseLeave={(e) => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color=C.creme; }}>
              Postuler →
            </button>
          </div>

          {/* Réassurance pills */}
          <div style={{ display:"flex", gap:"0.6rem", flexWrap:"wrap",
            opacity: heroReady ? 1 : 0, transition:"all 0.6s 1.1s ease" }}>
            {([ ["📄","Contrat avant tout",C.creme],["🔒","Anonymat possible",C.violet],
                 ["💸","Payée sous 48h",C.jaune],["✅","Tu valides tout",C.rose] ] as [string,string,string][]).map(([ic,lb,bg],i) => (
              <span key={lb} style={{ background:bg, color:ink(bg), borderRadius:"50px",
                padding:"5px 14px", fontSize:"0.74rem", fontWeight:800,
                border:`2px solid ${C.noir}`, boxShadow:"2px 2px 0 #000",
                display:"inline-block",
                animation:`fadeUp 0.4s ${1.2+i*0.07}s ease both` }}>
                {ic} {lb}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TICKER 1 ════════════════════════════════════════════════════════ */}
      <Ticker
        items={["🌸 LA POP CURIEUSE","👠 L'ATTITUDE ASSUMÉE","🤝 LA COMPLICITÉ OUVERTE","🔮 L'ORIGINALE DÉCALÉE","⚡ L'ÉNERGIQUE POP"]}
        bg={C.rose} fg={C.noir} />

      {/* ══ PROFILS ════════════════════════════════════════════════════════ */}
      <section id="profils" style={{ background:C.creme, padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"1080px", margin:"0 auto" }}>

          {/* Titre section */}
          {(() => { const r=useReveal(0); return (
            <div ref={r} className="reveal-left" style={{ display:"flex", alignItems:"flex-end",
              justifyContent:"space-between", flexWrap:"wrap", gap:"1rem", marginBottom:"3rem" }}>
              <div>
                <span style={sLabel(C.rose)}>5 profils recherchés</span>
                <h2 style={{ fontSize:"clamp(2rem, 5vw, 3.5rem)", fontWeight:900, color:C.noir,
                  letterSpacing:"-2px", margin:0, textTransform:"uppercase", lineHeight:1 }}>
                  Tu te reconnais<br /><span style={{ color:C.rose }}>dans lequel ?</span>
                </h2>
              </div>
              <p style={{ fontSize:"0.88rem", color:`${C.noir}99`, maxWidth:"280px", lineHeight:1.7 }}>
                Clique sur le profil qui te ressemble pour voir ce qu'on attend de toi.
              </p>
            </div>
          ); })()}

          {/* 5 cartes profil */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:"0.9rem", marginBottom:"2rem" }}>
            {SEGMENTS.map((s,i) => {
              const active = activeSeg === i;
              const ref = useReveal(i * 80);
              return (
                <div key={s.label} ref={ref} className="reveal-pop"
                  onClick={() => setActiveSeg(active ? null : i)}
                  onMouseEnter={(e) => { if(!active) e.currentTarget.style.transform="translateY(-8px) rotate(-1deg) scale(1.04)"; }}
                  onMouseLeave={(e) => { if(!active) e.currentTarget.style.transform="none"; }}
                  style={{ background:active?s.bg:C.blanc, border:`3px solid ${active?C.noir:`${C.noir}22`}`,
                    borderRadius:"16px", padding:"1.5rem 1rem", textAlign:"center", cursor:"pointer",
                    transition:"all 0.3s cubic-bezier(.34,1.56,.64,1)",
                    transform: active ? "translateY(-8px) rotate(-1deg) scale(1.04)" : "none",
                    boxShadow: active ? `6px 6px 0 ${C.noir}` : `2px 2px 0 ${C.noir}33` }}>
                  <div style={{ fontSize:"2.2rem", marginBottom:"0.5rem", display:"inline-block",
                    animation: active ? "floatBob 2s ease-in-out infinite" : "none" }}>{s.emoji}</div>
                  <div style={{ fontWeight:900, fontSize:"0.82rem", color:active?ink(s.bg):C.noir,
                    lineHeight:1.3, whiteSpace:"pre-line" }}>{s.label}</div>
                  <div style={{ fontSize:"0.65rem", fontWeight:700,
                    color:active?ink(s.bg):`${C.noir}77`, marginTop:"4px" }}>{s.age}</div>
                </div>
              );
            })}
          </div>

          {/* Détail profil sélectionné */}
          {seg ? (
            <div style={{ background:seg.bg, border:`3px solid ${C.noir}`, borderRadius:"20px",
              overflow:"hidden", boxShadow:`6px 6px 0 ${C.noir}`,
              animation:"popIn 0.45s cubic-bezier(.34,1.56,.64,1) both" }}>
              <div style={{ padding:"2.5rem", display:"flex", alignItems:"flex-start", gap:"1.5rem", flexWrap:"wrap" }}>
                <div style={{ fontSize:"4rem", lineHeight:1, animation:"floatBob 3s ease-in-out infinite" }}>{seg.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:900, fontSize:"clamp(1.5rem, 4vw, 2.5rem)", color:ink(seg.bg),
                    lineHeight:1.1, textTransform:"uppercase", whiteSpace:"pre-line", marginBottom:"0.5rem" }}>{seg.label}</div>
                  <div style={{ fontWeight:800, fontSize:"clamp(0.95rem, 2vw, 1.2rem)", color:ink(seg.bg),
                    opacity:0.75, fontStyle:"italic", whiteSpace:"pre-line" }}>"{seg.hook}"</div>
                </div>
              </div>
              <div style={{ background:`${C.noir}15`, padding:"2rem 2.5rem",
                display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2rem" }}>
                <div>
                  <p style={{ fontSize:"0.92rem", color:ink(seg.bg), lineHeight:1.8, marginBottom:"1.5rem" }}>{seg.pitch}</p>
                  <div style={{ background:`${C.noir}18`, borderRadius:"12px", padding:"1rem 1.2rem" }}>
                    <span style={sLabel(`${ink(seg.bg)}88`)}>Ce que ce n'est pas</span>
                    <p style={{ fontSize:"0.82rem", color:ink(seg.bg), opacity:0.7, lineHeight:1.6, fontStyle:"italic", margin:0 }}>{seg.not}</p>
                  </div>
                </div>
                <div>
                  <div style={{ marginBottom:"1.5rem" }}>
                    <span style={sLabel(`${ink(seg.bg)}88`)}>Tes traits</span>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem" }}>
                      {seg.traits.map((tr,i) => (
                        <span key={tr} style={{ background:C.noir, color:seg.bg, borderRadius:"50px",
                          padding:"5px 14px", fontSize:"0.76rem", fontWeight:800,
                          animation:`fadeUp 0.3s ${i*0.06}s ease both` }}>{tr}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span style={sLabel(`${ink(seg.bg)}88`)}>Tes formats</span>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem" }}>
                      {seg.formats.map((f,i) => (
                        <span key={f} style={{ background:"transparent", border:`2px solid ${C.noir}`,
                          color:ink(seg.bg), borderRadius:"50px", padding:"5px 14px",
                          fontSize:"0.76rem", fontWeight:700,
                          animation:`fadeUp 0.3s ${i*0.07}s ease both` }}>{f}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ padding:"1.5rem 2.5rem", display:"flex", justifyContent:"flex-end" }}>
                <button onClick={() => document.getElementById("postuler")?.scrollIntoView({behavior:"smooth"})}
                  style={{ background:C.noir, color:seg.bg, border:"none", padding:"12px 28px",
                    borderRadius:"50px", fontSize:"0.88rem", fontWeight:900, letterSpacing:"1px",
                    textTransform:"uppercase", cursor:"pointer", boxShadow:`3px 3px 0 ${C.creme}`,
                    transition:"all 0.2s cubic-bezier(.34,1.56,.64,1)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform="scale(1.07)"; e.currentTarget.style.boxShadow=`5px 5px 0 ${C.creme}`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow=`3px 3px 0 ${C.creme}`; }}>
                  Postuler comme {seg.label.replace("\n"," ")} →
                </button>
              </div>
            </div>
          ) : (
            <div style={{ border:`3px dashed ${C.noir}44`, borderRadius:"20px", padding:"3rem", textAlign:"center" }}>
              <p style={{ color:`${C.noir}77`, fontSize:"0.9rem", fontStyle:"italic", margin:0 }}>
                ← Clique sur un profil pour voir le détail
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ══ MANIFESTE — fond noir ════════════════════════════════════════════ */}
      <section style={{ background:C.noir, padding:"6rem 2rem", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-20px", right:"-20px", fontSize:"18rem",
          fontWeight:900, color:C.rose, opacity:0.05, lineHeight:1,
          userSelect:"none", pointerEvents:"none", animation:"floatBob 8s ease-in-out infinite" }}>C</div>
        <div ref={refManifeste} className="reveal-up" style={{ maxWidth:"820px", margin:"0 auto", position:"relative" }}>
          <span style={sLabel(C.rose)}>Notre état d'esprit</span>
          <h2 style={{ fontSize:"clamp(2rem, 5vw, 3.5rem)", fontWeight:900, letterSpacing:"-2px",
            lineHeight:1.1, marginBottom:"2.5rem", textTransform:"uppercase" }}>
            Le désir n'a pas besoin<br />d'être sombre<br />
            <span style={{ color:C.rose }}>pour être intense.</span>
          </h2>
          {[
            { txt:"Crousti FR produit des photos et vidéos érotiques pour adultes. Du contenu assumé, esthétiquement soigné, tourné dans le respect total de chaque créatrice. Pas le cliché du secteur — quelque chose de plus curieux, de plus coloré, de plus humain.", q:false },
            { txt:"Nos tournages sont des espaces où le désir peut être drôle, inattendu, pop, tendre — toujours librement choisi. Jamais honteux. Jamais imposé.", q:false },
            { txt:"Parce que la curiosité est une énergie. Et chez Crousti FR, elle porte des talons.", q:true },
            { txt:"Et cette curiosité n'a pas d'âge. À 40 ans, la façon d'être dans un cadre — d'y apporter quelque chose de vrai, d'ancré — ça ne s'invente pas. C'est exactement ce qu'on cherche.", q:false },
          ].map((p,i) => (
            <p key={i} style={{ fontSize:p.q?"clamp(1.1rem, 2.5vw, 1.4rem)":"1rem",
              color:p.q?C.jaune:`${C.creme}cc`, fontWeight:p.q?800:400,
              fontStyle:p.q?"italic":"normal", lineHeight:1.8, margin:`0 0 ${i<2?"1.2rem":"0"}` }}>{p.txt}</p>
          ))}
        </div>
      </section>

      {/* ══ PROCESS ════════════════════════════════════════════════════════ */}
      <section id="process">
        <div ref={refProcessTitle} className="reveal-up"
          style={{ background:C.violet, padding:"3rem 2rem 2rem", textAlign:"center",
            borderTop:`3px solid ${C.noir}`, borderBottom:`3px solid ${C.noir}` }}>
          <span style={sLabel(`${C.creme}88`)}>Comment ça se passe</span>
          <h2 style={{ fontSize:"clamp(2rem, 5vw, 3rem)", fontWeight:900, color:C.creme,
            letterSpacing:"-2px", textTransform:"uppercase", margin:0 }}>
            6 étapes. <span style={{ color:C.jaune }}>Transparent.</span> <span style={{ color:C.rose }}>Sans surprise.</span>
          </h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)" }}>
          {STEPS.map((s,i) => {
            const ref = useReveal(i * 70);
            const isEven = i%2===0;
            return (
              <div key={s.num} ref={ref}
                className={i%2===0 ? "reveal-left" : "reveal-right"}
                style={{ background:isEven?s.color:C.noir, padding:"2.5rem 2rem",
                  border:`1px solid ${C.noir}`, borderTop:i<3?`3px solid ${C.noir}`:"none" }}>
                <div style={{ fontSize:"3rem", fontWeight:900,
                  color:isEven?`${ink(s.color)}22`:`${s.color}44`, lineHeight:1, marginBottom:"0.5rem",
                  userSelect:"none" }}>{s.num}</div>
                <div style={{ fontSize:"1.1rem" }}>{s.icon}</div>
                <div style={{ fontWeight:900, fontSize:"1rem",
                  color:isEven?ink(s.color):s.color, margin:"0.6rem 0 0.4rem",
                  textTransform:"uppercase", letterSpacing:"0.5px" }}>{s.t}</div>
                <p style={{ fontSize:"0.84rem",
                  color:isEven?`${ink(s.color)}cc`:`${C.creme}88`, lineHeight:1.65, margin:0 }}>{s.d}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══ TICKER 2 ════════════════════════════════════════════════════════ */}
      <Ticker
        items={["📄 CONTRAT AVANT TOUT","🔒 ANONYMAT GARANTI","💸 PAYÉE SOUS 48H","✅ TU VALIDES TOUT","🛑 DROIT DE RETRAIT","🤝 RELATION LONG TERME"]}
        bg={C.violet} fg={C.creme} />

      {/* ══ GARANTIES — fond jaune ══════════════════════════════════════════ */}
      <section id="garanties" style={{ background:C.jaune, padding:"6rem 2rem", borderTop:`3px solid ${C.noir}` }}>
        <div style={{ maxWidth:"1060px", margin:"0 auto" }}>
          {(() => { const r=useReveal(0); return (
            <div ref={r} className="reveal-up" style={{ display:"flex", alignItems:"flex-end",
              justifyContent:"space-between", flexWrap:"wrap", gap:"1rem", marginBottom:"3rem" }}>
              <div>
                <span style={sLabel(`${C.noir}77`)}>Tes garanties</span>
                <h2 style={{ fontSize:"clamp(2rem, 5vw, 3.5rem)", fontWeight:900, color:C.noir,
                  letterSpacing:"-2px", margin:0, textTransform:"uppercase", lineHeight:1 }}>
                  Ce qu'on te garantit.<br />
                  <span style={{ WebkitTextStroke:`2px ${C.noir}`, color:"transparent" }}>Sans exception.</span>
                </h2>
              </div>
              <p style={{ fontSize:"0.88rem", color:`${C.noir}88`, maxWidth:"260px", lineHeight:1.7 }}>
                Pas des arguments marketing — les conditions de base.
              </p>
            </div>
          ); })()}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"1rem" }}>
            {GARANTIES.map((g,i) => <GarCard key={g.t} g={g} i={i} />)}
          </div>
        </div>
      </section>

      {/* ══ TÉMOIGNAGES — fond rose ════════════════════════════════════════ */}
      <section style={{ background:C.rose, padding:"5rem 2rem", borderTop:`3px solid ${C.noir}` }}>
        <div style={{ maxWidth:"980px", margin:"0 auto" }}>
          {(() => { const r=useReveal(0); return (
            <div ref={r} className="reveal-up">
              <span style={sLabel(`${C.noir}88`)}>Elles l'ont fait</span>
              <h2 style={{ fontSize:"clamp(2rem, 5vw, 3rem)", fontWeight:900, color:C.noir,
                letterSpacing:"-2px", marginBottom:"2.5rem", textTransform:"uppercase" }}>Ce qu'elles en disent.</h2>
            </div>
          ); })()}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"1rem" }}>
            {[
              { initiale:"L", profil:"La Pop Curieuse",      couleur:C.rose,   bg:C.noir,   univers:"Drôle d'Envie · Crousti Talons", rot:"-1deg", txt:"J'avais peur que ce soit comme les autres. Le premier appel m'a rassurée en 10 min. Contrat clair, tournage sérieux et détendu. Je suis revenue 4 fois." },
              { initiale:"M", profil:"L'Originale Décalée",  couleur:C.cerise, bg:C.violet, univers:"Crousti Lab · Bonbon Noir",        rot:"1.5deg", txt:"Mon style est très marqué. Ils ne l'ont pas normalisé — ils l'ont mis en valeur. Je me suis sentie utilisée pour ce que je suis vraiment." },
              { initiale:"C", profil:"L'Attitude Assumée · 42 ans",couleur:C.violet, bg:C.jaune,  univers:"Crousti Talons · Clac Club",       rot:"-0.5deg", txt:"J'avais peur d'arriver là et qu'on me dise poliment que j'étais trop vieille. C'est l'inverse qui s'est passé. Ma façon d'être dans le cadre, ils l'ont cherchée — pas tolérée." },
            ].map((tm,i) => {
              const ref = useReveal(i * 100);
              return (
                <div key={tm.initiale} ref={ref} className="reveal-pop"
                  onMouseEnter={(e) => { e.currentTarget.style.transform=`rotate(0deg) translateY(-8px) scale(1.02)`; e.currentTarget.style.boxShadow=`8px 8px 0 #000`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform=`rotate(${tm.rot})`; e.currentTarget.style.boxShadow=`4px 4px 0 #000`; }}
                  style={{ background:tm.bg, border:`2px solid ${C.noir}`, borderRadius:"16px",
                    padding:"1.8rem", boxShadow:`4px 4px 0 #000`,
                    transform:`rotate(${tm.rot})`,
                    transition:"all 0.3s cubic-bezier(.34,1.56,.64,1)", cursor:"default" }}>
                  <div style={{ fontSize:"2.5rem", color:tm.couleur, fontWeight:900, lineHeight:1, marginBottom:"0.8rem" }}>"</div>
                  <p style={{ fontSize:"0.88rem", color:ink(tm.bg), lineHeight:1.75, fontStyle:"italic", marginBottom:"1.2rem" }}>{tm.txt}</p>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.7rem",
                    borderTop:`1px solid ${ink(tm.bg)}22`, paddingTop:"1rem" }}>
                    <div style={{ width:"36px", height:"36px", borderRadius:"50%", background:tm.couleur,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontWeight:900, fontSize:"0.95rem", color:ink(tm.couleur) }}>{tm.initiale}</div>
                    <div>
                      <div style={{ fontWeight:800, fontSize:"0.78rem", color:ink(tm.bg) }}>{tm.profil}</div>
                      <div style={{ fontSize:"0.7rem", color:`${ink(tm.bg)}77` }}>{tm.univers}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ FAQ — fond bleu ════════════════════════════════════════════════ */}
      <section style={{ background:C.bleu, padding:"5rem 2rem", borderTop:`3px solid ${C.noir}` }}>
        <div style={{ maxWidth:"740px", margin:"0 auto" }}>
          <div ref={refFaqTitle} className="reveal-up">
            <span style={sLabel(`${C.creme}88`)}>FAQ</span>
            <h2 style={{ fontSize:"clamp(2rem, 4vw, 3rem)", fontWeight:900, color:C.creme,
              letterSpacing:"-2px", marginBottom:"2.5rem", textTransform:"uppercase" }}>
              Tes questions.<br /><span style={{ color:C.jaune }}>Nos réponses.</span>
            </h2>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.7rem" }}>
            {FAQ.map((item,i) => {
              const ref = useReveal(i * 60);
              return (
                <div key={i} ref={ref} className="reveal-left"
                  style={{ background:openFAQ===i?C.creme:`${C.creme}18`,
                    border:`2px solid ${openFAQ===i?C.noir:`${C.creme}44`}`,
                    borderRadius:"14px", overflow:"hidden",
                    transition:"all 0.3s cubic-bezier(.22,1,.36,1)",
                    boxShadow:openFAQ===i?`3px 3px 0 #000`:"none",
                    transform:openFAQ===i?"scale(1.01)":"scale(1)" }}>
                  <button onClick={() => setOpenFAQ(openFAQ===i?null:i)}
                    style={{ width:"100%", background:"transparent", border:"none",
                      padding:"1.1rem 1.5rem", display:"flex",
                      justifyContent:"space-between", alignItems:"center",
                      cursor:"pointer", gap:"1rem" }}>
                    <span style={{ fontWeight:800, fontSize:"0.9rem",
                      color:openFAQ===i?C.noir:C.creme, textAlign:"left" }}>{item.q}</span>
                    <span style={{ fontSize:"1.2rem",
                      color:openFAQ===i?C.rose:C.jaune, flexShrink:0, fontWeight:900,
                      transition:"transform 0.3s cubic-bezier(.34,1.56,.64,1)",
                      display:"inline-block",
                      transform:openFAQ===i?"rotate(0deg)":"rotate(0deg)" }}>
                      {openFAQ===i?"−":"+"}
                    </span>
                  </button>
                  {openFAQ===i && (
                    <div style={{ padding:"0 1.5rem 1.2rem", animation:"fadeUp 0.3s ease both" }}>
                      <p style={{ fontSize:"0.88rem", color:`${C.noir}dd`, lineHeight:1.75, margin:0 }}>{item.r}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ FORMULAIRE — fond cerise ════════════════════════════════════════ */}
      <section id="postuler" style={{ background:C.cerise, padding:"6rem 2rem", borderTop:`3px solid ${C.noir}` }}>
        <div style={{ maxWidth:"660px", margin:"0 auto" }}>
          <div ref={refFormTitle} className="reveal-up"
            style={{ display:"flex", alignItems:"flex-start", gap:"2rem", flexWrap:"wrap", marginBottom:"2.5rem" }}>
            <div>
              <span style={sLabel(`${C.creme}88`)}>Candidature</span>
              <h2 style={{ fontSize:"clamp(2rem, 5vw, 3.5rem)", fontWeight:900, color:C.creme,
                letterSpacing:"-2px", margin:0, textTransform:"uppercase", lineHeight:1.05 }}>
                Prête à<br />nous rejoindre ?
              </h2>
            </div>
            <div style={{ background:C.jaune, border:`2px solid ${C.noir}`, borderRadius:"50%",
              width:"90px", height:"90px", display:"flex", alignItems:"center", justifyContent:"center",
              flexShrink:0, boxShadow:"3px 3px 0 #000", marginTop:"0.5rem",
              animation:"badgeSpin2 5s ease-in-out infinite" }}>
              <div style={{ textAlign:"center", lineHeight:1.2 }}>
                <div style={{ fontSize:"1.4rem" }}>👠</div>
                <div style={{ fontSize:"0.52rem", fontWeight:900, letterSpacing:"1px", textTransform:"uppercase", color:C.noir }}>Réponse<br />48h</div>
              </div>
            </div>
          </div>

          <p style={{ color:`${C.creme}cc`, fontSize:"0.92rem", marginBottom:"2rem", lineHeight:1.7 }}>
            Aucune photo requise à ce stade. Juste quelques infos pour qu'on se connaisse.
          </p>

          {formSent ? (
            <div style={{ background:C.noir, border:`3px solid ${C.creme}`, borderRadius:"20px",
              padding:"3rem", textAlign:"center", boxShadow:"5px 5px 0 #000",
              animation:"popIn 0.5s cubic-bezier(.34,1.56,.64,1) both" }}>
              <div style={{ fontSize:"3rem", marginBottom:"1rem",
                animation:"floatBob 2s ease-in-out infinite", display:"inline-block" }}>👠</div>
              <h3 style={{ fontWeight:900, fontSize:"1.5rem", color:C.rose, marginBottom:"0.8rem" }}>Candidature reçue !</h3>
              <p style={{ color:`${C.creme}cc`, lineHeight:1.7, fontSize:"0.9rem" }}>On revient vers toi dans les 48h. À très vite.</p>
            </div>
          ) : (
            <div style={{ background:`${C.noir}33`, border:`2px solid ${C.creme}44`,
              borderRadius:"20px", padding:"2.5rem", animation:"fadeUp 0.6s ease both" }}>
              <div style={{ marginBottom:"1rem" }}>
                <label style={{ display:"block", fontSize:"0.68rem", fontWeight:800,
                  color:`${C.creme}cc`, marginBottom:"6px", letterSpacing:"1px", textTransform:"uppercase" }}>
                  Mon profil (optionnel)
                </label>
                <select style={{ width:"100%", padding:"11px 14px", borderRadius:"10px",
                  border:`2px solid ${C.creme}33`, fontSize:"0.88rem",
                  background:`${C.noir}55`, color:C.creme, outline:"none", boxSizing:"border-box" }}>
                  <option value="">Je ne sais pas encore</option>
                  {SEGMENTS.map((s) => <option key={s.label} value={s.label}>{s.emoji} {s.label.replace("\n"," ")}</option>)}
                </select>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.9rem", marginBottom:"0.9rem" }}>
                {([["Prénom ou pseudo","text","Pseudo ou prénom"],["Âge","number","Ton âge"]] as [string,string,string][]).map(([lb,tp,ph]) => (
                  <div key={lb}>
                    <label style={{ display:"block", fontSize:"0.68rem", fontWeight:800,
                      color:`${C.creme}cc`, marginBottom:"6px", letterSpacing:"1px", textTransform:"uppercase" }}>{lb}</label>
                    <input type={tp} placeholder={ph}
                      style={{ width:"100%", padding:"11px 14px", borderRadius:"10px",
                        border:`2px solid ${C.creme}33`, fontSize:"0.88rem",
                        background:`${C.noir}55`, color:C.creme, outline:"none", boxSizing:"border-box" }} />
                  </div>
                ))}
              </div>
              {([["Email confidentiel","email","ton@email.fr"],["Zone géographique","text","Paris, Lyon, Marseille..."]] as [string,string,string][]).map(([lb,tp,ph]) => (
                <div key={lb} style={{ marginBottom:"0.9rem" }}>
                  <label style={{ display:"block", fontSize:"0.68rem", fontWeight:800,
                    color:`${C.creme}cc`, marginBottom:"6px", letterSpacing:"1px", textTransform:"uppercase" }}>{lb}</label>
                  <input type={tp} placeholder={ph}
                    style={{ width:"100%", padding:"11px 14px", borderRadius:"10px",
                      border:`2px solid ${C.creme}33`, fontSize:"0.88rem",
                      background:`${C.noir}55`, color:C.creme, outline:"none", boxSizing:"border-box" }} />
                </div>
              ))}
              <div style={{ marginBottom:"1.5rem" }}>
                <label style={{ display:"block", fontSize:"0.68rem", fontWeight:800,
                  color:`${C.creme}cc`, marginBottom:"6px", letterSpacing:"1px", textTransform:"uppercase" }}>
                  Ce qui t'attire
                </label>
                <textarea placeholder="L'esthétique, la liberté créative, la rémunération..."
                  style={{ width:"100%", padding:"11px 14px", borderRadius:"10px",
                    border:`2px solid ${C.creme}33`, fontSize:"0.88rem",
                    background:`${C.noir}55`, color:C.creme, outline:"none",
                    minHeight:"85px", resize:"vertical", boxSizing:"border-box" }} />
              </div>
              <p style={{ fontSize:"0.71rem", color:`${C.creme}77`, marginBottom:"1.2rem", lineHeight:1.6 }}>
                🔒 Infos strictement confidentielles. Aucune photo requise.
              </p>
              <button onClick={() => setFormSent(true)}
                onMouseEnter={(e) => { e.currentTarget.style.transform="scale(1.04)"; e.currentTarget.style.boxShadow=`5px 5px 0 #000`; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow=`3px 3px 0 #000`; }}
                style={{ width:"100%", background:C.jaune, color:C.noir,
                  border:`2px solid ${C.noir}`, padding:"15px", borderRadius:"50px",
                  fontSize:"0.95rem", fontWeight:900, letterSpacing:"1px",
                  textTransform:"uppercase", cursor:"pointer",
                  boxShadow:`3px 3px 0 #000`,
                  transition:"all 0.2s cubic-bezier(.34,1.56,.64,1)" }}>
                Envoyer ma candidature 👠
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer style={{ background:C.noir, borderTop:`4px solid ${C.rose}`, padding:"1.8rem 2rem",
        display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"1rem" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.3rem" }}>
          <span style={{ fontWeight:900, color:C.rose }}>CROUSTI</span>
          <span style={{ fontWeight:900 }}>FR</span>
          <span style={{ animation:"floatBob 3s ease-in-out infinite", display:"inline-block" }}>👠</span>
        </div>
        <div style={{ display:"flex", gap:"1.5rem", flexWrap:"wrap" }}>
          {["Instagram","Email créatrices","Mentions légales","Confidentialité"].map((l) => (
            <a key={l} href="#" target="_blank"
              style={{ fontSize:"0.75rem", color:`${C.creme}66`, fontWeight:600, textDecoration:"none",
                transition:"color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color=C.rose)}
              onMouseLeave={(e) => (e.currentTarget.style.color=`${C.creme}66`)}>
              {l}
            </a>
          ))}
        </div>
        <span style={{ fontSize:"0.65rem", fontWeight:800, color:C.cerise,
          border:`1px solid ${C.cerise}55`, padding:"3px 10px", borderRadius:"20px" }}>18+</span>
      </footer>
    </div>
  );
}
