const winRatesCalculator = ({firstParticipant, secondParticipant, collection}) => {
    let numGamesWith1stParticipant = 0, numGamesWonBy1stParticipant = 0,
        numGamesWith2ndParticipant = 0,
        numGamesWonBy1stParticipantAgainst2ndParticipant = 0;

        const calculatedResults = collection.find({}).each(function(matchResult) {
            console.log('in each');
            if (matchResult.participants.includes(firstParticipant)) {
                numGamesWith1stParticipant++;
                if (matchResult.participants.includes(secondParticipant)) {
                    numGamesWith2ndParticipant++;
                    if (matchResult.winners.includes(firstParticipant)) {
                        numGamesWonBy1stParticipantAgainst2ndParticipant++;
                    }
                }
                if (matchResult.winners.includes(firstParticipant)) {
                    numGamesWonBy1stParticipant++;
                }
            }
        }).then(() => {
            return {numGamesWith1stParticipant,
                numGamesWonBy1stParticipant,
                numGamesWith2ndParticipant,
                numGamesWonBy1stParticipantAgainst2ndParticipant}
        });
        return Promise.resolve(calculatedResults);
}

module.exports = winRatesCalculator;