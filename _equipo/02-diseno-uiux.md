# 02 · Diseño UI/UX — Momoto Café «A la sombra»

> Especificación de implementación, sección por sección, para el `desarrollador-web`.
> Extiende con coherencia total el **PREVIEW YA APROBADO** (`preview.html`) y obedece la
> **Dirección Creativa** (`01-direccion-creativa.md`). El contenido, precios, líneas y contactos
> son los **REALES** tomados de `momoto-mejorada/index.html` — **no inventar nada**.
>
> Sitio estático para GitHub + Netlify. Español de México. Mobile-first. Accesibilidad AA.
>
> **Regla maestra:** el preview define el lenguaje visual real (tokens, hero, ficha editorial,
> capítulo oscuro duotono). Este documento lo **completa** hasta cubrir TODO el sitio; no lo
> reinventa. Si algo entra en conflicto, gana el preview + la dirección creativa.

---

## 0. Principios rectores (los 6 adjetivos, aplicados)

Cada decisión se justifica contra: **Sereno · Profundo · Refinado · Botánico · Editorial · Preciado**.

- **Aire protagonista.** El vacío es lujo. Padding de sección `clamp(96px, 15vw, 190px)`. No rellenar.
- **Casi monocromo.** Verde profundo + papel; la vida entra por destellos (Cereza ≤ 2 %, Salvia sobre oscuro).
- **Ritmo de capítulos claro/oscuro a sangre**, como pliegos de revista.
- **Superficies planas + filetes de 1px.** Sombras al mínimo (una sola, muy tenue, y casi nunca).
- **Cormorant grande para emocionar; Inter impecable para leer y operar** (precios, selectores, labels).
- **Motion lento y contenido**, cero rebote, `prefers-reduced-motion` respetado.
- **Scroll vertical anclado** (mejor SEO/accesibilidad/conversión), con navegación por menú + scroll-spy.

---

## 1. Tokens de diseño (CSS `:root`)

Confirmados del preview + los que faltaban para cubrir todo el sitio. Van en `styles.css`.

```css
:root{
  /* ---- Color: núcleo ---- */
  --verde-sombra:#062B26;   /* fondo oscuro principal, CTA sólido sobre papel */
  --verde-selva:#0E4A40;    /* superficie 2ª en oscuro · "tinta verde" AA sobre papel (labels/links) */
  --papel:#F4EFE6;          /* fondo claro principal */
  --tinta:#231E1B;          /* texto principal sobre papel */
  --salvia:#8FB8A6;         /* acento frío: labels/CTA sobre oscuro, filetes, fauna */
  --cereza:#B23A2E;         /* acento cálido escaso 1–2 %: filete, punto activo, énfasis */
  --arena:#E3DACB;          /* filetes/divisores 1px sobre papel */
  --gris-cacao:#5B544B;     /* texto secundario/leyendas sobre papel (AA 6.5:1) */

  /* ---- Color: derivados de opacidad (sobre oscuro) ---- */
  --papel-72:rgba(244,239,230,.72);  /* texto secundario sobre oscuro (AA holgado) */
  --papel-60:rgba(244,239,230,.60);  /* leyendas/subtítulos sobre oscuro */
  --salvia-linea:rgba(143,184,166,.18); /* filetes/hairlines sobre oscuro */
  --salvia-borde:rgba(143,184,166,.30); /* marco interior de duotono */

  /* ---- Tipografía ---- */
  --display:"Cormorant Garamond","Fraunces",Georgia,serif;
  --ui:"Inter",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;

  /* ---- Espaciado base-8 (saltos amplios) ---- */
  --sp-1:4px; --sp-2:8px; --sp-3:12px; --sp-4:16px; --sp-5:24px;
  --sp-6:32px; --sp-7:48px; --sp-8:64px; --sp-9:96px; --sp-10:128px; --sp-11:160px;

  /* ---- Radios (crisp, casi rectos: lujo editorial, no "app") ---- */
  --r-xs:2px;   /* botones, segmentos, chips cuadrados */
  --r-sm:3px;   /* swatches, contenedores pequeños */
  --r-pill:999px; /* SOLO taste pills y dots — nunca botones grandes */

  /* ---- Sombra (una sola, difusa, tenue; usar con máxima moderación) ---- */
  --shadow-soft:0 18px 48px rgba(6,43,38,.10); /* solo panel móvil / overlay si hace falta */

  /* ---- Filetes / hairlines ---- */
  --hair:1px solid var(--arena);          /* divisor sobre papel */
  --hair-dark:1px solid var(--salvia-linea); /* divisor sobre oscuro */

  /* ---- Motion ---- */
  --ease:cubic-bezier(.16,1,.3,1);  /* entradas/hover: asienta lento, cero rebote */
  --dur-1:.4s;   /* micro (color, borde) */
  --dur-2:.6s;   /* reveal corto */
  --dur-3:.82s;  /* reveal on-scroll */
  --dur-kb:40s;  /* Ken Burns hero */

  /* ---- Layout ---- */
  --wrap:1240px;           /* ancho máx de contenido */
  --measure:64ch;          /* medida de texto cómoda (60–66ch) */
  --header-h:72px;         /* alto del header cuando queda sólido */
  --wa-bar-h:56px;         /* alto de la barra WhatsApp móvil */
}
```

**Confirmaciones del preview que NO cambian:** los 8 colores núcleo, las dos familias, `--ease`,
el radio `2px` de botones, el grano de archivo (`body::after`, opacity ~.045), el filtro duotono
SVG (`#duo`) con los `tableValues` exactos, el `.eyebrow::before` (filete Cereza de 26px).

**Notas de uso de color (no negociables, de la dirección):**
- **Cereza Rara** = condimento. Máx 1–2 % de superficie. Nunca fondo de sección ni botón grande.
  Sobre oscuro es **solo decorativa** (punto/filete), **nunca texto** (falla contraste).
- **Salvia** vive sobre oscuro. Para "verde" sobre papel usar **Verde Selva** (AA).
- Prohibidos: oro/degradados dorados, verde neón de WhatsApp, sombras dramáticas, tarjetas pesadas.

---

## 2. Rejilla, contenedores y capítulos

- **Contenedor `.wrap`:** `max-width:var(--wrap)`, `margin-inline:auto`,
  `padding-inline:clamp(22px,5vw,64px)` (idéntico al preview).
- **Contenedor angosto** para texto de lectura larga (aviso, párrafos): `max-width:720px`.
- **Capítulo `.chapter`:** `padding-block:clamp(96px,15vw,190px)`.
- **Capítulo oscuro `.dark`:** `background:var(--verde-sombra); color:var(--papel)` a sangre completa.
- **Rejilla editorial asimétrica.** Preferir alineación a la izquierda con margen derecho amplio.
  Centrar solo momentos de manifiesto (hero eyebrow/H1, cita, cierre). Las `section-head` NO se
  centran salvo indicación (en el preview están a la izquierda con `max-width:640px`).
