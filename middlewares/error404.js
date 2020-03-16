module.exports = (req, res, next) => {
	res.status(404).json({ status: 'Error', message: 'Path not found' });
};
