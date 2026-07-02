import dotenv from 'dotenv';
dotenv.config();

import express, { type Request, type Response } from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy';

const app = express();
const PORT = process.env.PORT || 8080;
const URL_BACKEND = process.env.URL_BACKEND || 'http://localhost:5000';
const URL_PASARELA = process.env.URL_PASARELA || 'http://localhost:6000';

app.use(cors());
app.use(express.json());

// Helper to preserve the full original path after the mount point
function fullPathResolver(prefix: string) {
  return (req: any) => `${prefix}${req.url}`;
}

// 1. Pasarela de pagos: /api/operaciones/*
app.use('/api/operaciones', proxy(URL_PASARELA, {
  proxyReqPathResolver: fullPathResolver('/api/operaciones'),
  proxyReqOptDecorator: (proxyReqOpts: any, srcReq: any) => {
    console.log(`Frontend -> Proxy: ${srcReq.method} ${srcReq.url}`);
    console.log(`Reenviando a Pasarela -> ${URL_PASARELA}/api/operaciones${srcReq.url}\n`);
    return proxyReqOpts;
  }
}));

// 2. Rutas internas (pasarela -> backend): /api/interno/*
app.use('/api/interno', proxy(URL_BACKEND, {
  proxyReqPathResolver: fullPathResolver('/api/interno'),
  proxyReqOptDecorator: (proxyReqOpts: any, srcReq: any) => {
    console.log(`Pasarela -> Proxy (Interno): ${srcReq.method} ${srcReq.url}`);
    console.log(`Reenviando a Backend -> ${URL_BACKEND}/api/interno${srcReq.url}\n`);
    return proxyReqOpts;
  }
}));

// 3. Backend catch-all: /api/auth/*, /api/cuenta/*
app.use('/api', proxy(URL_BACKEND, {
  proxyReqPathResolver: fullPathResolver('/api'),
  proxyReqOptDecorator: (proxyReqOpts: any, srcReq: any) => {
    console.log(`Frontend -> Proxy: ${srcReq.method} ${srcReq.url}`);
    console.log(`Reenviando a Backend -> ${URL_BACKEND}/api${srcReq.url}\n`);
    return proxyReqOpts;
  }
}));

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Proxy Online' });
});

app.listen(PORT, () => {
  console.log(`Proxy corriendo en http://localhost:${PORT}`);
  console.log(`  Backend: ${URL_BACKEND}`);
  console.log(`  Pasarela: ${URL_PASARELA}`);
});
