const bcrypt = require('bcrypt');

module.exports = {
  // Friendly name for the helper function
  friendlyName: 'Hash password',

  // Description of what the helper function does
  description: 'Hash a password using bcrypt.',

  // Inputs expected by the helper function
  inputs: {
    password: {
      type: 'string',
      example: 'password123',
      description: 'The password to hash.',
      required: true // Indicates that the password is required
    }
  },

  // Possible exit statuses of the helper function
  exits: {
    success: {
      outputFriendlyName: 'Hashed password',
      outputDescription: 'The hashed version of the provided password.' // Description of the output
    },
    error: {
      description: 'An error occurred while hashing the password.' // Description of the error exit
    }
  },

  // Actual implementation of the helper function
  fn: async function (inputs, exits) {
    // Number of salt rounds to use (you can adjust this value as needed)
    const saltRounds = 10;

    try {
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(inputs.password, saltRounds);
      
      // Log the hashed password for debugging purposes
      console.log(hashedPassword);

      // Return the hashed password
      return exits.success(hashedPassword);
    } catch (err) {
      // If there's an error, handle it accordingly and exit with the error status
      return exits.error(err);
    }
  }
};