- **Orden de capítulos (claro→oscuro→claro→oscuro…):**
  1. Hero (oscuro, foto)
  2. Catálogo "Elige tu animal" (papel)
  3. Frescura + Envíos (papel, franjas)
  4. Proceso 01–06 (oscuro, duotono)
  5. Nosotros + credenciales (papel)
  6. Reseñas (papel, **oculto**)
  7. Contacto + footer (oscuro)

`scroll-margin-top:calc(var(--header-h) + 16px)` en cada `<section id>` para que el ancla no quede
bajo el header sólido.

---

## 3. Navegación

### 3.1 Header (scroll-spy sobre scroll anclado)

Estado A — **sobre el hero (transparente):**
```css
.site-header{position:fixed;top:0;left:0;right:0;z-index:20;
  display:flex;align-items:center;justify-content:space-between;
  padding:clamp(18px,3vw,30px) clamp(22px,5vw,64px);
  background:transparent;transition:background .3s var(--ease),padding .3s var(--ease),border-color .3s;
  border-bottom:1px solid transparent}
```
- Logo: `assets/logo-white.png`, `height:36px` (versión clara para foto oscura del hero).
- Links: `Café · Proceso · Nosotros · Contacto` (anclas `#cafe #proceso #nosotros #contacto`).
  Inter, `font-size:.8125rem; letter-spacing:.14em; text-transform:uppercase; color:var(--papel-72)`.
  Hover → `color:var(--salvia)`, `transition:.3s var(--ease)`.
- **No** metemos el CTA WhatsApp en el header desktop (la barra/FAB persistente ya cubre eso y
  mantiene el minimalismo). Sí en el panel móvil.

Estado B — **scrolleado (sólido), al pasar el hero** (JS añade `.is-solid` tras `scrollY > 80vh` o
al salir del hero con IntersectionObserver):
```css
.site-header.is-solid{background:rgba(6,43,38,.92);
  -webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);
  padding-block:14px;border-bottom-color:var(--salvia-linea)}
```
- Al volverse sólido, el header conserva el logo blanco (fondo Verde Sombra translúcido).

**Scroll-spy:** IntersectionObserver sobre las secciones `#cafe #proceso #nosotros #contacto`
(rootMargin `-45% 0px -50% 0px`). El link activo recibe `.is-active`:
- Subrayado activo con **filete Cereza** (el único destello del nav):
  `border-bottom:1.5px solid var(--cereza)` o pseudo-elemento animado (width 0→100%, `.32s var(--ease)`),
  `color:var(--salvia)`. **No** cambiar `resenas` (está oculto y fuera del spy).

### 3.2 Menú móvil (overlay elegante) — `<720px`

- El header muestra un botón hamburguesa (44×44px, `aria-label="Abrir menú"`,
  `aria-expanded`, `aria-controls="mobileNav"`), 3 líneas Papel Hueso que se transforman en X.
- Overlay a pantalla completa, **fondo Verde Sombra sólido** (sin foto ruidosa; opcional textura
  `cortina.jpg` a `opacity:.06; mix-blend-mode:soft-light` para dar profundidad, muy sutil):
```css
.mobile-nav{position:fixed;inset:0;z-index:100;display:flex;flex-direction:column;
  padding:calc(var(--header-h) + 24px) clamp(24px,7vw,48px) 32px;
  background:var(--verde-sombra);color:var(--papel);
  transform:translateX(100%);transition:transform .4s var(--ease);visibility:hidden}
.mobile-nav.is-open{transform:none;visibility:visible}
```
- Links en **Cormorant 400, `font-size:1.75rem`**, uno por línea, separados por `--hair-dark`,
  `min-height:56px`, `padding-block:14px`. Activo (spy) → `color:var(--salvia)`.
- Botón cerrar arriba-derecha (44×44, `aria-label="Cerrar menú"`).
- Al fondo: **CTA WhatsApp marca-primero** (botón sólido Salvia sobre oscuro, ver §11) +
  fila de contacto discreta: `Tel. (999) 286 4269` y `info@momotocafe.com` (links Salvia).
- Comportamiento: `body.menu-open{overflow:hidden}`, **focus-trap** dentro del panel, cerrar con
  `Esc`, con el botón X, o al tocar un enlace. Devolver foco al botón hamburguesa al cerrar.
- La barra WhatsApp persistente se **oculta** mientras el menú está abierto (`body.menu-open .wa-bar{display:none}`).

---

## 4. Hero (confirmado del preview + responsive)

Estructura del preview aprobada. Se conserva íntegra; aquí se detalla y se ajusta al contenido real.

- **Contenedor:** `min-height:100svh; display:flex; align-items:flex-end; background:var(--verde-sombra); overflow:hidden`.
- **Imagen LCP:** `assets/photos/cerezo.jpg` (única foto a color permitida). Graduada profunda:
  `filter:saturate(.82) brightness(.72) contrast(1.02)`, `transform:scale(1.05)` con **Ken Burns**
  `animation:kb 40s var(--ease) infinite alternate` (`to{transform:scale(1.14) translateY(-1.5%)}`).
  Marcar `fetchpriority="high"`, `decoding="async"`, `width/height` reales (1920×1080),
  y `<link rel="preload" as="image">` en el `<head>`. `object-position:center 42%`.
- **Scrim** (para AA del texto): el doble gradiente del preview (verde desde abajo + viñeta radial).
- **Contenido** (`.hero-inner`, `max-width:960px`, alineado a la izquierda dentro del `.wrap`,
  `padding-block:clamp(56px,10vh,120px)`):
  - **Eyebrow** (Salvia): `Café orgánico de especialidad · Sureste de México`.
  - **H1** Cormorant 400, `clamp(3rem,8vw,6.25rem)`, `line-height:1.02`, `text-wrap:balance`,
    color Papel: **"De la mata a tu _taza._"** — el `<em>` ("taza.") en italic 300 color Salvia.
  - **Lead** (`--papel-72`... el preview usa `rgba(244,239,230,.78)`, mantener), `max-width:52ch`:
    "Cultivado a la sombra de la selva por pequeños productores de Chiapas, Veracruz y Oaxaca.
    Tostado en lotes pequeños en Mérida."
  - **Pie del hero** (`.hero-foot`, flex, gap `clamp(20px,3vw,36px)`, `margin-top:44px`):
    - **CTA primario** `.btn--onDark` (Salvia sólido, texto Verde Sombra, glifo WhatsApp) →
      **"Pedir por WhatsApp"** con enlace real (§11).
    - **Ancla de precio** (`.price-anchor`): "**Desde** `$52` la bolsa de 100 g", el `$52` en Salvia
      con `tabular-nums`. **Dato real** (Puma/Armadillo 100 g grano).
- **Responsive:**
  - `≤720px`: nav-links ocultos (aparece hamburguesa); H1 `clamp(3rem,11vw,4rem)`; lead full-width
    `max-width:100%`; `.hero-foot` se apila (el botón full-width opcional, ver §11); mantener `100svh`.
  - `360–390px`: reducir `padding-inline` a 22px; el eyebrow puede ir a 2 líneas (ok).
  - `≥1280px`: `.hero-inner` no supera `960px`; el resto es aire a la derecha (asimetría editorial).

