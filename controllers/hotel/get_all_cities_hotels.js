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
    const city = req.params.city;

    let hotels;

    if (city && city.trim() !== "") {
      hotels = await Hotel.find({});
     
    } else {
      // If no city is provided or it's an empty string, retrieve all hotels
       hotels = await Hotel.find({ hotel_city: city });
    }

    if (hotels && hotels.length > 0) {
      console.log(`Hotels in ${city || "all cities"} retrieved:`, hotels);
      return res.json(hotels);
    } else {
      console.log(`No hotels found in ${city || "any city"}.`);
      return res.status(404).json({ message: `No hotels found in ${city || "any city"}` });
    }
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


