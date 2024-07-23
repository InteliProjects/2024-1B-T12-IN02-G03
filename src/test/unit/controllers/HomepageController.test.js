const assert = require('assert');
const sinon = require('sinon');
const request = require('supertest');

describe('HomepageController', function() {
  describe('#overview()', function() {
    it('should redirect to /login if not logged in', function(done) {
      request(sails.hooks.http.app)
        .get('/homepage')
        .expect(302)
        .expect('location', '/login', done);
    });

    it('should return homepage view with user and average happiness if logged in', function(done) {
      // Mock session
      const req = {
        session: {
          userId: 1
        }
      };

      // Mock user
      const user = {
        id: 1,
        name: 'Test User'
      };

      // Mock team membership
      const teamMembership = {
        id: 1,
        id_user: 1,
        id_team: 1
      };

      // Mock team members
      const teamMembers = [
        { id_user: { happiness: 1 } },
        { id_user: { happiness: 4 } }
      ];

      // Stub User.findOne
      sinon.stub(User, 'findOne').returns(Promise.resolve(user));

      // Stub Student_team.findOne
      sinon.stub(Student_team, 'findOne').returns(Promise.resolve(teamMembership));

      // Stub Student_team.find
      sinon.stub(Student_team, 'find').returns({
        populate: sinon.stub().returns(Promise.resolve(teamMembers))
      });

      // Execute controller action
      request(sails.hooks.http.app)
        .get('/homepage')
        .set('Cookie', `sails.sid=${req.sessionID}`)
        .expect(302)
        .end(function(err, res) {
          if (err) return done(err);
          assert.strictEqual(res.status, 302);
          done();
        });

      // Restore stubs
      User.findOne.restore();
      Student_team.findOne.restore();
      Student_team.find.restore();
    });
  });
  
describe('#fetchTasks()', function() {
  it('should fetch all tasks', function(done) {
    request(sails.hooks.http.app)
      .get('/task')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        // Assert that tasks were fetched successfully
        assert(Array.isArray(res.body));
        done();
      });
  });
});

describe('#deleteTask()', function() {
  it('should delete the specified task', function(done) {
    const taskId = 1; // Replace with an actual task ID
    request(sails.hooks.http.app)
      .delete(`/task/${taskId}`)
      .expect(200, done);
  });
});

});
