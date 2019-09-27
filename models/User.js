const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phonenumber: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        required: true,
    },
    language: {
        type: Number,
        default: "0", //0:english, 1:french
    },
    date: {
        type: String,
        default: Date.now
    },
    resetPasswordToken: {
        type: String,
        default: "",
    },
    resetPasswordExpires: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        default: "", // user, agency, admin, boss
    }
})

module.exports = User = mongoose.model("users", UserSchema)