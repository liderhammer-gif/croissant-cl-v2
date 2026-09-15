const products = [
  ["Clásico", "La esencia del croissant"],
  ["Almendras", "Crujiente y delicado"],
  ["Crema Pastelera", "Suave y sofisticado"],
  ["Chocolate", "Intenso e irresistible"],
  ["Pistacho", "Un sabor extraordinario"]
];

export default function Home() {
  return <main>
    <header className="nav shell">
      <a className="brand" href="#inicio"><span className="mark">◒</span><strong>croissant.cl</strong><small>LA BOULANGERIE 17</small></a>
      <nav><a href="#inicio">Inicio</a><a href="#croissants">Croissants</a><a href="#proceso">Elaboración</a><a href="#horeca">HORECA</a><a href="#historia">La Boulangerie 17</a></nav>
      <a className="button gold compact" href="#croissants">Comprar ahora</a>
    </header>

    <section id="inicio" className="hero">
      <div className="shell heroInner"><div className="heroCopy">
        <p className="eyebrow">CROISSANTS ARTESANALES</p>
        <h1>Más que un<br/>croissant, una<br/><em>experiencia.</em></h1>
        <p className="lead">Elaborados con mantequilla francesa y método tradicional, con el sello artesanal de La Boulangerie 17.</p>
        <div className="actions"><a className="button gold" href="#croissants">Comprar croissants →</a><a className="button outline" href="#horeca">Cotizar HORECA</a></div>
      </div></div>
    </section>

    <section className="trust shell"><div><b>◇</b><strong>Ingredientes premium</strong><span>Selección de primera calidad</span></div><div><b>♨</b><strong>Elaboración artesanal</strong><span>Método francés tradicional</span></div><div><b>✦</b><strong>Calidad garantizada</strong><span>Sabor y textura inigualables</span></div><div><b>▣</b><strong>Despachos</strong><span>Consulta cobertura disponible</span></div></section>

    <section id="croissants" className="products section shell"><p className="eyebrow center">NUESTROS CROISSANTS</p><h2>Sabores que enamoran</h2><p className="sub center">Una selección de nuestras variedades más populares.</p><div className="productGrid">{products.map(([name, desc], i)=><article key={name}><div className={`pastry p${i}`} aria-hidden="true">🥐</div><h3>{name}</h3><p>{desc}</p></article>)}</div><a className="button gold centerButton" href="#">Ver todos los sabores →</a></section>

    <section id="proceso" className="process"><div className="processVisual"><span>🥐</span></div><div className="processCopy"><p className="eyebrow">EL ARTE DEL TIEMPO</p><h2>Tradición francesa<br/>en cada capa</h2><p>Trabajamos cada masa con laminado artesanal y fermentación lenta para lograr un croissant de exterior crujiente, interior aireado y aroma profundo.</p><a className="button gold" href="#">Conoce nuestro proceso →</a></div></section>

    <section id="horeca" className="horeca"><div className="shell horecaGrid"><div><p className="eyebrow">HORECA</p><h2>Soluciones para<br/>tu negocio</h2><p>Croissants frescos o congelados en formatos especiales para cafeterías, hoteles, restaurantes, tiendas gourmet y eventos.</p><a className="button gold" href="mailto:contacto@croissant.cl">Cotizar para mi negocio →</a></div><div className="benefits"><p>▱ Productos de alta rotación</p><p>◇ Formatos a tu medida</p><p>◉ Asesoría personalizada</p><p>▣ Soluciones de despacho</p></div></div></section>

    <section id="historia" className="story shell section"><div><p className="eyebrow">LA BOULANGERIE 17</p><h2>Una historia de pasión</h2><p>Una propuesta artesanal nacida en Chile, donde combinamos técnica, ingredientes de primera calidad y un profundo respeto por la panadería francesa.</p><a className="textLink" href="#">Conoce nuestra historia →</a></div><blockquote>“Cada capa cuenta una historia: tiempo, técnica y buenos ingredientes.”<small>— La Boulangerie 17</small></blockquote></section>

    <footer><div className="shell footerGrid"><div className="brand"><strong>croissant.cl</strong><small>LA BOULANGERIE 17</small></div><p>Tradición francesa, elaborada en Chile.</p><a className="button gold compact" href="#croissants">Comprar ahora →</a></div><div className="shell copyright">© {new Date().getFullYear()} Croissant.cl · La Boulangerie 17.</div></footer>
  </main>;
}
