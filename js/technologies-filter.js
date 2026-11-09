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

  // Capabilities for future orders. Groups describe choices, not a mandatory bundle.
  const PROJECT_PROFILES = {
    all: { title: 'Инструменты под задачу', description: 'Направления для будущих проектов. В карточках — варианты технологий и их роли. Выбираем совместимый набор под функции, бюджет и развитие проекта.' },
    landing: { ids: ['design', 'layout', 'interactive'], title: 'Лендинги', description: 'Дизайн, адаптивная страница, меню, формы и анимация. Обычному лендингу отдельная база данных и движок не нужны.' },
    card: { ids: ['design', 'layout', 'interactive'], title: 'Сайты-визитки', description: 'Услуги, галерея и контакты. Если потребуется редактирование материалов владельцем, дополнительно подберём CMS.' },
    corporate: { ids: ['design', 'layout', 'interactive', 'foundation', 'database'], title: 'Корпоративные сайты', description: 'Выбираем CMS для контента или фреймворк для индивидуальной логики. База данных должна поддерживаться выбранной основой.' },
    shop: { ids: ['design', 'layout', 'interactive', 'interface', 'foundation', 'database'], title: 'Интернет-магазины', description: 'Готовая торговая система или индивидуальная разработка. React, Vue или Angular — для отдельной интерактивной витрины. Своя БД нужна не для каждой архитектуры.' },
    application: { ids: ['design', 'layout', 'interactive', 'interface', 'foundation', 'database'], title: 'Веб-приложения', description: 'Кабинеты, сервисы и бизнес-инструменты. Интерфейс, серверную основу и хранилище подбираем как совместимый набор.' },
    game: { ids: ['design', 'layout', 'interactive', 'graphics', 'database'], title: 'Браузерные игры', description: 'Инструменты под 2D или 3D и механику игры. Для аккаунтов, мультиплеера и общего прогресса дополнительно проектируем сервер и хранение данных.' },
  };
  Object.entries(PROJECT_PROFILES).forEach(([category, profile]) => {
    if (!profile.ids) return;
    profile.ids.push('hosting', 'advertising');
    if (['shop', 'application', 'game'].includes(category)) profile.ids.push('delivery', 'ai');
  });
  const TECH_META = {
    advertising: { name: 'Реклама и продвижение', badge: 'Каналы под аудиторию', role: 'YouTube, Google, Instagram, TikTok и Facebook. Выбираем каналы под аудиторию, цели и бюджет проекта.', options: [['ad-youtube', 'YouTube'], ['ad-google', 'Google'], ['ad-instagram', 'Instagram'], ['ad-tiktok', 'TikTok'], ['ad-facebook', 'Facebook']] },
    delivery: { name: 'Код и CI/CD', badge: 'Командная разработка', role: 'Git — история изменений. GitHub или GitLab — репозиторий и совместная работа. CI/CD — автоматические проверки и публикация по задаче.', options: [['git', 'Git'], ['github', 'GitHub'], ['gitlab', 'GitLab'], ['cicd', 'CI/CD']] },
    hosting: { name: 'Хостинг и серверы', badge: 'Выбираем размещение', role: 'Хостинг, VPS или облако — под стек и нагрузку. CDN, хранилище и резервные копии подключаем по необходимости.', options: [['vercel', 'Vercel'], ['aws', 'AWS'], ['server', 'VPS / сервер']] },
    ai: { name: 'ИИ-интеграции', badge: 'По задаче бизнеса', role: 'Claude, Gemini, GPT или DeepSeek — для ассистентов, поиска и автоматизации. Выбираем по качеству, стоимости API и требованиям к данным.', options: [['claude', 'Claude'], ['gemini', 'Gemini'], ['gpt', 'GPT'], ['deepseek', 'DeepSeek']] },
    design: { name: 'Дизайн и графика', badge: 'Дополняют друг друга', role: 'Figma — макеты и прототипы. Photoshop — подготовка и обработка изображений.', options: [['figma', 'Figma'], ['photoshop', 'Photoshop']] },
    layout: { name: 'Основа страницы', badge: 'Работают вместе', role: 'Структура, оформление и адаптация под разные экраны.', options: [['html5', 'HTML5'], ['css3', 'CSS3']] },
    interactive: { name: 'Интерактив', badge: 'Язык под задачу', role: 'Меню, формы и анимация. TypeScript добавляет проверку типов для сложной логики.', options: [['js', 'JavaScript'], ['typescript', 'TypeScript']] },
    interface: { name: 'Интерфейс', badge: 'Выбираем подход', role: 'React, Vue или Angular — для сложного интерфейса. Next.js дополняет React, а не заменяет его.', options: [['react', 'React'], ['vue', 'Vue'], ['angular', 'Angular']] },
    foundation: { name: 'CMS и фреймворки', badge: 'Выбираем основу', role: 'WordPress и Joomla — CMS. Laravel — PHP-фреймворк, Next.js — фреймворк на React. Выбор определяет архитектуру.', options: [['wordpress', 'WordPress'], ['joomla', 'Joomla'], ['laravel', 'Laravel'], ['nextjs', 'Next.js'], ['shopify', 'Shopify']] },
    database: { name: 'Базы данных', badge: 'Выбираем совместимую', role: 'Вариант зависит от основы проекта и данных. У готовых облачных платформ хранение уже включено.', options: [['mysql', 'MySQL'], ['mariadb', 'MariaDB'], ['postgresql', 'PostgreSQL'], ['mongodb', 'MongoDB']] },
    graphics: { name: 'Игры и графика', badge: 'Под 2D или 3D', role: 'Phaser — для 2D-игр, Three.js — для 3D, Canvas API — для собственной 2D-отрисовки.', options: [['phaser', 'Phaser'], ['threejs', 'Three.js'], ['canvas', 'Canvas API']] }
  };
  const PROFILE_VARIANTS = {
    game: {
      database: { role: 'Для аккаунтов, общего прогресса, рейтингов и онлайн-функций. Выбираем по серверной архитектуре; локальной игре отдельная БД не нужна.' }
    },
    corporate: {
      foundation: { options: [['wordpress', 'WordPress'], ['joomla', 'Joomla'], ['laravel', 'Laravel']], role: 'WordPress или Joomla — управление контентом. Laravel — для индивидуальной разработки.' },
      database: { options: [['mysql', 'MySQL'], ['mariadb', 'MariaDB'], ['postgresql', 'PostgreSQL']], role: 'Выбираем базу, поддерживаемую CMS или фреймворком. Все варианты одновременно не требуются.' }
    },
    shop: {
      foundation: { options: [['shopify', 'Shopify'], ['wordpress', 'WooCommerce'], ['laravel', 'Laravel']], role: 'Shopify — торговая платформа. WooCommerce работает на WordPress. Laravel — для индивидуального магазина.' },
      database: { options: [['mysql', 'MySQL'], ['mariadb', 'MariaDB'], ['postgresql', 'PostgreSQL']], role: 'WooCommerce — MySQL или MariaDB. Собственная разработка — совместимая БД. Shopify управляет хранением сам.' }
    },
    application: {
      foundation: { options: [['laravel', 'Laravel · PHP'], ['nextjs', 'Next.js · React'], ['nodejs', 'Node.js · сервер']], role: 'Laravel — PHP-фреймворк; Next.js — приложение на React; Node.js — среда для собственного сервера. Выбираем согласованную архитектуру.' }
    }
  };
  const ALL_TECHS = Object.keys(TECH_META).filter(id => !['delivery', 'hosting', 'ai', 'advertising'].includes(id)).concat(['delivery', 'hosting', 'ai', 'advertising']);
  const TECH_CATEGORIES = Object.fromEntries(ALL_TECHS.map(id => [id,
    Object.entries(PROJECT_PROFILES).filter(([key, profile]) => key !== 'all' && profile.ids.includes(id)).map(([key]) => key)
  ]));

  function renderGroup(id, category) {
    const meta = Object.assign({}, TECH_META[id], (PROFILE_VARIANTS[category] || {})[id]);
    return '<h3 class="tech-card__name">' + meta.name + '</h3>' +
      '<p class="tech-card__badge">' + meta.badge + '</p>' +
      '<ul class="tech-card__options">' + meta.options.map(function (option) {
        return '<li>' + (option[0] ? '<img src="assets/icons/technologies/' + option[0] + '.svg" width="24" height="24" alt="">' : '<span class="tech-card__option-dot" aria-hidden="true"></span>') + '<span>' + option[1] + '</span></li>';
      }).join('') + '</ul><p class="tech-card__role">' + meta.role + '</p>';
  }

  function TechFilterIsotope(section) {
    this.section = section;
    this.grid    = section.querySelector('.tech-grid');
    this.tabs    = section.querySelectorAll('.tech-tab');
    this.iso     = null;   // экземпляр Isotope

    this._updateProfile('all');
    this._buildCards();
    this._equalizeRows();
    this._initIsotope();
    this._bindTabs();
  }

  /**
   * Создаёт DOM-карточки и добавляет им CSS-классы категорий.
   * Isotope фильтрует именно по CSS-классам элементов.
   */
  TechFilterIsotope.prototype._updateProfile = function (category) {
    this.category = category;
    var profile = PROJECT_PROFILES[category];
    this.section.querySelector('#tech-profile-title').textContent = profile.title;
    this.section.querySelector('#tech-profile-description').textContent = profile.description;
    this.grid.querySelectorAll('.tech-card').forEach(function (card) { card.innerHTML = renderGroup(card.dataset.tech, category); });
    this._equalizeRows();
  };

  // Equalize each logical fitRows row before Isotope measures positions.
  TechFilterIsotope.prototype._equalizeRows = function () {
    const category = this.category || 'all';
    const cards = Array.from(this.grid.querySelectorAll('.tech-card'));
    cards.forEach(card => { card.style.height = ''; });
    const visible = cards.filter(card => category === 'all' || card.classList.contains(category));
    if (!visible.length || !this.grid.clientWidth) return;
    const displays = visible.map(card => card.style.display);
    visible.forEach(card => { card.style.display = 'block'; });
    // CSS sizes ignore in-flight transforms and retain fractional pixel widths.
    const gridWidth = parseFloat(getComputedStyle(this.grid).width);
    const cardWidth = parseFloat(getComputedStyle(visible[0]).width);
    const columns = Math.max(1, Math.floor((gridWidth + 16.01) / (cardWidth + 16)));
    for (let i = 0; i < visible.length; i += columns) {
      const row = visible.slice(i, i + columns);
      const height = Math.ceil(Math.max(...row.map(card => card.offsetHeight)));
      row.forEach(card => { card.style.height = height + 'px'; });
    }
    visible.forEach((card, index) => { card.style.display = displays[index]; });
  };

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
      card.innerHTML = renderGroup(techId, 'all');

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

    this._createIsotope();

    // Turning transitions off cancels transitionend events. Recreate the layout
    // from the selected category so no pending reveal/hide state survives.
    window.addEventListener('nexora:motion', function () {
      self.iso.destroy();
      self._equalizeRows();
      self._createIsotope();
    });

    setTimeout(function () {
      if (self.iso) { self._equalizeRows(); self.iso.layout(); }
    }, 400);

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (self.iso) { self._equalizeRows(); self.iso.layout(); }
      }, 150);
    });
  };

  TechFilterIsotope.prototype._createIsotope = function () {
    this.iso = new window.Isotope(this.grid, {
      itemSelector:       '.tech-card',
      layoutMode:         'fitRows',
      filter:             this.category === 'all' ? '*' : '.' + this.category,
      percentPosition:    true,    // ширина карточек в % — корректный ресайз
      transitionDuration: document.documentElement.dataset.motion === 'off' || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : '0.45s',
      fitRows: {
        gutter: 16          // отступ между карточками в строке (px)
      }
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

    this.tabs.forEach(function (tab, index) {
      tab.id = 'tech-tab-' + tab.dataset.category;
      tab.setAttribute('aria-controls', 'technology-panel');
      tab.tabIndex = tab.classList.contains('active') ? 0 : -1;
      tab.addEventListener('keydown', function (event) {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        var target = event.key === 'Home' ? 0 : event.key === 'End' ? self.tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + self.tabs.length) % self.tabs.length;
        self.tabs[target].focus();
        self.tabs[target].click();
      });
      tab.addEventListener('click', function () {
        // Снимаем активный класс со всех вкладок
        self.tabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
          t.tabIndex = -1;
        });

        // Ставим активный класс на нажатую
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        tab.tabIndex = 0;
        self.grid.setAttribute('aria-labelledby', tab.id);

        // Формируем строку фильтра для Isotope
        var cat = tab.dataset.category;
        self._updateProfile(cat);
        var filterValue = (cat === 'all') ? '*' : '.' + cat;

        // Применяем фильтр — Isotope сам анимирует появление/скрытие
        if (self.iso) {
          self.iso.arrange({ filter: filterValue });
        } else {
          self.grid.querySelectorAll('.tech-card').forEach(function (card) {
            card.hidden = cat !== 'all' && !card.classList.contains(cat);
          });
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
