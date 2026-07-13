/* ============================================================
   MOMOTO CAFÉ · Netlify Function — paypal-create-order
   Crea una orden de PayPal (Orders v2) con los precios REALES
   validados en el servidor (nunca se confía en el cliente).
   Flujo de redirección: devuelve la URL de aprobación de PayPal.
   Requiere variables de entorno en Netlify:
     PAYPAL_CLIENT_ID, PAYPAL_SECRET
     PAYPAL_ENV = "sandbox" | "live"  (por defecto "live")
   Envío: $199 MXN · GRATIS a partir de 5 kg (5000 g).
   ============================================================ */

// Lista de precios oficial 2026 (MXN) — misma fuente que main.js / Stripe
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

const ENVIO_TARIFA = 199;      // $199 MXN
const ENVIO_GRATIS_DESDE_G = 5000; // 5 kg

function precioDe(id, tamano, molienda) {
  const linea = PRECIOS[id];
  if (!linea) return null;
  const p = linea[tamano];
  if (p == null) return null;
  return (typeof p === "object") ? (p[molienda] ?? null) : p;
}

function apiBase() {
  return (process.env.PAYPAL_ENV === "sandbox")
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";
}

async function accessToken() {
  const id = process.env.PAYPAL_CLIENT_ID, secret = process.env.PAYPAL_SECRET;
  const auth = Buffer.from(`${id}:${secret}`).toString("base64");
  const r = await fetch(`${apiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error_description || "OAuth PayPal falló");
  return data.access_token;
}

export default async (req) => {
  const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método no permitido" }), { status: 405, headers });
  }
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_SECRET) {
    return new Response(JSON.stringify({ error: "PayPal no está configurado (faltan credenciales)" }), { status: 500, headers });
  }

  let body;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "JSON inválido" }), { status: 400, headers });
  }

  const items = Array.isArray(body?.items) ? body.items : [];
  if (!items.length || items.length > 30) {
    return new Response(JSON.stringify({ error: "Carrito vacío o inválido" }), { status: 400, headers });
  }

  // Validación estricta + cálculo de totales
  const ppItems = [];
  let itemTotal = 0, pesoTotal = 0;
  for (const it of items) {
    const id = String(it.id || "");
    const tamano = String(it.tamano || "");
    const molienda = String(it.molienda || "grano");
    const cantidad = Math.floor(Number(it.cantidad));
    const precio = precioDe(id, tamano, molienda);
    if (precio == null || !Number.isFinite(cantidad) || cantidad < 1 || cantidad > 50 || !ETIQ_MOL[molienda]) {
      return new Response(JSON.stringify({ error: "Artículo inválido en el carrito" }), { status: 400, headers });
    }
    itemTotal += precio * cantidad;
    pesoTotal += GRAMOS[tamano] * cantidad;
    ppItems.push({
      name: `Café ${NOMBRES[id]} · ${ETIQ_TAM[tamano]} · ${ETIQ_MOL[molienda]}`.slice(0, 127),
      quantity: String(cantidad),
      unit_amount: { currency_code: "MXN", value: precio.toFixed(2) },
      category: "PHYSICAL_GOODS"
    });
  }

  const envio = (pesoTotal >= ENVIO_GRATIS_DESDE_G) ? 0 : ENVIO_TARIFA;
  const total = itemTotal + envio;
  const base = process.env.URL || "https://www.momotocafe.com";

  const orderBody = {
    intent: "CAPTURE",
    purchase_units: [{
      description: "Pedido Momoto Café",
      amount: {
        currency_code: "MXN",
        value: total.toFixed(2),
        breakdown: {
          item_total: { currency_code: "MXN", value: itemTotal.toFixed(2) },
          shipping:   { currency_code: "MXN", value: envio.toFixed(2) }
        }
      },
      items: ppItems
    }],
    payment_source: {
      paypal: {
        experience_context: {
          brand_name: "Momoto Café",
          locale: "es-MX",
          landing_page: "LOGIN",
          shipping_preference: "GET_FROM_FILE",
          user_action: "PAY_NOW",
          return_url: `${base}/api/paypal-capture-order`,
          cancel_url: `${base}/#cafe`
        }
      }
    }
  };

  try {
    const token = await accessToken();
    const r = await fetch(`${apiBase()}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderBody)
    });
    const data = await r.json();
    if (!r.ok) {
      console.error("PayPal create error:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "No se pudo crear el pago con PayPal. Intenta de nuevo." }), { status: 502, headers });
    }
    const links = Array.isArray(data.links) ? data.links : [];
    const approve = links.find((l) => l.rel === "payer-action") || links.find((l) => l.rel === "approve");
    if (!approve?.href) {
      console.error("PayPal sin enlace de aprobación:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "PayPal no devolvió el enlace de pago." }), { status: 502, headers });
    }
    return new Response(JSON.stringify({ url: approve.href, id: data.id }), { status: 200, headers });
  } catch (e) {
    console.error("PayPal create excepción:", e?.message || e);
    return new Response(JSON.stringify({ error: "Error de conexión con PayPal" }), { status: 502, headers });
  }
};

export const config = { path: "/api/paypal-create-order" };
