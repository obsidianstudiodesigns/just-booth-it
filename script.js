/* ===== Just Booth It! interactions ===== */
(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var links = document.querySelector('.nav__links');
  var spotlight = document.querySelector('.spotlight');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* year */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* nav shrink on scroll */
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    /* parallax elements */
    document.querySelectorAll('.parallax').forEach(function (el) {
      var speed = parseFloat(el.dataset.speed || '0.1');
      var rect = el.getBoundingClientRect();
      var offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -speed;
      el.style.transform = 'translateY(' + offset.toFixed(1) + 'px)';
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* mobile menu */
  function closeMenu() {
    links.classList.remove('open');
    burger.classList.remove('open');
    document.body.classList.remove('menu-open');
  }
  if (burger) {
    burger.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = links.classList.toggle('open');
      burger.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('click', function (e) {
      if (links.classList.contains('open') && !links.contains(e.target) && e.target !== burger) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* scroll reveal */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* stagger card index */
  document.querySelectorAll('.cards .card').forEach(function (c, i) {
    c.style.setProperty('--i', i);
  });

  /* spotlight + card tilt follow cursor */
  if (!reduce) {
    window.addEventListener('mousemove', function (e) {
      if (spotlight) {
        spotlight.style.left = e.clientX + 'px';
        spotlight.style.top = e.clientY + 'px';
      }
    }, { passive: true });

    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          'perspective(700px) rotateY(' + (px * 10).toFixed(2) + 'deg) rotateX(' +
          (-py * 10).toFixed(2) + 'deg) translateY(-6px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* confetti burst on primary buttons */
  var EMOJI = ['📸', '🎉', '✨', '🖤', '💙', '🎩'];
  function burst(x, y) {
    if (reduce) return;
    for (var i = 0; i < 14; i++) {
      var p = document.createElement('span');
      p.textContent = EMOJI[Math.floor(Math.random() * EMOJI.length)];
      p.style.cssText =
        'position:fixed;left:' + x + 'px;top:' + y + 'px;z-index:9999;pointer-events:none;' +
        'font-size:' + (14 + Math.random() * 16) + 'px;transition:transform 1s ease-out,opacity 1s ease-out;';
      document.body.appendChild(p);
      var ang = Math.random() * Math.PI * 2;
      var dist = 60 + Math.random() * 120;
      requestAnimationFrame(function (el, a, d) {
        return function () {
          el.style.transform = 'translate(' + Math.cos(a) * d + 'px,' + (Math.sin(a) * d + 80) + 'px) rotate(' + (Math.random() * 360) + 'deg)';
          el.style.opacity = '0';
        };
      }(p, ang, dist));
      setTimeout(function (el) { return function () { el.remove(); }; }(p), 1100);
    }
  }
  document.querySelectorAll('.btn--primary').forEach(function (b) {
    b.addEventListener('click', function (e) { burst(e.clientX, e.clientY); });
  });
})();
