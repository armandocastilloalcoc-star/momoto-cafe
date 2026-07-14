/* ============================================================
   MOMOTO CAFÉ · Netlify Function — verify-session
   Confirma contra Stripe que una sesión de Checkout realmente
   se pagó, para que gracias.html no declare "pago recibido"
   a quien llega directo sin haber pagado.
   Requiere STRIPE_SECRET_KEY (la misma del checkout).
   ============================================================ */
export default async (req) => {
  const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };
  const sid = new URL(req.url).searchParams.get("session_id");
  const key = process.env.STRIPE_SECRET_KEY;
  if (!sid || !key) return new Response(JSON.stringify({ paid: false }), { headers });
  try {
    const r = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sid)}`, {
      headers: { "Authorization": `Bearer ${key}` }
    });
    const d = await r.json();
    const paid = r.ok && (d.payment_status === "paid" || d.status === "complete");
    return new Response(JSON.stringify({ paid, amount: d.amount_total ?? null, currency: d.currency ?? null }), { headers });
  } catch {
    return new Response(JSON.stringify({ paid: false }), { headers });
  }
};

export const config = { path: "/api/verify-session" };
