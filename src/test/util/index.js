const sinon = require("sinon");
const bcrypt = require("bcrypt");

// Function to create an asynchronous stub that resolves to a specific result.
const mockAsync = (model, module, result = null) => {
  return sinon.stub(model, module).resolves(result);
};

const RESPONSE = {
  json: function (data) {
    return data;
  },
  success: function (data) {
    return data;
  },
  error: function (err) {
    throw err;
  }
};

const USER = {
  id: "cce825bf-09d5-4c8e-a9be-9f4f4a9dba5d",
  username: "Julin",
  email: "joão.s@gmail.com",
  bio: "Sou o julin",
  password: "password123",
};

const QNTANSWERS = {
  qntA: 3,
  qntB: 2,
  qntC: 1,
  qntD: 0,
  qntE: 0,
  result: "director",
  user_id: 0
}

// Constant for the input password to be tested.
const PASSWORD = "password123";
// Constant for the expected hashed password.
const HASHED_PASSWORD = "hashedPassword123";

module.exports = {
  mockAsync,
  RESPONSE,
  USER,
  QNTANSWERS,
  PASSWORD, // Exporting the PASSWORD constant.
  HASHED_PASSWORD, // Exporting the HASHED_PASSWORD constant.

  // Function to create a bcrypt.hash stub that resolves to HASHED_PASSWORD.
  createBcryptHashStub() {
    return mockAsync(bcrypt, "hash", HASHED_PASSWORD);
  },
  
  // Function to create a bcrypt.hash stub that rejects with an error.
  createBcryptHashErrorStub() {
    return sinon.stub(bcrypt, "hash").rejects(new Error("Hashing error"));
  },
  
  // Function to restore the original behavior of bcrypt.hash.
  restoreBcryptHashStub(stub) {
    stub.restore();
  }
};
