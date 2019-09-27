const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const ProfileSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'users'},
    
    // email: { type: String, default: "" },
    // fullname: { type: String, default: "" },
    // phonenumber: { type: String, default: "" },

    country: { type: String, default: "" },
    city: { type: String, default: "" },
    address: { type: String, default: "" },
    zipcode: { type: String, default: "" },

    avatarUrl: { type: String, default: "" },

})

module.exports = Profile = mongoose.model("profile", ProfileSchema)