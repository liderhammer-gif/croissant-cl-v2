# Croissant.cl v2

Nueva web de Croissant.cl / La Boulangerie 17 construida con Next.js, React, TypeScript y PostgreSQL.

## Estado actual

- Home pública premium con identidad Croissant.cl + LB17.
- Hero con fotografía aprobada.
- Producto destacado Croissant.
- Secciones de elaboración, laminado, HORECA, historia, Instagram y contacto.
- Formulario HORECA con validación de RUT, cantidades, fechas, comunas, retiro/despacho y aceptación de condiciones.
- API HORECA preparada para guardar solicitudes en PostgreSQL y enviar confirmaciones por SMTP.
- Protección Cloudflare Turnstile preparada mediante variables de entorno.
- Política de privacidad, condiciones HORECA, robots y sitemap.

## Desarrollo local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abrir http://localhost:3000.

## Base de datos

Crear una base PostgreSQL y ejecutar:

```bash
psql "$DATABASE_URL" -f db/001_public_horeca.sql
```

No subir contraseñas, secretos SMTP ni credenciales de base de datos a GitHub.

## Producción

```bash
npm install
npm run build
npm start
```

## Docker / Vultr

El contenedor de Next.js escucha en el puerto 3000. En producción se pondrá Nginx delante de `127.0.0.1:3000`, SSL para `croissant.cl` y `www.croissant.cl`, PostgreSQL con volumen persistente y el servicio de correo de `mail.croissant.cl`.

## Variables principales

Ver `.env.example`: `DATABASE_URL`, SMTP y claves de Cloudflare Turnstile.

## Siguiente bloque

Panel privado `atelier-prive`: administración HORECA, productos, precios, cotizaciones, pedidos, pagos, calendario, documentos y contenido del sitio.
