/* ============================================================
   MOMOTO CAFÉ · Netlify Function — rastreo
   Consulta el estado de una guía DHL (Unified Tracking API).
   Requiere la variable de entorno DHL_API_KEY (gratuita en
   developer.dhl.com → "Shipment Tracking - Unified").
   Si no hay API key, responde sinApi:true y el sitio abre la
   página pública de rastreo de DHL con la guía.
   ============================================================ */

export default async (req) => {
  const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };
  const url = new URL(req.url);
  const guia = (url.searchParams.get("guia") || "").trim();

  if (!/^[A-Za-z0-9]{8,22}$/.test(guia)) {
    return new Response(JSON.stringify({ error: "Número de guía inválido" }), { status: 400, headers });
  }

  const dhlPublico = `https://www.dhl.com/mx-es/home/rastreo.html?tracking-id=${encodeURIComponent(guia)}`;
  const apiKey = process.env.DHL_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ sinApi: true, url: dhlPublico }), { status: 200, headers });
  }

  try {
    const r = await fetch(
      `https://api-eu.dhl.com/track/shipments?trackingNumber=${encodeURIComponent(guia)}&language=es`,
      { headers: { "DHL-API-Key": apiKey, "Accept": "application/json" } }
    );
    if (r.status === 404) {
      return new Response(JSON.stringify({ error: "No encontramos esa guía. Revisa el número o intenta más tarde." }), { status: 404, headers });
    }
    if (!r.ok) {
      return new Response(JSON.stringify({ sinApi: true, url: dhlPublico }), { status: 200, headers });
    }
    const data = await r.json();
    const s = data?.shipments?.[0];
    if (!s) {
      return new Response(JSON.stringify({ error: "Sin información para esa guía todavía." }), { status: 404, headers });
    }

    const lugar = (loc) => {
      const a = loc?.address || {};
      return [a.addressLocality, a.countryCode].filter(Boolean).join(", ");
    };

    const respuesta = {
      guia: s.id,
      estatus: s.status?.description || s.status?.statusCode || "En tránsito",
      estatusCodigo: s.status?.statusCode || "",
      origen: lugar(s.origin),
      destino: lugar(s.destination),
      entregaEstimada: s.estimatedTimeOfDelivery || null,
      eventos: (s.events || []).slice(0, 15).map((e) => ({
        fecha: e.timestamp,
        lugar: lugar(e.location),
        descripcion: e.description || e.statusCode || ""
      })),
      urlDHL: dhlPublico
    };
    return new Response(JSON.stringify(respuesta), { status: 200, headers });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ sinApi: true, url: dhlPublico }), { status: 200, headers });
  }
};

export const config = { path: "/api/rastreo" };
