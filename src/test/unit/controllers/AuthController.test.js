// auth controller
const assert = require("assert");
const sinon = require("sinon");
const bcrypt = require("bcrypt");
const controller = require("../../../api/controllers/AuthController");
const { mockAsync, RESPONSE, USER } = require("../../util/");

// Encrypts the example password to simulate a user in the database
const hashedPassword = bcrypt.hashSync('password123', 10);

// Updates the mock user with the encrypted password
USER.password = hashedPassword;

describe("AuthController", () => {

  it("Should successfully log in", async () => {
    // Mock of the HTTP response
    const res = {
      status: sinon.stub().returnsThis(), // Stub for status method
      json: sinon.stub().callsFake((response) => response), // Stub for json method
      redirect: sinon.stub(), // Stub for redirect method
      ...RESPONSE // Adds other response methods, if they exist
    };

    // Mock of the HTTP request
    const req = {
      body: {
        email: USER.email,
        password: 'password123', // Correct password for the test
      },
      session: {} // Adds session to the request object
    };

    // Stub for the findOne method of the User model, returning the mock user
    const findOneStub = mockAsync(User, 'findOne', USER);
    // Stub for the bcrypt compare method, always resolving as true
    const compareStub = sinon.stub(bcrypt, 'compare').resolves(true);

    // Executes the login function of the controller
    await controller.login(req, res);

    // Verifies that the stub methods were called correctly
    assert.strictEqual(findOneStub.calledOnce, true);
    assert.strictEqual(compareStub.calledOnce, true);
    assert.strictEqual(res.redirect.calledWith('/homepage'), true); // Verifies that it redirected to /homepage
    
    // Restores the stubs to avoid side effects
    findOneStub.restore();
    compareStub.restore();
  });

  it("Should return 400 error if the email is missing", async () => {
    // Mock of the HTTP response
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      ...RESPONSE
    };

    // Mock of the HTTP request without the email field
    const req = {
      body: {
        // email: USER.email, // Commented out to simulate missing email
        password: USER.password,
      },
      session: {} // Adds session to the request object
    };

    // Stub for the findOne method of the User model, will not be called in this test
    const findOneStub = mockAsync(User, 'findOne', USER);
    // Executes the login function of the controller
    await controller.login(req, res);

    // Verifies that the 400 error status was returned
    assert.strictEqual(res.status.calledWith(400), true); 
    // Verifies that findOne was not called
    assert.strictEqual(findOneStub.called, false);

    // Restores the stub
    findOneStub.restore();
  });

  it("Should return 400 error if the password is missing", async () => {
    // Mock of the HTTP response
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      ...RESPONSE
    };

    // Mock of the HTTP request without the password field
    const req = {
      body: {
        email: USER.email,
        // password: USER.password, // Commented out to simulate missing password
      },
      session: {} // Adds session to the request object
    };

    // Stub for the findOne method of the User model, will not be called in this test
    const findOneStub = mockAsync(User, 'findOne', USER);
    // Executes the login function of the controller
    await controller.login(req, res);

    // Verifies that the 400 error status was returned
    assert.strictEqual(res.status.calledWith(400), true);
    // Verifies that findOne was not called
    assert.strictEqual(findOneStub.called, false);

    // Restores the stub
    findOneStub.restore();
  });

  it('Should return a 404 error when the user is not found', async () => {
    // Mock of the HTTP response
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      ...RESPONSE
    };

    // Mock of the HTTP request with correct email and password
    const req = {
      body: {
        email: USER.email,
        password: USER.password,
      },
      session: {} // Adds session to the request object
    };

    // Stub for the findOne method of the User model, simulating user not found
    const findOneStub = mockAsync(User, 'findOne', USER).resolves(null);

    // Executes the login function of the controller
    await controller.login(req, res);

    // Verifies that the 404 error status was returned
    assert.strictEqual(res.status.calledWith(404), true);

    // Restores the stub
    findOneStub.restore();
  });

  it('Should return a 403 error when the password is invalid', async () => {
    // Mock of the HTTP response
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      ...RESPONSE
    };

    // Mock of the HTTP request with correct email but wrong password
    const req = {
      body: {
        email: USER.email, 
        password: 'wrongpassword',
      },
      session: {} // Adds session to the request object
    };

    // Stub for the findOne method of the User model, returning the mock user
    const findOneStub = mockAsync(User, 'findOne', USER);

    // Executes the login function of the controller
    await controller.login(req, res);

    // Verifies that the 403 error status was returned
    assert.strictEqual(res.status.calledWith(403), true); 
    // Verifies that findOne was called once
    assert.strictEqual(findOneStub.calledOnce, true);

    // Restores the stub
    findOneStub.restore();
  });

  it("Should return a 500 error in case of an unexpected error", async () => {
    // Mock of the HTTP request with correct data
    const req = {
      body: {
        email: USER.email,
        password: 'password123',
      },
      session: {}
    };

    // Mock of the HTTP response
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      ...RESPONSE
    };

    // Stub for the findOne method of the User model, simulating an unexpected error
    const findOneStub = mockAsync(User, 'findOne', USER);

    // Executes the login function of the controller
    await controller.login(req, res);

    // Verifies that findOne was called once
    assert.strictEqual(findOneStub.calledOnce, true);
    // Verifies that the 500 error status was returned
    assert(res.status.calledWith(500), true);

    // Restores the stub
    findOneStub.restore();
  });
  
});


