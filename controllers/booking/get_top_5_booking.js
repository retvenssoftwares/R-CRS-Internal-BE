const Booking = require('../../models/booking_model'); // Import the Mongoose model

exports.findTopFiveEmployees = async (req, res) => {
  try {
    const topEmployees = await Booking.aggregate([
      {
        $match: {
          booking_status: "ConfirmBooking", // Filter by confirmed bookings
        },
      },
    //   {
    //     $unwind: "$roomTypes", // Unwind the roomTypes array
    //   },
      {
        $group: {
          _id: "$employee_id", // Group by employee_id
          guest_first_name: { $first: "$guest_first_name" }, // Include guest's first name
          totalBookings: { $sum: 1 }, // Calculate the total number of bookings for each employee
        },
      },
      {
        $sort: {
          totalBookings: -1, // Sort in descending order by total bookings
        },
      },
      {
        $limit: 5, // Limit the result to the top 5 employees
      },
    ]);

    // Optionally, you can reshape the result to have a more meaningful structure
    const topEmployeesWithDetails = topEmployees.map((employee) => ({
      employee_id: employee._id,
      guest_first_name: employee.guest_first_name,
      totalBookings: employee.totalBookings,
    }));

    return res.status(200).json({ topEmployeesWithDetails });
  } catch (error) {
    console.error('Error finding top employees:', error);
    throw error;
  }
};
