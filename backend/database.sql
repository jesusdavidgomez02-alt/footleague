  
-- Proyecto final desarrollo web - Base de datos

-- 10 equipos
-- 8 jugadores por equipo
-- 45 partidos, todos contra todos, 9 jornadas de 5 partidos

DROP TABLE IF EXISTS partidos;
DROP TABLE IF EXISTS jugadores;
DROP TABLE IF EXISTS equipos;

-- ----------------------------------------------
-- 1. TABLAS
-- ----------------------------------------------

CREATE TABLE equipos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL UNIQUE,
    ciudad VARCHAR(50) NOT NULL,
    estadio VARCHAR(60) NOT NULL
);

CREATE TABLE jugadores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    equipo_id INT NOT NULL REFERENCES equipos(id),
    posicion VARCHAR(20) NOT NULL
        CHECK (posicion IN ('portero', 'defensa', 'mediocampista', 'delantero')),
    dorsal INT NOT NULL CHECK (dorsal BETWEEN 1 AND 99),
    goles INT NOT NULL DEFAULT 0 CHECK (goles >= 0),
    UNIQUE (equipo_id, dorsal)
);

CREATE TABLE partidos (
    id SERIAL PRIMARY KEY,
    jornada INT NOT NULL CHECK (jornada > 0),
    fecha DATE NOT NULL,
    equipo_local_id INT NOT NULL REFERENCES equipos(id),
    equipo_visitante_id INT NOT NULL REFERENCES equipos(id),
    goles_local INT NOT NULL DEFAULT 0 CHECK (goles_local >= 0),
    goles_visitante INT NOT NULL DEFAULT 0 CHECK (goles_visitante >= 0),
    CHECK (equipo_local_id <> equipo_visitante_id),
    UNIQUE (equipo_local_id, equipo_visitante_id)
);

-- ----------------------------------------------
-- 2. ÍNDICES
-- ----------------------------------------------

CREATE INDEX idx_jugadores_equipo ON jugadores (equipo_id);
CREATE INDEX idx_jugadores_goles ON jugadores (goles DESC);
CREATE INDEX idx_partidos_local ON partidos (equipo_local_id);
CREATE INDEX idx_partidos_visitante ON partidos (equipo_visitante_id);
CREATE INDEX idx_partidos_jornada ON partidos (jornada);

-- ----------------------------------------------
-- 3. DATOS DE PRUEBA
-- ----------------------------------------------

-- 10 EQUIPOS

INSERT INTO equipos (id, nombre, ciudad, estadio) VALUES
(1, 'Atlético Nacional', 'Medellín', 'Estadio Atanasio Girardot'),
(2, 'Millonarios', 'Bogotá', 'Estadio El Campín'),
(3, 'Junior', 'Barranquilla', 'Estadio Metropolitano Roberto Meléndez'),
(4, 'América de Cali', 'Cali', 'Estadio Olímpico Pascual Guerrero'),
(5, 'Independiente Santa Fe', 'Bogotá', 'Estadio El Campín'),
(6, 'Deportes Tolima', 'Ibagué', 'Estadio Manuel Murillo Toro'),
(7, 'Independiente Medellín', 'Medellín', 'Estadio Atanasio Girardot'),
(8, 'Deportivo Cali', 'Cali', 'Estadio Deportivo Cali'),
(9, 'Once Caldas', 'Manizales', 'Estadio Palogrande'),
(10, 'Atlético Bucaramanga', 'Bucaramanga', 'Estadio Américo Montanini');

-- 80 JUGADORES (8 POR EQUIPO)
-- 1 portero, 3 defensas, 2 mediocampistas, 2 delanteros

INSERT INTO jugadores (id, nombre, equipo_id, posicion, dorsal, goles) VALUES

-- Atlético Nacional
(1, 'Franco Armani', 1, 'portero', 1, 0),
(2, 'Milton Casco', 1, 'defensa', 2, 1),
(3, 'William Tesillo', 1, 'defensa', 3, 1),
(4, 'Andrés Reyes', 1, 'defensa', 4, 1),
(5, 'Juan Manuel Zapata', 1, 'mediocampista', 8, 1),
(6, 'Matheus Uribe', 1, 'mediocampista', 10, 2),
(7, 'Kevin Parra', 1, 'delantero', 9, 6),
(8, 'Nicolás Rodríguez', 1, 'delantero', 11, 2),

-- Millonarios
(9, 'Javier Burrai', 2, 'portero', 1, 0),
(10, 'Samuel Martín', 2, 'defensa', 2, 0),
(11, 'Stiven Barreiro', 2, 'defensa', 3, 0),
(12, 'Sergio Mosquera', 2, 'defensa', 4, 1),
(13, 'Rodrigo Ureña', 2, 'mediocampista', 8, 2),
(14, 'Leonai Souza', 2, 'mediocampista', 10, 1),
(15, 'Andrey Estupiñán', 2, 'delantero', 9, 3),
(16, 'Juan Guillermo Cuadrado', 2, 'delantero', 11, 2),

