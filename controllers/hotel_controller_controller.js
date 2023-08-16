const Hotel = require("../models/hotel_model")


module.exports.create_hotel =  async (req, res) => {
    console.log("request received")
    const { hotel_r_code,
            hotel_auth_code,
            hotel_ezee_code,
            hotel_name
          } = req.body;
  
          
       if(!hotel_r_code){
         return res.status(400).json({
           error: "Retvens hotel code is required"
         })
       }
  
       if(!hotel_auth_code){
         return res.status(400).json({
           error: "Hotel Ezee Auth Code is required"
         })
       }
  
       if(!hotel_ezee_code){
         return res.status(400).json({
           error: "Hotel Ezee Code is required"
         })
       }
       if(!hotel_name){
         return res.status(400).json({
           error: "Hotel Ezee Code is required"
         })
       }
       
       const hotel = new Hotel();
       hotel.hotel_r_code = hotel_r_code
       hotel.hotel_auth_code = hotel_auth_code
       hotel.hotel_ezee_code = hotel_ezee_code
       hotel.hotel_name = hotel_name
  
        await hotel.save((err, result) => {
             if (err) {
                 return res.status(400).json({
                     error: err
                 });
             }
  
             res.status(200).json({
               message:"New Hotel successfully added",
               booking: result
             })
         })
  }