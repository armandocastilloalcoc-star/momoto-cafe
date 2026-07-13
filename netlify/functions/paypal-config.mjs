/* ============================================================
   MOMOTO CAFÉ · Netlify Function — paypal-config
   Indica al frontend si PayPal está configurado, para mostrar
   el botón solo cuando existan las credenciales. No expone el
   secreto: solo un booleano y el modo (sandbox/live).
   ============================================================ */
export default async () => {
  const enabled = !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_SECRET);
  return new Response(JSON.stringify({
    enabled,
    env: process.env.PAYPAL_ENV === "sandbox" ? "sandbox" : "live"
  }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
  });
};

export const config = { path: "/api/paypal-config" };
