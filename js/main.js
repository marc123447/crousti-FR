// ─ Smooth scroll
function goto(id){ document.getElementById(id).scrollIntoView({behavior:'smooth'}); }

// ─ Segments
var currentSeg = null;
function openSeg(i){
  var cards = document.querySelectorAll('.seg-card');
  var panels = document.querySelectorAll('.seg-panel');
  var ph = document.getElementById('seg-placeholder');
  if(currentSeg === i){
    cards[i].classList.remove('active');
    cards[i].style.background = '';
    panels[i].classList.remove('show');
    ph.style.display = '';
    currentSeg = null;
    return;
  }
  cards.forEach(function(c){ c.classList.remove('active'); c.style.background = ''; });
  panels.forEach(function(p){ p.classList.remove('show'); });
  cards[i].classList.add('active');
  panels[i].classList.add('show');
  ph.style.display = 'none';
  currentSeg = i;
}

// ─ FAQ accordion
function toggleFaq(btn){
  var item = btn.parentElement;
  var icon = btn.querySelector('.faq-icon');
  var isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function(el){
    el.classList.remove('open');
    el.querySelector('.faq-icon').textContent = '+';
  });
  if(!isOpen){
    item.classList.add('open');
    icon.textContent = '−';
  }
}

// ─ Formulaire — remplace l'URL ci-dessous après déploiement Apps Script
var APPS_SCRIPT_URL = 'REMPLACER_PAR_TON_URL_APPS_SCRIPT';

function submitForm(){
  var prenom = document.getElementById('f-prenom').value.trim();
  var age    = document.getElementById('f-age').value.trim();
  var email  = document.getElementById('f-email').value.trim();
  var profil = document.getElementById('f-profil').value;
  var zone   = document.getElementById('f-zone').value.trim();
  var motiv  = document.getElementById('f-motivation').value.trim();
  var errEl  = document.getElementById('form-err');
  var btn    = document.getElementById('btn-submit');

  document.querySelectorAll('.form-input,.form-select').forEach(function(el){ el.classList.remove('err'); });

  if(!prenom || !age || !email){
    errEl.classList.add('show');
    if(!prenom) document.getElementById('f-prenom').classList.add('err');
    if(!age)    document.getElementById('f-age').classList.add('err');
    if(!email)  document.getElementById('f-email').classList.add('err');
    return;
  }
  errEl.classList.remove('show');
  btn.disabled = true;
  btn.textContent = 'Envoi en cours...';

  var payload = JSON.stringify({
    date: new Date().toLocaleString('fr-FR'),
    prenom: prenom, age: age, profil: profil,
    zone: zone, email: email, motivation: motiv
  });

  fetch(APPS_SCRIPT_URL, {
    method:'POST', mode:'no-cors',
    headers:{'Content-Type':'application/json'},
    body: payload
  }).catch(function(){}).finally(function(){
    document.getElementById('form-box').style.display = 'none';
    document.getElementById('form-success').classList.add('show');
  });
}

// ─ Scroll Reveal (progressive enhancement)
document.body.classList.add('js');
var revealObs = new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(e.isIntersecting){
      var el = e.target;
      var d  = parseInt(el.dataset.d || 0);
      setTimeout(function(){ el.classList.add('in'); }, d);
      revealObs.unobserve(el);
    }
  });
}, {threshold:0.1});

document.querySelectorAll('.rv').forEach(function(el,i){
  el.dataset.d = (el.dataset.d || 0);
  revealObs.observe(el);
});
// Delay stagger for grids
document.querySelectorAll('.seg-card.rv').forEach(function(el,i){ el.dataset.d = i*80; });
document.querySelectorAll('.gar-card.rv').forEach(function(el,i){ el.dataset.d = i*80; });
document.querySelectorAll('.temo-card.rv').forEach(function(el,i){ el.dataset.d = i*100; });
document.querySelectorAll('.faq-item.rv').forEach(function(el,i){ el.dataset.d = i*50; });
document.querySelectorAll('.step.rv').forEach(function(el,i){      el.dataset.d = i*70; });
