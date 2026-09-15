import Image from "next/image";

export default function Home() {
  return <main>
    <header className="nav shell">
      <a className="brand" href="#inicio"><span className="mark">◒</span><strong>croissant.cl</strong><small>LA BOULANGERIE 17</small></a>
      <nav><a href="#inicio">Inicio</a><a href="#destacados">Destacados</a><a href="#proceso">Elaboración</a><a href="#horeca">HORECA</a><a href="#historia">La Boulangerie 17</a></nav>
      <a className="button gold compact" href="#destacados">Descubrir</a>
    </header>

    <section id="inicio" className="hero">
      <div className="shell heroInner"><div className="heroCopy">
        <p className="eyebrow">CROISSANTS ARTESANALES</p>
        <h1>Más que un<br/>croissant, una<br/><em>experiencia.</em></h1>
        <p className="lead">Elaborados con mantequilla francesa y método tradicional, con el sello artesanal de La Boulangerie 17.</p>
        <div className="actions"><a className="button gold" href="#destacados">Ver destacados →</a><a className="button outline" href="#horeca">Cotizar HORECA</a></div>
      </div></div>
    </section>

    <section className="trust shell"><div><b>◇</b><strong>Ingredientes premium</strong><span>Selección de primera calidad</span></div><div><b>♨</b><strong>Elaboración artesanal</strong><span>Método francés tradicional</span></div><div><b>✦</b><strong>Calidad garantizada</strong><span>Sabor y textura inigualables</span></div><div><b>▣</b><strong>Despachos</strong><span>Consulta cobertura disponible</span></div></section>

    <section id="destacados" className="section shell featured">
      <div className="featureMedia">
        <Image src="/images/croissants-chocolate.webp" alt="Croissants artesanales cubiertos de chocolate" fill sizes="(max-width: 850px) 100vw, 50vw" priority={false}/>
      </div>
      <div className="featureCopy">
        <p className="eyebrow">SABORES DESTACADOS</p>
        <h2>Chocolate intenso,<br/>laminado perfecto</h2>
        <p>Una combinación de masa hojaldrada, mantequilla y chocolate generoso. Fotografías reales de nuestra producción, trabajadas para mantener una estética cálida y premium en toda la experiencia de croissant.cl.</p>
        <p className="note">El catálogo completo y sus variedades se incorporarán en una siguiente etapa.</p>
      </div>
    </section>

    <section id="proceso" className="process">
      <div className="processVisual">
        <Image src="/images/rolls-artesanales.webp" alt="Rolls artesanales recién horneados en rack de panadería" fill sizes="(max-width: 850px) 100vw, 50vw"/>
      </div>
      <div className="processCopy"><p className="eyebrow">PRODUCCIÓN ARTESANAL</p><h2>Tradición francesa<br/>en cada hornada</h2><p>Trabajamos cada masa con laminado artesanal y fermentación lenta. La producción se realiza en lotes, cuidando color, textura, capas y terminación antes de cada despacho.</p><a className="button gold" href="#horeca">Conoce nuestras soluciones →</a></div>
    </section>

    <section id="horeca" className="horeca"><div className="shell horecaGrid"><div><p className="eyebrow">HORECA</p><h2>Soluciones para<br/>tu negocio</h2><p>Croissants frescos o congelados en formatos especiales para cafeterías, hoteles, restaurantes, tiendas gourmet y eventos.</p><a className="button gold" href="mailto:contacto@croissant.cl">Cotizar para mi negocio →</a></div><div className="benefits"><p>▱ Productos de alta rotación</p><p>◇ Formatos a tu medida</p><p>◉ Asesoría personalizada</p><p>▣ Soluciones de despacho</p></div></div></section>

    <section id="historia" className="story shell section"><div><p className="eyebrow">LA BOULANGERIE 17</p><h2>Una historia de pasión</h2><p>Una propuesta artesanal nacida en Chile, donde combinamos técnica, ingredientes de primera calidad y un profundo respeto por la panadería francesa.</p><a className="textLink" href="#inicio">Volver al inicio →</a></div><blockquote>“Cada capa cuenta una historia: tiempo, técnica y buenos ingredientes.”<small>— La Boulangerie 17</small></blockquote></section>

    <footer><div className="shell footerGrid"><div className="brand"><strong>croissant.cl</strong><small>LA BOULANGERIE 17</small></div><p>Tradición francesa, elaborada en Chile.</p><a className="button gold compact" href="#horeca">Cotizar HORECA →</a></div><div className="shell copyright">© {new Date().getFullYear()} Croissant.cl · La Boulangerie 17.</div></footer>
  </main>;
}
