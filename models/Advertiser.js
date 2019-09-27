const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const AdvertiserSchema = new Schema({
    // adsId: {type: Schema.Types.ObjectId, ref: 'ads'},
    fullname: {
        type: String,
        default: "",
    },
    phonenumber: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        default: "",
    },
    address:{
        type: String,
        default: "",
    },
    zipcode: {
        type: Number,
        default: "",
    },
    city: {
        type: String,
        default: "",
    },
    country:{
        type: String,
        default: "",
    },
    tel1: {
        type: String,
        default: "",
    },
    tel2: {
        type: String,
        default: "",
    },
    agency: {
        type: String,
        default: "",
    }
})

module.exports = Advertiser = mongoose.model("advertiser", AdvertiserSchema)