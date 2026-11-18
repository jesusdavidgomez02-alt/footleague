# FootLeague — Backend

Node.js + Express + PostgreSQL. API de consulta (solo GET) sobre equipos, jugadores, partidos y tabla de posiciones.

## Requisitos
- Node.js 18 o superior → https://nodejs.org (versión LTS)
- PostgreSQL 14 o superior (con pgAdmin)
- Git

## 1. Crear la base de datos
1. Abre **pgAdmin** → clic derecho en *Databases* → *Create* → *Database* → nombre: `futbol_db`.
2. Clic derecho en `futbol_db` → *Query Tool*.
3. Abre el archivo `database.sql` (ícono de carpeta), y ejecútalo con **F5**.
4. Comprueba: `SELECT * FROM equipos;` debe devolver 10 filas.

> Si tu compañero de base de datos entrega su propio script, reemplaza `database.sql` por el suyo.
> Solo deben respetar los nombres de tablas y columnas.

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
| GET | `/api/jugadores?posicion=Delantero` | Jugadores (filtro opcional: Portero, Defensa, Medio, Delantero) |
| GET | `/api/jugadores/goleadores` | Top 10 goleadores |
| GET | `/api/jugadores/:id` | Un jugador |
| GET | `/api/partidos?equipo=1` | Partidos (filtro opcional por id de equipo) |
| GET | `/api/posiciones` | Tabla de posiciones (3 pts victoria, 1 empate) |
| GET | `/api/health` | Estado de la API y la BD |

Errores: `404` si no existe el recurso, `400` si el id no es un número, `500` si falla la BD.

### Formato JSON (para el frontend)
```json
// /api/equipos/1
{ "id": 1, "nombre": "Junior", "ciudad": "Barranquilla", "estadio": "Metropolitano Roberto Meléndez" }

// /api/jugadores/goleadores
[{ "id": 8, "nombre": "Jhon Valencia", "posicion": "Delantero", "goles": 11, "equipo": "Junior" }]

// /api/partidos
[{ "id": 1, "fecha": "2026-08-02", "local": "Junior", "goles_local": 2, "visitante": "Atlético Nacional", "goles_visitante": 1 }]

// /api/posiciones
[{ "id": 6, "nombre": "Independiente Medellín", "pj": 5, "pg": 3, "pe": 1, "pp": 1, "gf": 13, "gc": 9, "dg": 4, "pts": 10 }]
```

Ejemplo de consumo desde el frontend:
```js
const res = await fetch('/api/posiciones');  // ruta relativa: sirve en local y en el servidor
const tabla = await res.json();
```

## 4. Subir a GitHub
Desde la carpeta raíz del proyecto (no desde `backend/`), para que se suban backend y frontend juntos:
```bash
git init
git add .
git commit -m "FootLeague: backend con Express y PostgreSQL"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/footleague.git
git push -u origin main
```
El `.gitignore` ya evita subir `node_modules/` y `.env` (tu clave).
En GitHub: *Settings → Collaborators* → agrega a tus 2 compañeros.

## 5. Despliegue (formativa 2)
1. Crea una base PostgreSQL en el servicio (Render, Railway, Neon, etc.) y ejecuta `database.sql` ahí.
2. Crea el servicio web desde el repo de GitHub:
   - Build command: `npm install`
   - Start command: `npm start`
   - Root directory: `backend`
3. Variable de entorno: `DATABASE_URL` = la URL de conexión que te da el servicio.
4. Prueba `https://TU-APP/api/health`.
5. Pásale la URL al del frontend para que cambie `http://localhost:3000` por esa.

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
│       └── posiciones.js
├── database.sql          tablas + datos de prueba
├── .env.example
└── package.json
```
