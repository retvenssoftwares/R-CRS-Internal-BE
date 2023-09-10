const Booking = require('../../models/booking_model'); // Import the Mongoose model
const Hotel = require('../../models/hotel_model'); // Import the Mongoose model for hotels

module.exports = async (req, res) => {
  try {
    const topHotels = await Booking.aggregate([
      {
        $group: {
          _id: "$hotel_r_code", // Group by hotel_r_code
          totalBookings: { $sum: 1 }, // Calculate the total number of bookings for each hotel
        },
      },
      {
        $sort: {
          totalBookings: -1, // Sort in descending order by total bookings
        },
      },
      {
        $limit: 8, // Limit the result to the top 8 hotels
      },
    ]);

    // Optionally, you can reshape the result to have a more meaningful structure
    const topHotelsWithDetails = [];

    for (const hotel of topHotels) {
      const hotelDetails = await Hotel.findOne({ hotel_r_code: hotel._id });
      if (hotelDetails) {
        topHotelsWithDetails.push({
          hotel_r_code: hotel._id,
          hotel_name: hotelDetails.hotel_name,
          hotel_logo: hotelDetails.hotel_logo,
          hotel_cover_photo : hotelDetails.hotel_cover_photo,
          totalBookings: hotel.totalBookings,
        });
      }
    }

    return res.status(200).json({ topHotelsWithDetails });
  } catch (error) {
    console.error('Error finding top hotels:', error);
    throw error;
  }
};
