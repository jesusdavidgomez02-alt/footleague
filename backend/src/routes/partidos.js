const { Router } = require('express');
const pool = require('../db');
const router = Router();

// GET /api/partidos?equipo=3 -> partidos (filtro opcional por equipo)
router.get('/', async (req, res) => {
  const { equipo } = req.query;
  let sql = `SELECT p.id, p.fecha,
                    el.nombre AS local, p.goles_local,
                    ev.nombre AS visitante, p.goles_visitante
               FROM partidos p
               JOIN equipos el ON el.id = p.local_id
               JOIN equipos ev ON ev.id = p.visitante_id`;
  const params = [];
  if (equipo) {
    sql += ' WHERE p.local_id = $1 OR p.visitante_id = $1';
    params.push(equipo);
  }
  sql += ' ORDER BY p.fecha';
  const { rows } = await pool.query(sql, params);
  res.json(rows);
});

module.exports = router;
