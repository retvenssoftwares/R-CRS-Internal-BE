const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  Rateplan_Id: { type: String, required: false },
  Ratetype_Id: { type: String, required: false },
  Roomtype_Id: { type: String, required: false },
  baserate: { type: String, required: false },
  extradultrate: { type: String, required: false },
  extrachildrate: { type: String, required: false },
  number_adults: { type: String, required: false },
  number_children: { type: String, required: false },
  ExtraChild_Age: { type: String, required: false },
  Title: { type: String, required: false },
  First_Name: { type: String, required: false },
  Last_Name: { type: String, required: false },
  Gender: { type: String, required: false },
  SpecialRequest: { type: String, required: false },
});

const dataSchema = new mongoose.Schema({

 
    Room: [{
      type: roomSchema,
      required: false,
    }],
  
  check_in_date: { type: String, required: false },
  check_out_date: { type: String, required: false },
  Booking_Payment_Mode: { type: String, required: false },
  Email_Address: { type: String, required: false },
  Source_Id: { type: String },
  MobileNo: { type: String, required: false },
  Address: { type: String, required: false },
  State: { type: String, required: false },
  booking_id: {type: String, required: false, default: ''},
  ezee_reservation_no: {type: String, default: ''},
  Country: { type: String, required: false },
  City: { type: String, required: false },
  Zipcode: { type: String, required: false },
  Languagekey: { type: String, required: false },
  paymenttypeunkid: { type: String },
});

// Create a Mongoose model for your data
const DataModel = mongoose.model('ezee_booking', dataSchema);

module.exports = DataModel;
