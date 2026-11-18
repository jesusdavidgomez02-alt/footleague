const { Router } = require('express');
const pool = require('../db');
const router = Router();

// GET /api/equipos -> lista de equipos
router.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM equipos ORDER BY nombre');
  res.json(rows);
});

// GET /api/equipos/:id -> un equipo
router.get('/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM equipos WHERE id = $1', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Equipo no encontrado' });
  res.json(rows[0]);
});

// GET /api/equipos/:id/jugadores -> plantilla del equipo
router.get('/:id/jugadores', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, nombre, posicion, dorsal, goles
       FROM jugadores
      WHERE equipo_id = $1
      ORDER BY dorsal`,
    [req.params.id]
  );
  res.json(rows);
});

module.exports = router;
