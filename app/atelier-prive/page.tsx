import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { pool } from "@/lib/db";

async function loadDashboard() {
  try {
    const [requests, quotes, orders, payments, recent] = await Promise.all([
      pool.query(`SELECT count(*)::int AS value FROM horeca_requests WHERE status='new'`),
      pool.query(`SELECT count(*)::int AS value FROM quotes WHERE status IN ('draft','sent')`),
      pool.query(`SELECT count(*)::int AS value FROM orders WHERE status IN ('pending','in_production','ready')`),
      pool.query(`SELECT count(*)::int AS value FROM payments WHERE status='proof_received'`),
      pool.query(`SELECT public_code, company, name, total_units, requested_date, status FROM horeca_requests ORDER BY created_at DESC LIMIT 8`)
    ]);
    return {
      ok: true,
      metrics: {
        requests: requests.rows[0].value,
        quotes: quotes.rows[0].value,
        orders: orders.rows[0].value,
        payments: payments.rows[0].value
      },
      recent: recent.rows
    };
  } catch (error) {
    console.error("Admin dashboard error", error);
    return { ok: false, metrics: { requests: 0, quotes: 0, orders: 0, payments: 0 }, recent: [] as Array<Record<string, unknown>> };
  }
}

export default async function AtelierPrivePage() {
  const session = await getAdminSession();
  if (!session) redirect("/atelier-prive/login");
  const data = await loadDashboard();

  return (
    <main className="adminShell">
      <aside className="adminSidebar">
        <div><strong>Croissant.cl</strong><small>ATELIER PRIVÉ</small></div>
        <nav>
          <a className="active" href="/atelier-prive">Resumen</a>
          <a href="/atelier-prive/solicitudes">Solicitudes</a>
          <a href="/atelier-prive/cotizaciones">Cotizaciones</a>
          <a href="/atelier-prive/pedidos">Pedidos</a>
          <a href="/atelier-prive/productos">Productos</a>
          <a href="/atelier-prive/calendario">Calendario</a>
          <a href="/atelier-prive/contenido">Contenido</a>
        </nav>
        <form action="/api/admin/logout" method="post"><button type="submit">Cerrar sesión</button></form>
      </aside>
      <section className="adminMain">
        <header className="adminTop"><div><p className="eyebrow">DASHBOARD</p><h1>Resumen HORECA</h1></div><span>{session.email}</span></header>
        {!data.ok && <div className="adminAlert">Ejecuta las migraciones de base de datos para activar las métricas del panel.</div>}
        <div className="metricGrid">
          <article><span>Solicitudes nuevas</span><strong>{data.metrics.requests}</strong></article>
          <article><span>Cotizaciones abiertas</span><strong>{data.metrics.quotes}</strong></article>
          <article><span>Pedidos activos</span><strong>{data.metrics.orders}</strong></article>
          <article><span>Pagos por revisar</span><strong>{data.metrics.payments}</strong></article>
        </div>
        <section className="adminPanel">
          <div className="adminPanelHead"><h2>Solicitudes recientes</h2><a href="/atelier-prive/solicitudes">Ver todas →</a></div>
          <div className="adminTableWrap">
            <table className="adminTable">
              <thead><tr><th>Código</th><th>Empresa</th><th>Contacto</th><th>Unidades</th><th>Fecha</th><th>Estado</th></tr></thead>
              <tbody>
                {data.recent.length === 0 && <tr><td colSpan={6}>Aún no hay solicitudes registradas.</td></tr>}
                {data.recent.map((row: any) => (
                  <tr key={row.public_code}><td>{row.public_code}</td><td>{row.company}</td><td>{row.name}</td><td>{row.total_units}</td><td>{String(row.requested_date).slice(0,10)}</td><td><span className="statusPill">{row.status}</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
