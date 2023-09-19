const mongoose = require("mongoose");
const randomstring = require("randomstring");

const call = new mongoose.Schema({
  call_id: { type: String, default: randomstring.generate(10) },


  calls_details: [
    {
      guest_id: { type: String, default: "" },
      employee_id: { type: String, default: "" },
      employee_status :{type:String , default:""},
      call_date:{type:String , default:""},
      start_time: { type: String, default: "" },
      disposition :{type: String, default: ""},
      end_time: { type: String, default: "" },
      time_to_answer:{type: String, default: ""},
      talktime :{type: String, default: ""},
      type: { type: String, default: "" },
      dial_status: { type: String, defaut: "" },
      last_called:{ type: String, defaut: "" },
      last_support_by: { type: String, default: "" },
      hang_up_by:{type:String , default:""},
      guest_status :{type:String , default :""},
      comments : {type:String , default :""}
    },
  ],
});

const data = new mongoose.model("calling_details", call);
module.exports = data;
