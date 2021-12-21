const db = require('../data/index.js');


async function calculateMatches(theUser) {
    console.log(`calculateMatches, user id: ${theUser.id}`);
    const userTopArtists = theUser.topArtists;
    const userTopTracks = theUser.topTracks;
    const userMatches = [];
    const users = await db.getUsers();
    console.log(`users length: ${users.length}`);
    users.forEach(async (user) => {
        console.log(`user id: ${user._id}`);
        if (theUser.id == user._id) {
            return;
        }
        if((user.interestedIn.includes(theUser.gender) && theUser.interestedIn.includes(user.gender))) {
            const matchScore = calculateMatchScore(user, userTopArtists, userTopTracks);
            if (matchScore.score > 0.5) {
                userMatches.push({firstUser:theUser.id, secondUser: user._id,score:matchScore.score, mutualArtists:matchScore.mutualArtists, mutualTracks:matchScore.mutualTracks});
            }
        }
    });
    userMatches.sort((a,b) => b.score - a.score);
    return userMatches;

}

function calculateMatchScore(user, userTopArtists, userTopTracks) {
    const userTopArtistsNames = user.topArtists;
    const userTopTracksNames = user.topTracks;
    let matchScore = 0;
    const artistsMatch = userTopArtists.filter(artist => userTopArtistsNames.includes(artist));
    const tracksMatch = userTopTracks.filter(track => userTopTracksNames.includes(track));
    matchScore = ((artistsMatch.length + tracksMatch.length) / (userTopArtists.length + userTopTracks.length));
    return {
        score: matchScore,
        mutualArtists: artistsMatch,
        mutualTracks: tracksMatch      
    };
}


function getMatchScore(userId1, userId2) {
    user1 = db.getUser(userId1);
    user2 = db.getUser(userId2);
    if (user1 == null || user2 == null) {
        throw new Error('User not found');
    }
    let artistsMatch = user1.topArtists.filter(artist => user2.topArtists.includes(artist)).length;
    let tracksMatch = user1.topTracks.filter(track => user2.topTracks.includes(track)).length;
    return {
        score: ((artistsMatch + tracksMatch) / (user1.topArtists.length + user1.topTracks.length)) * 100,
        name1: user1.name,
        name2: user2.name
    };
}

module.exports = {
    getMatchScore,
    calculateMatches
};