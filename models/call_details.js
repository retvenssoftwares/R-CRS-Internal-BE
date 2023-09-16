const mongoose = require("mongoose");
const randomstring = require("randomstring");

const call = new mongoose.Schema({
  call_id: { type: String, default: randomstring.generate(10) },

  device_type: { type: String, default: "" },

  calls_details: [
    {
      guest_id: { type: String, default: "" },

      employee_id: { type: String, default: "" },

      call_starting_duration: { type: String, default: "" },
      call_ending_duration: { type: String, default: "" },
      type: { type: String, default: "" },
      dial_status: { type: String, defaut: "" },
      last_support_by: { type: String, default: "" },
    },
  ],
});

const data = new mongoose.model("calling_details", call);
module.exports = data;
