const Booking = require("../../models/booking_model");
const Employee = require("../../models/employee_model");

module.exports = async (req, res) => {
  try {
    const bookings = await Booking.find();
    const employeeIds = bookings.map((booking) => booking.employee_id);

    // Find employees based on employeeIds
    const employees = await Employee.find({ employee_id: { $in: employeeIds } });

    // Create a mapping of employee_id to employee
    const employeeMap = {};
    employees.forEach((employee) => {
      employeeMap[employee.employee_id] = employee;
    });
 console.log(employeeMap)
  

    // Map bookings to employees and include first_name and last_name
    const bookingsWithEmployee = bookings.map((booking) => {
      const employee = employeeMap[booking.employee_id] || null;
      return {
        ...booking.toObject(),
        employee: {
          first_name: employee ? employee.first_name : "Unknown",
          last_name: employee ? employee.last_name : "Unknown",
        },
      };
    });

    res.status(200).json({
      bookings: bookingsWithEmployee,
    });
  } catch (error) {
    console.error("Error fetching booking data:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
