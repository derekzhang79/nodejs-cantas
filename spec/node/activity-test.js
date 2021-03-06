
"use strict";

var assert = require("assert");
var Activity = require("../../models/activity");
var Board = require("../../models/board")
var User = require("../../models/user");
var dbinit = require('./dbinit');
var async = require('async');
var utils = require('./utils');

describe("Test Activity Model", function() {
  var user = null;
  var board = null;
  var activity = null;

  //stub data;
  user = new User({displayName: "test_user", email: "test_user@example.com"});

  board = new Board({ title: "Test board", creatorId: user.id });

  activity = new Activity({
    content: "User creates an activity for test",
    creatorId: user.id,
    boardId: board.id
  });

  beforeEach(function(done) {
    async.series([
      function(callback){
        user.save(function(err) {
          callback(err,user);
        });
      },
      function(callback) {
        board.save(function(err) {
          callback(err,board);
        });
      },
      function(callback){
        activity.save(function(err) {
          activity.save(function(err) {
            callback(err,activity);
          })
        });
      }
    ], function(err, results){
      if(err || !results) {
        throw Error("activity test:",err);
      }
      if(results.length) return done();
    });
  });

  afterEach(function(done) {
    utils.removeEachSeries([activity, board, user], done);
  });

  it("Create Activity", function(done) {
    activity.save(function(err, db_activity) {
      assert.strictEqual(err, null);
      assert.notEqual(db_activity, null);
      assert.strictEqual(db_activity.content, activity.content);
      assert.strictEqual(db_activity.creatorId, activity.creatorId);
      assert.strictEqual(db_activity.boardId, activity.boardId);
      done();
    });

  });
});

describe("Test access activities from board", function() {
  var user = null;
  var board = null;
  var testLengthOfActvities = 3;
  var activity1 = null, activity2 = null, activity3 = null;

  user = new User({displayName: "test_user", email: "test_user@example.com"});

  board = new Board({title: "Test board", creatorId: user.id});

  beforeEach(function(done) {
    async.series([
      function(callback){
      user.save(function(err) {
        callback(err,user);
      })
    },
    function(callback) {
      board.save(function(err){
        callback(err, board);
      });
    },
    function(callback) {
      activity1 = new Activity({
        content: "User creates an activity " + 1 + " for test",
        creatorId: user.id,
        boardId: board.id
      });

      activity1.save(function(err){
        callback(err, activity1);
      });
    },
    function(callback) {
      activity2 = new Activity({
        content: "User creates an activity " + 2 + " for test",
        creatorId: user.id,
        boardId: board.id
      });

      activity2.save(function(err){
        callback(err, activity2);
      });
    },
    function(callback) {
      activity3 = new Activity({
        content: "User creates an activity " + 3 + " for test",
        creatorId: user.id,
        boardId: board.id
      });

      activity3.save(function(err){
        callback(err, activity3);
      });
    }
    ],
      function(err, results) {
        if(err || !results) {
          throw Error("activity-test:",err);
        }
        if(results.length) return done();
      });
  });

  afterEach(function(done) {
    var objs = [activity1, activity2, activity3, board, user];
    utils.removeEachSeries(objs, done);
  });

  it("Test to get board's activities.", function(done) {
    assert.notEqual(board.getActivities, undefined,
      "A board object should have an instance method named getActivities to " +
      "get all activities that are associated with itself.")
    board.getActivities(function(err, activities) {
      assert.notEqual(activities, null, "Error when get board's activities. " + err);
      assert.equal(activities.length, 3, "No all activities are retrieved.");
    });
    done();
  });
})
