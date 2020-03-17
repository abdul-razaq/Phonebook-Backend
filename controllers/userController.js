const User = require('../models/User');

const { validationResult } = require('express-validator');

const AppError = require('../utils/AppError');

exports.registerUser = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new AppError(
				'Validation failed, check input',
				421,
				(data = errors.array())
			)
		);
	}
	const { username, email, password } = req.body;
	try {
		const userExists = await User.findOne({ email, username });
		if (userExists) {
			throw new AppError('User already exists', 421);
		}
		const user = new User({ username, email, password });
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

exports.loginUser = async (req, res, next) => {
	const { username, email, password } = req.body;
	let userExists;
	if (username && !email) {
		userExists = await User.findOne({ username });
	} else if (!username && email) {
		userExists = await User.findOne({ email });
	}
	if (!userExists) {
		return next(new AppError('username or email address not registered', 422));
	}
	const user = userExists;
	const passwordMatched = await user.confirmPassword(password);
	if (!passwordMatched) {
		return next(new AppError('Incorrect email or password', 403));
	}
	const token = user.generateJWTToken(email, userExists._id);
	res.status(200).json({
		status: 'Success',
		message: 'Authenticated successfully',
		token,
		userId: userExists._id,
	});
};

exports.updatePassword = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new AppError(
				'Validation failed, check input',
				422,
				(data = errors.array())
			)
		);
	}
	const { old_password, new_password } = req.body;
	try {
		const user = await User.findById(req.userId);
		const passwordMatched = await user.confirmPassword(old_password);
		if (!passwordMatched) {
			throw new AppError('Passwords do not match', 403);
		}
		user.password = new_password;
		await user.save();
		res
			.status(200)
			.json({ status: 'Success', message: 'Password updated successfully' });
	} catch (error) {
		if (error) next(error);
	}
};
