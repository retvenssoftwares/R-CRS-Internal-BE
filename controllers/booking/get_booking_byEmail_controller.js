const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const mongoose = require('mongoose');
const Hotel = require("../../models/hotel_model")

module.exports.get_booking_byEmail =  async (req, res) => {

    const hotel_r_code = req.query.hotel_r_code;
    const email_id = req.query.email_id;

    try {
      // Find the hotel details based on the provided hotel name
      const selectedHotel = await Hotel.findOne({ hotel_r_code: hotel_r_code });

      if (!selectedHotel) {
        return res.status(400).json({ error: 'Hotel not found' });
      }
  
  //console.log("making request to ezee")
    // Make a request to another API using the JSON request body
    const response = await axios.post(`https://live.ipms247.com/booking/reservation_api/listing.php?request_type=BookingList&HotelCode=${selectedHotel.hotel_ezee_code}&APIKey=${selectedHotel.hotel_auth_code}&EmailId=${email_id}`);

    // Return the JSON response from the external API
    // console.log(response)
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'API call failed' });
  }
}