require('dotenv').config();
module.exports = {
  port: process.env.PORT || 1347,
  datastores: {
    default: {
      adapter: 'sails-postgresql',
      url: process.env.DATABASE_URL,
      ssl: true
    }
  },

  models: {
    migrate: 'safe',
  },

  blueprints: {
    shortcuts: false,
  },

  security: {
    cors: {
      allowOrigins: [
        'https://interculture.onrender.com',
       ]
    },
  },

  session: {
    cookie: {
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,  // 24 hours
    },
  },

  sockets: {
    onlyAllowOrigins: [
       'https://interculture.onrender.com',
    ],
    // adapter: '@sailshq/socket.io-redis',
    // url: 'redis://user:password@bigsquid.redistogo.com:9562/databasenumber',
  },

  log: {
    level: 'debug'
  },

  http: {
    cache: 365.25 * 24 * 60 * 60 * 1000, // One year
    trustProxy: true,
  },

  // port: 80,

 
};
