const data = require("../../models/call_details");
const guest_details = require("../../models/booking_model");
const employee = require('../../models/employee_model')

module.exports.post_call_details = async (req, res) => {
  const add = new data({
    device_type: req.body.device_type,
    calls_details: req.body.calls_details,
  });

  try {
    const guest_call = await data.findOne({
      "calls_details.guest_id": add.calls_details[0].guest_id,
    });

    if (guest_call) {
      // If a guest_call record exists, push 'add' data into calls_details array
      guest_call.calls_details.unshift(add.calls_details[0]);
      await guest_call.save();
      return res.status(200).json({ guest_call, token: "Data added to existing record successfully" });
    } else {
      const adddata = await add.save();
      const user = await guest_details.findOne({
        guest_id: adddata.calls_details[0].guest_id,
      });

      if (!user) {
        return res.status(404).json({ msg: "Guest not found" });
      }

      user.calls_details.unshift({ call_id: adddata.call_id });
      await user.save();
      return res.status(200).json({ adddata, token: "New data record added successfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};




module.exports.get_call_details = async (req, res) => {
  const type_of_call = req.params.type_of_call;
  const { guest_id, employee_id } = req.body;

  const get_call = await data.find({
    calls_details: {
      $elemMatch: { type: type_of_call },
    },
  });

  

  
  const get_guest_detals = await guest_details.findOne({ guest_id: guest_id });
  const employee_data = await employee.findOne({ employee_id: employee_id });

  if (!get_guest_detals || !employee_data) {
    return res.status(500).json({ msg: "enter valid employee or guest_id" });
  }

  if (get_call.length === 0) {
    return res.status(500).json({ msg: "No data found" });
  }

  if (!get_call) {
    return res.status(500).json({ msg: "Invalid type" });
  }

  const details = {
    guest_first_name: get_guest_detals.guest_first_name,
    guest_last_name: get_guest_detals.guest_last_name,
    guest_location: get_guest_detals.guest_location,
    caller_type: get_guest_detals.caller_type,
    callback_date_time: get_guest_detals.callback_date_time,
    salutation: get_guest_detals.salutation,
    remark: get_guest_detals.remark,
    hotel_name: get_guest_detals.hotel_name,
    purpose_of_travel: get_guest_detals.purpose_of_travel,
    employee_first_name: employee_data.first_name,
    employee_last_name: employee_data.last_name,
    department: employee_data.department,
    call_details: get_call,
  };
  return res.status(200).json({ details });
};
