const mongoose = require("mongoose");
// const {ObjectId} = mongoose.Schema;
const randomstring = require("randomstring") 

const reports_model = new mongoose.Schema({
    report_lead_id: {type: String, default: randomstring.generate(8)},
    hotel_id: {type: String, default: ''},
    hotel_name: {type: String, default: ''},
    facebook_leads: {type: Number, default: 0},
    instagram_leads: {type: Number, default: 0},
    pinterest_leads: {type: Number, default: 0},
    twitter_leads: {type: Number, default: 0},
    linkedin_leads: {type: Number, default: 0},
    timestamp: {type: String, default: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })},
    name: {type: String, default:''},
    email: {type: String, default: ''},
    phone: {type: String, default: ''},
    source: {type: String, default:''},
    form: {type: String, default: ''},
    channel: {type:String, default:''},
    stage: {type: String, default: ''},
    owner: {type: String, default: ''},
    labels: {type: String, default: ''}
})

module.exports = mongoose.model('lead_reports', reports_model)