---

## 5. Catálogo "Elige tu animal" (capítulo papel)

### 5.1 Decisión de layout: **índice editorial en stack vertical** (no cuadrícula de tarjetas)

Las **5 líneas** se listan como una **secuencia vertical de fichas editoriales** a todo el ancho del
`.wrap`, separadas por **filetes hairline** (Arena) arriba y abajo — exactamente el patrón `.ficha`
del preview, repetido 5 veces. **No** hay carrusel ni grid de tarjetas gruesas (eso era el look viejo).
Esto respeta "catálogo como índice editorial" de la dirección y da un recorrido calmado y legible.

Cada ficha es una rejilla asimétrica de 2 columnas:
```css
.ficha{display:grid;grid-template-columns:1.15fr .85fr;gap:clamp(32px,5vw,72px);
  align-items:center;border-top:var(--hair);padding-block:clamp(40px,5vw,64px)}
.ficha:last-of-type{border-bottom:var(--hair)}
@media(max-width:820px){.ficha{grid-template-columns:1fr;gap:36px}}
```
- **Columna izquierda (relato):** numeral índice + line-art de fauna + nombre + placa latina/tueste +
  perfil + taste pills.
- **Columna derecha (operar):** selector Tamaño → selector Molienda → precio tabular en vivo → CTA WhatsApp.

Cabecera de sección (`.section-head`, izquierda, `max-width:640px`):
- Eyebrow (Verde Selva): **"La colección · Cinco guardianes de la selva"**.
  (Nota: son **5** líneas, no seis — corregir el "Seis guardianes" del preview, que era muestra.)
- H2 Cormorant: **"Elige tu animal."**
- Sub (Gris Cacao, ≤56ch): "Cada línea es un habitante de la selva y un carácter de taza.
  Elige tamaño y molienda; el precio se ajusta y armas tu pedido por WhatsApp."
- **CTA de baja fricción para el indeciso** (justo bajo la cabecera, discreto, `.btn--ghost`):
  "¿Cuál me recomiendas?" → WhatsApp con mensaje
  `Hola Momoto, ¿cuál café me recomiendan?`.

### 5.2 Columna izquierda — anatomía

- **Numeral índice** (`.ficha-num`): Cormorant 300, `clamp(3rem,7vw,5rem)`, `color:var(--verde-selva)`,
  `opacity:.55`. "01" … "05".
- **Line-art de fauna** (motivo botánico/zoológico, ver §12.4): SVG fino en **Salvia**, `~44–56px`,
  colocado junto al numeral o como marca de agua discreta arriba-derecha de la ficha (opacity ~.5).
  Un motivo por línea (puma, armadillo, jaguar, oso, flamingo). `aria-hidden="true"`.
- **Nombre** (`.ficha h3`): Cormorant 500, `clamp(2rem,4vw,2.8rem)`.
- **Placa latina + tueste** (`.latin`): Cormorant *400 italic*, Gris Cacao, `1.05rem`, estilo
  "placa de historia natural": `{Especie} · Tueste {x}`. Especies (editorial, opcional pero reales):
  - Puma → *Puma concolor* · Tueste oscuro
  - Armadillo → *Dasypus novemcinctus* · Tueste medio claro
  - Jaguar → *Panthera onca* · Tueste medio oscuro
  - Oso Negro → *Ursus americanus* · Tueste oscuro
  - Flamingo → *Phoenicopterus ruber* · Descafeinado
- **Perfil** (`.ficha-perfil`, Gris Cacao, ≤42ch): el texto real de cada línea (ver §5.5).
- **Taste pills** (`.tastes` → `.taste`): las **notas reales** de cada línea. Pill hairline:
  `border:1px solid var(--arena); border-radius:999px; padding:6px 14px; color:var(--verde-selva);
  font-size:.72rem; letter-spacing:.12em; text-transform:uppercase`.

### 5.3 Columna derecha — selector, precio en vivo y CTA

**Selector Tamaño** (`role="radiogroup"`, `aria-labelledby`): botones segmentados
```css
.seg button{font-family:var(--ui);font-size:.8125rem;font-weight:500;color:var(--tinta);
  background:transparent;border:1px solid var(--arena);border-radius:var(--r-xs);
  padding:10px 15px;cursor:pointer;transition:all .3s var(--ease);font-variant-numeric:tabular-nums;
  min-height:44px}                 /* 44px táctil AA */
.seg button:hover{border-color:var(--verde-selva)}
.seg button.on{background:var(--verde-sombra);color:var(--papel);border-color:var(--verde-sombra)}
```
- Etiquetas Tamaño (orden exacto): **100 g · 250 g · 454 g (1 lb) · 500 g · 1 kg**.
- Etiquetas Molienda: **Grano · Molido**.
- **Defaults (menor fricción, precio siempre visible):** `250 g` + `Grano`.
- Patrón radio accesible: `role="radio"`, `aria-checked`, roving `tabindex` (0 en el activo, -1 resto),
  flechas ←/→ mueven la selección, Home/End a extremos.

**Precio en vivo** (`.precio-row`, filete superior Arena):
```css
.precio{font-family:var(--ui);font-weight:600;font-size:clamp(1.9rem,3vw,2.4rem);
  letter-spacing:-.01em;font-variant-numeric:tabular-nums}
```
- Muestra `$###` + `<small>MXN</small>` (Gris Cacao). A la derecha `.precio-note` con el resumen:
  "`{tamaño}` · `{molienda}`" (p.ej. "250 g · en grano").
- Al cambiar tamaño/molienda, recalcular y **animar** con `precioIn` (opacity+translateY 6px→0, `.26s`).
  `aria-live="polite"` en el elemento de precio para lectores de pantalla.
- **Énfasis Cereza permitido aquí, mínimo:** un filete corto Cereza sobre el `.sel-label` (como en
  preview) o un punto Cereza en el precio activo. Nunca el precio completo en Cereza.

**CTA WhatsApp** (`.btn--solid`, ancho completo de la columna): Verde Sombra sólido, texto Papel,
glifo WhatsApp, `hover→Verde Selva` + `translateY(-2px)`. Texto: **"Pedir {Nombre} por WhatsApp"**.

**Mensaje de WhatsApp (lógica real, conservar exacta):**
```js
// número real de pedidos:
const WA = "5219993183525";  // wa.me, sin '+'
// plantilla:
const msg = `Hola Momoto, quiero pedir: ${nombre} · ${etiquetaTamano} · ${etiquetaMolienda} — ${precioFmt}`;
const href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
// precioFmt = "$" + n.toLocaleString("es-MX") + " MXN"
```
Ejemplo Puma/250 g/Grano/$119: `Hola Momoto, quiero pedir: Puma · 250 g · Grano — $119 MXN`.

### 5.4 Badge sutil "Ideal para empezar" (solo Puma)

Sin romper el minimalismo: **no** cinta llamativa. Opción aprobada:
- Un **eyebrow secundario** sobre el nombre de Puma: label Inter 600, `.7rem`, `letter-spacing:.18em`,
  MAYÚSCULAS, **Verde Selva**, precedido de un **filete Cereza de 18px** (mismo idioma que `.eyebrow`).
  Texto: **"Ideal para empezar"**. Nada de fondo de color ni pill sólida.
