const assert = require("assert");
const cloudinary = require('cloudinary').v2;
const helper = require("../../../api/helpers/upload");
const { USER, FILE } = require("../../util/");

describe("upload helper", () => {
  beforeEach(() => {
    // Reset the cloudinary uploader mock before each test
    cloudinary.uploader.upload = async (filePath) => {
      return { secure_url: "https://example.com/photo.png" };
    };
  });

  it("Should successfully upload profile photo", async () => {
    // Simulate HTTP request
    const req = {
      file: () => ({
        upload: (callback) => {
          callback(null, [{ fd: "fake-file-path" }]);
        }
      })
    };

    // Helper input parameters
    const inputs = {
      req: req,
      fieldName: "file",
    };

    // Calling the upload helper
    const result = await helper.fn(inputs, {
      success: (url) => url
    });

    // Verifying if the returned URL is as expected
    assert.strictEqual(result, "https://example.com/photo.png");
  });

  it("Should fail if no file is provided", async () => {
    // Simulate HTTP request without files
    const req = {
      file: () => ({
        upload: (callback) => {
          callback(null, []); // No file provided
        }
      })
    };

    // Helper input parameters
    const inputs = {
      req: req,
      fieldName: "file",
    };

    try {
      // Calling the upload helper
      await helper.fn(inputs, {
        success: (url) => url
      });
      // If the function doesn't throw an error, the test should fail
      assert.fail("Expected error not thrown");
    } catch (err) {
      // Verifying if the error is as expected
      assert.strictEqual(err.message, "File is required");
    }
  });

  it("Should fail if there's an error during file upload", async () => {
    // Simulate HTTP request with upload error
    const req = {
      file: () => ({
        upload: (callback) => {
          callback(new Error("Upload error")); // Simulate an upload error
        }
      })
    };

    // Helper input parameters
    const inputs = {
      req: req,
      fieldName: "file",
    };

    try {
      // Calling the upload helper
      await helper.fn(inputs, {
        success: (url) => url
      });
      // If the function doesn't throw an error, the test should fail
      assert.fail("Expected error not thrown");
    } catch (err) {
      // Verifying if the error is as expected
      assert.strictEqual(err.message, "Upload error");
    }
  });

  it("Should fail if there's an error in Cloudinary upload", async () => {
    // Mock Cloudinary upload method to throw an error
    cloudinary.uploader.upload = async (filePath) => {
      throw new Error("Cloudinary upload error");
    };

    // Simulate HTTP request
    const req = {
      file: () => ({
        upload: (callback) => {
          callback(null, [{ fd: "fake-file-path" }]);
        }
      })
    };

    // Helper input parameters
    const inputs = {
      req: req,
      fieldName: "file",
    };

    try {
      // Calling the upload helper
      await helper.fn(inputs, {
        success: (url) => url
      });
      // If the function doesn't throw an error, the test should fail
      assert.fail("Expected error not thrown");
    } catch (err) {
      // Verifying if the error is as expected
      assert.strictEqual(err.message, "Cloudinary upload error");
    }
  });
});
