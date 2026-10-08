const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userRepository = require('../repositories/userRepository');
const passwordResetRepository = require('../repositories/passwordResetRepository');
const emailService = require('./emailService');


function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function validatePassword(password) {
  if (typeof password !== "string") {
    throw new Error("Password is required");
  }

  if (password.length < 8) {
    throw new Error("Password must contain at least 8 characters");
  }

  if (!/[A-Z]/.test(password)) {
    throw new Error("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    throw new Error("Password must contain at least one lowercase letter");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    throw new Error("Password must contain at least one special character");
  }
}

async function register({ email, firstname, lastname, password }) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !firstname?.trim() || !lastname?.trim() || !password) {
    const error = new Error('email, firstname, lastname and password are required');
    error.statusCode = 400;
    throw error;
  }

  if (password.length < 8) {
    const error = new Error('Password must contain at least 8 characters');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await userRepository.findByEmail(normalizedEmail);
  if (existingUser) {
    const error = new Error('Email is already registered');
    error.statusCode = 409;
    throw error;
  }

  validatePassword(password);
  const passwordHash = await bcrypt.hash(password, 10);
  const userId = await userRepository.create({
    email: normalizedEmail,
    firstname: firstname.trim(),
    lastname: lastname.trim(),
    passwordHash,
  });

  try {
    await emailService.sendWelcomeEmail(
      normalizedEmail,
      firstname.trim()
    );
  } catch (error) {
    console.error('Failed to send welcome email:', error.message);
  }

  return userRepository.findPublicById(userId);
}

async function login(email, password) {
  const user = await userRepository.findByEmail(normalizeEmail(email));
  if (!user) return null;

  const validPassword = await bcrypt.compare(password || '', user.password_hash);
  if (!validPassword) return null;

  const { password_hash, ...publicUser } = user;
  return publicUser;
}

async function forgotPassword(email) {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');

  const tokenHash = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  await passwordResetRepository.createResetToken(
    user.user_id,
    tokenHash,
    expiresAt
  );

  const resetUrl =
    `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  console.log('Password reset URL:', resetUrl);

  await emailService.sendPasswordResetEmail(
    user.email,
    resetUrl
  );
}

async function resetPassword(token, newPassword) {
  validatePassword(newPassword);

  const tokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const resetRecord =
    await passwordResetRepository.findValidResetToken(tokenHash);

  if (!resetRecord) {
    const error = new Error(
      'Password reset link is invalid or has expired.'
    );
    error.status = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await userRepository.updatePassword(
    resetRecord.user_id,
    passwordHash
  );

  await passwordResetRepository.deleteResetToken(
    resetRecord.reset_id
  );
}

module.exports = { register, login, validatePassword, forgotPassword, resetPassword };
