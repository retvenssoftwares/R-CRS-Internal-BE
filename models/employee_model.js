const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const randomstring = require("randomstring");

const employeeSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      default: "",
    },
    employee_id: {
      type: String,
      default: "",
    },
    agent_id: {
      type: String,
      default: "",
      
    },
    first_name: {
      type: String,
      default: "",
      required: false,
    },
    last_name: {
      type: String,
      default: "",
    },
    joining_date: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      required: false,
      default: "",
    },
    department: [
      {
        department_name: { type: String, default: "", require: true },
        role: {
          type: String,
          default: "",
          require: true,
        },
      },
    ],

    mobile_number: {
      type: String,
      unique: false,
      required: false,
      max: 15,
    },

    email: {
      type: String,
      unique: false,
      default: "",
      required: false,
    },
    password: {
      type: String,
      min: 4,
      max: 100,
    },
    designation: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
