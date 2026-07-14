/* ============================================================
   MOMOTO CAFÉ · Netlify Function — customer-portal
   Abre el Portal de Cliente de Stripe para que el suscriptor
   gestione o CANCELE su suscripción él mismo.
   Seguro: usa el session_id del checkout (que solo tiene el
   propio cliente) para hallar su customer y crear la sesión
   del portal — no acepta emails arbitrarios.
   Requiere: STRIPE_SECRET_KEY + activar el Customer Portal en
   el dashboard de Stripe (Settings → Billing → Customer portal).
   ============================================================ */
export default async (req) => {
  const key = process.env.STRIPE_SECRET_KEY;
  const base = process.env.URL || "https://www.momotocafe.com";
  const sid = new URL(req.url).searchParams.get("session_id");
  const fail = (msg) => new Response(
    `<!doctype html><meta charset="utf-8"><body style="font-family:sans-serif;background:#062B26;color:#F4EFE6;text-align:center;padding:14vh 24px">
     <h1 style="font-weight:600">No pudimos abrir el portal</h1>
     <p style="opacity:.8;max-width:40ch;margin:12px auto">${msg}</p>
     <p><a style="color:#8FB8A6" href="https://wa.me/5219993183525?text=Hola%20Momoto%2C%20quiero%20gestionar%20mi%20suscripci%C3%B3n">Escríbenos por WhatsApp</a> y lo resolvemos.</p></body>`,
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
  );

  if (!key || !sid) return fail("Falta la referencia de tu suscripción.");
  try {
    const s = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sid)}`, {
      headers: { "Authorization": `Bearer ${key}` }
    });
    const sd = await s.json();
    const customer = sd && sd.customer;
    if (!s.ok || !customer) return fail("No encontramos tu suscripción.");

    const p = new URLSearchParams();
    p.append("customer", customer);
    p.append("return_url", `${base}/#cafe`);
    const r = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: p.toString()
    });
    const d = await r.json();
    if (r.ok && d.url) return Response.redirect(d.url, 303);
    console.error("Stripe portal error:", d && d.error && d.error.message);
    return fail("El portal aún no está activado. Escríbenos por WhatsApp y cancelamos por ti al instante.");
  } catch (e) {
    console.error(e);
    return fail("Error de conexión con Stripe.");
  }
};

export const config = { path: "/api/customer-portal" };
