const call_pause_model  = require("../../models/pause_call")
const moment = require('moment-timezone');

exports.call_pause = async(req,res)=>{

    const now = moment().tz('Asia/Kolkata'); // Get current time in Kolkata timezone
    const formattedTimestamp = now.format('DD-MM-YYYY hh:mm a');

    const add = new call_pause_model({
        pause_reason : req.body.pause_reason,
        pause_time : formattedTimestamp,
        resume_time : formattedTimestamp
    })

    await add.save()

    return res.status(200).json({add})
}

