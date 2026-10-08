require('dotenv').config();

const app = require('./app');
const pool = require('./config/database');

const port = Number(process.env.PORT || 1337);

async function start() {
  if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET is required');
  }

  await pool.query('SELECT 1');
  console.log('Database connected');

  app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
