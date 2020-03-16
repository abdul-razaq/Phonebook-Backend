const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},

	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},

	password: {
		type: String,
		required: true,
		select: false,
	},

	dateJoined: {
		type: String,
		required: true,
		default: new Date().toLocaleString(),
	},

	contacts: [
		{
			firstname: {
				type: String,
				required: true,
				trim: true,
			},
			lastname: {
				type: String,
				required: true,
				trim: true,
			},
			email: {
				type: String,
				required: true,
				trim: true,
			},
			nickname: {
				type: String,
				required: false,
				trim: true,
				lowercase: true,
			},
			socialAccounts: {
				type: Object,
				required: false,
			},
			phoneNumbers: {
				type: Array,
				required: true,
			},
			addresses: {
				type: Object,
				required: false,
			},
			relationship: {
				type: String,
				required: true,
				default: 'friend',
				trim: true,
				lowercase: true,
			},
			dateAdded: {
				type: String,
				default: new Date().toLocaleString(),
				immutable: true,
			},
			required: false,
		},
	],
});

UserSchema.pre('save', async function(next) {
	const user = this;
	if (user.isModified('password')) {
		try {
			const hashedPassword = await bcrypt.hash(user.password, 10);
			user.password = hashedPassword;
			next();
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
				error.message = 'Unable to hash password';
			}
			next(error);
		}
	}
});

UserSchema.method.confirmPassword(async function(guessedPassword) {
	const user = this;
	return await bcrypt.compare(guessedPassword, user.password);
});

UserSchema.method.generateJWTToken(async function(email, id) {
	return jwt.sign({ email, userId: id }, 'thisismysecret', {
		expiresIn: '10h',
	});
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
