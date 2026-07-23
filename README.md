# Proxy

## Requisitos

- **Docker** y **Docker Compose** instalados.

### Instalar Docker

| Sistema | Comando / instrucción |
|---|---|
| **Linux (Debian/Ubuntu)** | `sudo apt install docker.io docker-compose-v2 && sudo systemctl enable --now docker` |
| **Linux (Arch)** | `sudo pacman -S docker docker-compose` |
| **macOS** | Descargar e instalar [Docker Desktop](https://www.docker.com/products/docker-desktop/) |
| **Windows** | Descargar e instalar [Docker Desktop](https://www.docker.com/products/docker-desktop/) |

Verificar con `docker --version`.

## Docker

### Construir
```bash
docker build -t billetera-proxy .
```

### Ejecutar
```bash
docker rm -f proxy 2>/dev/null
docker run -d --name proxy \
  -e URL_BACKEND=http://IP_DEL_BACKEND:5000 \
  -e URL_PASARELA=http://IP_DE_PASARELA:6000 \
  -p 8080:8080 \
  billetera-proxy
```

Reemplazar `IP_DEL_BACKEND` e `IP_DE_PASARELA` por las IPs donde corren esos servicios. Si todo corre en la misma PC, usar `localhost`.

Para probar todo local, usá `./start.sh` en la raíz del proyecto.

### Variables de entorno
| Variable | Descripción | Default |
|---|---|---|
| `PORT` | Puerto del servidor | `8080` |
| `URL_BACKEND` | URL del backend | `http://localhost:5000` |
| `URL_PASARELA` | URL de la pasarela de pagos | `http://localhost:6000` |
