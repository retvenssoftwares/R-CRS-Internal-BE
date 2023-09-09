//models path
const locations = require('../../models/location')

 module.exports=async (req, res) => {
  try {
    const countries = await locations.find({}, { name: 1,numeric_code:1, _id: 0 }).lean().exec(); 
    // Fetch all country names
    res.status(200).json(countries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
