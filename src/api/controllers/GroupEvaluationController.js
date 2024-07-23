module.exports = {
  // Function to submit group evaluation
  submitGroupEvaluation: async function (req, res) {
    try {
      // Get the user ID from the session
      const userId = req.session.userId;
      // Extract evaluation details from the request body
      const toUser = req.body.toUser;
      const collaboration = req.body.collaboration;
      const decision = req.body.decision;

      // Log the received evaluation details for debugging
      console.log('toUser:', toUser);
      console.log('collaboration:', collaboration);
      console.log('decision:', decision);

      // Create a new group evaluation entry in the database
      const newGroupEvaluation = await GroupEvaluation.create({
        id_user: userId,
        to_user: toUser,
        collaboration: collaboration,
        decision: decision,
      }).fetch();

      // Redirect to the group evaluation page after successful creation
      res.redirect('/groupEvaluation');
    } catch (err) {
      // Log any error that occurs during the creation process
      console.error('Error storing the result', err);
      // Respond with a 500 status and error message if the result is not stored
      res.status(500).json({ error: 'Error storing the result' });
    }
  },

  // Function to find and list team members for evaluation
  findMembers: async function (req, res) {
    try {
      // Get the logged-in user ID from the session
      const loggedInUserId = req.session.userId;

      // If the user is not logged in, redirect to the login page
      if (!loggedInUserId) {
        return res.redirect('/login');
      }

      // Find the logged-in user and populate their team details
      const user = await User.findOne({ id: loggedInUserId }).populate('team');

      // If the user does not exist, log a warning and render the group evaluation page with an empty user list
      if (!user) {
        sails.log.warn('User not found:', loggedInUserId);
        return res.view('pages/groupEvaluation', { users: [] });
      }

      // Find the team membership of the user and populate the team details
      const teamMembership = await Student_team.findOne({ id_user: user.id }).populate('id_team');

      // If the user is not associated with a team, log a warning and render the group evaluation page with an empty user list
      if (!teamMembership) {
        sails.log.warn('User not associated with a team:', loggedInUserId);
        return res.view('pages/groupEvaluation', { users: [] });
      } else {
        // Find all team members and populate their user details
        const teamMembers = await Student_team.find({ id_team: teamMembership.id_team.id }).populate('id_user');
        // Filter out the logged-in user from the list of team members
        const users = teamMembers.map(member => member.id_user).filter(member => member.id !== loggedInUserId);
        // Render the group evaluation page with the list of team members
        return res.view('pages/groupEvaluation', { users });
      }
    } catch (err) {
      // Log any error that occurs during the fetching process
      sails.log.error('Error fetching team users:', err);
      // Respond with a server error if something goes wrong
      return res.serverError(err);
    }
  },
};
