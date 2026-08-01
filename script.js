(function(){
  const ageGate = document.getElementById('ageGate');
  const enterSite = document.getElementById('enterSite');
  const leaveSite = document.getElementById('leaveSite');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.querySelector('.nav');
  const form = document.getElementById('applicationForm');
  const status = document.getElementById('formStatus');

  if (localStorage.getItem('croustiAgeConfirmed') === 'true') ageGate.classList.add('hidden');
  enterSite.addEventListener('click', () => { localStorage.setItem('croustiAgeConfirmed', 'true'); ageGate.classList.add('hidden'); });
  leaveSite.addEventListener('click', () => { window.location.href = 'https://www.google.com'; });
  menuToggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuToggle.setAttribute('aria-expanded', open); });
  document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', () => { nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); }));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = 'Merci, votre candidature est prête à être transmise. Connectez ce formulaire à votre outil de réception pour recevoir les messages.';
    status.style.color = '#d14f72';
    form.reset();
  });
})();
