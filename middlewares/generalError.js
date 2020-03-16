module.exports = (error, req, res, next) => {
	const { statusCode: status, data, message } = error;
	res.status(status).json({ status: 'Error', message, data });
};
