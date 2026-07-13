/* ============================================================
   MOMOTO CAFÉ · Netlify Function — paypal-capture-order
   URL de retorno de PayPal. Captura la orden aprobada y
   redirige a /gracias.html (o al carrito si falla / se cancela).
   Requiere: PAYPAL_CLIENT_ID, PAYPAL_SECRET, PAYPAL_ENV.
   ============================================================ */

function apiBase() {
  return (process.env.PAYPAL_ENV === "sandbox")
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";
}

async function accessToken() {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString("base64");
  const r = await fetch(`${apiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: { "Authorization": `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials"
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error_description || "OAuth PayPal falló");
  return data.access_token;
}

export default async (req) => {
  const base = process.env.URL || "https://www.momotocafe.com";
  const url = new URL(req.url);
  const orderId = url.searchParams.get("token"); // PayPal devuelve el id de la orden como ?token=

  const redirect = (to) => new Response(null, { status: 302, headers: { Location: to, "Cache-Control": "no-store" } });

  // Cancelación o retorno sin orden → de vuelta al catálogo
  if (!orderId) return redirect(`${base}/#cafe`);
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_SECRET) return redirect(`${base}/#cafe`);

  try {
    const token = await accessToken();
    const r = await fetch(`${apiBase()}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
    });
    const data = await r.json();
    if (r.ok && data.status === "COMPLETED") {
      return redirect(`${base}/gracias.html?pp=ok`);
    }
    // Ya capturada previamente también cuenta como éxito
    if (data?.details?.[0]?.issue === "ORDER_ALREADY_CAPTURED") {
      return redirect(`${base}/gracias.html?pp=ok`);
    }
    console.error("PayPal capture error:", JSON.stringify(data));
    return redirect(`${base}/#cafe?pp=error`);
  } catch (e) {
    console.error("PayPal capture excepción:", e?.message || e);
    return redirect(`${base}/#cafe?pp=error`);
  }
};

export const config = { path: "/api/paypal-capture-order" };
