const bcrypt = require('bcrypt'); // Import the bcrypt library for hashing passwords

module.exports = {
  login: async function (req, res) {
    try {
      const { email, password } = req.body; // Extract email and password from the request body

      if (!email || !password) {
        return res.serverError({ error: 'Email and password are required' }); // Check if both email and password are provided
      }

      const user = await User.findOne({ email }); // Find the user with the provided email

      if (!user) {
        return res.status(404).json({ error: 'User not found' }); // Return error if user is not found
      }

      const passwordMatch = await bcrypt.compare(password, user.password); // Compare the provided password with the stored hashed password

      if (!passwordMatch) {
        return res.status(404).json({ error: 'Invalid password' }); // Return error if password does not match
      }

      req.session.userId = user.id; // Set the user's ID in the session
      return res.redirect('/homepage'); // Redirect to the homepage if login is successful
    } catch (error) {
      console.error('Error during login:', error); // Log any errors during the login process
    }
  },

  verify: async function (req, res) {
    try {
      const { email, university } = req.body; // Extract email and university from the request body

      const user = await User.findOne({ email, university }); // Find the user with the provided email and university

      if (!user) {
        return res.status(404).json({ error: 'User not found' }); // Return error if user is not found
      }

      return res.json({ message: 'Verification successful' }); // Return success message if user is found
    } catch (error) {
      console.error('Error during verification:', error); // Log any errors during the verification process
      return res.status(500).json({ error: 'An unexpected error occurred' }); // Return a general error message for unexpected errors
    }
  },

  resetPassword: async function (req, res) {
    try {
      const { email, university, newPassword } = req.body; // Extract email, university, and newPassword from the request body

      const user = await User.findOne({ email, university }); // Find the user with the provided email and university

      if (!user) {
        return res.status(404).json({ error: 'User not found' }); // Return error if user is not found
      }

      const saltRounds = 10; // Define the number of salt rounds for hashing the new password
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds); // Hash the new password

      await User.updateOne({ id: user.id }).set({ password: hashedPassword }); // Update the user's password in the database

      return res.json({ message: 'Password reset successful' }); // Return success message if password reset is successful
    } catch (error) {
      console.error('Error during password reset:', error); // Log any errors during the password reset process
      return res.status(500).json({ error: 'An unexpected error occurred' }); // Return a general error message for unexpected errors
    }
  }
};
