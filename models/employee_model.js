const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;
const randomstring = require("randomstring")

const employeeSchema = mongoose.Schema({
    employee_id : {
        type: String,
        default: "",
        unique:true
    },
    first_name:{
        type:String,
        default :"",
        required:true
    },
    last_name: {
        type:String,
        default:""
    },
    gender:{
        type:String,
        enum:[
            "MALE", 
            "FEMALE"
        ],
        required:true
    },
    role:{
        type:String,
        enum:[
            'EMPLOYEE',
            'ADMIN',
            'SUPERADMIN'
        ],
        default:'EMPLOYEE'
    },
    date_of_joining: {
        type: String,
        required : true
    },
    phone_number:{
        type:String,
        unique:true,
        required:true,
        max:15,
    },
    isActive:{
        type:Boolean,
        default:false
    },
    email:{
        type:String,
        unique:true,
        default:null,
        required:true
    },
    password:{
      type:String,
      min:4,
      max:100
    }
},{ timestamps:true });

module.exports = mongoose.model('Employee', employeeSchema);
