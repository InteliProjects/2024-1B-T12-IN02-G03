/**
 * Team.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id_user: { model: 'user' },  // Foreign key reference to User
    student_group: { collection: 'student_team', via: 'id_team' },
    teamName: { type: 'string', required: false },
    color: { type: 'string', required: true },
    universe: { type: 'number', required: true },
    happiness: { type: 'number' },  // Overall team happiness can be calculated and stored here
  },
};
