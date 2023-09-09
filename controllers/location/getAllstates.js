

// const locations = require('../../models/location')

// module.exports = async (req, res) => {
//   try {
//     const result = await locations.aggregate([
//       { $match: { numeric_code: req.params.numeric_code } },
//       { $unwind: "$states" },
//       { $group: { _id: null, stateNames: { $push: "$states.name" }, stateCodes: { $push: "$states.state_code" } } },
//       { $project: { _id: 0, states: { $map: { input: "$stateNames", as: "name", in: { name: "$$name", state_code: { $arrayElemAt: [ "$stateCodes", { $indexOfArray: [ "$stateNames", "$$name" ] } ] } } } } } },
//     ]).exec();

//     res.status(200).json(result[0].states);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const locations = require('../../models/location');

module.exports = async (req, res) => {
  try {
    const result = await locations.aggregate([
      { $match: { numeric_code: req.params.numeric_code } },
      { $unwind: "$states" },
      { $group: { _id: null, stateNames: { $push: "$states.name" }, stateCodes: { $push: "$states.state_code" } } },
      {
        $project: {
          _id: 0,
          states: {
            $map: {
              input: "$stateNames",
              as: "name",
              in: {
                name: "$$name",
                state_code: {
                  $arrayElemAt: ["$stateCodes", {
                    $indexOfArray: ["$stateNames", "$$name"]
                  }]
                }
              }
            }
          }
        }
      },
    ]);

    if (result.length > 0 && result[0].states) {
      res.status(200).json(result[0].states);
    } else {
      res.status(404).json({ message: "States not found." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
