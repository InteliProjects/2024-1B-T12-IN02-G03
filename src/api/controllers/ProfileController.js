module.exports = {
  // Function to display the user profile
  showProfile: async function (req, res) {
    try {
      // Get the userId from the request parameters or session
      const userId = req.params.userId || req.session.userId;
  
      // If there is no userId, redirect to the login page
      if (!userId) {
        return res.redirect('/login'); 
      }
  
      // Fetch the user and populate their team information
      const user = await User.findOne({ id: userId }).populate('team');
      
      // If the user is not found, redirect to the login page
      if (!user) {
        return res.redirect('/login'); 
      }
  
      // Fetch group evaluations for the user
      const evaluations = await GroupEvaluation.find({ to_user: userId });
  
      // Fetch self evaluations for collaboration and decision-making
      let selfCollab = await Results.find({ id_user: userId });
      selfCollab = lastResponse(selfCollab);
  
      let selfDM = await DecisionMaking.find({ id_user: userId });
      selfDM = lastResponse(selfDM);
  
      // Set default values if no self evaluations are found
      if (!selfCollab) {
        selfCollab = { 'result': 'N/A' };
      }
      if (!selfDM) {
        selfDM = { 'style': 'N/A' };
      } 
  
      // Calculate the most voted styles based on evaluations
      const mostVotedStyles = calculateMostVotedStyles(evaluations);
  
      // Render the profile view with the user, self evaluations, and most voted styles
      return res.view('pages/profile/', { user, selfCollab, selfDM, mostVotedStyles });
    } catch (error) {
      sails.log.error(error);
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  },
  
  // Function to update the user's happiness
  updateHappiness: async function (req, res) {
    // Check if the user is logged in
    if (!req.session.userId) {
      return res.redirect('/login'); 
    }
    try {
      const { happiness } = req.body;
      
      // Update the user's happiness
      const user = await User.updateOne({ id: req.session.userId }).set({ happiness });

      // If the user is not found, return a 404 error
      if (!user) {
        return res.status(404).json({ error: 'User not found' }); 
      }

      // Fetch team membership and calculate the average happiness if the user is part of a team
      const teamMembership = await Student_team.findOne({ id_user: user.id });
      if (teamMembership) {
        const teamMembers = await Student_team.find({ id_team: teamMembership.id_team }).populate('id_user');
        const totalHappiness = teamMembers.reduce((total, member) => total + (member.id_user.happiness || 0), 0);
        const averageHappiness = totalHappiness / teamMembers.length;

        // Update the team's average happiness
        await Team.updateOne({ id: teamMembership.id_team }).set({ happiness: averageHappiness });
      }

      // Return a success message
      return res.json({ success: true, message: 'Happiness updated successfully' });
    } catch (error) {
      sails.log.error(error);
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};

// Function to get the last response from an array of responses
function lastResponse(responses){
  return responses.pop();
}

// Function to calculate the most voted styles from evaluations
function calculateMostVotedStyles(evaluations) {
  const userEvaluations = {};

  // Iterate through evaluations to count votes for each style
  evaluations.forEach(evaluation => {
    if (!userEvaluations[evaluation.to_user]) {
      userEvaluations[evaluation.to_user] = { collaboration: {}, decision: {} };
    }

    if (!userEvaluations[evaluation.to_user].collaboration[evaluation.collaboration]) {
      userEvaluations[evaluation.to_user].collaboration[evaluation.collaboration] = 0;
    }
    userEvaluations[evaluation.to_user].collaboration[evaluation.collaboration]++;

    if (!userEvaluations[evaluation.to_user].decision[evaluation.decision]) {
      userEvaluations[evaluation.to_user].decision[evaluation.decision] = 0;
    }
    userEvaluations[evaluation.to_user].decision[evaluation.decision]++;
  });

  const mostVotedStyles = {};

  // Determine the most voted collaboration and decision styles for each user
  for (const userId in userEvaluations) {
    const collaborationStyles = userEvaluations[userId].collaboration;
    const decisionStyles = userEvaluations[userId].decision;

    const mostVotedCollaboration = Object.keys(collaborationStyles).reduce((a, b) => collaborationStyles[a] > collaborationStyles[b] ? a : b);
    const mostVotedDecision = Object.keys(decisionStyles).reduce((a, b) => decisionStyles[a] > decisionStyles[b] ? a : b);

    mostVotedStyles[userId] = {
      collaboration: mostVotedCollaboration,
      decision: mostVotedDecision
    };
  }

  return mostVotedStyles;
}
