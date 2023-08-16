const Booking = require("../models/booking_model")
const Hotel = require("../models/hotel_model")
const axios = require('axios');
const xml2js = require('xml2js');
const mongoose = require('mongoose');


module.exports.create_booking =  async (req, res) => {
    console.log("request received")
    const { hotel_r_code,
            employee_id,
            arrival_date,
            departure_date,
            checkin_time,
            checkout_time,
            room_type,
            rate_plan,
            rate_type,
            rate_plan_id,
            room_type_id,
            rate_type_id,
            base_rate,
            extra_adult_rate,
            extra_child_rate,
            adult_number,
            child_number,
            child_age,
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
            pickup_date,
            drop_date,
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

       try {
        // Find the hotel details based on the provided hotel name
        const selectedHotel = await Hotel.findOne({ hotel_r_code: hotel_r_code });

        if (!selectedHotel) {
          return res.status(400).json({ error: 'Hotel not found' });
        }

        const response = await axios.get(`https://live.ipms247.com/booking/reservation_api/listing.php?request_type=InsertBooking&HotelCode=${selectedHotel.hotel_ezee_code}&APIKey=${selectedHotel.hotel_auth_code}&BookingData={"Room_Details":{"Room_1":{"Rateplan_Id":${rate_plan_id},"Ratetype_Id":${rate_type_id},"Roomtype_Id":${room_type_id},"baserate":${base_rate},"extradultrate":${extra_adult_rate},"extrachildrate":${extra_child_rate},"number_adults":${adult_number},"number_children":${child_number},"ExtraChild_Age":${extra_child_rate},"Title":${guest_title},"First_Name":${guest_first_name},"Last_Name":${guest_last_name},"Gender":${guest_gender},"SpecialRequest":${guest_special_request}}},"check_in_date":"2021-02-22","check_out_date":"2021-02-23","Booking_Payment_Mode":"","Email_Address":"abc@gmail.com","Source_Id":"","MobileNo":"","Address":"","State":"","Country":"","City":"","Zipcode":"","Fax":"","Device":"","Languagekey":"","paymenttypeunkid":""}`);
        console.log(response.data)

        // Check if the response contains an error code
        if (response.data && response.data[0] && response.data[0]['Error Details']) {
          const errorCode = response.data[0]['Error Details']['Error_Code'];

          // Check if the error code matches predefined values
          if (errorCodesToMatch.includes(errorCode)) {
            // Save the JSON response in the database with validation status as failure
            booking_status = "FailBooking"
          }
        }

        const booking = new Booking();
        booking.hotel_r_code = hotel_r_code
        booking.employee_id = employee_id
        booking.arrival_date = arrival_date
        booking.departure_date = departure_date
        booking.checkin_time =checkin_time
        booking.checkout_time = checkout_time
        booking.room_type = room_type
        booking.rate_plan = rate_plan
        booking.rate_type = rate_type
        booking.rate_plan_id = rate_plan_id
        booking.room_type_id = room_type_id
        booking.rate_type_id = rate_type_id
        booking.base_rate = base_rate
        booking.extra_adult_rate = extra_adult_rate
        booking.extra_child_rate = extra_child_rate
        booking.adult_number = adult_number
        booking.child_number = child_number
        booking.child_age = child_age
        booking.guest_title = guest_title
        booking.guest_first_name = guest_first_name
        booking.guest_last_name = guest_last_name
        booking.guest_gender = guest_gender
        booking.guest_mobile_number = guest_mobile_number
        booking.guest_email = guest_email
        booking.guest_special_request = guest_special_request
        booking.guest_address = guest_address
        booking.guest_city =guest_city
        booking.guest_state = guest_state
        booking.guest_country= guest_country
        booking.guest_zip_code= guest_zip_code
        booking.guest_fax = guest_fax
        booking.guest_device = guest_device
        booking.discount = discount
        booking.payment_mode = payment_mode
        booking.billing_instructions = billing_instructions
        booking.payment_id = payment_id
        booking.business_source = business_source
        booking.market_segment = market_segment
        booking.company_name = company_name
        booking.company_address = company_address
        booking.gst_number = gst_number
        booking.special_request = special_request
        booking.reservation_type = reservation_type
        booking.pickup_date = pickup_date
        booking.drop_date = drop_date
        booking.booking_status = booking_status
        booking.employee_id = employee_id
        
          await booking.save((err, result) => {
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