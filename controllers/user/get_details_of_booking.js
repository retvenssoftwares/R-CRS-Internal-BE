const booking = require("../../models/booking_model");

exports.get_booking = async (req, res) => {
  try {
    const data = await booking.findOne({ booking_id: req.params.booking_id });

    const guest_name = data.guest_first_name + " " + data.guest_last_name;

    const details = {
      booking_id: data.booking_id,
      made_by: data.made_by,
      hotel_name: data.hotel_name,
      guest_name: guest_name,
      room_nights: data.room_nights,
    };

    return res.status(200).json(details);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.confirm_booking = async (req, res) => {
  try {
    const cancelled_booking = await booking.find({booking_status: "CancelledBooking",});

    const confirmed_bookings = await booking.find({booking_status: "ConfirmBooking",});

    const failes_booking_data = await booking.find({ booking_status: "FailBooking" })
     
    const pending = await booking.find({ booking_status: "PendingBooking" })
      

    const totalFailedBookingPrice = failes_booking_data.reduce(
      (total, booking) => {
        return total + (parseFloat(booking.total_price) || 0); // Convert to float and handle any NaN values
      }, 0);

    const totalpendingPrice = pending.reduce((total, booking) => {
      return total + (parseFloat(booking.total_price) || 0);
    }, 0);

    const totalConfirmedBookingPrice = confirmed_bookings.reduce(
      (total, booking) => {
        return total + (parseFloat(booking.total_price) || 0);
      }, 0);

    const totalPriceSum = totalFailedBookingPrice + totalpendingPrice + totalConfirmedBookingPrice;

    const cancel_len = cancelled_booking.length;
    const confirm_len = confirmed_bookings.length;


    return res.status(200).json({
      Booking_count: confirm_len,
      Cancelled_bookings_count: cancel_len,
      total_revenue : totalPriceSum
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
