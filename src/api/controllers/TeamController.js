// api/controllers/TeamController.js
module.exports = {
  // Function to display the team page
  showTeam: async function (req, res) {
    // Check if the user is logged in by verifying the session userId
    if (!req.session.userId) {
      // If the user is not logged in, redirect to the login page
      return res.redirect('/login'); 
    }
    try {
      // Find the user based on the session userId
      const user = await User.findOne({ id: req.session.userId });
      
      // If the user is not found, redirect to the login page
      if (!user) {
        return res.redirect('/login'); 
      }

      // Render the team view with the user data
      return res.view('pages/team', { user });
    } catch (error) {
      // Log any errors and return a 500 status code with an error message
      sails.log.error(error);
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  },
}
