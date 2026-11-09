(function () {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const data = window.NexoraContent;
  const escape = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  function preview(project, large = false) {
    return `<div class="work-preview work-preview--${project.visual}${large ? ' work-preview--large' : ''}" aria-hidden="true"><div class="work-preview__nav"><span>● ${project.type}</span><span>•••</span></div><div class="work-preview__heading"><small>КОНЦЕПЦИЯ ИНТЕРФЕЙСА</small><strong>${project.caption}</strong><i></i></div><div class="work-preview__tiles"><span></span><span></span><span></span></div><div class="work-preview__label">Концепт-превью · не скриншот проекта</div></div>`;
  }
  function card(project) {
    return `<a class="portfolio-card" href="project.html?id=${project.id}"><div class="portfolio-card__image">${preview(project)}</div><div class="portfolio-card__body"><div class="portfolio-card__type">${project.type}</div><h3 class="portfolio-card__title">${project.title}</h3><p class="portfolio-card__desc">${project.summary}</p><div class="portfolio-card__arrow"><span>О проекте</span><img src="assets/icons/arrow-right.svg" alt="" width="16" height="16"></div></div></a>`;
  }
  const projectGrid = $('[data-projects]');
  if (projectGrid) {
    const all = document.body.dataset.page === 'portfolio';
    const render = category => {
      const projects = data.projects.filter(project => category === 'all' || category === project.category);
      projectGrid.innerHTML = (all ? projects : projects.slice(0, 6)).map(card).join('');
      if ($('#project-count')) $('#project-count').textContent = projects.length;
    };
    render('all');
    $$('[data-project-filter]').forEach(button => button.addEventListener('click', () => {
      $$('[data-project-filter]').forEach(item => {item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button));});
      render(button.dataset.projectFilter);
    }));
  }

  const projectDetail = $('#project-detail');
  if (projectDetail) {
    const project = data.projects.find(item => item.id === new URLSearchParams(location.search).get('id'));
    if (project) {
      document.title = `${project.title} — Nexora`;
      projectDetail.innerHTML = `<a class="btn-text" href="portfolio.html">← Всё портфолио</a><p class="section-tag">${project.type}</p><h1 class="section-title">${project.title}</h1><p class="detail-intro">${project.summary}</p>${preview(project, true)}<div class="detail-columns"><div><h2>Задача направления</h2><p>${project.focus}</p></div><div><h2>Темы для подробного кейса</h2><ul>${project.items.map(item => `<li>${item}</li>`).join('')}</ul></div></div><p class="content-note">Работа включена на основе предоставленного списка проектов. Иллюстрация показывает концепцию подачи, а не готовый интерфейс. Сценарии — темы для будущего кейса; фактические функции, стек, изображения и результаты будут добавлены после уточнения.</p><a class="btn-primary" href="index.html#contact">Рассчитать похожий проект →</a>`;
    } else {
      projectDetail.innerHTML = '<h1 class="section-title">Проект не найден</h1><p class="detail-intro">Выберите работу из общего списка.</p><a class="btn-primary" href="portfolio.html">Открыть портфолио →</a>';
    }
  }

  const articleGrid = $('#article-grid');
  if (articleGrid) articleGrid.innerHTML = data.articles.map((article, i) => `<a class="portfolio-card article-card" href="article.html?id=${article.id}"><div class="article-cover article-cover--${i}" aria-hidden="true"><span>ЗАМЕТКИ NEXORA / 0${i + 1}</span><strong>${['От идеи<br>к структуре.','Из чего<br>складывается цена?','После запуска<br>всё продолжается.'][i]}</strong><b>${['{ → }','Σ','↻'][i]}</b></div><div class="portfolio-card__body"><div class="portfolio-card__type">${article.category}</div><h2 class="portfolio-card__title">${article.title}</h2><p class="portfolio-card__desc">${article.intro}</p><span class="portfolio-card__arrow">Читать материал →</span></div></a>`).join('');
  const articleDetail = $('#article-detail');
  if (articleDetail) {
    const article = data.articles.find(item => item.id === new URLSearchParams(location.search).get('id'));
    if (article) {
      document.title = `${article.title} — Nexora`;
      articleDetail.innerHTML = `<a class="btn-text" href="blog.html">← Все материалы</a><p class="section-tag">${article.category}</p><h1 class="section-title">${article.title}</h1><p class="detail-intro">${article.intro}</p><div class="article-prose">${article.sections.map(([title, text]) => `<section><h2>${title}</h2><p>${text}</p></section>`).join('')}</div><a class="btn-primary" href="index.html#contact">Перейти к своему проекту →</a>`;
    } else articleDetail.innerHTML = '<h1 class="section-title">Материал не найден</h1><a class="btn-primary" href="blog.html">Вернуться в блог →</a>';
  }

  const estimateForm = $('#estimate-form');
  if (estimateForm) {
    const price = value => new Intl.NumberFormat('ru-RU').format(value) + ' €';
    let estimateText = '';
    const update = () => {
      const type = $('#estimate-type').selectedOptions[0];
      const menuSelect = $('#estimate-menu');
      const navigationIncluded = ['game', 'platform'].includes(type.dataset.type);
      menuSelect.closest('.form-group').hidden = navigationIncluded;
      if (navigationIncluded) menuSelect.value = '0';
      const menu = menuSelect.selectedOptions[0];
      // Filter irrelevant options by project type, clearing hidden selections.
      const typeId = type.dataset.type;
      $$('[data-for]', estimateForm).forEach(label => {
        const available = label.dataset.for.split(' ').includes(typeId);
        label.hidden = !available;
        const input = $('input', label); input.disabled = !available;
        if (!available) input.checked = false;
      });
      const features = $$('input[name="feature"]:checked', estimateForm);
      const lines = [[type.textContent, Number(type.value)], [menu.textContent, Number(menu.value)], ...features.map(input => [input.dataset.label, Number(input.value)])];
      const total = lines.reduce((sum, [,value]) => sum + value, 0);
      $('#estimate-lines').innerHTML = lines.map(([label, value]) => `<div><span>${escape(label)}</span><strong>${value ? price(value) : 'Включено'}</strong></div>`).join('');
      $('#estimate-total').textContent = price(total);
      $('#estimate-count').textContent = features.length ? `${features.length} дополнительных функций` : 'Базовая конфигурация';
      estimateText = `NEXORA — предварительный расчёт\nДемонстрационные цены. Не оферта.\n\n${lines.map(([label, value]) => `${label}: ${value ? price(value) : 'включено'}`).join('\n')}\n\nИтого от: ${price(total)}\n\nЗадача: ${$('#estimate-note').value.trim() || 'Не указана'}\n\nВ основе: адаптивный дизайн, разработка и базовая проверка. ${type.dataset.included || ''} Домен, хостинг, контент, платные сервисы и поддержка — отдельно. Итоговая цена и сроки определяются после согласования требований.\nРасчёт не является отправленной заявкой.`;
      $('#estimate-status').textContent = '';
      window.dispatchEvent(new CustomEvent('nexora:estimate-change'));
    };
    estimateForm.addEventListener('change', update);
    estimateForm.addEventListener('input', update);
    estimateForm.addEventListener('submit', event => event.preventDefault());
    $('#estimate-download').addEventListener('click', () => {
      update();
      const url = URL.createObjectURL(new Blob(['\uFEFF' + estimateText], {type:'text/plain;charset=utf-8'}));
      const link = document.createElement('a'); link.href = url; link.download = 'nexora-estimate.txt'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      $('#estimate-status').textContent = 'Расчёт подготовлен для скачивания. Он не отправляется команде.';
    });
    $('#estimate-reset').addEventListener('click', () => {estimateForm.reset(); update();});
    $$('[data-estimate-type]').forEach(link => link.addEventListener('click', () => {
      const option = $$('option', $('#estimate-type')).find(item => item.dataset.type === link.dataset.estimateType);
      if (option) {$('#estimate-type').value = option.value; update();}
    }));
    update();
  }
})();