-- Junior
(17, 'Mauro Silveira', 3, 'portero', 1, 0),
(18, 'Jeison Suárez', 3, 'defensa', 2, 0),
(19, 'Jermein Peña', 3, 'defensa', 3, 0),
(20, 'Carlos Pérez', 3, 'defensa', 4, 2),
(21, 'Yimmi Chará', 3, 'mediocampista', 8, 0),
(22, 'Guillermo Celis', 3, 'mediocampista', 10, 2),
(23, 'Cristian Barrios', 3, 'delantero', 9, 4),
(24, 'Luis Muriel', 3, 'delantero', 11, 0),

-- América de Cali
(25, 'Juan Pablo Montoya', 4, 'portero', 1, 0),
(26, 'Yani Quintero', 4, 'defensa', 2, 1),
(27, 'Dany Rosero', 4, 'defensa', 3, 1),
(28, 'Cristian Tovar', 4, 'defensa', 4, 1),
(29, 'Rafael Carrascal', 4, 'mediocampista', 8, 2),
(30, 'Josen Escobar', 4, 'mediocampista', 10, 2),
(31, 'Luis Quiñones', 4, 'delantero', 9, 2),
(32, 'Tomás Ángel', 4, 'delantero', 11, 4),

-- Independiente Santa Fe
(33, 'Andrés Mosquera', 5, 'portero', 1, 0),
(34, 'Helibelton Palacios', 5, 'defensa', 2, 1),
(35, 'Emanuel Olivera', 5, 'defensa', 3, 0),
(36, 'Víctor Moreno', 5, 'defensa', 4, 0),
(37, 'Johan Torres', 5, 'mediocampista', 8, 2),
(38, 'Daniel Torres', 5, 'mediocampista', 10, 0),
(39, 'Hugo Rodallega', 5, 'delantero', 9, 2),
(40, 'Emerson Rodríguez', 5, 'delantero', 11, 1),

-- Deportes Tolima
(41, 'Neto Volpi', 6, 'portero', 1, 0),
(42, 'Anderson Angulo', 6, 'defensa', 2, 1),
(43, 'Jan Angulo', 6, 'defensa', 3, 0),
(44, 'Junior Hernández', 6, 'defensa', 4, 3),
(45, 'Sebastián Guzmán', 6, 'mediocampista', 8, 1),
(46, 'Homer Martínez', 6, 'mediocampista', 10, 1),
(47, 'Ever Valencia', 6, 'delantero', 9, 5),
(48, 'Jorge Cabezas', 6, 'delantero', 11, 1),

-- Independiente Medellín
(49, 'Éder Chaux', 7, 'portero', 1, 0),
(50, 'Frank Fabra', 7, 'defensa', 2, 0),
(51, 'Alfonso Simarra', 7, 'defensa', 3, 1),
(52, 'Luis Escorcia', 7, 'defensa', 4, 0),
(53, 'Didier Moreno', 7, 'mediocampista', 8, 1),
(54, 'Halam Loboa', 7, 'mediocampista', 10, 1),
(55, 'Jeison Medina', 7, 'delantero', 9, 3),
(56, 'John Montaño', 7, 'delantero', 11, 2),

-- Deportivo Cali
(57, 'Pedro Gallese', 8, 'portero', 1, 0),
(58, 'Alexandro Chaverra', 8, 'defensa', 2, 0),
(59, 'José Caldera', 8, 'defensa', 3, 1),
(60, 'Fernando Álvarez', 8, 'defensa', 4, 0),
(61, 'Gustavo Cuéllar', 8, 'mediocampista', 8, 2),
(62, 'Daniel Giraldo', 8, 'mediocampista', 10, 1),
(63, 'Emanuel Reynoso', 8, 'delantero', 9, 4),
(64, 'Juan Ignacio Dinenno', 8, 'delantero', 11, 2),

-- Once Caldas
(65, 'Joan Felipe Parra', 9, 'portero', 1, 0),
(66, 'Juan David Cuesta', 9, 'defensa', 2, 1),
(67, 'Jorge Cardona', 9, 'defensa', 3, 0),
(68, 'Daniel Londoño', 9, 'defensa', 4, 1),
(69, 'Juan Pablo Nieto', 9, 'mediocampista', 8, 0),
(70, 'Andrés Colorado', 9, 'mediocampista', 10, 1),
(71, 'Michael Barrios', 9, 'delantero', 9, 4),
(72, 'Jefry Zapata', 9, 'delantero', 11, 3),

