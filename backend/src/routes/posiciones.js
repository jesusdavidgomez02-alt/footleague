const { Router } = require('express');
const pool = require('../db');
const router = Router();

// GET /api/posiciones -> tabla de posiciones calculada a partir de los partidos
// Victoria = 3 pts, empate = 1 pt, derrota = 0 pts
router.get('/', async (req, res) => {
  const { rows } = await pool.query(`
    WITH resultados AS (
      SELECT local_id AS equipo_id, goles_local AS gf, goles_visitante AS gc FROM partidos
      UNION ALL
      SELECT visitante_id, goles_visitante, goles_local FROM partidos
    )
    SELECT e.id, e.nombre,
           COUNT(r.equipo_id)::int                               AS pj,
           COUNT(*) FILTER (WHERE r.gf > r.gc)::int              AS pg,
           COUNT(*) FILTER (WHERE r.gf = r.gc)::int              AS pe,
           COUNT(*) FILTER (WHERE r.gf < r.gc)::int              AS pp,
           COALESCE(SUM(r.gf), 0)::int                           AS gf,
           COALESCE(SUM(r.gc), 0)::int                           AS gc,
           COALESCE(SUM(r.gf - r.gc), 0)::int                    AS dg,
           (COUNT(*) FILTER (WHERE r.gf > r.gc) * 3
            + COUNT(*) FILTER (WHERE r.gf = r.gc))::int          AS pts
      FROM equipos e
      LEFT JOIN resultados r ON r.equipo_id = e.id
     GROUP BY e.id, e.nombre
     ORDER BY pts DESC, dg DESC, gf DESC, e.nombre
  `);
  res.json(rows);
});

module.exports = router;
