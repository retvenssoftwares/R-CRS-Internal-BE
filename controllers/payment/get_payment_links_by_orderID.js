const express = require('express');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');

// Initialize Razorpay with your API keys
const razorpay = new Razorpay({
  key_id: 'rzp_test_YK23h8w35qg13f',
  key_secret: 'oUdXQr6qOEzHH1mD8mi8zV88',
});

// Define a route to create a payment link
module.exports.get_payment_link_by_orderID_controller =  async (req, res) => {
    try {
      const { orderId } = req.params;
  
      // Use the Razorpay SDK to fetch the payment order status
      const paymentOrder = await razorpay.paymentLink.fetch(orderId);
      console.log(paymentOrder)
  
      res.json({ response: paymentOrder });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while checking the payment status' });
    }
};