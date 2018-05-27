var express = require('express');
var router = express.Router();
var winRatesCalculator = require('winrates-calculator');

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

    const collection = db.get(process.env.DB_COLLECTION_NAME);

    const matchResults = collection.find({});
    winRatesCalculator({firstParticipant, secondParticipant, matchResults})
        .then(({numGamesWith2ndParticipant,
                    overallWinRate,
                    overallLossRate,
                    specificWinRate,
                    specificLossRate,}) => {
                    
            res.render('winrates/results',
            {
                title: 'Win Rates results',
                firstParticipant,
                secondParticipant,
                numGamesWith2ndParticipant,
                overallWinLossRate: isNaN(overallWinRate)
                    ? 'N/A (Participant may not be entered/found)'
                    : `${overallWinRate.toFixed(2)}% (WIN) / ${overallLossRate.toFixed(2)}% (LOSS)`,
                specificWinLossRate: isNaN(specificWinRate)
                    ? 'N/A (Participant may not be entered/found)'
                    : `${specificWinRate.toFixed(2)}% (WIN) / ${specificLossRate.toFixed(2)}% (LOSS)`,
            });
        })
});

module.exports = router;
