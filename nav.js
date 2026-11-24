(function () {
  'use strict';

  const SITE_NAME = 'Pixtor edu';
  const HOME_HREF = 'index.html';

  const UNITS = [
    {
      id: 'u2',
      num: '٢',
      en: 'UNIT 2',
      title: 'الأمن السيبراني',
      lessons: [
        {
          id: 'u2l1',
          num: '١',
          title: 'التشفير والمصادقة',
          desc: 'HTTPS، التشفير المتماثل والعام، TLS، الشهادات، 2FA، والتوقيع',
          href: '1.html'
        },
        {
          id: 'u2l2',
          num: '٢',
          title: 'تصميم أمان الشبكات',
          desc: 'جدار الحماية، VPN، DMZ، الدفاع في العمق، وانعدام الثقة',
          href: '2.html'
        },
        {
          id: 'u2l3',
          num: '٣',
          title: 'الاستجابة للحوادث وإدارة المخاطر',
          desc: 'الحادث الأمني، مراحل الاستجابة الست، ومصفوفة المخاطر',
          href: '3.html'
        }
      ]
    },
    {
      id: 'u3',
      num: '٣',
      en: 'UNIT 3',
      title: 'تطبيقات الويب',
      lessons: [
        {
          id: 'u3l1',
          num: '١',
          title: 'البنية العامة لتطبيقات الويب',
          desc: 'الواجهة الأمامية، الواجهة الخلفية، وقاعدة البيانات',
          href: 'web-applications-architecture.html'
        }
      ]
    }
  ];

  const ICONS = {
    home: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V20h5v-6h4v6h5V9.5"/></svg>',
    chev: '<svg class="unit-chev" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>',
    moon: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    sun: '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    font: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 19L9 5l5 14M6 15h6M16 12h6M19 9v6"/></svg>'
  };

  const THEME_KEY = 'onlinebook-theme';
  const LEGACY_THEME_KEYS = ['crypto-lab-theme', 'netsec-lab-theme', 'webtier-theme'];
  const BIG_KEY = 'onlinebook-big';

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function readSavedTheme() {
    try {
      const primary = localStorage.getItem(THEME_KEY);
      if (primary === 'light' || primary === 'dark') return primary;
      for (const k of LEGACY_THEME_KEYS) {
        const v = localStorage.getItem(k);
        if (v === 'light' || v === 'dark') return v;
      }
    } catch (e) {}
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  function readSavedBig() {
    try {
      return localStorage.getItem(BIG_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  // Apply saved preferences immediately before main content renders.
  applyTheme(readSavedTheme());
  document.documentElement.classList.toggle('big', readSavedBig());

  const header = document.getElementById('site-top');
  if (!header) return;
  const mount = header.querySelector('.site-nav-mount');
  if (!mount) return;

  const pageFile = decodeURIComponent((location.pathname.split('/').pop() || HOME_HREF)).toLowerCase();
  const lessonId = header.dataset.lesson || '';
  const isHome = lessonId === 'home' || (!lessonId && pageFile === HOME_HREF);

  let activeUnit = null;
  let activeLesson = null;
  if (!isHome) {
    for (const u of UNITS) {
      for (const l of u.lessons) {
        if ((lessonId && l.id === lessonId) || (!lessonId && l.href.toLowerCase() === pageFile)) {
          activeUnit = u;
          activeLesson = l;
          break;
        }
      }
      if (activeLesson) break;
    }
  }

  const brandKicker = isHome
    ? 'منصة التعلّم التفاعلي · م. أحمد عبدالواحد'
    : activeUnit && activeLesson
      ? `الوحدة ${activeUnit.num} · الدرس ${activeLesson.num}: ${activeLesson.title}`
      : 'منصة التعلّم التفاعلي';

  const unitsHtml = UNITS.map((u) => {
    const isActiveUnit = activeUnit && activeUnit.id === u.id;
    const countLabel = u.lessons.length === 1 ? 'درس ١' : `${u.lessons.length} دروس`;
    const itemsHtml = u.lessons.map((l) => {
      const isCurrent = activeLesson && activeLesson.id === l.id;
      return (
        `<a class="unit-link" role="menuitem" href="${esc(l.href)}"${isCurrent ? ' aria-current="page"' : ''}>` +
          `<span class="unit-lnum" aria-hidden="true">${esc(l.num)}</span>` +
          `<span class="unit-lbody">` +
            `<span class="unit-ltitle">${esc(l.title)}</span>` +
            `<span class="unit-ldesc">${esc(l.desc)}</span>` +
          `</span>` +
          (isCurrent ? '<span class="unit-now">الحالي</span>' : '') +
        `</a>`
      );
    }).join('');

    return (
      `<div class="unit-dd" data-unit="${esc(u.id)}">` +
        `<button class="unit-btn" type="button" aria-expanded="false" aria-haspopup="menu" data-active="${isActiveUnit ? 'true' : 'false'}">` +
          `<span class="unit-pill">الوحدة ${esc(u.num)}</span>` +
          `<span class="unit-name">${esc(u.title)}</span>` +
          ICONS.chev +
        `</button>` +
        `<div class="unit-menu" role="menu" aria-label="${esc('دروس الوحدة ' + u.num + ': ' + u.title)}" hidden>` +
          `<div class="unit-menu-head"><span>الوحدة ${esc(u.num)} · ${esc(u.title)} (${esc(countLabel)})</span><span class="unit-menu-en">${esc(u.en)}</span></div>` +
          itemsHtml +
        `</div>` +
      `</div>`
    );
  }).join('');

  mount.innerHTML =
    `<div class="site-in">` +
      `<div class="site-bar">` +
        `<a class="site-brand" href="${esc(HOME_HREF)}" title="الصفحة الرئيسية — ${esc(SITE_NAME)}">` +
          `<span class="site-logo-wrap"><img src="logo.png" alt="${esc(SITE_NAME)}"></span>` +
          `<span class="site-brand-txt">` +
            `<span class="site-brand-t">${esc(SITE_NAME)}</span>` +
            `<span class="site-brand-k">${esc(brandKicker)}</span>` +
          `</span>` +
        `</a>` +
        `<nav class="unit-nav" aria-label="التنقل الرئيسي والوحدات">` +
          `<a class="unit-home" href="${esc(HOME_HREF)}"${isHome ? ' aria-current="page"' : ''}>${ICONS.home}<span>الرئيسية</span></a>` +
          unitsHtml +
        `</nav>` +
        `<div class="site-actions">` +
          `<button class="nav-tool" id="nav-theme" type="button" aria-pressed="false"></button>` +
          `<button class="nav-tool" id="nav-big" type="button" aria-pressed="false" title="تكبير حجم الخط">` +
            `${ICONS.font}<span class="nav-tool-lbl">تكبير الخط</span>` +
          `</button>` +
        `</div>` +
      `</div>` +
    `</div>`;

  // Theme & font size controls
  const themeBtn = document.getElementById('nav-theme');
  const bigBtn = document.getElementById('nav-big');

  function syncControls() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeBtn.innerHTML = (dark ? ICONS.sun : ICONS.moon) + `<span class="nav-tool-lbl">${dark ? 'الوضع الفاتح' : 'الوضع الداكن'}</span>`;
    themeBtn.setAttribute('aria-pressed', String(dark));
    themeBtn.title = dark ? 'التحويل إلى الوضع الفاتح' : 'التحويل إلى الوضع الداكن';
    themeBtn.setAttribute('aria-label', themeBtn.title);

    const isBig = document.documentElement.classList.contains('big');
    bigBtn.setAttribute('aria-pressed', String(isBig));
  }

  themeBtn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    syncControls();
  });

  bigBtn.addEventListener('click', () => {
    const on = document.documentElement.classList.toggle('big');
    try { localStorage.setItem(BIG_KEY, on ? '1' : '0'); } catch (e) {}
    syncControls();
  });

  syncControls();

  // Unit dropdown behavior
  const dropdowns = [...mount.querySelectorAll('.unit-dd')];

  function positionMenu(menu) {
    menu.style.insetInlineStart = '';
    menu.style.insetInlineEnd = '';
    if (window.innerWidth <= 640) return;
    const rect = menu.getBoundingClientRect();
    if (rect.left < 12) {
      menu.style.insetInlineStart = 'auto';
      menu.style.insetInlineEnd = '0';
    } else if (rect.right > window.innerWidth - 12) {
      menu.style.insetInlineStart = '0';
      menu.style.insetInlineEnd = 'auto';
    }
  }

  function closeAll(restoreFocus) {
    for (const dd of dropdowns) {
      const btn = dd.querySelector('.unit-btn');
      const menu = dd.querySelector('.unit-menu');
      const wasOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
      if (restoreFocus && wasOpen) btn.focus();
    }
  }

  function openDropdown(dd) {
    closeAll(false);
    const btn = dd.querySelector('.unit-btn');
    const menu = dd.querySelector('.unit-menu');
    btn.setAttribute('aria-expanded', 'true');
    menu.hidden = false;
    positionMenu(menu);
  }

  for (const dd of dropdowns) {
    const btn = dd.querySelector('.unit-btn');
    const menu = dd.querySelector('.unit-menu');

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeAll(false);
      else openDropdown(dd);
    });

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        openDropdown(dd);
        const first = menu.querySelector('.unit-link');
        if (first) first.focus();
      }
    });

    menu.addEventListener('keydown', (e) => {
      const items = [...menu.querySelectorAll('.unit-link')];
      if (!items.length) return;
      const idx = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[(idx + 1) % items.length].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[(idx - 1 + items.length) % items.length].focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        items[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        items[items.length - 1].focus();
      }
    });

    dd.addEventListener('focusout', (e) => {
      if (e.relatedTarget && !dd.contains(e.relatedTarget)) {
        closeAll(false);
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (!mount.contains(e.target)) closeAll(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll(true);
  });

  window.addEventListener('resize', () => {
    const openMenu = mount.querySelector('.unit-menu:not([hidden])');
    if (openMenu) positionMenu(openMenu);
  });
})();
