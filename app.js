const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const userRoutes = require('./routes/userRouters');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/contact-keeper';
const app = express();

app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes middlewares
app.use('/auth', userRoutes);

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
