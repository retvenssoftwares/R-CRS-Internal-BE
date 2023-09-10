const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = require('express')();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const employeeRouter = require("./routers/user/employee_router");
const bookingRouter = require("./routers/booking/booking_router");
const hotelRouter = require("./routers/hotel/hotel_router");
const roomDetailsRouter = require("./routers/hotel/add_room_details_router");
const roomInventoryRouter = require("./routers/hotel/room_inventory_router");
const roomRateRouter = require("./routers/hotel/room_rate_router");
const getBooking = require("./routers/booking/get_booking_router");
const getTransaction = require("./routers/booking/get_transaction_router");
const cancelBooking = require("./routers/booking/cancel_booking_router");
const get_booking_by_email_router = require("./routers/booking/get_booking_by_email_router");
const room_availability_router = require("./routers/hotel/room_availability_router");
const room_type_router = require("./routers/hotel/get_room_types_router");
const get_amenities = require("./routers/hotel/get_ameneties_router");
const get_hotel_info_router = require("./routers/hotel/get_hotel_information_router");
const get_hotel_db_router = require("./routers/hotel/get_hotel_db_router");
const get_booking_db_by_userID = require("./routers/booking/get_booking_db_by_userID_router");
const get_booking_db = require("./routers/booking/get_booking_db_router");
const sendPaymentLinkRouter = require("./routers/payment/send_payment_link_router");
const getPaymentLinkByOrderIDRouter = require("./routers/payment/get_payment_links_by_orderID_router");
const getroomInfo = require("./routers/hotel/room_info_router")
const bookingdetails = require('./routers/user/get_details_of_booking_router')
const top_five_booking = require('./routers/booking/get_top_5_employee_booking_router')
const get_all_hotels = require('./routers/hotel/get_all_hotels')
const get_new_hotels = require('./routers/hotel/get_newly_added_hotels_router')
const get_hotel_by_id = require('./routers/hotel/get_hotel_by_id_router')


//location
const location = require('./routers/location/getLocationrouter');
const countries = require('./routers/location/getAllcountryrouter');
const state = require('./routers/location/getAllstatesrouter');
const cities = require('./routers/location/getAllcitiesrouter');
const fetchcoutries = require('./routers/location/fetchAllCountryRouter');

app.use(cors({origin: "http://localhost:3000"}))
app.use(morgan('dev'));
app.use(bodyParser.json());


app.use("/api", employeeRouter);
app.use("/api", bookingRouter);
app.use("/api", hotelRouter)
app.use("/api", roomInventoryRouter)
app.use("/api", roomRateRouter)
app.use("/api", getBooking)
app.use("/api", getTransaction)
app.use("/api", roomDetailsRouter)
app.use("/api", cancelBooking)
app.use("/api", get_booking_by_email_router)
app.use("/api", room_availability_router)
app.use("/api", room_type_router)
app.use("/api", get_amenities)
app.use("/api", get_hotel_info_router)
app.use("/api", get_hotel_db_router)
app.use("/api", get_booking_db)
app.use("/api", get_booking_db_by_userID)
app.use("/api", sendPaymentLinkRouter)
app.use("/api", getPaymentLinkByOrderIDRouter)
app.use("/api",getroomInfo)
app.use('/api',bookingdetails)
app.use('/api',top_five_booking)
app.use('/api', get_all_hotels)
app.use('/api', get_hotel_by_id)
app.use('/api', get_new_hotels)

//location
app.use('/api',location)
app.use('/api',countries)
app.use('/api',state)
app.use('/api',cities)
app.use('/api',fetchcoutries)

mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to DB'))
    .catch(err => {
        console.log(err, "mongo_error");
    });

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
