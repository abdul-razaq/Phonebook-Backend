const User = require('../models/User');

const { validationResult } = require('express-validator');


exports.registerUser = async (req, res, next) => {
  // check to see if there is no validation error
  // if there is call the next error handling middleware in the stack
  // if no error, check to see if the email address and the username has not been taken
  // if it is taken throw an error, if not create a User model instance and pass in the user details, save the user to the database
  // generate a token and send a response including the userId and token
  const errors = validationResult(req);
  
}