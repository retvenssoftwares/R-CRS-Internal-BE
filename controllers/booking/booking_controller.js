const Booking = require("../../models/booking_model");
const ezze_booking_details = require('../../models/ezee_booking_details')
const Hotel = require("../../models/hotel_model");
const emp = require('../../models/employee_model')
const axios = require("axios");
const xml2js = require("xml2js");
const mongoose = require("mongoose");
const FormData = require('form-data');
const { response } = require("express");

module.exports.create_booking = async (req, res) => {
  //const newBooking = new Booking(req.body);

  // guest details

  const {
    hotel_r_code,
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
  } = req.body;






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

  // ezee booking data

  const {
    Rateplan_Id,
    Ratetype_Id,
    Roomtype_Id,
    baserate,
    extradultrate,
    extrachildrate,
    number_adults,
    number_children,
    ExtraChild_Age,
    Title,
    First_Name,
    Last_Name,
    Gender,
    SpecialRequest,

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
    paymenttypeunkid } = req.body




  const data = new ezze_booking_details({

    Room_Details:
    {
      Room_1:
      {
        Rateplan_Id,
        Ratetype_Id,
        Roomtype_Id,
        baserate,
        extradultrate,
        extrachildrate,
        number_adults,
        number_children,
        ExtraChild_Age,
        Title,
        First_Name,
        Last_Name,
        Gender,
        SpecialRequest
      },
   
    Room_2: {
      Rateplan_Id,
      Ratetype_Id,
      Roomtype_Id,
      baserate,
      extradultrate,
      extrachildrate,
      number_adults,
      number_children,
      ExtraChild_Age,
      Title,
      First_Name,
      Last_Name,
      Gender,
      SpecialRequest
    },
  },
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
    paymenttypeunkid

  })

  await data.save()


  const selectedHotel = await Hotel.findOne({ hotel_r_code: hotel_r_code });

  //const data2 = {"Room_Details":{"Room_1":{"Rateplan_Id": "1872700000000000001","Ratetype_Id": "1872700000000000001","Roomtype_Id": "1872700000000000001","baserate":"2000,2000","extradultrate":"500,500","extrachildrate":"500,500","number_adults":"1","number_children":"0","ExtraChild_Age":"0","Title":"Mr","First_Name":"Aman","Last_Name":"Sharma","Gender":"Male","SpecialRequest":""}},"check_in_date":"2023-09-16","check_out_date":"2023-09-18","Booking_Payment_Mode":"Offline","Email_Address":"amandecembersharma@gmail.com","Source_Id":"","MobileNo":"+918563919033","Address":"4/10 new mig w block keshav nagar","State":"Uttar Pradesh","Country":"India","City":"Kanpur","Zipcode":"208014","Languagekey":"en","paymenttypeunkid":""}
  const formData = new FormData();
  const stringBody = JSON.stringify(data)
  formData.append('BookingData', stringBody)

  const config = {
    method: 'post',
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
      lang_key: responseData.lang_key
    })
    await savedata.save()
    console.log('Response:', responseData);
    return res.status(200).json({ responseData });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  //await data.save()







};



