const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const mongoose = require('mongoose');
const Hotel = require("../models/hotel_model")

module.exports.get_transaction =  async (req, res) => {

    const hotel_r_code = req.query.hotel_r_code;
    const transaction_id = req.query.transaction_id;
  
    try {
      // Find the hotel details based on the provided hotel name
      const selectedHotel = await Hotel.findOne({ hotel_r_code: hotel_r_code });

      if (!selectedHotel) {
        return res.status(400).json({ error: 'Hotel not found' });
      }
  
      const requestData = {
        RES_Request: {
          Request_Type: 'GetTransactionDetails',
          TranunkId: transaction_id,
          Authentication: {
            HotelCode: selectedHotel.hotel_ezee_code,
            AuthCode: selectedHotel.hotel_auth_code
          }
        }
      };

      console.log(requestData)
  
    // Make a request to another API using the JSON request body
    const response = await axios.post('https://live.ipms247.com/pmsinterface/pms_connectivity.php', requestData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Return the JSON response from the external API
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'API call failed' });
  }
}