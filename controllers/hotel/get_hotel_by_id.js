const Hotel = require("../../models/hotel_model");
const axios = require('axios');

module.exports.get_hotel_by_id = async (req, res) => {
  const check_in_date = req.params.check_in_date;
  const check_out_date = req.params.check_out_date;

  try {
    const data = await Hotel.findOne({ hotel_id: req.params.hotel_id })
      .select('hotel_r_code hotel_name hotel_id hotel_logo hotel_cover_photo hotel_country hotel_images room_details hotel_address_line_1 hotel_address_line_2 hotel_ezee_code hotel_ezee_auth_code hotel_description');

    if (!data) {
      return res.status(404).json({
        message: 'Hotel not found'
      });
    }

    const response = await axios.post(`https://live.ipms247.com/booking/reservation_api/listing.php?request_type=RoomList&HotelCode=${data.hotel_ezee_code}&APIKey=${data.hotel_ezee_auth_code}&check_in_date=${check_in_date}&check_out_date=${check_out_date}`);
    console.log(response.data)
    const extractedData = await response.data.map(({ Roomtype_Name, roomtypeunkid, min_ava_rooms }) => ({
      Roomtype_Name,
      roomtypeunkid,
      min_ava_rooms
    })
    );
console.log(extractedData)

    // Filter the room details based on the conditions
    const filteredRoomDetails = data.room_details.map(roomDetail => {
      const matchingRoom = extractedData.find(extractedRoom => extractedRoom.roomtypeunkid === roomDetail.room_type_id);

      if (matchingRoom && parseInt(matchingRoom.min_ava_rooms) > 0) {
        return roomDetail;
      }

      return null;
    }).filter(Boolean);

    res.status(200).json({
      hotel_r_code: data.hotel_r_code,
      hotel_name: data.hotel_name,
      hotel_id: data.hotel_id,
      hotel_logo: data.hotel_logo,
      hotel_cover_photo: data.hotel_cover_photo,
      hotel_country: data.hotel_country,
      hotel_images: data.hotel_images,
      room_details: filteredRoomDetails, // Include filtered room details in the response
      room_availability: extractedData,
      hotel_address_line_1: data.hotel_address_line_1,
      hotel_address_line_2: data.hotel_address_line_2,
      hotel_description: data.hotel_description
    });
  } catch (error) {
    // Handle errors, e.g., network errors or errors in the Axios request
    console.error(error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};
