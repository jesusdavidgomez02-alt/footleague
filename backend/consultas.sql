-- consultas
-- 1. EQUIPOS
SELECT
    id,
    nombre,
    ciudad,
    estadio
FROM equipos
ORDER BY nombre ASC;


-- 2. JUGADORES
SELECT
    j.id,
    j.nombre,
    j.equipo_id,
    e.nombre AS equipo,
    j.posicion,
    j.dorsal AS numero,
    j.goles
FROM jugadores j
INNER JOIN equipos e ON j.equipo_id = e.id
ORDER BY e.nombre, j.dorsal;


-- 3. PARTIDOS
SELECT
    p.id,
    p.fecha,
    p.equipo_local_id,
    el.nombre AS equipo_local,
    p.equipo_visitante_id,
    ev.nombre AS equipo_visitante,
    p.goles_local,
    p.goles_visitante,
    'Finalizado' AS estado
FROM partidos p
INNER JOIN equipos el ON p.equipo_local_id = el.id
INNER JOIN equipos ev ON p.equipo_visitante_id = ev.id
ORDER BY p.fecha, p.id;


-- 4. TABLA DE POSICIONES
WITH resultados AS (
    SELECT
        equipo_local_id AS equipo_id,
        goles_local AS goles_favor,
        goles_visitante AS goles_contra
    FROM partidos

    UNION ALL

    SELECT
        equipo_visitante_id AS equipo_id,
        goles_visitante AS goles_favor,
        goles_local AS goles_contra
    FROM partidos
)

SELECT
    e.id AS equipo_id,
    e.nombre,
    COUNT(r.equipo_id) AS jugados,
    COALESCE(SUM(r.goles_favor), 0) AS goles_favor,
    COALESCE(SUM(r.goles_contra), 0) AS goles_contra,
    COALESCE(SUM(r.goles_favor - r.goles_contra), 0) AS diferencia_goles,
    COALESCE(SUM(
        CASE
            WHEN r.goles_favor > r.goles_contra THEN 3
            WHEN r.goles_favor = r.goles_contra THEN 1
            ELSE 0
        END
    ), 0) AS puntos
FROM equipos e
LEFT JOIN resultados r ON e.id = r.equipo_id
GROUP BY e.id, e.nombre
ORDER BY puntos DESC, diferencia_goles DESC, goles_favor DESC, e.nombre ASC;


-- 5. GOLEADORES
SELECT
    j.id AS jugador_id,
    j.nombre,
    j.equipo_id,
    e.nombre AS equipo,
    j.goles
FROM jugadores j
INNER JOIN equipos e ON j.equipo_id = e.id
ORDER BY j.goles DESC, j.nombre ASC;

