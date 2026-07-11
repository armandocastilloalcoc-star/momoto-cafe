# 01 · Dirección Creativa — Momoto Café (versión premium, lienzo limpio)

> Documento de visión. No es código. Fija el ADN visual que el `diseñador-ui-ux` y el
> `desarrollador-web` deben seguir al pie de la letra. El look "cálido artesanal" anterior
> queda **descartado**. Esto es una dirección nueva desde cero.
>
> Sitio estático (HTML + CSS + JS + assets) en GitHub + Netlify. Fuentes de Google.
> Contenido y datos = los reales del sitio actual (mismos precios, líneas, textos, contactos).

---

## 1. Concepto / Big Idea

**"A la sombra."**

Momoto es **el lujo que crece en la penumbra**: un café raro y sereno, cultivado en la sombra
verde de la selva del sureste de México y servido con la calma de lo que no tiene prisa.

La emoción central no es "calidez de mercado artesanal" — es **reverencia serena**: el silencio
del cafetal de sombra al amanecer, donde algo escaso madura lento. Vendemos **rareza cultivada**,
no rusticidad. El lujo aquí es la **profundidad, el aire y la contención**, con la vida entrando
solo por destellos precisos (la cereza roja, el ave, la hoja).

> El claim de marca **"De la mata a tu taza"** se conserva. "A la sombra" es el territorio
> creativo que lo eleva; no lo sustituye.

---

## 2. Mood & tono

**Adjetivos guía (los seis):**
**Sereno · Profundo · Refinado · Botánico · Editorial · Preciado** (escaso/precioso).

Cada decisión —color, tipo, foto, espacio— debe poder justificarse contra estos seis. Si algo se
siente ruidoso, dulce, "startup", saturado o de plantilla, no pertenece aquí.

**Referencias de estética (para anclar la conversación con el cliente):**

1. **Aesop** — apotecario botánico: paleta madura y oscura, tipografía editorial, muchísimo aire,
   lujo por restricción y no por adorno. Es el ancla principal de "premium orgánico sin calidez recargada".
2. **Revistas Kinfolk / Cereal** — minimalismo editorial: rejilla asimétrica, espacio en blanco
   generoso, fotografía tratada con calma, jerarquía impecable. Aporta el "aire de revista cara".
3. **Lujo mexicano sobrio (mezcal / joyería contemporánea de gama alta)** — verde profundo,
   oscuridad elegante, orgullo de origen sin folclor caricaturizado. Ancla la mexicanidad **culta**.

**Tono de voz visual:** habla poco y con seguridad. Frases cortas, mucho margen, cero exceso de
badges. La confianza se demuestra con calma, no con volumen.

---

## 3. Paleta premium

Evolución madura del ancla histórica `#003040`: la **maduramos hacia un verde-teal más profundo y
botánico** (la sombra del cafetal, no el azul corporativo). Régimen **casi monocromo** —verde
profundo + papel cálido— con **dos acentos de uso mínimo**. Así se ve caro: pocos colores, mucha
profundidad, la vida entra por destellos.

### Colores núcleo (6)

| Nombre | HEX | Rol | Justificación |
|---|---|---|---|
| **Verde Sombra** | `#062B26` | Fondo oscuro principal (hero, "capítulos" oscuros, CTA sólido) | La penumbra del cafetal de sombra. Madura el `#003040` hacia el verde. Oscuridad = lujo editorial. |
| **Verde Selva** | `#0E4A40` | Superficie secundaria en oscuro (tarjetas/hover) **y** tinta verde para labels/enlaces sobre papel | Tono medio del follaje. Doble función: superficie en oscuro y "tinta verde" legible en claro. |
| **Papel Hueso** | `#F4EFE6` | Fondo claro principal ("papel") | Off-white cálido, tipo papel fino no estucado. Editorial y caro; nunca blanco puro clínico. |
| **Tinta Café** | `#231E1B` | Texto principal sobre papel | Casi-negro cálido de espresso. Legibilidad AAA sin la dureza del negro puro. |
| **Salvia** | `#8FB8A6` | Acento frío: eyebrows/labels y CTA sólido **sobre oscuro**, filetes, motivos de fauna/hoja | Descendiente maduro y desaturado del menta del logo. Conserva el ADN Momoto, pero adulto y sereno. |
| **Cereza Rara** | `#B23A2E` | Acento cálido **escaso** (1–2 %): filete/subrayado activo, punto en hover, número índice, énfasis de precio | El rojo de la cereza de café real (foto hero). El "destello vivo" que justifica todo el silencio verde. |

### Neutros de apoyo

