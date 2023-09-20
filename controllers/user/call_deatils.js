const data = require("../../models/call_details");
const guest_details = require("../../models/booking_model");
const employee = require("../../models/employee_model");
const randomstring = require("randomstring");

module.exports.post_call_details = async (req, res) => {
  const add = new data({
    call_id: randomstring.generate(10),
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
      return res
        .status(200)
        .json({
          guest_call,
          token: "Data added to existing record successfully",
        });
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
      return res
        .status(200)
        .json({ adddata, token: "New data record added successfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

// type of call by guest_id and employee_Id
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
    //guest_mobile_number : get_guest_detals.guest_mobile_number,
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

// Import the Mongoose model

//const guest_details = require('../../models/guest_details_model'); // Import the Mongoose model
module.exports.getCallDetails_by_guest_mobile_number = async (req, res) => {
  try {
    const { guest_mobile, callDate, hotelName, disposition } = req.params;

    // Find the guest based on the provided parameter(s)
    const guest = await guest_details.findOne({
      guest_mobile_number: guest_mobile,
    });

    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    const guest_id = guest.guest_id;

    // Find all records where the guest_id matches
    const details = await data.findOne({ "calls_details.guest_id": guest_id });

    if (!details || details.length === 0) {
      return res.status(404).json({ message: "Call details not found" });
    }

    const matchingCallDetails = details.calls_details;
    
    return res.status(200).json({ matchingCallDetails });


  } catch (error) {
    console.error("Error fetching call details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


// get by date call details 

module.exports.get_details_by_date = async (req, res) => {
  try {
    const callDate = req.params.date;

    // Find all records in the data collection
    const records = await data.find();

    if (!records || records.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }

    // Initialize an array to store matching call details
    const matchingCallDetails = [];

    // Iterate through each record and filter call details by call_date
    records.forEach((record) => {
      const filteredCallDetails = record.calls_details.filter(
        (callDetail) => callDetail.call_date === callDate
      );

      // If filtered call details are found, concatenate them to matchingCallDetails
      if (filteredCallDetails.length > 0) {
        matchingCallDetails.push(...filteredCallDetails);
      }
    });

    if (matchingCallDetails.length === 0) {
      return res.status(404).json({ message: "No matching call details found" });
    }

    return res.status(200).json({ matchingCallDetails });
  } catch (error) {
    console.error("Error fetching call details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


//get by hotel
module.exports.get_details_by_hotel_name = async (req, res) => {
  try {
    const hotelName = req.params.hotel_name;

    // Find all records in the data collection
    const records = await data.find();

    if (!records || records.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }

    // Initialize an array to store matching call details
    const matchingCallDetails = [];

    // Iterate through each record and filter call details by hotel_name
    records.forEach((record) => {
      const filteredCallDetails = record.calls_details.filter(
        (callDetail) => callDetail.hotel_name === hotelName
      );

      // If filtered call details are found, concatenate them to matchingCallDetails
      if (filteredCallDetails.length > 0) {
        matchingCallDetails.push(...filteredCallDetails);
      }
    });

    if (matchingCallDetails.length === 0) {
      return res.status(404).json({ message: "No matching call details found" });
    }

    return res.status(200).json({ matchingCallDetails });
  } catch (error) {
    console.error("Error fetching call details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// get by disposition
module.exports.get_details_by_disposition = async (req, res) => {
  try {
    const disposition = req.params.disposition;

    // Find all records in the data collection
    const records = await data.find();

    if (!records || records.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }

    // Initialize an array to store matching call details
    const matchingCallDetails = [];

    // Iterate through each record and filter call details by disposition
    records.forEach((record) => {
      const filteredCallDetails = record.calls_details.filter(
        (callDetail) => callDetail.disposition === disposition
      );

      // If filtered call details are found, concatenate them to matchingCallDetails
      if (filteredCallDetails.length > 0) {
        matchingCallDetails.push(...filteredCallDetails);
      }
    });

    if (matchingCallDetails.length === 0) {
      return res.status(404).json({ message: "No matching call details found" });
    }

    return res.status(200).json({ matchingCallDetails });
  } catch (error) {
    console.error("Error fetching call details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



