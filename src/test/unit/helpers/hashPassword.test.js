// Import the 'assert' library to check conditions in tests.
const assert = require('assert');
require('nyc');

// Import the 'hashPasswordHelper' helper that will be tested.
const hashPasswordHelper = require('../../../api/helpers/hashPassword');

// Import functions and constants from the previously created utility module.
const {
  createBcryptHashStub,    // Function to create a successful stub of bcrypt.hash.
  createBcryptHashErrorStub, // Function to create a stub that simulates an error in bcrypt.hash.
  restoreBcryptHashStub,     // Function to restore the original behavior of bcrypt.hash.
  RESPONSE,                  // Object simulating success and error responses.
  PASSWORD,                  // The input password to be tested.
  HASHED_PASSWORD            // The expected hashed password.
} = require('../../util');

// Describe the test group for the 'hashPassword' helper.
describe('hashPassword Helper', () => {
  let bcryptHashStub; // Variable to store the bcrypt.hash stub.

  // Describe the tests for the case where bcrypt.hash is successful.
  describe('when bcrypt.hash is successful and encrypts the password:', () => {
    // Run before each test: create a stub that simulates bcrypt.hash working correctly.
    beforeEach(() => {
      bcryptHashStub = createBcryptHashStub();
    });

    // Run after each test: restore the original behavior of bcrypt.hash.
    afterEach(() => {
      restoreBcryptHashStub(bcryptHashStub);
    });

    // Test to verify if the password is hashed correctly.
    it('hashes the password', async () => {
      // Call the helper with the password and the simulated response.
      const result = await hashPasswordHelper.fn({ password: PASSWORD }, RESPONSE);

      // Check if bcrypt.hash was called once.
      assert.strictEqual(bcryptHashStub.calledOnce, true);
      // Check if bcrypt.hash was called with the password and the correct number of salt rounds.
      assert.strictEqual(bcryptHashStub.calledWith(PASSWORD, 10), true);
      // Check if the function result is equal to the expected hashed password.
      assert.strictEqual(result, HASHED_PASSWORD);
    });
  });

  // Describe the tests for the case where bcrypt.hash fails.
  describe('when bcrypt.hash fails:', () => {
    // Run before each test: create a stub that simulates an error in bcrypt.hash.
    beforeEach(() => {
      bcryptHashStub = createBcryptHashErrorStub();
    });

    // Run after each test: restore the original behavior of bcrypt.hash.
    afterEach(() => {
      restoreBcryptHashStub(bcryptHashStub);
    });

    // Test to verify if errors are handled correctly.
    it('handles errors correctly', async () => {
      try {
        // Try calling the helper with the password and the simulated response.
        await hashPasswordHelper.fn({ password: PASSWORD }, RESPONSE);
      } catch (err) {
        // Check if the caught error has the expected message.
        assert.strictEqual(err.message, 'Hashing error');
      }

      // Check if bcrypt.hash was called once.
      assert.strictEqual(bcryptHashStub.calledOnce, true);
      // Check if bcrypt.hash was called with the password and the correct number of salt rounds.
      assert.strictEqual(bcryptHashStub.calledWith(PASSWORD, 10), true);
    });
  });
});
