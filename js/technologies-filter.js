/**
 * Nexora — Technologies Filter (Isotope edition)
 *
 * Использует библиотеку Isotope (fitRows layout mode) для анимированной
 * фильтрации карточек технологий при клике на вкладки.
 *
 * Зависимость: assets/vendor/isotope.pkgd.min.js  (подключается в index.html ДО этого скрипта)
 */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /*  Данные                                                              */
  /* ------------------------------------------------------------------ */

  // Все технологии (порядок = порядок карточек в сетке)
  const ALL_TECHS = [
    'figma', 'html5', 'css3', 'js', 'typescript',
    'react', 'vue', 'php', 'laravel', 'python',
    'nodejs', 'postgresql', 'mysql', 'mongodb', 'redis',
    'docker', 'aws', 'git', 'nextjs', 'vercel'
  ];

  // Принадлежность технологии к категориям (одна технология может быть в нескольких)
  const TECH_CATEGORIES = {
    figma:      ['landing', 'card'],
    html5:      ['landing', 'card'],
    css3:       ['landing', 'card'],
    js:         ['shop', 'landing', 'card'],
    typescript: ['shop', 'corporate'],
    react:      ['shop', 'corporate'],
    vue:        ['corporate'],
    php:        ['shop', 'card', 'forum', 'corporate'],
    laravel:    ['shop', 'forum', 'corporate'],
    python:     ['forum'],
    nodejs:     ['shop', 'forum', 'corporate'],
    postgresql: ['shop', 'forum', 'corporate'],
    mysql:      ['shop', 'forum', 'corporate'],
    mongodb:    ['forum'],
    redis:      ['shop', 'forum'],
    docker:     ['shop', 'forum', 'corporate'],
    aws:        ['corporate'],
    git:        ['landing', 'card', 'shop', 'forum', 'corporate'],
    nextjs:     ['corporate'],
    vercel:     ['landing']
  };

  // Мета-данные карточек
  const TECH_META = {
    figma:      { name: 'Figma',      role: 'Дизайн',           color: '#F24E1E' },
    html5:      { name: 'HTML5',      role: 'Разметка',         color: '#E34F26' },
    css3:       { name: 'CSS3',       role: 'Стилизация',       color: '#1572B6' },
    js:         { name: 'JavaScript', role: 'Фронтенд',         color: '#F7DF1E' },
    typescript: { name: 'TypeScript', role: 'Типизация JS',     color: '#3178C6' },
    react:      { name: 'React',      role: 'Интерфейсы',       color: '#61DAFB' },
    vue:        { name: 'Vue',        role: 'Фронтенд',         color: '#42B883' },
    php:        { name: 'PHP',        role: 'Бэкенд',           color: '#777BB4' },
    laravel:    { name: 'Laravel',    role: 'Фреймворк',        color: '#FF2D20' },
    python:     { name: 'Python',     role: 'Бэкенд / AI',      color: '#3776AB' },
    nodejs:     { name: 'Node.js',    role: 'JS бэкенд',        color: '#339933' },
    postgresql: { name: 'PostgreSQL', role: 'База данных',      color: '#4169E1' },
    mysql:      { name: 'MySQL',      role: 'База данных',      color: '#4479A1' },
    mongodb:    { name: 'MongoDB',    role: 'База данных',      color: '#47A248' },
    redis:      { name: 'Redis',      role: 'Кэширование',      color: '#DC382D' },
    docker:     { name: 'Docker',     role: 'Контейнеры',       color: '#2496ED' },
    aws:        { name: 'AWS',        role: 'Облако',           color: '#FF9900' },
    git:        { name: 'Git',        role: 'Версионирование',  color: '#F05032' },
    nextjs:     { name: 'Next.js',    role: 'React фреймворк',  color: '#000000' },
    vercel:     { name: 'Vercel',     role: 'Деплоймент',       color: '#000000' }
  };

  /* ------------------------------------------------------------------ */
  /*  Вспомогательные функции                                             */
  /* ------------------------------------------------------------------ */

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  /* ------------------------------------------------------------------ */
  /*  Основной класс                                                      */
  /* ------------------------------------------------------------------ */

  function TechFilterIsotope(section) {
    this.section = section;
    this.grid    = section.querySelector('.tech-grid');
    this.tabs    = section.querySelectorAll('.tech-tab');
    this.iso     = null;   // экземпляр Isotope

    this._buildCards();
    this._initIsotope();
    this._bindTabs();
  }

  /**
   * Создаёт DOM-карточки и добавляет им CSS-классы категорий.
   * Isotope фильтрует именно по CSS-классам элементов.
   */
  TechFilterIsotope.prototype._buildCards = function () {
    this.grid.innerHTML = '';

    ALL_TECHS.forEach(function (techId) {
      var meta = TECH_META[techId];
      if (!meta) return;

      var cats = TECH_CATEGORIES[techId] || [];

      // Классы для Isotope: базовый + один CSS-класс на каждую категорию
      var itemClass = 'tech-card ' + cats.join(' ');

      var card = document.createElement('div');
      card.className = itemClass;
      card.dataset.tech = techId;

      // Иконка — цветной квадрат с аббревиатурой названия технологии
      var iconBg = hexToRgba(meta.color, 0.13);
      card.innerHTML =
        '<div class="tech-card__logo">' +
          '<div class="tech-card__icon-bg" style="background:' + iconBg + ';width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;">' +
            '<span class="tech-card__icon-text" style="font-size:13px;font-weight:800;color:' + meta.color + ';">' +
              meta.name.substring(0, 3).toUpperCase() +
            '</span>' +
          '</div>' +
        '</div>' +
        '<div class="tech-card__name">' + meta.name + '</div>' +
        '<div class="tech-card__role">' + meta.role + '</div>';

      this.grid.appendChild(card);
    }, this);
  };

  /**
   * Инициализирует Isotope на сетке.
   * layoutMode: 'fitRows' — элементы выстраиваются в строки (аналог flex-wrap).
   * transitionDuration задаёт длительность анимации.
   */
  TechFilterIsotope.prototype._initIsotope = function () {
    var self = this;

    if (typeof window.Isotope === 'undefined') {
      console.warn('[TechFilter] Isotope не найден. Проверьте подключение скрипта.');
      return;
    }

    this.iso = new window.Isotope(this.grid, {
      itemSelector:       '.tech-card',
      layoutMode:         'fitRows',
      filter:             '*',
      percentPosition:    true,    // ширина карточек в % — корректный ресайз
      transitionDuration: '0.45s',
      fitRows: {
        gutter: 16          // отступ между карточками в строке (px)
      }
    });

    // После инициализации ещё раз делаем layout — шрифты могут подгрузиться позже
    setTimeout(function () {
      if (self.iso) self.iso.layout();
    }, 400);

    // Пересчёт при ресайзе (Isotope сам этого не делает при % ширинах)
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (self.iso) self.iso.layout();
      }, 150);
    });
  };

  /**
   * Вешает обработчики на вкладки-кнопки.
   * data-category="all" → filter: '*'
   * data-category="shop" → filter: '.shop'
   * и т.д.
   */
  TechFilterIsotope.prototype._bindTabs = function () {
    var self = this;

    this.tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        // Снимаем активный класс со всех вкладок
        self.tabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });

        // Ставим активный класс на нажатую
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        // Формируем строку фильтра для Isotope
        var cat = tab.dataset.category;
        var filterValue = (cat === 'all') ? '*' : '.' + cat;

        // Применяем фильтр — Isotope сам анимирует появление/скрытие
        if (self.iso) {
          self.iso.arrange({ filter: filterValue });
        }
      });
    });
  };

  /* ------------------------------------------------------------------ */
  /*  Точка входа                                                         */
  /* ------------------------------------------------------------------ */

  function init() {
    var section = document.querySelector('#technologies');
    if (!section) return;
    new TechFilterIsotope(section);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
