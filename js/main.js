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

    let lastScroll = 0;
    const threshold = 40;

    function onScroll() {
      const scrollY = window.scrollY;
      
      if (scrollY > threshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScroll = scrollY;
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
    }

    function closeMenu() {
      burger.classList.remove('active');
      menu.classList.remove('open');
      document.body.style.overflow = '';
      burger.setAttribute('aria-expanded', 'false');
    }

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
    });
  }

  // =====================
  // Smooth Scroll
  // =====================
  function initSmoothScroll() {
    const HEADER_HEIGHT = 80;
    
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        
        const top = target.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
        window.scrollTo({ top, behavior: 'smooth' });
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
