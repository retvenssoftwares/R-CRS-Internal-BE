const mogoose = require("mongoose")
const randomstring = require("randomstring")

const pause_call_details = new mogoose.Schema({
    pause_reason :{
        type :String,
        default:""
    },
    pause_time:{
        type :String,
        default:""
    }
  
})