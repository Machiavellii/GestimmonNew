const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const ExtraSchema = new Schema({
    // user_id: {type: Schema.Types.ObjectId, ref: 'users'},
    adsId: {
        type: Schema.Types.ObjectId,
        ref: 'ads'
    },
    extraList: {
        type: Array,
    },
})

module.exports = Extra = mongoose.model("extra", ExtraSchema)