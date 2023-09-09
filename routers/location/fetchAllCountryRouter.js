const { Router } = require('express');
const country = require('../../controllers/location/fetchAllCountry');
const app = Router();
app.get('/get/fetchCountry', country);
module.exports = app;