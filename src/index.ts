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



// Proxy para el Backend Estándar
app.use('/api', proxy(URL_BACKEND, {
    // 1. IDA: Cuando el proxy le reenvía al Backend
    proxyReqOptDecorator: (proxyReqOpts: any, srcReq: any) => {
        console.log(`Frontend -> Proxy: ${srcReq.method} ${srcReq.url}`);
        console.log(`Reenviando a Destinatario (Backend) -> ${URL_BACKEND}${proxyReqOpts.path}\n`);
        return proxyReqOpts;
    },
    // 2. VUELTA: Cuando el Backend responde con éxito
    userResDecorator: (proxyRes: any, proxyResData: any, userReq: any, userRes: any) => {
        console.log(`Confirmación desde Backend: Estado ${proxyRes.statusCode}`);
        console.log(`Enviando respuesta de regreso al Frontend\t `);
        return proxyResData; // Envía los datos intactos al front
    }
}));

// Proxy para la Pasarela de Pagos
app.use('/pasarela', proxy(URL_PASARELA, {
    proxyReqOptDecorator: (proxyReqOpts: any, srcReq: any) => {
        console.log(`Frontend -> Proxy: ${srcReq.method} ${srcReq.url}`);
        console.log(`Reenviando a Destinatario (Pasarela) -> ${URL_PASARELA}${proxyReqOpts.path}\n`);
        return proxyReqOpts;
    },
    userResDecorator: (proxyRes: any, proxyResData: any, userReq: any, userRes: any) => {
        console.log(`Confirmación desde Pasarela: Estado ${proxyRes.statusCode}`);
        console.log(`Enviando respuesta de regreso al Frontend\t `);
        return proxyResData;
    }
}));

// Canal Privado: Pasarela -> Backend
app.use('/api/interno', proxy(URL_BACKEND, {
    proxyReqOptDecorator: (proxyReqOpts: any, srcReq: Request) => {
        console.log(`Pasarela -> Proxy (Canal Privado): ${srcReq.method} ${srcReq.url}`);
        console.log(`Reenviando a Destinatario (Backend) -> ${URL_BACKEND}${proxyReqOpts.path}\n`);
        return proxyReqOpts;
    },
    userResDecorator: (proxyRes: any, proxyResData: any, userReq: Request, userRes: Response) => {
        console.log(`Confirmación desde Backend: Estado ${proxyRes.statusCode}`);
        console.log(`Enviando respuesta de regreso a Pasarela\t `);
        return proxyResData;
    }
}));

// ¡NUEVO! Canal Privado: Backend -> Pasarela
app.use('/pasarela/interno', proxy(URL_PASARELA, {
    proxyReqOptDecorator: (proxyReqOpts: any, srcReq: Request) => {
        console.log(`Backend -> Proxy (Canal Privado): ${srcReq.method} ${srcReq.url}`);
        console.log(`Reenviando a Destinatario (Pasarela) -> ${URL_PASARELA}${proxyReqOpts.path}\n`);
        return proxyReqOpts;
    },
    userResDecorator: (proxyRes: any, proxyResData: any, userReq: Request, userRes: Response) => {
        console.log(`Confirmación desde Pasarela: Estado ${proxyRes.statusCode}`);
        console.log(`Enviando respuesta de regreso al Backend\t `);
        return proxyResData;
    }
}));



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