const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const PropertySchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'users'},
    
    name: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zipcode: { type: String, default: "" },
    country: { type: String, default: "" },
    photo: { type: String, default: "" },
    propertyType: { type: String, default: "" },
    unitsCount: { type: String, default: "" },
    unitsIdentification: { type: String, default: "" },
    buildingAttributes: { type: [String], default: [] },
    morePhotos: { type: [String], default: []},
})

module.exports = Property = mongoose.model("property", PropertySchema)