# FootLeague — Backend

Node.js + Express + PostgreSQL. API de consulta (solo GET) sobre equipos, jugadores, partidos, tabla de posiciones y goleadores.

## Requisitos
- Node.js 18 o superior → https://nodejs.org (versión LTS)
- PostgreSQL 14 o superior (con pgAdmin)
- Git

## 1. Crear la base de datos
1. Abre **pgAdmin** → clic derecho en *Databases* → *Create* → *Database* → nombre: `liga_colombiana`.
2. Clic derecho en `liga_colombiana` → *Query Tool*.
3. Abre el archivo `database.sql` (ícono de carpeta) y ejecútalo con **F5**.
4. Comprueba: `SELECT * FROM equipos;` debe devolver 10 filas.

Archivos de la base de datos:
- `database.sql`: tablas, índices y datos (10 equipos, 80 jugadores, 45 partidos en 9 jornadas).
- `consultas.sql`: las 5 consultas que usa la API, para probarlas en pgAdmin.

## 2. Configurar y correr
```bash
cd backend
npm install
```
Copia `.env.example` como `.env` y pon tu clave de PostgreSQL en `DB_PASSWORD`.

```bash
npm run dev     # se reinicia solo cuando guardas cambios
# o
npm start
```
Debe aparecer: `API corriendo en http://localhost:3000`.
Abre en el navegador `http://localhost:3000/api/health` → `{"status":"ok","db":"conectada"}`.

## 3. Endpoints

| Método | Ruta | Qué devuelve |
|---|---|---|
| GET | `/api/equipos` | Todos los equipos |
| GET | `/api/equipos/:id` | Un equipo |
| GET | `/api/equipos/:id/jugadores` | Plantilla del equipo |
| GET | `/api/jugadores` | Todos los jugadores (filtro opcional `?posicion=portero`, `defensa`, `mediocampista` o `delantero`) |
| GET | `/api/jugadores/:id` | Un jugador |
| GET | `/api/partidos` | Partidos (filtros opcionales `?equipo=3` y `?jornada=2`) |
| GET | `/api/posiciones` | Tabla de posiciones (3 pts victoria, 1 empate) |
| GET | `/api/goleadores` | Jugadores ordenados por goles |
| GET | `/api/health` | Estado de la API y la BD |

Errores: `404` si no existe el recurso, `400` si el id no es un número, `500` si falla la BD.

### Formato JSON
```json
// /api/equipos
[{ "id": 4, "nombre": "América de Cali", "ciudad": "Cali", "estadio": "Estadio Olímpico Pascual Guerrero" }]

// /api/jugadores
[{ "id": 23, "nombre": "Cristian Barrios", "equipo_id": 3, "equipo": "Junior", "posicion": "delantero", "numero": 9, "goles": 4 }]

// /api/partidos
[{ "id": 9, "jornada": 2, "fecha": "2026-09-12", "equipo_local_id": 3, "equipo_local": "Junior", "equipo_visitante_id": 6, "equipo_visitante": "Deportes Tolima", "goles_local": 1, "goles_visitante": 2, "estado": "Finalizado" }]

// /api/posiciones
[{ "equipo_id": 4, "nombre": "América de Cali", "jugados": 9, "goles_favor": 13, "goles_contra": 4, "diferencia_goles": 9, "puntos": 19 }]

// /api/goleadores
[{ "jugador_id": 7, "nombre": "Kevin Parra", "equipo_id": 1, "equipo": "Atlético Nacional", "goles": 6 }]
```

## 4. Subir cambios a GitHub
Desde la carpeta raíz del proyecto (no desde `backend/`):
```bash
git add .
git commit -m "describe qué cambiaste"
git push
```
El `.gitignore` evita subir `node_modules/` y `.env` (la clave).

## 5. Despliegue
1. Crea una base PostgreSQL en el servicio (por ejemplo Neon) y ejecuta `database.sql` ahí.
2. Crea el servicio web desde el repo de GitHub (por ejemplo Render):
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
3. Variable de entorno: `DATABASE_URL` = la URL de conexión que te da el servicio de base de datos.
4. Prueba `https://TU-APP/api/health`.

El frontend usa rutas relativas (`/api`), así que funciona igual en local y desplegado sin cambiar nada.

## Estructura
```
backend/
├── src/
│   ├── index.js          servidor Express, rutas y manejo de errores
│   ├── db.js             conexión a PostgreSQL
│   └── routes/
│       ├── equipos.js
│       ├── jugadores.js
│       ├── partidos.js
│       ├── posiciones.js
│       └── goleadores.js
├── database.sql          tablas + datos (parte de base de datos)
├── consultas.sql         consultas SQL de los endpoints
├── .env.example
└── package.json
```
