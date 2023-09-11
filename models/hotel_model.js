const mongoose = require("mongoose");
const randomstring = require('randomstring')
const { ObjectId } = mongoose.Schema;

const hotelSchema = mongoose.Schema({
    hotel_id: {
        type: mongoose.Types.ObjectId,
        default: mongoose.Types.ObjectId,
        unique: true
    },
    hotel_r_code: {
        type: String,
        default: randomstring.generate(),
        required: true
    },
    djubo_query_key: {
        type: String,
        default: '',
        required: false
    },
    axis_rooms_property_id: {type: String, default: ''},
    djubo_availablility_id: {
        type: String,
        default: '',
        required: false
    },
    pms_type: {
        type: String,
        default: ''
    },
    hotel_ezee_auth_code: {
        type: String,
        default: ''
    },
    hotel_ezee_code: {
        type: String,
        default: ''
    },
    room_details: [{
        room_type_id: { type: String, default: '' },
        room_type_name: { type: String, default: '' },
        room_type_pictures: [{ picture: { type: String, default: '' }, display_status: { type: String, default: '1' }, picture_id: { type: String, default: '' } }],
        rate_type: [{
            rate_type_id: { type: String, default: '' },
            rate_type_name: { type: String, default: '' }
        }],
        rate_plan: [{
            rate_plan_id: { type: String, default: '' },
            rate_plan_name: { type: String, default: '' }
        }]
    }],
    hotel_address_line_1: {
        type: String, default: ''
    },
    hotel_address_line_2: {
        type: String, default: ''
    },
    hotel_city: {
        type: String, default: ''
    },
    hotel_state: {
        type: String, default: ''
    },
    hotel_country: {
        type: String, default: ''
    },
    hotel_name: {
        type: String,
        default: ''
    },
    hotel_description: {
        type: String,
        default: ''
    },
    hotel_images: [{
        image_id: { type: String, default: '' },
        image: { type: String, default: '' },
        display_status: { type: String, default: '1' }
    }],
    hotel_logo: { type: String, default: '' },
    hotel_cover_photo: { type: String, default: '' },
    createdAt: {type: String, default: ''},
    updatedAt: {type: String, default: ''}
}
);

module.exports = mongoose.model('Hotel', hotelSchema);
