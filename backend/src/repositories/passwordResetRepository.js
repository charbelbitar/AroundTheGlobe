const pool = require('../config/database');

async function deleteByUserId(userId) {
  await pool.execute(
    `
    DELETE FROM password_reset_tokens
    WHERE user_id = ?
    `,
    [userId]
  );
}

async function createResetToken(userId, tokenHash, expiresAt) {
  await pool.execute(
    `
    INSERT INTO password_reset_tokens
      (user_id, token_hash, expires_at)
    VALUES (?, ?, ?)
    `,
    [userId, tokenHash, expiresAt]
  );
}

async function findValidResetToken(tokenHash) {
  const [rows] = await pool.execute(
    `
    SELECT *
    FROM password_reset_tokens
    WHERE token_hash = ?
      AND expires_at > NOW()
    LIMIT 1
    `,
    [tokenHash]
  );

  return rows[0];
}

async function deleteResetToken(resetId) {
  await pool.execute(
    `
    DELETE FROM password_reset_tokens
    WHERE reset_id = ?
    `,
    [resetId]
  );
}

module.exports = {
  deleteByUserId,
  createResetToken,
  findValidResetToken,
  deleteResetToken,
};