import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { pool } from "@/lib/db";

export default async function SolicitudesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/atelier-prive/login");
  let rows: any[] = [];
  let error = false;
  try {
    const result = await pool.query(
      `SELECT r.id, r.public_code, r.company, r.name, r.email, r.phone, r.commune, r.product_format,
              r.delivery_mode, r.requested_date, r.time_slot, r.total_units, r.shipping_amount, r.status, r.created_at,
              coalesce(json_agg(json_build_object('name',i.product_name,'quantity',i.quantity) ORDER BY i.id)
                FILTER (WHERE i.id IS NOT NULL), '[]') AS items
         FROM horeca_requests r
         LEFT JOIN horeca_request_items i ON i.request_id=r.id
        GROUP BY r.id
        ORDER BY r.created_at DESC
        LIMIT 100`
    );
    rows = result.rows;
  } catch (e) {
    console.error(e);
    error = true;
  }

  return (
    <main className="adminShell">
      <aside className="adminSidebar">
        <div><strong>Croissant.cl</strong><small>ATELIER PRIVÉ</small></div>
        <nav>
          <a href="/atelier-prive">Resumen</a><a className="active" href="/atelier-prive/solicitudes">Solicitudes</a>
          <a href="/atelier-prive/cotizaciones">Cotizaciones</a><a href="/atelier-prive/pedidos">Pedidos</a>
          <a href="/atelier-prive/productos">Productos</a><a href="/atelier-prive/calendario">Calendario</a><a href="/atelier-prive/contenido">Contenido</a>
        </nav>
        <form action="/api/admin/logout" method="post"><button type="submit">Cerrar sesión</button></form>
      </aside>
      <section className="adminMain">
        <header className="adminTop"><div><p className="eyebrow">HORECA</p><h1>Solicitudes</h1></div><span>{session.email}</span></header>
        {error && <div className="adminAlert">No se pudo leer la base de datos. Revisa las migraciones y DATABASE_URL.</div>}
        <section className="adminPanel">
          <div className="adminPanelHead"><h2>Últimas solicitudes</h2><span>{rows.length} registros</span></div>
          <div className="adminTableWrap">
            <table className="adminTable">
              <thead><tr><th>Código</th><th>Empresa</th><th>Comuna</th><th>Modalidad</th><th>Unidades</th><th>Fecha</th><th>Estado</th></tr></thead>
              <tbody>
                {rows.length === 0 && <tr><td colSpan={7}>Aún no hay solicitudes.</td></tr>}
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td><strong>{row.public_code}</strong></td><td>{row.company}<br/><small>{row.name}</small></td><td>{row.commune}</td>
                    <td>{row.delivery_mode === "retiro" ? "Retiro" : "Despacho"}</td><td>{row.total_units}</td>
                    <td>{String(row.requested_date).slice(0,10)}<br/><small>{row.time_slot}</small></td><td><span className="statusPill">{row.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
