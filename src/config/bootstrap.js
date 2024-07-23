module.exports.bootstrap = async function() {
  const bcrypt = require('bcrypt');

  try {
    // Create a team if not exists
    let team = await Team.findOne({ universe: 1 });
    if (!team) {
      team = await Team.create({
        color: 'blue',
        universe: 1,
        happiness: 0 
      }).fetch();
    }

    const users = [
      {
        firstName: 'Marlos',
        lastName: 'Guedes',
        email: 'marloscguedes@gmail.com',
        password: '123',
        type: 1,
        happiness: 4,
        university: 'Zuyd University',
        nationality: 'Brazil',
      },
      {
        firstName: 'Andre',
        lastName: 'Dleizer',
        email: 'andredleizer@gmail.com',
        password: '123',
        type: 1,
        happiness: 2,
        university: 'Inteli',
        nationality: 'Brazil',
      },
    ];

    const saltRounds = 10;

    for (const user of users) {
      const existingUser = await User.findOne({
        email: user.email,
      });
      if (!existingUser) {
        const newUser = await User.create({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: await bcrypt.hash(user.password, saltRounds),
          type: user.type,
          happiness: user.happiness,
          university: user.university, 
          nationality: user.nationality, 
        }).fetch();

        // Add the new user to the team
        await Student_team.create({
          id_user: newUser.id,
          id_team: team.id
        });
      }
    }

    // Verificar associações de usuários e times
    const allUsers = await User.find().populate('team');
    sails.log.info('Todos os usuários e seus times:', allUsers);

    sails.log.info('Bootstrap completed');
  } catch (error) {
    sails.log.error('Error Bootstrap', error);
  }
};
