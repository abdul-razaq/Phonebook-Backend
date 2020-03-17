module.exports = (error, req, res, next) => {
	const { statusCode: status = 500, data, message } = error;
	res.status(status).json({ status: 'Error', message, data });
};
