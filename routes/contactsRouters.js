const contactsRoutes = require('express').Router();
const { body } = require('express-validator');

const contactsControllers = require('../controllers/contactsController');
const authenticate = require('../middlewares/authenticate');

const contactsValidationMiddleware = [
	body('firstname')
		.notEmpty()
		.trim(),
	body('lastname')
		.notEmpty()
		.trim(),
	body('email')
		.notEmpty()
		.trim()
		.isEmail()
		.normalizeEmail()
		.customSanitizer(email => {
			return email.toLowerCase();
		}),
	body('nickname')
		.notEmpty()
		.trim()
		.isLength({ min: 3 }),
	body('relationship')
		.notEmpty()
		.trim()
		.isLength({ min: 5 }),
];

contactsRoutes.post(
	'/contacts',
	authenticate,
	contactsValidationMiddleware,
	contactsControllers.createContact
);

module.exports = contactsRoutes;
