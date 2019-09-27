const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/key");
const passport = require("passport");
const crypto = require("crypto");
// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
// Load User model
const User = require("../models/User");
const Profile = require("../models/profile")

const sendEmail = require("../service/mailer");
const msg = require("../template/ResetPassword");

router.post("/resetpassword", async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.body.token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (user) {
      res.status(200).json("user exist in db");
    } else {
      res.status(404).json("user doesn't exist in db");
    }
  } catch (err) {
    console.log("post resetpassword err:", err);
  }
  return res.status(500).json();
});
router.put("/resetpassword", async (req, res) => {
  try {
    const user = await User.findOne({ resetPasswordToken: req.body.token });
    if (user) {
      const newPassword = req.body.newPassword;
      if (newPassword.length < 6 || newPassword.length > 30)
        return res.status(404).json("invalid password");

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPassword, salt);
      user.password = hash;
      user.resetPasswordToken = "";
      user.resetPasswordExpires = "";
      await user.save();
      return res.status(200).json();
    } else {
      return res.status(404).json("user not found");
    }
  } catch (err) {
    console.log("put resetpassword err:", err);
  }
  return res.status(500).json();
});
router.post("/forgotpassword", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = crypto.randomBytes(20).toString("hex");
      console.log("token", token);
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 360000;
      const result = await user.save();
      sendEmail(
        req.body.email,
        "Link to Reset Password",
        msg.template1(keys.clientUrl + token)
      );
      return res.status(200).json();
    } else {
      return res.status(400).json();
    }
  } catch (err) {
    console.log("post forgotpassword err:", err);
  }
  return res.status(500).json();
});
router.get(
  "/language",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user._id });
      if (user) {
        return res.status(200).json({ language: user.language, user: user });
      }
    } catch (err) {
      console.log("get language err", err);
    }
    return res.status(500).json();
  }
);
router.post(
  "/language",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user._id });
      if (user) {
        user.language = req.body.language;
        await user.save();
        return res.status(200).json();
      }
    } catch (err) {
      console.log("set language err", err);
    }
    return res.status(500).json();
  }
);

router.get(
  "/info",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user._id });
      if (user) {
        const profile = await Profile.findOne({user_id: req.user._id})
        if(!profile)
          return res.status(200).json({user, avatar: ""});  
        return res.status(200).json({user, avatar:profile.avatar});
      }
      console.log("userinfo not found", err);
      return res.status(400).json();
    } catch (err) {
      console.log("get userinfo err", err);
      return res.status(500).json();
    }
  }
);

router.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    req.logout();
    // res.redirect("/");
    res.status(200).json();
  }
);

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      console.log("email already exist");
      return res
        .status(400)
        .json({ title: "Email", message: "Email already exists" });
    } else {
      const newUser = new User({
        fullname: req.body.fullname,
        // phonenumber: req.body.phonenumber,
        email: req.body.email,
        password: req.body.password,
        language: 0,
        role: req.body.role,
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            return;
          }
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              const payload = {
                id: user._id
                // name: user.name
              };
              // Sign token
              jwt.sign(
                payload,
                keys.secretOrKey,
                {
                  expiresIn: 31556926 // 1 year in seconds
                },
                (err, token) => {
                  if (err) return res.status(500).json();
                  token = "Bearer " + token;
                  return res.status(200).json({ user, token: token });
                }
              );
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// router.post("/logout", (req, res) => {

// })
// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res
        .status(400)
        .json({ title: "Email", message: "Email not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user._id
          // name: user.name
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            // sendEmail(
            //   "noronhacarlosheitor@gmail.com",
            //   "Welcome to Mamort",
            //   "You became a member of Mamort. we will send you an email for every 15days."
            // );

            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ title: "Password", message: "Password incorrect" });
      }
    });
  });
});


module.exports = router;
