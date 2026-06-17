// 1. IMPORTACIONES
import express = require('express');
import type { Request, Response } from 'express';

// 2. INSTANCIA DE LA APLICACIÓN
const app = express();
const PORT = 8080;

// 3. MIDDLEWARE (CAPA INTERMEDIA)
app.use(express.json());

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