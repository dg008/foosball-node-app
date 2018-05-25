var express = require('express');
var router = express.Router();
var winRatesCalculator = require('../services/winRatesCalculator');
var config = require('../config/config');

router.get('/', function(req, res) {
  res.render('winrates/enterParticipant', { title: 'View Win Rates for a Participant' });
});

router.post('/calculate', function(req, res) {
    var db = req.db;

    const { firstParticipant, secondParticipant } = req.body;

    if (!firstParticipant) {
        res.render('winrates/enterParticipant',
        {
            title: 'View Win Rates for a Participant',
            firstParticipant, secondParticipant,
            hasErrors: true,
            errorMsg: "You must enter the 1st Participant!"
        });
    }

    const collection = db.get(config.DB_COLLECTION_NAME);

    winRatesCalculator({firstParticipant, secondParticipant, collection})
        .then(({numGamesWith1stParticipant,
                    numGamesWonBy1stParticipant,
                    numGamesWith2ndParticipant,
                    numGamesWonBy1stParticipantAgainst2ndParticipant}) => {
            let overallWinRate = (numGamesWonBy1stParticipant/numGamesWith1stParticipant)*100;
            overallWinRate = isNaN(overallWinRate)
            ? NaN
            : overallWinRate.toFixed(2);
            const overallLossRate = (100 - overallWinRate).toFixed(2);
        
            let specificWinRate = (numGamesWonBy1stParticipantAgainst2ndParticipant/numGamesWith2ndParticipant)*100;
            specificWinRate = isNaN(specificWinRate)
            ? NaN
            : specificWinRate.toFixed(2);
            const specificLossRate = (100 - specificWinRate).toFixed(2);
        
            res.render('winrates/results',
            {
                title: 'Win Rates results',
                firstParticipant,
                secondParticipant,
                numGamesWith2ndParticipant,
                overallWinLossRate: isNaN(overallWinRate)
                    ? 'N/A (Participant may not be entered/found)'
                    : `${overallWinRate}% (WIN) / ${overallLossRate}% (LOSS)`,
                specificWinLossRate: isNaN(specificWinRate)
                    ? 'N/A (Participant may not be entered/found)'
                    : `${specificWinRate }% (WIN) / ${specificLossRate}% (LOSS)`,
            });
        })
});

module.exports = router;
