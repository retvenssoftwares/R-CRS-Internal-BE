
// models path
const locations = require('../../models/location');

module.exports = async (req, res) => {
  try {
    const stateCode = req.params.state_code;

    const result = await locations.aggregate([
      { $match: { "states.state_code": stateCode } },
      { $unwind: "$states" },
      { $match: { "states.state_code": stateCode } },
      { $unwind: "$states.cities" },
      { $project: { _id: 0, cities: "$states.cities" } }
    ]).exec();

    const cities = result.map(item => item.cities);

    res.status(200).json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

