    /* ─ Données ─────────────────────────────────────────────────────────────── */
    const C = {
      noir:'#09070A', rose:'#FF4FA3', cerise:'#E51D4E',
      jaune:'#FFD84D', bleu:'#1E7BFF', violet:'#8B3DFF', creme:'#FFF1D6'
    };
    const ink = bg => (bg===C.jaune||bg===C.creme) ? C.noir : C.creme;

    const SEGMENTS = [
      { emoji:'🍭', label:'La Pop\nCurieuse',       age:'18 – 30 ans',
        bg:C.rose,
        hook:'Tu joues déjà.\nOn veut\nta légèreté.',
        traits:["À l'aise en lingerie","Mise en scène instinctive","Look soigné naturellement","Aime jouer avec la caméra"],
        formats:["Drôle d'Envie","Le Menu Crousti","Crousti Talons"],
        pitch:"Tu n'as pas besoin qu'on t'explique comment poser — tu le fais déjà. Shooting en lingerie colorée, mises en scène pop, jeu avec le regard : c'est toi le cœur de Crousti FR. On cherche ta légèreté, pas ta perfection.",
        not:"Pas pour les profils dark, dramatiques ou qui posent en mode catalogue sans vie." },
      { emoji:'💋', label:"L'Attitude\nAssumée",    age:'25 ans et +',
        bg:C.violet,
        hook:'Ton corps.\nTon territoire.\nTu sais.',
        traits:["Porte des talons naturellement","Pose sans directive","Regard caméra ancré","Corps habité pas subi"],
        formats:["Crousti Talons","Clac Club","After Crousti"],
        pitch:"On cherche cette façon d'être dans le cadre sans l'expliquer — le talon posé comme une signature, le regard qui ne demande rien. À 35, 40 ou 45 ans cette présence est souvent plus forte qu'à 20. Pas malgré l'âge. Grâce à lui.",
        not:"Pas pour les postures 'domination froide' ou glacée. Ce profil joue l'assurance incarnée, pas la provocation calculée." },
      { emoji:'🌺', label:'La Complicité\nOuverte', age:'18+ · tous âges',
        bg:C.bleu,
        hook:'Ce que tu es.\nPas ce que\ntu crois devoir être.',
        traits:["Naturelle sans effort","Morphologie assumée","Chaleur qui passe à l'image","Fait vivre le cadre"],
        formats:["Pop Room","Le Menu Crousti","Curiosités FR"],
        pitch:"Ce n'est pas une case diversité — c'est un profil à part entière. Shooting nu ou en lingerie, toutes morphologies, tous âges. Ce qu'on capture ici c'est la chaleur vraie, la connivence spontanée avec l'objectif. Ça ne se simule pas.",
        not:"Ce profil n'est pas une tolérance. C'est une force distincte. Pas pour celles qui posent en s'excusant." },
      { emoji:'🦋', label:"L'Originale\nDécalée",  age:'18+ · profil atypique',
        bg:C.cerise,
        hook:'Ton style\nte précède.\nOn veut le reste.',
        traits:["Tatouages ou piercings assumés","Univers visuel propre","Déteste le générique","Style avant le corps"],
        formats:["Crousti Lab","Curiosités FR","Bonbon Noir"],
        pitch:"Tatouages couvrants, style ultra-personnel, esthétique qui ne ressemble à rien d'autre — c'est exactement ce qu'on cherche. On ne normalise pas ce que tu es. On en fait des shootings photo et vidéo qui sortent du lot.",
        not:"Pas pour les profils qui veulent 'être originaux' sans maîtrise esthétique réelle. L'univers doit être là avant le shooting." },
      { emoji:'🍒', label:"L'Énergique\nPop",      age:'18+ · tempérament',
        bg:C.jaune,
        hook:"L'ambiance\ntu la mets.\nOn la capte.",
        traits:["Visage qui s'anime seul","Rit pour de vrai","Bouge avant qu'on le demande","Fait monter le plateau"],
        formats:["Pop Room","Drôle d'Envie","Clac Club"],
        pitch:"Visage expressif, rire communicatif, corps en mouvement naturel. En shooting photo ou vidéo érotique, l'énergie de plateau ça change tout. Si tu entres dans une pièce et que l'ambiance monte — c'est toi qu'on cherche.",
        not:"Pas pour les profils posés ou trop dans leur tête. L'énergie doit être là d'entrée, pas jouée." },
    ];

    const STEPS = [
      {num:'01', color:C.rose,   icon:'✉️', t:'Postule en 2 min',         d:'Prénom ou pseudo, âge, zone géo. Aucune photo à ce stade.'},
      {num:'02', color:C.violet, icon:'💬', t:'On se parle',               d:'Message ou visio, à ton choix. Contrat, conditions, questions.'},
      {num:'03', color:C.bleu,   icon:'🎭', t:'On construit ton univers',  d:'Quel profil, quels formats, quelles limites. Tu valides tout.'},
      {num:'04', color:C.jaune,  icon:'📸', t:'Le tournage',               d:'Ambiance pro et détendue. Tu stoppes quand tu veux.'},
      {num:'05', color:C.cerise, icon:'✅', t:'Tu valides tout',           d:'Chaque image te passe par les mains avant publication.'},
      {num:'06', color:C.rose,   icon:'💸', t:'Payée sous 48h',            d:'Tarif fixé à l'avance. Rien ne bouge sans accord écrit.'},
    ];

    const GARANTIES = [
      {icon:'📄', bg:C.rose,   t:'Contrat avant tout',  d:'Droits à l\'image, durée, usages : tout écrit avant de commencer.'},
      {icon:'🔒', bg:C.violet, t:'Anonymat garanti',     d:'Pseudo, angles validés, visage masquable, données jamais publiées. Aucune traçabilité vers ton identité réelle, ton réseau professionnel ou ton entourage personnel.'},
      {icon:'🛑', bg:C.bleu,   t:'Droit de retrait',     d:'Tu retires n\'importe quel contenu à tout moment. Traitement 24h.'},
      {icon:'💸', bg:C.cerise, t:'Rémunération fixe',    d:'Tarif par session défini avant, bonus sur performance.'},
      {icon:'✅', bg:C.noir,   t:'Tu valides tout',      d:'Chaque image te passe par les mains avant publication.'},
      {icon:'🤝', bg:C.rose,   t:'Relation long terme',  d:'On cherche des collaboratrices régulières, pas des one-shot.'},
    ];

    const TEMOS = [
      { init:'L', profil:'La Pop Curieuse',             couleur:C.rose,   bg:C.noir,   univers:"Drôle d'Envie · Crousti Talons", rot:'-1deg',
        txt:"J'avais peur que ce soit comme les autres. Le premier appel m'a rassurée en 10 min. Contrat clair, tournage sérieux et détendu. Je suis revenue 4 fois." },
      { init:'M', profil:"L'Originale Décalée",         couleur:C.cerise, bg:C.violet, univers:"Crousti Lab · Bonbon Noir",       rot:'1.5deg',
        txt:"Mon style est très marqué. Ils ne l'ont pas normalisé — ils l'ont mis en valeur. Je me suis sentie utilisée pour ce que je suis vraiment." },
      { init:'C', profil:"L'Attitude Assumée · 42 ans", couleur:C.violet, bg:C.jaune,  univers:"Crousti Talons · Clac Club",      rot:'-0.5deg',
        txt:"J'avais peur d'arriver là et qu'on me dise poliment que j'étais trop vieille. C'est l'inverse qui s'est passé. Ma façon d'être dans le cadre, ils l'ont cherchée — pas tolérée." },
    ];

    const FAQ = [
      {q:"Je dois avoir de l'expérience ?",          r:"Non. L'attitude prime sur le CV. On t'accompagne si tu démarres."},
      {q:"Puis-je faire masquer mon visage ?",        r:"Oui, totalement. On définit ensemble les angles avant le tournage."},
      {q:"Comment est fixée la rémunération ?",       r:"Tarif par session défini avant, par écrit. Bonus transparents sur perf."},
      {q:"Et si je veux arrêter en cours ?",          r:"Tu stoppes, on s'arrête. Aucun contenu non validé ne sera publié."},
      {q:"Mon entourage peut-il tomber dessus ?",     r:"Pseudo, géo cachée, pas de référencement nominatif. On en parle ensemble."},
      {q:"Je ne rentre dans aucun profil ?",          r:"Le tableau est un guide. Postule, on voit ensemble."},
      {q:"À 40 ans, est-ce que j'ai vraiment ma place ici ?",
        r:"Oui — et pas par tolérance. L'assurance, la façon d'habiter son corps, la présence dans le cadre : tout ça s'acquiert avec le temps. Ce que tu apportes à 40 ans, une 22 ans ne peut pas le simuler. C'est une valeur réelle, pas un quota."},
      {q:"J'ai un réseau pro établi. Comment vous gérez la discrétion ?",
        r:"On en parle précisément à l'étape 2, avant tout engagement. Pseudo, géo masquée, absence de référencement nominatif, paramétrage des accès : chaque mesure est discutée avec toi et documentée dans le contrat. Rien n'est publié sans que tu aies validé chaque détail."},
      {q:"Mon corps n'est pas celui des magazines. Vous cherchez vraiment ça ?",
        r:"On cherche une façon d'être dans le cadre, pas une silhouette. Le physique 'standard' n'est pas notre territoire — la curiosité, l'authenticité et la présence le sont. Si tu doutes, postule quand même. On te dira honnêtement ce qu'on voit."},
    ];

    /* ─ Smooth scroll helper ─────────────────────────────────────────────────── */
    function scrollTo(id) {
      document.getElementById(id)?.scrollIntoView({ behavior:'smooth' });
    }

    /* ─ Ticker ───────────────────────────────────────────────────────────────── */
    function buildTicker(id, items) {
      const track = document.getElementById(id);
      const all = [...items, ...items];
      track.innerHTML = all.map(t => `<span class="ticker-item">${t}</span>`).join('');
    }
    buildTicker('ticker1', ['🌸 LA POP CURIEUSE','👠 L\'ATTITUDE ASSUMÉE','🤝 LA COMPLICITÉ OUVERTE','🔮 L\'ORIGINALE DÉCALÉE','⚡ L\'ÉNERGIQUE POP']);
    buildTicker('ticker2', ['📄 CONTRAT AVANT TOUT','🔒 ANONYMAT GARANTI','💸 PAYÉE SOUS 48H','✅ TU VALIDES TOUT','🛑 DROIT DE RETRAIT','🤝 RELATION LONG TERME']);

    /* ─ Segments ─────────────────────────────────────────────────────────────── */
    let activeSeg = null;
    const cardsGrid = document.getElementById('seg-cards');
    const detailArea = document.getElementById('seg-detail-area');

    SEGMENTS.forEach((s, i) => {
      const card = document.createElement('div');
      card.className = 'seg-card rv-pop';
      card.dataset.delay = i * 80;
      card.innerHTML = `
        <div class="seg-emoji">${s.emoji}</div>
        <div class="seg-name">${s.label.replace('\n','<br>')}</div>
        <div class="seg-age">${s.age}</div>
      `;
      card.addEventListener('click', () => toggleSeg(i, card, s));
      cardsGrid.appendChild(card);
    });

    function toggleSeg(i, card, s) {
      const cards = cardsGrid.querySelectorAll('.seg-card');
      if (activeSeg === i) {
        activeSeg = null;
        cards.forEach(c => {
          c.classList.remove('active');
          c.style.background = '#fff';
          c.style.color = '';
          c.querySelector('.seg-name').style.color = '';
          c.querySelector('.seg-age').style.color = '';
        });
        detailArea.innerHTML = '<div class="seg-placeholder">← Clique sur un profil pour voir le détail</div>';
        return;
      }
      activeSeg = i;
      cards.forEach((c, ci) => {
        const seg = SEGMENTS[ci];
        c.classList.remove('active');
        c.style.background = '#fff';
        c.querySelector('.seg-name').style.color = '';
        c.querySelector('.seg-age').style.color = '';
      });
      card.classList.add('active');
      card.style.background = s.bg;
      card.querySelector('.seg-name').style.color = ink(s.bg);
      card.querySelector('.seg-age').style.color = ink(s.bg) + 'aa';

      const textColor = ink(s.bg);
      const traits = s.traits.map(t => `<span class="trait-pill" style="background:${C.noir};color:${s.bg}">${t}</span>`).join('');
      const formats = s.formats.map(f => `<span class="fmt-pill" style="color:${textColor}">${f}</span>`).join('');
      detailArea.innerHTML = `
        <div class="seg-detail visible-panel" style="background:${s.bg}">
          <div class="seg-detail-top">
            <div class="seg-detail-emoji-big">${s.emoji}</div>
            <div>
              <div class="seg-detail-title" style="color:${textColor}">${s.label.replace('\n','<br>')}</div>
              <div class="seg-detail-hook" style="color:${textColor}">"${s.hook.replace(/\n/g,'<br>')}"</div>
            </div>
          </div>
          <div class="seg-detail-body">
            <div>
              <p class="seg-pitch" style="color:${textColor}">${s.pitch}</p>
              <div class="seg-not-box">
                <span class="sec-label" style="color:${textColor}88;font-size:.6rem">Ce que ce n'est pas</span>
                <p class="seg-not-text" style="color:${textColor}">${s.not}</p>
              </div>
            </div>
            <div>
              <div style="margin-bottom:1.5rem">
                <span class="sec-label" style="color:${textColor}88;font-size:.6rem">Tes traits</span>
                <div class="seg-traits">${traits}</div>
              </div>
              <div>
                <span class="sec-label" style="color:${textColor}88;font-size:.6rem">Tes formats</span>
                <div class="seg-formats">${formats}</div>
              </div>
            </div>
          </div>
          <div class="seg-detail-footer">
            <button class="btn-postuler-seg" style="color:${s.bg}" onclick="scrollTo('postuler')">
              Postuler comme ${s.label.replace('\n',' ')} →
            </button>
          </div>
        </div>
      `;
    }

    /* ─ Process ──────────────────────────────────────────────────────────────── */
    const processGrid = document.getElementById('process-grid');
    STEPS.forEach((s, i) => {
      const even = i % 2 === 0;
      const bg   = even ? s.color : C.noir;
      const col  = even ? ink(s.color) : s.color;
      const step = document.createElement('div');
      step.className = `process-step ${even ? 'rv-left' : 'rv-right'}`;
      step.dataset.delay = i * 70;
      step.style.background = bg;
      if (i >= 3) step.style.borderTop = 'none';
      step.innerHTML = `
        <div class="step-num" style="color:${even ? col+'22' : col+'55'}">${s.num}</div>
        <div class="step-icon">${s.icon}</div>
        <div class="step-title" style="color:${col}">${s.t}</div>
        <p class="step-desc" style="color:${even ? col+'cc' : C.creme+'88'}">${s.d}</p>
      `;
      processGrid.appendChild(step);
    });

    /* ─ Garanties ────────────────────────────────────────────────────────────── */
    const garGrid = document.getElementById('garanties-grid');
    GARANTIES.forEach((g, i) => {
      const col = ink(g.bg);
      const card = document.createElement('div');
      card.className = 'gar-card rv-pop';
      card.dataset.delay = i * 80;
      card.style.background = g.bg;
      card.innerHTML = `
        <div class="gar-icon">${g.icon}</div>
        <div class="gar-title" style="color:${col}">${g.t}</div>
        <p class="gar-desc" style="color:${col}cc">${g.d}</p>
      `;
      garGrid.appendChild(card);
    });

    /* ─ Témoignages ──────────────────────────────────────────────────────────── */
    const temoGrid = document.getElementById('temo-grid');
    TEMOS.forEach((tm, i) => {
      const col = ink(tm.bg);
      const card = document.createElement('div');
      card.className = 'temo-card rv-pop';
      card.dataset.delay = i * 100;
      card.style.background = tm.bg;
      card.style.transform = `rotate(${tm.rot})`;
      card.innerHTML = `
        <div class="temo-quote-mark" style="color:${tm.couleur}">"</div>
        <p class="temo-text" style="color:${col}">${tm.txt}</p>
        <div class="temo-sep">
          <div class="temo-avatar" style="background:${tm.couleur};color:${ink(tm.couleur)}">${tm.init}</div>
          <div>
            <div class="temo-profil" style="color:${col}">${tm.profil}</div>
            <div class="temo-univers" style="color:${col}">${tm.univers}</div>
          </div>
        </div>
      `;
      temoGrid.appendChild(card);
    });

    /* ─ FAQ ──────────────────────────────────────────────────────────────────── */
    const faqList = document.getElementById('faq-list');
    FAQ.forEach((item, i) => {
      const el = document.createElement('div');
      el.className = 'faq-item rv-left';
      el.dataset.delay = i * 60;
      el.innerHTML = `
        <button class="faq-btn" onclick="toggleFaq(${i})">
          <span class="faq-q">${item.q}</span>
          <span class="faq-icon" id="faq-icon-${i}">+</span>
        </button>
        <div class="faq-answer" id="faq-ans-${i}">
          <p class="faq-r">${item.r}</p>
        </div>
      `;
      faqList.appendChild(el);
    });

    let openFaq = null;
    function toggleFaq(i) {
      const items = document.querySelectorAll('.faq-item');
      if (openFaq === i) {
        items[i].classList.remove('open');
        document.getElementById('faq-icon-'+i).textContent = '+';
        openFaq = null;
        return;
      }
      if (openFaq !== null) {
        items[openFaq].classList.remove('open');
        document.getElementById('faq-icon-'+openFaq).textContent = '+';
      }
      openFaq = i;
      items[i].classList.add('open');
      document.getElementById('faq-icon-'+i).textContent = '−';
    }

    /* ─ Formulaire ───────────────────────────────────────────────────────────── */
    // ⬇️ REMPLACER PAR L'URL DE TON GOOGLE APPS SCRIPT APRÈS DÉPLOIEMENT
    const APPS_SCRIPT_URL = 'REMPLACER_PAR_TON_URL_APPS_SCRIPT';

    async function submitForm() {
      const prenom = document.getElementById('f-prenom').value.trim();
      const age    = document.getElementById('f-age').value.trim();
      const email  = document.getElementById('f-email').value.trim();
      const profil = document.getElementById('f-profil').value;
      const zone   = document.getElementById('f-zone').value.trim();
      const motiv  = document.getElementById('f-motivation').value.trim();
      const errEl  = document.getElementById('form-error');
      const btn    = document.getElementById('btn-submit');

      // Validation
      if (!prenom || !age || !email) {
        errEl.classList.add('visible');
        if (!prenom) document.getElementById('f-prenom').classList.add('error');
        if (!age)    document.getElementById('f-age').classList.add('error');
        if (!email)  document.getElementById('f-email').classList.add('error');
        return;
      }
      errEl.classList.remove('visible');
      btn.disabled = true;
      btn.textContent = 'Envoi en cours...';

      try {
        await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: new Date().toLocaleString('fr-FR'),
            prenom, age, profil, zone, email, motivation: motiv
          })
        });
      } catch(e) { /* no-cors — on considère envoyé */ }

      document.getElementById('form-box').style.display = 'none';
      document.getElementById('form-success').classList.add('visible');
    }

    /* ─ Scroll Reveal ────────────────────────────────────────────────────────── */
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || 0);
          setTimeout(() => el.classList.add('visible'), delay);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.rv-up, .rv-left, .rv-right, .rv-pop').forEach(el => obs.observe(el));
