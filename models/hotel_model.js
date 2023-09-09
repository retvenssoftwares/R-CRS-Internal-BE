const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const hotelSchema = mongoose.Schema({
    hotel_id: {
        type: mongoose.Types.ObjectId,
        default: mongoose.Types.ObjectId,
        unique: true
    },
    hotel_r_code: {
        type: String,
        required: true
    },
    hotel_auth_code: {
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
        room_type_pictures: [{ picture: { type: String, default: '' }, display_status: {type: String, default: '1'}, picture_id: {type: String, default: ''} }]
    }],
    hotel_name: {
        type: String,
        default: ''
    },
    hotel_description: {
        type: String,
        default: ''
    },
    hotel_images: [{
        image_id: {type: String, default: ''},
        image: { type: String, default: '' },
        display_status: { type: String, default: '1'}
    }],
    hotel_logo: { type: String, default: '' },
    hotel_cover_photo: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
