# Croissant.cl — despliegue en Vultr

Arquitectura prevista:

- Next.js en Docker, escuchando solo en `127.0.0.1:3000`.
- PostgreSQL 17 en Docker, sin puerto público.
- Nginx en el host como reverse proxy.
- Let's Encrypt para TLS.
- Cloudflare R2 para imágenes/adjuntos.
- Correo en `mail.croissant.cl` como servicio separado.

## 1. Preparar servidor

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git nginx certbot python3-certbot-nginx docker.io docker-compose-plugin ufw
sudo systemctl enable --now docker nginx
```

Firewall mínimo:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

Los puertos de correo se abrirán cuando se despliegue `mail.croissant.cl`.

## 2. Clonar proyecto

```bash
sudo mkdir -p /opt/croissant-cl
sudo chown $USER:$USER /opt/croissant-cl
git clone https://github.com/liderhammer-gif/croissant-cl-v2.git /opt/croissant-cl
cd /opt/croissant-cl
cp .env.production.example .env.production
```

Editar `.env.production` y reemplazar todos los valores `CHANGE_ME`. Nunca subir ese archivo a GitHub.

## 3. DNS previo

Antes de emitir SSL, crear en Hepsia:

- `A` para `croissant.cl` → IP pública del VPS.
- `A` para `www.croissant.cl` → IP pública del VPS, o `CNAME` a `croissant.cl`.

## 4. Iniciar aplicación y PostgreSQL

```bash
cd /opt/croissant-cl
docker compose up -d --build
```

Comprobar:

```bash
docker compose ps
curl -I http://127.0.0.1:3000
```

## 5. Inicializar base de datos

Aplicar las migraciones SQL de `db/` contra PostgreSQL. Ejemplo:

```bash
cat db/001_public_horeca.sql | docker compose exec -T postgres psql -U croissant -d croissant
```

Aplicar de la misma forma las migraciones posteriores en orden numérico.

## 6. Nginx y HTTPS

```bash
sudo cp deploy/nginx/croissant.cl.conf /etc/nginx/sites-available/croissant.cl
sudo ln -s /etc/nginx/sites-available/croissant.cl /etc/nginx/sites-enabled/croissant.cl
sudo nginx -t
```

Para el primer certificado, puede ser necesario usar temporalmente solo el bloque HTTP o dejar que Certbot genere el bloque SSL:

```bash
sudo certbot --nginx -d croissant.cl -d www.croissant.cl
sudo nginx -t && sudo systemctl reload nginx
```

## 7. Administrador

Configurar temporalmente `ADMIN_EMAIL` y `ADMIN_PASSWORD` en `.env.production`, ejecutar el bootstrap indicado en el proyecto y luego eliminar `ADMIN_PASSWORD` del archivo. Activar 2FA desde el panel privado.

## 8. Actualizaciones

```bash
cd /opt/croissant-cl
git pull --ff-only
docker compose up -d --build
```

## 9. Backups

Como mínimo, crear backup diario de PostgreSQL fuera del volumen Docker:

```bash
mkdir -p /opt/backups/croissant

docker compose exec -T postgres pg_dump -U croissant croissant | gzip > /opt/backups/croissant/croissant-$(date +%F).sql.gz
```

Conservar además una copia externa del VPS.

## 10. Pendiente de infraestructura

Después del sitio web: desplegar `mail.croissant.cl`, configurar en Hepsia MX/SPF/DKIM/DMARC y en Vultr el PTR/rDNS. Luego crear los buzones separados `contacto@croissant.cl`, `horeca@croissant.cl` y `admin@croissant.cl`.
