const router = require('express').Router();
const controller = require('../controllers/bookingController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

router.get('/me', requireAuth, controller.getMine);
router.post('/', requireAuth, controller.create);
router.patch('/:bookingId/cancel', requireAuth, controller.cancel);
router.get('/flight/:flightId/passengers', requireAdmin, controller.getPassengers);

module.exports = router;
