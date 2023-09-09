const AWS = require('aws-sdk');
const s3 = require('../../utils/url');
const multer = require('multer');
const upload = multer();
const Hotel = require("../../models/hotel_model")
const randomstring = require('randomstring');

const upload_room_details = async (req, res) => {

  upload.fields([
    { name: 'room_type_images', maxCount: 4 }    
  ])(req, res, async (err) => {
    try {
      
      // Upload hotelImages to DigitalOcean Spaces
      let room_details = [];
      let room_type_pictures = []
      if (req.files['room_type_images']) {
        for (const room_type_image of req.files['room_type_images']) {
          const room_image_id = randomstring.generate(10); // Generate a unique ID
          // const display_status = '1'; // Set the display status
          const room_type_image_params = {
            Bucket: 'rown-space-bucket/room-type-images',
            Key: room_type_image.originalname,
            Body: room_type_image.buffer,
            ContentType: room_type_image.mimetype,
            ACL: 'public-read'
          };
          await s3.upload(room_type_image_params).promise();
          const room_type_url = `https://rown-space-bucket.nyc3.digitaloceanspaces.com/room-type-images/${room_type_image.originalname}`;
          // Create an object with image details
          const imageDetails = {
            picture_id: room_image_id,
            picture: room_type_url,
            display_status: '1'
          };
          room_type_pictures.push(imageDetails);
        };

      }
      // console.log(hotel_images)

      const hotel_id = req.params.hotel_id
      // console.log("request received")
      const { hotel_r_code,
        hotel_auth_code,
        hotel_ezee_code,
        hotel_description,
        hotel_name,
        room_type_id,
        room_type_name
      } = req.body;

      const findHotel = await Hotel.findOne({hotel_id: hotel_id}) 
      if (!findHotel) {
        return res.status(404).json({ error: 'Hotel not found' });
      }

    //   if (!hotel_r_code) {
    //     return res.status(400).json({
    //       error: "Retvens hotel code is required"
    //     })
    //   }

    //   if (!hotel_auth_code) {
    //     return res.status(400).json({
    //       error: "Hotel Ezee Auth Code is required"
    //     })
    //   }

    //   if (!hotel_ezee_code) {
    //     return res.status(400).json({
    //       error: "Hotel Ezee Code is required"
    //     })
    //   }
    //   if (!hotel_name) {
    //     return res.status(400).json({
    //       error: "Hotel Ezee Code is required"
    //     })
    //   }

      // const hotel = new Hotel();
      // hotel.hotel_r_code = hotel_r_code
      // hotel.hotel_auth_code = hotel_auth_code
      // hotel.hotel_ezee_code = hotel_ezee_code
      // hotel.hotel_name = hotel_name

      // Create and save the property record
      const room_id_and_name = {
        room_type_id,
        room_type_name,
        room_type_pictures: room_type_pictures
      }
      // Find the room_details array and append room_id_and_name to it
      findHotel.room_details.push(room_id_and_name);

      // Save the updated hotel record
      await findHotel.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: err
          });
        }

        res.status(200).json({
          message: "Room type successfully added",
          booking: result
        })
      })
    }
    catch (err) {
      console.log(err)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  })
}

module.exports = upload_room_details