const { Router } = require('express');
const pool = require('../db');
const router = Router();

// GET /api/jugadores -> jugadores (consulta 2 de consultas.sql)
// Filtro opcional: /api/jugadores?posicion=delantero
router.get('/', async (req, res) => {
  const { posicion } = req.query;
  const params = [];
  let filtro = '';
  if (posicion) {
    filtro = 'WHERE LOWER(j.posicion) = LOWER($1)';
    params.push(posicion);
  }
  const { rows } = await pool.query(`
SELECT j.id, j.nombre, j.equipo_id, e.nombre AS equipo, j.posicion, j.dorsal AS numero, j.goles
FROM jugadores j
INNER JOIN equipos e ON j.equipo_id = e.id
${filtro}
ORDER BY e.nombre, j.dorsal
`, params);
  res.json(rows);
});

// GET /api/jugadores/:id -> un jugador
router.get('/:id', async (req, res) => {
  const { rows } = await pool.query(`
SELECT j.id, j.nombre, j.equipo_id, e.nombre AS equipo, j.posicion, j.dorsal AS numero, j.goles
FROM jugadores j
INNER JOIN equipos e ON j.equipo_id = e.id
WHERE j.id = $1
`, [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Jugador no encontrado' });
  res.json(rows[0]);
});

module.exports = router;
