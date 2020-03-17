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
		lowercase: true,
	},

	password: {
		type: String,
		required: true,
	},

	dateJoined: {
		type: Date,
		required: true,
		default: new Date().toString(),
	},

	tokens: [
		{
			token: {
				type: String,
				required: true,
			},
		},
	],

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
				default: new Date().toString(),
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

UserSchema.methods.confirmPassword = async function(guessedPassword) {
	const user = this;
	return await bcrypt.compare(guessedPassword, user.password);
};

UserSchema.methods.generateJWTToken = async function(email, id) {
	const user = this;
	const token = jwt.sign({ email, userId: id }, 'thisismysecret', {
		expiresIn: '10h',
	});
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
