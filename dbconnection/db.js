require('dotenv').config();
const { Sequelize } = require('sequelize');

// Configuración robusta con manejo de errores mejorado
const sequelize = new Sequelize(process.env.DATABASE_URL || {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    // Opciones para conexiones más estables
    keepAlive: true,
    statement_timeout: 10000,
    connectionTimeoutMillis: 10000
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  retry: {
    max: 5,
    match: [
      /Connection terminated unexpectedly/,
      /ETIMEDOUT/,
      /ECONNRESET/,
      /SequelizeConnectionError/
    ]
  },
  logging: msg => console.log(msg) // Solo para depuración
});

// Verificación mejorada de conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a PostgreSQL');
    
    // Consulta de prueba adicional
    const [result] = await sequelize.query('SELECT version() as postgres_version');
    console.log(`🔍 Versión de PostgreSQL: ${result[0].postgres_version}`);
  } catch (error) {
    console.error('❌ Error de conexión:');
    console.error(error.original?.message || error.message);
    
    console.error('\n🔍 Pasos para solucionar:');
    console.error('1. Verifica EN RENDER que:');
    console.error('   - La base de datos está ACTIVA (no pausada)');
    console.error('   - Las credenciales coinciden EXACTAMENTE');
    console.error('2. Prueba conectarte manualmente con:');
    console.error(`   psql "postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}"`);
    console.error('3. Si usas Windows, escapa el # con %23:');
    console.error(`   psql "postgresql://${process.env.DB_USER}:GYSID%23jC11bZxseh8lySuhdef9t8mGk6@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}"`);
  }
})();

module.exports = sequelize;