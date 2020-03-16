const User = require('../models/User');

const { validationResult } = require('express-validator');

const AppError = require('../utils/AppError');

exports.registerUser = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new AppError('Validation failed, check input'),
			421,
			(data = errors.array())
		);
	}
	const { username, email, password, contacts } = req.body;
	try {
		const userExists = await User.findOne({ email, username });
		if (userExists) {
			throw new AppError('User already exists', 421);
		}
		let user;
		if (contacts) {
			user = new User({ username, email, password, contacts });
		} else {
			user = new User({ username, email, password });
		}
		await user.save();
		const token = user.generateJWTToken(email, user._id);
		res.status(201).json({
			status: 'Success',
			message: 'User created successfully!',
			userId: user._id,
			token,
		});
	} catch (error) {
		if (error) {
			next(error);
		}
	}
};
