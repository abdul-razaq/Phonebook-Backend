const { validationResult } = require('express-validator');

const AppError = require('../utils/AppError');

// Here a user can add a new contact, edit an existing contact, delete an existing contact, get all contacts, get all contacts by relationship, get a single contact, search a contact by name

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

exports.deleteContact = async (req, res, next) => {
	const { contactId } = req.params;
	try {
		const contacts = req.user.contacts.filter(contact => {
			contact._id.toString() !== contactId.toString();
		});
		req.user.contacts = contacts;
		await req.user.save();
		res
			.status(200)
			.json({ status: 'Success', message: 'Contact deleted successfully' });
	} catch (error) {
		if (error) return next(error);
	}
};

exports.getContact = (req, res, next) => {
	const { contactId } = req.params;
	const user = req.user;
	try {
		const contactDetails = user.contacts.filter(contact => {
			contact._id.toString() === contactId.toString();
		});
		console.log(contactDetails);
		if (!contactDetails) {
			throw new AppError('No contact found', 404);
		}
		res.status(200).json({
			status: 'Success',
			message: 'Found contact',
			data: contactDetails,
		});
	} catch (error) {
		if (error) return next(error);
	}
};

exports.getAllContacts = (req, res, next) => {
	const relationship = req.query.relationship;
	let fetchedContacts;
	if (relationship) {
		const contacts = req.user.contacts.filter(contact => {
			return contact.relationship === relationship.toString();
		});
		fetchedContacts = contacts;
	} else {
		fetchedContacts = req.user.contacts;
	}
	if (!fetchedContacts.length) {
		throw new AppError('This user has no contact', 404);
	}
	res
		.status(200)
		.json({
			status: 'Success',
			message: 'Contacts found',
			data: fetchedContacts,
		});
};
