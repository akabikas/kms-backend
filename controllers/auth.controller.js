const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

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
      organisation: req.body.organisation,
      password: hasedPassword,
    });

    user
      .save()
      .then((user) => {
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

const loginUser = (req,res,next) => {
  var email = req.body.email
  var password = req.body.password

  User.findOne({email: email}).then(user => {
    if(user){
      bcrypt.compare(password, user.password, function(err, result) {
        if(err){
          res.status(500).json({
            error: err
          })
        } if(result){
          let token = jwt.sign({name: user.name}, 'Azo5sa@(s7@3ajd^&9&32', {expiresIn: '1h'})
          res.status(201).json({
            message: 'Login Successful',
            token,
            user
          })
        } else{
          res.status(400).json({
            message: 'Invalid password'
          })
        }
      })
    }else{
      res.status(404).json({
        message: 'We could not find this account.'
      })
    }
  })
}

const logoutUser = (req, res, next) => {
  res.cookie('token', '', { expires: new Date(0) });
  res.status(201).json({
    message: "Logout successful",
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
