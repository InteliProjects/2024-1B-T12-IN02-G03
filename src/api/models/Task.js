// api/models/Task.js

module.exports = {

  // Define the attributes (columns) of the table
  attributes: {
    // The ID will be generated automatically by Sails.js, so it is not necessary to declare it here

    // Name of the task
    name: {
      type: 'string',        // Defines the type of the attribute as a string
      required: true,        // Makes this attribute mandatory
      description: 'The name of the task' // Description of the attribute, useful for documentation
    },

    // Description of the task
    description: {
      type: 'string',        // Defines the type of the attribute as a string
      required: true,        // Makes this attribute mandatory
      description: 'The description of the task' // Description of the attribute, useful for documentation
    },

    // Completion status of the task
    completed: {
      type: 'boolean',       // Defines the type of the attribute as a boolean
      defaultsTo: false,     // Sets the default value of this attribute to false
      description: 'Whether the task is completed or not' // Description of the attribute, useful for documentation
    },

    //foreign keys
    id_user: {
      model: 'user',
      columnName: 'id_user',
      required: true
    },
  }
};


      


