const express = require('express');

// SIMULADOR 1: EL BACKEND (Puerto 3000)
const backend = express();
backend.use(express.json());

backend.get('/test', (req, res) => {
    res.json({ origen: "Backend Real", mensaje: "¡Hola desde el Backend simulado!" });
});

backend.get('/interno/saldos', (req, res) => {
    res.json({ origen: "Backend Real", saldo: 5000, cuenta: "CA-9874" });
});

backend.listen(3000, () => console.log('🚀 Backend Simulado corriendo en http://localhost:3000'));


// SIMULADOR 2: LA PASARELA DE PAGOS (Puerto 3001)
const pasarela = express();
pasarela.use(express.json());

pasarela.post('/pagar', (req, res) => {
    res.json({ origen: "Pasarela Real", transaccionId: "TX-100293", estado: "APROBADA" });
});

pasarela.listen(3001, () => console.log('💳 Pasarela Simulada corriendo en http://localhost:3001'));