# Momoto Café — sitio estático «A la sombra»

Sitio de una página (one-page con scroll anclado) para **Momoto Café**, café orgánico de
especialidad tostado en Mérida. HTML + CSS + JavaScript vanilla, sin build ni dependencias.
Listo para **GitHub + Netlify**.

## Estructura

```
momoto-netlify/
├── index.html               ← página principal (hero, catálogo, proceso, nosotros, contacto)
├── aviso-de-privacidad.html ← página legal
├── 404.html                 ← página de error
├── styles.css               ← todos los estilos y tokens de diseño
├── main.js                  ← datos reales, precio en vivo, selector, menú, scroll-spy
├── assets/                  ← imágenes, logos, favicon, SVG
│   ├── photos/              ← fotografía documental (duotono) + hero (cerezo.jpg)
│   └── animals/             ← ilustraciones de fauna (PNG de reserva)
├── netlify.toml             ← config Netlify (headers de seguridad, redirects, 404)
├── _headers                 ← caché de assets/estilos
├── robots.txt               ← indexación + sitemap
├── sitemap.xml              ← mapa del sitio
└── _equipo/                 ← documentos internos de dirección/diseño (no se enlazan)
```

## Datos y precios

Todo el contenido —líneas de café, precios (MXN, 2026), textos, credenciales, contactos y
datos legales— es **real**. Los precios y la lógica de pedido viven en `main.js`
(`MOMOTO.lineas`). Los pedidos se arman por WhatsApp al **+52 1 999 318 3525**
(`wa.me/5219993183525`).

## Probar en local

Cualquier servidor estático sirve. Por ejemplo:

```bash
cd momoto-netlify
python3 -m http.server 8000
# abrir http://localhost:8000
```

> Ábrelo por HTTP (servidor local), no con `file://`, para que el filtro SVG duotono y las
> fuentes de Google carguen correctamente.

## Desplegar a Netlify

**Opción A — desde GitHub (recomendada):**
1. Sube esta carpeta a un repositorio de GitHub.
2. En Netlify: *Add new site → Import an existing project → GitHub* y elige el repo.
3. Build command: *(vacío)* · Publish directory: `.` (Netlify lee `netlify.toml`).
4. *Deploy site*. Configura el dominio `www.momotocafe.com` en *Domain settings*.

**Opción B — arrastrar y soltar:**
1. Entra a [app.netlify.com/drop](https://app.netlify.com/drop).
2. Arrastra la carpeta `momoto-netlify` completa.

## Notas

- La sección de **reseñas** está maquetada pero **oculta** (`hidden`): activarla solo con citas
  reales verificables y, para rating agregado, añadir `review`/`aggregateRating` al JSON-LD.
- `_equipo/` y `preview.html` son material interno; puedes borrarlos antes de publicar si prefieres
  no exponerlos (no están enlazados desde el sitio).
