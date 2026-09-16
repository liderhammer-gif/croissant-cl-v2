import Image from "next/image";
import HorecaForm from "@/components/HorecaForm";
import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <main>
      <header className="nav shell">
        <a className="brandLogo" href="#inicio" aria-label="Croissant.cl">
          <Image src="/images/logo-lb17.webp" alt="" width={58} height={58} priority />
          <span>
            <strong>Croissant.cl</strong>
            <small>LA BOULANGERIE 17</small>
          </span>
        </a>
        <nav aria-label="Navegación principal">
          <a href="#productos">Productos</a>
          <a href="#proceso">Elaboración</a>
          <a href="#horeca">HORECA</a>
          <a href="#historia">Historia</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <a className="button gold compact" href="#horeca">Cotizar HORECA</a>
      </header>

      <section id="inicio" className="hero">
        <div className="heroCopy shell">
          <div className="heroText">
            <p className="eyebrow">CROISSANT.CL · LA BOULANGERIE 17</p>
            <h1>Más que un croissant,<br/><em>una experiencia.</em></h1>
            <p className="lead">Laminado artesanal, mantequilla francesa y belga, fermentación lenta y una elaboración limitada y exclusiva.</p>
            <div className="actions">
              <a className="button gold" href="#productos">Conocer nuestros productos →</a>
              <a className="button outline" href="#horeca">Cotizar HORECA</a>
            </div>
          </div>
          <div className="heroMedia">
            <Image src="/images/hero-croissant.webp" alt="Croissants artesanales dorados" fill sizes="(max-width: 900px) 100vw, 55vw" priority />
          </div>
        </div>
      </section>

      <section className="trust shell" aria-label="Atributos de Croissant.cl">
        <div><b>01</b><strong>Mantequilla francesa y belga</strong><span>Ingredientes seleccionados</span></div>
        <div><b>02</b><strong>Laminado artesanal</strong><span>Capas trabajadas a mano</span></div>
        <div><b>03</b><strong>Fermentación lenta</strong><span>Tiempo, aroma y textura</span></div>
        <div><b>04</b><strong>Elaboración limitada</strong><span>Producción exclusiva</span></div>
      </section>

      <section id="productos" className="section shell productSpotlight">
        <div className="featureMedia">
          <Image src="/images/croissant-interior.webp" alt="Interior de croissant artesanal mostrando el laminado" fill sizes="(max-width: 850px) 100vw, 50vw" />
        </div>
        <div className="featureCopy">
          <p className="eyebrow">PRODUCTO DESTACADO</p>
          <h2>Croissant</h2>
          <p>Una masa laminada de elaboración artesanal, trabajada con mantequilla francesa y belga y fermentación lenta para conseguir una estructura ligera, definida y crujiente.</p>
          <div className="featureFacts"><span>Laminado artesanal</span><span>Fermentación lenta</span><span>Elaboración limitada</span></div>
          <a className="textLink" href="#proceso">Conoce cómo lo elaboramos →</a>
        </div>
      </section>

      <section id="proceso" className="process">
        <div className="processVisual"><Image src="/images/rolls-artesanales.webp" alt="Rollos artesanales de hojaldre recién horneados" fill sizes="(max-width: 850px) 100vw, 50vw" /></div>
        <div className="processCopy"><p className="eyebrow">ELABORACIÓN ARTESANAL</p><h2>Tiempo, técnica<br/>y precisión</h2><p>Cada masa se trabaja con laminado artesanal y fermentación lenta. La producción es limitada, cuidando textura, capas, color y terminación en cada hornada.</p><a className="button gold" href="#laminado">Ver el interior →</a></div>
      </section>

      <section id="laminado" className="section shell featured">
        <div className="featureCopy"><p className="eyebrow">EL ARTE DEL LAMINADO</p><h2>Así se ve<br/>por dentro</h2><p>La estructura interior refleja el trabajo detrás de cada pieza: capas definidas, ligereza y desarrollo de la masa mediante tiempo, temperatura y técnica.</p></div>
        <div className="featureMedia"><Image src="/images/croissants-chocolate.webp" alt="Croissants artesanales terminados con chocolate" fill sizes="(max-width: 850px) 100vw, 50vw" /></div>
      </section>

      <section id="horeca" className="horeca">
        <div className="shell horecaIntro">
          <div><p className="eyebrow">HORECA</p><h2>Hojaldres artesanales<br/>para tu negocio</h2><p>Formatos frescos y congelados para cafeterías, hoteles, restaurantes y empresas. Cotización personalizada, producción limitada y retiro o despacho según cobertura.</p></div>
          <div className="horecaRules"><p><strong>Pedido:</strong> 36 a 96 unidades, en múltiplos de 6.</p><p><strong>Anticipación:</strong> mínimo 72 horas.</p><p><strong>Días:</strong> jueves a sábado.</p><p><strong>Retiro:</strong> Lo Encalada 17, Ñuñoa.</p><p><strong>Despacho:</strong> sector oriente, tarifa fija $2.500.</p></div>
        </div>
        <div className="shell formWrap"><HorecaForm /></div>
      </section>

      <section id="faq-horeca" className="faq section">
        <div className="shell faqGrid">
          <div>
            <p className="eyebrow">PREGUNTAS FRECUENTES</p>
            <h2>HORECA, sin letra chica</h2>
            <p className="faqLead">Las principales condiciones están visibles antes de enviar la solicitud y vuelven a detallarse en la cotización formal.</p>
          </div>
          <div className="faqList">
            <details><summary>¿Cuál es el pedido mínimo?</summary><p>El pedido mínimo HORECA es de 36 unidades. Cada producto se solicita desde 6 unidades y siempre en múltiplos de 6.</p></details>
            <details><summary>¿Cuál es el máximo por pedido?</summary><p>El máximo práctico es de 96 unidades por pedido, manteniendo la regla de múltiplos de 6.</p></details>
            <details><summary>¿Con cuánta anticipación debo pedir?</summary><p>Las solicitudes requieren un mínimo de 72 horas de anticipación y están sujetas a capacidad y disponibilidad.</p></details>
            <details><summary>¿Qué días entregan o permiten retiro?</summary><p>Los retiros y despachos HORECA se programan de jueves a sábado, en franjas de 09:00–13:00 o 14:00–18:00.</p></details>
            <details><summary>¿Dónde despachan?</summary><p>El despacho está disponible en Ñuñoa, Providencia, Las Condes, Vitacura, Lo Barnechea y La Reina. La tarifa fija es de $2.500.</p></details>
            <details><summary>¿Puedo retirar?</summary><p>Sí. El retiro se realiza en la dirección de producción, Lo Encalada 17, Ñuñoa, previa confirmación del pedido.</p></details>
            <details><summary>¿Cómo se paga?</summary><p>El pago HORECA se realiza por transferencia bancaria: 50% de anticipo para confirmar y 50% restante antes del despacho o retiro.</p></details>
            <details><summary>¿Emiten factura?</summary><p>Sí. La factura electrónica se emite manualmente una vez validados los datos de facturación del cliente.</p></details>
          </div>
        </div>
      </section>

      <section id="historia" className="story shell section">
        <div><p className="eyebrow">DESDE 2017</p><h2>La Boulangerie 17</h2><p>La Boulangerie 17 nació en 2017 como una panadería artesanal enfocada en productos de alta calidad. Croissant.cl desarrolla esa experiencia alrededor del hojaldre, el tiempo y la técnica.</p></div>
        <blockquote>“Elaboración artesanal, producción limitada y una obsesión por cada capa.”<small>— Croissant.cl · La Boulangerie 17</small></blockquote>
      </section>

      <section className="instagram section">
        <div className="shell instagramHead"><div><p className="eyebrow">INSTAGRAM</p><h2>@croissant.chile</h2></div><a className="button darkButton" href="https://www.instagram.com/croissant.chile/" target="_blank" rel="noreferrer">Seguir en Instagram ↗</a></div>
        <div className="shell instaPlaceholder" aria-label="Galería de Instagram"><p>Las 6 publicaciones destacadas se administrarán desde el panel.</p></div>
      </section>

      <section id="contacto" className="contact section">
        <div className="shell contactGrid">
          <div><p className="eyebrow">CONTACTO</p><h2>Hablemos</h2><p>Para consultas generales puedes escribirnos a <a href="mailto:contacto@croissant.cl">contacto@croissant.cl</a> o usar el formulario.</p><ContactForm /></div>
          <div className="contactCard"><span>Instagram</span><a href="https://www.instagram.com/croissant.chile/" target="_blank" rel="noreferrer">@croissant.chile</a><span>Dirección de producción</span><strong>Lo Encalada 17, Ñuñoa</strong><small>No corresponde a un local de atención abierta al público.</small><a className="textLink" href="https://www.google.com/maps/search/?api=1&query=Lo+Encalada+17+Nunoa+Chile" target="_blank" rel="noreferrer">Cómo llegar ↗</a></div>
        </div>
      </section>

      <footer><div className="shell footerGrid"><div className="footerBrand"><Image src="/images/logo-lb17.webp" alt="" width={58} height={58} /><div><strong>Croissant.cl</strong><small>LA BOULANGERIE 17</small></div></div><div className="footerLinks"><a href="#faq-horeca">FAQ HORECA</a><a href="/privacidad">Privacidad</a><a href="/condiciones-horeca">Condiciones HORECA</a><a href="mailto:contacto@croissant.cl">Contacto</a></div><a className="button gold compact" href="#horeca">Cotizar HORECA →</a></div><div className="shell copyright">© {new Date().getFullYear()} Croissant.cl · Una marca de La Boulangerie 17.</div></footer>
    </main>
  );
}
