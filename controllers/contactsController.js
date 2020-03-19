const { validationResult } = require('express-validator');

const User = require('../models/User');
const AppError = require('../utils/AppError');

// Here a user can add a new contact, edit an existing contact, delete an existing contact, get all contacts, get all contacts by categories, get a single contact, search a contact by name

exports.createContact = async (req, res, next) => {
	const user = req.user;
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(
			new AppError(
				'Validation error, check user input',
				401,
				(data = errors.array())
			)
		);
	}
	try {
		user.contacts.forEach(contact => {
			if (
				contact.firstname === req.body.firstname &&
				contact.lastname === req.body.lastname &&
				contact.email === req.body.email
			) {
				throw new AppError('contact already exist', 422);
			}
		});
		user.contacts.push({ ...req.body });
		await user.save();
		res
			.status(201)
			.json({ status: 'Success', message: 'Contact added successfully!' });
	} catch (error) {
		if (error) return next(error);
	}
};
