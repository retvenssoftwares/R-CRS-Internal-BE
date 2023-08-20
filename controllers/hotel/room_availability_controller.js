const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const mongoose = require('mongoose');
const Hotel = require("../../models/hotel_model")

module.exports.room_availability =  async (req, res) => {

    const hotel_r_code = req.query.hotel_r_code;
    const check_in_date = req.query.check_in_date;
    const check_out_date = req.query.check_out_date;

    try {
      // Find the hotel details based on the provided hotel name
      const selectedHotel = await Hotel.findOne({ hotel_r_code: hotel_r_code });

      if (!selectedHotel) {
        return res.status(400).json({ error: 'Hotel not found' });
      }
  
  console.log("making request to ezee")
    // Make a request to another API using the JSON request body
    const response = await axios.post(`https://live.ipms247.com/booking/reservation_api/listing.php?request_type=RoomList&HotelCode=${selectedHotel.hotel_ezee_code}&APIKey=${selectedHotel.hotel_auth_code}&check_in_date=${check_in_date}&check_out_date=${check_out_date}`);

    // Return the JSON response from the external API
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'API call failed' });
  }
}