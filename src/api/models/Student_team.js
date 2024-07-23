/**
 * Student_team.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'student_team',
  datastore: 'default',
  migrate: 'alter', // Ou 'safe', 'drop', 'alter'
  attributes: {
    id_user: { model: 'user', required: true },
    id_team: { model: 'team', required: true }
  }
};
