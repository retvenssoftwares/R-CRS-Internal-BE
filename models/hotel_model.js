const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const hotelSchema = mongoose.Schema({
    hotel_id : {
        type: mongoose.Types.ObjectId,
        default: mongoose.Types.ObjectId,
        unique:true
    },
    hotel_r_code:{
        type:String,
        required:true
    },
    hotel_auth_code:{
        type:String,
        default:null
    },
    hotel_ezee_code:{
        type:String,
        default:null
    },
    hotel_name:{
        type:String,
        default:null
    }
},{ timestamps:true });

module.exports = mongoose.model('Hotel', hotelSchema);
