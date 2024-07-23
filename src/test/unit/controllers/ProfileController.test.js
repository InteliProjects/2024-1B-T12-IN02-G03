// profile controller
// Import necessary modules for the tests
const assert = require("assert"); // Node.js assert module for assertions
const sinon = require("sinon"); // Library for spies, stubs, and mocks
const ProfileController = require("../../../api/controllers/ProfileController"); // Import the controller to be tested
const { mockAsync, RESPONSE, USER } = require("../../util"); // Import utilities for mock and response

describe("ProfileController", () => {
  let req, res;

  // Before each test, set up the req and res objects
  beforeEach(() => {
    req = {
      session: {
        userId: USER.id // Set a logged-in user
      },
      body: {} // Initialize the request body as an empty object
    };

    // Set up the res object with stubs for the used methods
    res = {
      redirect: sinon.stub(), // Stub for the redirect method
      view: sinon.stub(), // Stub for the view method
      status: sinon.stub().returnsThis(), // Stub for the status method, returning the res object
      json: sinon.stub().returnsThis(), // Stub for the json method, returning the res object
      ...RESPONSE // Include other response properties if necessary
    };
  });

  // After each test, restore the stubs to their original state
  afterEach(() => {
    sinon.restore(); // Restore all stubs and spies
  });

  // Tests for the showProfile method
  describe("#showProfile", () => {
    it("Should redirect to /login if the user is not logged in", async () => {
      req.session.userId = null; // Remove the logged-in user

      await ProfileController.showProfile(req, res); // Call the showProfile method

      assert(res.redirect.calledWith('/login')); // Check if redirection to /login occurred
    });

    it("Should redirect to /login if the user is not found", async () => {
      sinon.stub(User, 'findOne').resolves(null); // Stub User.findOne returning null

      await ProfileController.showProfile(req, res); // Call the showProfile method

      assert(res.redirect.calledWith('/login')); // Check if redirection to /login occurred
    });

    it("Should render the profile page with user data", async () => {
      sinon.stub(User, 'findOne').resolves(USER); // Stub User.findOne returning a user

      await ProfileController.showProfile(req, res); // Call the showProfile method

      assert(res.view.calledWith('pages/profile', { user: USER })); // Check if the profile page was rendered with user data
    });

    it("Should return 500 if an error occurs", async () => {
      sinon.stub(User, 'findOne').rejects(new Error('Database error')); // Stub User.findOne throwing an error

      await ProfileController.showProfile(req, res); // Call the showProfile method

      assert(res.status.calledWith(500)); // Check if status 500 was set
    });
  });

});
