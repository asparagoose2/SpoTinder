const User = require("../models/userModel");
const DB = require("../data/index");

const getAllUsers = (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      console.log(err);
      res.json({ status: false, message: err });
    } else {
      res.json({ status: true, data: users });
    }
  });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId, (err, user) => {
    if (err) {
      res.json({ status: false, message: err });
    } else {
      if (user) {
        res.json({ status: true, data: user });
      } else {
        res.json({ status: false, message: "User not found" });
      }
    }
  });
};

const createUser = (req, res) => {
  const newUser = new User(req.body);
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      res.json({ status: false, message: err });
    } else {
      if (user) {
        res.json({ status: false, message: "User already exists" });
      } else {
        newUser.save((err, user) => {
          if (err) {
            res.json({ status: false, message: err });
          } else {
            res.json({ status: true, data: user });
          }
        });
      }
    }
  });
};

const updateUser = (req, res) => {
  const userRole = Role.findOne({ name: req.body.role.toLowerCase() });
  console.log(`userRole: ${req.body.role}`);
  console.log({...req.body, role: userRole});
  User.findByIdAndUpdate(req.params.userId, {...req.body, role: userRole}, (err, user) => {
    if (err) {
      res.json({ status: false, message: err });
    } else {
      res.json({ status: true, data: user });
    }
  });
};

const deleteUser = (req, res) => {
  User.findByIdAndRemove(req.params.userId, (err, user) => {
    if (err) {
      res.json({ status: false, message: err });
    } else {
      res.json({ status: true, data: user });
    }
  });
};


module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
