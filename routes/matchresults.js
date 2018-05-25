var express = require('express');
var router = express.Router();
var config = require('../config/config');

router.get('/add', function(req, res) {
  res.render('matchresults/add', { title: 'Add New Match Result', firstTeamSize: 1, secondTeamSize: 1 });
});

router.post('/add', function(req, res) {
  var db = req.db;

  const { firstTeamSize, secondTeamSize, participants, winners } = req.body;

  if (!firstTeamSize || !secondTeamSize || !participants || !winners) {
    res.render('matchresults/add',
    {
        title: 'Add New Match Result',
        firstTeamSize, secondTeamSize, participants, winners,
        hasErrors: true,
        errorMsg: "One or more fields are missing!"
    });
  }

  const collection = db.get(config.DB_COLLECTION_NAME);

  collection.insert({
      "firstTeamSize" : firstTeamSize,
      "secondTeamSize" : secondTeamSize,
      "participants": participants.split(',').map(p => p.trim()),
      "winners": winners.split(',').map(w => w.trim()),
      "matchDateTime": new Date().getTime(),
  }, function (err, doc) {
      if (err) {
          // If it failed, return error
          res.send("There was a problem adding the information to the database.");
      }
      else {
        res.render('success',
        {
            message: 'Match Result successfully saved!'
        });
      }
  });
});

module.exports = router;
