/* ============================================================
   MOMOTO CAFÉ · deck.js
   Navegación "un apartado por pantalla" (deck), sin scroll de página.
   Mejora progresiva: sin JS el sitio funciona con scroll normal.
   No interfiere con el carrito (carrito.js) ni con #pagoBandBtn.
   ============================================================ */
(function () {
  "use strict";
  var ORDER = ["inicio", "cafe", "nosotros", "resenas", "contacto"];
  var LABELS = { inicio: "Inicio", cafe: "Café", nosotros: "Nosotros", resenas: "Reseñas", contacto: "Contacto" };
  var panels = ORDER.map(function (id) { return document.getElementById(id); }).filter(Boolean);
  if (panels.length < 2) return;

  var html = document.documentElement, body = document.body;
  var current = 0, lock = false, dotsWrap;
  var brandImg = document.querySelector(".brand img");   // logo del header (se adapta al panel)

  html.classList.add("deck");
  body.classList.add("deck");
  var header = document.getElementById("siteHeader");
  if (header) header.classList.add("is-solid"); // menú legible sobre cualquier panel

  // El footer queda fuera del área de paneles → lo movemos al final de Contacto
  var footer = document.querySelector(".site-footer");
  var contacto = document.getElementById("contacto");
  if (footer && contacto) {
    var w = contacto.querySelector(".wrap") || contacto;
    w.appendChild(footer);
  }

  // a11y: paneles enfocables (mover el foco al cambiar de apartado) + región que anuncia el cambio a lectores de pantalla
  panels.forEach(function (p) { p.setAttribute("tabindex", "-1"); });
  var live = document.createElement("div");
  live.className = "visually-hidden";
  live.setAttribute("aria-live", "polite");
  live.setAttribute("aria-atomic", "true");
  body.appendChild(live);

  function idIndex(id) { for (var i = 0; i < panels.length; i++) if (panels[i].id === id) return i; return -1; }

  function buildDots() {
    dotsWrap = document.createElement("div");
    dotsWrap.className = "deck-dots";
    dotsWrap.setAttribute("role", "group");
    dotsWrap.setAttribute("aria-label", "Apartados del sitio");
    panels.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "deck-dot";
      b.setAttribute("aria-label", LABELS[p.id] || ("Apartado " + (i + 1)));
      b.addEventListener("click", function () { go(i); });
      dotsWrap.appendChild(b);
    });
    body.appendChild(dotsWrap);
  }

  function setActive(i) {
    i = Math.max(0, Math.min(panels.length - 1, i));
    panels.forEach(function (p, idx) {
      p.classList.toggle("panel-leaving", idx === current && idx !== i);
      p.classList.toggle("panel-active", idx === i);
      if (idx === i) p.scrollTop = 0;
    });
    current = i;
    var active = panels[i];
    var onDark = active.classList.contains("dark") || active.id === "inicio";
    body.classList.toggle("deck-on-dark", onDark);   // solo para el color de los dots
    // estado activo del menú (desktop + móvil)
    var links = document.querySelectorAll(".nav-links a, .mobile-nav__links a");
    Array.prototype.forEach.call(links, function (a) {
      var t = (a.getAttribute("href") || "").replace("#", "");
      var on = (t === active.id);
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    if (dotsWrap) Array.prototype.forEach.call(dotsWrap.children, function (b, idx) {
      b.classList.toggle("on", idx === i);
      if (idx === i) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
    });
    try { history.replaceState(null, "", "#" + active.id); } catch (e) {}
  }

  function go(i) {
    if (lock || i === current || i < 0 || i >= panels.length) return;
    hideHint();
    lock = true; setActive(i);
    var p = panels[i];
    try { live.textContent = "Apartado: " + (LABELS[p.id] || p.id); } catch (e) {}
    try { p.focus({ preventScroll: true }); } catch (e) {}
    setTimeout(function () { lock = false; }, 560);
  }

  // Pista de navegación (una sola vez): revive .deck-hint (existía en el CSS pero deck.js nunca lo creaba)
  var hintEl = null, hintDone = false;
  function buildHint() {
    try { if (localStorage.getItem("momoto_deck_hint") === "1") return; } catch (e) {}
    hintEl = document.createElement("div");
    hintEl.className = "deck-hint";
    hintEl.textContent = "Desliza o usa el menú";
    body.appendChild(hintEl);
    setTimeout(function () { if (hintEl && !hintDone) hintEl.classList.add("show"); }, 1200);
    setTimeout(hideHint, 8000);
  }
  function hideHint() {
    if (hintDone) return;
    hintDone = true;
    if (hintEl) hintEl.classList.remove("show");
    try { localStorage.setItem("momoto_deck_hint", "1"); } catch (e) {}
  }

  function bindNav() {
    // Solo el menú y el logo cambian de apartado (NO #pagoBandBtn ni otros enlaces)
    var navLinks = document.querySelectorAll('.nav-links a[href^="#"], .mobile-nav__links a[href^="#"], .brand[href^="#"], .deck-goto[href^="#"]');
    Array.prototype.forEach.call(navLinks, function (a) {
      var hid = (a.getAttribute("href") || "").slice(1);
      var idx = idIndex(hid);
      var inEl = idx < 0 ? document.getElementById(hid) : null;
      if (idx < 0 && !inEl) return;   // hash desconocido: no interceptar
      a.addEventListener("click", function (e) {
        e.preventDefault();
        if (idx >= 0) { go(idx); }
        else {   // enlace a un elemento DENTRO de un apartado (p. ej. #rastreo en Contacto)
          var host = inEl.closest && inEl.closest(".hero, .chapter");
          var hi = host ? idIndex(host.id) : -1;
          go(hi >= 0 ? hi : 0);
          setTimeout(function () { try { inEl.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (er) { inEl.scrollIntoView(); } }, 420);
        }
        var n = document.getElementById("mobileNav"), t = document.getElementById("navToggle");
        if (n) { n.classList.remove("open"); n.setAttribute("aria-hidden", "true"); }
        if (t) { t.classList.remove("open"); t.setAttribute("aria-expanded", "false"); }
        body.classList.remove("menu-open");
      });
    });

    // Teclado: ←/→, PageUp/Down, Home/End (ignora inputs y overlays abiertos)
    document.addEventListener("keydown", function (e) {
      var tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || e.metaKey || e.ctrlKey || e.altKey) return;
      // No robar flechas/Home/End a controles interactivos (p. ej. el radiogroup de tamaño/molienda)
      if (e.target && e.target.closest && e.target.closest('.seg,[role="radiogroup"],button,a,select,[contenteditable]')) return;
      if (body.classList.contains("cart-open") || body.classList.contains("menu-open")) return;
      switch (e.key) {
        case "ArrowRight": case "PageDown": e.preventDefault(); go(current + 1); break;
        case "ArrowLeft": case "PageUp": e.preventDefault(); go(current - 1); break;
        case "Home": e.preventDefault(); go(0); break;
        case "End": e.preventDefault(); go(panels.length - 1); break;
      }
    });

    // Swipe HORIZONTAL (el vertical se deja para el scroll interno del panel)
    var x0 = null, y0 = null;
    document.addEventListener("touchstart", function (e) {
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    document.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      if (body.classList.contains("cart-open") || body.classList.contains("menu-open")) { x0 = null; return; }
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
      if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.3) return; // swipe claramente horizontal
      go(current + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  buildDots();
  bindNav();
  buildHint();
  // Abre el apartado del hash; si el hash apunta a un elemento dentro de un apartado
  // (p. ej. #rastreo desde gracias.html), abre ese apartado y baja hasta él.
  (function () {
    var hid = location.hash ? location.hash.slice(1) : "";
    var idx = hid ? idIndex(hid) : 0;
    if (idx >= 0) { setActive(idx); return; }
    var el = document.getElementById(hid);
    var host = el && el.closest ? el.closest(".hero, .chapter") : null;
    var hi = host ? idIndex(host.id) : 0;
    setActive(hi >= 0 ? hi : 0);
    if (el) setTimeout(function () { try { el.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (e) { el.scrollIntoView(); } }, 460);
  })();
})();
