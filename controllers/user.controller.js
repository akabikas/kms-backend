const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const { sendEmail } = require("../services/email.service");

const registerUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, function (err, hasedPassword) {
    if (err) {
      res.json({
        error: err,
      });
    }
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      biography: req.body.biography,
      organisation: req.body.organisation,
      password: hasedPassword,
    });

    if (req.file) {
      user.profilePicture = req.file.path;
    } else {
      res.status(400).json({
        message: "An error occoured!",
      });
      return;
    }

    user
      .save()
      .then((user) => {
        if (req.body.sendEmail === "on") {
          const emailData = {
            toEmail: req.body.email,
            subject: "H&K - Account created successfully",
            text: "We've created your account please use these credentials to access your account:",
            html:  `<p>We've created your account please use these credentials to access your account at <a href='http://localhost:3001'>H&K - Knowledge management system</a>:</p><br><p>${req.body.email} : ${req.body.password}</p>`
          }
          sendEmail(emailData);
        }
        res.json({
          message: "User added successfully!",
        });
      })
      .catch((error) => {
        res.json({
          message: "An error occoured!",
        });
      });
  });
};

const loginUser = (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({ email: email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          res.status(500).json({
            error: err,
          });
        }
        if (result) {
          let token = jwt.sign({ name: user.name }, "Azo5sa@(s7@3ajd^&9&32", {
            expiresIn: "24h",
          });
          res.status(201).json({
            message: "Login Successful",
            token,
            user,
          });
        } else {
          res.status(400).json({
            message: "Invalid password",
          });
        }
      });
    } else {
      res.status(404).json({
        message: "We could not find this account.",
      });
    }
  });
};

const getAllUsers = (req, res, next) => {
  if (req.body && req.body.user.role === "admin") {
    User.find()
      .sort({ createdAt: -1 })
      .exec()
      .then((users) => {
        res.status(200).json({
          users: users,
        });
      })
      .catch((error) => {
        res.status(500).json({
          error: error.message,
        });
      });
  } else {
    res.status(403).json({
      message: "Authorization error",
    });
  }
};

const logoutUser = (req, res, next) => {
  res.cookie("token", "", { expires: new Date(0) });
  res.status(201).json({
    message: "Logout successful",
  });
};

const deleteUser = (req, res, next) => {
  User.findByIdAndDelete(req.body.userID)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        error: error.message || "Internal Server Error",
      });
    });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  deleteUser,
};
