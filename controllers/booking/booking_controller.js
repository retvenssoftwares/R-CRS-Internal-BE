const Booking = require("../../models/booking_model")
const Hotel = require("../../models/hotel_model")
const axios = require('axios');
const xml2js = require('xml2js');
const mongoose = require('mongoose');


module.exports.create_booking =  async (req, res) => {
  
    //const newBooking = new Booking(req.body);

      const{   
      hotel_r_code,
      employee_id,
      departure_date,
      arrival_date,
      checkin_time,
      checkout_time,
      roomTypes,
      guest_title,
      guest_first_name,
      guest_last_name,
      guest_gender,
      guest_mobile_number,
      guest_email,
      guest_special_request,
      guest_address,
      guest_city,
      guest_state,
      guest_country,
      guest_zip_code,
      guest_fax,
      guest_device,
      discount,
      payment_mode,
      billing_instructions,
      payment_id,
      business_source,
      market_segment,
      company_name,
      company_address,
      gst_number,
      special_request,
      reservation_type,
      made_by,
      booking_source,
      total_price,
      room_nights,
      } = req.body;

          const errorCodesToMatch = [
            "HotelCodeEmpty",
            "NORESACC",
            "UNAUTHREQ",
            "-1",
            "APIACCESSDENIED",
            "ParametersMissing",
            "InvalidData"
          ];
          var booking_status = ""

          const data = {
            "Room_Details": {
              "Room_1": {
                "Rateplan_Id": "[RATEPLAN_ID]", /* Mandatory */
                "Ratetype_Id": "[RATETYPE_ID]", /* Mandatory */
                "Roomtype_Id": "[ROOMTYPE_ID]", /* Mandatory */
                "baserate": "[BASERATE]", /* Mandatory */
                "extradultrate": "[EXTRADULTRATE]", /* Mandatory */
                "extrachildrate": "[EXTRACHILDRATE]", /* Mandatory */
                "number_adults": "[NUMBER_ADULTS]", /* Mandatory */
                "number_children": "[NUMBER_CHILDREN]", /* Mandatory */
                "ExtraChild_Age": "[EXTRACHILD_AGE]", /* Mandatory if number_children is not zero*/
                
                // "Package_Details": { /* If package is booked then only pass below details and for package otherwise ignore :*/
                //   "Package_Id": "[PACKAGE_ID]", /* Mandatory */
                //   "Package_Name": "[PACKAGE_NAME]", /* Mandatory */
                //   "Package_Description": "PACKAGE_DESCRIPTION"
                // },
                // "Promotion_Details": { /* If room is booked using promotional code then only pass below details and for promotion otherwise ignore: */
                //   "Promotional_Code": "[PROMOTIONAL_CODE]", /* Mandatory */
                //   "Promotion_Id": "[PROMOTION_ID]", /* Mandatory */
                //   "Promotion_Name": "[PROMOTION_NAME]", /* Mandatory */
                //   "Promotion_Description": "[PROMOTION_DESCRIPTION]"
                // },
                "Title": "[TITLE]",
                "First_Name": "[FIRST_NAME]", /* Mandatory */
                "Last_Name": "[LAST_NAME]", /* Mandatory */
                "Gender": "[GENDER]",
                "SpecialRequest": "[SPECIALREQUEST]"
              },
             
            },
            // "ExtraCharge": { /* This will be useful when various Extra Charges exist in system and booker take any extra charge in booking. */
            //   "Extra_1": {
            //     "ExtraChargeId": "[EXTRACHARGEID]", /* Mandatory */
            //     "ChargeAdult": "[CHARGEADULT]" /* Mandatory */
            //   },
            //   "Extra_2": {
            //     "ExtraChargeId": "[EXTRACHARGEID]",
            //     "ChargeChild": "[CHARGECHILD]"
            //   },
            // },
            "CardDetails": { /* All below parameters related to CardDetails are mandatory for inserting card details in transaction. If any of the below listed parameter is missing card details won’t be added in transaction. */
              "cc_cardnumber": "[CC_CARDNUMBER]",
              "cc_cardtype": "[CC_CARDTYPE]",
              "cc_expiremonth": "[CC_EXPIREMONTH]",
              "cc_expireyear": "[CC_EXPIERYEAR]",
              "cvvcode": "[CVVCODE]",
              "cardholdername": "[CARDHOLDERNAME]"
            },
            "check_in_date": "[CHECK_IN_DATE]", /* Mandatory */
            "check_out_date": "[CHECK_OUT_DATE]", /* Mandatory */
            "Booking_Payment_Mode": "[BOOKING_PAYMENT_MODE]",
            "Email_Address": "[EMAIL_ADDRESS]", /* Mandatory */
            "Source_Id": "[SOURCE_ID]",
            "MobileNo": "[MOBILENO]",
            "Address": "[ADDRESS]",
            "State": "STATE",
            "Country": "[COUNTRY]",
            "City": "[CITY]",
            "Zipcode": "[ZIPCODE]",
            "Fax": "[FAX]",
            "Device": "[DEVICE]",
            "Languagekey": "[LANGUAGEKEY]",
            "paymenttypeunkid": "[PAYMENTGATEWAY_ID]"
          }

          const ezee = JSON.stringify(data)
          

       try {
        // Find the hotel details based on the provided hotel name
        const selectedHotel = await Hotel.findOne({ hotel_r_code: hotel_r_code });

        if (!selectedHotel) {
          return res.status(400).json({ error: 'Hotel not found' });
        }


        const response = await axios.get(`https://live.ipms247.com/booking/reservation_api/listing.php?request_type=InsertBooking&HotelCode=${selectedHotel.hotel_ezee_code}&APIKey=${selectedHotel.hotel_auth_code}&BookingData=[${ezee}]`);
        console.log(response.data)

        // Check if the response contains an error code
        if (response.data && response.data[0] && response.data[0]['Error Details']) {
          const errorCode = response.data[0]['Error Details']['Error_Code'];
          

          // Check if the error code matches predefined values
          if (errorCodesToMatch.includes(errorCode)) {
            // Save the JSON response in the database with validation status as failure
            booking_status = "Fail Booking"
          }
        }

        // const booking = new Booking();
        // booking.hotel_r_code = hotel_r_code
        // booking.employee_id = employee_id
        // booking.arrival_date = arrival_date
        // booking.departure_date = departure_date
        // booking.checkin_time =checkin_time
        // booking.checkout_time = checkout_time
        // booking.room_type = room_type
        // booking.rate_plan = rate_plan
        // booking.rate_type = rate_type
        // booking.rate_plan_id = rate_plan_id
        // booking.room_type_id = room_type_id
        // booking.rate_type_id = rate_type_id
        // booking.base_rate = base_rate
        // booking.extra_adult_rate = extra_adult_rate
        // booking.extra_child_rate = extra_child_rate
        // booking.adult_number = adult_number
        // booking.child_number = child_number
        // booking.child_age = child_age
        // booking.guest_title = guest_title
        // booking.guest_first_name = guest_first_name
        // booking.guest_last_name = guest_last_name
        // booking.guest_gender = guest_gender
        // booking.guest_mobile_number = guest_mobile_number
        // booking.guest_email = guest_email
        // booking.guest_special_request = guest_special_request
        // booking.guest_address = guest_address
        // booking.guest_city =guest_city
        // booking.guest_state = guest_state
        // booking.guest_country= guest_country
        // booking.guest_zip_code= guest_zip_code
        // booking.guest_fax = guest_fax
        // booking.guest_device = guest_device
        // booking.discount = discount
        // booking.payment_mode = payment_mode
        // booking.billing_instructions = billing_instructions
        // booking.payment_id = payment_id
        // booking.business_source = business_source
        // booking.market_segment = market_segment
        // booking.company_name = company_name
        // booking.company_address = company_address
        // booking.gst_number = gst_number
        // booking.special_request = special_request
        // booking.reservation_type = reservation_type
        // booking.pickup_date = pickup_date
        // booking.drop_date = drop_date
        // booking.booking_status = booking_status
     
        const booked = new Booking({
          hotel_r_code,
          employee_id,
          departure_date,
          arrival_date,
          checkin_time,
          checkout_time,
          roomTypes,
          guest_title,
          guest_first_name,
          guest_last_name,
          guest_gender,
          guest_mobile_number,
          guest_email,
          guest_special_request,
          guest_address,
          guest_city,
          guest_state,
          guest_country,
          guest_zip_code,
          guest_fax,
          guest_device,
          discount,
          payment_mode,
          billing_instructions,
          payment_id,
          business_source,
          market_segment,
          company_name,
          company_address,
          gst_number,
          special_request,
          reservation_type,
          //booking_status,
          made_by,
          booking_source,
          total_price,
          room_nights,
        })
        
        await booked.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
  
            res.status(200).json({
              message:"New booking successfully created",
              booking: result
            })
        })
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'API call failed' });
      }
  }


