const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const AdsSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId },
  advertiser_id: { type: Schema.Types.ObjectId },
  url: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  country: { type: String, default: '' },
  city: { type: String, default: '' },
  street: { type: String, default: '' },
  canton: { type: String, default: '' },
  zone: { type: String, default: '' },
  zipcode: { type: Number, default: 0 },
  type: { type: String, default: 'rent' },
  category: { type: String, default: '' },
  property: { type: String, default: '' },
  floor: { type: Number, default: 0 },
  room: { type: Number, default: 0 },
  surface: { type: Number, default: 0 },
  charge: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  netRent: { type: Number, default: 0 },
  currency: { type: String, default: 'CHF' },
  dateType: { type: Number, default: 0 }, //0-From Date, 1-Immediately, 2-On Request
  availableDate: { type: Date, default: '' },
  // extra: { type: String, default: "" },
  photoThumbs: { type: [String], default: [] },
  source: { type: Number, default: 0 },
  sourceName: { type: String, default: '' },

  visitedNum: { type: Number, default: 0 },

  // for person that will give tour of the property
  visit_name: { type: String, default: '' },
  visit_phone: { type: String, default: '' },
  visit_email: { type: String, default: '' },
  visit_remark: { type: String, default: '' },

  //Mandatary
  mand_name: { type: String, default: '' },
  mand_phone: { type: String, default: '' },
  mand_email: { type: String, default: '' },

  imgTitle: { type: String, default: '' },

  // For quorums  search option : title, zipcode, reference1, reference2, city
  ref: { type: [Number], default: [0, 0] }
});

module.exports = Ads = mongoose.model('ads', AdsSchema);
