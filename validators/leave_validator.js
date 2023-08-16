const { check } = require('express-validator');

exports.leave_type_validator = [
      check('leave_type')
      .not()
      .isEmpty()
      .withMessage('Please provide type of leave'),
      
      check('leave_limit')
      .not()
      .isEmpty()
      .withMessage('Please provide the number of day person can take leave')
];