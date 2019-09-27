const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const PhotosSchema = new Schema({
    adsId: {type: Schema.Types.ObjectId, ref: 'ads'},
    photos: {
        type: Array,
    },
    videos: {
        type: Array,
    },
})

module.exports = Photos = mongoose.model("photos", PhotosSchema)