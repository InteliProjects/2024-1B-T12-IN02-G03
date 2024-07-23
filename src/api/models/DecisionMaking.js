module.exports = {
  attributes: {
   
    // Foreign key to user
    id_user: {
      model: 'user',
      columnName: 'id_user',
      required: true
    },
    
    qntX: {
      type: 'number',
      allowNull: true,
    },
    
    qntY: {
      type: 'number',
      allowNull: true,
    },
        
    style: {
      type: 'string',
      allowNull: true,
    },
  }
};
