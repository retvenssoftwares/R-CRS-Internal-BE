const AWS = require('aws-sdk');
const s3 = require('../../utils/url');
const multer = require('multer');
const upload = multer();
const Hotel = require("../../models/hotel_model")
const randomstring = require('randomstring');

const upload_hotel = async (req, res) => {



  upload.fields([
    { name: 'hotel_cover_photo', maxCount: 1 },
    { name: 'hotel_images', maxCount: 7 },
    { name: 'room_type_images', maxCount: 4 },
    { name: 'hotel_logo', maxCount: 1 }
  ])(req, res, async (err) => {
    try {
      // Upload hotelImages to DigitalOcean Spaces
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

      // Upload hotellogo to DigitalOcean Spaces
      let hotel_logo_url = '';
      if (req.files['hotel_logo']) {
        const hotel_logo_pic = req.files['hotel_logo'][0];
        const hotel_logo_pic_params = {
          Bucket: 'rown-space-bucket/hotel_logos',
          Key: hotel_logo_pic.originalname,
          Body: hotel_logo_pic.buffer,
          ContentType: hotel_logo_pic.mimetype,
          ACL: 'public-read'
        };
        await s3.upload(hotel_logo_pic_params).promise();
        hotel_logo_url = `https://rown-space-bucket.nyc3.digitaloceanspaces.com/hotel_logos/${hotel_logo_pic.originalname}`;
      }

      let hotel_cover_pic_url = ''
      // Upload hotelCoverpic to DigitalOcean Spaces
      if (req.files['hotel_cover_photo']) {
        const hotel_cover_pic = req.files['hotel_cover_photo'][0];
        const hotel_cover_pic_params = {
          Bucket: 'rown-space-bucket/hotel_cover_pics',
          Key: hotel_cover_pic.originalname,
          Body: hotel_cover_pic.buffer,
          ContentType: hotel_cover_pic.mimetype,
          ACL: 'public-read'
        };
        await s3.upload(hotel_cover_pic_params).promise();
        hotel_cover_pic_url = `https://rown-space-bucket.nyc3.digitaloceanspaces.com/hotel_cover_pics/${hotel_cover_pic.originalname}`;
      }

      // console.log("request received")
      const { hotel_r_code,
        hotel_auth_code,
        hotel_ezee_code,
        hotel_description,
        hotel_name,
        hotel_address_line_1,
        hotel_address_line_2,
        hotel_city,
        hotel_state,
        hotel_country,
        room_type_id,
        room_type_name
      } = req.body;


      if (!hotel_r_code) {
        return res.status(400).json({
          error: "Retvens hotel code is required"
        })
      }

      if (!hotel_auth_code) {
        return res.status(400).json({
          error: "Hotel Ezee Auth Code is required"
        })
      }

      if (!hotel_ezee_code) {
        return res.status(400).json({
          error: "Hotel Ezee Code is required"
        })
      }
      if (!hotel_name) {
        return res.status(400).json({
          error: "Hotel Ezee Code is required"
        })
      }

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
      room_details.push(room_id_and_name)
      const add_hotel = new Hotel({
        hotel_r_code: hotel_r_code,
        hotel_auth_code: hotel_auth_code,
        hotel_ezee_code: hotel_ezee_code,
        hotel_description: hotel_description,
        hotel_images: hotel_images,
        hotel_address_line_1,
        hotel_address_line_2,
        hotel_city,
        hotel_state,
        hotel_country,
        room_details: room_details,
        hotel_name: hotel_name,
        hotel_cover_photo: hotel_cover_pic_url,
        room_details: room_details,
        hotel_logo: hotel_logo_url
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
  })
}

module.exports = upload_hotel