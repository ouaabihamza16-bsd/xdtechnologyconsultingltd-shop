/* XD Technology Consulting - site behaviour (mobile menu, smooth scroll, legal modals) */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.classList.toggle('hidden', !open);
    var label = toggle.querySelector('.sr-only');
    if (label) label.textContent = open ? 'Close main menu' : 'Open main menu';
    var iconOpen = toggle.querySelector('.icon-open');
    var iconClose = toggle.querySelector('.icon-close');
    if (iconOpen) iconOpen.classList.toggle('hidden', open);
    if (iconClose) iconClose.classList.toggle('hidden', !open);
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) setMenu(false);
    });
  }

  /* ---------- Smooth scroll for in-page links ---------- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href').slice(1);
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    setMenu(false);

    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });

    // Move focus for keyboard and screen-reader users without jumping the page.
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });

    if (history.pushState) history.pushState(null, '', '#' + id);
  });

  /* ---------- Legal modals (<dialog>) ---------- */
  var lastTrigger = null;

  function openModal(dialog, trigger) {
    if (!dialog) return;
    lastTrigger = trigger || null;
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    document.body.classList.add('modal-open');
    var closeBtn = dialog.querySelector('[data-close-modal]');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
      onClosed();
    }
  }

  function onClosed() {
    document.body.classList.remove('modal-open');
    if (lastTrigger) {
      lastTrigger.focus();
      lastTrigger = null;
    }
  }

  document.querySelectorAll('[data-open-modal]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal(document.getElementById(btn.getAttribute('data-open-modal')), btn);
    });
  });

  document.querySelectorAll('dialog.legal-modal').forEach(function (dialog) {
    // Esc closes natively (fires "cancel" then "close").
    dialog.addEventListener('close', onClosed);

    dialog.querySelectorAll('[data-close-modal]').forEach(function (btn) {
      btn.addEventListener('click', function () { closeModal(dialog); });
    });

    // Click on the backdrop closes the dialog.
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) closeModal(dialog);
    });
  });

  /* ---------- Current year in footer ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
