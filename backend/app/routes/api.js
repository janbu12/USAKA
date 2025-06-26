const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const usersController = require('../controllers/userController');

// User routes (dilindungi autentikasi)
router.get('/users', authController.verifyToken, usersController.getAllUsers);
router.get('/users/:id', authController.verifyToken, usersController.getUserById);

// Contoh rute untuk produk
router.post('/products', authController.verifyToken, usersController.createProduct); // Anda mungkin ingin membuat productsController terpisah

module.exports = router;