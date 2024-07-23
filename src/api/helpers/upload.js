const cloudinary = require('cloudinary').v2;

module.exports = {
  friendlyName: 'Upload',

  description: 'Upload a file in cloudinary.',

  inputs: {
    req: {
      type: 'ref',
      required: true,
      description: 'The HTTP request',
    },
    fieldName: {
      type: 'string',
      required: true,
      description: 'Field name',
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: async function (inputs, exits) {
    let url = '';
    const { req, fieldName } = inputs;

    await new Promise((resolve, reject) => {
      req.file(fieldName).upload(async (err, files) => {
        if (err) {
          return reject(err);
        }

        if (!files || files.length === 0) {
          return reject(new Error('File is required'));
        }

        const file = files[0];
        cloudinary.config({
          cloud_name: 'dyzkyicgx',
          api_key: '665755671631569',
          api_secret: 'cBqV95fukhn6i6IZmzUjG9JvFYI',
        });

        try {
          const result = await cloudinary.uploader.upload(file.fd);
          url = result.secure_url;
          resolve();
        } catch (uploadErr) {
          reject(uploadErr);
        }
      });
    });

    return exits.success(url);
  },
};
