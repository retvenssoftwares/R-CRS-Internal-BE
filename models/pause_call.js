const mongoose = require("mongoose")
const randomstring = require("randomstring")

const pause_call_details = new mongoose.Schema({
    pause_reason :{
        type :String,
        default:""
    },
    pause_time:{
        type :String,
        default:""
    },
    resume_time:{
        type:String,
        default:""
    },
    employee_id:{
        type:String,
        default:""
    }
  
})

const call_pause =  mongoose.model("call_pause",pause_call_details )
module.exports = call_pause
