const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const mongoose = require('mongoose');
const Hotel = require("../../models/hotel_model")

module.exports.retreive_room_rate =  async (req, res) => {

    const hotel_r_code = req.query.hotel_r_code;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
  
    try {
      // Find the hotel details based on the provided hotel name
      const selectedHotel = await Hotel.findOne({ hotel_r_code: hotel_r_code });

      if (!selectedHotel) {
        return res.status(400).json({ error: 'Hotel not found' });
      }
  
      // Construct the XML data to send in the POST request
      const xmlData = `
        <RES_Request>
          <Request_Type>Rate</Request_Type>
          <Authentication>
            <HotelCode>${selectedHotel.hotel_ezee_code}</HotelCode>
            <AuthCode>${selectedHotel.hotel_auth_code}</AuthCode>
          </Authentication>
          <FromDate>${fromDate}</FromDate>
          <ToDate>${toDate}</ToDate>
        </RES_Request>
      `;
      console.log(xmlData)
  
      // Sending POST request with XML data to another server
      const response = await axios.post('https://live.ipms247.com/pmsinterface/getdataAPI.php', xmlData, {
        headers: {
          'Content-Type': 'application/xml'
        }
      });
  
      // Parsing XML response to JSON
      const parser = new xml2js.Parser();
      parser.parseString(response.data, (err, result) => {
        if (err) {
          res.status(500).json({ error: 'XML parsing error' });
        } else {
          res.json(result);
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
}