const pool = require('../config/database');

async function findByEmail(email) {
  const [rows] = await pool.execute(
    `SELECT user_id, email, firstname, lastname, password_hash, role, created_at, updated_at
     FROM users
     WHERE email = ?`,
    [email]
  );
  return rows[0] || null;
}

async function create({ email, firstname, lastname, passwordHash, role = 'user' }) {
  const [result] = await pool.execute(
    `INSERT INTO users (email, firstname, lastname, password_hash, role)
     VALUES (?, ?, ?, ?, ?)`,
    [email, firstname, lastname, passwordHash, role]
  );
  return result.insertId;
}

async function findPublicById(userId) {
  const [rows] = await pool.execute(
    `SELECT user_id, email, firstname, lastname, role, created_at, updated_at
     FROM users
     WHERE user_id = ?`,
    [userId]
  );
  return rows[0] || null;
}

async function updatePassword(userId, passwordHash) {
  await pool.execute(
    `
    UPDATE users
    SET password_hash = ?
    WHERE user_id = ?
    `,
    [passwordHash, userId]
  );
}

module.exports = { findByEmail, create, findPublicById, updatePassword };
