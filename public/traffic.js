(() => {
  const { id, section } = document.currentScript.dataset;
  const key = 'unravel-analytics-consent';
  let preference;
  try { preference = localStorage.getItem(key); } catch { /* Storage can be disabled. */ }
  let started = false;
  const settings = document.createElement('button');
  settings.type = 'button';
  settings.textContent = 'Analytics preferences';
  (document.querySelector('.uc-footer-bottom') || document.body).append(settings);

  const panel = document.createElement('section');
  panel.setAttribute('aria-label', 'Analytics preferences');
  panel.className = 'uc-analytics';
  panel.innerHTML = '<p>Allow Google Analytics to use cookies to measure visits across site sections and clicks to book or contact us?</p><button type="button" data-choice="allow">Allow</button> <button type="button" data-choice="decline">Decline</button>';
  document.body.append(panel);
  panel.hidden = preference === 'allow' || preference === 'decline';
  settings.onclick = () => {
    panel.hidden = false;
    panel.querySelector('button').focus();
  };

  window.dataLayer = window.dataLayer || [];
  function tag() { window.dataLayer.push(arguments); }
  function start() {
    if (started) return;
    started = true;
    tag('consent', 'default', {
      analytics_storage: 'granted', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    tag('js', new Date());
    tag('config', id, {
      page_location: location.origin + '/' + section,
      page_title: section, page_referrer: '', content_group: section,
      allow_google_signals: false, allow_ad_personalization_signals: false
    });
    const script = document.createElement('script');
    script.async = true;
    script.referrerPolicy = 'no-referrer';
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.append(script);
  }
  if (preference === 'allow') start();

  function disable() {
    window['ga-disable-' + id] = true;
    for (const item of document.cookie.split(';')) {
      const name = item.trim().split('=')[0];
      if (name === '_ga' || name.startsWith('_ga_')) {
        document.cookie = name + '=; Max-Age=0; Path=/';
        document.cookie = name + '=; Max-Age=0; Path=/; Domain=' + location.hostname;
      }
    }
  }
  panel.onclick = event => {
    const choice = event.target.dataset.choice;
    if (!choice) return;
    preference = choice;
    try { localStorage.setItem(key, choice); } catch { /* Apply to this page only. */ }
    panel.hidden = true;
    settings.focus({ preventScroll: true });
    if (choice === 'allow') {
      window['ga-disable-' + id] = false;
      start();
    } else disable();
  };
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) location.reload();
  });
  document.addEventListener('click', event => {
    if (preference !== 'allow') return;
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    let action;
    if (link.hostname === 'unravelcounselling.janeapp.com') action = 'booking_click';
    if (link.protocol === 'mailto:') action = 'email_click';
    if (link.protocol === 'tel:') action = 'phone_click';
    if (action) tag('event', action, { content_group: section });
  }, true);
})();
