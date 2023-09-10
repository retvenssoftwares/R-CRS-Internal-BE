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
    { name: 'room_type_images' },
    { name: 'hotel_logo', maxCount: 1 }
  ])(req, res, async (err) => {
    try {

      const hotel_id = req.params.hotel_id
      const roomid = req.params.roomid
      const findHotel = await Hotel.findOne({ hotel_id: hotel_id })
      if (!findHotel) {
        return res.status(404).json({ error: 'Hotel not found' });
      }


   
      
      // Find the specific room_details entry within the hotel's room_details array based on room_type_id
   
      
      


  
      
      // try {
      //   // Save the updated document back to the database
      //   await findHotel.save();
      
      //   return res.status(200).json({ message: 'Rate type and rate plan added successfully' });
      // } catch (error) {
      //   // Handle errors here
      //     res.status(500).json({ message: "Internal Server Error" });

      // }
      

      // Upload hotelImages to DigitalOcean Spaces
      // let room_details = [];
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
          findHotel.hotel_images.push(imageDetails);
        }
      }

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
        await Hotel.updateOne({ hotel_id: hotel_id }, { $set: { hotel_logo: hotel_logo_url } });
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
        await Hotel.updateOne({ hotel_id: hotel_id }, { $set: { hotel_cover_photo: hotel_cover_pic_url } });
      }


      // console.log("request received")
      const {
        room_details,
        rate_type_id,
        room_type_id,
        room_type_name,
        rate_type_name,
        rate_plan_id,
        rate_plan_name,
        numberofrates,
        numberofrateplans,
      } = req.body;

      // Create an array to store rate_type objects
      const rateTypes = [];
      for (let i = 0; i < numberofrates; i++) {
        const rate_type_id = req.body[`rate_type_id_${i}`]; // Use dynamic key based on i
        const rate_type_name = req.body[`rate_type_name_${i}`]; // Use dynamic key based on i
        rateTypes.push({ rate_type_id, rate_type_name });
      }

      // Create an array to store rate_plan objects
      const ratePlans = [];
      for (let i = 0; i < numberofrateplans; i++) {
        const rate_plan_id = req.body[`rate_plan_id_${i}`]; // Use dynamic key based on i
        const rate_plan_name = req.body[`rate_plan_name_${i}`]; // This is common for all rate plans
        ratePlans.push({ rate_plan_id, rate_plan_name });
      }

      // Create and save the property record
      const room_id_and_name = {
        room_type_id,
        room_type_name,
        room_type_pictures: room_type_pictures,
        rate_type: rateTypes,
        rate_plan: ratePlans
      }


      // Find the room_details array and append room_id_and_name to it
      // findHotel.room_details.rate_type.push(rate_type);
      findHotel.room_details.push(room_id_and_name);
      // findHotel.hotel_images.push(hotel_images);

      // Save the updated hotel record




          // const hotel_id = req.params.hotel_id;
      // const roomid = req.params.roomid;
      // const findHotel = await Hotel.findOne({ hotel_id: hotel_id });


      
      if (!findHotel) {
        return res.status(404).json({ error: 'Hotel not found' });
      }
      
      // Find the specific room_details entry within the hotel's room_details array based on room_type_id
    
      
      // Iterate over the properties of the roomtype object and push them to the rate_type array
    
      
      // Similarly, iterate over the properties of the rateplan object and push them to the rate_plan array
   




      await findHotel.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: err
          });
        }

        res.status(200).json({
          message: "Hotel successfully updated",
          hotel_id: findHotel.hotel_id
        })
      })
    }
    catch (err) {
      console.log(err)
      return res.status(500).json({ message: "Internal Server Error" });

    }
  })
}

module.exports = upload_room_details