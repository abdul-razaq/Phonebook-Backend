const jwt = require('jsonwebtoken');

const AppError = require('../utils/AppError');

const verifyToken = authHeader => {
	if (!authHeader) {
		throw new AppError('Cannot Authenticate', 403);
	}
	const token = authHeader.split(' ')[1];
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, 'thisismysecret');
	} catch (error) {
		if (error) {
			next(error);
		}
	}
	const { userId } = decodedToken;
	return userId;
};

module.exports = (req, res, next) => {
	const authHeader = req.get('authorization');
	const userId = verifyToken(authHeader);
	req.userId = userId;
	if (!req.userId) {
		return next(new AppError('Not authenticated!', 403));
	}
	next();
};
