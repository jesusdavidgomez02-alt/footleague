const { Router } = require('express');
const pool = require('../db');
const router = Router();

// GET /api/partidos -> partidos (consulta 3 de consultas.sql)
// Filtros opcionales: /api/partidos?equipo=3  y  /api/partidos?jornada=2
router.get('/', async (req, res) => {
  const { equipo, jornada } = req.query;
  const params = [];
  const condiciones = [];
  if (equipo) {
    params.push(equipo);
    condiciones.push(`(p.equipo_local_id = $${params.length} OR p.equipo_visitante_id = $${params.length})`);
  }
  if (jornada) {
    params.push(jornada);
    condiciones.push(`p.jornada = $${params.length}`);
  }
  const filtro = condiciones.length ? 'WHERE ' + condiciones.join(' AND ') : '';
  const { rows } = await pool.query(`
SELECT p.id, p.jornada, p.fecha,
p.equipo_local_id, el.nombre AS equipo_local,
p.equipo_visitante_id, ev.nombre AS equipo_visitante,
p.goles_local, p.goles_visitante,
'Finalizado' AS estado
FROM partidos p
INNER JOIN equipos el ON p.equipo_local_id = el.id
INNER JOIN equipos ev ON p.equipo_visitante_id = ev.id
${filtro}
ORDER BY p.fecha, p.id
`, params);
  res.json(rows);
});

module.exports = router;