-- Atlético Bucaramanga
(73, 'Cristopher Fiermarín', 10, 'portero', 1, 0),
(74, 'José Ortiz', 10, 'defensa', 2, 0),
(75, 'Carlos Romaña', 10, 'defensa', 3, 0),
(76, 'José Daniel García', 10, 'defensa', 4, 0),
(77, 'Félix Charrupí', 10, 'mediocampista', 8, 0),
(78, 'Leonardo Flores', 10, 'mediocampista', 10, 1),
(79, 'Fabián Sambueza', 10, 'delantero', 9, 1),
(80, 'Emerson Batalla', 10, 'delantero', 11, 1);

-- ----------------------------------------------
-- 4. PARTIDOS
-- 45 PARTIDOS - 9 JORNADAS
-- ----------------------------------------------

INSERT INTO partidos (id, jornada, fecha, equipo_local_id, equipo_visitante_id, goles_local, goles_visitante) VALUES

-- Jornada 1
(1, 1, '2026-09-05', 1, 10, 0, 0),
(2, 1, '2026-09-05', 9, 2, 1, 0),
(3, 1, '2026-09-05', 3, 8, 0, 1),
(4, 1, '2026-09-05', 7, 4, 2, 2),
(5, 1, '2026-09-05', 5, 6, 0, 1),

-- Jornada 2
(6, 2, '2026-09-12', 9, 1, 1, 3),
(7, 2, '2026-09-12', 10, 8, 0, 4),
(8, 2, '2026-09-12', 7, 2, 0, 1),
(9, 2, '2026-09-12', 3, 6, 1, 2),
(10, 2, '2026-09-12', 5, 4, 0, 1),

-- Jornada 3
(11, 3, '2026-09-19', 1, 8, 1, 1),
(12, 3, '2026-09-19', 7, 9, 0, 0),
(13, 3, '2026-09-19', 10, 6, 1, 2),
(14, 3, '2026-09-19', 5, 2, 1, 1),
(15, 3, '2026-09-19', 3, 4, 0, 0),

-- Jornada 4
(16, 4, '2026-09-26', 7, 1, 0, 0),
(17, 4, '2026-09-26', 8, 6, 2, 1),
(18, 4, '2026-09-26', 5, 9, 1, 2),
(19, 4, '2026-09-26', 10, 4, 0, 3),
(20, 4, '2026-09-26', 3, 2, 1, 2),

-- Jornada 5
(21, 5, '2026-10-03', 1, 6, 2, 0),
(22, 5, '2026-10-03', 5, 7, 0, 1),
(23, 5, '2026-10-03', 8, 4, 1, 2),
(24, 5, '2026-10-03', 3, 9, 2, 1),
(25, 5, '2026-10-03', 10, 2, 2, 1),

-- Jornada 6
(26, 6, '2026-10-10', 5, 1, 2, 4),
(27, 6, '2026-10-10', 6, 4, 0, 0),
(28, 6, '2026-10-10', 3, 7, 1, 1),
(29, 6, '2026-10-10', 8, 2, 0, 0),
(30, 6, '2026-10-10', 10, 9, 0, 2),

-- Jornada 7
(31, 7, '2026-10-17', 1, 4, 1, 3),
(32, 7, '2026-10-17', 3, 5, 1, 0),
(33, 7, '2026-10-17', 6, 2, 3, 1),
(34, 7, '2026-10-17', 10, 7, 0, 3),
(35, 7, '2026-10-17', 8, 9, 0, 2),

-- Jornada 8
(36, 8, '2026-10-24', 3, 1, 1, 2),
(37, 8, '2026-10-24', 4, 2, 0, 0),
(38, 8, '2026-10-24', 10, 5, 0, 1),
(39, 8, '2026-10-24', 6, 9, 1, 1),
(40, 8, '2026-10-24', 8, 7, 1, 0),

-- Jornada 9
(41, 9, '2026-10-31', 1, 2, 1, 3),
(42, 9, '2026-10-31', 10, 3, 0, 1),
(43, 9, '2026-10-31', 4, 9, 2, 0),
(44, 9, '2026-10-31', 8, 5, 0, 1),
(45, 9, '2026-10-31', 6, 7, 2, 1);

-- ----------------------------------------------
-- 5. REINICIAR SECUENCIAS
-- Los INSERT usaron IDs explícitos
-- ----------------------------------------------

SELECT setval('equipos_id_seq', (SELECT MAX(id) FROM equipos));
SELECT setval('jugadores_id_seq', (SELECT MAX(id) FROM jugadores));
SELECT setval('partidos_id_seq', (SELECT MAX(id) FROM partidos));
