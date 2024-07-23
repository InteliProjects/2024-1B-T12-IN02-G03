/**
 * ColabController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    answer: async function(req, res) {
      try{
        //receive results from the view
          let qntAnswersDM = {
              qntX: req.body.qntX,
              qntY: req.body.qntY,
              style: req.body.style,
              id_user: req.session.userId
          };
  
          urlDM = req.body.urlDM
          console.log(urlDM)
          console.log(qntAnswersDM)
  
          let newAnswerDM = await DecisionMaking.create(qntAnswersDM).fetch(); // Creating a new result in the data bank
          res.redirect(urlDM); // Responding with the newly created user data
          
      } catch (err) {
          console.error('Error storing the result', err); // Logging any error that occurs during user creation
          res.status(500).json({ error: 'Error storing the result' }); // Responding with an error message if user creation fails
      }
    }
  };
  