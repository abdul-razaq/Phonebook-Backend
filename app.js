require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const userRoutes = require('./routes/userRouters');
const contactsRoutes = require('./routes/contactsRouters');
const error404 = require('./middlewares/error404');
const generalError = require('./middlewares/generalError');

const MONGODB_URI = process.env.MONGODB_URI;
const app = express();

app.set('port', process.env.PORT || 3000);

// Third party middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Custom Routes middlewares
app.use('/auth', userRoutes);
app.use(contactsRoutes);
app.use(error404);
app.use(generalError);

mongoose
	.connect(MONGODB_URI, {
		useCreateIndex: true,
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})
	.then(() => {
		console.log('Connected to the database successfully');
		app.listen(app.get('port'), () => {
			console.log(
				'Application started successfully on port ' + app.get('port')
			);
		});
	})
	.catch(err => {
		console.log('Error connecting to the database');
	});
