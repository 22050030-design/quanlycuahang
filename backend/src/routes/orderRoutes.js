const router = require('express').Router();
const auth = require('../middleware/auth');
const orderController = require('../controllers/orderController');

router.post('/', auth, orderController.create);
router.get('/my-orders', auth, orderController.getMyOrders);
router.put('/:id/cancel', auth, orderController.cancel);
router.get('/:id', auth, orderController.getById);

module.exports = router;
