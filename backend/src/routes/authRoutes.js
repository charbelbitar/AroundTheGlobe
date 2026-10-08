const router = require('express').Router();
const controller = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/logout', requireAuth, controller.logout);
router.get('/me', requireAuth, controller.me);
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password', controller.resetPassword);

module.exports = router;