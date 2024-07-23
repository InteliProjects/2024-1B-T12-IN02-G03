module.exports = {
  // Function to display the overview page
  overview: async function(req, res) {
    sails.log.debug('Calling overview');
    
    // Check if the user is logged in
    if (!req.session.userId) {
      sails.log.debug('User not logged in, redirecting to /login');
      return res.redirect('/');
    }
    
    try {
      // Fetch the user based on session userId
      const user = await User.findOne({ id: req.session.userId });
      if (!user) {
        sails.log.debug('User not found, redirecting to /login');
        return res.redirect('/');
      }

      sails.log.debug(`User found: ${user.firstName}`);

      // Fetch team membership information and populate team details
      const teamMembership = await Student_team.findOne({ id_user: user.id }).populate('id_team');
      let averageHappiness = null;
      let teamMembers = [];

      if (teamMembership) {
        sails.log.debug('Team member found');
        // Fetch team members and populate user details
        teamMembers = await Student_team.find({ id_team: teamMembership.id_team.id }).populate('id_user');

        // Calculate average happiness if teamMembers is not empty
        if (teamMembers.length > 0) {
          const totalHappiness = teamMembers.reduce((total, member) => {
            const happiness = member.id_user ? member.id_user.happiness : null;
            return total + (happiness || 0);
          }, 0);
          averageHappiness = totalHappiness / teamMembers.length;
          sails.log.debug(`Average happiness calculated: ${averageHappiness}`);
        } else {
          sails.log.debug('No team members found to calculate average happiness');
        }
      } else {
        sails.log.debug('No team found');
      }

      // Fetch all tasks
      const tasks = await Task.find(); 
      sails.log.debug(`Number of tasks found: ${tasks.length}`);

      // Render the homepage view with the user, average happiness, tasks, and team members
      return res.view('pages/homepage', { user, averageHappiness, tasks, teamMembers });
    } catch (error) {
      sails.log.error('Error in overview action:', error);
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  },

  // Function to create a new task
  createTask: async function(req, res) {
    sails.log.debug('Calling createTask');
    try {
      const { name, description } = req.body;
      const task = await Task.create({ name, description, completed: false, id_user: req.session.userId }).fetch();
      sails.log.debug(`Task created: ${task.name}`);
      return res.json(task);
    } catch (error) {
      sails.log.error('Error in createTask action:', error);
      return res.status(500).json({ error: 'Failed to create task' });
    }
  },

  // Function to fetch all tasks
  fetchTasks: async function(req, res) {
    sails.log.debug('Calling fetchTasks');
    try {
      const tasks = await Task.find();
      sails.log.debug(`Number of tasks found: ${tasks.length}`);
      return res.json(tasks);
    } catch (error) {
      sails.log.error('Error in fetchTasks action:', error);
      return res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  },

  // Function to delete a task
  deleteTask: async function(req, res) {
    sails.log.debug('Calling deleteTask');
    try {
      const { id } = req.params;
      await Task.destroy({ id });
      sails.log.debug(`Task deleted: ${id}`);
      return res.ok();
    } catch (error) {
      sails.log.error('Error in deleteTask action:', error);
      return res.status(500).json({ error: 'Failed to delete task' });
    }
  },

  // Function to update a task
  updateTask: async function(req, res) {
    sails.log.debug('Calling updateTask');
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const task = await Task.updateOne({ id }).set({ name, description });
      if (!task) {
        sails.log.debug(`Task not found: ${id}`);
        return res.status(404).json({ error: 'Task not found' });
      }
      sails.log.debug(`Task updated: ${task.name}`);
      return res.json(task);
    } catch (error) {
      sails.log.error('Error in updateTask action:', error);
      return res.status(500).json({ error: 'Failed to update task' });
    }
  },

  // Function to fetch the team information
  team: async function(req, res){
    try{
      const userId  = req.session.userId;

      // Fetch the user and populate their team information
      const user = await User.findOne({id: userId}).populate("team");

      if(!user || !user.team){
        return res.status(400).send("User or team not found")
      }

      // Fetch the team and populate its members
      const team = await Team.findOne({id: user.team.id}).populate("members")
      return res.view("pages/homepage", {
        team: team
      })
    } catch (error){
      return res.serverError(error)
    }
  }
};
