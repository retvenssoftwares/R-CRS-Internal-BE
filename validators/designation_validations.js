const { check } = require('express-validator');

exports.designation_validator = [
      check('designationName')
      .not()
      .isEmpty()
      .withMessage('Designation name is required'),

];
