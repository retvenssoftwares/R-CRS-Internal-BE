const Hotel = require("../../models/hotel_model");
const axios = require('axios');

module.exports.get_hotel_by_id = async (req, res) => {
  const check_in_date = req.body.check_in_date;
  const check_out_date = req.body.check_out_date;

  try {
    const data = await Hotel.findOne({ hotel_id: req.params.hotel_id })
      .select('hotel_r_code hotel_name hotel_id hotel_logo hotel_cover_photo hotel_country hotel_images room_details hotel_address_line_1 hotel_address_line_2 hotel_ezee_code hotel_ezee_auth_code');

    if (!data) {
      return res.status(404).json({
        message: 'Hotel not found'
      });
    }

    const response = await axios.post(`https://live.ipms247.com/booking/reservation_api/listing.php?request_type=RoomList&HotelCode=${data.hotel_ezee_code}&APIKey=${data.hotel_ezee_auth_code}&check_in_date=${check_in_date}&check_out_date=${check_out_date}`);

    //const { min_ava_rooms } = response.data;
    console.log(response.data.min_ava_rooms)

    res.status(200).json({
      hotel_r_code: data.hotel_r_code,
      hotel_name: data.hotel_name,
      hotel_id: data.hotel_id,
      hotel_logo: data.hotel_logo,
      hotel_cover_photo: data.hotel_cover_photo,
      hotel_country: data.hotel_country,
      hotel_images: data.hotel_images,
      room_details: data.room_details,
      hotel_address_line_1: data.hotel_address_line_1,
      hotel_address_line_2: data.hotel_address_line_2,
      //min_ava_rooms: min_ava_rooms, // Include min_ava_rooms in the response
    });
  } catch (error) {
    // Handle errors, e.g., network errors or errors in the Axios request
    console.error(error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};
