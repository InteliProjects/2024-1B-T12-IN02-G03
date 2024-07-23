// api/models/GroupEvaluation.js

module.exports = {
  tableName: 'groupevaluation',
  attributes: {
    id_user: {
      model: 'user',
      required: true
    },
    to_user: {
      model: 'user',
      required: true
    },
    collaboration: {
      type: 'string',
      required: true
    },
    decision: {
      type: 'string',
      required: true
    }
  }
};