| Nombre | HEX | Rol |
|---|---|---|
| **Arena Tenue** | `#E3DACB` | Filetes/bordes/divisores de 1px sobre papel (decorativo). |
| **Gris Cacao** | `#5B544B` | Texto secundario/leyendas sobre papel (AA: 6.5:1). |
| Sobre oscuro, texto secundario | `#F4EFE6` @ 72 % | Papel Hueso a opacidad reducida (mantiene AA holgado). |

### Contraste (WCAG AA verificado)

| Par | Ratio | Veredicto |
|---|---|---|
| Blanco sobre Verde Sombra `#062B26` | **15.2 : 1** | AAA |
| Tinta Café sobre Papel Hueso | **14.4 : 1** | AAA |
| Verde Selva (tinta verde) sobre Papel | **8.9 : 1** | AAA — labels/enlaces en claro |
| Salvia sobre Verde Sombra | **6.9 : 1** | AA (texto normal) — labels/CTA en oscuro |
| Cereza Rara sobre Papel | **5.2 : 1** | AA (texto normal) — usar solo para énfasis |
| Gris Cacao sobre Papel | **6.5 : 1** | AA — texto secundario |

**Reglas de acento (no negociables):**
- **Cereza Rara** es un condimento, no un ingrediente: máximo **1–2 % de la superficie**. Nunca
  como fondo de sección, nunca como botón grande. Sobre oscuro es **solo decorativa** (un punto,
  un filete), **nunca texto** (falla contraste).
- **Salvia** vive sobre oscuro. Para "verde" sobre papel, usar **Verde Selva** (más profundo, AA).
- Nada de degradados dorados ni oro cepillado (era del look viejo). El brillo aquí es la
  profundidad del verde y el papel, no el metal.

### CTA / WhatsApp
El botón primario es **marca antes que WhatsApp**: sobre papel, botón sólido **Verde Sombra** con
texto Papel Hueso y el glifo de WhatsApp (hover → Verde Selva). Sobre oscuro, botón sólido
**Salvia** con texto Verde Sombra. Se conserva el ícono de WhatsApp por reconocimiento, pero
**se evita el verde neón de WhatsApp** como color de marca. La barra/CTA persistente móvil sigue
el mismo criterio: Verde Sombra + glifo, no verde fosforescente.

---

## 4. Sistema tipográfico

Dos familias de Google Fonts. Serif editorial de alto contraste para lo que emociona; grotesca
neutra impecable para lo que se lee y se opera (precios, selectores, labels).

- **Display / títulos: `Cormorant Garamond`** — pesos **300, 400, 500** (+ *400 italic*).
  Serif de contraste alto, old-style, couture y botánico. Reemplaza al Fraunces del look viejo:
  más refinado, más "revista de gama alta", claramente **fresco**. **Solo a tamaños grandes
  (≥ 28 px)** — es delicado; nunca en texto pequeño.
- **UI / cuerpo / labels: `Inter`** — pesos **400, 500, 600**. Legibilidad blindada, `tabular-nums`
  para precios, mayúsculas con tracking para eyebrows. Es el caballo de batalla silencioso.

> **Alternativa (fallback si en QA Cormorant se ve frágil en pantalla):** `Fraunces` (opsz, 300–500)
> — más robusta, sigue siendo editorial-orgánica. Mantener Inter como UI en cualquier caso.

**Carga (una sola petición, LCP-friendly):**
`Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400` + `Inter:wght@400;500;600`

### Jerarquía

| Rol | Familia / peso | Tamaño (clamp) | Line-height | Tracking | Notas |
|---|---|---|---|---|---|
| **Display / H1 hero** | Cormorant 400 | `clamp(3rem, 7vw, 6rem)` | 1.02–1.05 | `-0.015em` | Ligera compresión: Cormorant es aireada. `text-wrap:balance`. |
| **H2 sección** | Cormorant 400 | `clamp(2.2rem, 4.5vw, 3.5rem)` | 1.08 | `-0.01em` | Sobre papel u oscuro según capítulo. |
| **H3 subtítulo/tarjeta** | Cormorant 500 | `clamp(1.4rem, 2.4vw, 1.75rem)` | 1.2 | `0` | Peso 500: presencia a tamaño menor sin adelgazar. |
| **Lead / entradilla** | Inter 400 | `clamp(1.125rem, 1.6vw, 1.3rem)` | 1.6 | `0` | Color Gris Cacao (claro) / Papel @72 % (oscuro). Medida ≤ 62ch. |
| **Cuerpo** | Inter 400 | `1.0625rem` (17px) | 1.7 | `0` | Medida 60–66ch. |
| **Eyebrow / label** | Inter 600 | `0.75rem` (12px) | 1.2 | `0.20em` | MAYÚSCULAS. Verde Selva (claro) / Salvia (oscuro). Filete Cereza corto opcional. |
| **Precio / numerales** | Inter 600 | `clamp(1.6rem, 3vw, 2.15rem)` | 1 | `-0.01em` | `font-variant-numeric: tabular-nums`. |
| **Índices editoriales** ("01"–"06") | Cormorant 300 | `clamp(2.5rem, 6vw, 4.5rem)` | 1 | `0` | Numeral couture ligero como recurso de proceso/lista. |
| **Nombres de fauna (científico opcional)** | Cormorant *400 italic* | según contexto | — | — | *Eumomota superciliosa* etc., como placa de historia natural. |

