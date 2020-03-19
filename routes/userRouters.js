const userRoutes = require('express').Router();

const userControllers = require('../controllers/userController');
const { body } = require('express-validator');
const authenticate = require('../middlewares/authenticate');

const notAllowedPasswords = [
	'password',
	'password123',
	'password234',
	'password456',
];

const validationMiddleware = [
	body('username', 'username is required')
		.notEmpty()
		.trim()
		.isLength({ min: 3 })
		.notEmpty()
		.customSanitizer(value => {
			return value.toLowerCase();
		}),

	body('email', 'email address is required')
		.notEmpty()
		.isLength({ min: 5 })
		.isEmail()
		.normalizeEmail(),

	body('password', 'password is required')
		.isLength({ min: 8 })
		.trim()
		.notEmpty()
		.custom(password => {
			return (
				notAllowedPasswords.indexOf(password) === -1 &&
				!password.startsWith('password') &&
				!password.endsWith('password')
			);
		})
		.withMessage("password value cannot contain the word 'password'"),

	body('confirm_password', 'please confirm your password')
		.custom((confirm_password, { req }) => {
			return confirm_password === req.body.password;
		})
		.withMessage('passwords do not match'),
];

userRoutes.post(
	'/register',
	validationMiddleware,
	userControllers.registerUser
);

userRoutes.post('/login', userControllers.loginUser);

const updatePasswordValidationMiddleware = [
	body('old_password', 'Old password is required')
		.isLength({ min: 8 })
		.trim()
		.notEmpty()
		.custom(old_password => {
			return (
				notAllowedPasswords.indexOf(old_password) === -1 &&
				!old_password.startsWith('password') &&
				!old_password.endsWith('password')
			);
		}),

	body('new_password', 'New password is required')
		.isLength({ min: 8 })
		.trim()
		.notEmpty()
		.custom(new_password => {
			return (
				notAllowedPasswords.indexOf(new_password) === -1 &&
				!new_password.startsWith('password') &&
				!new_password.endsWith('password')
			);
		}),

	body('confirm_new_password', 'please confirm your password')
		.custom((confirm_new_password, { req }) => {
			return confirm_new_password === req.body.new_password;
		})
		.withMessage('passwords do not match'),
];

userRoutes.post(
	'/password/update',
	authenticate,
	updatePasswordValidationMiddleware,
	userControllers.updatePassword
);

userRoutes.delete('/delete', authenticate, userControllers.deleteAccount);

userRoutes.post('/logout', authenticate, userControllers.logoutUser);

userRoutes.post('/logout/all', authenticate, userControllers.logoutAllSession);

userRoutes.post('/update', authenticate, userControllers.updateAccount);

module.exports = userRoutes;
