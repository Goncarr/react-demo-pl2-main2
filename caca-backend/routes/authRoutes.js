const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Rota de Registo: POST /api/auth/register
router.post('/register', register);

// Rota de Login: POST /api/auth/login
router.post('/login', login);

module.exports = router;