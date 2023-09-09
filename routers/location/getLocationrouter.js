const { Router } = require('express');
const getlocation = require('../../controllers/location/getLocation');
const app = Router();
app.get('/get/location_fetch', getlocation);
module.exports = app;


