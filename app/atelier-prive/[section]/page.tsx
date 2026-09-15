import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";

const sections: Record<string, { title: string; description: string }> = {
  solicitudes: { title: "Solicitudes HORECA", description: "Aquí se gestionarán las solicitudes recibidas desde la web." },
  cotizaciones: { title: "Cotizaciones", description: "Creación, envío, vigencia, aceptación y rechazo de cotizaciones." },
  pedidos: { title: "Pedidos", description: "Estados de producción, pagos, documentos y seguimiento del cliente." },
  productos: { title: "Productos", description: "Categorías, precios unitarios, disponibilidad, fotos, descripciones y alérgenos." },
  calendario: { title: "Calendario", description: "Capacidad diaria, retiros, despachos, bloqueos y planificación de producción." },
  contenido: { title: "Contenido", description: "Textos del sitio, borradores, publicación e historial de versiones." }
};

export default async function AdminSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const session = await getAdminSession();
  if (!session) redirect("/atelier-prive/login");
  const { section } = await params;
  const config = sections[section];
  if (!config) notFound();

  return (
    <main className="adminShell">
      <aside className="adminSidebar">
        <div><strong>Croissant.cl</strong><small>ATELIER PRIVÉ</small></div>
        <nav>
          <a href="/atelier-prive">Resumen</a>
          <a className={section === "solicitudes" ? "active" : ""} href="/atelier-prive/solicitudes">Solicitudes</a>
          <a className={section === "cotizaciones" ? "active" : ""} href="/atelier-prive/cotizaciones">Cotizaciones</a>
          <a className={section === "pedidos" ? "active" : ""} href="/atelier-prive/pedidos">Pedidos</a>
          <a className={section === "productos" ? "active" : ""} href="/atelier-prive/productos">Productos</a>
          <a className={section === "calendario" ? "active" : ""} href="/atelier-prive/calendario">Calendario</a>
          <a className={section === "contenido" ? "active" : ""} href="/atelier-prive/contenido">Contenido</a>
        </nav>
        <form action="/api/admin/logout" method="post"><button type="submit">Cerrar sesión</button></form>
      </aside>
      <section className="adminMain">
        <header className="adminTop"><div><p className="eyebrow">ATELIER PRIVÉ</p><h1>{config.title}</h1></div><span>{session.email}</span></header>
        <section className="adminPanel">
          <div className="adminPanelHead"><h2>Módulo preparado</h2></div>
          <p style={{color:"#6f6257", lineHeight:1.7}}>{config.description}</p>
          <p style={{color:"#918376", fontSize:12}}>La estructura de datos ya está creada. Las acciones de edición se incorporan en el siguiente bloque de desarrollo.</p>
        </section>
      </section>
    </main>
  );
}
