const { Router } = require('express');
const pool = require('../db');
const router = Router();

// GET /api/goleadores -> jugadores ordenados por goles (consulta 5 de consultas.sql)
router.get('/', async (req, res) => {
  const { rows } = await pool.query(`
SELECT j.id AS jugador_id, j.nombre, j.equipo_id, e.nombre AS equipo, j.goles
FROM jugadores j
INNER JOIN equipos e ON j.equipo_id = e.id
ORDER BY j.goles DESC, j.nombre ASC
`);
  res.json(rows);
});

module.exports = router;
