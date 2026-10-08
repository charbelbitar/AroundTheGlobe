const authService = require('../services/authService');

async function register(req, res, next) {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    req.session.user = {
      user_id: user.user_id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
    };

    res.json({ user: req.session.user });
  } catch (error) {
    next(error);
  }
}

function logout(req, res, next) {
  req.session.destroy((error) => {
    if (error) return next(error);
    res.clearCookie('connect.sid');
    res.status(204).send();
  });
}

function me(req, res) {
  res.json({ user: req.session.user });
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    await authService.forgotPassword(email);

    res.status(200).json({
      message:
        'If an account exists for this email, a password reset link has been sent.',
    });
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;

    await authService.resetPassword(token, password);

    res.status(200).json({
      message: 'Password successfully reset.',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, logout, me, forgotPassword, resetPassword };
