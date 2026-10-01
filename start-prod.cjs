const fs = require('fs');
const mysql = require('mysql2/promise');

const config = {
  host: process.env.DB_HOST || 'mysql',
  port: Number(process.env.DB_PORT || 3306),
  user: 'root',
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.DB_NAME || 'nest_db',
  multipleStatements: true,
};

async function connectWithRetry() {
  for (;;) {
    try {
      const connection = await mysql.createConnection(config);
      await connection.query('SELECT 1');
      return connection;
    } catch (error) {
      console.log(`Esperando a MySQL en ${config.host}:${config.port}...`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

async function start() {
  if (!config.password) {
    throw new Error('MYSQL_ROOT_PASSWORD is required');
  }

  const connection = await connectWithRetry();
  try {
    const [rows] = await connection.query(
      `SELECT COUNT(*) AS count
       FROM information_schema.tables
       WHERE table_schema = ? AND table_name = 'Laboratorio'`,
      [config.database],
    );

    if (Number(rows[0].count) !== 1) {
      console.log('La tabla Laboratorio no existe; importando el dump inicial...');
      const dump = fs.readFileSync('/app/2026-09-30.nest_db.dump.sql', 'utf8');
      await connection.query(dump);
      console.log('Dump importado correctamente.');
    } else {
      console.log('Esquema existente detectado; no se importa el dump.');
    }
  } finally {
    await connection.end();
  }

  require('./dist/main');
}

start().catch((error) => {
  console.error('No se pudo preparar la base de datos:', error);
  process.exit(1);
});