require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');

const app = express();
app.use(cors());          // permite que el frontend consulte la API desde otro puerto/dominio
app.use(express.json());

// Sirve el frontend: al abrir http://localhost:3000 se ve la página de la carpeta /frontend
app.use(express.static(path.join(__dirname, '..', '..', 'frontend')));

// Lista de endpoints disponibles
app.get('/api', (req, res) => {
  res.json({
    api: 'FootLeague - Sistema web para la gestión y administración de ligas de fútbol',
    endpoints: [
      'GET /api/equipos',
      'GET /api/equipos/:id',
      'GET /api/equipos/:id/jugadores',
      'GET /api/jugadores?posicion=delantero',
      'GET /api/jugadores/:id',
      'GET /api/partidos?equipo=3&jornada=2',
      'GET /api/posiciones',
      'GET /api/goleadores',
      'GET /api/health'
    ]
  });
});

// Verifica que la API y la base de datos respondan
app.get('/api/health', async (req, res) => {
  await pool.query('SELECT 1');
  res.json({ status: 'ok', db: 'conectada' });
});

app.use('/api/equipos', require('./routes/equipos'));
app.use('/api/jugadores', require('./routes/jugadores'));
app.use('/api/partidos', require('./routes/partidos'));
app.use('/api/posiciones', require('./routes/posiciones'));
app.use('/api/goleadores', require('./routes/goleadores'));

// Ruta no encontrada
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// Manejo de errores (id inválido, BD caída, etc.)
app.use((err, req, res, next) => {
  console.error(err.message);
  if (err.code === '22P02') return res.status(400).json({ error: 'Parámetro inválido' });
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`));
