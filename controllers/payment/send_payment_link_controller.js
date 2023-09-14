const express = require('express');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');

// Initialize Razorpay with your API keys
const razorpay = new Razorpay({
  key_id: 'rzp_test_YK23h8w35qg13f',
  key_secret: 'oUdXQr6qOEzHH1mD8mi8zV88',
});


// Define a route to create a payment link
module.exports.send_payment_link_controller = async (req, res) => {
  try {
    const {
      amount,
      currency,
      description,
      first_name,
      last_name,
      address_line_1,
      address_line_2,
      email,
      contact,
      callback_url,
      policy_name,
      sms_status,
      email_status,
      whatsapp_status
    } = req.body;

    // console.log(callback_url)
    const paymentLinkOptions = {
      amount: amount * 100, // Amount in paise
      currency,
      accept_partial: false,
      first_min_partial_amount: 0,
      description,
      customer: {
        first_name,
        last_name,
        address_line_1,
        address_line_2,
        email,
        contact,
      },
      notify: {
        sms: sms_status,
        email: email_status,
        whatsapp: whatsapp_status,
      },
      reminder_enable: true,
      notes: {
        policy_name: policy_name,
      },
      callback_url: callback_url,
      callback_method: "get",
    };

    const paymentLink = await razorpay.paymentLink.create(paymentLinkOptions);
    console.log(paymentLink)
    res.json({ paymentLink });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the payment link' });
  }
};
