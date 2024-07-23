module.exports = {
  // This action shows the admin page
  showAdminPage: async function(req, res) {
    try {
      // Fetch the users who are associated with any team
      const usersWithTeams = await Student_team.find().select(['id_user']);
      const usersWithoutTeamIds = usersWithTeams.map(userTeam => userTeam.id_user);
      
      // Fetch the users who are not associated with any team
      const usersWithoutTeam = await User.find({
        id: { 'nin': usersWithoutTeamIds } // 'nin' means 'not in'
      });

      // Fetch all teams
      const teams = await Team.find();

      // Render the admin page view with the list of users without a team and the list of teams
      return res.view('pages/admin', { usersWithoutTeam, teams, filteredTeams: [] });
    } catch (error) {
      // Log the error and respond with a 500 status code and an error message
      sails.log.error(error);
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  },

  // This action assigns a user to a team
  assignUserToTeam: async function(req, res) {
    try {
      const { userId, teamId } = req.body;

      // Create a new entry in the Student_team table to assign the user to the team
      await Student_team.create({ id_user: userId, id_team: teamId });
      
      // Fetch all members of the team, including their user details
      const teamMembers = await Student_team.find({ id_team: teamId }).populate('id_user');
      
      // Calculate the total happiness of the team members
      const totalHappiness = teamMembers.reduce((total, member) => total + member.id_user.happiness, 0);
      
      // Calculate the average happiness of the team
      const averageHappiness = totalHappiness / teamMembers.length;

      // Update the team's happiness in the Team table
      await Team.updateOne({ id: teamId }).set({ happiness: averageHappiness });

      // Redirect to the admin page
      return res.redirect('/admin');
    } catch (error) {
      // Log the error and respond with a 500 status code and an error message
      sails.log.error(error);
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  },

  // This action creates a new team
  createTeam: async function(req, res) {
    try {
      const { color, universe } = req.body;

      // Create a new team with the provided color and universe, initializing happiness to 0
      await Team.create({ color, universe, happiness: 0 });

      // Redirect to the admin page
      return res.redirect('/admin');
    } catch (error) {
      // Log the error and respond with a 500 status code and an error message
      sails.log.error(error);
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  },

  // This action filters teams based on color and universe
  viewTeams: async function(req, res) {
    try {
      const { filterColor, filterUniverse } = req.query;

      // Fetch teams based on filter criteria
      const filteredTeams = await Team.find({
        color: filterColor,
        universe: filterUniverse
      });

      // Fetch members for each filtered team
      for (const team of filteredTeams) {
        const teamMembers = await Student_team.find({ id_team: team.id }).populate('id_user');
        team.members = teamMembers.map(member => member.id_user);
      }

      // Fetch the users who are associated with any team
      const usersWithTeams = await Student_team.find().select(['id_user']);
      const usersWithoutTeamIds = usersWithTeams.map(userTeam => userTeam.id_user);
      
      // Fetch the users who are not associated with any team
      const usersWithoutTeam = await User.find({
        id: { 'nin': usersWithoutTeamIds } // 'nin' means 'not in'
      });

      // Fetch all teams
      const teams = await Team.find();

      // Render the admin page view with the filtered teams and other data
      return res.view('pages/admin', { usersWithoutTeam, teams, filteredTeams });
    } catch (error) {
      // Log the error and respond with a 500 status code and an error message
      sails.log.error(error);
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};
