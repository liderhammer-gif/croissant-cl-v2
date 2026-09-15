# Croissant.cl v2

Nueva web de Croissant.cl / La Boulangerie 17 construida con Next.js, React, TypeScript y PostgreSQL.

## Estado actual

- Home pública premium con identidad Croissant.cl + LB17 y hero fotográfico.
- Producto destacado Croissant, proceso, laminado, historia, Instagram y contacto.
- Formulario HORECA con RUT, productos, múltiplos de 6, 72 horas, retiro/despacho y reglas de cobertura.
- API HORECA con PostgreSQL, SMTP y Cloudflare Turnstile.
- Formulario de contacto general con persistencia en PostgreSQL, confirmación por correo y adjunto privado en Cloudflare R2.
- Política de privacidad, condiciones HORECA, robots y sitemap.
- Panel privado `/atelier-prive` con contraseña + TOTP, sesiones seguras, dashboard y vista de solicitudes.
- Modelo de datos preparado para productos, precios, cotizaciones, pedidos, pagos, documentos, calendario y contenido.

## Desarrollo local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abrir http://localhost:3000.

## Base de datos

Ejecutar en orden:

```bash
psql "$DATABASE_URL" -f db/001_public_horeca.sql
psql "$DATABASE_URL" -f db/002_admin_core.sql
```

## Crear el administrador

La contraseña nunca debe guardarse en GitHub. Definirla temporalmente en el shell y ejecutar:

```bash
ADMIN_EMAIL="tu-correo" ADMIN_PASSWORD="una-clave-temporal-segura" npm run admin:bootstrap
```

El script devuelve el secreto/URI TOTP para configurar la app autenticadora. Después de crear el usuario, eliminar `ADMIN_PASSWORD` del entorno.

## Producción

```bash
npm install
npm run build
npm start
```

## Vultr

El despliegue final contempla Nginx + SSL, PostgreSQL persistente, `mail.croissant.cl`, Cloudflare R2 y Turnstile. El contenedor de Next.js escucha en el puerto 3000.

## Variables

Ver `.env.example`. Nunca subir contraseñas SMTP, base de datos, R2 ni secretos de Turnstile al repositorio.
