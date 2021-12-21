const User = require('../models/userModel');

module.exports = {
    login: function(req, res) {
        User.findOne({ email: req.body.email }, (err, user) => {
            if (err) {
                res.json({ status: false, message: err });
            } else {
                if (user) {
                    if (user.password === req.body.password) {
                        res.json({ status: true, data: user });
                    } else {
                        res.json({ status: false, message: "Wrong password" });
                    }
                } else {
                    res.json({ status: false, message: "User not found" });
                }
            }
        });
    }
}