- Refuerzo opcional bajo el selector de Puma (hint, Gris Cacao, `.8125rem`):
  "250 g es nuestra recomendación para empezar: rinde ~2 semanas y llega fresco."
- La ficha de Puma puede llevar un **filete superior Cereza de 1px** (en lugar del Arena) como único
  distintivo estructural. Ese es el gasto de Cereza de toda la sección (dentro del 1–2 %).

### 5.5 Datos REALES de las 5 líneas (fuente: `MOMOTO.lineas`) — **no alterar**

Config global: `whatsapp:"5219993183525"`, `moneda:"MXN"`,
`tamanos:["100g","250g","454g","500g","1kg"]`,
`etiquetasTamano:{100g:"100 g",250g:"250 g",454g:"454 g (1 lb)",500g:"500 g",1kg:"1 kg"}`,
`molienda:["grano","molido"]`, `etiquetasMolienda:{grano:"Grano",molido:"Molido"}`,
`defaults:{tamano:"250g",molienda:"grano"}`.

| # | Línea | Tueste | Perfil (texto real) | Notas | 100 g | 250 g | 454 g | 500 g | 1 kg |
|---|---|---|---|---|---|---|---|---|---|
| 01 | **Puma** ★ | Oscuro | Tueste oscuro de cuerpo redondo: chocolate, avellana y caramelo. | Chocolate · Avellana · Caramelo | grano $52 / molido $51 | grano $119 / molido $116 | $250 | $225 | $450 |
| 02 | **Armadillo** | Medio claro | Tueste medio claro, vivo y aromático: frutal, floral y especiado. | Frutal · Floral · Especiado | grano $52 / molido $51 | grano $119 / molido $116 | $250 | $225 | $450 |
| 03 | **Jaguar** | Medio oscuro | Tueste medio oscuro con carácter: contraste entre notas florales y resinosas. | Floral · Resinoso | $53 | $122 | $260 | $233 | $460 |
| 04 | **Oso Negro** | Oscuro | Tueste oscuro e intenso, con equilibrio entre amargos y dulces. | Amargo · Dulce | $54 | $119 | $250 | $225 | $450 |
| 05 | **Flamingo** | Descafeinado | Descafeinado por proceso al agua natural, sin químicos: todo el sabor, sin cafeína. | Descafeinado · Proceso al agua | $64 | $147 | $281 | $284 | $558 |

★ Puma = `destacada:true` (badge "Ideal para empezar", recomendación 250 g).
**Solo Puma y Armadillo** tienen precio distinto grano/molido, y solo en 100 g y 250 g. El resto de
tamaños tiene precio único (mismo en grano y molido). Estructura de datos en JS: número = precio
único; objeto `{grano, molido}` = precio por molienda.

Estos datos deben vivir en un array `MOMOTO.lineas` en `main.js` (copiar íntegro el bloque A del
`momoto-mejorada/index.html`, líneas ~1346–1372) y renderizar las fichas por JS.

### 5.6 Responsive del catálogo
- `≤820px`: la ficha pasa a **1 columna**; el relato arriba, el selector/precio/CTA abajo.
  El CTA WhatsApp full-width. Numeral y line-art reducen a `clamp(2.5rem, 12vw, 3.5rem)`.
- `360–390px`: los segmentos de Tamaño hacen wrap a 2 filas (5 botones); mantener 44px de alto.
  Reducir gap del `.seg` a 6px. El precio no baja de `1.9rem`.
- `≥1280px`: la ficha respira; el line-art de fauna puede crecer levemente. Sin cambios de estructura.

---

## 6. Frescura + Envíos (franjas sobre papel)

Dos franjas elegantes al cierre del capítulo de catálogo (mismo `.chapter` claro), separadas por aire.

### 6.1 Frescura — "Tostado bajo pedido. Fresco por diseño."
- H3 Cormorant 500. Sub (Gris Cacao): "Del tostador a tu taza, sin bodega ni anaquel: tostamos bajo
  pedido y sellamos con válvula."
- **3 pilares** en fila (desktop) / stack (móvil), cada uno con icono de línea fino (Salvia/Verde Selva),
  título Inter 600 y una línea de apoyo Gris Cacao:
  1. **Tostado bajo pedido** — "Encendemos el tostador cuando llega tu pedido, no antes."
  2. **Sellado con válvula** — "Deja salir el gas del tueste y no deja entrar el aire."
  3. **Lotes pequeños** — "Poco y bien: nada de tandas industriales ni café dormido."
- Layout: `display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(24px,4vw,48px)`; `≤720px` → 1 col.
- Estilo: superficie papel, sin tarjeta; separadores hairline verticales opcionales entre pilares (Arena).

### 6.2 Envíos — "Envíos a todo México" (datos reales, jul 2026)
- Franja con icono de caja (línea) + bloque de texto:
  - "Enviamos a toda la República por paquetería. El costo depende de tu región y te lo confirmamos
    por WhatsApp antes de que pagues."
  - Lista (checks discretos en Salvia/Verde Selva):
    - **Envío gratis** en pedidos de **5 kg o más**.
    - Entrega en aproximadamente **4 días hábiles**.
    - Con número de rastreo para seguir tu paquete.
  - Nota con enlace de rastreo DHL:
    "¿Ya tienes tu número de guía? **Rastrea tu envío con DHL →**"
    → `https://mydhl.express.dhl/mx/es/tracking.html` (`target="_blank" rel="noopener"`).
- **Nota de precios** al cierre (leyenda Gris Cacao, `.8125rem`, centrada o a la izquierda):
  "Precios 2026 · Público general · MXN · el «desde $52» es la bolsa de 100 g · Pedidos y envíos por WhatsApp".
- Estilo franja: superficie papel dentro de filete hairline superior (Arena), padding generoso.
  Ninguna sombra. Iconos de línea consistentes con el resto.

---

## 7. Proceso 01–06 (capítulo oscuro + duotono)

Confirmado del preview; se completa a los **6 pasos reales**.

- **Fondo:** `.dark` (Verde Sombra a sangre). Eyebrow Salvia, H2 Papel, sub `--papel-60`.
- Cabecera: Eyebrow **"El oficio"**, H2 **"De la mata a tu taza."**, sub "Seis pasos, sin prisa.
  Del cafetal de sombra al tueste artesanal en Mérida."
- **Layout** (rejilla del preview): imagen duotono 4:5 a la izquierda + lista de pasos a la derecha.
```css
.proceso{display:grid;grid-template-columns:1fr 1fr;gap:clamp(36px,6vw,80px);align-items:center}
@media(max-width:820px){.proceso{grid-template-columns:1fr;gap:40px}}
```
- **Imagen duotono** (`.duo-frame`, `aspect-ratio:4/5`): aplicar `filter:url(#duo) contrast(1.05)`
  + marco interior hairline Salvia (`box-shadow:inset 0 0 0 1px var(--salvia-borde)`).
  Recorte hacia el detalle (manos, textiles, sacos, grano). Encuadre vertical 4:5.
  **Recomendación:** una sola imagen ancla grande (p.ej. `seleccion.jpg` o `sacos.jpg`), y la lista de
  6 pasos al lado — es más editorial que 6 fotos pequeñas. Alternativa: rotar la imagen según el paso
  con hover/focus (opcional, no obligatorio; mantener simple para v1).
