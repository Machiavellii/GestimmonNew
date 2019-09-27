const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/key");
const passport = require("passport");
var multer = require("multer");
const path = require("path");
var fs = require("fs");
// Load User model
const Profile = require("../models/profile");
const Ads = require("../models/ads");

router.get(
  "/userlist",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (req.user.admin === "admin") {
        // const users = await User.find({ admin: { $ne: "admin" } });
        // return res.status(200).json({ users: users });
        const users = await User.aggregate([
          {
            $match: { admin: { $ne: "admin" } }
          },
          {
            $lookup: {
              from: "profiles",
              localField: "_id",
              foreignField: "user_id",
              as: "profile"
            }
          }
        ]);
        return res.status(200).json({ users: users });
      } else {
        return res.status(400);
      }
    } catch (err) {
      console.log("get userlist err:", err);
    }
    return res.status(500);
  }
);

router.delete(
  "/user",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (req.user.admin === "admin") {
        const targetUserId = req.body.user_id;
        const profile = await Profile.findOne({ user_id: targetUserId });
        console.log("aaa", profile)
        if (profile.avatar) {
          const avatarPath = "./static" + profile.avatar;
          fs.unlink(avatarPath, err => {
            if (err) {
              console.log("avatar delete err:", err);
            } else {
              console.log("avatar deleted successfully", avatarPath);
            }
          });
        }
        await profile.deleteOne();
        await Ads.deleteOne({ user_id: targetUserId });
        await User.deleteOne({ _id: targetUserId });
        fs.rmdir("./static/" + targetUserId, err=>{
          if(err) console.log("del dir err", err)
        });
        return res.status(200).json();
      } else {
        return res.status(400).json();
      }
    } catch (err) {
      console.log("delete user err:", err);
    }
    return res.status(500).json();
  }
);

router.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (req.user.admin === "admin") {
        return res.status(200).json({ admin: true });
      } else {
        return res.status(400).json();
      }
    } catch (err) {
      console.log("get userlist err:", err);
    }
    return res.status(500).json();
  }
);

module.exports = router;
