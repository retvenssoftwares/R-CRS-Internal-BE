const Hotel = require("../../models/hotel_model");
const reports_model = require('../../models/reports_model');

module.exports = async (req, res) => {
    try{
        const hotel_reports = await reports_model.find({})
        if (!hotel_reports) {
            return res.status(404).json({
              message: 'Error fetching reports'
            });
          }
          res.status(200).json([{
             hotel_reports
          }]);
    }catch(e){
        console.log(e)
        return res.status(500).json({message: 'Internal Server Error'})
    }
}