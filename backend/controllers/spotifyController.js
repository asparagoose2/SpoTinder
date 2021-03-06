const api = require("../modules/spotifyAPI");
const Match = require("../models/matchModel");
const matchEngine = require("../modules/matching");
const DB = require("../data/index");

callback = (req, res) => {
  const code = req.query.code || null;
  if (code) {
    const userId = req.query.state;
    api.authorizeSpotify(userId, code).then((user) => {
      api.buildUserProfile(user).then((newUser) => {
        DB.getUser(userId).then((user) => {
          if (user) {
            newUser.email = user.email;
            newUser.password = user.password;
            newUser.gender = user.gender;
            newUser.interestedIn = user.interestedIn;
          }
          DB.updateUser(userId, newUser);
          matchEngine.calculateMatches(newUser).then((matches) => {
            Match.insertMany(matches, (err, docs) => {
              if (err) {
                console.log(err);
              } else {
                console.log(`inserted ${docs.length} matches`);
              }
            });
            res.redirect("https://spotinder.netlify.app/");
          });
        });
      });
    });
  } else {
    console.log(`error: ${req.query}`);
    res.json({ status: false, message: "Error logging in to spotify" });
  }
};

login = (req, res) => {
  const userId = req.params.userId;
  const url = api.getAuthorizationUrl(userId);
  res.json({ status: true, data: url });
};

module.exports = {
  callback,
  login,
};
