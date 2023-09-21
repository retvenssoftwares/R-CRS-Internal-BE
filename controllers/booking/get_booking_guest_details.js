const data = require("../../models/booking_model")

module.exports.getdata = async (req, res) => {

    const guest_mobile = req.query.guest_mobile
    const guest = await data.findOne({ guest_mobile_number: guest_mobile })


    if (guest) {
        res.status(200).send({ guest }) 
        
    }else{
        return res.status(200).json({msg:"data not found"})
    }


        
}



module.exports.postdata = async (req,res)=>{
       const { employee_id ,salutation, guest_first_name, guest_last_name, guest_mobile_number, alternate_contact, email, guest_address_1, guest_address_2, city, state, country, hotel_name, caller_type, callback_time_date, arrival_date, departure_date, purpose_of_travel, date_of_birth, remark, department, disposition } = req.body

        const add = new data({
            employee_id,salutation, guest_first_name, guest_last_name, guest_mobile_number, alternate_contact, email, guest_address_1, guest_address_2, city, state, country, hotel_name, caller_type, callback_time_date, arrival_date, departure_date, purpose_of_travel, date_of_birth, remark, department, disposition
        })
        await add.save()

        return res.status(200).send({msg:"data added sussessfully"})
}