**Regla tipográfica:** una sola serif y una sola sans. Cero fuentes decorativas, cero scripts
(el "café" manuscrito del logo se queda **solo en el logo**, nunca como tipografía de la página).

---

## 5. Principios de layout

Cómo se ve "caro": **aire, ritmo y contención**, no densidad ni sombras.

- **Espacio en blanco protagonista.** Padding vertical de sección `clamp(120px, 15vw, 200px)` —
  más aire que cualquier competidor. El vacío es lujo; no lo rellenes.
- **Rejilla editorial asimétrica (12 col).** Romper el hábito de "todo centrado". Bloques de texto
  alineados a la izquierda con márgenes derechos amplios; imágenes descentradas. El centrado se
  reserva para momentos de manifiesto (hero, cita, cierre).
- **Ancho máximo** de contenido ~1240px; medida de texto 60–66ch; columnas angostas 720px.
- **Ritmo de "capítulos" claro/oscuro.** La página alterna spreads de **Papel Hueso** y
  **Verde Sombra** a sangre completa, como pliegos de una revista. Ese vaivén da estructura y drama.
- **Superficies planas + filetes de 1px**, no tarjetas pesadas. Reducir sombras al mínimo
  (una sola sombra difusa y muy tenue como máximo). El lujo callado usa **hairlines** y bordes
  finos, no elevación dramática.
- **Catálogo de café como índice editorial**, no como cuadrícula de tarjetas gruesas: fichas de
  superficie papel, borde hairline Arena, padding interno generoso, numeral/inicial grande en
  Cormorant. Los selectores (tamaño/molienda) limpios y tabulares; el precio con `tabular-nums`.
- **Escala de espaciado base 8px** con saltos amplios (24 / 32 / 48 / 64 / 96 / 128 / 160).
- **Motion contenido y lento.** Reveal por opacidad + leve translación, Ken Burns muy sereno en el
  hero, cero rebote. Curva `cubic-bezier(.16, 1, .3, 1)`, duraciones 0.6–0.9s. Respetar
  `prefers-reduced-motion`.
- **Estructura recomendada:** convertir el "deck de paneles" del original a **scroll vertical con
  secciones ancladas** (mejor SEO, accesibilidad y conversión), conservando la navegación por menú.
- **Fauna con criterio.** Puma, Armadillo, Jaguar, Oso Negro, Flamingo → **line-art fino** o glifo
  de huella en Salvia/papel, estilo **lámina de historia natural / grabado zoológico**, nunca
  ilustración caricaturesca. El momoto puede ser un motivo de línea recurrente y discreto.

---

## 6. Dirección de imagen

**Realidad del material (importante):** el `cerezo.jpg` (hero) es excelente y a color. En cambio
las fotos de productores y equipo (`personal.jpg`, `sacos.jpg`, `seleccion.jpg`, etc.) son
**snapshots documentales de baja resolución**, con fondos ruidosos y color disparejo. **No podemos
mostrarlas "tal cual" en un sitio premium.** La estrategia resuelve esto y de paso da unidad.

**Tratamiento maestro — duotono verde + grano de archivo:**
- Aplicar **duotono de marca** (sombras → `#062B26`, luces → `#F4EFE6`, con `#0E4A40` en medios) a
  **toda** la fotografía documental (proceso, productores, equipo, sacos, selección). Esto:
  (a) **unifica** la calidad dispar, (b) **esconde** el ruido de color y el aspecto "celular",
  (c) convierte snapshots en un **archivo editorial** coherente y caro.
- **Grano analógico** sutil por encima (~4–6 % overlay) para reforzar el "archivo".
- **Recorte hacia el detalle** en las fotos débiles: manos seleccionando el grano, la textura de
  los textiles bordados, los sacos de yute, el grano verde. El detalle recortado se lee como
  **oficio y textura**; el plano general documental, no. Encuadres verticales 4:5 para elegancia.

**Excepción — el hero (`cerezo.jpg`):** es el **único punto donde se permite el color vivo**.
Mantener natural pero **graduado más profundo y sereno** (bajar luces, verdes más ricos), con un
**scrim verde** desde abajo (`#041E1A` → transparente) para AA del texto. La **cereza roja** que
sobrevive es el "destello vivo" que justifica todo el sistema (y ata visualmente el acento Cereza Rara).
La foto del cerezo es además `og:image`.

