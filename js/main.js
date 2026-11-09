/**
 * Nexora - Main JavaScript
 * Handles: header scroll, burger menu, smooth navigation, scroll animations.
 */

(function () {
  'use strict';

  // =====================
  // Header Scroll Effect
  // =====================
  function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    const content = header.querySelector('.container');
    if (content) {
      content.id = content.id || 'header-content';
      const toggle = document.createElement('button');
      toggle.className = 'header__visibility-toggle';
      toggle.type = 'button';
      toggle.setAttribute('aria-controls', content.id);
      toggle.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 14 6-6 6 6"/></svg>';
      const setCollapsed = collapsed => {
        header.classList.toggle('header--collapsed', collapsed);
        toggle.setAttribute('aria-expanded', String(!collapsed));
        const label = collapsed ? 'Показать шапку сайта' : 'Скрыть шапку сайта';
        toggle.setAttribute('aria-label', label);
        toggle.title = label;
        content.inert = collapsed;
        if (collapsed) content.setAttribute('aria-hidden', 'true');
        else content.removeAttribute('aria-hidden');
      };
      setCollapsed(false);
      toggle.addEventListener('click', () => setCollapsed(!header.classList.contains('header--collapsed')));
      header.append(toggle);
    }
    const threshold = 40;

    function onScroll() {
      const scrollY = window.scrollY;
      
      if (scrollY > threshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // =====================
  // Burger Menu
  // =====================
  function initBurger() {
    const burger = document.querySelector('.header__burger');
    const menu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu__overlay');
    const closeBtn = menu ? menu.querySelector('.mobile-menu__close') : null;
    const menuLinks = menu ? menu.querySelectorAll('a') : [];

    if (!burger || !menu) return;

    function openMenu() {
      burger.classList.add('active');
      menu.classList.add('open');
      document.body.style.overflow = 'hidden';
      burger.setAttribute('aria-expanded', 'true');
      menu.removeAttribute('inert');
      menu.setAttribute('aria-hidden', 'false');
      if (closeBtn) closeBtn.focus();
    }

    function closeMenu() {
      burger.classList.remove('active');
      menu.classList.remove('open');
      document.body.style.overflow = '';
      burger.setAttribute('aria-expanded', 'false');
      menu.setAttribute('inert', '');
      menu.setAttribute('aria-hidden', 'true');
      burger.focus();
    }

    menu.setAttribute('inert', '');
    menu.setAttribute('aria-hidden', 'true');

    burger.addEventListener('click', () => {
      if (menu.classList.contains('open')) closeMenu();
      else openMenu();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    menuLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
      if (e.key === 'Tab' && menu.classList.contains('open')) {
        const items = [...menu.querySelectorAll('a[href], button:not([disabled])')];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {e.preventDefault();last.focus();}
        else if (!e.shiftKey && document.activeElement === last) {e.preventDefault();first.focus();}
      }
    });
  }

  // =====================
  // Smooth Scroll
  // =====================
  function initSmoothScroll() {
    const HEADER_HEIGHT = 80;
    
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.getElementById(href.slice(1));
        if (!target) return;
        e.preventDefault();
        
        const top = target.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
        window.scrollTo({ top, behavior: document.documentElement.dataset.motion === 'off' || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      });
    });
  }

  // =====================
  // Scroll Animations
  // =====================
  function initScrollAnimations() {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.animate-fade-up').forEach(el => {
      observer.observe(el);
    });
  }

  // =====================
  // Scrollspy
  // =====================
  function initScrollspy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__nav a[href^="#"], .mobile-menu a[href^="#"]');
    
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
              link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
    );

    sections.forEach(s => observer.observe(s));
  }

  // =====================
  // Init all
  // =====================
  function init() {
    initHeader();
    initBurger();
    initSmoothScroll();
    initScrollAnimations();
    initScrollspy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
