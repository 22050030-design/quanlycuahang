const router = require('express').Router();
const auth = require('../middleware/auth');
const cartController = require('../controllers/cartController');

router.post('/add', auth, cartController.add);
router.get('/', auth, cartController.get);
router.put('/update', auth, cartController.update);
router.delete('/remove/:id', auth, cartController.remove);

module.exports = router;
