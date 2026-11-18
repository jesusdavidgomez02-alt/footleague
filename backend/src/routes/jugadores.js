const { Router } = require('express');
const pool = require('../db');
const router = Router();

// GET /api/jugadores?posicion=Delantero -> jugadores (filtro opcional por posición)
router.get('/', async (req, res) => {
  const { posicion } = req.query;
  let sql = `SELECT j.id, j.nombre, j.posicion, j.dorsal, j.goles, e.nombre AS equipo
               FROM jugadores j
               JOIN equipos e ON e.id = j.equipo_id`;
  const params = [];
  if (posicion) {
    sql += ' WHERE LOWER(j.posicion) = LOWER($1)';
    params.push(posicion);
  }
  sql += ' ORDER BY e.nombre, j.dorsal';
  const { rows } = await pool.query(sql, params);
  res.json(rows);
});

// GET /api/jugadores/goleadores -> top 10 goleadores
// (va antes de "/:id" para que Express no confunda "goleadores" con un id)
router.get('/goleadores', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT j.id, j.nombre, j.posicion, j.goles, e.nombre AS equipo
       FROM jugadores j
       JOIN equipos e ON e.id = j.equipo_id
      ORDER BY j.goles DESC, j.nombre
      LIMIT 10`
  );
  res.json(rows);
});

// GET /api/jugadores/:id -> un jugador
router.get('/:id', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT j.*, e.nombre AS equipo
       FROM jugadores j JOIN equipos e ON e.id = j.equipo_id
      WHERE j.id = $1`,
    [req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Jugador no encontrado' });
  res.json(rows[0]);
});

module.exports = router;
