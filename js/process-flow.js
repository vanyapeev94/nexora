/* All CSS animations share the same local time and pause together off screen. */
(function () {
  'use strict';
  const flow = document.querySelector('.pipeline');
  if (!flow) return;
  let visible = true;
  let elapsed = 0;
  let initialized = false;
  let animations = [];
  const enabled = () => document.documentElement.dataset.motion === 'on';
  const sync = (reset = false) => {
    if (!enabled()) {animations = []; elapsed = 0; initialized = false; return;}
    const current = flow.getAnimations({subtree:true});
    if (reset || !initialized || current.some(animation => !animations.includes(animation))) {
      animations = current;
      animations.forEach(animation => {animation.pause(); animation.currentTime = elapsed;});
      initialized = true;
    }
    const playing = visible && !document.hidden;
    animations.forEach(animation => playing ? animation.play() : animation.pause());
    flow.dataset.playing = String(playing);
  };
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (animations[0] && animations[0].currentTime !== null) elapsed = Number(animations[0].currentTime);
    sync();
  }, {rootMargin:'100px'});
  observer.observe(flow);
  document.addEventListener('visibilitychange', () => sync());
  window.addEventListener('nexora:motion', () => {elapsed = 0;sync(true);});
  window.addEventListener('load', () => sync(true), {once:true});
  sync(true);
})();
