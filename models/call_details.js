const mongoose = require("mongoose")
const randomstring = require("randomstring")

const call = new mongoose.Schema({
    guest_id : {type:String , default:""},

    device_type :{type:String , default:""},
    
    calls_details : [
        {
           callId : {type:String , default:randomstring.generate()} ,
           guest : {
             guest_name :  {type:String, default:""},
             guest_mobile_number : {type:String , default:""} 
           
          },

           agent : {
             name :  {type:String, default:""},
             profilePicUrl : {type:String , default:""}
          },

           call_starting_duration:{type:String , default:""},
           call_ending_duration :{type:String ,default:""}, 
           Status :  {type:String , default:""} 
          
        },
        
      ]
    
})

const data = new mongoose.model("calling_details",call)
module.exports = data