- **Lista de pasos** (`.pasos`, `<ol>`): cada `<li>` con numeral Cormorant 300 Salvia (`.p-num`,
  `min-width:52px`) + texto (`<strong>` Inter 500 título, `<span>` `--papel-60` descripción).
  Filetes `--hair-dark` entre pasos.

**Los 6 pasos reales (texto exacto):**
| Nº | Título | Descripción | Foto (duotono) |
|---|---|---|---|
| 01 | Floración | Nace el fruto entre flores blancas. | `assets/photos/floracion.jpg` |
| 02 | Recolección | Cosecha selectiva del cerezo maduro. | `assets/photos/recoleccion.jpg` |
| 03 | Selección | Se elige el mejor grano, uno por uno. | `assets/photos/seleccion-cerezo.jpg` |
| 04 | Despulpado | Se separa la pulpa y se lava el grano. | `assets/photos/despulpadora.jpg` |
| 05 | Secado | El grano descansa en sacos de yute. | `assets/photos/sacos.jpg` |
| 06 | Tueste | Tostado en lotes pequeños, listo para ti. | `assets/photos/seleccion.jpg` |

Todas las fotos del proceso van **en duotono verde + grano** (nunca a color). `alt` descriptivo por foto.

- **Responsive:** `≤820px` la imagen va arriba (4:5), la lista debajo; numerales no bajan de `1.75rem`.
  Mantener el marco hairline. En móvil, si se usa 1 sola imagen, perfecto; evitar carruseles pesados.

---

## 8. Nosotros + credenciales (capítulo papel)

### 8.1 Nosotros
- **Layout** editorial 2 columnas: foto duotono 4:5 (izquierda) + texto (derecha).
  `≤820px` → 1 columna (foto arriba).
- **Foto:** `assets/photos/personal.jpg` **en duotono verde + grano** (snapshot documental → archivo
  editorial), dentro de marco hairline Arena (capítulo papel: marco Arena, no Salvia). `aspect-ratio:4/5`.
  Motivo momoto en line-art Salvia como marca de agua en esquina (opcity ~.4, `aria-hidden`).
- **Texto:**
  - Eyebrow (Verde Selva): **"Quiénes somos"**.
  - H2 Cormorant: **"Un café con nombre de selva"**.
  - Lead (Tinta): "El momoto es el ave que solo habita donde la selva está sana. Como ella, cultivamos
    a la sombra y sin agroquímicos: un café que deja el bosque en pie."
  - Párrafo (Gris Cacao): "Trabajamos con grano orgánico de altura de Chiapas, Veracruz y Oaxaca, y
    desde Mérida lo seleccionamos, tostamos y empacamos lote a lote para llevarte una taza limpia,
    honesta y de especialidad."
  - **Checks** (3, icono check Verde Selva/Salvia): "100% orgánico, libre de agroquímicos" ·
    "Cultivado a la sombra en el sureste de México (Chiapas, Veracruz y Oaxaca)" ·
    "Tostado y empacado en Mérida".
  - Sello: `assets/hecho-mexico.svg` (`height:44px`) + "Hecho en México".

### 8.2 Credenciales (franja sobria editorial)
Bajo Nosotros, separada por filete Arena (`border-top`, `padding-top:clamp(32px,5vw,48px)`).
Sin logos-imagen: **badges de texto accesibles** en el idioma editorial (hairline pills / listas).
- Título H3 Cormorant 500 (centrado o izquierda): **"Respaldo y reconocimientos"**.
- **Certificaciones** (label eyebrow Verde Selva "Certificaciones" + pills hairline con check):
  **USDA Organic · SADER Orgánico · Certimex · Comercio justo — trato directo · Miembro de AMECAFE**.
  (El "Comercio justo — trato directo" = Fair&Direct Trade.)
- **Reconocimientos** (label "Reconocimientos" + lista con estrella-línea, no rellena):
  - "Global Quality Award Gold Elite — Global Quality Foundation"
  - "Reconocida entre las mejores marcas de café mexicano"
- **Nos encuentras en** (label "Nos encuentras en" + pills sobrias, borde Verde Selva, sin check):
  **Palacio de Hierro · City Market · The Green Corner**.
- **Nota de cierre** (Gris Cacao, iconos de línea): "Tostado bajo pedido, en lotes pequeños ·
  Empaque con válvula para café siempre fresco".

Estilo de pills credenciales:
```css
.cred-pill{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:999px;
  border:1px solid var(--arena);color:var(--verde-selva);font-weight:600;font-size:.875rem}
.cred-pill svg{width:16px;height:16px;color:var(--verde-selva)}  /* check en Verde Selva, no verde vivo */
.cred-pill--soft{border-color:var(--verde-selva);color:var(--tinta)} /* "Nos encuentras en" */
```
Nota: la Cereza **no** entra aquí (mantener sobrio); el destello ya se gastó en catálogo/nav.

- **Responsive:** pills hacen wrap natural; centradas en móvil, pueden ir a la izquierda en desktop
  (mantener consistencia con el resto: preferir izquierda salvo que se decida centrar la franja).

---

## 9. Reseñas (bloque preparado, **OCULTO**)

- Sección `#resenas` maquetada pero con atributo **`hidden`** (fuera del layout y del árbol de
  accesibilidad). **No inventar testimonios.**
- **No** incluir `#resenas` en el scroll-spy ni en el menú (para no romper la navegación).
- Estructura lista para activar: cabecera (eyebrow "Voz del cliente", H2 "Lo que dicen quienes ya lo
  prueban") + grid de fichas `.card-resena` (estrellas + cita `<blockquote>` + autor: nombre/inicial,
  ciudad/estado, línea). Cada ficha también `hidden` hasta rellenarse con **cita real verificable**.
- Estilo cuando se active: superficie papel, filete Arena, cita en Cormorant 400 italic (voz), autor
  en Inter 600. Estrellas: usar Salvia (o Cereza muy puntual) — decidir al activar con datos reales.
- Comentario en el código dejando la regla: activar solo con 4–6 citas reales (captura WhatsApp/Google/FB)
  y, para rating agregado, fuente verificable; entonces añadir `review`/`aggregateRating` al JSON-LD.

---

## 10. Contacto + footer (capítulo oscuro)

- **Fondo:** Verde Sombra a sangre (`.dark`). Eyebrow Salvia, H2 Papel.
- Cabecera: Eyebrow **"Pide tu café"**, H2 **"A un mensaje de distancia"**, sub `--papel-60`:
  "La forma más rápida es WhatsApp. También te esperamos en Mérida."