//   const mongoose = require('mongoose');

// const roomSchema = new mongoose.Schema({
//   Rateplan_Id: { type: String, required: true },
//   Ratetype_Id: { type: String, required: true },
//   Roomtype_Id: { type: String, required: true },
//   baserate: { type: String, required: true },
//   extradultrate: { type: String, required: true },
//   extrachildrate: { type: String, required: true },
//   number_adults: { type: String, required: true },
//   number_children: { type: String, required: true },
//   ExtraChild_Age: { type: String },
//   Package_Details: {
//     Package_Id: { type: String, required: true },
//     Package_Name: { type: String, required: true },
//     Package_Description: { type: String },
//   },
//   Promotion_Details: {
//     Promotional_Code: { type: String, required: true },
//     Promotion_Id: { type: String, required: true },
//     Promotion_Name: { type: String, required: true },
//     Promotion_Description: { type: String, required: true },
//   },
//   Title: { type: String },
//   First_Name: { type: String, required: true },
//   Last_Name: { type: String, required: true },
//   Gender: { type: String },
//   SpecialRequest: { type: String },
// });

// const extraChargeSchema = new mongoose.Schema({
//   ExtraChargeId: { type: String, required: true },
//   ChargeAdult: { type: String, required: true },
//   ChargeChild: { type: String },
// });

// const bookingSchema = new mongoose.Schema({
//   Room_Details: [
//     {
//       room: roomSchema,
//     },
//   ],
//   ExtraCharge: [
//     {
//       extraCharge: extraChargeSchema,
//     },
//   ],
//   // ... other fields ...

//   check_in_date: { type: String, required: true },
//   check_out_date: { type: String, required: true },
//   // ... other fields ...
// });

// module.exports = mongoose.model('Booking', bookingSchema);
