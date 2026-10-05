(() => {
  const id = 'G-594VT4ZF4L';
  const key = 'danja-analytics-consent-v1';
  let loaded = false;
  const read = () => { try { const v = JSON.parse(localStorage.getItem(key)); return v && Date.now() - v.time < 180 * 86400000 ? v.choice : null; } catch { return null; } };
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  function start() {
    if (loaded) return;
    loaded = true;
    window['ga-disable-' + id] = false;
    gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    gtag('js', new Date());
    gtag('config', id, { allow_google_signals: false, allow_ad_personalization_signals: false, cookie_expires: 15552000, page_location: location.origin + location.pathname, page_referrer: document.referrer.split('?')[0].split('#')[0] });
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.append(tag);
  }
  function clearCookies() {
    document.cookie.split(';').forEach(item => {
      const name = item.trim().split('=')[0];
      if (!name.startsWith('_ga')) return;
      ['', location.hostname, '.' + location.hostname, '.danjamoeller.de'].forEach(domain => {
        document.cookie = name + '=; Max-Age=0; path=/' + (domain ? '; domain=' + domain : '') + '; SameSite=Lax';
      });
    });
  }
  function init() {
    const panel = document.createElement('section');
    panel.className = 'analytics-consent';
    panel.setAttribute('aria-label', 'Besucherstatistik und Cookies');
    panel.innerHTML = '<h2>Ein kleiner Blick hinter die Kulissen.</h2><p>Mit deiner Zustimmung nutze ich Google Analytics, um zu sehen, wie mein Portfolio besucht wird. Dafür werden Cookies und Nutzungsdaten verarbeitet, auch in den USA. Ohne Zustimmung bleibt die Statistik ausgeschaltet. <a href="datenschutz.html">Mehr zum Datenschutz</a></p><div class="analytics-consent-actions"><button type="button" data-choice="denied">Ablehnen</button><button type="button" data-choice="granted">Statistik erlauben</button></div>';
    document.body.append(panel);
    const settings = document.createElement('button');
    settings.type = 'button'; settings.className = 'analytics-settings'; settings.textContent = 'COOKIE-EINSTELLUNGEN';
    (document.querySelector('.legal-links') || document.querySelector('footer') || document.body).append(settings);
    settings.addEventListener('click', () => { panel.hidden = false; panel.querySelector('button').focus(); });
    panel.addEventListener('click', event => {
      const button = event.target.closest('[data-choice]'); if (!button) return;
      const choice = button.dataset.choice;
      try { localStorage.setItem(key, JSON.stringify({ choice, time: Date.now() })); } catch {}
      panel.hidden = true;
      if (choice === 'granted') start();
      else { window['ga-disable-' + id] = true; clearCookies(); if (loaded) location.reload(); }
    });
    window.addEventListener('storage', event => { if (event.key === key) location.reload(); });
    const choice = read(); panel.hidden = !!choice;
    if (choice === 'granted') start(); else { window['ga-disable-' + id] = true; clearCookies(); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
