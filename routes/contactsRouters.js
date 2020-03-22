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

contactsRoutes.get(
	'/contacts/:contactId',
	authenticate,
	contactsControllers.getAContact
);

contactsRoutes.get(
	'/contacts/',
	authenticate,
	contactsControllers.getAllContacts
);

contactsRoutes.post(
	'/contacts',
	authenticate,
	contactsValidationMiddleware,
	contactsControllers.createContact
);

contactsRoutes.delete(
	'/contacts/:contactId',
	authenticate,
	contactsControllers.deleteContact
);

contactsRoutes.delete(
	'/contacts/',
	authenticate,
	contactsControllers.deleteAllContacts
);

contactsRoutes.get(
	'/contacts/search',
	authenticate,
	contactsControllers.searchContact
);

module.exports = contactsRoutes;
