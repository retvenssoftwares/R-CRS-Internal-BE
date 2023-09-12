const Hotel = require("../../models/hotel_model")


module.exports = async (req, res) => {
  Hotel.find()
   .select('hotel_r_code hotel_name hotel_id hotel_logo hotel_cover_photo hotel_country hotel_state hotel_city hotel_images hotel_address_line_1 hotel_address_line_2')
   .exec((err, result) => {
     if(err){
       return res.status(400).json({
         error:err
       });
     }
     const hotels = result.map(hotel => ({
         hotel_r_code: hotel.hotel_r_code,
         hotel_name: hotel.hotel_name,
         hotel_id: hotel.hotel_id,
         hotel_logo: hotel.hotel_logo,
         hotel_cover_photo: hotel.hotel_cover_photo,
         hotel_country: hotel.hotel_country,
         hotel_city :hotel.hotel_city,
         hotel_state : hotel.hotel_state,
         hotel_images: hotel.hotel_images,
         hotel_address_line_1: hotel.hotel_address_line_1,
         hotel_address_line_2: hotel.hotel_address_line_2
     }));
     res.status(200).json(hotels);
   });
}
