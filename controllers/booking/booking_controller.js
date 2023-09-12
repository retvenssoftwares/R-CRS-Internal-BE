const Booking = require("../../models/booking_model");
const ezze_booking_details = require("../../models/ezee_booking_details");
const Hotel = require("../../models/hotel_model");
const emp = require("../../models/employee_model");
const axios = require("axios");
const xml2js = require("xml2js");
const mongoose = require("mongoose");
const FormData = require("form-data");
const { response } = require("express");

module.exports.create_booking = async (req, res) => {
  const {
    hotel_r_code,
    employee_id,
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
    reservation_type,
    made_by,
    Room_Details,
    check_in_date,
    check_out_date,
    Booking_Payment_Mode,
    Email_Address,
    Source_Id,
    MobileNo,
    Address,
    State,
    Country,
    City,
    Zipcode,
    Languagekey,
    paymenttypeunkid,

  } = req.body;

  // additional data is use for preparing valid json for ezee

  const additionalData = {
    check_in_date: check_in_date,
    check_out_date: check_out_date,
    Booking_Payment_Mode: Booking_Payment_Mode,
    Email_Address: Email_Address,
    Source_Id: Source_Id,
    MobileNo: MobileNo,
    Address: Address,
    State: State,
    Country: Country,
    City: City,
    Zipcode: Zipcode,
    Languagekey: Languagekey,
    paymenttypeunkid: paymenttypeunkid,
  };

  const errorCodesToMatch = [
    " HotelCodeEmpty",
    "NORESACC",
    "UNAUTHREQ",
    "-1",
    "APIACCESSDENIED",
    "ParametersMissing",
    "InvalidData",
  ];
  var booking_status = "";

  const rooms = [];

  // Loop through the rooms in Room_Details and create Room objects
  for (const roomKey in Room_Details) {
    if (Room_Details.hasOwnProperty(roomKey)) {
      const room = Room_Details[roomKey];
      rooms.push({
        Rateplan_Id: room.Rateplan_Id,
        Ratetype_Id: room.Ratetype_Id,
        Roomtype_Id: room.Roomtype_Id,
        baserate: room.baserate,
        extradultrate: room.extradultrate,
        extrachildrate: room.extrachildrate,
        number_adults: room.number_adults,
        number_children: room.number_children,
        ExtraChild_Age: room.ExtraChild_Age,
        Title: room.Title,
        First_Name: room.First_Name,
        Last_Name: room.Last_Name,
        Gender: room.Gender,
        SpecialRequest: room.SpecialRequest,
      });
    }
  }

 

  // this function will convert the rooms array into transformedRooms object
  const transformedRooms = {};
  rooms.forEach((room, index) => {
    const roomKey = `Room_${index + 1}`;
    transformedRooms[roomKey] = room;
  });

  // Create the final object by merging transformedRooms and additionalData
  const finalObject = { Room_Details: transformedRooms, ...additionalData };


  const selectedHotel = await Hotel.findOne({ hotel_r_code: hotel_r_code });

  
  const formData = new FormData();
  const stringBody = JSON.stringify(finalObject);
  formData.append("BookingData", stringBody);

  const config = {
    method: "post",
    url: `https://live.ipms247.com/booking/reservation_api/listing.php?request_type=InsertBooking&HotelCode=${selectedHotel.hotel_ezee_code}&APIKey=${selectedHotel.hotel_ezee_auth_code}`,
    headers: {
      ...formData.getHeaders(), // Set the Content-Type header to multipart/form-data
    },
    data: formData, // Set the FormData object as the request body
  };

  // Send the POST request
  try {
    const response = await axios(config);
    const responseData = response.data;
    const savedata = new Booking({
      hotel_r_code,
      employee_id,
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
      made_by,
      discount,
      payment_mode,
      billing_instructions,
      payment_id,
      business_source,
      market_segment,
      company_name,
      company_address,
      gst_number,
      guest_special_request,
      reservation_type,
      reservation_number: responseData.ReservationNo,
      Inventory_Mode: responseData.Inventory_Mode,
      lang_key: responseData.lang_key,
      subReservation_no : responseData.SubReservationNo
    });
    let successful_booking = await savedata.save();
    const ezzeBookingDetails = new ezze_booking_details({
      Room: rooms.map((room) => ({
        Rateplan_Id: room.Rateplan_Id,
        Ratetype_Id: room.Ratetype_Id,
        Roomtype_Id: room.Roomtype_Id,
        baserate: room.baserate,
        extradultrate: room.extradultrate,
        extrachildrate: room.extrachildrate,
        number_adults: room.number_adults,
        number_children: room.number_children,
        ExtraChild_Age: room.ExtraChild_Age,
        Title: room.Title,
        First_Name: room.First_Name,
        Last_Name: room.Last_Name,
        Gender: room.Gender,
        SpecialRequest: room.SpecialRequest,
      })),
  
      Check_in_out_details: {
        check_in_date: check_in_date,
        check_out_date: check_out_date,
        Booking_Payment_Mode: Booking_Payment_Mode,
        Email_Address: Email_Address,
        Source_Id: Source_Id,
        MobileNo: MobileNo,
        Address: Address,
        State: State,
        Country: Country,
        City: City,
        Zipcode: Zipcode,
        Languagekey: Languagekey,
        paymenttypeunkid: paymenttypeunkid,
        booking_id : successful_booking.booking_id,
        ezee_reservation_no : responseData.ReservationNo,
        subReservation_no : responseData.SubReservationNo
      },
    });
  
    await ezzeBookingDetails.save();
    console.log("Response:", responseData);

    if (successful_booking) {
      await Booking.updateOne(
        { booking_id: savedata.booking_id },
        { $set: { booking_status: "ConfirmBooking" } }
      );
      return res.status(200).json({ responseData });
    }
  } catch (error) {
    console.error("Error:", error);
    await Booking.updateOne(
      { booking_id: savedata.booking_id },
      { $set: { booking_status: "FailBooking" } }
    );
    return res.status(500).json({ error: "Internal Server Error" });
  }

  
};
