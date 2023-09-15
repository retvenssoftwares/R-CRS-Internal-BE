const mongoose = require("mongoose");

const role = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },

  department: [{
    department_name:{type:String,default:"",require:true},
    role: {
      type: String,
      default: "",
      require: true,
    },
  }],
  First_name: {
    type: String,
    default: "",
  },
  Last_name: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    default: "",
  },
  
});

const roleData = new mongoose.model("User_Model", role);
module.exports = roleData;