- **3 tarjetas de contacto** (superficie Verde Selva, filete Salvia tenue, radio `--r-xs`; hover:
  `translateY(-2px)` + borde Salvia; **sin** sombras dramáticas):
  1. **WhatsApp** (destacada, borde Salvia 1.5px): "Pedidos al instante, sin formularios."
     CTA sólido Salvia (texto Verde Sombra) → **"999 318 3525"**, enlace
     `https://wa.me/5219993183525?text=Hola%20Momoto%2C%20quiero%20hacer%20un%20pedido`.
  2. **Mayoreo** (B2B): "Cafeterías, oficinas y tiendas. Atención directa a clientes."
     - Contacto: **Lourdes Solís Letayf**
     - `lousolis@momotocafe.com` (enlace mailto, Salvia)
     - Tel. **55 5104 0857** (`tel:+525551040857`)
     - CTA Salvia → "Cotizar mayoreo",
       `https://wa.me/5219993183525?text=Hola%20Momoto%2C%20me%20interesa%20mayoreo`.
  3. **Visítanos:** dirección real (address):
     **Calle 59 A No. 703 Int. 32, Col. Bojórquez, C.P. 97230, Mérida, Yucatán.**
     CTA ghost sobre oscuro (borde Salvia) → "Escríbenos" `mailto:info@momotocafe.com`.
- Layout: `grid; grid-template-columns:repeat(3,1fr); gap:clamp(16px,2.5vw,24px)`; `≤820px` → 1 col.
  Textos secundarios en `--papel-72`; enlaces en Salvia.

### 10.1 Footer
Dentro del mismo capítulo oscuro, filete superior Salvia tenue (`--hair-dark`), texto `--papel-60`,
centrado, `font-size:.8125rem`:
- "© {año} Momoto Café · Tel. **(999) 286 4269** (`tel:+529992864269`) · **info@momotocafe.com**"
- Legal: "Chi de México, S.A. de C.V. · RFC **CME080827RH1** · **Aviso de Privacidad**"
  (enlace a `aviso-de-privacidad.html`).
- `{año}` dinámico por JS (`new Date().getFullYear()`), con fallback "2026" en el HTML.
- Enlaces del footer en Salvia; hover subrayado.

---

## 11. Barra / CTA WhatsApp persistente (marca-primero)

- **Móvil (`<860px`): barra inferior full-width CON TEXTO.**
  Fondo **Verde Sombra** (marca, **no** verde neón), texto Papel, glifo WhatsApp.
```css
.wa-bar{position:fixed;left:0;right:0;bottom:0;z-index:50;
  display:flex;align-items:center;justify-content:center;gap:var(--sp-2);
  min-height:calc(var(--wa-bar-h) + env(safe-area-inset-bottom,0px));
  padding:12px 16px;padding-bottom:max(12px,env(safe-area-inset-bottom,0px));
  background:var(--verde-sombra);color:var(--papel);
  font-family:var(--ui);font-weight:600;font-size:.9375rem;letter-spacing:.02em;
  box-shadow:0 -6px 20px rgba(6,43,38,.14);transition:background .3s var(--ease)}
.wa-bar:active{background:var(--verde-selva)}
body.menu-open .wa-bar{display:none}
```
  - Texto: **"Pedir por WhatsApp"**; enlace
    `https://wa.me/5219993183525?text=Hola%20Momoto%2C%20quiero%20hacer%20un%20pedido`.
  - `aria-label="Pedir por WhatsApp"` explícito.
  - Reservar espacio: `main` o `body` con `padding-bottom` = alto de la barra en móvil, para que la
    barra no tape el footer/contenido final.
- **Desktop (`≥860px`): FAB píldora discreto "Pedir por WhatsApp"** abajo-derecha
  (`position:fixed; right:24px; bottom:24px`), mismo Verde Sombra + glifo, `border-radius:var(--r-pill)`
  permitido aquí por ergonomía del FAB, hover → Verde Selva + `translateY(-2px)`. Texto corto opcional
  "Pedir" si el espacio aprieta, con `aria-label` completo.
- **Foco visible AA** sobre superficie oscura: outline Salvia (§13).

---

## 12. Componentes base

### 12.1 Botones
```css
.btn{display:inline-flex;align-items:center;gap:11px;font-family:var(--ui);font-weight:600;
  font-size:.875rem;letter-spacing:.04em;padding:16px 30px;border-radius:var(--r-xs);
  min-height:48px;transition:transform .5s var(--ease),background .4s var(--ease),color .4s var(--ease)}
.btn svg{width:18px;height:18px;flex:none}
/* Sobre papel (primario, marca-primero): */
.btn--solid{background:var(--verde-sombra);color:var(--papel)}
.btn--solid:hover{background:var(--verde-selva);transform:translateY(-2px)}
/* Sobre oscuro (primario): */
.btn--onDark{background:var(--salvia);color:var(--verde-sombra)}
.btn--onDark:hover{background:var(--papel);transform:translateY(-2px)}
/* Secundario / baja fricción: */
.btn--ghost{background:transparent;color:var(--verde-selva);border:1px solid var(--arena)}
.btn--ghost:hover{border-color:var(--verde-selva)}
.btn--ghost.on-dark{color:var(--salvia);border-color:var(--salvia-borde)}
.btn--ghost.on-dark:hover{border-color:var(--salvia);background:rgba(143,184,166,.10)}
```
Estados obligatorios:
- **hover:** como arriba (elevación sutil + cambio de fondo).
- **active:** `transform:translateY(0)` (quita la elevación).
- **focus-visible:** outline (ver §13). No suprimir nunca el foco de teclado.
- **disabled** (si aplica): `background:var(--arena);color:var(--gris-cacao);cursor:not-allowed;opacity:.7`.
- **Jerarquía de acción:** primaria = sólida (WhatsApp de pedido); secundaria = ghost
  ("¿Cuál me recomiendas?", "Escríbenos"). Máximo una primaria visible por bloque.

### 12.2 Eyebrow / label
`Inter 600, .75rem, letter-spacing:.20em, MAYÚSCULAS`. Sobre papel: **Verde Selva**; sobre oscuro:
**Salvia**. Filete Cereza corto (26px) antes del texto (`.eyebrow::before`), como en el preview.
En hero, el eyebrow es largo → sin filete (o filete Salvia).

### 12.3 Taste pills / cred pills / dots
- Taste/cred pills: hairline, `border-radius:999px` (único uso de pill permitido).
- Dots (si se usan): 8px, activos 22px de ancho, Salvia (oscuro) o Verde Selva (papel).

### 12.4 Fauna en line-art (grabado de historia natural)
- **Un motivo por línea** (puma, armadillo, jaguar, oso negro, flamingo) + el **momoto** como motivo
  recurrente discreto. Estilo: **line-art fino** en **Salvia**, trazo `stroke-width` ~1.6–2.6,
  `fill:none`, estética de **lámina zoológica/grabado**, nunca caricatura.
