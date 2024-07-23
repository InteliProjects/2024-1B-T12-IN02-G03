module.exports = {
  attributes: {
   
    // Foreign key to user
    id_user: {
      model: 'user',
      columnName: 'id_user',
      required: true
    },
    
    qntA: {
      type: 'number',
      allowNull: true,
    },
    
    qntB: {
      type: 'number',
      allowNull: true,
    },
    
    qntC: {
      type: 'number',
      allowNull: true,
    },
    
    qntD: {
      type: 'number',
      allowNull: true,
    },
    
    qntE: {
      type: 'number',
      allowNull: true,
    },
    
    result: {
      type: 'string',
      allowNull: true,
    },
  }
};
