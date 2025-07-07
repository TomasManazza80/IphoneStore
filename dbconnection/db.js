require('dotenv').config(); // Carga las variables de entorno
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: { // ¡Esto es crítico para Render!
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false, // Desactiva logs (opcional)
    pool: { // Opcional pero recomendado para evitar timeouts
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Test de conexión (opcional pero útil)
sequelize.authenticate()
  .then(() => console.log('✅ Conexión a PostgreSQL establecida correctamente.'))
  .catch(err => console.error('❌ Error de conexión:', err.message));

module.exports = sequelize;