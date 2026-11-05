# Nexora — Веб-студия полного цикла

Адаптивный одностраничный сайт IT-компании Nexora. Реализован на чистых HTML5 / CSS3 / Vanilla JS без UI-фреймворков.

---

## Как открыть проект

Просто откройте `index.html` в браузере:

```
nexora/index.html
```

Или запустите локальный сервер (рекомендуется для корректной работы):

```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve .

# VS Code: расширение Live Server → Right Click → Open with Live Server
```

---

## Структура проекта

```
nexora/
├── index.html                  ← Главный HTML-файл
│
├── css/
│   ├── reset.css               ← Сброс стилей браузера
│   ├── variables.css           ← CSS-переменные (цвета, тени, радиусы)
│   ├── style.css               ← Основные стили
│   └── responsive.css          ← Адаптивная вёрстка
│
├── js/
│   ├── main.js                 ← Хедер, бургер, скролл, анимации
│   ├── comparison-slider.js    ← Слайдер «до/после»
│   ├── technologies-filter.js  ← Фильтрация технологий
│   ├── portfolio.js            ← Карусель портфолио (мобильная)
│   └── form.js                 ← Валидация и отправка формы
│
└── assets/
    ├── icons/                  ← SVG-иконки
    ├── images/
    │   ├── hero/               ← Изображения для слайдера «до/после»
    │   └── portfolio/          ← Изображения проектов портфолио
    └── logos/                  ← Логотипы партнёров
```

---

## Где менять тексты

Все тексты находятся в `index.html`:

| Блок | Место в файле |
|------|---------------|
| Заголовок и подзаголовок Hero | `<section id="hero">` → `.hero__title`, `.hero__subtitle` |
| Статистика | `.hero__stat` элементы |
| Карточки услуг | `<section id="services">` → каждый `.service-card` |
| Этапы работы | `<section id="process">` → каждый `.process-step` |
| Карточки портфолио | `<section id="portfolio">` → каждый `.portfolio-card` |
| Блок «Партнёры» | `<section id="partners">` → `.partner-logo` элементы |
| Форма обратной связи | `<section id="contact">` → форма и преимущества |
| Контакты в футере | `<footer>` → `.footer__contact` |
| Copyright | `.footer__copy` |

---

## Где менять изображения

### Hero-слайдер «до/после»
- **Было (before):** замените первый `<svg>` или `<img>` внутри `.comparison-slider__before`
- **Стало (after):** замените внутри `.comparison-slider__after`
- Для реальных фото используйте: `assets/images/hero/minimal.webp` и `assets/images/hero/rich.webp`

### Портфолио
Добавьте изображения в `assets/images/portfolio/`:
```
shop.webp
classifieds.webp
mobile-app.webp
landing.webp
design-studio.webp
```
Затем в `index.html` замените SVG внутри `.portfolio-card__image` на:
```html
<img src="assets/images/portfolio/shop.webp" alt="TechMarket — интернет-магазин" 
     width="400" height="250" loading="lazy">
```

---

## Где менять список технологий

Откройте `js/technologies-filter.js`:

### Добавить технологию
1. Добавьте ID в `TECH_DATA.all` и в нужные категории
2. Добавьте описание в `TECH_META`:
```javascript
newtech: { name: 'NewTech', role: 'Описание', color: '#FF0000' }
```

### Добавить новую категорию (вкладку)
1. Добавьте массив в `TECH_DATA`:
```javascript
mobile: ['react', 'nodejs', 'postgresql', 'docker']
```
2. Добавьте кнопку в `index.html`:
```html
<button class="tech-tab" role="tab" data-category="mobile" aria-selected="false">
  Мобильное приложение
</button>
```

---

## Где менять услуги

В `index.html`, секция `#services`. Каждая услуга — это `<article class="service-card">`.

Чтобы добавить новую карточку:
```html
<article class="service-card animate-fade-up">
  <div class="service-card__icon" style="background: rgba(101,120,255,0.1);">
    <img src="assets/icons/YOUR_ICON.svg" alt="" width="24" height="24" aria-hidden="true">
  </div>
  <h3 class="service-card__title">Название услуги</h3>
  <p class="service-card__desc">Короткое описание услуги</p>
  <div class="service-card__arrow" aria-hidden="true">→</div>
</article>
```

Доступные иконки в `assets/icons/`:
`website.svg`, `shop.svg`, `landing.svg`, `webservice.svg`, `corporate.svg`,
`uxui.svg`, `redesign.svg`, `seo.svg`, `blog.svg`, `forum.svg`, `board.svg`,
`mobile.svg`, `businesscard.svg`

---

## Где менять портфолио

Секция `#portfolio` в `index.html`. Каждый проект — `<article class="portfolio-card">`.

Чтобы добавить проект:
```html
<article class="portfolio-card animate-fade-up">
  <div class="portfolio-card__image">
    <img src="assets/images/portfolio/project.webp" alt="Название проекта" 
         width="400" height="250" loading="lazy">
  </div>
  <div class="portfolio-card__body">
    <div class="portfolio-card__type">Тип проекта</div>
    <h3 class="portfolio-card__title">Название</h3>
    <p class="portfolio-card__desc">Описание</p>
    <div class="portfolio-card__tags">
      <span class="portfolio-card__tag">React</span>
    </div>
    <div class="portfolio-card__arrow">
      <span>Подробнее</span>
      <img src="assets/icons/arrow-right.svg" alt="" width="16" height="16" aria-hidden="true">
    </div>
  </div>
</article>
```

---

## Как подключить backend формы

Откройте `js/form.js` и найдите функцию `submitContactForm`:

```javascript
async function submitContactForm(data) {
  // Замените этот код реальным API-запросом:
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Server error');
  return await response.json();
}
```

Данные `data` содержат:
```javascript
{
  name: 'Иван Иванов',
  phone: '+7 (999) 123-45-67',
  email: 'ivan@example.com',
  project_type: 'landing',
  message: 'Текст сообщения'
}
```

---

## Цветовая система

Все цвета определены в `css/variables.css`. Основные переменные:

| Переменная | Значение | Назначение |
|-----------|---------|-----------|
| `--bg` | `#f8faff` | Фон страницы |
| `--text` | `#111827` | Основной текст |
| `--text-secondary` | `#667085` | Второстепенный текст |
| `--blue` | `#6578ff` | Основной акцент |
| `--violet` | `#8d68ff` | Фиолетовый акцент |
| `--cyan` | `#6ccfef` | Голубой акцент |
| `--gradient-cta` | `linear-gradient(135deg, ...)` | Градиент кнопок |

---

## Браузерная поддержка

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

Функции: CSS Grid, CSS Custom Properties, Backdrop Filter, Clip-path, IntersectionObserver, Pointer Events API.

---

## Производительность

- Все иконки — SVG (не растровые)
- Изображения — WebP с `loading="lazy"`
- Шрифт Inter — с `font-display: swap`
- Нет сторонних JS-библиотек
- Анимации через CSS transitions + requestAnimationFrame

---

© 2026 Nexora. Все права защищены.
