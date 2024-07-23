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
        let qntAnswers = {
            qntA: req.body.qntA,
            qntB: req.body.qntB,
            qntC: req.body.qntC,
            qntD: req.body.qntD,
            qntE: req.body.qntE,
            result: req.body.result,
            id_user: req.session.userId
        };

        let newAnswer = await Results.create(qntAnswers).fetch(); // Creating a new result in the data bank
        res.redirect(req.body.url); // Responding with the newly created user data
        
    } catch (err) {
        console.error('Error storing the result', err); // Logging any error that occurs during user creation
        res.status(500).json({ error: 'Error storing the result' }); // Responding with an error message if user creation fails
    }
  }
};
