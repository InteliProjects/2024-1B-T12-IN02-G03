const bcrypt = require('bcrypt');

module.exports = {
  // Function to display the user signup form
  showUserForm: function (req, res) {
    return res.view('pages/signup', { layout: false });
  },

  // Function to create a new user
  create: async function (req, res) {
    try {
      const saltRounds = 10;
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

      // Prepare the user data for insertion
      let formattedUserData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        university: req.body.university,
        nationality: req.body.nationality,
        age: req.body.age
      };

      // Create a new user and fetch the result
      const newUser = await User.create(formattedUserData).fetch();
      
      // Store the user ID and user information in the session
      req.session.userId = newUser.id;
      req.session.user = {
        firstname: newUser.firstName,
        lastname: newUser.lastName,
        university: newUser.university,
        country: newUser.country,
        age: newUser.age,
        photo: newUser.photo
      };

      // Redirect to the homepage after successful signup
      res.redirect('/');
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ error: 'Error creating user' });
    }
  },

  // Function to display the user profile
  showProfile: function (req, res) {
    if (!req.session.userId) {
      return res.redirect('/');
    }

    const user = req.session.user;
    return res.view('pages/profile', { 
      layout: false, 
      user: user 
    });
  },

  // Function to upload a profile photo
  upload: async function (req, res) {
    try {
      const url = await sails.helpers.upload(req, 'profile_photo');
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Update the user's photo URL in the database
      const updatedUser = await User.updateOne({ id: userId }).set({ photo: url });
      req.session.user.photo = url;

      // Render the profile page with success message
      return res.view('pages/profile', {
        success: true,
        message: 'File uploaded successfully!',
        url: url
      });
    } catch (err) {
      return res.serverError({ error: 'An unexpected error occurred' });
    }
  },

  // Function to log out the user
  logout: function (req, res) {
    req.session.userId = null;
    res.redirect('/');
  },

  // Function to read and return user information
  read: async function (req, res) {
    try {
      const userId = req.params.id;
      // Fetch the user based on user ID
      const user = await User.findOne({ id: userId });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Return the user information as JSON
      return res.json(user);
    } catch (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};