**Guardarraíles de imagen:**
- **Overlays/scrims verdes** para legibilidad AA sobre foto (nunca texto claro sobre foto clara).
- **Encuadre generoso**, a sangre en capítulos oscuros; dentro de marco hairline en capítulos papel.
- **Prohibido** el stock cliché de café (latte art, taza humeante genérica, granos derramados de
  banco de imágenes). Solo la fotografía real de origen, tratada de forma cohesiva.
- Para las **líneas de café** (no hay foto de producto): usar el tratamiento gráfico
  (color + inicial en Cormorant + glifo de fauna en line-art), no fotos inventadas.

---

## 7. Do's & Don'ts

**DO**
- Mucho aire; el vacío es lujo.
- Casi monocromo: verde profundo + papel; la vida entra por destellos (cereza, salvia).
- Cormorant grande y ligera para emocionar; Inter impecable para leer y operar.
- Ritmo editorial de capítulos claro/oscuro a sangre.
- Filetes de 1px y superficies planas; sombras al mínimo.
- Duotono verde + grano para unificar toda la fotografía documental.
- Fauna como grabado de historia natural, fino y discreto.
- Copys cortos, seguros, con margen alrededor.

**DON'T**
- Nada del look "cálido artesanal": fuera menta brillante, terracota, ámbar y **oro cepillado/degradados dorados**.
- Nada de verde neón de WhatsApp como color de marca.
- No abusar de la Cereza Rara (> 2 % = deja de ser lujo).
- No mostrar los snapshots de productores/equipo a todo color sin tratamiento.
- No tarjetas pesadas con sombras dramáticas ni bordes gruesos.
- No centrar todo; no rellenar el espacio "porque sí".
- No Cormorant en tamaños pequeños; no scripts ni fuentes decorativas fuera del logo.
- Nada que se sienta de plantilla comprada. Si parece Bootstrap con foto de café, está mal.

---

## Resumen para el cliente (ES)

**Concepto:** **"A la sombra"** — Momoto como el lujo raro y sereno que crece en la penumbra verde
de la selva mexicana. Reverencia y contención, con la vida entrando solo por destellos.

**Mood:** sereno · profundo · refinado · botánico · editorial · preciado. Referencias: **Aesop**,
revistas **Kinfolk/Cereal**, lujo mexicano sobrio.

**Paleta (HEX):**
- Verde Sombra `#062B26` (fondo oscuro / CTA) · Verde Selva `#0E4A40` (superficie/tinta verde) ·
  Papel Hueso `#F4EFE6` (fondo claro) · Tinta Café `#231E1B` (texto) · Salvia `#8FB8A6` (acento frío) ·
  Cereza Rara `#B23A2E` (destello, 1–2 %).
- Apoyo: Arena Tenue `#E3DACB` (filetes) · Gris Cacao `#5B544B` (texto 2°). Todo verificado AA.

**Tipografías (Google Fonts):**
- **Cormorant Garamond** (300/400/500 + 400 italic) para display/títulos.
- **Inter** (400/500/600) para cuerpo, labels y precios (tabular-nums).
- Fallback de display: Fraunces.

**Layout:** scroll vertical anclado, rejilla editorial asimétrica, muchísimo aire, capítulos
claro/oscuro a sangre, filetes de 1px, motion lento.

**Imagen:** hero (cerezo) a color, graduado profundo; **todo lo demás en duotono verde + grano**
para unificar los snapshots documentales y volverlos archivo editorial premium.

---

## Siguiente agente: `diseñador-ui-ux`

Toma esta dirección y produce `_equipo/02-diseno-uiux.md` con:
1. **Tokens de diseño** exactos (variables CSS de color, tipografía, espaciado, radios, sombras
   mínimas) derivados de esta paleta y jerarquía.
2. **Layout sección por sección** (hero, catálogo "Elige tu animal", proceso 01–06, nosotros +
   credenciales, contacto/footer, barra WhatsApp) sobre **scroll vertical anclado** y rejilla
   editorial asimétrica.
3. **Componentes**: ficha de café (índice editorial, selector tamaño/molienda, precio tabular,
   CTA WhatsApp marca-primero), tratamiento de fotos (duotono + scrims), motivos de fauna en
   line-art, estados de foco AA.
4. **Especificación responsive mobile-first** y de accesibilidad (AA), lista para que
   `desarrollador-web` la construya como sitio estático (HTML+CSS+JS+assets) en GitHub + Netlify.

Mantener contenido, precios, líneas y contactos **reales** (no inventar). Con esta dirección se hará
el **preview visual** que Armando aprobará antes de construir.
