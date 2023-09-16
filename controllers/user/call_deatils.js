const data = require('../../models/call_details');
const guest_details = require('../../models/booking_model');

module.exports = async (req, res) => {
  const add = new data({
    device_type: req.body.device_type,
    calls_details: req.body.calls_details,
  });

  const adddata = await add.save()
  res.status(200).json(adddata)

  const user = await guest_details .findOne({guest_id : adddata.calls_details[0].guest_id})
  if (!user) {
    return res.status(404).json({ msg: "Guest not found" });
  }

  // Add the call_id to the beginning of the call_details array
  user.calls_details.unshift({ call_id: adddata.call_id });

  // Save the modified guest document
  await user.save();

  return res.status(200).json({ msg: "Data added successfully" });
};