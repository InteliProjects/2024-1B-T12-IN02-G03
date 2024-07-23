// test/unit/UserController.test.js
const assert = require('assert');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const UserController = require('../../../api/controllers/UserController');
const { mockAsync, RESPONSE, USER } = require("../../util/");

describe('UserController', () => {

    describe('create', () => {

        let req, res, userCreateStub, hashStub;

        beforeEach(() => {
            req = {
                body: {
                    firstName: 'João',
                    lastName: 'Silva',
                    email: 'joao.silva@example.com',
                    password: 'password123',
                    university: 'Universidade XYZ',
                    nationality: 'Brasileiro'
                },
                session: {}
            };

            res = {
                redirect: sinon.spy(),
                status: sinon.stub().returns({ json: sinon.spy() })
            };

            userCreateStub = sinon.stub(User, 'create').returns({
                fetch: () => Promise.resolve({ id: 1, ...req.body })
            });

            hashStub = sinon.stub(bcrypt, 'hash').resolves('hashed_password');
        });

        afterEach(() => {
            userCreateStub.restore();
            hashStub.restore();
        });

        it('Should successfully create a user and send information to the database', async () => {
            await UserController.create(req, res);

            // Verify if User.create was called with the correct data
            assert(userCreateStub.calledOnce);
            const args = userCreateStub.getCall(0).args[0];
            assert.strictEqual(args.firstName, req.body.firstName);
            assert.strictEqual(args.lastName, req.body.lastName);
            assert.strictEqual(args.email, req.body.email);
            assert.strictEqual(args.university, req.body.university);
            assert.strictEqual(args.nationality, req.body.nationality);
            assert.strictEqual(req.session.userId, 1);
            assert(res.redirect.calledWith('/login'));
        });

        it('Should hash the password before saving to the database', async () => {
            await UserController.create(req, res);

            // Verify if bcrypt.hash was called with the correct password
            assert(hashStub.calledOnceWith('password123', 10));

            // Verify if User.create was called with the hashed password
            const args = userCreateStub.getCall(0).args[0];
            assert.strictEqual(args.password, 'hashed_password');
        });
    });
});
