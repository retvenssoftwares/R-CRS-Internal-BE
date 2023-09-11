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
  //const newBooking = new Booking(req.body);

  // guest details
  //                  const hotel_r_code = req.params.hotel_r_code

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

  // const {

  //   Rateplan_Id,
  //   Ratetype_Id,
  //   Roomtype_Id,
  //   baserate,
  //   extradultrate,
  //   extrachildrate,
  //   number_adults,
  //   number_children,
  //   ExtraChild_Age,
  //   Title,
  //   First_Name,
  //   Last_Name,
  //   Gender,
  //   SpecialRequest,

  //   check_in_date,
  //   check_out_date,
  //   Booking_Payment_Mode,
  //   Email_Address,
  //   Source_Id,
  //   MobileNo ,
  //   Address ,
  //   State,
  //   Country ,
  //   City,
  //   Zipcode,
  //   Languagekey,
  //   paymenttypeunkid} = req.body

  //   const data = {

  //     Room_Details:
  //    {Room_1:
  //       { Rateplan_Id :Rateplan_Id,
  //         Ratetype_Id :Ratetype_Id,
  //         Roomtype_Id : Roomtype_Id,
  //         baserate : baserate,
  //         extradultrate :extradultrate,
  //         extrachildrate :extrachildrate,
  //         number_adults :number_adults,
  //         number_children :number_children,
  //         ExtraChild_Age :ExtraChild_Age,
  //         Title : Title,
  //         First_Name : First_Name ,
  //         Last_Name : Last_Name,
  //         Gender : Gender,
  //         SpecialRequest : SpecialRequest
  //     },

  //   },
  //   check_in_date :check_in_date,
  //     check_out_date : check_out_date,
  //     Booking_Payment_Mode : Booking_Payment_Mode,
  //     Email_Address:Email_Address,
  //     Source_Id:Source_Id,
  //     MobileNo :MobileNo,
  //     Address:Address ,
  //     State :State,
  //     Country  : Country,
  //     City : City,
  //     Zipcode :Zipcode,
  //     Languagekey :Languagekey,
  //     paymenttypeunkid :paymenttypeunkid

  // }

  // console.log(data)

  // await data.save()
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


  
const additionalData = {
  check_in_date: '2023-09-25',
  check_out_date: '2023-09-27',
  Booking_Payment_Mode: 'Offline',
  Email_Address: 'amandecembersharma@gmail.com',
  Source_Id: '',
  MobileNo: '+918563919033',
  Address: '4/10 new mig w block keshav nagar',
  State: 'Uttar Pradesh',
  Country: 'India',
  City: 'Kanpur',
  Zipcode: '208014',
  Languagekey: 'en',
  paymenttypeunkid: ''
};

  const data1 = new ezze_booking_details({
    Room:[{
      Rateplan_Id :rooms.Rateplan_Id,
      Ratetype_Id :rooms.Ratetype_Id,
      Roomtype_Id :rooms.Roomtype_Id ,
      baserate :rooms.baserate,
      extradultrate :rooms.extradultrate,
      extrachildrate :rooms.extrachildrate,
      number_adults :rooms.number_adults,
      number_children :rooms.number_children,
      ExtraChild_Age :rooms.ExtraChild_Age,
      Title :rooms.Title,
      First_Name :rooms.First_Name,
      Last_Name :rooms.Last_Name,
      Gender :rooms.Gender,
      SpecialRequest :rooms.SpecialRequest

    }],

    ///sab me req.body likhna h
    check_in_date :req.body.check_in_date,
    check_out_date :rooms.check_out_date,
    Booking_Payment_Mode :rooms.Booking_Payment_Mode,
    Email_Address :rooms. Email_Address,
    Source_Id :rooms.Source_Id,
    MobileNo  :rooms.MobileNo,
    Address :rooms.Address ,
    State :rooms.State,
    Country  :rooms.Country,
    City :rooms.City,
    Zipcode  :rooms.Zipcode,
    Languagekey  :rooms.Languagekey,
    paymenttypeunkid :rooms.paymenttypeunkid

  })

  await data1.save()
  //console.log(rooms);

  const transformedRooms = {};
  rooms.forEach((room, index) => {
    const roomKey = `Room_${index + 1}`;
    transformedRooms[roomKey] = room;
  });
  
  // Create the final object by merging transformedRooms and additionalData
  const finalObject = { Room_Details: transformedRooms, ...additionalData };

  console.log(finalObject);

  const selectedHotel = await Hotel.findOne({ hotel_r_code: hotel_r_code });

  //const data2 = {"Room_Details":{"Room_1":{"Rateplan_Id": "1872700000000000001","Ratetype_Id": "1872700000000000001","Roomtype_Id": "1872700000000000001","baserate":"2000,2000","extradultrate":"500,500","extrachildrate":"500,500","number_adults":"1","number_children":"0","ExtraChild_Age":"0","Title":"Mr","First_Name":"Aman","Last_Name":"Sharma","Gender":"Male","SpecialRequest":""}},"check_in_date":"2023-09-16","check_out_date":"2023-09-18","Booking_Payment_Mode":"Offline","Email_Address":"amandecembersharma@gmail.com","Source_Id":"","MobileNo":"+918563919033","Address":"4/10 new mig w block keshav nagar","State":"Uttar Pradesh","Country":"India","City":"Kanpur","Zipcode":"208014","Languagekey":"en","paymenttypeunkid":""}
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
    });
    await savedata.save();
    console.log("Response:", responseData);
    return res.status(200).json({ responseData });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }

  //await data.save()
};
