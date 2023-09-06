const Hotel = require("../../models/hotel_model")


module.exports.get_hotel_db = (req, res) => {
  Hotel.find()
   .select('hotel_r_code hotel_name')
   .exec((err, result) => {
     if(err){
       return res.status(400).json({
         error:err
       });
     }
     const hotels = result.map(hotel => ({
         hotel_r_code: hotel.hotel_r_code,
         hotel_name: hotel.hotel_name
     }));
     res.status(200).json(hotels);
   });
}
