// 1. IMPORTACIONES
require('dotenv').config();
import express = require('express');
import type { Request, Response } from 'express';

// Carga el archivo .env en process.env
const proxy = require('express-http-proxy');

// 2. INSTANCIA DE LA APLICACIÓN
const app = express();
const cors = require('cors');
app.use(cors());
const PORT = process.env.PORT || 8080;
const URL_BACKEND = process.env.URL_BACKEND || 'http://localhost:3000';
const URL_PASARELA = process.env.URL_PASARELA || 'http://localhost:3001';

// 3. MIDDLEWARE (CAPA INTERMEDIA)
app.use(express.json());
app.use('/api', proxy(URL_BACKEND));
app.use('/pasarela', proxy(URL_PASARELA));
app.use('/api/interno', proxy(URL_BACKEND)); // canal interno para backend y pasarela

// Middleware para manejar logs
app.use((req: Request, res: Response, next: any) => {
    console.log(`[${new Date().toLocaleTimeString()}] Petición recibida: ${req.method} ${req.url}`);
    next(); // Crucial para que la petición no se quede colgada
});

// 4. CONFIGURACIÓN DE UNA RUTA (ENDPOINT DE PRUEBA)
app.get('/health', (req: Request, res: Response) => {
    // 5. RESPUESTA DEL SERVIDOR
    res.json({status: 'ok', message: 'Proxy Online'});
    console.log("Endpoint /health exitoso");
});

// 6. MANTIENE ENCENDIDO EL SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto ${PORT}`);
});