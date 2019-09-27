const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const CompanyProfileSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'users'},
    
    companyName: {type: String, default: ""},
    legalForm: {type: String, default: ""},

    fullname: {type: String, default: ""},

    address: {type: String, default: ""},
    additionalAddress: {type: String, default: ""},
    zipcode: {type: String, default: ""},
    city: {type: String, default: ""},
    country: {type: String, default: ""},

    inboxName: {type: String, default: ""},
    inboxEmail: {type: String, default: ""},

    regNo: {type: String, default: ""},
    regDesc: {type: String, default: ""},

    email: {type: String, default: ""},
    mobile: {type: String, default: ""},
    phone: {type: String, default: ""},
    fax: {type: String, default: ""},
    website: {type: String, default: ""},
})

module.exports = CompanyProfile = mongoose.model("companyprofile", CompanyProfileSchema)