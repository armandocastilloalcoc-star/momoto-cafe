/* ============================================================
   MOMOTO CAFÉ · Netlify Function — create-checkout-session
   Crea una sesión de Stripe Checkout con los precios REALES
   validados del lado del servidor (nunca se confía en el cliente).
   Requiere la variable de entorno STRIPE_SECRET_KEY en Netlify.
   Envío: $199 MXN · GRATIS a partir de 5 kg (5000 g).
   ============================================================ */

// Lista de precios oficial 2026 (MXN) — misma fuente que main.js
const PRECIOS = {
  "puma":      { "100g": { grano: 52, molido: 51 }, "250g": { grano: 119, molido: 116 }, "454g": 250, "500g": 225, "1kg": 450 },
  "armadillo": { "100g": { grano: 52, molido: 51 }, "250g": { grano: 119, molido: 116 }, "454g": 250, "500g": 225, "1kg": 450 },
  "jaguar":    { "100g": 53, "250g": 122, "454g": 260, "500g": 233, "1kg": 460 },
  "oso-negro": { "100g": 54, "250g": 119, "454g": 250, "500g": 225, "1kg": 450 },
  "flamingo":  { "100g": 64, "250g": 147, "454g": 281, "500g": 284, "1kg": 558 }
};
const NOMBRES = { "puma": "Puma", "armadillo": "Armadillo", "jaguar": "Jaguar", "oso-negro": "Oso Negro", "flamingo": "Flamingo" };
const ETIQ_TAM = { "100g": "100 g", "250g": "250 g", "454g": "454 g (1 lb)", "500g": "500 g", "1kg": "1 kg" };
const ETIQ_MOL = { grano: "Grano", molido: "Molido" };
const GRAMOS   = { "100g": 100, "250g": 250, "454g": 454, "500g": 500, "1kg": 1000 };

// Envío (ajustable): tarifa en centavos MXN y umbral de gratuidad en gramos
const ENVIO_TARIFA_CENTAVOS = 19900;   // $199 MXN (promedio DHL nacional 1–5 kg)
const ENVIO_GRATIS_DESDE_G  = 5000;    // 5 kg

function precioDe(id, tamano, molienda) {
  const linea = PRECIOS[id];
  if (!linea) return null;
  const p = linea[tamano];
  if (p == null) return null;
  return (typeof p === "object") ? (p[molienda] ?? null) : p;
}

export default async (req) => {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store"
  };

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método no permitido" }), { status: 405, headers });
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return new Response(JSON.stringify({ error: "Stripe no está configurado (falta STRIPE_SECRET_KEY)" }), { status: 500, headers });
  }

  let body;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "JSON inválido" }), { status: 400, headers });
  }

  const items = Array.isArray(body?.items) ? body.items : [];
  if (!items.length || items.length > 30) {
    return new Response(JSON.stringify({ error: "Carrito vacío o inválido" }), { status: 400, headers });
  }

  // Validación estricta de cada renglón + cálculo de peso total
  const lineas = [];
  let pesoTotal = 0;
  for (const it of items) {
    const id = String(it.id || "");
    const tamano = String(it.tamano || "");
    const molienda = String(it.molienda || "grano");
    const cantidad = Math.floor(Number(it.cantidad));
    const precio = precioDe(id, tamano, molienda);
    if (precio == null || !Number.isFinite(cantidad) || cantidad < 1 || cantidad > 50 || !ETIQ_MOL[molienda]) {
      return new Response(JSON.stringify({ error: "Artículo inválido en el carrito" }), { status: 400, headers });
    }
    pesoTotal += GRAMOS[tamano] * cantidad;
    lineas.push({
      nombre: `Café ${NOMBRES[id]} · ${ETIQ_TAM[tamano]} · ${ETIQ_MOL[molienda]}`,
      centavos: Math.round(precio * 100),
      cantidad
    });
  }

  const envioGratis = pesoTotal >= ENVIO_GRATIS_DESDE_G;
  const base = process.env.URL || "https://www.momotocafe.com";

  // Cuerpo x-www-form-urlencoded para la API de Stripe (sin dependencias npm)
  const p = new URLSearchParams();
  p.append("mode", "payment");
  p.append("currency", "mxn");
  p.append("locale", "es");
  p.append("success_url", `${base}/gracias.html?session_id={CHECKOUT_SESSION_ID}`);
  p.append("cancel_url", `${base}/#cafe`);
  p.append("shipping_address_collection[allowed_countries][0]", "MX");
  p.append("phone_number_collection[enabled]", "true");
  p.append("metadata[peso_total_g]", String(pesoTotal));

  lineas.forEach((l, i) => {
    p.append(`line_items[${i}][quantity]`, String(l.cantidad));
    p.append(`line_items[${i}][price_data][currency]`, "mxn");
    p.append(`line_items[${i}][price_data][unit_amount]`, String(l.centavos));
    p.append(`line_items[${i}][price_data][product_data][name]`, l.nombre);
  });

  // Envío: gratis desde 5 kg; si no, tarifa fija DHL nacional
  p.append("shipping_options[0][shipping_rate_data][type]", "fixed_amount");
  p.append("shipping_options[0][shipping_rate_data][display_name]", envioGratis ? "Envío GRATIS (pedido de 5 kg o más) · DHL" : "Envío nacional · DHL");
  p.append("shipping_options[0][shipping_rate_data][fixed_amount][amount]", envioGratis ? "0" : String(ENVIO_TARIFA_CENTAVOS));
  p.append("shipping_options[0][shipping_rate_data][fixed_amount][currency]", "mxn");
  p.append("shipping_options[0][shipping_rate_data][delivery_estimate][minimum][unit]", "business_day");
  p.append("shipping_options[0][shipping_rate_data][delivery_estimate][minimum][value]", "2");
  p.append("shipping_options[0][shipping_rate_data][delivery_estimate][maximum][unit]", "business_day");
  p.append("shipping_options[0][shipping_rate_data][delivery_estimate][maximum][value]", "6");

  try {
    const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: p.toString()
    });
    const data = await r.json();
    if (!r.ok) {
      console.error("Stripe error:", data?.error?.message);
      return new Response(JSON.stringify({ error: "No se pudo crear el pago. Intenta de nuevo." }), { status: 502, headers });
    }
    return new Response(JSON.stringify({ url: data.url }), { status: 200, headers });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Error de conexión con Stripe" }), { status: 502, headers });
  }
};

export const config = { path: "/api/checkout" };
