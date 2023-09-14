const data = require("../../models/booking_model")

module.exports = async(req,res)=>{
    const guest_mobile_number = req.query.guest_mobile_number
    const guest = await data.findOne({guest_mobile_number : guest_mobile_number})

    if(!guest){
        return res.status(500).json({message:"data not found"})

    }

    return res.status(200).json({guest})


}