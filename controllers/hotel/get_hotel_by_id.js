const Hotel = require("../../models/hotel_model");

module.exports.get_hotel_by_id = (req, res) => {
  Hotel.findOne({ hotel_id: req.params.hotel_id }) // Use findOne instead of find
    .select('hotel_r_code hotel_name hotel_id hotel_logo hotel_cover_photo hotel_country hotel_images room_details')
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      if (!result) {
        // Handle the case where no hotel with the given ID was found
        return res.status(404).json({
          message: 'Hotel not found'
        });
      }

      // You can directly send the result object without wrapping it in an array
      res.status(200).json(result);
    });
}
