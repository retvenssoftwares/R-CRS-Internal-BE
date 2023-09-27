const call_pause_model  = require("../../models/pause_call")
const moment = require('moment-timezone');

exports.call_pause = async(req,res)=>{
    const add = new call_pause_model({
        employee_id : req.body.employee_id,
        pause_reason : req.body.pause_reason,
        pause_time : req.body.pause_time,
        resume_time : req.body.resume_time
    })

    await add.save()

    return res.status(200).json({add})
}

exports.get_pause_call = async(req,res)=>{
    const data = await call_pause_model.find({employee_id:req.query.employee_id})
    data.reverse()
    if(!data){
        return res.status(200).json({message : "Data not found"})
    }
    return res.status(200).json({data})
}