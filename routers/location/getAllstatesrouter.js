const { Router } = require('express');
const getstates = require('../../controllers/location/getAllstates');
const app = Router();
app.get('/get/countries/:numeric_code/states', getstates);
module.exports = app;