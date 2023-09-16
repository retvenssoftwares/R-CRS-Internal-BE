const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;
const randomstring = require("randomstring")

const employeeSchema = mongoose.Schema({
    userName :{
        type:String,
        unique:true,
        default:""
    },
    employee_id : {
        type: String,
        default: randomstring.generate(10),
        //unique:true
    },
    first_name:{
        type:String,
        default :"",
        required:false
    },
    last_name: {
        type:String,
        default:""
    },
    gender:{
        type:String,
        required:false,
        default:""
    },
    department: [{
        department_name:{type:String,default:"",require:true},
        role: {
          type: String,
          default: "",
          require: true,
        },
      }],
    // date_of_joining: {
    //     type: String,
    //     required : true
    // },
    phone_number:{
        type:String,
        unique:false,
        required:false,
        max:15,
    },
    // isActive:{
    //     type:Boolean,
    //     default:false
    // },
    email:{
        type:String,
        unique:false,
        default:"",
        required:false
    },
    password:{
      type:String,
      min:4,
      max:100
    },
   
},{ timestamps:true });

module.exports = mongoose.model('Employee', employeeSchema);
