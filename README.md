# Proxy
Bruno Levatino

# Docker
docker run -d -p 8080:8080 --add-host=host.docker.internal:host-gateway --env-file .env --name proxy-contenedor mi-proxy
