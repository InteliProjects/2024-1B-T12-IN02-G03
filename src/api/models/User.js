/**
 * user.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'user',
  datastore: 'default',
  migrate: 'alter', // Ou 'safe', 'drop', 'alter'


  attributes: {
    firstName: { 
      type: 'string', 
      allowNull: false 
    },

    lastName: { 
      type: 'string', 
      allowNull: false 
    },

    email: { 
      type: 'string', 
      allowNull: false,
      unique: true,
      required: true,
    },

    password: { 
      type: 'string', 
      allowNull: false
    },

    university: { 
      type: 'string', 
      allowNull: true 
    },
    
    nationality: { 
      type: 'string', 
      allowNull: true 
    },

    happiness: { 
      type: 'number', 
      allowNull: true 
    },

    photo: { 
      type: 'string', 
      allowNull: true 
    },


    //foreign keys 1:1
    team: {
      model: 'team'
    },

    //foreign keys: 1:N
    task: {
      collection: 'task',
      via: 'id_user',
    },

    decisionMaking: {
      collection: 'decisionmaking',
      via: 'id_user'
    },

    results: {
      collection: 'results',
      via: 'id_user'
    },
  },
};