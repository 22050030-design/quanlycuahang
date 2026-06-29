const router = require('express').Router();
const adminAuth = require('../middleware/adminAuth');
const adminController = require('../controllers/adminController');

router.get('/dashboard', adminAuth, adminController.getDashboard);

router.get('/users', adminAuth, adminController.getUsers);
router.get('/users/:id', adminAuth, adminController.getUserById);
router.put('/users/:id/toggle-status', adminAuth, adminController.toggleUserStatus);

router.get('/categories', adminAuth, adminController.getCategories);
router.post('/categories', adminAuth, adminController.createCategory);
router.put('/categories/:id', adminAuth, adminController.updateCategory);
router.delete('/categories/:id', adminAuth, adminController.deleteCategory);

router.get('/products', adminAuth, adminController.getProducts);
router.post('/products', adminAuth, adminController.createProduct);
router.put('/products/:id', adminAuth, adminController.updateProduct);
router.delete('/products/:id', adminAuth, adminController.deleteProduct);

router.get('/orders', adminAuth, adminController.getOrders);
router.get('/orders/:id', adminAuth, adminController.getOrderById);
router.put('/orders/:id/status', adminAuth, adminController.updateOrderStatus);

router.get('/low-stock-products', adminAuth, adminController.getLowStockProducts);

router.get('/reviews', adminAuth, adminController.getReviews);
router.delete('/reviews/:id', adminAuth, adminController.deleteReview);

module.exports = router;
