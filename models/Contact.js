const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const ContactSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "users" },

  contactNo: { type: String, default: "" },
  contactType: { type: String, default: "" },
  companyName: { type: String, default: "" },
  nameSuffix: { type: String, default: "" },
  formOfAddress: { type: String, default: "" },
  title: { type: String, default: "" },
  lastName: { type: String, default: "" },
  firstName: { type: String, default: "" },
  address: { type: String, default: "" },
  postcode: { type: String, default: "" },
  city: { type: String, default: "" },
  country: { type: String, default: "" },
  email: { type: String, default: "" },
  email2: { type: String, default: "" },
  phone: { type: String, default: "" },
  phone2: { type: String, default: "" },
  mobile: { type: String, default: "" },
  fax: { type: String, default: "" },
  website: { type: String, default: "" },
  skype: { type: String, default: "" },
  contactPartner: { type: String, default: "" },
  owner: { type: String, default: "" },
  correspondenceType: { type: String, default: "" },
  language: { type: String, default: "" },
  remarks: { type: String, default: "" },
  category: { type: String, default: "" },
  sector: { type: String, default: "" },
  numberOfEmployees: { type: String, default: "" },
  commercialRegisterNo: { type: String, default: "" },
  vatNo: { type: String, default: "" },
  vatRegNo: { type: String, default: "" }
});

module.exports = Contact = mongoose.model("contact", ContactSchema);
