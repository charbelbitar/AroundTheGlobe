const router = require('express').Router();
const controller = require('../controllers/flightController');
const { requireAdmin } = require('../middleware/authMiddleware');

router.get('/', controller.getAll);
router.get('/:flightId', controller.getById);
router.post('/', requireAdmin, controller.create);
router.put('/:flightId', requireAdmin, controller.update);
router.delete('/:flightId', requireAdmin, controller.remove);

module.exports = router;
