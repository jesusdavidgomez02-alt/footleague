const { Router } = require('express');
const pool = require('../db');
const router = Router();

// GET /api/posiciones -> tabla de posiciones (consulta 4 de consultas.sql)
// Se calcula desde los partidos: victoria = 3 pts, empate = 1 pt, derrota = 0
// Los ::int convierten los totales a número (PostgreSQL los devuelve como texto en Node)
router.get('/', async (req, res) => {
  const { rows } = await pool.query(`
WITH resultados AS (
SELECT equipo_local_id AS equipo_id, goles_local AS goles_favor, goles_visitante AS goles_contra
FROM partidos
UNION ALL
SELECT equipo_visitante_id AS equipo_id, goles_visitante AS goles_favor, goles_local AS goles_contra
FROM partidos
)
SELECT e.id AS equipo_id, e.nombre,
COUNT(r.equipo_id)::int AS jugados,
COALESCE(SUM(r.goles_favor), 0)::int AS goles_favor,
COALESCE(SUM(r.goles_contra), 0)::int AS goles_contra,
COALESCE(SUM(r.goles_favor - r.goles_contra), 0)::int AS diferencia_goles,
COALESCE(SUM(
CASE
WHEN r.goles_favor > r.goles_contra THEN 3
WHEN r.goles_favor = r.goles_contra THEN 1
ELSE 0
END
), 0)::int AS puntos
FROM equipos e
LEFT JOIN resultados r ON e.id = r.equipo_id
GROUP BY e.id, e.nombre
ORDER BY puntos DESC, diferencia_goles DESC, goles_favor DESC, e.nombre ASC
`);
  res.json(rows);
});

module.exports = router;
