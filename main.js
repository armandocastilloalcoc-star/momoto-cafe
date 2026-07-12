/* ============================================================
   MOMOTO CAFÉ · «A la sombra» — main.js
   ES6+, sin dependencias. Datos y precios REALES.
   A) Datos  B) Precios  C) Render fichas  D) Selector accesible
   E) Header + scroll-spy  F) Menú móvil  G) Reveal  H) Año
   ============================================================ */
(function () {
  "use strict";

  /* ═══════════════════ A) DATOS (REALES) ═══════════════════
     precios[tamaño]:
       • número            → mismo precio en grano y molido
       • { grano, molido } → precios distintos por molienda
     Solo Puma y Armadillo difieren grano/molido, y solo en 100 g y 250 g. */
  const MOMOTO = {
    whatsapp: "5219993183525",                        // sin '+', formato wa.me
    moneda: "MXN",
    tamanos: ["100g", "250g", "454g", "500g", "1kg"], // orden de los botones (454 g = 1 lb)
    etiquetasTamano: { "100g": "100 g", "250g": "250 g", "454g": "454 g (1 lb)", "500g": "500 g", "1kg": "1 kg" },
    molienda: ["grano", "molido"],
    etiquetasMolienda: { grano: "Grano", molido: "Molido" },
    defaults: { tamano: "250g", molienda: "grano" },  // menor fricción, precio siempre visible

    lineas: [
      {
        id: "puma", nombre: "Puma", especie: "Puma concolor",
        perfil: "Tueste oscuro de cuerpo redondo: chocolate, avellana y caramelo.",
        notas: ["Chocolate", "Avellana", "Caramelo"], tueste: "Oscuro", destacada: true,
        precios: { "100g": { grano: 52, molido: 51 }, "250g": { grano: 119, molido: 116 }, "454g": 250, "500g": 225, "1kg": 450 }
      },
      {
        id: "armadillo", nombre: "Armadillo", especie: "Dasypus novemcinctus",
        perfil: "Tueste medio claro, vivo y aromático: frutal, floral y especiado.",
        notas: ["Frutal", "Floral", "Especiado"], tueste: "Medio claro",
        precios: { "100g": { grano: 52, molido: 51 }, "250g": { grano: 119, molido: 116 }, "454g": 250, "500g": 225, "1kg": 450 }
      },
      {
        id: "jaguar", nombre: "Jaguar", especie: "Panthera onca",
        perfil: "Tueste medio oscuro con carácter: contraste entre notas florales y resinosas.",
        notas: ["Floral", "Resinoso"], tueste: "Medio oscuro",
        precios: { "100g": 53, "250g": 122, "454g": 260, "500g": 233, "1kg": 460 }
      },
      {
        id: "oso-negro", nombre: "Oso Negro", especie: "Ursus americanus",
        perfil: "Tueste oscuro e intenso, con equilibrio entre amargos y dulces.",
        notas: ["Amargo", "Dulce"], tueste: "Oscuro",
        precios: { "100g": 54, "250g": 119, "454g": 250, "500g": 225, "1kg": 450 }
      },
      {
        id: "flamingo", nombre: "Flamingo", especie: "Phoenicopterus ruber",
        perfil: "Descafeinado por proceso al agua natural, sin químicos: todo el sabor, sin cafeína.",
        notas: ["Descafeinado", "Proceso al agua"], tueste: "Descafeinado",
        precios: { "100g": 64, "250g": 147, "454g": 281, "500g": 284, "1kg": 558 }
      }
    ]
  };

  /* Fauna en line-art (grabado de historia natural, Salvia, decorativo aria-hidden).
     Un motivo por línea. Trazo fino, fill:none. */
  const FAUNA = {
    "puma":
      '<svg class="fauna" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M32 55c-6.5 0-11-3.6-11-8 0-4 3.6-6.6 11-6.6S43 43 43 47c0 4.4-4.5 8-11 8Z"/>' +
      '<ellipse cx="18.5" cy="33" rx="3.2" ry="4.6"/><ellipse cx="27" cy="26" rx="3.3" ry="5"/>' +
      '<ellipse cx="37" cy="26" rx="3.3" ry="5"/><ellipse cx="45.5" cy="33" rx="3.2" ry="4.6"/></svg>',
    "armadillo":
      '<svg class="fauna" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 44c2-13 11-21 21-20 6 .4 11 4 14 10"/><path d="M11 44h35"/>' +
      '<path d="M22 25c-2 4-3 11-3 19"/><path d="M31 24c-1 5-1 11-1 20"/><path d="M40 26c-.5 5-.5 10-.5 18"/>' +
      '<path d="M47 34c4-.5 8 1 9.5 4-2 2-6 2-9-.5"/><path d="M12 44c-3 1-5 3-6 6"/><path d="M20 44v7M27 44v7"/></svg>',
    "jaguar":
      '<svg class="fauna" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M32 56c-6 0-10.5-3.4-10.5-7.5 0-3.8 3.4-6.2 10.5-6.2s10.5 2.4 10.5 6.2C42.5 52.6 38 56 32 56Z"/>' +
      '<ellipse cx="19" cy="35" rx="3" ry="4.4"/><ellipse cx="27" cy="29" rx="3.1" ry="4.7"/>' +
      '<ellipse cx="37" cy="29" rx="3.1" ry="4.7"/><ellipse cx="45" cy="35" rx="3" ry="4.4"/>' +
      '<circle cx="12" cy="20" r="2.4"/><circle cx="52" cy="20" r="2.4"/><circle cx="32" cy="14" r="2"/></svg>',
    "oso-negro":
      '<svg class="fauna" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M32 56c-7.5 0-13-3.4-13-8.4 0-4.6 4.6-7 13-7s13 2.4 13 7c0 5-5.5 8.4-13 8.4Z"/>' +
      '<ellipse cx="15.5" cy="37" rx="2.8" ry="3.8"/><ellipse cx="23.5" cy="31" rx="2.9" ry="4.1"/>' +
      '<ellipse cx="32" cy="29" rx="3" ry="4.3"/><ellipse cx="40.5" cy="31" rx="2.9" ry="4.1"/>' +
      '<ellipse cx="48.5" cy="37" rx="2.8" ry="3.8"/>' +
      '<path d="M14.5 32.5l-1-2M23 26l-.5-2.2M32 24v-2.2M41 26l.5-2.2M49.5 32.5l1-2"/></svg>',
    "flamingo":
      '<svg class="fauna" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M40 13c2.6 0 4.4 1.7 4.4 3.9 0 1.3-.8 2.4-2 3l-3.4 1.7"/>' +
      '<path d="M41.5 20.5c-4.2 3.2-3.2 7.4-1 10.6s3.2 6.4-1 9.4"/>' +
      '<path d="M39 41c0 5.2-4.2 8.4-9.4 8.4S20 46 20 40.8c0-4.8 3.6-8 8.4-8.4"/>' +
      '<path d="M20.5 39c-3.4-.4-6-2-7.5-4.6"/><path d="M27.5 49.5V58M32.5 49.5V58"/><path d="M25 58h5M30.5 58h5"/></svg>'
  };

  const numeral = (i) => String(i + 1).padStart(2, "0");
  const svgWa = '<svg aria-hidden="true"><use href="#ico-wa"/></svg>';

  /* ═══════════════════ B) LÓGICA DE PRECIOS ═══════════════════ */
  function calcularPrecio(linea, tamano, molienda) {
    const p = linea.precios[tamano];
    return (p && typeof p === "object") ? p[molienda] : p; // objeto = precio por molienda
  }
  function formatoPrecio(n) {
    return "$" + n.toLocaleString("es-MX") + " " + MOMOTO.moneda;
  }
  function linkPedido(linea, tamano, molienda, precio) {
    const t = MOMOTO.etiquetasTamano[tamano];
    const m = MOMOTO.etiquetasMolienda[molienda];
    const p = formatoPrecio(precio);
    const msg = `Hola Momoto, quiero pedir: ${linea.nombre} · ${t} · ${m} — ${p}`;
    return `https://wa.me/${MOMOTO.whatsapp}?text=${encodeURIComponent(msg)}`;
  }
  function textoLatin(l) {
    const t = l.tueste === "Descafeinado" ? "Descafeinado" : "Tueste " + l.tueste.toLowerCase();
    return `${l.especie} · ${t}`;
  }

  /* ═══════════════════ C) RENDER DE FICHAS ═══════════════════ */
  function segBotones(opciones, etiquetas, activo, attr, recomendado) {
    return opciones.map((op) => {
      const on = op === activo;
      const extra = (recomendado && op === recomendado)
        ? ' <span class="visually-hidden">(recomendado para empezar)</span>' : "";
      return `<button type="button" role="radio" class="seg-btn${on ? " is-on" : ""}" aria-checked="${on}" tabindex="${on ? 0 : -1}" ${attr}="${op}">${etiquetas[op]}${extra}</button>`;
    }).join("");
  }

  function fichaHTML(l, i) {
    const d = MOMOTO.defaults;
    const precio0 = calcularPrecio(l, d.tamano, d.molienda);
    const notas = l.notas.map((n) => `<span class="taste">${n}</span>`).join("");
    const destac = l.destacada ? " ficha--destacada" : "";
    const badge = l.destacada ? `<span class="ficha-badge">Ideal para empezar</span>` : "";
    const recom = l.destacada ? "250g" : null;
    const selHint = l.destacada
      ? `<p class="sel-hint"><svg aria-hidden="true"><use href="#ico-leaf"/></svg>250 g es nuestra recomendación para empezar: rinde ~2 semanas y llega fresco.</p>`
      : "";

    return `
    <article class="ficha${destac}" data-linea="${l.id}" role="group" aria-roledescription="Ficha de café" aria-label="Línea ${l.nombre}">
      <div class="ficha-relato">
        <div class="ficha-head">
          <span class="ficha-num">${numeral(i)}</span>
          ${FAUNA[l.id] || ""}
        </div>
        ${badge}
        <h3>${l.nombre}</h3>
        <span class="latin">${textoLatin(l)}</span>
        <p class="ficha-perfil">${l.perfil}</p>
        <div class="tastes">${notas}</div>
      </div>
      <div class="ficha-operar">
        <div class="selector">
          <span class="sel-label" id="tam-${l.id}">Tamaño</span>
          <div class="seg" role="radiogroup" aria-labelledby="tam-${l.id}" data-grupo="tamano">
            ${segBotones(MOMOTO.tamanos, MOMOTO.etiquetasTamano, d.tamano, "data-tamano", recom)}
          </div>
        </div>
        ${selHint}
        <div class="selector">
          <span class="sel-label" id="mol-${l.id}">Molienda</span>
          <div class="seg" role="radiogroup" aria-labelledby="mol-${l.id}" data-grupo="molienda">
            ${segBotones(MOMOTO.molienda, MOMOTO.etiquetasMolienda, d.molienda, "data-molienda")}
          </div>
        </div>
        <div class="precio-row">
          <span class="precio" aria-live="polite">${formatoPrecio(precio0)}</span>
          <span class="precio-note">${MOMOTO.etiquetasTamano[d.tamano]} · ${MOMOTO.etiquetasMolienda[d.molienda]}</span>
        </div>
        <a class="btn btn--solid btn--block btn-pedido" href="${linkPedido(l, d.tamano, d.molienda, precio0)}" target="_blank" rel="noopener">
          ${svgWa}Pedir ${l.nombre} por WhatsApp
        </a>
      </div>
    </article>`;
  }

  const catalogo = document.getElementById("catalogo");
  if (catalogo) {
    catalogo.insertAdjacentHTML("beforeend", MOMOTO.lineas.map(fichaHTML).join(""));

    /* ═══════════════════ D) SELECTOR ACCESIBLE + RECÁLCULO ═══════════════════ */
    function refrescar(card) {
      const linea = MOMOTO.lineas.find((l) => l.id === card.dataset.linea);
      const tamano = card.querySelector('[data-grupo="tamano"] [aria-checked="true"]').dataset.tamano;
      const molienda = card.querySelector('[data-grupo="molienda"] [aria-checked="true"]').dataset.molienda;
      const precio = calcularPrecio(linea, tamano, molienda);
      const precioEl = card.querySelector(".precio");
      precioEl.textContent = formatoPrecio(precio);
      precioEl.classList.remove("is-anim"); void precioEl.offsetWidth; precioEl.classList.add("is-anim");
      card.querySelector(".precio-note").textContent =
        MOMOTO.etiquetasTamano[tamano] + " · " + MOMOTO.etiquetasMolienda[molienda];
      card.querySelector(".btn-pedido").href = linkPedido(linea, tamano, molienda, precio);
    }

    function seleccionar(btn) {
      const grupo = btn.closest(".seg");
      grupo.querySelectorAll(".seg-btn").forEach((b) => {
        b.setAttribute("aria-checked", "false"); b.classList.remove("is-on"); b.tabIndex = -1;
      });
      btn.setAttribute("aria-checked", "true"); btn.classList.add("is-on"); btn.tabIndex = 0;
      refrescar(btn.closest(".ficha"));
    }

    // Click delegado
    catalogo.addEventListener("click", (e) => {
      const btn = e.target.closest(".seg-btn");
      if (btn) seleccionar(btn);
    });
    // Teclado del segmented (flechas / Home / End) — patrón radio
    catalogo.addEventListener("keydown", (e) => {
      const btn = e.target.closest(".seg-btn");
      if (!btn) return;
      const btns = [...btn.closest(".seg").querySelectorAll(".seg-btn")];
      let i = btns.indexOf(btn), n = i;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % btns.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + btns.length) % btns.length;
      else if (e.key === "Home") n = 0;
      else if (e.key === "End") n = btns.length - 1;
      else return;
      e.preventDefault(); btns[n].focus(); seleccionar(btns[n]);
    });
  }

  /* ═══════════════════ E) HEADER (sólido) + SCROLL-SPY ═══════════════════ */
  const header = document.getElementById("siteHeader");
  const hero = document.getElementById("inicio");

  if (header && hero && "IntersectionObserver" in window) {
    // Header: transparente sobre el hero → sólido al salir de él
    new IntersectionObserver(([entry]) => {
      header.classList.toggle("is-solid", !entry.isIntersecting);
    }, { rootMargin: `-${72}px 0px 0px 0px`, threshold: 0 }).observe(hero);
  }

  // Scroll-spy: marca el enlace activo (desktop + móvil). #resenas queda fuera.
  const spyIds = ["cafe", "proceso", "nosotros", "contacto"];
  const secciones = spyIds.map((id) => document.getElementById(id)).filter(Boolean);
  const enlaces = [...document.querySelectorAll('.nav-links a, .mobile-nav__links a')];

  function activar(id) {
    enlaces.forEach((a) => {
      a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
    });
  }
  if (secciones.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) activar(en.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    secciones.forEach((s) => spy.observe(s));
  }

  /* ═══════════════════ F) MENÚ MÓVIL (focus-trap, Esc) ═══════════════════ */
  const toggle = document.getElementById("navToggle");
  const panel = document.getElementById("mobileNav");
  const cerrar = document.getElementById("navClose");

  if (toggle && panel) {
    const foco = () => [...panel.querySelectorAll('a[href], button:not([disabled])')]
      .filter((el) => el.offsetParent !== null || el === cerrar);

    function abrirMenu() {
      panel.classList.add("is-open");
      panel.setAttribute("aria-hidden", "false");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Cerrar menú");
      document.body.classList.add("menu-open");
      (cerrar || foco()[0]).focus();
    }
    function cerrarMenu(devolverFoco) {
      panel.classList.remove("is-open");
      panel.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menú");
      document.body.classList.remove("menu-open");
      if (devolverFoco !== false) toggle.focus();
    }

    toggle.addEventListener("click", abrirMenu);
    if (cerrar) cerrar.addEventListener("click", () => cerrarMenu());
    // Cerrar al tocar un enlace del menú
    panel.querySelectorAll(".mobile-nav__links a").forEach((a) =>
      a.addEventListener("click", () => cerrarMenu(false)));

    // Esc + focus-trap
    document.addEventListener("keydown", (e) => {
      if (!panel.classList.contains("is-open")) return;
      if (e.key === "Escape") { e.preventDefault(); cerrarMenu(); return; }
      if (e.key === "Tab") {
        const f = foco();
        if (!f.length) return;
        const primero = f[0], ultimo = f[f.length - 1];
        if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
        else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
      }
    });
  }

  /* ═══════════════════ G) REVEAL ON-SCROLL ═══════════════════ */
  const animados = [...document.querySelectorAll("[data-anim]")];
  if (animados.length && "IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const rev = new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); obs.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
    animados.forEach((el) => rev.observe(el));
  } else {
    animados.forEach((el) => el.classList.add("is-in"));
  }

  /* ═══════════════════ H) AÑO DINÁMICO ═══════════════════ */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ═══════════════════ I) PUENTE PARA carrito.js ═══════════════════ */
  window.__MOMOTO = { datos: MOMOTO, precio: calcularPrecio, formato: formatoPrecio };
})();
