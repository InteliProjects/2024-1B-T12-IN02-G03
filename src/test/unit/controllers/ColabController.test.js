const assert = require('assert');
const sinon = require('sinon');
const ColabController = require('../../../api/controllers/ColabController');
const { QNTANSWERS, RESPONSE } = require("../../util/");

describe('ColabController', function() {
    describe('answer', function() {
        it('should create a new result and return success', async function() {
            // Arrange
            const req = { QNTANSWERS }; // Mock request with QNTANSWERS data
            const createStub = sinon.stub(ColabController, "answer").resolves({ success: true }); // Stub the answer method to resolve with success

            // Act
            const result = await ColabController.answer(req, RESPONSE); // Call the answer method with the mock request and response

            // Assert
            assert.strictEqual(createStub.calledOnce, true); // Assert that the stub was called exactly once
            assert.deepStrictEqual(result, { success: true }); // Assert that the result matches the expected success response

            createStub.restore(); // Restore the original method
        });
    });
});
