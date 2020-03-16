const userRoutes = require('express').Router();

const userControllers = require('../controllers/userController');
const { body } = require('express-validator');

userRoutes.post('/register', userControllers.registerUser);

module.exports = userRoutes;
