const EmployeeModel = require("../../models/call_details"); // Import your Mongoose model
const employee_guest = require("../../models/booking_model");
const employee_model = require("../../models/employee_model");
const moment = require("moment");
const { format } = require("date-fns");

//get call details by employee_id
module.exports = async (req, res) => {
  try {
    const employee_id = req.params.employee_id;

    // Use the aggregation framework to filter the documents
    const result = await EmployeeModel.aggregate([
      {
        $match: {
          "calls_details.employee_id": employee_id,
        },
      },
      {
        $project: {
          call_id: 1,
          device_type: 1,
          calls_details: {
            $filter: {
              input: "$calls_details",
              as: "callDetail",
              cond: { $eq: ["$$callDetail.employee_id", employee_id] },
            },
          },
        },
      },
    ]);

    if (result && result.length > 0) {
      // If data is found, send it as a response
      res.status(200).json(result);
    } else {
      // If no data is found, send a 404 response
      res.status(200).json({ error: "Employee not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//get call of emp by date

// module.exports.get_all_calls = async (req, res) => {
//   try {
//     const { date, employeeId } = req.query;
//     console.log(date);

//     const formattedDate = date.replace(/\//g, "-");

//     // Query the database to find EmployeeModel objects with the specified employeeId
//     const employees = await EmployeeModel.find({
//       "calls_details.employee_id": employeeId,
//     });

//     if (!employees || employees.length === 0) {
//       return res.json({ totalCalls: 0 }); // No matching employees found
//     }

//     // Initialize a variable to count the total calls
//     let totalCalls = 0;

//     // Iterate through each employee's calls_details and count the matching calls
//     employees.forEach((employee) => {
//       const callsForDate = employee.calls_details.filter((call) => {
//         return call.call_date === formattedDate;
//       });

//       // Add the count of matching calls for this employee to the total count
//       totalCalls += callsForDate.length;
//     });

//     res.json({ totalCalls });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// all employee

module.exports.get_all_employee = async (req, res) => {
  if (req.query.role === "Admin") {
    const get_all_employee = await employee_model.find({});
    return res.status(200).json({ get_all_employee });
  } else {
    return res
      .status(500)
      .json({ message: "you are not authroized to see employee details" });
  }
};

// get_guest_by_role_and_employee_id
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
        const guest_info = await employee_guest.find({
          employee_id: employee_id,
        });
        guest_info.reverse(); // Reverse the order of the array

        return res.status(200).json({ guest_info });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//role wise call details

module.exports.get_call_by_role_emp_id = async (req, res) => {
  try {
    const { role, employee_id } = req.body;

    let call_data;

    if (role === "Admin" || role === "admin") {
      call_data = await EmployeeModel.find({});
      call_data.reverse();
      const inboundCalls = [];
      const outboundCalls = [];

      call_data.forEach((call) => {
        call.calls_details.forEach((callDetail) => {
          if (callDetail.type === "inbound") {
            inboundCalls.push(callDetail);
          } else if (callDetail.type === "outbound") {
            outboundCalls.push(callDetail);
          }
        });
      });

      return res.status(200).json({ inboundCalls, outboundCalls });
    } else if (employee_id) {
      call_data = await EmployeeModel.find({ 'calls_details.employee_id': employee_id });
      call_data.reverse();
      const allCalls = call_data.reduce((accumulator, currentValue) => {
        return accumulator.concat(currentValue.calls_details);
      }, []);

      const inboundCalls = allCalls.filter(callDetail => callDetail.type === "inbound");
      const outboundCalls = allCalls.filter(callDetail => callDetail.type === "outbound");

      return res.status(200).json({ inboundCalls, outboundCalls });
    } else {
      return res.status(400).json({ message: "Enter a valid role or employee_id" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


//call_histroy of admin and emmployee
module.exports.call_history = async (req, res) => {
  try {
    const { role, employee_id } = req.body;

    let call_data;

    if (role === "Admin" || role === "admin") {
      call_data = await EmployeeModel.find({});
      call_data.reverse();
      const inboundCalls = [];
      const outboundCalls = [];

      const processCalls = async () => {
        for (const call of call_data) {
          for (const callDetail of call.calls_details) {
            if (callDetail.type === "inbound") {
              const add = await employee_guest.findOne({
                guest_id: callDetail.guest_id,
              });
              if (add) {
                callDetail.guest_calls_details = {
                  start_time: callDetail.start_time,
                  end_time: callDetail.end_time,
                  call_time: callDetail.start_time,
                  call_type: callDetail.type,
                  disposition: callDetail.disposition,
                  remark: callDetail.remark,
                  guest_first_name: add.guest_first_name,
                  guest_last_name: add.guest_last_name,
                  caller_id: add.guest_mobile_number,
                };
              }
              inboundCalls.push({
                guest_calls_details: callDetail.guest_calls_details,
              });
            } else if (callDetail.type === "outbound") {
              const add = await employee_guest.findOne({
                guest_id: callDetail.guest_id,
              });
              if (add) {
                callDetail.guest_calls_details = {
                  start_time: callDetail.start_time,
                  end_time: callDetail.end_time,
                  call_time: callDetail.start_time,
                  call_type: callDetail.type,
                  disposition: callDetail.disposition,
                  remark: callDetail.remark,
                  guest_first_name: add.guest_first_name,
                  guest_last_name: add.guest_last_name,
                  caller_id: add.guest_mobile_number,
                };
              }
              outboundCalls.push({
                guest_detail: callDetail.guest_calls_details,
              });
            }
          }
        }
      };

      await processCalls();

      return res.status(200).json({ inboundCalls, outboundCalls });
    } else if (employee_id) {
      call_data = await EmployeeModel.find({
        "calls_details.employee_id": employee_id,
      });
      call_data.reverse();
      const inboundCalls = [];
      const outboundCalls = [];

      const processCalls = async () => {
        for (const call of call_data) {
          for (const callDetail of call.calls_details) {
            if (callDetail.type === "inbound") {
              if (callDetail.employee_id === employee_id) {
                const add = await employee_guest.findOne({
                  guest_id: callDetail.guest_id,
                });
                if (add) {
                  callDetail.guest_calls_details = {
                    start_time: callDetail.start_time,
                    end_time: callDetail.end_time,
                    call_time: callDetail.start_time,
                    call_type: callDetail.type,
                    disposition: callDetail.disposition,
                    remark: callDetail.remark,
                    guest_first_name: add.guest_first_name,
                    guest_last_name: add.guest_last_name,
                    caller_id: add.guest_mobile_number,
                  };
                }
                inboundCalls.push({
                  guest_calls_details: callDetail.guest_calls_details,
                });
              }
            } else if (callDetail.type === "outbound") {
              if (callDetail.employee_id === employee_id) {
                const add = await employee_guest.findOne({
                  guest_id: callDetail.guest_id,
                });
                if (add) {
                  callDetail.guest_calls_details = {
                    start_time: callDetail.start_time,
                    end_time: callDetail.end_time,
                    call_time: callDetail.start_time,
                    call_type: callDetail.type,
                    disposition: callDetail.disposition,
                    remark: callDetail.remark,
                    guest_first_name: add.guest_first_name,
                    guest_last_name: add.guest_last_name,
                    caller_id: add.guest_mobile_number,
                  };
                }
                outboundCalls.push({
                  guest_detail: callDetail.guest_calls_details,
                });
              }
            }
          }
        }
      };

      await processCalls();

      // const allCalls = call_data.reduce((accumulator, currentValue) => {
      //   return accumulator.concat(currentValue.calls_details);
      // }, []);

      // const inboundCalls = allCalls.filter(callDetail => callDetail.type === "inbound");
      // const outboundCalls = allCalls.filter(callDetail => callDetail.type === "outbound");

      return res.status(200).json({ inboundCalls, outboundCalls });
    } else {
      return res
        .status(400)
        .json({ message: "Enter a valid role or employee_id" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// get all type of call count by employee_id
module.exports.get_employee_calls = async (req, res) => {
  try {
    const employeeId = req.query.employeeId; // Assuming the employee ID is passed as a route parameter

    if (!employeeId) {
      return res.status(500).json({ error: "Not Found" });
    }

    let totalOutboundCalls = 0;
    let totalCalls = 0;
    let totalInboundCallsThisMonth = 0;

    const currentDate = new Date();
    const formattedCurrentDate = format(currentDate, "dd-MM-yyyy");

    // Get the start of the month
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const formattedStartOfMonth = format(startOfMonth, "dd-MM-yyyy");

    const allCalls = await EmployeeModel.find({});

    allCalls.forEach((call) => {
      call.calls_details.forEach((callDetail) => {
        if (callDetail.employee_id === employeeId) {
          if (callDetail.type === "inbound") {
            if (
              callDetail.call_date >= formattedStartOfMonth &&
              callDetail.call_date <= formattedCurrentDate
            ) {
              totalInboundCallsThisMonth++;
            }
          } else if (callDetail.type === "outbound") {
            totalOutboundCalls++;
          }

          totalCalls++;
        }
      });
    });

    return res.status(200).json({
      totalCalls,
      totalInboundCallsThisMonth,
      totalOutboundCalls,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// get all call in a week by employee_id
module.exports.total_calls_in_week_by_employee = async (req, res) => {
  try {
    const inputDate = req.query.inputDate;
    const momentInputDate = moment(inputDate, "DD-MM-YYYY");

    const employeeId = req.query.employeeId; // Assuming employeeId is passed as a query parameter

    const results = [];

    for (let i = 0; i < 7; i++) {
      const startDate = momentInputDate
        .clone()
        .subtract(i, "days")
        .startOf("day")
        .format("DD-MM-YYYY");
      const endDate = momentInputDate
        .clone()
        .subtract(i, "days")
        .endOf("day")
        .format("DD-MM-YYYY");

      const dispositionCounts = await EmployeeModel.aggregate([
        {
          $unwind: "$calls_details",
        },
        {
          $match: {
            "calls_details.call_date": {
              $gte: startDate,
              $lte: endDate,
            },
            "calls_details.employee_id": employeeId, // Filter by employee_id
          },
        },
        {
          $group: {
            _id: "$calls_details.disposition",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 1,
        },
      ]);

      const highestDisposition =
        dispositionCounts.length > 0
          ? {
              disposition: dispositionCounts[0]._id,
              count: dispositionCounts[0].count,
            }
          : { disposition: "", count: 0 };

      const callCount = await EmployeeModel.aggregate([
        {
          $unwind: "$calls_details",
        },
        {
          $match: {
            "calls_details.call_date": {
              $gte: startDate,
              $lte: endDate,
            },
            "calls_details.employee_id": employeeId, // Filter by employee_id
          },
        },
        {
          $count: "total",
        },
      ]);

      const totalRecords = callCount.length > 0 ? callCount[0].total : 0;

      results.push({ date: startDate, totalRecords, highestDisposition });
    }

    return res.status(200).json({ results });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// get call details of top 5 employee

module.exports.findTopFiveEmployees = async (req, res) => {
  try {
    const topEmployees = await EmployeeModel.aggregate([
      {
        $unwind: "$calls_details", // Unwind the calls_details array
      },
      {
        $group: {
          _id: "$calls_details.employee_id", // Group by employee_id
          totalCalls: { $sum: 1 }, // Calculate the total number of calls for each employee
        },
      },
      {
        $sort: {
          totalCalls: -1, // Sort in descending order by total calls
        },
      },
      {
        $limit: 5, // Limit the result to the top 5 employees
      },
    ]);

    // Optionally, you can reshape the result to have a more meaningful structure
    const topEmployeesWithDetails = await Promise.all(
      topEmployees.map(async (employee) => {
        // Call your other collection function here
        const additionalData = await employee_model.findOne({
          employee_id: employee._id,
        });

        // Construct the resulting object
        return {
          employee_id: employee._id,
          first_name: additionalData.first_name,
          totalCalls: employee.totalCalls,
          // Include additional data
        };
      })
    );

    return res.status(200).json({ topEmployeesWithDetails });
  } catch (error) {
    console.error("Error finding top employees:", error);
    throw error;
  }
};
