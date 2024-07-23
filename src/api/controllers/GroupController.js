module.exports = {
  // Function to show the group page
  showGroupPage: async function (req, res) {
    try {
      // Get the ID of the logged-in user from the session
      const loggedInUserId = req.session.userId;

      // If the user is not logged in, redirect to the login page
      if (!loggedInUserId) {
        return res.redirect('/login');
      }

      // Find the user by their ID and populate their team information
      const user = await User.findOne({ id: loggedInUserId }).populate('team');

      // If the user is not found, log a warning and render the group page with an empty users array
      if (!user) {
        sails.log.warn('User not found:', loggedInUserId);
        return res.view('pages/group', { users: [] });
      }

      // Find the team membership of the user and populate the team information
      const teamMembership = await Student_team.findOne({ id_user: user.id }).populate('id_team');

      // If the user is not associated with a team, log a warning and render the group page with an empty users array
      if (!teamMembership) {
        sails.log.warn('User not associated with a team:', loggedInUserId);
        return res.view('pages/group', { users: [] });
      } else {
        // Find all members of the user's team and populate their user information
        let teamMembers = await Student_team.find({ id_team: teamMembership.id_team.id }).populate('id_user');

        // Fetch group evaluations for the team members
        const evaluations = await GroupEvaluation.find({ to_user: _.map(teamMembers, 'id_user.id') });

        // Calculate the most voted styles for each user
        const mostVotedStyles = calculateMostVotedStyles(evaluations);

        // Initialize an object to store results for each team member
        resultsOfEach = {};
        for (var member of teamMembers) {
          // Fetch the latest collaboration results for the member
          var selfCollab = await Results.find({ id_user: member.id_user.id });
          selfCollab = lastResponse(selfCollab);

          // Fetch the latest decision-making results for the member
          var selfDM = await DecisionMaking.find({ id_user: member.id_user.id });
          selfDM = lastResponse(selfDM);

          // Set the collaboration result or null if undefined
          if (selfCollab === undefined) {
            var collabResult = null;
          } else {
            var collabResult = selfCollab["result"];
          }

          // Set the decision-making result or null if undefined
          if (selfDM === undefined) {
            var DMresult = null;
          } else {
            var DMresult = selfDM["style"];
          }

          // Store the results for the member
          resultsOfEach[member.id_user.id] = {
            collaboration: collabResult,
            decision: DMresult
          };
        }

        // Log the results for debugging purposes
        console.log(resultsOfEach);

        // Render the group page with the team members, their results, and the most voted styles
        return res.view('pages/group', { users: teamMembers, resultsOfEach, mostVotedStyles });
      }

    } catch (err) {
      // Log an error if there is an issue fetching team members and return a server error
      sails.log.error('Error fetching team members:', err);
      return res.serverError(err);
    }
  },
};

/*
async function selfEvaluation(teamMembers){
  // Initialize an object to store results for each user
  resultsOfEach = {}
  for (user of teamMembers){

    // Fetch the latest collaboration results for the user
    var selfCollab = await Results.find({id_user: user.id_user.id});
    selfCollab = lastResponse(selfCollab)

    // Fetch the latest decision-making results for the user
    var selfDM = await DecisionMaking.find({id_user: user.id_user.id});
    selfDM = lastResponse(selfDM)

    // Set the collaboration result or null if undefined
    if (selfCollab===undefined){
      var collabResult=null
    } else {
      var collabResult=selfCollab["result"]
    }

    // Set the decision-making result or null if undefined
    if(selfDM===undefined){
      var DMresult=null
    } else {
      var DMresult = selfDM["style"]
    }

    // Store the results for the user
    resultsOfEach[user.id_user.id] = {
      collaboration: collabResult,
      decision: DMresult
    }
  }
  return resultsOfEach
}
*/

// Function to get the last response from an array of responses
function lastResponse(responses){
  lastAnswer = responses.pop()
  return lastAnswer
}

// Function to calculate the most voted styles from evaluations
function calculateMostVotedStyles(evaluations) {
  const userEvaluations = {};

  evaluations.forEach(evaluation => {
    // Initialize the user's evaluation object if not already present
    if (!userEvaluations[evaluation.to_user]) {
      userEvaluations[evaluation.to_user] = { collaboration: {}, decision: {} };
    }

    // Increment the count for the collaboration style
    if (!userEvaluations[evaluation.to_user].collaboration[evaluation.collaboration]) {
      userEvaluations[evaluation.to_user].collaboration[evaluation.collaboration] = 0;
    }
    userEvaluations[evaluation.to_user].collaboration[evaluation.collaboration]++;

    // Increment the count for the decision style
    if (!userEvaluations[evaluation.to_user].decision[evaluation.decision]) {
      userEvaluations[evaluation.to_user].decision[evaluation.decision] = 0;
    }
    userEvaluations[evaluation.to_user].decision[evaluation.decision]++;
  });

  const mostVotedStyles = {};

  // Determine the most voted styles for each user
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
