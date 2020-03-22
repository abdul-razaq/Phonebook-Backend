const jwt = require('jsonwebtoken');

const User = require('../models/User');
const AppError = require('../utils/AppError');

module.exports = async (req, res, next) => {
	const authHeader = req.get('authorization');
	if (!authHeader) {
		throw new AppError('Please Authenticate', 401);
	}
	const token = authHeader.split(' ')[1];
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		const { userId } = decodedToken;
		const user = await User.findOne({ _id: userId, 'tokens.token': token });
		if (!user) {
			throw new AppError('Please authenticate', 401);
		}
		req.userId = userId;
		req.user = user;
		req.token = token;
		next();
	} catch (error) {
		if (error) {
			next(error);
		}
	}
};
