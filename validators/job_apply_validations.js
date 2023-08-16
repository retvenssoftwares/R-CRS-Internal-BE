
const { check } = require('express-validator');
exports.job_apply_validator = [
    check('applicant_name')
      .not()
      .isEmpty()
      .withMessage('Please provide your name'),
    check('email')
      .not()
      .isEmpty()
      .withMessage('Please provide your email'),
    check('phone_number')
      .not()
      .isEmpty()
      .withMessage('Please provide your phone number'),
    check('resume')
      .not()
      .isEmpty()
      .withMessage('Please upload you resume')

    ]