- **Assets disponibles:** solo `assets/animals/flamingo.png` y `assets/animals/armadillo.png`
  (2 PNG). Para las 5 líneas se recomienda **SVG inline** coherente (como los `<symbol>` "track-…"
  del preview/mejorada, que son huellas/siluetas minimalistas en Salvia). **Decisión v1:** usar SVG
  inline de línea (huella o silueta) por línea, en Salvia, `aria-hidden="true"`. Si se quiere el
  grabado ilustrado, encargar SVG line-art nuevo por línea (misma familia visual, Salvia).
- Uso: junto al numeral de la ficha, o como marca de agua discreta (opacity .4–.55) arriba-derecha.
  Nunca protagonista, nunca a color.

### 12.5 Tratamiento de fotografía (duotono + grano)
- **Duotono de marca** vía filtro SVG `#duo` (del preview, conservar `tableValues` exactos:
  R `0.024→0.957`, G `0.169→0.937`, B `0.149→0.902`): sombras→Verde Sombra, luces→Papel,
  medios→Verde Selva). Aplicar a **TODA** la foto documental (proceso, equipo/nosotros). `+contrast(1.05)`.
- **Grano de archivo**: `body::after` global (SVG fractalNoise, opacity ~.045). No tocar por foto.
- **Recorte al detalle** en fotos débiles (manos, textiles, sacos, grano). Encuadres verticales 4:5.
- **Excepción hero:** `cerezo.jpg` a color, graduado profundo (ver §4). Es la única foto a color.
- **Marcos:** en capítulo papel, marco hairline **Arena**; en capítulo oscuro, marco hairline **Salvia**.
- **Prohibido:** stock cliché de café; mostrar snapshots documentales a color sin duotono.

---

## 13. Accesibilidad AA (por componente)

- **Contraste** (verificado en la dirección):
  - Papel sobre Verde Sombra 15.2:1 (AAA) · Tinta sobre Papel 14.4:1 (AAA).
  - Verde Selva (tinta verde) sobre Papel 8.9:1 (AAA) — labels/enlaces en claro.
  - Salvia sobre Verde Sombra 6.9:1 (AA) — labels/CTA en oscuro.
  - Cereza sobre Papel 5.2:1 (AA) — **solo énfasis**, nunca sobre oscuro como texto.
  - Gris Cacao sobre Papel 6.5:1 (AA) — texto secundario.
  - `--papel-72` y `--papel-60` sobre Verde Sombra mantienen AA holgado.
- **Foco visible** (nunca suprimir teclado):
```css
:focus-visible{outline:3px solid var(--verde-sombra);outline-offset:2px;border-radius:2px}
/* sobre superficies oscuras (hero, capítulos dark, header sólido, menú, wa-bar): */
.dark :focus-visible,.hero :focus-visible,.site-header.is-solid :focus-visible,
.mobile-nav :focus-visible,.wa-bar:focus-visible{outline-color:var(--salvia)}
:focus:not(:focus-visible){outline:none}
```
- **Tamaños táctiles:** mínimos 44×44px en toda superficie tocable (segmentos, hamburguesa, dots,
  cerrar, links de nav móvil, CTAs 48px de alto).
- **Orden lógico de lectura / DOM:** header → hero → catálogo → frescura/envíos → proceso → nosotros
  → (reseñas oculto) → contacto → footer. Un solo `<h1>` (hero). Jerarquía h2/h3 correcta por sección.
- **Landmarks:** `<header>`, `<nav aria-label="Principal">`, `<main id="…" tabindex="-1">`, `<footer>`.
  **Skip link** "Saltar al contenido" al inicio, visible al enfocar.
- **Selector radio** (tamaño/molienda): `role="radiogroup"`/`role="radio"`, `aria-checked`,
  roving tabindex, flechas + Home/End; precio con `aria-live="polite"`.
- **Menú móvil:** `aria-expanded`/`aria-controls`, `aria-hidden` en estado cerrado, focus-trap,
  cierre con Esc, retorno de foco.
- **Imágenes:** `alt` descriptivo real (usar los del contenido); decorativas (fauna, marcas) `aria-hidden`.
- **Iconos SVG:** `aria-hidden="true"`; el significado va en el texto del botón/enlace.
- **Motion:** `@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}`
  (del preview). Fallback sin JS: `<noscript>` que fuerza `opacity:1;transform:none` en `[data-anim]`.
- **Enlaces externos** (`target="_blank"`): siempre `rel="noopener"`.

---

## 14. Responsive mobile-first (breakpoints 360 / 390 / 768 / 1280)

- **Base (mobile-first, ~360–390px):** todo a 1 columna. `padding-inline:22px`. Hamburguesa visible.
  Barra WhatsApp inferior con texto. Hero `100svh` con H1 `clamp(3rem,11vw,4rem)`. Fichas de catálogo
  apiladas (relato → operar). Proceso: imagen 4:5 arriba, pasos abajo. Contacto 1 columna.
- **≥720px:** aparece la nav desktop (links + scroll-spy); desaparece hamburguesa. Franjas de frescura
  a 3 columnas.
- **≥820px:** fichas de catálogo y bloque de proceso pasan a 2 columnas (rejilla asimétrica).
  Contacto a 3 columnas.
- **≥860px:** la barra WhatsApp inferior se convierte en **FAB píldora** abajo-derecha.
- **≥1280px:** contenido tope `1240px`; el aire a los lados crece (asimetría editorial); tipos en su
  máximo del `clamp`. Nada se estira más allá del `--wrap`.

Reglas transversales: `overflow-x:hidden` en `body`; `img{max-width:100%}`; medidas de texto 60–66ch;
`text-wrap:balance` en titulares; `tabular-nums` en todo precio/numeral.

---

## 15. Motion y microinteracciones (contenido, con propósito)

- **Ken Burns hero:** `kb 40s var(--ease) infinite alternate`, muy sereno (scale 1.05→1.14 + leve subida).
- **Reveal on-scroll** (`[data-anim]`): opacity 0→1 + `translateY(16px)→0`, `.82s var(--ease)`,
  con `--anim-delay` escalonado por bloque. IntersectionObserver, una sola vez (`is-in`).
- **Precio en vivo:** `precioIn` (opacity+translateY 6px→0, `.26s`) al recalcular.
- **Header:** transición transparente→sólido `.3s var(--ease)`.
- **Menú móvil:** `translateX(100%)→0` `.4s var(--ease)`.
- **Botones/links:** hover `translateY(-2px)` + cambio de fondo/borde; subrayado del nav width 0→100%.
- **Nada de rebote**, nada de parpadeos, nada de parallax agresivo. Todo respeta `prefers-reduced-motion`.

---

## 16. Página `aviso-de-privacidad.html`

Mismo lenguaje visual "A la sombra" (subconjunto de lectura), en `Cormorant + Inter`.
- **Header simplificado:** fondo Verde Sombra, logo (`logo-white.png`) + enlace "Volver al inicio" (Salvia).
- **Main de lectura** (`max-width:720px`, papel): eyebrow "Legal", H1 Cormorant "Aviso de Privacidad",
  fecha "Última actualización: julio de 2026", nota de plantilla (revisar con asesoría legal).
