/* One persistent animation preference for the whole site. No animation frame loop. */
(function () {
  'use strict';
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let preference = null;
  try { preference = localStorage.getItem('nexora-motion'); } catch (_) {}
  const apply = () => {
    const enabled = preference === 'on' || (preference !== 'off' && !media.matches);
    root.dataset.motion = enabled ? 'on' : 'off';
    document.querySelectorAll('[data-motion-toggle]').forEach(button => {
      button.setAttribute('aria-pressed', String(enabled));
      button.setAttribute('aria-label', enabled ? 'Выключить анимацию на сайте' : 'Включить анимацию на сайте');
      const label = button.querySelector('[data-motion-label]');
      if (label) label.textContent = enabled ? 'Анимация включена' : 'Статичный режим';
    });
    document.querySelectorAll('[data-motion-status]').forEach(label => {
      label.textContent = enabled ? 'Процессы идут параллельно' : 'Все этапы показаны без движения';
    });
    window.dispatchEvent(new CustomEvent('nexora:motion', {detail:{enabled}}));
  };
  const init = () => {
    document.querySelectorAll('[data-motion-toggle]').forEach(button => button.addEventListener('click', () => {
      preference = root.dataset.motion === 'on' ? 'off' : 'on';
      try { localStorage.setItem('nexora-motion', preference); } catch (_) {}
      apply();
    }));
    apply();
  };
  media.addEventListener('change', apply);
  window.addEventListener('storage', event => {
    if (event.key === 'nexora-motion') {preference = event.newValue; apply();}
  });
  // Set the mode before the page's regular reveal animations initialize.
  apply();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
