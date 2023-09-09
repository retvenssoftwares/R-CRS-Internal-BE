const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
 
    id: { type: Number },
    name: { type: String },
    iso3: { type: String },
    iso2: { type: String },
    numeric_code: { type: String },
    phone_code: { type: String },
    capital: { type: String },
    currency: { type: String },
    currency_name: { type: String },
    currency_symbol: { type: String },
    tld: { type: String },
    native: { type: String },
    region: { type: String },
    subregion: { type: String },
    timezones: [{
      zoneName: { type: String },
      gmtOffset: { type: Number },
      gmtOffsetName: { type: String },
      abbreviation: { type: String },
      tzName: { type: String }
    }],
    translations: {
      kr: { type: String },
      pt: { type: String },
      nl: { type: String },
      hr: { type: String },
      fa: { type: String },
      de: { type: String },
      es: { type: String },
      fr: { type: String },
      ja: { type: String },
      it: { type: String },
      cn: { type: String },
      tr: { type: String }
    },
    latitude: { type: String },
    longitude: { type: String },
    emoji: { type: String },
    emojiU: { type: String },
    states: [{
      id: { type: Number },
      name: { type: String },
      state_code: { type: String },
      latitude: { type: String },
      longitude: { type: String },
      type: { type: String },
      cities: [{
        id: { type: Number },
        name: { type: String },
        latitude: { type: String },
        longitude: { type: String }
      }]
    }]
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;