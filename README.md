# Croissant.cl v2

Nueva web de Croissant.cl / La Boulangerie 17 construida con Next.js, React y TypeScript.

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir http://localhost:3000.

## Producción

```bash
npm run build
npm start
```

## Docker

```bash
docker build -t croissant-cl-v2 .
docker run -d --name croissant-cl -p 3000:3000 --restart unless-stopped croissant-cl-v2
```

Para producción en Vultr, poner Nginx delante de `127.0.0.1:3000` y emitir SSL para `croissant.cl` y `www.croissant.cl`.

## Próximos pasos

- Reemplazar recursos visuales temporales por fotografías reales optimizadas.
- Crear catálogo y páginas de producto.
- Implementar formulario HORECA.
- Integrar carrito/pagos cuando se defina el backend comercial.
- Añadir sitemap, datos estructurados y analítica.
