# Paso 1: Usar una imagen oficial de Node.js (versión LTS)
FROM node:20-alpine AS builder

# Paso 2: Crear el directorio de trabajo dentro del contenedor
WORKDIR /app

# Paso 3: Copiar archivos de configuración de dependencias
COPY package*.json ./
COPY tsconfig.json ./

# Paso 4: Instalar todas las dependencias (incluyendo TypeScript)
RUN npm install

# Paso 5: Copiar el código fuente (carpeta src)
COPY src ./src

# Paso 6: Compilar TypeScript a JavaScript puro (crea la carpeta dist)
RUN npm run build

# Paso 7: Limpiar dependencias de desarrollo para que el contenedor pese poco
RUN npm prune --production

# ==========================================
# Fase de producción (Contenedor final Ultra-Ligero)
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Exponer el puerto en el que escucha tu Proxy
EXPOSE 8080

# Comando para arrancar el servidor compilado
CMD ["node", "dist/index.js"]