const router = require('express').Router();
const productController = require('../controllers/productController');
const optionalAuth = require('../middleware/optionalAuth');

router.get('/', productController.getAll);
router.get('/categories', productController.getCategories);
router.get('/:id', optionalAuth, productController.getById);

module.exports = router;
