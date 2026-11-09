/**
 * Nexora - Comparison Slider (Before / After)
 * Uses Pointer Events API for unified mouse + touch support.
 * Clip-path technique for the 'after' layer masking.
 */

(function () {
  'use strict';

  class ComparisonSlider {
    constructor(el) {
      this.el = el;
      this.after = el.querySelector('.comparison-slider__after');
      this.divider = el.querySelector('.comparison-slider__divider');
      this.handle = el.querySelector('.comparison-slider__handle');
      this.isDragging = false;
      this.currentPosition = 50; // percent
      this.rafId = null;
      this.pendingX = null;

      this.init();
    }

    init() {
      // Keyboard support
      this.handle.setAttribute('role', 'slider');
      this.handle.setAttribute('aria-label', 'Сравнить минимализм и максимализм одного сайта');
      this.handle.setAttribute('aria-valuemin', '0');
      this.handle.setAttribute('aria-valuemax', '100');
      this.handle.setAttribute('aria-valuenow', '50');
      this.handle.setAttribute('tabindex', '0');

      // Pointer events for drag (unified mouse + touch)
      this.handle.addEventListener('pointerdown', this.onPointerDown.bind(this));
      this.el.addEventListener('pointerdown', this.onContainerClick.bind(this));
      
      // Keyboard
      this.handle.addEventListener('keydown', this.onKeyDown.bind(this));

      // Initial render
      this.setPosition(50, false);
    }

    getPercent(clientX) {
      const rect = this.el.getBoundingClientRect();
      let percent = ((clientX - rect.left) / rect.width) * 100;
      return Math.max(2, Math.min(98, percent));
    }

    setPosition(percent, animate) {
      this.currentPosition = percent;
      
      if (animate !== false) {
        this.divider.style.transition = 'left 40ms linear';
      } else {
        this.divider.style.transition = 'none';
      }

      this.divider.style.left = percent + '%';
      this.handle.style.left = percent + '%';
      this.after.style.clipPath = `inset(0 0 0 ${percent}%)`;
      this.handle.setAttribute('aria-valuenow', Math.round(percent));
      this.handle.setAttribute('aria-valuetext', `Минимализм: ${Math.round(percent)}%, максимализм: ${100 - Math.round(percent)}%`);
    }

    onPointerDown(e) {
      e.preventDefault();
      this.isDragging = true;
      this.handle.setPointerCapture(e.pointerId);
      
      this.onPointerMoveBound = this.onPointerMove.bind(this);
      this.onPointerUpBound = this.onPointerUp.bind(this);
      
      this.handle.addEventListener('pointermove', this.onPointerMoveBound);
      this.handle.addEventListener('pointerup', this.onPointerUpBound);
      this.handle.addEventListener('pointercancel', this.onPointerUpBound);
    }

    onPointerMove(e) {
      if (!this.isDragging) return;
      e.preventDefault();
      this.pendingX = e.clientX;
      
      if (!this.rafId) {
        this.rafId = requestAnimationFrame(() => {
          this.setPosition(this.getPercent(this.pendingX), false);
          this.rafId = null;
        });
      }
    }

    onPointerUp(e) {
      this.isDragging = false;
      this.handle.removeEventListener('pointermove', this.onPointerMoveBound);
      this.handle.removeEventListener('pointerup', this.onPointerUpBound);
      this.handle.removeEventListener('pointercancel', this.onPointerUpBound);
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    onContainerClick(e) {
      // Only respond to clicks outside the handle
      if (e.target === this.handle || this.handle.contains(e.target)) return;
      if (this.isDragging) return;
      const percent = this.getPercent(e.clientX);
      this.setPosition(percent, true);
    }

    onKeyDown(e) {
      const step = e.shiftKey ? 10 : 2;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.setPosition(Math.max(2, this.currentPosition - step), true);
      } else if (e.key === 'Home' || e.key === 'End') {
        e.preventDefault();
        this.setPosition(e.key === 'Home' ? 2 : 98, false);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.setPosition(Math.min(98, this.currentPosition + step), true);
      }
    }
  }

  // Initialize all sliders on page
  function initSliders() {
    document.querySelectorAll('.comparison-slider').forEach(el => {
      new ComparisonSlider(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSliders);
  } else {
    initSliders();
  }

  // Export for external use
  window.ComparisonSlider = ComparisonSlider;

})();