- **Secciones (contenido real, conservar):** Responsable · Datos que recabamos · Finalidades primarias ·
  Finalidades secundarias · Transferencias · Derechos ARCO · Cookies · Cambios.
  - **Responsable:** CHI DE MÉXICO, S.A. de C.V., RFC **CME080827RH1**, domicilio fiscal
    "Calle Presa Palmito No. 15, Piso 1, Col. Irrigación, C.P. 11500, Alcaldía Miguel Hidalgo, CDMX";
    domicilio comercial "Calle 59 A No. 703 Int. 32, Col. Bojórquez, C.P. 97230, Mérida, Yucatán".
  - Contacto ARCO/oposición: `info@momotocafe.com`.
- **Footer** idéntico al del sitio (© año, tel, correo, legal, RFC).
- H2 de sección en **Verde Selva** (Cormorant 500). Enlaces en Verde Selva; foco AA. `prefers-reduced-motion` ok.
- Tomar como base el contenido de `momoto-mejorada/aviso-de-privacidad.html` y re-vestirlo con los
  tokens nuevos (cambiar paleta teal/menta vieja por Verde Sombra/Salvia/Papel).

---

## 17. SEO / meta / JSON-LD (conservar del contenido real)

- `index.html`: reutilizar `<title>`, `<meta description/keywords/robots/geo>`, canonical, Open Graph
  y Twitter Card del `momoto-mejorada/index.html` (og:image = `cerezo.jpg`).
  **Ajustar `theme-color`** a `#062B26` (Verde Sombra) para coherencia con "A la sombra".
- **JSON-LD:** copiar íntegro el `@graph` (Organization + Store/LocalBusiness + WebSite + 5 Product con
  AggregateOffer y precios reales). **Sin** `aggregateRating`/`review` hasta tener reseñas reales.
- **Fuentes:** una sola petición Google Fonts (LCP-friendly):
  `Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Inter:wght@400;500;600&display=swap`,
  con `preconnect`. `preload` de `assets/photos/cerezo.jpg` (LCP).
- `favicon.png` ya existe; `logo-t.png` (oscuro) y `logo-white.png` (claro) disponibles.

---

## 18. Resumen de decisiones clave (ES)

- **El preview es la ley visual**: extendemos sus tokens, su hero, su ficha editorial y su capítulo
  oscuro duotono al sitio completo, sin reinventar. Corregimos solo un dato de muestra: la colección
  son **5 líneas** ("Cinco guardianes"), no seis.
- **Catálogo = índice editorial en stack vertical** de 5 fichas separadas por filetes, no cuadrícula de
  tarjetas. Cada ficha: numeral Cormorant + fauna line-art Salvia + nombre + placa latina + perfil +
  taste pills (izquierda) y selector Tamaño/Molienda + **precio tabular en vivo** + CTA WhatsApp (derecha).
- **Precios y textos 100% reales** (tabla §5.5): defaults 250 g + Grano; solo Puma/Armadillo difieren
  grano/molido en 100 g y 250 g. Puma = "Ideal para empezar" con badge **sutil** (eyebrow + filete
  Cereza), sin romper el minimalismo. Mensaje WhatsApp exacto con línea·tamaño·molienda·precio.
- **Ritmo de capítulos** claro/oscuro a sangre; aire protagonista; filetes de 1px; sombras casi nulas.
- **CTA marca-primero**: Verde Sombra sobre papel / Salvia sobre oscuro. Barra WhatsApp persistente
  móvil con texto (Verde Sombra, **no** verde neón); FAB píldora en desktop.
- **Fotografía** documental toda en **duotono verde + grano** (proceso, nosotros); solo el hero
  (`cerezo.jpg`) a color, graduado profundo. Cereza ≤ 2 %.
- **Accesibilidad AA** por componente: contraste verificado, foco visible (Verde Sombra / Salvia según
  fondo), táctiles 44px, selector radio con teclado, menú con focus-trap, `prefers-reduced-motion`.
- **Reseñas** maquetadas pero **ocultas** (`hidden`), fuera del spy, sin inventar testimonios.
- **Datos reales de contacto/legal** conservados: WhatsApp pedidos 999 318 3525
  (`wa.me/5219993183525`), Tel (999) 286 4269, `info@momotocafe.com`, mayoreo Lourdes Solís Letayf
  (`lousolis@momotocafe.com`, 55 5104 0857), dirección Mérida, Chi de México S.A. de C.V., RFC CME080827RH1.

---

## 19. Instrucciones para el `desarrollador-web`: archivos a crear y orden

Estructura final en `momoto-netlify/` (los `assets/` ya están poblados):

1. **`styles.css`** — primero. Volcar todos los tokens de §1 en `:root`, más el reset/base del preview
   (grano `body::after`, `img`, `a`, foco). Implementar en este orden: contenedores/capítulos (§2) →
   header + menú móvil (§3) → hero (§4) → catálogo/ficha/selector (§5) → franjas frescura/envíos (§6) →
   proceso duotono (§7) → nosotros + credenciales (§8) → reseñas ocultas (§9) → contacto/footer (§10) →
   barra/FAB WhatsApp (§11) → componentes base y foco (§12–13) → responsive (§14) → motion (§15) →
   `prefers-reduced-motion` al final.

2. **`index.html`** — segundo. Estructura semántica: `<head>` con meta/OG/JSON-LD reales (§17) + fuentes
   + preload del hero. Body con skip-link, header/nav (§3), `<main>` con las secciones en el orden del
   DOM (§2), filtro SVG `#duo` (del preview), barra/FAB WhatsApp. El catálogo se renderiza por JS
   (contenedor vacío + `MOMOTO.lineas`). Copiar los textos reales de §4–§10 tal cual.

3. **`main.js`** — tercero. Módulos: (A) datos `MOMOTO` con `lineas`/precios reales (copiar de
   `momoto-mejorada` líneas ~1346–1372) → (B) lógica de precio + `linkPedido` (mensaje WhatsApp exacto)
   → (C) render de las 5 fichas → (D) selector radio accesible (click + teclado) + recálculo en vivo →
   (E) header scroll (transparente→sólido) + **scroll-spy** → (F) menú móvil (toggle, focus-trap, Esc) →
   (G) reveal on-scroll `[data-anim]` → (H) año dinámico del footer. Sin dependencias (ES6+).

4. **`aviso-de-privacidad.html`** — cuarto. Página de lectura re-vestida con los tokens nuevos (§16),
   contenido legal real; enlaza de vuelta al inicio y comparte footer.

5. **(Opcional) `assets/animals/`** — si se decide el grabado ilustrado, encargar SVG line-art por línea
   (puma, jaguar, oso negro; ya existen flamingo.png y armadillo.png) en Salvia, misma familia visual.
   Para v1 basta el SVG inline de línea del preview.

**Verificación final antes de entregar:** precios y textos idénticos a la tabla §5.5; mensajes de
WhatsApp con el número real `5219993183525`; contraste AA; foco visible en claro y oscuro; navegación
por teclado del selector y del menú; `prefers-reduced-motion`; reseñas ocultas; sin Cereza sobre oscuro
como texto; sin verde neón; sin sombras/tarjetas pesadas del look viejo.
