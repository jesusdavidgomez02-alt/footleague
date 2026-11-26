# FootLeague

**Sistema web para la gestión y administración de ligas de fútbol.**

Parcial final: API REST de consulta sobre equipos, jugadores, partidos y tabla de posiciones.

## Demo en línea
- **Página:** https://footleague.onrender.com
- **API:** https://footleague.onrender.com/api
- **Estado:** https://footleague.onrender.com/api/health

> Está en el plan gratis de Render: si no ha tenido visitas, la primera carga tarda unos 50 segundos.

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
| Integrante | Parte |
|---|---|
| Jesús David Gómez | Backend (Node.js + Express) y despliegue (Render + Neon) |
| Nicole Blanco | Base de datos (PostgreSQL): `backend/database.sql` y `backend/consultas.sql` |
| Angel Ariza | Frontend (HTML, CSS y JavaScript): carpeta `frontend/` |
