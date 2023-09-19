const EmployeeModel = require('../../models/call_details'); // Import your Mongoose model
const employee_guest = require('../../models/booking_model')

module.exports = async (req, res) => {
  try {
    const employee_id = req.params.employee_id;
    
    // Use the aggregation framework to filter the documents
    const result = await EmployeeModel.aggregate([
      {
        $match: {
          'calls_details.employee_id': employee_id,
        },
      },
      {
        $project: {
          call_id: 1,
          device_type: 1,
          calls_details: {
            $filter: {
              input: '$calls_details',
              as: 'callDetail',
              cond: { $eq: ['$$callDetail.employee_id', employee_id] },
            },
          },
        },
      },
    ]);

    if (result && result.length > 0) {
      // If data is found, send it as a response
      res.json(result);
    } else {
      // If no data is found, send a 404 response
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports.get_guest_booking_by_role_emp_id = async (req, res) => {
  try {
    const { role, employee_id } = req.body;

    if (!role && !employee_id) {
      return res.status(500).json({ message: "Enter valid details" });
    }

    if (role === "Admin" || role === "admin") {
      const guest_data = await employee_guest.find({});
      guest_data.reverse(); // Reverse the order of the array

      return res.status(200).json({ guest_data });
    } else {
      if (employee_id) {
        const guest_info = await employee_guest.find({ employee_id: employee_id });
        guest_info.reverse(); // Reverse the order of the array

        return res.status(200).json({ guest_info });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
