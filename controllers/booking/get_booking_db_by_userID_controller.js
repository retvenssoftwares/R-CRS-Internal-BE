const Booking = require("../../models/booking_model")


module.exports.get_booking_db_by_userID = (req, res) => {

    const madeby = req.query.madeby;

    Booking.findOne({"made_by": madeby})
     .exec((err, result) => {
       if(err){
         return res.status(400).json({
           error:err
         })
       }
       res.status(200).json({
          booking: result
       })
     })
  }