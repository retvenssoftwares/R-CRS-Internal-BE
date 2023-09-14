const Hotel = require("../../models/hotel_model");

module.exports.city = async (req, res) => {
  try {
    const cities = await Hotel.distinct("hotel_city");

    return res.json(cities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


module.exports.hotel_city = async (req, res) => {
  try {
    

    const city  = req.params.city
    const hotel = await Hotel.find({hotel_city : city});

    if (hotel.length === 0) {
      console.log("No hotels found in the city:", city);
      let all_hotels = await Hotel.find({});
      return res.json(all_hotels);
    }else{
      return res.status(200).json(hotel)
    }

    
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


