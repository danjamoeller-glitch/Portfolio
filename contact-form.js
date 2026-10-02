
(() => {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;
  function showStatus(message, state) {
    status.textContent = message;
    status.dataset.state = state;
    if (state === 'success' || state === 'error') {
      status.focus({preventScroll:true});
      status.scrollIntoView({block:'nearest', behavior:'smooth'});
    }
  }
  const button = form.querySelector('button[type="submit"]');
  const endpoint = form.dataset.endpoint || '';
  const ready = /^https:\/\/form\.taxi\/s\/[A-Za-z0-9_-]+$/.test(endpoint);
  if (ready) {
    form.action = endpoint;
    form.querySelector('.form-delivery-note').textContent = 'Deine Angaben werden über Form.taxi verschlüsselt zur Bearbeitung deiner Anfrage übertragen.';
  }
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (button.disabled || !form.reportValidity()) return;
    if (!ready) {
      showStatus('Der Formularversand ist noch nicht aktiviert. Bitte schreib an danja.moeller@gmx.de. Deine Eingaben wurden nicht versendet.', 'error');
      return;
    }
    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    showStatus('Deine Nachricht wird gesendet …', 'sending');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(endpoint, {method: 'POST', body: new FormData(form), headers: {Accept: 'application/json'}, signal: controller.signal});
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error('delivery');
      showStatus('✓ Vielen Dank! Deine Nachricht wurde erfolgreich gesendet.', 'success');
      form.reset();
    } catch (error) {
      showStatus('Die Übermittlung konnte nicht bestätigt werden. Deine Eingaben bleiben erhalten. Bitte versuche es später erneut oder schreib an danja.moeller@gmx.de.', 'error');
    } finally {
      clearTimeout(timeout);
      button.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });
})();
