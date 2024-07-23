module.exports = {

  // Friendly name for the helper function
  friendlyName: 'Format email',
  
  // Description of what the helper function does
  description: 'Format email to lower case and remove spaces.',

  // Inputs expected by the helper function
  inputs: {
    email: {
      type: 'string',
      example: 'myemail@site.com',
      description: 'The email of the user.',
      required: true // Indicates that the email is required
    }
  },

  // Possible exit statuses of the helper function
  exits: {
    success: {
      description: 'Email formatted successfully.' // Indicates successful formatting of the email
    },
  },

  // Actual implementation of the helper function
  fn: async function (inputs, exits) {
    // Format the email to lowercase and remove leading/trailing spaces
    const formattedEmail = inputs.email.toLowerCase().trim();
    return exits.success(formattedEmail); // Return the formatted email as a success response
  }

};
