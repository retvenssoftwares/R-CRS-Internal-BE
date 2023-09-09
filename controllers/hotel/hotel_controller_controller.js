require('dotenv').config()
const AWS = require('aws-sdk');
const s3 = require('../../utils/url');
const multer = require('multer');
const upload = multer();
const Hotel = require("../../models/hotel_model")
const randomstring = require('randomstring');

const upload_hotel = async (req, res) => {

    try {
      
      // console.log("request received")
      const { hotel_r_code,
        hotel_auth_code,
        hotel_ezee_code,
        hotel_description,
        hotel_name,
        hotel_address_line_1,
        hotel_address_line_2,
        pms_type,
        hotel_city,
        hotel_state,
        hotel_country,
      } = req.body;


      // if (!hotel_r_code) {
      //   return res.status(400).json({
      //     error: "Retvens hotel code is required"
      //   })
      // }

      // if (!hotel_auth_code) {
      //   return res.status(400).json({
      //     error: "Hotel Ezee Auth Code is required"
      //   })
      // }

      // if (!hotel_ezee_code) {
      //   return res.status(400).json({
      //     error: "Hotel Ezee Code is required"
      //   })
      // }
      // if (!hotel_name) {
      //   return res.status(400).json({
      //     error: "Hotel Name is required"
      //   })
      // }

     
      const add_hotel = new Hotel({
        hotel_r_code: hotel_r_code,
        hotel_auth_code: hotel_auth_code,
        hotel_ezee_code: hotel_ezee_code,
        hotel_description: hotel_description,
        hotel_address_line_1,
        hotel_address_line_2,
        hotel_city,
        pms_type,
        hotel_state,
        hotel_country,
        hotel_name: hotel_name
      });

      // Save the record
      const added_hotel = await add_hotel.save();


      await add_hotel.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: err
          });
        }

        res.status(200).json({
          message: "New Hotel successfully added",
          hotel_id: added_hotel.hotel_id
        })
      })
    }
    catch (err) {
      console.log(err)
      return res.status(500).json({ message: "Internal Server Error" })
    }
}


module.exports = upload_hotel