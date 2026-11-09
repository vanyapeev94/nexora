/**
 * Nexora - Portfolio
 * On desktop: CSS grid layout
 * On mobile: native scroll-snap carousel
 * This module adds navigation dots and arrow buttons.
 */

(function () {
  'use strict';

  function initPortfolio() {
    const grid = document.querySelector('.portfolio-grid');
    if (!grid) return;

    // Add scroll indicator / navigation for mobile scroll-snap
    const cards = grid.querySelectorAll('.portfolio-card');
    if (!cards.length) return;

    // Create dot navigation
    const dots = document.createElement('div');
    dots.className = 'portfolio-dots';
    dots.setAttribute('aria-label', 'Навигация портфолио');
    
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'portfolio-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Проект ${i + 1}`);
      dot.addEventListener('click', () => {
        const card = cards[i];
        card.scrollIntoView({ behavior: document.documentElement.dataset.motion === 'off' || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest', inline: 'start' });
      });
      dots.appendChild(dot);
    });
    
    grid.parentNode.insertBefore(dots, grid.nextSibling);

    // Update active dot on scroll
    let scrollTimer;
    grid.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const gridRect = grid.getBoundingClientRect();
        let activeIndex = 0;
        let minDist = Infinity;
        
        cards.forEach((card, i) => {
          const rect = card.getBoundingClientRect();
          const dist = Math.abs(rect.left - gridRect.left);
          if (dist < minDist) {
            minDist = dist;
            activeIndex = i;
          }
        });
        
        dots.querySelectorAll('.portfolio-dot').forEach((dot, i) => {
          dot.classList.toggle('active', i === activeIndex);
        });
      }, 50);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
  } else {
    initPortfolio();
  }

})();
