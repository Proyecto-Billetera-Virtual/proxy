# Proxy

## Docker

### Construir la imagen
```bash
docker build -t billetera-proxy .
```

### Ejecutar en una PC de la LAN
```bash
docker rm -f proxy 2>/dev/null
docker run -d --name proxy \
  -e URL_BACKEND=http://<IP_DEL_BACKEND>:5000 \
  -e URL_PASARELA=http://<IP_DE_PASARELA>:6000 \
  -p 8080:8080 \
  billetera-proxy
```

Reemplazar `<IP_DEL_BACKEND>` e `<IP_DE_PASARELA>` por las IPs de las PCs donde corren esos servicios.

### Variables de entorno
| Variable | Descripción | Default |
|---|---|---|
| `PORT` | Puerto del servidor | `8080` |
| `URL_BACKEND` | URL del backend | `http://localhost:5000` |
| `URL_PASARELA` | URL de la pasarela de pagos | `http://localhost:6000` |
