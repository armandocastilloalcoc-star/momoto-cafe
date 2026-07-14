/* ============================================================
   MOMOTO CAFÉ · Netlify Function — create-subscription
   Suscripción MENSUAL con Stripe Checkout (mode=subscription).
   Precio recurrente = café −10% + envío ($199, gratis desde 5 kg),
   con precios REALES validados en el servidor.
   Requiere STRIPE_SECRET_KEY (la misma del checkout de un solo pago).
   ============================================================ */

// Lista de precios oficial 2026 (MXN) — misma fuente que main.js / checkout
const PRECIOS = {
  "puma":      { "100g": { grano: 52, molido: 51 }, "250g": { grano: 119, molido: 116 }, "454g": 250, "500g": 225, "1kg": 450 },
  "armadillo": { "100g": { grano: 52, molido: 51 }, "250g": { grano: 119, molido: 116 }, "454g": 250, "500g": 225, "1kg": 450 },
  "jaguar":    { "100g": 53, "250g": 122, "454g": 260, "500g": 233, "1kg": 460 },
  "oso-negro": { "100g": 54, "250g": 119, "454g": 250, "500g": 225, "1kg": 450 },
  "flamingo":  { "100g": 64, "250g": 147, "454g": 281, "500g": 284, "1kg": 558 }
};
const NOMBRES  = { "puma": "Puma", "armadillo": "Armadillo", "jaguar": "Jaguar", "oso-negro": "Oso Negro", "flamingo": "Flamingo" };
const ETIQ_TAM = { "100g": "100 g", "250g": "250 g", "454g": "454 g (1 lb)", "500g": "500 g", "1kg": "1 kg" };
const ETIQ_MOL = { grano: "Grano", molido: "Molido" };
const GRAMOS   = { "100g": 100, "250g": 250, "454g": 454, "500g": 500, "1kg": 1000 };

const DESCUENTO = 0.90;          // −10% para suscriptores
const ENVIO_TARIFA_CENTAVOS = 19900;  // $199 MXN
const ENVIO_GRATIS_DESDE_G  = 5000;   // 5 kg

function precioDe(id, tamano, molienda) {
  const linea = PRECIOS[id];
  if (!linea) return null;
  const p = linea[tamano];
  if (p == null) return null;
  return (typeof p === "object") ? (p[molienda] ?? null) : p;
}

export default async (req) => {
  const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Método no permitido" }), { status: 405, headers });

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return new Response(JSON.stringify({ error: "Stripe no está configurado" }), { status: 500, headers });

  let body;
  try { body = await req.json(); } catch { return new Response(JSON.stringify({ error: "JSON inválido" }), { status: 400, headers }); }

  const id = String(body?.id || "");
  const tamano = String(body?.tamano || "");
  const molienda = String(body?.molienda || "grano");
  const precio = precioDe(id, tamano, molienda);
  if (precio == null || !ETIQ_MOL[molienda]) {
    return new Response(JSON.stringify({ error: "Artículo inválido" }), { status: 400, headers });
  }

  const cafeCentavos = Math.round(precio * DESCUENTO * 100);
  const envioCentavos = 0; // Envío GRATIS a todo México
  const nombre = `Suscripción mensual · Café ${NOMBRES[id]} · ${ETIQ_TAM[tamano]} · ${ETIQ_MOL[molienda]} (−10%)`;
  const base = process.env.URL || "https://www.momotocafe.com";

  const p = new URLSearchParams();
  p.append("mode", "subscription");
  p.append("currency", "mxn");
  p.append("locale", "es");
  p.append("success_url", `${base}/gracias.html?sub=ok&session_id={CHECKOUT_SESSION_ID}`);
  p.append("cancel_url", `${base}/#cafe`);
  p.append("shipping_address_collection[allowed_countries][0]", "MX");
  p.append("phone_number_collection[enabled]", "true");
  p.append("subscription_data[metadata][linea]", `${id}/${tamano}/${molienda}`);

  // Línea 1: el café (recurrente, mensual, con −10%)
  p.append("line_items[0][quantity]", "1");
  p.append("line_items[0][price_data][currency]", "mxn");
  p.append("line_items[0][price_data][unit_amount]", String(cafeCentavos));
  p.append("line_items[0][price_data][recurring][interval]", "month");
  p.append("line_items[0][price_data][product_data][name]", nombre);

  // Línea 2: envío mensual (recurrente), gratis si ≥5 kg
  if (envioCentavos > 0) {
    p.append("line_items[1][quantity]", "1");
    p.append("line_items[1][price_data][currency]", "mxn");
    p.append("line_items[1][price_data][unit_amount]", String(envioCentavos));
    p.append("line_items[1][price_data][recurring][interval]", "month");
    p.append("line_items[1][price_data][product_data][name]", "Envío mensual (nacional)");
  }

  try {
    const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: p.toString()
    });
    const data = await r.json();
    if (!r.ok) {
      console.error("Stripe sub error:", data?.error?.message);
      return new Response(JSON.stringify({ error: "No se pudo crear la suscripción. Intenta de nuevo." }), { status: 502, headers });
    }
    return new Response(JSON.stringify({ url: data.url }), { status: 200, headers });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Error de conexión con Stripe" }), { status: 502, headers });
  }
};

export const config = { path: "/api/create-subscription" };
