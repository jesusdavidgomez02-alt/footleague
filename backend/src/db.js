// Conexión a PostgreSQL con un pool de conexiones
require('dotenv').config();
const { Pool, types } = require('pg');

// Devuelve las fechas (tipo DATE) como texto 'YYYY-MM-DD' en vez de un objeto con hora
types.setTypeParser(1082, (valor) => valor);

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // necesario en la mayoría de servidores en la nube
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

module.exports = pool;
