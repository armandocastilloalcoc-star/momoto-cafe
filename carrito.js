/* ============================================================
   MOMOTO CAFÉ · carrito.js
   Carrito de compras + pago del total con Stripe Checkout
   + rastreo de pedido (DHL).
   Sin dependencias. Usa window.__MOMOTO expuesto por main.js.
   Envío: GRATIS a todo México.
   ============================================================ */
(function () {
  "use strict";
  const M = window.__MOMOTO;
  if (!M) return;
  const { datos, precio, formato } = M;

  const GRAMOS = { "100g": 100, "250g": 250, "454g": 454, "500g": 500, "1kg": 1000 };
  const ENVIO_TARIFA = 199;        // MXN, promedio DHL nacional
  const ENVIO_GRATIS_DESDE = 5000; // gramos (5 kg)
  const LS_KEY = "momoto_carrito_v1";

  /* ───────────── Estado ───────────── */
  let carrito = [];
  try { carrito = JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { carrito = []; }
  if (!Array.isArray(carrito)) carrito = [];

  const guardar = () => { try { localStorage.setItem(LS_KEY, JSON.stringify(carrito)); } catch {} };
  const lineaDe = (id) => datos.lineas.find((l) => l.id === id);
  const pesoTotal = () => carrito.reduce((s, it) => s + GRAMOS[it.tamano] * it.cantidad, 0);
  const subtotal  = () => carrito.reduce((s, it) => s + precio(lineaDe(it.id), it.tamano, it.molienda) * it.cantidad, 0);
  const costoEnvio = () => 0; // Envío GRATIS a todo México
  const totalPiezas = () => carrito.reduce((s, it) => s + it.cantidad, 0);

  // Robustez: descarta ítems corruptos u obsoletos del localStorage para que un dato malo no rompa el carrito
  carrito = carrito
    .filter((it) => it && lineaDe(it.id) && GRAMOS[it.tamano] && datos.etiquetasMolienda[it.molienda] && Number(it.cantidad) > 0)
    .map((it) => ({ id: it.id, tamano: it.tamano, molienda: it.molienda, cantidad: Math.min(50, Math.max(1, Math.floor(Number(it.cantidad)))) }));
  guardar();

  function agregar(id, tamano, molienda) {
    const ya = carrito.find((it) => it.id === id && it.tamano === tamano && it.molienda === molienda);
    if (ya) ya.cantidad = Math.min(ya.cantidad + 1, 50);
    else carrito.push({ id, tamano, molienda, cantidad: 1 });
    guardar(); render(); abrir();
  }
  function cambiarCantidad(idx, delta) {
    const it = carrito[idx];
    if (!it) return;
    it.cantidad += delta;
    if (it.cantidad <= 0) carrito.splice(idx, 1);
    guardar(); render();
  }

  /* ───────────── UI: botón del header ───────────── */
  const header = document.getElementById("siteHeader");
  const btnHeader = document.createElement("button");
  btnHeader.className = "cart-btn";
  btnHeader.id = "cartOpen";
  btnHeader.setAttribute("aria-label", "Abrir carrito");
  btnHeader.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 7h12l-1.2 12.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 7Z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/></svg>' +
    '<span class="cart-count" id="cartCount" hidden>0</span>';
  const navToggle = document.getElementById("navToggle");
  if (header) header.insertBefore(btnHeader, navToggle || null);

  /* ───────────── UI: drawer ───────────── */
  const drawer = document.createElement("div");
  drawer.id = "cartDrawer";
  drawer.className = "cart-drawer";
  drawer.setAttribute("aria-hidden", "true");
  drawer.innerHTML = `
    <div class="cart-drawer__overlay" id="cartOverlay"></div>
    <aside class="cart-drawer__panel" role="dialog" aria-modal="true" aria-label="Tu carrito">
      <div class="cart-drawer__head">
        <h3>Tu carrito</h3>
        <button type="button" class="cart-drawer__close" id="cartClose" aria-label="Cerrar carrito">
          <svg aria-hidden="true"><use href="#ico-close"/></svg>
        </button>
      </div>
      <div class="cart-drawer__items" id="cartItems"></div>
      <div class="cart-drawer__resumen" id="cartResumen"></div>
      <div class="cart-drawer__acciones">
        <button type="button" class="btn btn--solid btn--block" id="cartPagar">Pagar con tarjeta</button>
        <button type="button" class="btn btn--paypal btn--block" id="cartPaypal" hidden>Pagar con PayPal</button>
        <a class="btn btn--ghost btn--block" id="cartWhats" href="#" target="_blank" rel="noopener">Completar por WhatsApp</a>
        <p class="cart-drawer__nota">Pago seguro con Stripe o PayPal. <strong>Envío GRATIS</strong> a todo México.</p>
      </div>
    </aside>`;
  document.body.appendChild(drawer);

  const $items = drawer.querySelector("#cartItems");
  const $resumen = drawer.querySelector("#cartResumen");
  const $pagar = drawer.querySelector("#cartPagar");
  const $paypal = drawer.querySelector("#cartPaypal");
  const $whats = drawer.querySelector("#cartWhats");
  const $count = btnHeader.querySelector("#cartCount");

  let _lastFocus = null;
  const _panel = drawer.querySelector(".cart-drawer__panel");
  function abrir()  {
    _lastFocus = document.activeElement;
    drawer.classList.add("is-open"); drawer.setAttribute("aria-hidden", "false"); document.body.classList.add("cart-open");
    const close = drawer.querySelector("#cartClose"); if (close) close.focus();
  }
  function cerrar() {
    drawer.classList.remove("is-open"); drawer.setAttribute("aria-hidden", "true"); document.body.classList.remove("cart-open");
    if (_lastFocus && _lastFocus.focus) _lastFocus.focus();
  }

  btnHeader.addEventListener("click", abrir);
  drawer.querySelector("#cartClose").addEventListener("click", cerrar);
  drawer.querySelector("#cartOverlay").addEventListener("click", cerrar);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && drawer.classList.contains("is-open")) cerrar(); });
  // Focus-trap: mantener el Tab dentro del carrito mientras está abierto (accesibilidad del modal)
  drawer.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || !drawer.classList.contains("is-open")) return;
    let f = _panel.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])');
    f = Array.prototype.filter.call(f, (el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  function render() {
    // Contador del header
    const n = totalPiezas();
    $count.hidden = n === 0;
    $count.textContent = n;

    // Renglones
    if (!carrito.length) {
      $items.innerHTML = '<p class="cart-vacio">Tu carrito está vacío.<br>Elige tu animal en la sección Café.</p>';
    } else {
      $items.innerHTML = carrito.map((it, i) => {
        const l = lineaDe(it.id);
        const pu = precio(l, it.tamano, it.molienda);
        return `
        <div class="cart-item">
          <div class="cart-item__info">
            <strong>${l.nombre}</strong>
            <span>${datos.etiquetasTamano[it.tamano]} · ${datos.etiquetasMolienda[it.molienda]}</span>
            <span class="cart-item__precio">${formato(pu)} c/u</span>
          </div>
          <div class="cart-item__qty">
            <button type="button" data-menos="${i}" aria-label="Quitar uno">−</button>
            <span aria-live="polite">${it.cantidad}</span>
            <button type="button" data-mas="${i}" aria-label="Agregar uno">+</button>
          </div>
        </div>`;
      }).join("");
    }

    // Resumen — envío GRATIS a todo México
    const sub = subtotal();
    $resumen.innerHTML = !carrito.length ? "" : `
      <div class="cart-linea"><span>Subtotal</span><span>${formato(sub)}</span></div>
      <div class="cart-linea"><span>Envío a todo México</span><span class="cart-envio-gratis">GRATIS</span></div>
      <div class="cart-linea cart-linea--total"><span>Total</span><span>${formato(sub)}</span></div>`;

    $pagar.disabled = !carrito.length;
    $paypal.disabled = !carrito.length;

    // Alternativa WhatsApp con el detalle del carrito
    const msg = "Hola Momoto, quiero pedir:\n" + carrito.map((it) => {
      const l = lineaDe(it.id);
      return `• ${it.cantidad}× ${l.nombre} ${datos.etiquetasTamano[it.tamano]} ${datos.etiquetasMolienda[it.molienda]}`;
    }).join("\n") + `\nTotal estimado: ${formato(sub)} · Envío GRATIS`;
    $whats.href = `https://wa.me/${datos.whatsapp}?text=${encodeURIComponent(msg)}`;
  }

  $items.addEventListener("click", (e) => {
    const menos = e.target.closest("[data-menos]");
    const mas = e.target.closest("[data-mas]");
    if (!menos && !mas) return;
    const idx = Number(menos ? menos.dataset.menos : mas.dataset.mas);
    cambiarCantidad(idx, menos ? -1 : +1);
    // a11y: devolver el foco al mismo control tras el re-render del carrito
    const sel = menos ? `[data-menos="${idx}"]` : `[data-mas="${idx}"]`;
    const el = $items.querySelector(sel) || $items.querySelector("button") || $pagar;
    if (el && el.focus) el.focus();
  });

  /* ───────────── Pago: Stripe Checkout ───────────── */
  $pagar.addEventListener("click", async () => {
    if (!carrito.length) return;
    $pagar.disabled = true;
    const txt = $pagar.textContent;
    $pagar.textContent = "Preparando pago…";
    try {
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: carrito })
      });
      const data = await r.json();
      if (r.ok && data.url) {
        if (typeof gtag === "function") gtag("event", "begin_checkout", { currency: "MXN", value: subtotal() + costoEnvio() });
        window.location.href = data.url; // Stripe Checkout
      } else {
        alert(data.error || "No se pudo iniciar el pago. Intenta de nuevo o pide por WhatsApp.");
      }
    } catch {
      alert("Error de conexión. Intenta de nuevo o pide por WhatsApp.");
    } finally {
      $pagar.textContent = txt;
      $pagar.disabled = !carrito.length;
    }
  });

  /* ───────────── Pago: PayPal (redirección) ───────────── */
  // El botón solo aparece si PayPal está configurado Y en modo real (live).
  // En sandbox queda oculto para clientes; se prueba con ?pptest=1 en la URL.
  fetch("/api/paypal-config")
    .then((r) => r.json())
    .then((cfg) => {
      const testMode = /[?&]pptest=1/.test(location.search);
      if (cfg && cfg.enabled && (cfg.env === "live" || testMode)) $paypal.hidden = false;
    })
    .catch(() => {});

  $paypal.addEventListener("click", async () => {
    if (!carrito.length) return;
    $paypal.disabled = true;
    const txt = $paypal.textContent;
    $paypal.textContent = "Preparando PayPal…";
    try {
      const r = await fetch("/api/paypal-create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: carrito })
      });
      const data = await r.json();
      if (r.ok && data.url) {
        if (typeof gtag === "function") gtag("event", "begin_checkout", { currency: "MXN", value: subtotal() + costoEnvio() });
        window.location.href = data.url; // Aprobación de PayPal
      } else {
        alert(data.error || "No se pudo iniciar PayPal. Intenta de nuevo o pide por WhatsApp.");
      }
    } catch {
      alert("Error de conexión. Intenta de nuevo o pide por WhatsApp.");
    } finally {
      $paypal.textContent = txt;
      $paypal.disabled = !carrito.length;
    }
  });

  /* ───────────── Botones "Agregar al carrito" en cada ficha ───────────── */
  document.querySelectorAll(".ficha").forEach((card) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn--solid btn--block btn-carrito";
    btn.textContent = "Agregar al carrito";
    const pedirBtn = card.querySelector(".btn-pedido");
    pedirBtn.parentNode.insertBefore(btn, pedirBtn);
    btn.addEventListener("click", () => {
      const tamano = card.querySelector('[data-grupo="tamano"] [aria-checked="true"]').dataset.tamano;
      const molienda = card.querySelector('[data-grupo="molienda"] [aria-checked="true"]').dataset.molienda;
      agregar(card.dataset.linea, tamano, molienda);
      if (typeof gtag === "function") gtag("event", "add_to_cart", { currency: "MXN" });
    });

    // Suscripción mensual (−10%) — cobro recurrente con Stripe
    const subBtn = document.createElement("button");
    subBtn.type = "button";
    subBtn.className = "btn btn--sub btn--block btn-suscribir";
    subBtn.textContent = "Suscríbete cada mes · −10%";
    pedirBtn.parentNode.insertBefore(subBtn, pedirBtn);
    const subNota = document.createElement("small");
    subNota.className = "sub-nota";
    subNota.textContent = "Cancela cuando quieras · sin permanencia";
    pedirBtn.parentNode.insertBefore(subNota, pedirBtn);
    subBtn.addEventListener("click", async () => {
      const tamano = card.querySelector('[data-grupo="tamano"] [aria-checked="true"]').dataset.tamano;
      const molienda = card.querySelector('[data-grupo="molienda"] [aria-checked="true"]').dataset.molienda;
      subBtn.disabled = true; const txt = subBtn.textContent; subBtn.textContent = "Preparando…";
      try {
        const r = await fetch("/api/create-subscription", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: card.dataset.linea, tamano, molienda }) });
        const d = await r.json();
        if (r.ok && d.url) window.location.href = d.url;
        else alert(d.error || "No se pudo iniciar la suscripción. Intenta de nuevo o pide por WhatsApp.");
      } catch { alert("Error de conexión. Intenta de nuevo."); }
      finally { subBtn.textContent = txt; subBtn.disabled = false; }
    });
  });

  // La banda de pago ahora abre el carrito
  const bandBtn = document.getElementById("pagoBandBtn");
  if (bandBtn) bandBtn.addEventListener("click", (e) => { e.preventDefault(); abrir(); });

  /* ───────────── Rastreo multi-paquetería (Estafeta / DHL / FedEx) ───────────── */
  const rastreoForm = document.getElementById("rastreoForm");
  if (rastreoForm) {
    const $g = document.getElementById("rastreoGuia");
    const $out = document.getElementById("rastreoResultado");
    const TRACK = {
      estafeta: (g) => g ? `https://rastreo.estafeta.com/RastreoWebInternet/consultaEnvio.do?numero=${encodeURIComponent(g)}` : "https://www.estafeta.com/herramientas/rastreo",
      dhl:      (g) => g ? `https://www.dhl.com/mx-es/home/rastreo.html?tracking-id=${encodeURIComponent(g)}` : "https://www.dhl.com/mx-es/home/rastreo.html",
      fedex:    (g) => g ? `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(g)}` : "https://www.fedex.com/es-mx/tracking.html",
    };
    const NOM = { estafeta: "Estafeta", dhl: "DHL", fedex: "FedEx" };
    rastreoForm.addEventListener("submit", (e) => e.preventDefault());
    rastreoForm.addEventListener("click", (e) => {
      const b = e.target.closest(".rastreo-carrier");
      if (!b) return;
      const c = b.dataset.carrier;
      const g = ($g.value || "").trim();
      if (!g) { $out.textContent = "Escribe tu número de guía y elige la paquetería."; $g.focus(); return; }
      window.open(TRACK[c](g), "_blank", "noopener");
      $out.textContent = `Abrimos el rastreo de ${NOM[c]} en una pestaña nueva.`;
    });
  }

  render();
})();
