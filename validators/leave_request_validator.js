const { check } = require('express-validator');

exports.leave_request_validator = [
      check('leave_type')
      .not()
      .isEmpty()
      .withMessage('Please provide type of leave'),
      
      check('from')
      .not()
      .isEmpty()
      .withMessage('Please provide beigning date of leave'),

      check('to')
      .not()
      .isEmpty()
      .withMessage('Please provide ending date of leave'),

      check('reason')
      .not()
      .isEmpty()
      .withMessage('Please mention the reason of leave'),     
];