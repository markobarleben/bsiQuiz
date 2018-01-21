/**
 * BsiQuiz.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */


const uuidV1 = require('uuid/v1');

module.exports = {

  autoPK: false,

  attributes: {

    id: {
      type: 'string',
      primaryKey: true,
      required: true,
      defaultsTo: function () {
        return uuidV1();
      },
      unique: true,
      index: true,
      uuid: true
    },
    points: {
      type: 'integer',
      required: true,
    },
    user_name: {
      type: 'string',
      required: true
    },
    lastPage: {
      type:'string',
       defaultsTo: '0'
    }
  },


  checkUser: function (option, cb) {

    var user_name = option.user_id;
    var points = option.points

    BsiQuiz.find({
      id: user_name
    })
      .exec(function (err, user) {
        if (err) return cb(err);
        cb(null, user);
      })
  },

  createUser: function (option, cb) {

    var user_name = option.user_name;
    var points = option.points

    BsiQuiz.create({
      user_name: user_name,
      points: points
    }).exec(function (err, user) {
      if (err) return cb(err);
      return cb(null, user);
    })
  },

// save points
  saveUserRecord: function (option, cb) {
    BsiQuiz.find().exec(function (err, myRecords) {
      for (i in myRecords) {
        if (myRecords[i].id === option.user_id) {
          var getOneRecord = myRecords[i]
          getOneRecord.points += option.points
          getOneRecord.save(
            function (err, userUpdate) {
              if (err) {
                return cb(err);
              } else {
                console.log('User with Name ' + getOneRecord.user_name + ' now has Points: ' + getOneRecord.points);
                return cb(null, userUpdate)
              }
            });
        }
      }
    });
  },

// save last visited question page
  saveLastPage: function (option, cb) {
    BsiQuiz.find().exec(function (err, myRecords) {
      for (i in myRecords) {
        if (myRecords[i].id === option.user_id) {
          var getOneRecord = myRecords[i]
          getOneRecord.lastPage = option.lastPage
          getOneRecord.save(
            function (err, userUpdate) {
              if (err) {
                return cb(err);
              } else {
                console.log('User with Name ' + getOneRecord.user_name + ' now has Page ID: ' + getOneRecord.lastPage);
                return cb(null, userUpdate)
              }
            });
        }
      }
    });
  }

};
