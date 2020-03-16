const userRoutes = require('express').Router();

const userControllers = require('../controllers/userController');
const { body } = require('express-validator');

const validationMiddleware = [
	body('username', 'username is required')
		.isLength({ min: 3 })
		.notEmpty()
		.trim()
		.toString()
		.toLowerCase(),

	body('email', 'email address is required')
		.isLength({ min: 5 })
		.isEmail()
		.normalizeEmail()
		.notEmpty(),

	body('password', 'password is required')
		.isLength({ min: 8 })
		.trim()
		.notEmpty()
		.toString(),

	body('confirm_password', 'please confirm your password')
		.custom((value, { req }) => {
			return value === req.body.password;
		})
		.withMessage('passwords do not match'),
];

userRoutes.post(
	'/register',
	validationMiddleware,
	userControllers.registerUser
);

module.exports = userRoutes;
