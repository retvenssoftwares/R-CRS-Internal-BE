const Booking = require("../../models/booking_model")


module.exports.get_booking_db = (req, res) => {
    const data = Booking.find()
   
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