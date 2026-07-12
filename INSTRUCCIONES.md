# Momoto Café · Carrito + Stripe Checkout + Rastreo DHL

## Qué se agregó

- **Carrito de compras**: botón "Agregar al carrito" en cada café, ícono de carrito en el header con contador, panel lateral con cantidades, subtotal, envío y total.
- **Pago con Stripe Checkout**: el botón "Pagar con tarjeta" cobra el TOTAL real. Los precios se validan en el servidor (nadie puede alterarlos desde el navegador).
- **Envío DHL**: $199 MXN tarifa nacional (promedio DHL 1–5 kg) y **GRATIS desde 5 kg**. Stripe pide dirección y teléfono del cliente.
- **Rastreo de pedido**: sección "Rastrea tu pedido" (ancla `/#rastreo`) donde el cliente ingresa su guía DHL y ve la ruta del paquete estilo Amazon.
- **gracias.html**: página de confirmación después del pago.

## Archivos

Nuevos: `carrito.js`, `gracias.html`, `netlify/functions/create-checkout-session.mjs`, `netlify/functions/rastreo.mjs`
Modificados: `index.html`, `main.js`, `styles.css`, `netlify.toml`

## Pasos para activarlo (una sola vez)

1. **Sube los archivos al repo** `momoto-cafe` (GitHub → Add file → Upload files, arrastra TODO el contenido del zip respetando la carpeta `netlify/functions/`). Netlify desplegará solo.

2. **Configura tu clave de Stripe en Netlify** (NO la pongas en el código ni la compartas en el chat):
   - Stripe Dashboard → Desarrolladores → Claves de API → copia la **clave secreta** (`sk_live_...`).
   - Netlify → tu sitio → Site configuration → **Environment variables** → Add variable:
     - Key: `STRIPE_SECRET_KEY` · Value: tu clave secreta.
   - Redespliega el sitio (Deploys → Trigger deploy).

3. **(Opcional) Rastreo con línea de tiempo dentro de tu página**:
   - Crea una cuenta gratis en https://developer.dhl.com y suscríbete a la API "Shipment Tracking - Unified".
   - En Netlify agrega la variable `DHL_API_KEY` con tu key.
   - Sin esta variable, el rastreo abre la página oficial de DHL con la guía (también funciona).

## Ajustes rápidos

- Cambiar tarifa de envío: `ENVIO_TARIFA_CENTAVOS` en `netlify/functions/create-checkout-session.mjs` y `ENVIO_TARIFA` en `carrito.js`.
- Cambiar umbral de envío gratis: `ENVIO_GRATIS_DESDE_G` (función) y `ENVIO_GRATIS_DESDE` (carrito.js).
- Cambiar precios: tabla `PRECIOS` en la función **y** `precios` en `main.js` (deben coincidir).

## Prueba antes de cobrar en serio

Usa primero tu clave `sk_test_...` en `STRIPE_SECRET_KEY` y paga con la tarjeta de prueba `4242 4242 4242 4242` (cualquier fecha futura y CVC). Cuando todo se vea bien, cámbiala por la `sk_live_...`.

## Estado

- STRIPE_SECRET_KEY configurada en Netlify (pagos activos).
- DHL_API_KEY configurada en Netlify (rastreo con linea de tiempo; requiere aprobacion de DHL a la suscripcion "Shipment Tracking - Unified").
