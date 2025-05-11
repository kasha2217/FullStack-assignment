const express = require('express');
const { login } = require('../controllers/authController');

const authRouter = express.Router();

authRouter.post('/login', login);       // SIGNIN

module.exports = authRouter;
