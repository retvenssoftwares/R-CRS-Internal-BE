const AWS = require('aws-sdk');
const s3 = require('../../utils/url');
const multer = require('multer');
const upload = multer();
const Hotel = require("../../models/hotel_model")
const randomstring = require('randomstring');

const upload_room_details = async (req, res) => {

  upload.fields([
    { name: 'hotel_cover_photo', maxCount: 1 },
    { name: 'hotel_images', maxCount: 7 },
    { name: 'room_type_images', maxCount: 4 },
    { name: 'hotel_logo', maxCount: 1 }
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

      let hotel_images = [];
      if (req.files['hotel_images']) {
        for (const hotel_image of req.files['hotel_images']) {
          const hotel_image_id = randomstring.generate(10); // Generate a unique ID
          // const display_status = '1'; // Set the display status
          const hotel_image_params = {
            Bucket: 'rown-space-bucket/hotel_images',
            Key: hotel_image.originalname,
            Body: hotel_image.buffer,
            ContentType: hotel_image.mimetype,
            ACL: 'public-read'
          };
          await s3.upload(hotel_image_params).promise();
          const imageUrl = `https://rown-space-bucket.nyc3.digitaloceanspaces.com/hotel_images/${hotel_image.originalname}`;
          // Create an object with image details
          const imageDetails = {
            image_id: hotel_image_id,
            image: imageUrl,
            display_status: '1'
          };
          hotel_images.push(imageDetails);
        }
      }

      // console.log(hotel_images)

      const hotel_id = req.params.hotel_id
      // console.log("request received")
      const { hotel_r_code,
        hotel_auth_code,
        hotel_ezee_code,
        hotel_name,
        room_type_id,
        room_type_name
      } = req.body;

      const findHotel = await Hotel.findOne({ hotel_id: hotel_id })
      if (!findHotel) {
        return res.status(404).json({ error: 'Hotel not found' });
      }

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
      //     error: "Hotel Ezee Code is required"
      //   })
      // }


      // Create and save the property record
      const room_id_and_name = {
        room_type_id,
        room_type_name,
        room_type_pictures: room_type_pictures
      }
      const hotel_images_object = {
        
      }
      // Find the room_details array and append room_id_and_name to it
      findHotel.room_details.push(room_id_and_name);
      findHotel.hotel_images.push(hotel_images);

      // Save the updated hotel record
      await findHotel.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: err
          });
        }

        res.status(200).json({
          message: "Hotel successfully updated",
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