# FootLeague

**Sistema web para la gestión y administración de ligas de fútbol.**

Parcial final: API REST de consulta sobre equipos, jugadores, partidos y tabla de posiciones.

- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL
- **Frontend:** HTML, CSS y JavaScript puro

## Cómo correr el proyecto

### Requisitos
- Node.js 18 o superior
- PostgreSQL (con pgAdmin)

### Pasos
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/jesusdavidgomez02-alt/footleague.git
   cd footleague
   ```
2. Crear la base de datos en pgAdmin con el nombre `liga_colombiana` y ejecutar el archivo `backend/database.sql` en el Query Tool.
3. Configurar la conexión: dentro de `backend/`, copiar `.env.example` como `.env` y escribir la clave de PostgreSQL en `DB_PASSWORD`.
4. Instalar y arrancar:
   ```bash
   cd backend
   npm install
   npm start
   ```
5. Abrir **http://localhost:3000** en el navegador.

El backend sirve el frontend y la API en la misma dirección. No hace falta abrir nada más.

## Endpoints

| Ruta | Qué devuelve |
|---|---|
| `/api/equipos` | Todos los equipos |
| `/api/equipos/:id` | Un equipo |
| `/api/equipos/:id/jugadores` | Plantilla del equipo |
| `/api/jugadores` | Todos los jugadores (filtro opcional `?posicion=delantero`) |
| `/api/jugadores/:id` | Un jugador |
| `/api/partidos` | Partidos (filtros opcionales `?equipo=3` y `?jornada=2`) |
| `/api/posiciones` | Tabla de posiciones |
| `/api/goleadores` | Jugadores ordenados por goles |
| `/api/health` | Estado de la API y la base de datos |

Más detalle en [`backend/README.md`](backend/README.md).

## Estructura
```
footleague/
├── backend/     servidor Express + conexión a PostgreSQL + database.sql + consultas.sql
└── frontend/    página web que consume la API
```

## Integrantes
- Jesús David Gómez — Backend
- (Nombre) — Base de datos
- (Nombre) — Frontend
