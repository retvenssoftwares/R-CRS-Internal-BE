const data = require("../../models/call_details");
const guest_details = require("../../models/booking_model");
const employee_details = require("../../models/employee_model");
const randomstring = require("randomstring");


module.exports.get_call_collection = async(req,res)=>{
  const details_of_calls = await data.find({})
  return res.status(200).json({details_of_calls})
}

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
      return res.status(200).json({
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


// get call_details of employee by type

module.exports.get_call_details = async (req, res) => {
  const type_of_call = req.params.type_of_call;
  const { employee_id } = req.body;

  try {
    const pipeline = [
      {
        $match: {
          'calls_details.employee_id': employee_id,
        },
      },
    ];

    const callsWithGuestDetails = await data.aggregate(pipeline);

    if (callsWithGuestDetails.length === 0) {
      return res.status(404).json({ msg: `No ${type_of_call} calls found` });
    }

    const groupedCalls = {}; // To group calls by type

    for (const callDetail of callsWithGuestDetails) {
      for (const call of callDetail.calls_details) {
        if (call.type === type_of_call) {
          const guestDetails = await guest_details.findOne({ guest_id: call.guest_id });
          const aget = await employee_details.findOne({employee_id : call.employee_id})
          
          // Create a new call object with guest_details if guestDetails is found
          if (guestDetails) {
            const agent_full_name = `${aget.first_name} ${aget.last_name}`;
            const guestInfo = {
              guest_id: call.guest_id,
              guest_first_name: guestDetails.guest_first_name,
              guest_last_name:guestDetails.guest_last_name,
              type : call.type,
              agent_id : aget.agent_id,
              agent_name :  agent_full_name,
              guest_mobile_number : guestDetails.guest_mobile_number,
              guest_location : guestDetails.guest_location,
              guest_last_name: guestDetails.guest_last_name,
              disposition : call.disposition
            };
            
            if (!groupedCalls[type_of_call]) {
              groupedCalls[type_of_call] = [];
            }
            
            if (!groupedCalls[type_of_call].find(item => item.guest_id === call.guest_id)) {
              groupedCalls[type_of_call].push({
                ...guestInfo,
                call_details: [],
              });
            }
            
            groupedCalls[type_of_call].forEach(item => {
              if (item.guest_id === call.guest_id) {
                item.call_details.push(call);
              }
            });
          }
        }
      }
    }

    // Convert the groupedCalls object into an array
    const responseArray = Object.entries(groupedCalls).map(([callType, callList]) => ({
      [callType]: callList,
    }));

    return res.status(200).json(responseArray);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};




//const guest_details = require('../../models/guest_details_model'); // Import the Mongoose model
module.exports.getCallDetails_by_guest_mobile_number = async (req, res) => {
  try {
    const { guest_mobile, date, hotelName, disposition } = req.params;
    const formattedDate = date.replace(/\//g, "-");

    // Create an object to store the filter criteria based on provided parameters
   

    const guest = await guest_details.findOne({
      guest_mobile_number:  guest_mobile,
    });
    //console.log(guest)

    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    const guest_id = guest.guest_id;

    //const call_date = guest_id.calls_details.call_date
   
    const details = await data.findOne({
      'calls_details.guest_id': guest_id,
      'calls_details.call_date': formattedDate,
      'calls_details.call_date': { $ne: '' }, // Exclude empty call_date
    });

  

    // Find all records where the guest_id matches and call_date matches (if provided)

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
      return res
        .status(404)
        .json({ message: "No matching call details found" });
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
      return res
        .status(404)
        .json({ message: "No matching call details found" });
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
      return res
        .status(404)
        .json({ message: "No matching call details found" });
    }

    return res.status(200).json({ matchingCallDetails });
  } catch (error) {
    console.error("Error fetching call details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
